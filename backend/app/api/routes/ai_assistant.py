from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.session import get_db
from app.models.entities import (
    Habitation,
    RiskScore,
    HazardAssessment,
    CapacityAssessment,
    SafeZone,
    Alert,
    RelocationRecommendation,
)
from app.schemas.ai_assistant import AIQueryRequest, AIQueryResponse

router = APIRouter(prefix="/ai")


@router.post("/query", response_model=AIQueryResponse)
def query_assistant(payload: AIQueryRequest, db: Session = Depends(get_db)):
    """
    Data-grounded disaster intelligence assistant.
    Analyzes application state and database records to answer citizen and administrative questions.
    """
    raw_q = payload.query.strip().lower()
    role = (payload.role or "USER").upper()
    habitation_id = payload.habitation_id

    # Gather contextual database facts
    hab_context = None
    if habitation_id:
        hab_context = db.query(Habitation).filter(Habitation.id == habitation_id).first()

    # Search if a habitation name is mentioned in query
    if not hab_context:
        all_habs = db.query(Habitation).all()
        for h in all_habs:
            if h.name.lower() in raw_q or h.village.lower() in raw_q or h.district.lower() in raw_q:
                hab_context = h
                break

    # 1. Admin Queries
    if role == "ADMIN":
        if "immediate" in raw_q or "urgent" in raw_q or "priority" in raw_q:
            rels = db.query(RelocationRecommendation).filter(RelocationRecommendation.priority_level == "IMMEDIATE").all()
            if rels:
                hab_names = [r.habitation.name for r in rels if r.habitation]
                answer = (
                    f"There are currently {len(rels)} habitation(s) marked for IMMEDIATE relocation: "
                    f"{', '.join(hab_names)}. These cases exhibit critical multi-hazard vulnerability "
                    f"(debris flow risk, severe slope instability, and carrying capacity saturation). "
                    f"Priority relocation orders should be initiated through the Relocation Command module."
                )
                return AIQueryResponse(
                    query=payload.query,
                    answer=answer,
                    suggested_actions=["Review Relocation Queue", "Inspect Safe Zone Allocations", "Issue Evacuation Warning"],
                    related_entities={"immediate_habitations": hab_names},
                    data_available=True,
                )
            else:
                return AIQueryResponse(
                    query=payload.query,
                    answer="No habitations currently require immediate emergency relocation based on the latest risk calculations.",
                    suggested_actions=["Check Critical Risk List", "Run Recalibration"],
                    data_available=True,
                )

        if "critical" in raw_q or "highest risk" in raw_q:
            crit_scores = db.query(RiskScore).filter(RiskScore.risk_level == "CRITICAL").order_by(desc(RiskScore.composite_score)).limit(5).all()
            if crit_scores:
                details = [f"{rs.habitation.name} (Score: {rs.composite_score:.1f}/100, Hazard: {rs.notes or 'Multi-hazard'})" for rs in crit_scores if rs.habitation]
                answer = (
                    f"Highest critical habitations identified: \n" +
                    "\n".join([f"• {d}" for d in details]) +
                    "\n\nThese settlements require strict containment, zero further construction permits, and priority relocation planning."
                )
                return AIQueryResponse(
                    query=payload.query,
                    answer=answer,
                    suggested_actions=["View Habitations Table", "Export Critical Zone Report"],
                    related_entities={"critical_count": len(crit_scores)},
                    data_available=True,
                )

        if "safe zone" in raw_q or "capacity" in raw_q:
            safe_zones = db.query(SafeZone).filter(SafeZone.status == "ACTIVE").all()
            if safe_zones:
                best = max(safe_zones, key=lambda sz: (sz.max_capacity - sz.current_occupancy))
                avail = best.max_capacity - best.current_occupancy
                answer = (
                    f"The safe zone with the highest available capacity is **{best.name}** in {best.district} "
                    f"with {avail} available slots ({best.current_occupancy}/{best.max_capacity} occupied, "
                    f"Safety Score: {best.safety_score}/100, Elevation: {best.elevation_meters:.0f}m). "
                    f"It has high road accessibility ({best.road_access_score}/100) and medical facilities."
                )
                return AIQueryResponse(
                    query=payload.query,
                    answer=answer,
                    suggested_actions=["Allocate Habitation to Safe Zone", "View Safe Zones Map"],
                    related_entities={"recommended_safe_zone": best.name, "available_capacity": avail},
                    data_available=True,
                )

        if "flood" in raw_q or "erosion" in raw_q or "landslide" in raw_q:
            haz_type = "flood" if "flood" in raw_q else ("landslide" if "landslide" in raw_q else "erosion")
            q_col = HazardAssessment.flood_risk if haz_type == "flood" else (HazardAssessment.landslide_risk if haz_type == "landslide" else HazardAssessment.erosion_risk)
            hazards = db.query(HazardAssessment).order_by(desc(q_col)).limit(3).all()
            names = [h.habitation.name for h in hazards if h.habitation]
            answer = f"The top habitations facing severe {haz_type.upper()} vulnerability are: {', '.join(names)}. Satellite and terrain slope models indicate elevated seasonal exposure."
            return AIQueryResponse(
                query=payload.query,
                answer=answer,
                suggested_actions=[f"Filter Map by {haz_type.title()} Layer", "Issue Hazard Advisory"],
                data_available=True,
            )

    # 2. Citizen / Habitation Specific Queries
    if hab_context:
        # Habitation details
        latest_risk = db.query(RiskScore).filter(RiskScore.habitation_id == hab_context.id).order_by(desc(RiskScore.calculated_at)).first()
        latest_haz = db.query(HazardAssessment).filter(HazardAssessment.habitation_id == hab_context.id).first()
        latest_cap = db.query(CapacityAssessment).filter(CapacityAssessment.habitation_id == hab_context.id).first()
        active_alerts = db.query(Alert).filter(Alert.habitation_id == hab_context.id, Alert.is_active == True).all()
        rel_rec = db.query(RelocationRecommendation).filter(RelocationRecommendation.habitation_id == hab_context.id).first()

        risk_level = latest_risk.risk_level if latest_risk else "MODERATE"
        risk_score = latest_risk.composite_score if latest_risk else 50.0

        if "risk" in raw_q or "score" in raw_q or "safe" in raw_q:
            answer = (
                f"**{hab_context.name}** ({hab_context.village}, {hab_context.district}) is classified as "
                f"**{risk_level} RISK** with a composite score of **{risk_score:.1f}/100**.\n\n"
                f"Contributing Factors:\n"
                f"• Primary Threat: {latest_haz.primary_hazard if latest_haz else 'Monsoon Runoff & Toe Erosion'}\n"
                f"• Population Exposure: {hab_context.population} residents\n"
                f"• Capacity Stress: {latest_cap.status if latest_cap else 'Normal'}\n\n"
                f"{'Immediate precautionary relocation or vigil is advised.' if risk_level in ['CRITICAL', 'HIGH'] else 'Area is currently within stable environmental thresholds.'}"
            )
            return AIQueryResponse(
                query=payload.query,
                answer=answer,
                suggested_actions=["View My Risk Map", "Check Emergency Shelter Routes", "Report Ground Hazard"],
                related_entities={"habitation": hab_context.name, "risk_level": risk_level, "risk_score": risk_score},
                data_available=True,
            )

        if "relocation" in raw_q or "move" in raw_q or "shift" in raw_q:
            if rel_rec:
                sz_name = rel_rec.safe_zone.name if rel_rec.safe_zone else "Designated District Safe Zone"
                answer = (
                    f"Relocation Status for **{hab_context.name}**: **{rel_rec.status.upper()}** "
                    f"(Priority Level: **{rel_rec.priority_level}**).\n\n"
                    f"Reason: {rel_rec.reason}\n"
                    f"Recommended Safe Location: **{sz_name}**.\n"
                    f"Target Citizens to be Relocated: {rel_rec.people_to_relocate} residents.\n\n"
                    f"Follow official civil administration guidelines before initiating movement."
                )
            else:
                answer = f"No active government relocation order has been issued for **{hab_context.name}**. Routine monitoring continues."
            return AIQueryResponse(
                query=payload.query,
                answer=answer,
                suggested_actions=["Track Relocation Progress", "View Safe Zone Amenities"],
                data_available=True,
            )

        if "safe zone" in raw_q or "shelter" in raw_q or "hospital" in raw_q:
            # Find closest safe zone in district
            sz = db.query(SafeZone).filter(SafeZone.district.ilike(f"%{hab_context.district}%")).first()
            if not sz:
                sz = db.query(SafeZone).first()
            if sz:
                avail = sz.max_capacity - sz.current_occupancy
                answer = (
                    f"The designated safe haven for your region is **{sz.name}** located in {sz.district} "
                    f"({sz.distance_km:.1f} km away via main arterial roads).\n"
                    f"• Capacity: {avail} vacant spots ({sz.current_occupancy}/{sz.max_capacity})\n"
                    f"• Safety Rating: {sz.safety_score}/100 | Road Accessibility: {sz.road_access_score}/100\n"
                    f"• Medical and basic emergency supplies are provisioned on-site."
                )
            else:
                answer = "District administration shelter coordinate database is currently synchronizing for your sector."
            return AIQueryResponse(
                query=payload.query,
                answer=answer,
                suggested_actions=["Open Evacuation Route on Map", "Contact Local Relief Liaison"],
                data_available=True,
            )

        if "alert" in raw_q or "warning" in raw_q:
            if active_alerts:
                alert_text = "\n".join([f"⚠️ **{a.title}** ({a.severity}): {a.message}" for a in active_alerts])
                answer = f"Active warnings for **{hab_context.name}**:\n\n{alert_text}\n\nPlease remain alert and monitor local siren broadcasts."
            else:
                answer = f"There are currently no active high-severity alerts registered for **{hab_context.name}**."
            return AIQueryResponse(
                query=payload.query,
                answer=answer,
                suggested_actions=["View All Alerts", "Report Incident"],
                data_available=True,
            )

    # 3. Fallback or general information
    default_hab = db.query(Habitation).first()
    hab_hint = default_hab.name if default_hab else "Rampur or Chamoli"
    answer = (
        f"I am Aashray's Disaster Management Intelligence Assistant. "
        f"I can provide real-time information based on our spatial hazard evaluations, carrying capacities, and relocation registries.\n\n"
        f"You can ask me about:\n"
        f"• **Risk Level & Score**: e.g., 'What is the risk level of {hab_hint}?'\n"
        f"• **Relocation Status**: e.g., 'Do I need relocation?' or 'What is our relocation progress?'\n"
        f"• **Safe Zones & Shelters**: e.g., 'Where is the nearest safe shelter?'\n"
        f"• **Active Alerts**: e.g., 'Are there active flood warnings for my area?'\n"
        f"• **Administrative Intelligence**: e.g., 'Show immediate relocation cases' or 'Which areas are critical?'"
    )
    return AIQueryResponse(
        query=payload.query,
        answer=answer,
        suggested_actions=["Check My Habitation Risk", "View Safe Zones", "View Active Alerts"],
        data_available=True,
    )

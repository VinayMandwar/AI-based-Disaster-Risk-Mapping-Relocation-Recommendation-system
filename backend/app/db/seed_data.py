import json
import os
from pathlib import Path
from datetime import datetime
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.entities import (
    Role,
    User,
    Habitation,
    PopulationProfile,
    InfrastructureProfile,
    HazardAssessment,
    RiskScore,
    CapacityAssessment,
    SafeZone,
    EmergencyFacility,
    RelocationRecommendation,
    Alert,
    Complaint,
)


def seed_database():
    db = SessionLocal()
    try:
        # 1. Seed Roles
        roles_data = [
            ("ADMIN", "Full platform administration and user management"),
            ("AUTHORITY", "Disaster management authority with executive approval capabilities"),
            ("ANALYST", "Risk and hazard analyst with data modeling access"),
            ("VIEWER", "Field observer and view-only operational access"),
        ]
        role_map = {}
        for r_name, r_desc in roles_data:
            role = db.query(Role).filter(Role.name == r_name).first()
            if not role:
                role = Role(name=r_name, description=r_desc)
                db.add(role)
                db.flush()
            role_map[r_name] = role

        # 2. Seed Demo Users
        admin_user = db.query(User).filter(User.email == "admin@aashray.gov.in").first()
        if not admin_user:
            admin_user = User(
                email="admin@aashray.gov.in",
                hashed_password="sha256_demo_password_not_for_prod",
                full_name="Dr. S. K. Raman (Disaster Operations Chief)",
                role_id=role_map["ADMIN"].id,
                role_name="ADMIN",
                is_active=True,
            )
            db.add(admin_user)

        citizen_user = db.query(User).filter(User.email == "citizen.rampur@aashray.local").first()
        if not citizen_user:
            citizen_user = User(
                email="citizen.rampur@aashray.local",
                hashed_password="sha256_demo_password_not_for_prod",
                full_name="Ramesh Kumar (Resident)",
                mobile="+91 98765 43210",
                role_id=role_map["VIEWER"].id,
                role_name="CITIZEN",
                is_active=True,
            )
            db.add(citizen_user)

        db.flush()

        # Helper to seed sample complaints idempotently
        def seed_sample_complaints():
            first_hab = db.query(Habitation).first()
            sample_complaints_data = [
                {
                    "complaint_code": "CMP-2026-0012",
                    "issue_type": "Flooding",
                    "location_text": f"Ward 3, Near Primary School, {first_hab.village if first_hab else 'Nandikot'}",
                    "description": "Severe seasonal runoff waterlogging observed after 48h rain; retaining wall breached.",
                    "contact_name": "Ramesh Kumar",
                    "contact_phone": "+91 98765 43210",
                    "status": "In Progress",
                    "assigned_to": "District Flood Response Cell",
                    "admin_notes": "Emergency drainage sandbagging deployed.",
                    "habitation_id": first_hab.id if first_hab else None,
                },
                {
                    "complaint_code": "CMP-2026-0015",
                    "issue_type": "Landslide",
                    "location_text": "Upper Ridge Road, Sector B",
                    "description": "Fissures and tension cracks appearing along the hillside road above residential cluster.",
                    "contact_name": "Sunita Devi",
                    "contact_phone": "+91 98111 22334",
                    "status": "Under Review",
                    "assigned_to": "Geotechnical Survey Team",
                    "admin_notes": "Assigned for drone photogrammetry and tilt-meter inspection.",
                    "habitation_id": first_hab.id if first_hab else None,
                },
                {
                    "complaint_code": "CMP-2026-0021",
                    "issue_type": "Blocked Road",
                    "location_text": "Bridge Approach Culvert 4",
                    "description": "Debris from boulder fall has partially blocked emergency medical ambulance route.",
                    "contact_name": "Manoj Negi",
                    "contact_phone": "+91 97234 56789",
                    "status": "Resolved",
                    "assigned_to": "Public Works Department (PWD)",
                    "admin_notes": "Bulldozer cleared debris at 08:30 hrs. Traffic restored.",
                    "habitation_id": first_hab.id if first_hab else None,
                },
            ]
            for c_info in sample_complaints_data:
                existing_c = db.query(Complaint).filter(Complaint.complaint_code == c_info["complaint_code"]).first()
                if not existing_c:
                    db.add(Complaint(**c_info))

        # Check if habitations already seeded
        existing_hab_count = db.query(Habitation).count()
        if existing_hab_count > 0:
            seed_sample_complaints()
            db.commit()
            print(f"Database contains {existing_hab_count} habitations. Verified seed data.")
            return

        # 3. Load Sample JSON
        json_path = Path(__file__).resolve().parent.parent.parent.parent / "data" / "sample" / "demo_habitations.json"
        if not json_path.exists():
            print(f"Warning: sample file not found at {json_path}")
            db.commit()
            return

        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Seed Safe Zones
        safe_zone_map = {}
        for sz_data in data.get("safe_zones", []):
            sz = db.query(SafeZone).filter(SafeZone.code == sz_data["code"]).first()
            if not sz:
                sz = SafeZone(
                    name=sz_data["name"],
                    code=sz_data["code"],
                    district=sz_data["district"],
                    state=sz_data["state"],
                    latitude=sz_data["latitude"],
                    longitude=sz_data["longitude"],
                    max_capacity=sz_data["max_capacity"],
                    current_occupancy=sz_data["current_occupancy"],
                    elevation_meters=sz_data["elevation_meters"],
                    status=sz_data["status"],
                    safety_score=sz_data.get("safety_score", 90),
                    road_access_score=sz_data.get("road_access_score", 85),
                    healthcare_score=sz_data.get("healthcare_score", 80),
                    distance_km=sz_data.get("distance_km", 5.0),
                )
                db.add(sz)
                db.flush()
            safe_zone_map[sz_data["code"]] = sz
            # Also map by district for relocation matching
            safe_zone_map[sz_data["district"]] = sz

        # Seed Emergency Facilities
        for ef_data in data.get("emergency_facilities", []):
            ef = db.query(EmergencyFacility).filter(EmergencyFacility.name == ef_data["name"]).first()
            if not ef:
                ef = EmergencyFacility(
                    name=ef_data["name"],
                    facility_type=ef_data["facility_type"],
                    district=ef_data["district"],
                    latitude=ef_data["latitude"],
                    longitude=ef_data["longitude"],
                    capacity=ef_data["capacity"],
                    contact_info=ef_data["contact_info"],
                    status=ef_data["status"],
                )
                db.add(ef)

        # Seed Habitations & Associated Assessments
        habitation_map = {}
        for h_data in data.get("habitations", []):
            hab = db.query(Habitation).filter(Habitation.code == h_data["code"]).first()
            if not hab:
                hab = Habitation(
                    name=h_data["name"],
                    code=h_data["code"],
                    village=h_data["village"],
                    district=h_data["district"],
                    state=h_data["state"],
                    latitude=h_data["latitude"],
                    longitude=h_data["longitude"],
                    population=h_data["population"],
                    housing_count=h_data["housing_count"],
                    status=h_data["status"],
                )
                db.add(hab)
                db.flush()

                # Population Profile
                pp_data = h_data.get("population_profile", {})
                pp = PopulationProfile(
                    habitation_id=hab.id,
                    total_population=pp_data.get("total_population", hab.population),
                    children_count=pp_data.get("children_count", 0),
                    elderly_count=pp_data.get("elderly_count", 0),
                    women_count=pp_data.get("women_count", 0),
                    special_vulnerabilities_count=pp_data.get("special_vulnerabilities_count", 0),
                )
                db.add(pp)

                # Infrastructure Profile
                ip_data = h_data.get("infrastructure_profile", {})
                ip = InfrastructureProfile(
                    habitation_id=hab.id,
                    road_accessibility=ip_data.get("road_accessibility", 3),
                    water_availability=ip_data.get("water_availability", 3),
                    sanitation=ip_data.get("sanitation", 3),
                    electricity=ip_data.get("electricity", 3),
                    healthcare_access=ip_data.get("healthcare_access", 3),
                    shelter_availability=ip_data.get("shelter_availability", 3),
                    housing_condition=ip_data.get("housing_condition", 3),
                )
                db.add(ip)

                # Hazard Assessment
                ha_data = h_data.get("hazard_assessment", {})
                ha = HazardAssessment(
                    habitation_id=hab.id,
                    flood_risk=ha_data.get("flood_risk", 0.0),
                    landslide_risk=ha_data.get("landslide_risk", 0.0),
                    erosion_risk=ha_data.get("erosion_risk", 0.0),
                    earthquake_risk=ha_data.get("earthquake_risk", 0.0),
                    fire_risk=ha_data.get("fire_risk", 0.0),
                    heatwave_risk=ha_data.get("heatwave_risk", 0.0),
                    cyclone_risk=ha_data.get("cyclone_risk", 0.0),
                    primary_hazard=ha_data.get("primary_hazard", "None"),
                )
                db.add(ha)

                # Risk Score
                rs_data = h_data.get("risk_score", {})
                rs = RiskScore(
                    habitation_id=hab.id,
                    composite_score=rs_data.get("composite_score", 0.0),
                    risk_level=rs_data.get("risk_level", "SAFE_LOW"),
                    notes=rs_data.get("notes", ""),
                )
                db.add(rs)

                # Capacity Assessment
                ca_data = h_data.get("capacity_assessment", {})
                ca = CapacityAssessment(
                    habitation_id=hab.id,
                    carrying_capacity_people=ca_data.get("carrying_capacity_people", 500),
                    current_load=ca_data.get("current_load", hab.population),
                    capacity_stress_ratio=ca_data.get("capacity_stress_ratio", 1.0),
                    status=ca_data.get("status", "NORMAL"),
                )
                db.add(ca)

                # Relocation Recommendation (if present)
                rel_data = h_data.get("relocation")
                if rel_data:
                    target_sz = safe_zone_map.get(hab.district)
                    rr = RelocationRecommendation(
                        habitation_id=hab.id,
                        safe_zone_id=target_sz.id if target_sz else None,
                        priority_level=rel_data.get("priority_level", "MEDIUM"),
                        people_to_relocate=rel_data.get("people_to_relocate", 0),
                        reason=rel_data.get("reason", "Hazard mitigation advisory"),
                        status=rel_data.get("status", "PROPOSED"),
                    )
                    db.add(rr)

            habitation_map[h_data["code"]] = hab

        # Seed Alerts
        for a_data in data.get("alerts", []):
            linked_hab = habitation_map.get(a_data.get("habitation_code"))
            existing_alert = db.query(Alert).filter(Alert.title == a_data["title"]).first()
            if not existing_alert:
                alert = Alert(
                    title=a_data["title"],
                    message=a_data["message"],
                    severity=a_data["severity"],
                    alert_type=a_data["alert_type"],
                    habitation_id=linked_hab.id if linked_hab else None,
                    is_active=a_data.get("is_active", True),
                )
                db.add(alert)

        # Seed sample complaints
        seed_sample_complaints()

        db.commit()
        print("Successfully seeded demo data into PostgreSQL database.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()


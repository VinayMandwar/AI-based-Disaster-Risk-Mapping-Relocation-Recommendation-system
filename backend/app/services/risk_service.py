from typing import List
from sqlalchemy.orm import Session, joinedload
from app.models.entities import Habitation, RiskScore, HazardAssessment
from app.schemas.risk import (
    RiskSummaryResponse,
    HazardBreakdownItem,
    RiskScoreSummaryItem,
)


class RiskService:
    @staticmethod
    def get_summary(db: Session) -> RiskSummaryResponse:
        habitations = (
            db.query(Habitation)
            .options(
                joinedload(Habitation.risk_scores),
                joinedload(Habitation.hazard_assessments),
            )
            .all()
        )

        critical_count = 0
        high_count = 0
        moderate_count = 0
        low_count = 0

        hazard_sums = {
            "Flood Risk": {"sum": 0.0, "affected": 0, "max_val": 0.0, "max_hab": "N/A"},
            "Landslide Risk": {"sum": 0.0, "affected": 0, "max_val": 0.0, "max_hab": "N/A"},
            "Erosion Risk": {"sum": 0.0, "affected": 0, "max_val": 0.0, "max_hab": "N/A"},
            "Earthquake Risk": {"sum": 0.0, "affected": 0, "max_val": 0.0, "max_hab": "N/A"},
        }

        top_vulnerable = []

        for h in habitations:
            latest_score = 0.0
            latest_level = "SAFE_LOW"
            calc_at = h.created_at

            if h.risk_scores:
                rs = sorted(h.risk_scores, key=lambda x: x.calculated_at)[-1]
                latest_score = rs.composite_score
                latest_level = rs.risk_level
                calc_at = rs.calculated_at

            if latest_level == "CRITICAL":
                critical_count += 1
            elif latest_level == "HIGH":
                high_count += 1
            elif latest_level == "MODERATE":
                moderate_count += 1
            else:
                low_count += 1

            primary_hazard = "Unknown"
            if h.hazard_assessments:
                ha = sorted(h.hazard_assessments, key=lambda x: x.assessed_at)[-1]
                primary_hazard = ha.primary_hazard

                # Update hazard sums focusing on Flood, Landslide, Erosion triad
                haz_fields = [
                    ("Flood Risk", ha.flood_risk),
                    ("Landslide Risk", ha.landslide_risk),
                    ("Erosion Risk", getattr(ha, "erosion_risk", 0.7)),
                    ("Earthquake Risk", ha.earthquake_risk),
                ]
                for name, val in haz_fields:
                    hazard_sums[name]["sum"] += val
                    if val > 0.4:
                        hazard_sums[name]["affected"] += 1
                    if val > hazard_sums[name]["max_val"]:
                        hazard_sums[name]["max_val"] = val
                        hazard_sums[name]["max_hab"] = f"{h.name} ({round(val*100)}%)"

            top_vulnerable.append(
                RiskScoreSummaryItem(
                    habitation_id=h.id,
                    habitation_name=h.name,
                    district=h.district,
                    composite_score=latest_score,
                    risk_level=latest_level,
                    primary_hazard=primary_hazard,
                    population=h.population,
                    calculated_at=calc_at,
                )
            )

        top_vulnerable.sort(key=lambda x: x.composite_score, reverse=True)

        breakdowns = []
        total_h = len(habitations) or 1
        for name, data in hazard_sums.items():
            breakdowns.append(
                HazardBreakdownItem(
                    hazard_type=name,
                    average_risk=round((data["sum"] / total_h) * 100, 1),
                    affected_habitations_count=data["affected"],
                    highest_risk_habitation=data["max_hab"],
                )
            )

        return RiskSummaryResponse(
            total_assessed=len(habitations),
            critical_count=critical_count,
            high_count=high_count,
            moderate_count=moderate_count,
            low_count=low_count,
            hazard_breakdowns=breakdowns,
            top_vulnerable_records=top_vulnerable,
        )

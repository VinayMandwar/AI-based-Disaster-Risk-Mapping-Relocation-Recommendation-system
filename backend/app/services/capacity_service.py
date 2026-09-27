from typing import List
from sqlalchemy.orm import Session, joinedload
from app.models.entities import Habitation, CapacityAssessment, InfrastructureProfile
from app.schemas.capacity import (
    CapacitySummaryResponse,
    CapacityHabitationItem,
)


class CapacityService:
    @staticmethod
    def get_summary(db: Session) -> CapacitySummaryResponse:
        habitations = (
            db.query(Habitation)
            .options(
                joinedload(Habitation.capacity_assessments),
                joinedload(Habitation.infrastructure_profile),
            )
            .all()
        )

        normal_count = 0
        stressed_count = 0
        over_capacity_count = 0
        total_stress_ratio = 0.0

        items: List[CapacityHabitationItem] = []

        for h in habitations:
            cap_limit = 500
            current_load = h.population
            stress_ratio = 1.0
            status = "NORMAL"

            if h.capacity_assessments:
                ca = sorted(h.capacity_assessments, key=lambda x: x.assessed_at)[-1]
                cap_limit = ca.carrying_capacity_people
                current_load = ca.current_load
                stress_ratio = ca.capacity_stress_ratio
                status = ca.status

            if status == "OVER_CAPACITY":
                over_capacity_count += 1
            elif status == "STRESSED":
                stressed_count += 1
            else:
                normal_count += 1

            total_stress_ratio += stress_ratio

            # Identify limiting factor from infrastructure
            limiting_factor = "General Density"
            if h.infrastructure_profile:
                ip = h.infrastructure_profile
                scores = [
                    ("Road Accessibility", ip.road_accessibility),
                    ("Drinking Water", ip.water_availability),
                    ("Sanitation", ip.sanitation),
                    ("Healthcare", ip.healthcare_access),
                    ("Emergency Shelter", ip.shelter_availability),
                ]
                lowest = min(scores, key=lambda x: x[1])
                if lowest[1] <= 2:
                    limiting_factor = f"Acute {lowest[0]} Deficit"

            items.append(
                CapacityHabitationItem(
                    habitation_id=h.id,
                    habitation_name=h.name,
                    district=h.district,
                    carrying_capacity_people=cap_limit,
                    current_load=current_load,
                    capacity_stress_ratio=round(stress_ratio, 2),
                    status=status,
                    limiting_factor=limiting_factor,
                )
            )

        items.sort(key=lambda x: x.capacity_stress_ratio, reverse=True)
        total_h = len(habitations) or 1
        avg_ratio = round(total_stress_ratio / total_h, 2)

        return CapacitySummaryResponse(
            total_evaluated=len(habitations),
            normal_count=normal_count,
            stressed_count=stressed_count,
            over_capacity_count=over_capacity_count,
            average_stress_ratio=avg_ratio,
            habitations=items,
        )

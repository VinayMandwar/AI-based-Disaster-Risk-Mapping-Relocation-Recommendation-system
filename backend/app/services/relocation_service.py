from typing import List
from sqlalchemy.orm import Session, joinedload
from app.models.entities import RelocationRecommendation
from app.schemas.relocation import (
    RelocationSummaryResponse,
    RelocationRecommendationItem,
)


class RelocationService:
    @staticmethod
    def get_summary(db: Session) -> RelocationSummaryResponse:
        recommendations = (
            db.query(RelocationRecommendation)
            .options(
                joinedload(RelocationRecommendation.habitation),
                joinedload(RelocationRecommendation.safe_zone),
            )
            .all()
        )

        immediate_cases = 0
        high_cases = 0
        total_people = 0
        allocated_safe_zones = set()

        items: List[RelocationRecommendationItem] = []

        for rec in recommendations:
            if rec.priority_level == "IMMEDIATE":
                immediate_cases += 1
            elif rec.priority_level == "HIGH":
                high_cases += 1

            total_people += rec.people_to_relocate

            if rec.safe_zone_id:
                allocated_safe_zones.add(rec.safe_zone_id)

            items.append(
                RelocationRecommendationItem(
                    id=rec.id,
                    habitation_id=rec.habitation_id,
                    habitation_name=rec.habitation.name if rec.habitation else "Unknown",
                    district=rec.habitation.district if rec.habitation else "Unknown",
                    priority_level=rec.priority_level,
                    people_to_relocate=rec.people_to_relocate,
                    reason=rec.reason,
                    safe_zone_id=rec.safe_zone_id,
                    safe_zone_name=rec.safe_zone.name if rec.safe_zone else "Pending Allocation",
                    status=rec.status,
                    recommended_at=rec.recommended_at,
                )
            )

        # Priority sort: IMMEDIATE, then HIGH, then others
        priority_order = {"IMMEDIATE": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
        items.sort(key=lambda x: priority_order.get(x.priority_level, 4))

        return RelocationSummaryResponse(
            immediate_cases=immediate_cases,
            high_priority_cases=high_cases,
            total_people_pending_relocation=total_people,
            allocated_safe_zones_count=len(allocated_safe_zones),
            recommendations=items,
        )

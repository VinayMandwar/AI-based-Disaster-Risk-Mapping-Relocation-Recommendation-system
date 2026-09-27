from typing import List, Optional, Tuple
from sqlalchemy.orm import Session, joinedload
from app.models.entities import (
    Habitation,
    PopulationProfile,
    InfrastructureProfile,
    HazardAssessment,
    RiskScore,
    CapacityAssessment,
)


class HabitationService:
    @staticmethod
    def get_habitations(
        db: Session,
        skip: int = 0,
        limit: int = 50,
        district: Optional[str] = None,
        risk_level: Optional[str] = None,
        search: Optional[str] = None,
    ) -> Tuple[List[Habitation], int]:
        query = db.query(Habitation).options(
            joinedload(Habitation.risk_scores),
            joinedload(Habitation.hazard_assessments),
        )

        if district:
            query = query.filter(Habitation.district.ilike(f"%{district}%"))
        
        if search:
            query = query.filter(
                (Habitation.name.ilike(f"%{search}%")) |
                (Habitation.village.ilike(f"%{search}%")) |
                (Habitation.district.ilike(f"%{search}%")) |
                (Habitation.code.ilike(f"%{search}%"))
            )

        total = query.count()
        habitations = query.order_by(Habitation.name).offset(skip).limit(limit).all()

        # If risk_level filter requested, filter post-query or through subquery
        if risk_level:
            filtered = []
            for h in habitations:
                latest_risk = h.risk_scores[-1].risk_level if h.risk_scores else "SAFE_LOW"
                if latest_risk.upper() == risk_level.upper():
                    filtered.append(h)
            return filtered, len(filtered)

        return habitations, total

    @staticmethod
    def get_habitation_by_id(db: Session, habitation_id: str) -> Optional[Habitation]:
        return (
            db.query(Habitation)
            .options(
                joinedload(Habitation.population_profile),
                joinedload(Habitation.infrastructure_profile),
                joinedload(Habitation.hazard_assessments),
                joinedload(Habitation.risk_scores),
                joinedload(Habitation.capacity_assessments),
            )
            .filter(Habitation.id == habitation_id)
            .first()
        )

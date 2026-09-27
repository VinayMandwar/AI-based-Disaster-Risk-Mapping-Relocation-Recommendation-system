from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.habitation_service import HabitationService
from app.schemas.habitation import HabitationDetailResponse, HabitationItemResponse
from app.schemas.common import PaginatedResponse

router = APIRouter()


@router.get("/habitations", response_model=PaginatedResponse[HabitationItemResponse])
def get_habitations(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    district: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Retrieve paginated list of habitations with optional filtering by district, risk_level, or keyword search.
    """
    habitations, total = HabitationService.get_habitations(
        db, skip=skip, limit=limit, district=district, risk_level=risk_level, search=search
    )

    items = []
    for h in habitations:
        latest_score = None
        latest_level = None
        if h.risk_scores:
            latest_rs = sorted(h.risk_scores, key=lambda x: x.calculated_at)[-1]
            latest_score = latest_rs.composite_score
            latest_level = latest_rs.risk_level

        primary_haz = None
        if h.hazard_assessments:
            latest_ha = sorted(h.hazard_assessments, key=lambda x: x.assessed_at)[-1]
            primary_haz = latest_ha.primary_hazard

        items.append(
            HabitationItemResponse(
                id=h.id,
                name=h.name,
                code=h.code,
                village=h.village,
                district=h.district,
                state=h.state,
                latitude=h.latitude,
                longitude=h.longitude,
                population=h.population,
                housing_count=h.housing_count,
                status=h.status,
                created_at=h.created_at,
                latest_risk_score=latest_score,
                latest_risk_level=latest_level,
                primary_hazard=primary_haz,
            )
        )

    return PaginatedResponse(
        items=items,
        total=total,
        page=(skip // limit) + 1,
        page_size=limit,
    )


@router.get("/habitations/{habitation_id}", response_model=HabitationDetailResponse)
def get_habitation_detail(habitation_id: str, db: Session = Depends(get_db)):
    """
    Retrieve full multi-hazard profile and infrastructure assessment for a specific habitation.
    """
    habitation = HabitationService.get_habitation_by_id(db, habitation_id)
    if not habitation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Habitation with ID '{habitation_id}' not found.",
        )
    return habitation

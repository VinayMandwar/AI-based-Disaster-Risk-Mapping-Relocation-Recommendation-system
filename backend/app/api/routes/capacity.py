from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.capacity_service import CapacityService
from app.schemas.capacity import CapacitySummaryResponse

router = APIRouter()


@router.get("/capacity/summary", response_model=CapacitySummaryResponse)
def get_capacity_summary(db: Session = Depends(get_db)):
    """
    Retrieve carrying capacity assessment, infrastructure limits, and stress ratios.
    """
    return CapacityService.get_summary(db)

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.safe_zone_service import SafeZoneService
from app.schemas.safe_zone import SafeZoneListResponse

router = APIRouter()


@router.get("/safe-zones", response_model=SafeZoneListResponse)
def get_safe_zones(db: Session = Depends(get_db)):
    """
    Retrieve registered safe zones, elevation profiles, and live shelter capacity status.
    """
    return SafeZoneService.get_safe_zones(db)

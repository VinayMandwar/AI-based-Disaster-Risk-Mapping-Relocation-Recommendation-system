from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.alert_service import AlertService
from app.schemas.alert import AlertListResponse

router = APIRouter()


@router.get("/alerts", response_model=AlertListResponse)
def get_alerts(active_only: bool = Query(True), db: Session = Depends(get_db)):
    """
    Retrieve active hazard advisories and emergency bulletins.
    """
    return AlertService.get_alerts(db, active_only=active_only)

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.risk_service import RiskService
from app.schemas.risk import RiskSummaryResponse

router = APIRouter()


@router.get("/risk/summary", response_model=RiskSummaryResponse)
def get_risk_summary(db: Session = Depends(get_db)):
    """
    Retrieve multi-hazard breakdown and risk matrix categorization.
    """
    return RiskService.get_summary(db)

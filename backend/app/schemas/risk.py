from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from app.schemas.common import DEMO_DATA_DISCLAIMER


class HazardBreakdownItem(BaseModel):
    hazard_type: str
    average_risk: float
    affected_habitations_count: int
    highest_risk_habitation: str


class RiskScoreSummaryItem(BaseModel):
    habitation_id: str
    habitation_name: str
    district: str
    composite_score: float
    risk_level: str
    primary_hazard: str
    population: int
    calculated_at: datetime


class RiskSummaryResponse(BaseModel):
    disclaimer: str = DEMO_DATA_DISCLAIMER
    total_assessed: int
    critical_count: int
    high_count: int
    moderate_count: int
    low_count: int
    hazard_breakdowns: List[HazardBreakdownItem]
    top_vulnerable_records: List[RiskScoreSummaryItem]

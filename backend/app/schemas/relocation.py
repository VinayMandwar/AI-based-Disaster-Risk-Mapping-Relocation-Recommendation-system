from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from app.schemas.common import DEMO_DATA_DISCLAIMER


class RelocationRecommendationItem(BaseModel):
    id: str
    habitation_id: str
    habitation_name: str
    district: str
    priority_level: str  # IMMEDIATE, HIGH, MEDIUM, LOW
    people_to_relocate: int
    reason: str
    safe_zone_id: Optional[str] = None
    safe_zone_name: Optional[str] = None
    status: str
    recommended_at: datetime


class RelocationSummaryResponse(BaseModel):
    disclaimer: str = DEMO_DATA_DISCLAIMER
    immediate_cases: int
    high_priority_cases: int
    total_people_pending_relocation: int
    allocated_safe_zones_count: int
    recommendations: List[RelocationRecommendationItem]

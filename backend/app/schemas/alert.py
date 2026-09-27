from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.common import DEMO_DATA_DISCLAIMER


class AlertItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    title: str
    message: str
    severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    alert_type: str
    habitation_id: Optional[str] = None
    habitation_name: Optional[str] = None
    is_active: bool
    issued_at: datetime
    resolved_at: Optional[datetime] = None


class AlertListResponse(BaseModel):
    disclaimer: str = DEMO_DATA_DISCLAIMER
    total_alerts: int
    active_critical_count: int
    active_high_count: int
    active_medium_count: int
    items: List[AlertItem]

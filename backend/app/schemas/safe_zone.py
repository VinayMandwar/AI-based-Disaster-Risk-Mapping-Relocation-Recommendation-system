from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.common import DEMO_DATA_DISCLAIMER


class SafeZoneItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    code: str
    district: str
    state: str
    latitude: float
    longitude: float
    max_capacity: int
    current_occupancy: int
    available_capacity: int
    occupancy_rate: float
    elevation_meters: float
    safety_score: int = 90
    road_access_score: int = 85
    healthcare_score: int = 80
    distance_km: float = 5.0
    status: str
    created_at: datetime


class SafeZoneListResponse(BaseModel):
    disclaimer: str = DEMO_DATA_DISCLAIMER
    total_safe_zones: int
    total_max_capacity: int
    total_current_occupancy: int
    total_available_capacity: int
    items: List[SafeZoneItem]

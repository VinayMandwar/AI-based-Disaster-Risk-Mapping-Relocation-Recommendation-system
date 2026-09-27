from typing import List
from pydantic import BaseModel
from app.schemas.common import DEMO_DATA_DISCLAIMER


class CapacityHabitationItem(BaseModel):
    habitation_id: str
    habitation_name: str
    district: str
    carrying_capacity_people: int
    current_load: int
    capacity_stress_ratio: float
    status: str  # NORMAL, STRESSED, OVER_CAPACITY
    limiting_factor: str


class CapacitySummaryResponse(BaseModel):
    disclaimer: str = DEMO_DATA_DISCLAIMER
    total_evaluated: int
    normal_count: int
    stressed_count: int
    over_capacity_count: int
    average_stress_ratio: float
    habitations: List[CapacityHabitationItem]

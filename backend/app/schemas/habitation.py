from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.schemas.common import DEMO_DATA_DISCLAIMER


class PopulationProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    total_population: int
    children_count: int
    elderly_count: int
    women_count: int
    special_vulnerabilities_count: int
    updated_at: datetime


class InfrastructureProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    road_accessibility: int
    water_availability: int
    sanitation: int
    electricity: int
    healthcare_access: int
    shelter_availability: int
    housing_condition: int
    updated_at: datetime


class HazardAssessmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    flood_risk: float
    landslide_risk: float
    erosion_risk: Optional[float] = 0.0
    earthquake_risk: float
    fire_risk: float
    heatwave_risk: float
    cyclone_risk: float
    primary_hazard: str
    assessed_at: datetime


class RiskScoreResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    composite_score: float
    risk_level: str
    notes: Optional[str] = None
    calculated_at: datetime


class CapacityAssessmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    carrying_capacity_people: int
    current_load: int
    capacity_stress_ratio: float
    status: str
    assessed_at: datetime


class HabitationItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    code: str
    village: str
    district: str
    state: str
    latitude: float
    longitude: float
    population: int
    housing_count: int
    status: str
    created_at: datetime
    # Flattened or attached latest risk info
    latest_risk_score: Optional[float] = None
    latest_risk_level: Optional[str] = None
    primary_hazard: Optional[str] = None


class HabitationDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    code: str
    village: str
    district: str
    state: str
    latitude: float
    longitude: float
    population: int
    housing_count: int
    status: str
    created_at: datetime
    updated_at: datetime
    disclaimer: str = DEMO_DATA_DISCLAIMER

    population_profile: Optional[PopulationProfileResponse] = None
    infrastructure_profile: Optional[InfrastructureProfileResponse] = None
    hazard_assessments: List[HazardAssessmentResponse] = []
    risk_scores: List[RiskScoreResponse] = []
    capacity_assessments: List[CapacityAssessmentResponse] = []

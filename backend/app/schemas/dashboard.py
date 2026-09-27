from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from app.schemas.common import DEMO_DATA_DISCLAIMER


class DashboardKpis(BaseModel):
    total_habitations: int
    critical_zones: int
    high_risk_areas: int
    population_at_risk: int
    immediate_relocation_cases: int
    open_complaints: int = 0


class RiskDistributionItem(BaseModel):
    risk_level: str  # SAFE_LOW, MODERATE, HIGH, CRITICAL
    count: int
    percentage: float
    color: str


class PopulationVulnerabilitySummary(BaseModel):
    total_population_assessed: int
    children_total: int
    elderly_total: int
    women_total: int
    special_vulnerabilities_total: int


class HighRiskHabitationSummary(BaseModel):
    id: str
    habitation: str
    code: str
    district: str
    state: str
    risk_level: str
    risk_score: float
    population: int
    status: str
    primary_hazard: str


class RecentAlertSummary(BaseModel):
    id: str
    title: str
    message: str
    severity: str
    alert_type: str
    habitation_name: Optional[str] = None
    issued_at: datetime


class DashboardSummaryResponse(BaseModel):
    disclaimer: str = DEMO_DATA_DISCLAIMER
    kpis: DashboardKpis
    risk_distribution: List[RiskDistributionItem]
    population_vulnerability: PopulationVulnerabilitySummary
    highest_risk_habitations: List[HighRiskHabitationSummary]
    recent_alerts: List[RecentAlertSummary]

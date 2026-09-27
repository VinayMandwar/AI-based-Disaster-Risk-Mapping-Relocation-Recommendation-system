export interface DashboardKpis {
  total_habitations: number;
  critical_zones: number;
  high_risk_areas: number;
  population_at_risk: number;
  immediate_relocation_cases: number;
  open_complaints?: number;
}

export interface RiskDistributionItem {
  risk_level: string;
  count: number;
  percentage: number;
  color: string;
}

export interface PopulationVulnerabilitySummary {
  total_population_assessed: number;
  children_total: number;
  elderly_total: number;
  women_total: number;
  special_vulnerabilities_total: number;
}

export interface HighRiskHabitationSummary {
  id: string;
  habitation: string;
  code: string;
  district: string;
  state: string;
  risk_level: string;
  risk_score: number;
  population: number;
  status: string;
  primary_hazard: string;
}

export interface RecentAlertSummary {
  id: string;
  title: string;
  message: string;
  severity: string;
  alert_type: string;
  habitation_name?: string;
  issued_at: string;
}

export interface DashboardSummaryResponse {
  disclaimer: string;
  kpis: DashboardKpis;
  risk_distribution: RiskDistributionItem[];
  population_vulnerability: PopulationVulnerabilitySummary;
  highest_risk_habitations: HighRiskHabitationSummary[];
  recent_alerts: RecentAlertSummary[];
}

export interface HabitationItem {
  id: string;
  name: string;
  code: string;
  village: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  population: number;
  housing_count: number;
  status: string;
  created_at: string;
  latest_risk_score?: number;
  latest_risk_level?: string;
  primary_hazard?: string;
}

export interface HabitationsResponse {
  items: HabitationItem[];
  total: number;
  page: number;
  page_size: number;
  disclaimer: string;
}

export interface PopulationProfile {
  total_population: number;
  children_count: number;
  elderly_count: number;
  women_count: number;
  special_vulnerabilities_count: number;
}

export interface InfrastructureProfile {
  road_accessibility: number;
  water_availability: number;
  sanitation: number;
  electricity: number;
  healthcare_access: number;
  shelter_availability: number;
  housing_condition: number;
}

export interface HazardAssessment {
  flood_risk: number;
  landslide_risk: number;
  erosion_risk?: number;
  earthquake_risk: number;
  fire_risk: number;
  heatwave_risk: number;
  cyclone_risk: number;
  primary_hazard: string;
  assessed_at: string;
}

export interface RiskScore {
  composite_score: number;
  risk_level: string;
  notes?: string;
  calculated_at: string;
}

export interface CapacityAssessment {
  carrying_capacity_people: number;
  current_load: number;
  capacity_stress_ratio: number;
  status: string;
  assessed_at: string;
}

export interface HabitationDetail extends HabitationItem {
  disclaimer: string;
  population_profile?: PopulationProfile;
  infrastructure_profile?: InfrastructureProfile;
  hazard_assessments: HazardAssessment[];
  risk_scores: RiskScore[];
  capacity_assessments: CapacityAssessment[];
}

export interface HazardBreakdownItem {
  hazard_type: string;
  average_risk: number;
  affected_habitations_count: number;
  highest_risk_habitation: string;
}

export interface RiskScoreSummaryItem {
  habitation_id: string;
  habitation_name: string;
  district: string;
  composite_score: number;
  risk_level: string;
  primary_hazard: string;
  population: number;
  calculated_at: string;
}

export interface RiskSummaryResponse {
  disclaimer: string;
  total_assessed: number;
  critical_count: number;
  high_count: number;
  moderate_count: number;
  low_count: number;
  hazard_breakdowns: HazardBreakdownItem[];
  top_vulnerable_records: RiskScoreSummaryItem[];
}

export interface CapacityHabitationItem {
  habitation_id: string;
  habitation_name: string;
  district: string;
  carrying_capacity_people: number;
  current_load: number;
  capacity_stress_ratio: number;
  status: string;
  limiting_factor: string;
}

export interface CapacitySummaryResponse {
  disclaimer: string;
  total_evaluated: number;
  normal_count: number;
  stressed_count: number;
  over_capacity_count: number;
  average_stress_ratio: number;
  habitations: CapacityHabitationItem[];
}

export interface RelocationRecommendationItem {
  id: string;
  habitation_id: string;
  habitation_name: string;
  district: string;
  priority_level: string;
  people_to_relocate: number;
  reason: string;
  safe_zone_id?: string;
  safe_zone_name?: string;
  status: string;
  recommended_at: string;
}

export interface RelocationSummaryResponse {
  disclaimer: string;
  immediate_cases: number;
  high_priority_cases: number;
  total_people_pending_relocation: number;
  allocated_safe_zones_count: number;
  recommendations: RelocationRecommendationItem[];
}

export interface SafeZoneItem {
  id: string;
  name: string;
  code: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  max_capacity: number;
  current_occupancy: number;
  available_capacity: number;
  occupancy_rate: number;
  elevation_meters: number;
  safety_score?: number;
  road_access_score?: number;
  healthcare_score?: number;
  distance_km?: number;
  status: string;
  created_at: string;
}

export interface SafeZoneListResponse {
  disclaimer: string;
  total_safe_zones: number;
  total_max_capacity: number;
  total_current_occupancy: number;
  total_available_capacity: number;
  items: SafeZoneItem[];
}

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  severity: string;
  alert_type: string;
  habitation_id?: string;
  habitation_name?: string;
  is_active: boolean;
  issued_at: string;
  resolved_at?: string;
}

export interface AlertListResponse {
  disclaimer: string;
  total_alerts: number;
  active_critical_count: number;
  active_high_count: number;
  active_medium_count: number;
  items: AlertItem[];
}

export interface ComplaintItem {
  id: string;
  complaint_code: string;
  user_id?: string;
  habitation_id?: string;
  habitation_name?: string;
  issue_type: string;
  location_text: string;
  description: string;
  photo_url?: string;
  contact_name: string;
  contact_phone: string;
  status: string; // Submitted, Under Review, In Progress, Resolved, Rejected
  assigned_to?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ComplaintListResponse {
  items: ComplaintItem[];
  total: number;
  open_count: number;
  in_progress_count: number;
  resolved_count: number;
  disclaimer: string;
}

export interface ComplaintCreatePayload {
  issue_type: string;
  habitation_id?: string;
  location_text: string;
  description: string;
  photo_url?: string;
  contact_name: string;
  contact_phone: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  mobile?: string;
  role_name: "ADMIN" | "USER";
  habitation_id?: string;
  habitation_name?: string;
  village?: string;
  district?: string;
  state?: string;
  is_active: boolean;
  disclaimer?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
  disclaimer: string;
}

export interface AIQueryResponse {
  query: string;
  answer: string;
  suggested_actions: string[];
  related_entities: Record<string, any>;
  data_available: boolean;
  disclaimer: string;
}

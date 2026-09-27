import {
  DashboardSummaryResponse,
  HabitationsResponse,
  HabitationDetail,
  HabitationItem,
  RiskSummaryResponse,
  CapacitySummaryResponse,
  RelocationSummaryResponse,
  SafeZoneListResponse,
  AlertListResponse,
  SafeZoneItem,
} from "@/types";

export const RAW_DEMO_HABITATIONS = [
  {
    id: "HAB-UK-CHM-01",
    name: "Nandi Gram Tola",
    code: "HAB-UK-CHM-01",
    village: "Nandikot",
    district: "Chamoli",
    state: "Uttarakhand",
    latitude: 30.4125,
    longitude: 79.3241,
    population: 480,
    housing_count: 92,
    status: "MONITORED",
    created_at: "2026-09-10T00:00:00Z",
    latest_risk_score: 91.5,
    latest_risk_level: "CRITICAL",
    primary_hazard: "Landslide & Riverine Slope Erosion",
    population_profile: {
      total_population: 480,
      children_count: 115,
      elderly_count: 84,
      women_count: 235,
      special_vulnerabilities_count: 28,
    },
    infrastructure_profile: {
      road_accessibility: 2,
      water_availability: 3,
      sanitation: 2,
      electricity: 3,
      healthcare_access: 1,
      shelter_availability: 2,
      housing_condition: 2,
    },
    hazard_assessment: {
      flood_risk: 0.88,
      landslide_risk: 0.94,
      erosion_risk: 0.82,
      earthquake_risk: 0.72,
      fire_risk: 0.25,
      heatwave_risk: 0.1,
      cyclone_risk: 0.05,
      primary_hazard: "Landslide & Riverine Slope Erosion",
      assessed_at: "2026-09-14T10:00:00Z",
    },
    risk_score: {
      composite_score: 91.5,
      risk_level: "CRITICAL",
      notes:
        "Steep slope instability combined with severe riverbank toe erosion and saturated shear plane. Immediate evacuation required.",
      calculated_at: "2026-09-15T08:30:00Z",
    },
    capacity_assessment: {
      carrying_capacity_people: 250,
      current_load: 480,
      capacity_stress_ratio: 1.92,
      status: "OVER_CAPACITY",
      limiting_factor: "Severe slope fracture zone & acute water deficit",
      assessed_at: "2026-09-14T12:00:00Z",
    },
    relocation: {
      priority_level: "IMMEDIATE",
      people_to_relocate: 480,
      reason: "Severe slope toe erosion and imminent monsoon debris flow path threatening entire lower terrace",
      status: "PROPOSED",
      recommended_safe_zone_id: "SZ-UK-CHM-01",
      recommended_safe_zone_name: "Chamoli Plateau Relief Hub",
    },
  },
  {
    id: "HAB-UK-TEH-02",
    name: "Devprayag Ridge Basti",
    code: "HAB-UK-TEH-02",
    village: "Devikund",
    district: "Tehri Garhwal",
    state: "Uttarakhand",
    latitude: 30.1458,
    longitude: 78.5989,
    population: 620,
    housing_count: 130,
    status: "ACTIVE",
    created_at: "2026-09-10T00:00:00Z",
    latest_risk_score: 79.2,
    latest_risk_level: "HIGH",
    primary_hazard: "Landslide & Scarp Erosion",
    population_profile: {
      total_population: 620,
      children_count: 140,
      elderly_count: 95,
      women_count: 310,
      special_vulnerabilities_count: 34,
    },
    infrastructure_profile: {
      road_accessibility: 2,
      water_availability: 2,
      sanitation: 3,
      electricity: 4,
      healthcare_access: 2,
      shelter_availability: 2,
      housing_condition: 3,
    },
    hazard_assessment: {
      flood_risk: 0.45,
      landslide_risk: 0.84,
      erosion_risk: 0.71,
      earthquake_risk: 0.78,
      fire_risk: 0.3,
      heatwave_risk: 0.15,
      cyclone_risk: 0.05,
      primary_hazard: "Landslide & Scarp Erosion",
      assessed_at: "2026-09-14T10:00:00Z",
    },
    risk_score: {
      composite_score: 79.2,
      risk_level: "HIGH",
      notes: "Active tension cracks and toe erosion detected on upper ridge terrace above lifeline road.",
      calculated_at: "2026-09-15T08:30:00Z",
    },
    capacity_assessment: {
      carrying_capacity_people: 450,
      current_load: 620,
      capacity_stress_ratio: 1.38,
      status: "STRESSED",
      limiting_factor: "Single-lane bottleneck road & drainage overflow",
      assessed_at: "2026-09-14T12:00:00Z",
    },
    relocation: {
      priority_level: "HIGH",
      people_to_relocate: 210,
      reason: "Upper terrace settlements directly below unstable scarp during monsoon rains",
      status: "PROPOSED",
      recommended_safe_zone_id: "SZ-UK-TEH-02",
      recommended_safe_zone_name: "Tehri Bypass Multipurpose Center",
    },
  },
  {
    id: "HAB-UP-VAR-03",
    name: "Varuna River Bank Pura",
    code: "HAB-UP-VAR-03",
    village: "Kalyanpur",
    district: "Varanasi",
    state: "Uttar Pradesh",
    latitude: 25.337,
    longitude: 82.978,
    population: 1250,
    housing_count: 260,
    status: "MONITORED",
    created_at: "2026-09-10T00:00:00Z",
    latest_risk_score: 85.8,
    latest_risk_level: "CRITICAL",
    primary_hazard: "Riverine Flood & Severe Bank Erosion",
    population_profile: {
      total_population: 1250,
      children_count: 320,
      elderly_count: 160,
      women_count: 605,
      special_vulnerabilities_count: 72,
    },
    infrastructure_profile: {
      road_accessibility: 4,
      water_availability: 4,
      sanitation: 2,
      electricity: 4,
      healthcare_access: 3,
      shelter_availability: 3,
      housing_condition: 2,
    },
    hazard_assessment: {
      flood_risk: 0.94,
      landslide_risk: 0.12,
      erosion_risk: 0.89,
      earthquake_risk: 0.35,
      fire_risk: 0.4,
      heatwave_risk: 0.82,
      cyclone_risk: 0.15,
      primary_hazard: "Riverine Flood & Severe Bank Erosion",
      assessed_at: "2026-09-14T10:00:00Z",
    },
    risk_score: {
      composite_score: 85.8,
      risk_level: "CRITICAL",
      notes: "Low-lying floodplain settlement suffering acute riverbank cutting and recurrent submersion.",
      calculated_at: "2026-09-15T08:30:00Z",
    },
    capacity_assessment: {
      carrying_capacity_people: 800,
      current_load: 1250,
      capacity_stress_ratio: 1.56,
      status: "OVER_CAPACITY",
      limiting_factor: "Sanitation collapse & low-lying flood inundation zone",
      assessed_at: "2026-09-14T12:00:00Z",
    },
    relocation: {
      priority_level: "IMMEDIATE",
      people_to_relocate: 650,
      reason: "Perennial embankment breach hazard and acute bank collapse during high discharge",
      status: "PROPOSED",
      recommended_safe_zone_id: "SZ-UP-VAR-03",
      recommended_safe_zone_name: "Varanasi North Elevated Shelter Ground",
    },
  },
  {
    id: "HAB-GA-NG-04",
    name: "Mandovi Estuary Ward 4",
    code: "HAB-GA-NG-04",
    village: "Ribandar Outer",
    district: "North Goa",
    state: "Goa",
    latitude: 15.502,
    longitude: 73.856,
    population: 780,
    housing_count: 175,
    status: "ACTIVE",
    created_at: "2026-09-10T00:00:00Z",
    latest_risk_score: 67.4,
    latest_risk_level: "MODERATE",
    primary_hazard: "Coastal Surge & Tidal Erosion",
    population_profile: {
      total_population: 780,
      children_count: 160,
      elderly_count: 120,
      women_count: 390,
      special_vulnerabilities_count: 38,
    },
    infrastructure_profile: {
      road_accessibility: 4,
      water_availability: 4,
      sanitation: 4,
      electricity: 4,
      healthcare_access: 4,
      shelter_availability: 3,
      housing_condition: 3,
    },
    hazard_assessment: {
      flood_risk: 0.68,
      landslide_risk: 0.15,
      erosion_risk: 0.62,
      earthquake_risk: 0.2,
      fire_risk: 0.2,
      heatwave_risk: 0.45,
      cyclone_risk: 0.76,
      primary_hazard: "Coastal Surge & Tidal Erosion",
      assessed_at: "2026-09-14T10:00:00Z",
    },
    risk_score: {
      composite_score: 67.4,
      risk_level: "MODERATE",
      notes: "Tidal ingress and coastal scour during severe cyclonic depressions.",
      calculated_at: "2026-09-15T08:30:00Z",
    },
    capacity_assessment: {
      carrying_capacity_people: 850,
      current_load: 780,
      capacity_stress_ratio: 0.92,
      status: "NORMAL",
      limiting_factor: "Stormwater outfall tidal backflow",
      assessed_at: "2026-09-14T12:00:00Z",
    },
    relocation: {
      priority_level: "LOW",
      people_to_relocate: 0,
      reason: "Standard seasonal advisory sufficient with mangrove buffer intact",
      status: "PROPOSED",
      recommended_safe_zone_id: undefined,
      recommended_safe_zone_name: undefined,
    },
  },
  {
    id: "HAB-JK-BAR-05",
    name: "Baramulla Slope Mohalla",
    code: "HAB-JK-BAR-05",
    village: "Uplands Mohalla",
    district: "Baramulla",
    state: "Jammu and Kashmir",
    latitude: 34.2012,
    longitude: 74.3436,
    population: 540,
    housing_count: 110,
    status: "MONITORED",
    created_at: "2026-09-10T00:00:00Z",
    latest_risk_score: 88.0,
    latest_risk_level: "CRITICAL",
    primary_hazard: "Landslide & Geological Slope Degradation",
    population_profile: {
      total_population: 540,
      children_count: 130,
      elderly_count: 75,
      women_count: 270,
      special_vulnerabilities_count: 24,
    },
    infrastructure_profile: {
      road_accessibility: 3,
      water_availability: 3,
      sanitation: 3,
      electricity: 3,
      healthcare_access: 2,
      shelter_availability: 2,
      housing_condition: 2,
    },
    hazard_assessment: {
      flood_risk: 0.35,
      landslide_risk: 0.89,
      erosion_risk: 0.76,
      earthquake_risk: 0.85,
      fire_risk: 0.4,
      heatwave_risk: 0.1,
      cyclone_risk: 0.05,
      primary_hazard: "Landslide & Geological Slope Degradation",
      assessed_at: "2026-09-14T10:00:00Z",
    },
    risk_score: {
      composite_score: 88.0,
      risk_level: "CRITICAL",
      notes: "Unreinforced masonry structures situated on active slope erosion gullies along fault line.",
      calculated_at: "2026-09-15T08:30:00Z",
    },
    capacity_assessment: {
      carrying_capacity_people: 320,
      current_load: 540,
      capacity_stress_ratio: 1.69,
      status: "OVER_CAPACITY",
      limiting_factor: "Structural foundation instability & gully cutting",
      assessed_at: "2026-09-14T12:00:00Z",
    },
    relocation: {
      priority_level: "IMMEDIATE",
      people_to_relocate: 380,
      reason: "Immediate danger of catastrophic slope collapse during snowmelt",
      status: "PROPOSED",
      recommended_safe_zone_id: "SZ-JK-BAR-04",
      recommended_safe_zone_name: "Baramulla District Sports Complex Shelter",
    },
  },
  {
    id: "HAB-TN-TNJ-06",
    name: "Kaveri Delta Thottam",
    code: "HAB-TN-TNJ-06",
    village: "Thiruvaiyaru Lower",
    district: "Thanjavur",
    state: "Tamil Nadu",
    latitude: 10.8812,
    longitude: 79.1034,
    population: 890,
    housing_count: 210,
    status: "ACTIVE",
    created_at: "2026-09-10T00:00:00Z",
    latest_risk_score: 48.2,
    latest_risk_level: "SAFE_LOW",
    primary_hazard: "Seasonal Canals Drainage Congestion",
    population_profile: {
      total_population: 890,
      children_count: 190,
      elderly_count: 140,
      women_count: 445,
      special_vulnerabilities_count: 45,
    },
    infrastructure_profile: {
      road_accessibility: 4,
      water_availability: 4,
      sanitation: 3,
      electricity: 4,
      healthcare_access: 3,
      shelter_availability: 4,
      housing_condition: 4,
    },
    hazard_assessment: {
      flood_risk: 0.52,
      landslide_risk: 0.02,
      erosion_risk: 0.35,
      earthquake_risk: 0.15,
      fire_risk: 0.18,
      heatwave_risk: 0.65,
      cyclone_risk: 0.58,
      primary_hazard: "Seasonal Canals Drainage Congestion",
      assessed_at: "2026-09-14T10:00:00Z",
    },
    risk_score: {
      composite_score: 48.2,
      risk_level: "SAFE_LOW",
      notes: "Well-maintained distributary canals and elevated community shelters prevent acute inundation.",
      calculated_at: "2026-09-15T08:30:00Z",
    },
    capacity_assessment: {
      carrying_capacity_people: 1100,
      current_load: 890,
      capacity_stress_ratio: 0.81,
      status: "NORMAL",
      limiting_factor: "Seasonal drainage sluice maintenance",
      assessed_at: "2026-09-14T12:00:00Z",
    },
    relocation: {
      priority_level: "LOW",
      people_to_relocate: 0,
      reason: "Existing drainage buffer sufficient; regular embankment maintenance ongoing",
      status: "PROPOSED",
      recommended_safe_zone_id: undefined,
      recommended_safe_zone_name: undefined,
    },
  },
];

export const RAW_DEMO_SAFE_ZONES: SafeZoneItem[] = [
  {
    id: "SZ-UK-CHM-01",
    name: "Chamoli Plateau Relief Hub",
    code: "SZ-UK-CHM-01",
    district: "Chamoli",
    state: "Uttarakhand",
    latitude: 30.435,
    longitude: 79.362,
    max_capacity: 1200,
    current_occupancy: 150,
    available_capacity: 1050,
    occupancy_rate: 12.5,
    elevation_meters: 1640.0,
    status: "ACTIVE",
    safety_score: 94,
    road_access_score: 92,
    healthcare_score: 89,
    distance_km: 4.8,
    created_at: "2026-09-10T00:00:00Z",
  },
  {
    id: "SZ-UK-TEH-02",
    name: "Tehri Bypass Multipurpose Center",
    code: "SZ-UK-TEH-02",
    district: "Tehri Garhwal",
    state: "Uttarakhand",
    latitude: 30.162,
    longitude: 78.625,
    max_capacity: 900,
    current_occupancy: 80,
    available_capacity: 820,
    occupancy_rate: 8.9,
    elevation_meters: 820.0,
    status: "ACTIVE",
    safety_score: 88,
    road_access_score: 85,
    healthcare_score: 80,
    distance_km: 6.2,
    created_at: "2026-09-10T00:00:00Z",
  },
  {
    id: "SZ-UP-VAR-03",
    name: "Varanasi North Elevated Shelter Ground",
    code: "SZ-UP-VAR-03",
    district: "Varanasi",
    state: "Uttar Pradesh",
    latitude: 25.362,
    longitude: 83.004,
    max_capacity: 2500,
    current_occupancy: 320,
    available_capacity: 2180,
    occupancy_rate: 12.8,
    elevation_meters: 88.0,
    status: "ACTIVE",
    safety_score: 91,
    road_access_score: 95,
    healthcare_score: 92,
    distance_km: 5.4,
    created_at: "2026-09-10T00:00:00Z",
  },
  {
    id: "SZ-JK-BAR-04",
    name: "Baramulla District Sports Complex Shelter",
    code: "SZ-JK-BAR-04",
    district: "Baramulla",
    state: "Jammu and Kashmir",
    latitude: 34.218,
    longitude: 74.368,
    max_capacity: 1000,
    current_occupancy: 110,
    available_capacity: 890,
    occupancy_rate: 11.0,
    elevation_meters: 1590.0,
    status: "ACTIVE",
    safety_score: 89,
    road_access_score: 88,
    healthcare_score: 86,
    distance_km: 3.9,
    created_at: "2026-09-10T00:00:00Z",
  },
];

export const RAW_DEMO_ALERTS = [
  {
    id: "ALT-001",
    title: "Chamoli High Slope Instability & Erosion Warning",
    message:
      "DEMO NOTICE: Geological monitoring triggers Amber/Red threshold for Nandi Gram Tola due to intense antecedent rainfall and rapid toe erosion.",
    severity: "CRITICAL",
    alert_type: "LANDSLIDE_WARNING",
    habitation_name: "Nandi Gram Tola",
    is_active: true,
    issued_at: "2026-09-16T04:30:00Z",
  },
  {
    id: "ALT-002",
    title: "Varuna River Bank Level & Scour Advisory",
    message:
      "DEMO NOTICE: Water level in Varuna basin approaching warning mark; acute bank cutting flags immediate evacuation advisory.",
    severity: "HIGH",
    alert_type: "FLOOD_ALERT",
    habitation_name: "Varuna River Bank Pura",
    is_active: true,
    issued_at: "2026-09-16T03:15:00Z",
  },
  {
    id: "ALT-003",
    title: "Baramulla Seismic Vulnerability Advisory",
    message:
      "DEMO NOTICE: Structural audit flags unreinforced buildings along fault line in Uplands Mohalla with severe gully erosion.",
    severity: "CRITICAL",
    alert_type: "STRUCTURAL_RISK",
    habitation_name: "Baramulla Slope Mohalla",
    is_active: true,
    issued_at: "2026-09-15T22:00:00Z",
  },
  {
    id: "ALT-004",
    title: "Tehri Ridge Drainage & Hillside Erosion Advisory",
    message:
      "DEMO NOTICE: Blocked hillside drains and slope scouring reported in Devprayag Ridge; road maintenance crew dispatched.",
    severity: "MEDIUM",
    alert_type: "INFRASTRUCTURE_ALERT",
    habitation_name: "Devprayag Ridge Basti",
    is_active: true,
    issued_at: "2026-09-15T18:45:00Z",
  },
];

export const DEMO_DISCLAIMER =
  "DEMO DATA — NOT OFFICIAL GOVERNMENT DATA. All habitations, coordinates, population figures, and hazard vulnerability assessments are illustrative records generated for Aashray Disaster Management System.";

export function getMockDashboardSummary(): DashboardSummaryResponse {
  const critical = RAW_DEMO_HABITATIONS.filter((h) => h.latest_risk_level === "CRITICAL").length;
  const high = RAW_DEMO_HABITATIONS.filter((h) => h.latest_risk_level === "HIGH").length;
  const moderate = RAW_DEMO_HABITATIONS.filter((h) => h.latest_risk_level === "MODERATE").length;
  const low = RAW_DEMO_HABITATIONS.filter((h) => h.latest_risk_level === "SAFE_LOW").length;

  const totalPopAtRisk = RAW_DEMO_HABITATIONS.filter(
    (h) => h.latest_risk_level === "CRITICAL" || h.latest_risk_level === "HIGH"
  ).reduce((acc, h) => acc + h.population, 0);

  const immediateReloc = RAW_DEMO_HABITATIONS.filter(
    (h) => h.relocation.priority_level === "IMMEDIATE"
  ).length;

  const totalAssessed = RAW_DEMO_HABITATIONS.reduce((acc, h) => acc + h.population, 0);
  const childrenTotal = RAW_DEMO_HABITATIONS.reduce(
    (acc, h) => acc + h.population_profile.children_count,
    0
  );
  const elderlyTotal = RAW_DEMO_HABITATIONS.reduce(
    (acc, h) => acc + h.population_profile.elderly_count,
    0
  );
  const womenTotal = RAW_DEMO_HABITATIONS.reduce(
    (acc, h) => acc + h.population_profile.women_count,
    0
  );
  const specialTotal = RAW_DEMO_HABITATIONS.reduce(
    (acc, h) => acc + h.population_profile.special_vulnerabilities_count,
    0
  );

  return {
    disclaimer: DEMO_DISCLAIMER,
    kpis: {
      total_habitations: RAW_DEMO_HABITATIONS.length,
      critical_zones: critical,
      high_risk_areas: high,
      population_at_risk: totalPopAtRisk,
      immediate_relocation_cases: immediateReloc,
      open_complaints: 3,
    },
    risk_distribution: [
      {
        risk_level: "CRITICAL",
        count: critical,
        percentage: Math.round((critical / RAW_DEMO_HABITATIONS.length) * 100),
        color: "#ef4444",
      },
      {
        risk_level: "HIGH",
        count: high,
        percentage: Math.round((high / RAW_DEMO_HABITATIONS.length) * 100),
        color: "#f97316",
      },
      {
        risk_level: "MODERATE",
        count: moderate,
        percentage: Math.round((moderate / RAW_DEMO_HABITATIONS.length) * 100),
        color: "#f59e0b",
      },
      {
        risk_level: "SAFE_LOW",
        count: low,
        percentage: Math.round((low / RAW_DEMO_HABITATIONS.length) * 100),
        color: "#10b981",
      },
    ],
    population_vulnerability: {
      total_population_assessed: totalAssessed,
      children_total: childrenTotal,
      elderly_total: elderlyTotal,
      women_total: womenTotal,
      special_vulnerabilities_total: specialTotal,
    },
    highest_risk_habitations: RAW_DEMO_HABITATIONS.slice()
      .sort((a, b) => b.latest_risk_score - a.latest_risk_score)
      .map((h) => ({
        id: h.id,
        habitation: h.name,
        code: h.code,
        district: h.district,
        state: h.state,
        risk_level: h.latest_risk_level,
        risk_score: h.latest_risk_score,
        population: h.population,
        status: h.status,
        primary_hazard: h.primary_hazard,
      })),
    recent_alerts: RAW_DEMO_ALERTS.map((a) => ({
      id: a.id,
      title: a.title,
      message: a.message,
      severity: a.severity,
      alert_type: a.alert_type,
      habitation_name: a.habitation_name,
      issued_at: a.issued_at,
    })),
  };
}

export function getMockHabitations(params?: {
  district?: string;
  risk_level?: string;
  hazard?: string;
  relocation?: string;
  search?: string;
  skip?: number;
  limit?: number;
}): HabitationsResponse {
  let filtered = [...RAW_DEMO_HABITATIONS];

  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.code.toLowerCase().includes(q) ||
        h.village.toLowerCase().includes(q) ||
        h.district.toLowerCase().includes(q) ||
        h.state.toLowerCase().includes(q)
    );
  }

  if (params?.risk_level) {
    const r = params.risk_level.toUpperCase();
    filtered = filtered.filter((h) => h.latest_risk_level === r);
  }

  if (params?.district) {
    filtered = filtered.filter((h) => h.district.toLowerCase() === params.district?.toLowerCase());
  }

  if (params?.hazard) {
    const haz = params.hazard.toLowerCase();
    filtered = filtered.filter((h) => h.primary_hazard.toLowerCase().includes(haz));
  }

  if (params?.relocation) {
    const rel = params.relocation.toUpperCase();
    if (rel === "NOT_REQUIRED" || rel === "NONE") {
      filtered = filtered.filter(
        (h) => h.relocation.priority_level === "LOW" || h.relocation.people_to_relocate === 0
      );
    } else {
      filtered = filtered.filter((h) => h.relocation.priority_level === rel);
    }
  }

  const items: HabitationItem[] = filtered.map((h) => ({
    id: h.id,
    name: h.name,
    code: h.code,
    village: h.village,
    district: h.district,
    state: h.state,
    latitude: h.latitude,
    longitude: h.longitude,
    population: h.population,
    housing_count: h.housing_count,
    status: h.status,
    created_at: h.created_at,
    latest_risk_score: h.latest_risk_score,
    latest_risk_level: h.latest_risk_level,
    primary_hazard: h.primary_hazard,
  }));

  return {
    items,
    total: items.length,
    page: 1,
    page_size: params?.limit || 50,
    disclaimer: DEMO_DISCLAIMER,
  };
}

export function getMockHabitationDetail(id: string): HabitationDetail | null {
  const match = RAW_DEMO_HABITATIONS.find(
    (h) => h.id.toLowerCase() === id.toLowerCase() || h.code.toLowerCase() === id.toLowerCase()
  );
  if (!match) return null;

  return {
    id: match.id,
    name: match.name,
    code: match.code,
    village: match.village,
    district: match.district,
    state: match.state,
    latitude: match.latitude,
    longitude: match.longitude,
    population: match.population,
    housing_count: match.housing_count,
    status: match.status,
    created_at: match.created_at,
    latest_risk_score: match.latest_risk_score,
    latest_risk_level: match.latest_risk_level,
    primary_hazard: match.primary_hazard,
    disclaimer: DEMO_DISCLAIMER,
    population_profile: match.population_profile,
    infrastructure_profile: match.infrastructure_profile,
    hazard_assessments: [match.hazard_assessment],
    risk_scores: [match.risk_score],
    capacity_assessments: [match.capacity_assessment],
  };
}

export function getMockRiskSummary(): RiskSummaryResponse {
  const critical = RAW_DEMO_HABITATIONS.filter((h) => h.latest_risk_level === "CRITICAL").length;
  const high = RAW_DEMO_HABITATIONS.filter((h) => h.latest_risk_level === "HIGH").length;
  const moderate = RAW_DEMO_HABITATIONS.filter((h) => h.latest_risk_level === "MODERATE").length;
  const low = RAW_DEMO_HABITATIONS.filter((h) => h.latest_risk_level === "SAFE_LOW").length;

  return {
    disclaimer: DEMO_DISCLAIMER,
    total_assessed: RAW_DEMO_HABITATIONS.length,
    critical_count: critical,
    high_count: high,
    moderate_count: moderate,
    low_count: low,
    hazard_breakdowns: [
      {
        hazard_type: "Landslide & Slope Instability",
        average_risk: 76.5,
        affected_habitations_count: 3,
        highest_risk_habitation: "Nandi Gram Tola",
      },
      {
        hazard_type: "Riverine & Inundation Flood",
        average_risk: 69.2,
        affected_habitations_count: 2,
        highest_risk_habitation: "Varuna River Bank Pura",
      },
      {
        hazard_type: "Bank Cutting & Gully Erosion",
        average_risk: 71.4,
        affected_habitations_count: 4,
        highest_risk_habitation: "Varuna River Bank Pura",
      },
      {
        hazard_type: "Seismic Ground Motion Vulnerability",
        average_risk: 64.0,
        affected_habitations_count: 3,
        highest_risk_habitation: "Baramulla Slope Mohalla",
      },
    ],
    top_vulnerable_records: RAW_DEMO_HABITATIONS.slice()
      .sort((a, b) => b.latest_risk_score - a.latest_risk_score)
      .map((h) => ({
        habitation_id: h.id,
        habitation_name: h.name,
        district: h.district,
        composite_score: h.latest_risk_score,
        risk_level: h.latest_risk_level,
        primary_hazard: h.primary_hazard,
        population: h.population,
        calculated_at: h.risk_score.calculated_at,
      })),
  };
}

export function getMockCapacitySummary(): CapacitySummaryResponse {
  const normal = RAW_DEMO_HABITATIONS.filter((h) => h.capacity_assessment.status === "NORMAL").length;
  const stressed = RAW_DEMO_HABITATIONS.filter(
    (h) => h.capacity_assessment.status === "STRESSED"
  ).length;
  const over = RAW_DEMO_HABITATIONS.filter(
    (h) => h.capacity_assessment.status === "OVER_CAPACITY"
  ).length;

  const avgStress = Number(
    (
      RAW_DEMO_HABITATIONS.reduce(
        (acc, h) => acc + h.capacity_assessment.capacity_stress_ratio,
        0
      ) / RAW_DEMO_HABITATIONS.length
    ).toFixed(2)
  );

  return {
    disclaimer: DEMO_DISCLAIMER,
    total_evaluated: RAW_DEMO_HABITATIONS.length,
    normal_count: normal,
    stressed_count: stressed,
    over_capacity_count: over,
    average_stress_ratio: avgStress,
    habitations: RAW_DEMO_HABITATIONS.map((h) => ({
      habitation_id: h.id,
      habitation_name: h.name,
      district: h.district,
      carrying_capacity_people: h.capacity_assessment.carrying_capacity_people,
      current_load: h.capacity_assessment.current_load,
      capacity_stress_ratio: h.capacity_assessment.capacity_stress_ratio,
      status: h.capacity_assessment.status,
      limiting_factor: h.capacity_assessment.limiting_factor,
    })),
  };
}

export function getMockRelocationSummary(): RelocationSummaryResponse {
  const immediate = RAW_DEMO_HABITATIONS.filter(
    (h) => h.relocation.priority_level === "IMMEDIATE"
  ).length;
  const high = RAW_DEMO_HABITATIONS.filter((h) => h.relocation.priority_level === "HIGH").length;
  const totalPeople = RAW_DEMO_HABITATIONS.reduce(
    (acc, h) => acc + h.relocation.people_to_relocate,
    0
  );

  return {
    disclaimer: DEMO_DISCLAIMER,
    immediate_cases: immediate,
    high_priority_cases: high,
    total_people_pending_relocation: totalPeople,
    allocated_safe_zones_count: 4,
    recommendations: RAW_DEMO_HABITATIONS.map((h, i) => ({
      id: `REC-2026-${i + 1}`,
      habitation_id: h.id,
      habitation_name: h.name,
      district: h.district,
      priority_level: h.relocation.priority_level,
      people_to_relocate: h.relocation.people_to_relocate,
      reason: h.relocation.reason,
      safe_zone_id: h.relocation.recommended_safe_zone_id,
      safe_zone_name: h.relocation.recommended_safe_zone_name,
      status: h.relocation.status,
      recommended_at: "2026-09-15T09:00:00Z",
    })),
  };
}

export function getMockSafeZones(): SafeZoneListResponse {
  const totalMax = RAW_DEMO_SAFE_ZONES.reduce((acc, sz) => acc + sz.max_capacity, 0);
  const totalCurrent = RAW_DEMO_SAFE_ZONES.reduce((acc, sz) => acc + sz.current_occupancy, 0);
  const totalAvail = RAW_DEMO_SAFE_ZONES.reduce((acc, sz) => acc + sz.available_capacity, 0);

  return {
    disclaimer: DEMO_DISCLAIMER,
    total_safe_zones: RAW_DEMO_SAFE_ZONES.length,
    total_max_capacity: totalMax,
    total_current_occupancy: totalCurrent,
    total_available_capacity: totalAvail,
    items: RAW_DEMO_SAFE_ZONES,
  };
}

export function getMockAlerts(activeOnly: boolean = true): AlertListResponse {
  const items = activeOnly ? RAW_DEMO_ALERTS.filter((a) => a.is_active) : RAW_DEMO_ALERTS;
  return {
    disclaimer: DEMO_DISCLAIMER,
    total_alerts: items.length,
    active_critical_count: items.filter((a) => a.severity === "CRITICAL").length,
    active_high_count: items.filter((a) => a.severity === "HIGH").length,
    active_medium_count: items.filter((a) => a.severity === "MEDIUM").length,
    items,
  };
}

export const RAW_DEMO_COMPLAINTS: any[] = [
  {
    id: "cmp-001",
    complaint_code: "CMP-2026-0012",
    user_id: "demo-user-citizen-01",
    habitation_id: "HAB-UK-CHM-01",
    habitation_name: "Nandi Gram Tola",
    issue_type: "Flooding",
    location_text: "Ward 3, Near Primary School, Nandikot",
    description: "Severe seasonal runoff waterlogging observed after 48h rain; retaining wall breached.",
    photo_url: "",
    contact_name: "Ramesh Kumar",
    contact_phone: "+91 98765 43210",
    status: "In Progress",
    assigned_to: "District Flood Response Cell",
    admin_notes: "Emergency drainage sandbagging deployed. Monitoring river gage.",
    created_at: "2026-09-14T08:30:00Z",
    updated_at: "2026-09-15T10:15:00Z",
  },
  {
    id: "cmp-002",
    complaint_code: "CMP-2026-0015",
    user_id: "demo-user-citizen-02",
    habitation_id: "HAB-UK-CHM-01",
    habitation_name: "Nandi Gram Tola",
    issue_type: "Landslide",
    location_text: "Upper Ridge Road, Sector B",
    description: "Fissures and tension cracks appearing along the hillside road above residential cluster.",
    photo_url: "",
    contact_name: "Sunita Devi",
    contact_phone: "+91 98111 22334",
    status: "Under Review",
    assigned_to: "Geotechnical Survey Team",
    admin_notes: "Assigned for drone photogrammetry and tilt-meter inspection.",
    created_at: "2026-09-15T11:20:00Z",
    updated_at: "2026-09-15T11:20:00Z",
  },
  {
    id: "cmp-003",
    complaint_code: "CMP-2026-0021",
    user_id: "demo-user-citizen-03",
    habitation_id: "HAB-HP-KUL-02",
    habitation_name: "Beas Riverbed Basti",
    issue_type: "Blocked Road",
    location_text: "Bridge Approach Culvert 4",
    description: "Debris from boulder fall has partially blocked emergency medical ambulance route.",
    photo_url: "",
    contact_name: "Manoj Negi",
    contact_phone: "+91 97234 56789",
    status: "Resolved",
    assigned_to: "Public Works Department (PWD)",
    admin_notes: "Bulldozer cleared debris at 08:30 hrs. Traffic restored.",
    created_at: "2026-09-13T14:10:00Z",
    updated_at: "2026-09-14T09:00:00Z",
  },
];

export function getMockComplaints(statusFilter?: string, issueFilter?: string) {
  let list = [...RAW_DEMO_COMPLAINTS];
  if (statusFilter && statusFilter !== "ALL") {
    list = list.filter((c) => c.status.toLowerCase() === statusFilter.toLowerCase());
  }
  if (issueFilter && issueFilter !== "ALL") {
    list = list.filter((c) => c.issue_type.toLowerCase() === issueFilter.toLowerCase());
  }
  return {
    disclaimer: DEMO_DISCLAIMER,
    items: list,
    total: list.length,
    open_count: RAW_DEMO_COMPLAINTS.filter((c) => ["Submitted", "Under Review"].includes(c.status)).length,
    in_progress_count: RAW_DEMO_COMPLAINTS.filter((c) => c.status === "In Progress").length,
    resolved_count: RAW_DEMO_COMPLAINTS.filter((c) => c.status === "Resolved").length,
  };
}

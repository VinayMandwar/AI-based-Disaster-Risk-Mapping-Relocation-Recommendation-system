import {
  DashboardSummaryResponse,
  HabitationsResponse,
  HabitationDetail,
  RiskSummaryResponse,
  CapacitySummaryResponse,
  RelocationSummaryResponse,
  SafeZoneListResponse,
  AlertListResponse,
} from "@/types";
import {
  getMockDashboardSummary,
  getMockHabitations,
  getMockHabitationDetail,
  getMockRiskSummary,
  getMockCapacitySummary,
  getMockRelocationSummary,
  getMockSafeZones,
  getMockAlerts,
} from "./demoData";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

async function fetchJson<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return (await res.json()) as T;
  } catch (error) {
    // Graceful fallback logger
    console.warn(`Live API unavailable for ${url}, switching to built-in Aashray demo dataset.`);
    throw error;
  }
}

export async function fetchHealth() {
  try {
    return await fetchJson<{ status: string; service: string; database: { status: string } }>("/api/health");
  } catch {
    return { status: "offline", service: "aashray-demo-mode", database: { status: "demo" } };
  }
}

export async function fetchDashboardSummary(): Promise<DashboardSummaryResponse> {
  try {
    return await fetchJson<DashboardSummaryResponse>("/api/dashboard/summary");
  } catch {
    return getMockDashboardSummary();
  }
}

export async function fetchHabitations(params?: {
  district?: string;
  risk_level?: string;
  hazard?: string;
  relocation?: string;
  search?: string;
  skip?: number;
  limit?: number;
}): Promise<HabitationsResponse> {
  try {
    const query = new URLSearchParams();
    if (params?.district) query.set("district", params.district);
    if (params?.risk_level) query.set("risk_level", params.risk_level);
    if (params?.hazard) query.set("hazard", params.hazard);
    if (params?.relocation) query.set("relocation", params.relocation);
    if (params?.search) query.set("search", params.search);
    if (params?.skip !== undefined) query.set("skip", params.skip.toString());
    if (params?.limit !== undefined) query.set("limit", params.limit.toString());

    const queryString = query.toString() ? `?${query.toString()}` : "";
    return await fetchJson<HabitationsResponse>(`/api/habitations${queryString}`);
  } catch {
    return getMockHabitations(params);
  }
}

export async function fetchHabitationDetail(id: string): Promise<HabitationDetail> {
  try {
    return await fetchJson<HabitationDetail>(`/api/habitations/${id}`);
  } catch {
    const mock = getMockHabitationDetail(id);
    if (!mock) {
      throw new Error(`Habitation "${id}" not found in demo registry.`);
    }
    return mock;
  }
}

export async function fetchRiskSummary(): Promise<RiskSummaryResponse> {
  try {
    return await fetchJson<RiskSummaryResponse>("/api/risk/summary");
  } catch {
    return getMockRiskSummary();
  }
}

export async function fetchCapacitySummary(): Promise<CapacitySummaryResponse> {
  try {
    return await fetchJson<CapacitySummaryResponse>("/api/capacity/summary");
  } catch {
    return getMockCapacitySummary();
  }
}

export async function fetchRelocationSummary(): Promise<RelocationSummaryResponse> {
  try {
    return await fetchJson<RelocationSummaryResponse>("/api/relocation/summary");
  } catch {
    return getMockRelocationSummary();
  }
}

export async function fetchSafeZones(): Promise<SafeZoneListResponse> {
  try {
    return await fetchJson<SafeZoneListResponse>("/api/safe-zones");
  } catch {
    return getMockSafeZones();
  }
}

export async function fetchAlerts(activeOnly: boolean = true): Promise<AlertListResponse> {
  try {
    return await fetchJson<AlertListResponse>(`/api/alerts?active_only=${activeOnly}`);
  } catch {
    return getMockAlerts(activeOnly);
  }
}

export async function fetchComplaints(params?: {
  status?: string;
  issue_type?: string;
  habitation_id?: string;
  search?: string;
}) {
  try {
    const query = new URLSearchParams();
    if (params?.status && params.status !== "ALL") query.set("status", params.status);
    if (params?.issue_type && params.issue_type !== "ALL") query.set("issue_type", params.issue_type);
    if (params?.habitation_id) query.set("habitation_id", params.habitation_id);
    if (params?.search) query.set("search", params.search);

    const qs = query.toString() ? `?${query.toString()}` : "";
    return await fetchJson<any>(`/api/complaints${qs}`);
  } catch {
    const { getMockComplaints } = await import("./demoData");
    return getMockComplaints(params?.status, params?.issue_type);
  }
}

export async function submitCitizenComplaint(payload: {
  issue_type: string;
  habitation_id?: string;
  location_text: string;
  description: string;
  photo_url?: string;
  contact_name: string;
  contact_phone: string;
}) {
  const url = `${API_BASE}/api/complaints`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to submit report");
    return await res.json();
  } catch {
    // Demo fallback: create local simulation
    const randCode = `CMP-2026-00${Math.floor(Math.random() * 80 + 20)}`;
    const newRecord = {
      id: `mock-${Date.now()}`,
      complaint_code: randCode,
      ...payload,
      status: "Submitted",
      assigned_to: "District Response Cell (Pending Review)",
      admin_notes: "Report logged via citizen portal. Inspection queued.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return newRecord;
  }
}

export async function updateComplaintStatus(
  id: string,
  payload: { status?: string; assigned_to?: string; admin_notes?: string }
) {
  const url = `${API_BASE}/api/complaints/${id}`;
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update complaint");
    return await res.json();
  } catch {
    return { id, ...payload, updated_at: new Date().toISOString() };
  }
}

export async function queryAIAssistant(payload: {
  query: string;
  role?: string;
  habitation_id?: string;
}) {
  const url = `${API_BASE}/api/ai/query`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("AI query failed");
    return await res.json();
  } catch {
    // Intelligent local fallback if backend offline
    const q = payload.query.toLowerCase();
    let ans = "Aashray Disaster Decision Intelligence: ";
    let actions = ["View Risk Map", "Check Safe Zones", "View Alerts"];
    if (q.includes("risk") || q.includes("score")) {
      ans = "Based on multi-hazard GIS modeling, high-vulnerability habitations face combined toe erosion, slope failure, and drainage saturation. Critical habitations include Nandi Gram Tola (91.5/100) and Beas Riverbed Basti (88.0/100).";
      actions = ["View Critical Habitats", "Check Slope Inclinometer Data"];
    } else if (q.includes("relocation") || q.includes("evacuat")) {
      ans = "Immediate relocation status is recommended for habitations with critical structural exposure where in-situ stabilization is technically unviable. Safe zones have been pre-surveyed with road connectivity and medical support.";
      actions = ["View Relocation Pipeline", "Assign Candidate Safe Zones"];
    } else if (q.includes("safe zone") || q.includes("shelter")) {
      ans = "Designated district safe zones provide vetted elevation above high-flood lines, verified drinking water, and road accessibility. Top shelters include Nandprayag Community Relief Complex and Kullu Valley Safe Center.";
      actions = ["Open Safe Zone Directory", "View Capacity Gauges"];
    } else {
      ans = "I can analyze hazard vulnerabilities (Flood, Landslide, Erosion), carrying capacity limits, candidate safe zones, and relocation priorities based on actual ground telemetry.";
    }
    return {
      query: payload.query,
      answer: ans,
      suggested_actions: actions,
      related_entities: {},
      data_available: true,
      disclaimer: "DEMO MODE — Fallback Response",
    };
  }
}


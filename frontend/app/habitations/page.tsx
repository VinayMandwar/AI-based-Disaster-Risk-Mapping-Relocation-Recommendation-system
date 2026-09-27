"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchHabitations, fetchHabitationDetail } from "@/lib/api";
import { HabitationItem, HabitationDetail } from "@/types";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatRiskLevel } from "@/lib/utils";
import {
  Search,
  Filter,
  MapPin,
  Users,
  Home,
  X,
  ShieldAlert,
  Zap,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  Waves,
  Mountain,
  AlertTriangle,
  Flame,
} from "lucide-react";

function HabitationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [habitations, setHabitations] = useState<HabitationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRisk, setSelectedRisk] = useState<string>("");
  const [selectedHazard, setSelectedHazard] = useState<string>("");
  const [selectedRelocation, setSelectedRelocation] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedHabitation, setSelectedHabitation] = useState<HabitationDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Sync initial query params on mount
  useEffect(() => {
    const riskParam = searchParams.get("risk") || "";
    const hazardParam = searchParams.get("hazard") || "";
    const relocParam = searchParams.get("relocation") || "";
    const distParam = searchParams.get("district") || "";
    const queryParam = searchParams.get("search") || "";

    if (riskParam) setSelectedRisk(riskParam);
    if (hazardParam) setSelectedHazard(hazardParam);
    if (relocParam) setSelectedRelocation(relocParam);
    if (distParam) setSelectedDistrict(distParam);
    if (queryParam) setSearch(queryParam);
  }, [searchParams]);

  const loadHabitations = async () => {
    setLoading(true);
    try {
      const res = await fetchHabitations({
        search: search || undefined,
        risk_level: selectedRisk || undefined,
        hazard: selectedHazard || undefined,
        relocation: selectedRelocation || undefined,
        district: selectedDistrict || undefined,
      });
      setHabitations(res.items);
    } catch (err) {
      console.error("Failed to load habitations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabitations();
  }, [selectedRisk, selectedHazard, selectedRelocation, selectedDistrict]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadHabitations();
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedRisk("");
    setSelectedHazard("");
    setSelectedRelocation("");
    setSelectedDistrict("");
    router.replace("/habitations");
  };

  const handleSelectHabitation = async (id: string) => {
    setDetailLoading(true);
    try {
      const detail = await fetchHabitationDetail(id);
      setSelectedHabitation(detail);
    } catch (err) {
      console.error("Failed to fetch detail:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const activeFilterCount =
    (selectedRisk ? 1 : 0) +
    (selectedHazard ? 1 : 0) +
    (selectedRelocation ? 1 : 0) +
    (selectedDistrict ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Habitation Vulnerability Registry
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              Module 2
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Official multi-hazard registry of surveyed settlements, demographic cohorts, and evacuation priorities.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/relocation"
            className="text-xs font-semibold px-3 py-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-sm flex items-center space-x-1.5"
          >
            <span>Relocation Command Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by habitation name, code, village, district, or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto">
            <button
              type="submit"
              className="flex-1 md:flex-initial px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Search
            </button>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center space-x-1 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ({activeFilterCount})</span>
              </button>
            )}
          </div>
        </form>

        {/* Multi-Hazard & Demographic Filter Dropdowns */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* 1. Risk Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Risk Category
            </label>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Risk Levels</option>
              <option value="CRITICAL">🔴 Critical Red Zone</option>
              <option value="HIGH">🟠 High Risk</option>
              <option value="MODERATE">🟡 Moderate Risk</option>
              <option value="SAFE_LOW">🟢 Safe / Low Risk</option>
            </select>
          </div>

          {/* 2. Hazard Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Primary Hazard
            </label>
            <select
              value={selectedHazard}
              onChange={(e) => setSelectedHazard(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Hazards</option>
              <option value="Flood">🌊 Flood Exposure</option>
              <option value="Landslide">⛰️ Landslide Scarp</option>
              <option value="Erosion">⚠️ Bank / Slope Erosion</option>
            </select>
          </div>

          {/* 3. Relocation Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Relocation Priority
            </label>
            <select
              value={selectedRelocation}
              onChange={(e) => setSelectedRelocation(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Relocation States</option>
              <option value="IMMEDIATE">🚨 Immediate Relocation</option>
              <option value="HIGH">⚡ High Priority</option>
              <option value="NOT_REQUIRED">✅ Not Required / Stable</option>
            </select>
          </div>

          {/* 4. District Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              District / Region
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Districts</option>
              <option value="Chamoli">Chamoli (Uttarakhand)</option>
              <option value="Tehri Garhwal">Tehri Garhwal (Uttarakhand)</option>
              <option value="Varanasi">Varanasi (Uttar Pradesh)</option>
              <option value="North Goa">North Goa (Goa)</option>
              <option value="Baramulla">Baramulla (Jammu & Kashmir)</option>
              <option value="Thanjavur">Thanjavur (Tamil Nadu)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Registry List & Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={selectedHabitation ? "lg:col-span-7" : "lg:col-span-12"}>
          <Card>
            <CardHeader
              title={`Surveyed Habitations (${habitations.length})`}
              subtitle="Select any settlement to inspect full multi-hazard exposure metrics or click View Full Assessment"
            />
            <CardContent className="p-0">
              {loading ? (
                <div className="p-12 text-center text-sm text-slate-400">Loading settlements...</div>
              ) : habitations.length === 0 ? (
                <div className="p-12 text-center text-sm text-slate-500">
                  <p>No habitations match your selected search filter criteria.</p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-2 text-xs text-emerald-700 font-semibold underline"
                  >
                    Clear active filters
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {habitations.map((hab) => (
                    <div
                      key={hab.id}
                      onClick={() => handleSelectHabitation(hab.id)}
                      className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-colors ${
                        selectedHabitation?.id === hab.id
                          ? "bg-emerald-50/70 border-l-4 border-emerald-600"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-slate-900 text-sm">{hab.name}</h3>
                          <span className="font-mono text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                            {hab.code}
                          </span>
                          <Badge riskLevel={hab.latest_risk_level}>
                            {formatRiskLevel(hab.latest_risk_level)}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {hab.village}, {hab.district} ({hab.state})
                            </span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{hab.population.toLocaleString()} residents</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Home className="w-3.5 h-3.5 text-slate-400" />
                            <span>{hab.housing_count} units</span>
                          </span>
                        </div>
                        <div className="text-xs text-emerald-800 font-medium">
                          Hazard Vector: {hab.primary_hazard}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                        <div className="text-right hidden sm:block">
                          <div className="text-[11px] text-slate-400 uppercase font-semibold">Composite Score</div>
                          <div className="text-base font-extrabold text-slate-900">
                            {hab.latest_risk_score ? `${hab.latest_risk_score}/100` : "--"}
                          </div>
                        </div>

                        <Link
                          href={`/habitations/${hab.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-900 text-white hover:bg-emerald-700 transition-colors flex items-center space-x-1 shadow-sm"
                        >
                          <span>Full Assessment</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Habitation Profile Detail Side Preview */}
        {selectedHabitation && (
          <div className="lg:col-span-5">
            <Card className="sticky top-20 shadow-md">
              <CardHeader
                title={selectedHabitation.name}
                subtitle={`Code: ${selectedHabitation.code} • ${selectedHabitation.district}, ${selectedHabitation.state}`}
                action={
                  <button
                    onClick={() => setSelectedHabitation(null)}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                }
              />
              <CardContent className="space-y-4">
                {/* Composite Score & Priority Alert */}
                <div className="p-3 rounded-lg bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Composite Risk Index
                    </span>
                    <div className="text-2xl font-black text-white">
                      {selectedHabitation.latest_risk_score} / 100
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Risk Level
                    </span>
                    <div>
                      <Badge riskLevel={selectedHabitation.latest_risk_level}>
                        {formatRiskLevel(selectedHabitation.latest_risk_level)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button to Detail View */}
                <Link
                  href={`/habitations/${selectedHabitation.id}`}
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Full Multi-Factor Assessment ({selectedHabitation.name})</span>
                </Link>

                {/* Geographic Profile */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-400 block">Coordinates</span>
                    <span className="font-mono font-medium text-slate-800">
                      {selectedHabitation.latitude.toFixed(4)}°N, {selectedHabitation.longitude.toFixed(4)}°E
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Status</span>
                    <span className="font-semibold text-slate-800">{selectedHabitation.status}</span>
                  </div>
                </div>

                {/* Demographic Breakdown */}
                {selectedHabitation.population_profile && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center space-x-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>Demographic Profile ({selectedHabitation.population} residents)</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 border rounded bg-white">
                        <span className="text-slate-500 block">Children (&lt;12y)</span>
                        <span className="font-bold text-slate-900">
                          {selectedHabitation.population_profile.children_count}
                        </span>
                      </div>
                      <div className="p-2 border rounded bg-white">
                        <span className="text-slate-500 block">Elderly (&gt;65y)</span>
                        <span className="font-bold text-slate-900">
                          {selectedHabitation.population_profile.elderly_count}
                        </span>
                      </div>
                      <div className="p-2 border rounded bg-white">
                        <span className="text-slate-500 block">Women</span>
                        <span className="font-bold text-slate-900">
                          {selectedHabitation.population_profile.women_count}
                        </span>
                      </div>
                      <div className="p-2 border rounded bg-white">
                        <span className="text-slate-500 block">Special Vulnerabilities</span>
                        <span className="font-bold text-rose-700">
                          {selectedHabitation.population_profile.special_vulnerabilities_count}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Infrastructure Profile */}
                {selectedHabitation.infrastructure_profile && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center space-x-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Infrastructure Access Ratings (1-5)</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 border rounded bg-slate-50 flex justify-between">
                        <span>Road Access:</span>
                        <span className="font-bold">
                          {selectedHabitation.infrastructure_profile.road_accessibility}/5
                        </span>
                      </div>
                      <div className="p-2 border rounded bg-slate-50 flex justify-between">
                        <span>Potable Water:</span>
                        <span className="font-bold">
                          {selectedHabitation.infrastructure_profile.water_availability}/5
                        </span>
                      </div>
                      <div className="p-2 border rounded bg-slate-50 flex justify-between">
                        <span>Sanitation:</span>
                        <span className="font-bold">
                          {selectedHabitation.infrastructure_profile.sanitation}/5
                        </span>
                      </div>
                      <div className="p-2 border rounded bg-slate-50 flex justify-between">
                        <span>Healthcare:</span>
                        <span className="font-bold">
                          {selectedHabitation.infrastructure_profile.healthcare_access}/5
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Multi-Hazard Susceptibility */}
                {selectedHabitation.hazard_assessments.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center space-x-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Hazard Vector Susceptibility</span>
                    </h4>
                    <div className="space-y-2 text-xs">
                      {Object.entries({
                        "Flood Risk": selectedHabitation.hazard_assessments[0].flood_risk,
                        "Landslide Risk": selectedHabitation.hazard_assessments[0].landslide_risk,
                        "Erosion Scour": selectedHabitation.hazard_assessments[0].erosion_risk || 0.7,
                        "Earthquake Ground Motion": selectedHabitation.hazard_assessments[0].earthquake_risk,
                      }).map(([hzName, val]) => (
                        <div key={hzName} className="space-y-1">
                          <div className="flex justify-between text-slate-600">
                            <span>{hzName}</span>
                            <span className="font-bold">{Math.round(val * 100)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                val > 0.8
                                  ? "bg-rose-500"
                                  : val > 0.6
                                  ? "bg-orange-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{ width: `${Math.round(val * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HabitationsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-400">Loading Habitations Registry...</div>}>
      <HabitationsContent />
    </Suspense>
  );
}

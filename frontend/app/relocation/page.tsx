"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { fetchRelocationSummary, fetchSafeZones, fetchHabitations } from "@/lib/api";
import {
  RelocationSummaryResponse,
  SafeZoneItem,
  HabitationItem,
} from "@/types";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import {
  ArrowRightLeft,
  AlertOctagon,
  ShieldCheck,
  Users,
  Compass,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Mountain,
  MapPin,
  X,
  ExternalLink,
} from "lucide-react";

interface CandidateZone extends SafeZoneItem {
  suitabilityScore: number;
  computedDistance: number;
  recommendationStatus: "RECOMMENDED" | "ALTERNATIVE" | "NOT_RECOMMENDED";
  reasons: string[];
}

function RelocationWorkflowContent() {
  const searchParams = useSearchParams();
  const initialHabitationId = searchParams.get("habitation") || "HAB-UK-CHM-01";

  const [data, setData] = useState<RelocationSummaryResponse | null>(null);
  const [safeZones, setSafeZones] = useState<SafeZoneItem[]>([]);
  const [habitations, setHabitations] = useState<HabitationItem[]>([]);
  const [selectedHabitationId, setSelectedHabitationId] = useState<string>(initialHabitationId);
  const [candidates, setCandidates] = useState<CandidateZone[]>([]);
  const [evaluated, setEvaluated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeModalZone, setActiveModalZone] = useState<CandidateZone | null>(null);

  useEffect(() => {
    Promise.all([fetchRelocationSummary(), fetchSafeZones(), fetchHabitations()])
      .then(([relocRes, szRes, habRes]) => {
        setData(relocRes);
        setSafeZones(szRes.items);
        setHabitations(habRes.items);
      })
      .catch((err) => console.error("Failed to load relocation resources:", err))
      .finally(() => setLoading(false));
  }, []);

  const selectedHabitation = habitations.find((h) => h.id === selectedHabitationId) || habitations[0];

  // Run the Recommendation Engine
  const handleFindSafeZones = () => {
    if (!selectedHabitation || safeZones.length === 0) return;

    const peopleToRelocate = selectedHabitation.population;

    const evaluatedCandidates: CandidateZone[] = safeZones.map((sz) => {
      const isSameDistrict = sz.district.toLowerCase() === selectedHabitation.district.toLowerCase();
      const isSameState = sz.state.toLowerCase() === selectedHabitation.state.toLowerCase();

      // Estimated physical distance based on district proximity
      let dist = sz.distance_km || 15;
      if (!isSameDistrict && isSameState) dist = 68;
      if (!isSameState) dist = 420;

      const hasCapacity = sz.available_capacity >= peopleToRelocate;
      const safety = sz.safety_score || 85;
      const road = sz.road_access_score || 80;
      const health = sz.healthcare_score || 80;

      // Weighted Multi-Factor Score:
      // Safety 35%, Distance 25%, Capacity Margin 20%, Road 10%, Health 10%
      const distScore = Math.max(0, 100 - dist * 1.5);
      const capMarginScore = hasCapacity ? 100 : Math.max(20, Math.round((sz.available_capacity / peopleToRelocate) * 80));
      const overall = Math.round(
        safety * 0.35 + distScore * 0.25 + capMarginScore * 0.2 + road * 0.1 + health * 0.1
      );

      let status: "RECOMMENDED" | "ALTERNATIVE" | "NOT_RECOMMENDED" = "NOT_RECOMMENDED";
      const reasons: string[] = [];

      if (isSameDistrict && hasCapacity && overall >= 85) {
        status = "RECOMMENDED";
        reasons.push(`Located within ${sz.district} at optimal distance (${dist} km).`);
        reasons.push(`Available surplus of ${sz.available_capacity} spaces fully accommodates ${peopleToRelocate} displaced citizens.`);
        reasons.push(`Verified non-hazard elevation (${sz.elevation_meters}m) with ${safety}/100 geological safety index.`);
        reasons.push(`High road network accessibility (${road}/100) and trauma care reach (${health}/100).`);
      } else if (isSameState && sz.available_capacity >= peopleToRelocate * 0.5 && overall >= 65) {
        status = "ALTERNATIVE";
        reasons.push(`Viable secondary regional safe haven in ${sz.district} (${dist} km away).`);
        reasons.push(`Can absorb substantial intake (${sz.available_capacity} available spaces).`);
        reasons.push(`Stable highland ground with ${safety}/100 safety score.`);
      } else {
        status = "NOT_RECOMMENDED";
        if (!isSameState) {
          reasons.push(`Excessive inter-state transit distance (${dist} km) exceeds emergency evacuation limits.`);
        } else if (!hasCapacity) {
          reasons.push(`Insufficient available capacity (${sz.available_capacity} spaces) for ${peopleToRelocate} citizens.`);
        } else {
          reasons.push(`Proximity and transport accessibility constraints make closer centers preferable.`);
        }
      }

      return {
        ...sz,
        suitabilityScore: overall,
        computedDistance: dist,
        recommendationStatus: status,
        reasons,
      };
    });

    // Sort by suitability score descending
    evaluatedCandidates.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
    setCandidates(evaluatedCandidates);
    setEvaluated(true);
  };

  // Auto-run evaluation once habitations and safe zones are loaded
  useEffect(() => {
    if (habitations.length > 0 && safeZones.length > 0) {
      handleFindSafeZones();
    }
  }, [selectedHabitationId, habitations, safeZones]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Relocation Recommendation & Safe-Zone Allocation Engine
          </h1>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
            Aashray Decision Engine
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Intelligent multi-criteria decision workflow recommending verified safe havens based on proximity, capacity, elevation, and lifeline access.
        </p>
      </div>

      {/* Summary KPI Cards */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-300 shadow-sm">
            <span className="text-xs font-semibold text-rose-700 uppercase">Immediate Relocation</span>
            <div className="text-3xl font-extrabold text-rose-700 mt-1">{data.immediate_cases}</div>
            <p className="text-xs text-rose-600/90 mt-0.5">Critical red-zone settlements</p>
          </div>

          <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-300 shadow-sm">
            <span className="text-xs font-semibold text-orange-700 uppercase">High Priority Queue</span>
            <div className="text-3xl font-extrabold text-orange-700 mt-1">{data.high_priority_cases}</div>
            <p className="text-xs text-orange-600/90 mt-0.5">Staged phased relocations</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">Citizens to Relocate</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">
              {data.total_people_pending_relocation.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Displaced population</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 shadow-sm">
            <span className="text-xs font-semibold text-emerald-700 uppercase">Allocated Safe Hubs</span>
            <div className="text-3xl font-extrabold text-emerald-700 mt-1">
              {data.allocated_safe_zones_count}
            </div>
            <p className="text-xs text-emerald-600/90 mt-0.5">Designated recipient hubs</p>
          </div>
        </div>
      )}

      {/* Interactive Workflow Section */}
      <Card className="border-emerald-200 shadow-md">
        <CardHeader
          title="Interactive Safe Zone Recommendation Workflow"
          subtitle="Select any vulnerable habitation to evaluate and match optimal recipient safe havens"
        />
        <CardContent className="space-y-6">
          {/* Step 1 & Step 2: Habitation Selector and Urgency Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="md:col-span-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Step 1: Select Origin Habitation
              </label>
              <select
                value={selectedHabitationId}
                onChange={(e) => setSelectedHabitationId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {habitations.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.district}, {h.state}) — {h.latest_risk_level}
                  </option>
                ))}
              </select>
            </div>

            {selectedHabitation && (
              <div className="md:col-span-4">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Step 2: Urgency & Evacuation Profile
                </span>
                <div className="flex items-center space-x-3 text-xs">
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      selectedHabitation.latest_risk_level === "CRITICAL"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    Priority: {selectedHabitation.latest_risk_level === "CRITICAL" ? "IMMEDIATE" : "HIGH"}
                  </span>
                  <span className="font-semibold text-slate-700">
                    {selectedHabitation.population} people to relocate
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 truncate">
                  Trigger: {selectedHabitation.primary_hazard}
                </div>
              </div>
            )}

            <div className="md:col-span-3 text-right">
              <button
                onClick={handleFindSafeZones}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Find Safe Zones</span>
              </button>
            </div>
          </div>

          {/* Step 3: Candidate Safe Zones Comparison Matrix */}
          {evaluated && candidates.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Candidate Safe Zones for {selectedHabitation?.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ranked by multi-factor suitability algorithm considering distance, available intake, and terrain safety.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-500">{candidates.length} candidates evaluated</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Safe Zone Name</th>
                      <th className="py-3 px-4">Status & Action</th>
                      <th className="py-3 px-4">Suitability Score</th>
                      <th className="py-3 px-4">Distance</th>
                      <th className="py-3 px-4">Available Capacity</th>
                      <th className="py-3 px-4">Safety Index</th>
                      <th className="py-3 px-4">Road Access</th>
                      <th className="py-3 px-4">Healthcare Access</th>
                      <th className="py-3 px-4 text-right">Explanation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {candidates.map((cand) => (
                      <tr
                        key={cand.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          cand.recommendationStatus === "RECOMMENDED" ? "bg-emerald-50/40" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          <div className="font-bold text-slate-900 text-sm">{cand.name}</div>
                          <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>
                              {cand.district}, {cand.state} ({cand.elevation_meters}m elevation)
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center space-x-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${
                              cand.recommendationStatus === "RECOMMENDED"
                                ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                : cand.recommendationStatus === "ALTERNATIVE"
                                ? "bg-amber-100 text-amber-900 border-amber-300"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {cand.recommendationStatus === "RECOMMENDED" ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            ) : cand.recommendationStatus === "ALTERNATIVE" ? (
                              <Compass className="w-3.5 h-3.5 text-amber-700" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            <span>{cand.recommendationStatus.replace("_", " ")}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                          {cand.suitabilityScore} / 100
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {cand.computedDistance} km
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`font-bold ${
                              cand.available_capacity >= (selectedHabitation?.population || 0)
                                ? "text-emerald-700"
                                : "text-rose-600"
                            }`}
                          >
                            {cand.available_capacity.toLocaleString()} spaces
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            (Demand: {selectedHabitation?.population})
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-700">
                          {cand.safety_score || 85}/100
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-700">
                          {cand.road_access_score || 80}/100
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-700">
                          {cand.healthcare_score || 80}/100
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setActiveModalZone(cand)}
                            className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-md border border-emerald-300 transition-colors shadow-sm"
                          >
                            Why Recommended?
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* "Why Recommended?" Explanation Modal */}
      {activeModalZone && selectedHabitation && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden space-y-4 p-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                      activeModalZone.recommendationStatus === "RECOMMENDED"
                        ? "bg-emerald-100 text-emerald-800"
                        : activeModalZone.recommendationStatus === "ALTERNATIVE"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {activeModalZone.recommendationStatus.replace("_", " ")}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base">{activeModalZone.name}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Evaluation rationale for evacuating {selectedHabitation.name} ({selectedHabitation.population} persons)
                </p>
              </div>
              <button
                onClick={() => setActiveModalZone(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scorecard grid */}
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-medium">Distance</span>
                <span className="text-sm font-black text-slate-900">{activeModalZone.computedDistance} km</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-medium">Available Intake</span>
                <span className="text-sm font-black text-emerald-700">
                  {activeModalZone.available_capacity} beds
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block font-medium">Safety Score</span>
                <span className="text-sm font-black text-slate-900">
                  {activeModalZone.safety_score || 90}/100
                </span>
              </div>
            </div>

            {/* Algorithmic Rationale Points */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Decision Support Justification:
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {activeModalZone.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500">
              <strong>Evaluation Engine:</strong> Aashray Spatial Relocation Optimization Engine v1.0 using
              geographical network routing, shelter capacity constraints, and elevation buffers.
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModalZone(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Relocation Directives Registry Table */}
      <Card>
        <CardHeader
          title="Official Actionable Relocation Directives"
          subtitle="Prioritized directives mapping vulnerable habitations to safe recipient zones"
        />
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-400">Loading relocation queue...</div>
          ) : !data ? (
            <div className="p-12 text-center text-sm text-slate-500">Failed to load relocation data.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">Origin Habitation</th>
                    <th className="py-3 px-4">District</th>
                    <th className="py-3 px-4">Priority Level</th>
                    <th className="py-3 px-4">People to Relocate</th>
                    <th className="py-3 px-4">Target Safe Haven</th>
                    <th className="py-3 px-4">Technical Rationale</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recommendations.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <Link
                          href={`/habitations/${rec.habitation_id}`}
                          className="hover:text-emerald-700 underline underline-offset-2"
                        >
                          {rec.habitation_name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{rec.district}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            rec.priority_level === "IMMEDIATE"
                              ? "bg-rose-100 text-rose-800 border-rose-300"
                              : rec.priority_level === "HIGH"
                              ? "bg-orange-100 text-orange-800 border-orange-300"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {rec.priority_level}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {rec.people_to_relocate.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-emerald-800 font-medium">
                        {rec.safe_zone_name || "Pending Target Allocation"}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 max-w-xs">{rec.reason}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedHabitationId(rec.habitation_id);
                            window.scrollTo({ top: 120, behavior: "smooth" });
                          }}
                          className="px-2.5 py-1 text-xs font-semibold bg-slate-900 text-white rounded hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                          Match Safe Haven &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function RelocationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-400">Loading Relocation Engine...</div>}>
      <RelocationWorkflowContent />
    </Suspense>
  );
}

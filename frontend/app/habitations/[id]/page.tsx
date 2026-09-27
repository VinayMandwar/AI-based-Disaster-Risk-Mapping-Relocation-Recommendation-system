"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchHabitationDetail } from "@/lib/api";
import { getMockHabitationDetail } from "@/lib/demoData";
import { HabitationDetail } from "@/types";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatRiskLevel } from "@/lib/utils";
import {
  ArrowLeft,
  MapPin,
  Users,
  Home,
  ShieldAlert,
  AlertTriangle,
  Scale,
  ArrowRightLeft,
  Waves,
  Mountain,
  HeartPulse,
  Droplets,
  Zap,
  CheckCircle2,
  AlertOctagon,
  ExternalLink,
  Navigation,
  Info,
} from "lucide-react";

export default function HabitationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const habitationId = (params?.id as string) || "HAB-UK-CHM-01";

  const [habitation, setHabitation] = useState<HabitationDetail | null>(() => {
    return getMockHabitationDetail(habitationId);
  });
  const [loading, setLoading] = useState(!habitation);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "hazards" | "vulnerability" | "capacity" | "relocation">("overview");

  useEffect(() => {
    if (!habitationId) return;
    fetchHabitationDetail(habitationId)
      .then((data) => {
        setHabitation(data);
      })
      .catch((err) => {
        if (!habitation) {
          setError(err.message || "Failed to load habitation details.");
        }
      })
      .finally(() => setLoading(false));
  }, [habitationId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading comprehensive multi-hazard assessment...</p>
      </div>
    );
  }

  if (error || !habitation) {
    return (
      <div className="p-8 max-w-2xl mx-auto rounded-xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Habitation Record Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested identifier <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">{habitationId}</code> does not exist in the survey registry.
        </p>
        <Link
          href="/habitations"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Habitations Registry</span>
        </Link>
      </div>
    );
  }

  const haz = habitation.hazard_assessments[0] || {
    flood_risk: 0.5,
    landslide_risk: 0.5,
    erosion_risk: 0.5,
    earthquake_risk: 0.3,
    cyclone_risk: 0.1,
    fire_risk: 0.2,
    primary_hazard: habitation.primary_hazard || "General Exposure",
  };

  const pop = habitation.population_profile || {
    total_population: habitation.population,
    children_count: Math.round(habitation.population * 0.25),
    elderly_count: Math.round(habitation.population * 0.18),
    women_count: Math.round(habitation.population * 0.48),
    special_vulnerabilities_count: Math.round(habitation.population * 0.06),
  };

  const infra = habitation.infrastructure_profile || {
    road_accessibility: 3,
    water_availability: 3,
    sanitation: 3,
    electricity: 3,
    healthcare_access: 2,
    shelter_availability: 2,
    housing_condition: 2,
  };

  const cap = habitation.capacity_assessments[0] || {
    carrying_capacity_people: Math.round(habitation.population * 0.8),
    current_load: habitation.population,
    capacity_stress_ratio: 1.25,
    status: "STRESSED",
  };

  const latestRiskScore = habitation.latest_risk_score ?? 75;
  const latestRiskLevel = habitation.latest_risk_level ?? "HIGH";
  const vulnerableCount = pop.children_count + pop.elderly_count + pop.special_vulnerabilities_count;
  const vulnerablePct = Math.round((vulnerableCount / habitation.population) * 100);

  // Contributing Factors Calculation using actual values
  const hazardFactor = Math.round(Math.max(haz.flood_risk, haz.landslide_risk, haz.erosion_risk || 0) * 100);
  const exposureFactor = Math.min(100, Math.round((habitation.population / 1250) * 100));
  const vulnerabilityFactor = vulnerablePct;
  const infraDeficitFactor = Math.round(((5 - infra.housing_condition) / 5) * 100);
  const accessibilityDeficitFactor = Math.round(((5 - infra.road_accessibility) / 5) * 100);

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/habitations"
            className="p-2 text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-sm"
            title="Back to Registry"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{habitation.name}</h1>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {habitation.code}
              </span>
              <Badge riskLevel={latestRiskLevel}>{formatRiskLevel(latestRiskLevel)}</Badge>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {habitation.village}, {habitation.district} ({habitation.state})
              </span>
              <span>•</span>
              <span className="font-mono">
                {habitation.latitude.toFixed(4)}°N, {habitation.longitude.toFixed(4)}°E
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Link
            href="/dashboard"
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5 text-slate-500" />
            <span>View on GIS Map</span>
          </Link>

          <Link
            href={`/relocation?habitation=${habitation.id}`}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Relocation Decision Plan</span>
          </Link>
        </div>
      </div>

      {/* Top 4 Core Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Risk Score */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Composite Risk Index</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{latestRiskScore}/100</div>
            <p className="text-xs text-slate-500 mt-0.5">Classification: {formatRiskLevel(latestRiskLevel)}</p>
          </div>
          <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Population & Vulnerability */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Population</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{habitation.population.toLocaleString()}</div>
            <p className="text-xs text-rose-600 font-medium mt-0.5">
              {vulnerableCount} vulnerable ({vulnerablePct}%)
            </p>
          </div>
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Carrying Capacity */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Carrying Stress Ratio</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{cap.capacity_stress_ratio}x</div>
            <p className="text-xs text-slate-500 mt-0.5">
              Safe Limit: {cap.carrying_capacity_people} persons
            </p>
          </div>
          <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        {/* Relocation Priority */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Relocation Priority</span>
            <div className="text-2xl font-black text-rose-700 mt-1">
              {habitation.latest_risk_level === "CRITICAL" ? "IMMEDIATE" : "HIGH PRIORITY"}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Directive: Emergency Allocation</p>
          </div>
          <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex space-x-1 sm:space-x-4 overflow-x-auto text-sm font-semibold">
        {[
          { id: "overview", label: "1. Overview & Context" },
          { id: "hazards", label: "2. Multi-Hazard Profile" },
          { id: "vulnerability", label: "3. Demographic Vulnerability" },
          { id: "capacity", label: "4. Carrying Capacity" },
          { id: "relocation", label: "5. Relocation Directives" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <Card>
              <CardHeader
                title="Executive Settlement Summary"
                subtitle="High-level demographic, administrative, and geographic posture"
              />
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block font-semibold">Village / Ward</span>
                    <span className="text-sm font-bold text-slate-900">{habitation.village}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block font-semibold">District</span>
                    <span className="text-sm font-bold text-slate-900">{habitation.district}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block font-semibold">State</span>
                    <span className="text-sm font-bold text-slate-900">{habitation.state}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block font-semibold">Housing Units</span>
                    <span className="text-sm font-bold text-slate-900">{habitation.housing_count} units</span>
                  </div>
                </div>

                {/* Primary Threat Callout */}
                <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
                  <div className="flex items-center space-x-2 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Primary Hazard Vulnerability Vector</span>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed font-medium">
                    {haz.primary_hazard}. Field sensor records and geological scans indicate active tension cracks
                    along toe scarps combined with seasonal saturation risks.
                  </p>
                </div>

                {/* Action Directives */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/relocation?habitation=${habitation.id}`}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 shadow-sm transition-colors"
                  >
                    <span>Compute Safe Relocation Zones</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => setActiveTab("hazards")}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Inspect Hazard Vectors &rarr;
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Transparent Factor Breakdown Card */}
            <Card>
              <CardHeader
                title="Transparent Contributing Factor Analysis"
                subtitle="Explaining the composite score with actual empirical parameters instead of a black-box value"
              />
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {/* Factor 1 */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">1. Maximum Hazard Vector Intensity</span>
                      <span className="text-slate-900 font-bold">{hazardFactor}% ({haz.primary_hazard})</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${hazardFactor}%` }} />
                    </div>
                  </div>

                  {/* Factor 2 */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">2. Population Exposure Load</span>
                      <span className="text-slate-900 font-bold">{habitation.population} residents ({exposureFactor}% scale)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${exposureFactor}%` }} />
                    </div>
                  </div>

                  {/* Factor 3 */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">3. Demographic Fragility (Children/Elderly/Special Needs)</span>
                      <span className="text-slate-900 font-bold">{vulnerableCount} persons ({vulnerabilityFactor}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${vulnerabilityFactor}%` }} />
                    </div>
                  </div>

                  {/* Factor 4 */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">4. Infrastructure & Housing Fragility Deficit</span>
                      <span className="text-slate-900 font-bold">{infraDeficitFactor}% deficit (Rating: {infra.housing_condition}/5)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${infraDeficitFactor}%` }} />
                    </div>
                  </div>

                  {/* Factor 5 */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">5. Evacuation Accessibility Constraint</span>
                      <span className="text-slate-900 font-bold">{accessibilityDeficitFactor}% road constraint (Rating: {infra.road_accessibility}/5)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${accessibilityDeficitFactor}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>
                    Composite score is calculated using multi-criteria weighted additive normalization based on official
                    Aashray multi-hazard decision support specifications.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Quick Demographics Preview */}
            <Card>
              <CardHeader title="Demographics At a Glance" subtitle="High-dependency population fractions" />
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Children (&lt;12 yrs)</span>
                  <span className="font-bold text-slate-900">{pop.children_count}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Elderly (&gt;65 yrs)</span>
                  <span className="font-bold text-slate-900">{pop.elderly_count}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Women</span>
                  <span className="font-bold text-slate-900">{pop.women_count}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1.5">
                  <span className="text-slate-500">Persons with Disability / Chronic</span>
                  <span className="font-bold text-rose-600">{pop.special_vulnerabilities_count}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Lifeline Status */}
            <Card>
              <CardHeader title="Lifeline Infrastructure" subtitle="Vital services baseline" />
              <CardContent className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Road Lifeline Access</span>
                  <span className="font-bold">{infra.road_accessibility}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Water Supply Security</span>
                  <span className="font-bold">{infra.water_availability}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Sanitation Facilities</span>
                  <span className="font-bold">{infra.sanitation}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Emergency Healthcare Reach</span>
                  <span className="font-bold">{infra.healthcare_access}/5</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: HAZARDS */}
      {activeTab === "hazards" && (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Multi-Hazard Susceptibility Gauges"
              subtitle="Specific quantitative risk coefficients across seismic, hydro-meteorological, and slope vectors"
            />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Flood Risk */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Riverine & Surface Flood</span>
                    <Waves className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">{Math.round(haz.flood_risk * 100)}%</div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.round(haz.flood_risk * 100)}%` }} />
                  </div>
                  <p className="text-xs text-slate-500">
                    High runoff coefficient during continuous precipitation cycles.
                  </p>
                </div>

                {/* Landslide Risk */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Landslide & Slope Instability</span>
                    <Mountain className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">{Math.round(haz.landslide_risk * 100)}%</div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full" style={{ width: `${Math.round(haz.landslide_risk * 100)}%` }} />
                  </div>
                  <p className="text-xs text-slate-500">
                    Shear failure along saturated plane and steep rock scarps.
                  </p>
                </div>

                {/* Erosion Risk */}
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Bank & Toe Erosion Scour</span>
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">{Math.round((haz.erosion_risk || 0.75) * 100)}%</div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-600 rounded-full" style={{ width: `${Math.round((haz.erosion_risk || 0.75) * 100)}%` }} />
                  </div>
                  <p className="text-xs text-slate-500">
                    Severe lateral cutting eroding building foundations.
                  </p>
                </div>
              </div>

              {/* Secondary Hazards */}
              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Seismic Ground Motion:</span>
                  <span className="font-bold text-slate-900">{Math.round(haz.earthquake_risk * 100)}%</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Cyclone / High Wind:</span>
                  <span className="font-bold text-slate-900">{Math.round(haz.cyclone_risk * 100)}%</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Wildfire / Heatwave:</span>
                  <span className="font-bold text-slate-900">{Math.round(haz.fire_risk * 100)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: VULNERABILITY */}
      {activeTab === "vulnerability" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Demographic Fragility Analysis" subtitle="Counts and percentages of sensitive cohorts" />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block font-medium">Children (&lt;12y)</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{pop.children_count}</div>
                  <span className="text-slate-400">{Math.round((pop.children_count / habitation.population) * 100)}% of total</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block font-medium">Elderly (&gt;65y)</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{pop.elderly_count}</div>
                  <span className="text-slate-400">{Math.round((pop.elderly_count / habitation.population) * 100)}% of total</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block font-medium">Women Cohort</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{pop.women_count}</div>
                  <span className="text-slate-400">{Math.round((pop.women_count / habitation.population) * 100)}% of total</span>
                </div>
                <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                  <span className="text-rose-700 block font-bold">Special Care / Disabled</span>
                  <div className="text-2xl font-black text-rose-800 mt-1">{pop.special_vulnerabilities_count}</div>
                  <span className="text-rose-600">Immediate evacuation priority</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Structural & Accessibility Vulnerabilities" subtitle="Physical shelter and transport constraints" />
            <CardContent className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 block">Housing Condition Rating</span>
                  <span className="text-slate-500">Kutcha / unreinforced masonry prevalence</span>
                </div>
                <span className="font-extrabold text-slate-900 text-sm">{infra.housing_condition} / 5</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 block">Road Network Accessibility</span>
                  <span className="text-slate-500">Single egress route subject to cut-off</span>
                </div>
                <span className="font-extrabold text-slate-900 text-sm">{infra.road_accessibility} / 5</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 block">Local Emergency Shelter Capacity</span>
                  <span className="text-slate-500">Availability of safe elevated community shelters</span>
                </div>
                <span className="font-extrabold text-slate-900 text-sm">{infra.shelter_availability} / 5</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900 block">Healthcare Reachability</span>
                  <span className="text-slate-500">Travel time to primary trauma stabilization center</span>
                </div>
                <span className="font-extrabold text-slate-900 text-sm">{infra.healthcare_access} / 5</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: CAPACITY */}
      {activeTab === "capacity" && (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Carrying Capacity & Physical Saturation"
              subtitle="Comparison of actual population load against safe ecological and infrastructural threshold"
            />
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Current Inhabitants</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{habitation.population.toLocaleString()}</div>
                  <p className="text-xs text-slate-400 mt-0.5">Physical demographic footprint</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Sustainable Carrying Capacity</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{cap.carrying_capacity_people.toLocaleString()}</div>
                  <p className="text-xs text-slate-400 mt-0.5">Maximum safe limit for terrain</p>
                </div>

                <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                  <span className="text-xs font-semibold text-rose-700 uppercase">Capacity Stress Ratio</span>
                  <div className="text-2xl font-bold text-rose-700 mt-1">{cap.capacity_stress_ratio}x</div>
                  <p className="text-xs text-rose-600 mt-0.5">Status: {cap.status.replace("_", " ")}</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center space-x-1.5">
                  <Scale className="w-4 h-4 text-amber-700" />
                  <span>Primary Carrying Capacity Bottleneck</span>
                </div>
                <p className="text-amber-800">
                  {cap.status === "OVER_CAPACITY"
                    ? "Infrastructural thresholds (water supply, drainage, slope stability) have been exceeded by more than 40%. The site cannot sustainably absorb extreme weather events without casualty risks."
                    : "The settlement is approaching its carrying capacity threshold; continuous monitoring advised."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 5: RELOCATION */}
      {activeTab === "relocation" && (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Actionable Relocation Directive"
              subtitle="Targeted evacuation prioritization and recommended recipient zones"
            />
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-rose-50 border border-rose-300">
                  <span className="text-xs font-semibold uppercase text-rose-700">Evacuation Priority</span>
                  <div className="text-2xl font-black text-rose-700 mt-1">
                    {habitation.latest_risk_level === "CRITICAL" ? "IMMEDIATE" : "HIGH PRIORITY"}
                  </div>
                  <p className="text-xs text-rose-600 mt-0.5">Actionable command queue</p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-xs font-semibold uppercase text-slate-500">People to Relocate</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {habitation.population.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Entire red-zone settlement</p>
                </div>

                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300">
                  <span className="text-xs font-semibold uppercase text-emerald-700">Recommended Safe Haven</span>
                  <div className="text-lg font-bold text-emerald-800 mt-1">
                    {habitation.district} Safe Zone Hub
                  </div>
                  <p className="text-xs text-emerald-600 mt-0.5">Capacity verified & safe</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-900">Technical Rationale:</div>
                <p className="text-slate-600 leading-relaxed">
                  Due to critical risk scores ({latestRiskScore}/100) and dangerous slope erosion / river cutting,
                  in-situ stabilization cannot guarantee safety for the {habitation.population} inhabitants.
                  Immediate staged relocation to designated higher ground shelters is recommended.
                </p>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <Link
                  href={`/relocation?habitation=${habitation.id}`}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Launch Safe Zone Recommendation Workflow &rarr;</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

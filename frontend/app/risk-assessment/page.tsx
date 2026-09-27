"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchRiskSummary } from "@/lib/api";
import { RiskSummaryResponse } from "@/types";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatRiskLevel } from "@/lib/utils";
import {
  AlertTriangle,
  Waves,
  Mountain,
  Activity,
  Wind,
  ShieldCheck,
  CheckCircle,
  Sliders,
  Info,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function RiskAssessmentPage() {
  const [data, setData] = useState<RiskSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Transparent configurable weights state
  const [weights, setWeights] = useState({
    hazardSeverity: 35,
    populationExposure: 25,
    vulnerability: 20,
    infrastructureRisk: 10,
    accessibilityRisk: 10,
  });

  useEffect(() => {
    fetchRiskSummary()
      .then(setData)
      .catch((err) => console.error("Failed to load risk summary:", err))
      .finally(() => setLoading(false));
  }, []);

  const getHazardIcon = (name: string) => {
    if (name.includes("Flood")) return Waves;
    if (name.includes("Landslide")) return Mountain;
    if (name.includes("Seismic") || name.includes("Earthquake")) return Activity;
    if (name.includes("Cyclone")) return Wind;
    return AlertTriangle;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Multi-Hazard Risk Stratification Engine
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
              Module 1
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Transparent quantitative risk assessment factoring Hazard Severity, Exposure, Demographic Fragility, and Lifeline Deficits.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/habitations?risk=CRITICAL"
            className="px-3 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-colors flex items-center space-x-1 shadow-sm"
          >
            <span>View Red-Zone Habitations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Transparent Model Calibration Notice */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
        <div className="flex items-center space-x-2 font-bold">
          <Info className="w-4 h-4 text-amber-700" />
          <span>Transparent Model Calibration Architecture</span>
        </div>
        <p className="text-amber-800 leading-relaxed">
          <strong>Important Notice:</strong> Scoring parameters and weights displayed below are configurable regional modeling baselines designed for disaster management decision-support.
          <em>These weights are not officially validated statutory values, but transparent criteria for objective prioritization.</em>
        </p>
      </div>

      {/* Configurable Multi-Factor Weight Distribution */}
      <Card>
        <CardHeader
          title="Configurable Multi-Factor Risk Breakdown Formula"
          subtitle="Composite Risk Score = Σ (Component Score × Calibrated Weight)"
        />
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-slate-500 block font-semibold">Hazard Severity</span>
              <span className="text-xl font-black text-rose-700">{weights.hazardSeverity}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Flood / Landslide / Scour</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-slate-500 block font-semibold">Population Exposure</span>
              <span className="text-xl font-black text-orange-700">{weights.populationExposure}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Density in impact path</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-slate-500 block font-semibold">Vulnerability Cohort</span>
              <span className="text-xl font-black text-amber-700">{weights.vulnerability}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Children, elderly, disabled</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-slate-500 block font-semibold">Infrastructure Deficit</span>
              <span className="text-xl font-black text-purple-700">{weights.infrastructureRisk}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Kutcha housing & shelters</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <span className="text-slate-500 block font-semibold">Accessibility Risk</span>
              <span className="text-xl font-black text-blue-700">{weights.accessibilityRisk}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Road isolation & egress</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hazard Type Cards */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.hazard_breakdowns.map((item) => {
            const Icon = getHazardIcon(item.hazard_type);
            return (
              <div
                key={item.hazard_type}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 leading-tight">{item.hazard_type}</span>
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{item.average_risk}%</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Regional susceptibility index</p>
                </div>
                <div className="text-xs text-slate-600 pt-2 border-t border-slate-100 flex justify-between">
                  <span>At-risk settlements:</span>
                  <span className="font-bold text-rose-700">{item.affected_habitations_count}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Risk Scoring Matrix Table */}
      <Card>
        <CardHeader
          title="Habitation Multi-Factor Risk Evaluation Matrix"
          subtitle="Evaluated score out of 100 with contributing components and direct link to full assessment"
        />
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-400">Loading risk scores...</div>
          ) : !data ? (
            <div className="p-12 text-center text-sm text-slate-500">Failed to load risk data.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Habitation</th>
                    <th className="py-3 px-4">District</th>
                    <th className="py-3 px-4">Composite Score</th>
                    <th className="py-3 px-4">Risk Category</th>
                    <th className="py-3 px-4">Primary Contributing Factor</th>
                    <th className="py-3 px-4">Population</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {data.top_vulnerable_records.map((item) => (
                    <tr key={item.habitation_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                        <Link
                          href={`/habitations/${item.habitation_id}`}
                          className="hover:text-emerald-700 underline underline-offset-2"
                        >
                          {item.habitation_name}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{item.district}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                        {item.composite_score.toFixed(1)} / 100
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge riskLevel={item.risk_level}>{formatRiskLevel(item.risk_level)}</Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded text-xs bg-slate-100 border border-slate-200 text-slate-800 font-medium">
                          {item.primary_hazard}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-bold">
                        {item.population.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/habitations/${item.habitation_id}`}
                          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-emerald-700 text-white font-semibold text-xs inline-flex items-center space-x-1 transition-colors shadow-sm"
                        >
                          <span>Full Profile &rarr;</span>
                        </Link>
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

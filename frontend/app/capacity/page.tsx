"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCapacitySummary } from "@/lib/api";
import { CapacitySummaryResponse } from "@/types";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import {
  Scale,
  Droplets,
  Home,
  HeartPulse,
  Zap,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
} from "lucide-react";

export default function CapacityPage() {
  const [data, setData] = useState<CapacitySummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCapacitySummary()
      .then(setData)
      .catch((err) => console.error("Failed to load capacity summary:", err))
      .finally(() => setLoading(false));
  }, []);

  const totalLoad = data?.habitations.reduce((acc, h) => acc + h.current_load, 0) || 4560;
  const totalSafeCap = data?.habitations.reduce((acc, h) => acc + h.carrying_capacity_people, 0) || 3770;
  const totalUtilization = Math.round((totalLoad / totalSafeCap) * 100);

  const getCapacityBadge = (status: string, stressRatio: number) => {
    if (status === "OVER_CAPACITY" || stressRatio > 1.4) {
      return (
        <span className="inline-flex items-center space-x-1 text-xs font-extrabold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
          <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
          <span>OVER CAPACITY</span>
        </span>
      );
    }
    if (status === "STRESSED" || stressRatio > 1.0) {
      return (
        <span className="inline-flex items-center space-x-1 text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>NEAR CAPACITY</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>WITHIN CAPACITY</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Infrastructural & Demographic Carrying Capacity
          </h1>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
            Module 3
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Quantitative assessment of demographic load versus physical sustainability thresholds across Water, Shelter, Healthcare, and Lifelines.
        </p>
      </div>

      {/* KPI Stats */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Current Surveyed Load
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {totalLoad.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Total registered inhabitants</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Safe Carrying Capacity
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {totalSafeCap.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Ecological & structural ceiling</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Aggregate Utilization
            </span>
            <div className="text-2xl font-black text-rose-700 mt-1">
              {totalUtilization}%
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Net regional stress: {data.average_stress_ratio}x</p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 shadow-sm">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
              Over-Capacity Habitations
            </span>
            <div className="text-2xl font-black text-rose-700 mt-1">{data.over_capacity_count}</div>
            <p className="text-xs text-rose-600 mt-0.5">Exceeding saturation limits</p>
          </div>
        </div>
      )}

      {/* Multi-Lifeline Resource Capacity Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-blue-700">
            <Droplets className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Water Supply</span>
          </div>
          <p className="text-xs text-slate-600">
            Evaluating liters/capita/day against contamination risk during floods and slope shifts.
          </p>
          <div className="text-xs font-bold text-slate-800 pt-1">
            Status: Critical in Chamoli & Varanasi
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-amber-700">
            <Home className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Emergency Shelter</span>
          </div>
          <p className="text-xs text-slate-600">
            Community shelters per capita on elevated secure ground away from active scarps.
          </p>
          <div className="text-xs font-bold text-slate-800 pt-1">
            Status: 3 Zones Deficient
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-rose-700">
            <HeartPulse className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Healthcare Access</span>
          </div>
          <p className="text-xs text-slate-600">
            Emergency medical reachability and bed buffer ratio within 30-minute evacuation radius.
          </p>
          <div className="text-xs font-bold text-slate-800 pt-1">
            Status: 2 Centers at Max Intake
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-purple-700">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Lifeline Egress</span>
          </div>
          <p className="text-xs text-slate-600">
            All-weather dual-lane connectivity vs single vulnerable roads prone to landslide cuts.
          </p>
          <div className="text-xs font-bold text-slate-800 pt-1">
            Status: Tehri & Chamoli Bottlenecks
          </div>
        </div>
      </div>

      {/* Habitation Capacity Audit Table */}
      <Card>
        <CardHeader
          title="Habitation Carrying Capacity Audit"
          subtitle="Detailed demographic load compared to maximum sustainable physical threshold"
        />
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-400">Loading capacity audits...</div>
          ) : !data ? (
            <div className="p-12 text-center text-sm text-slate-500">No data available.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Habitation</th>
                    <th className="py-3 px-4">District</th>
                    <th className="py-3 px-4">Current Population</th>
                    <th className="py-3 px-4">Safe Capacity</th>
                    <th className="py-3 px-4">Available Buffer</th>
                    <th className="py-3 px-4">Utilization</th>
                    <th className="py-3 px-4">Stress Ratio</th>
                    <th className="py-3 px-4">Primary Limiting Bottleneck</th>
                    <th className="py-3 px-4">Capacity Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {data.habitations.map((item) => {
                    const avail = item.carrying_capacity_people - item.current_load;
                    const utilPct = Math.round(
                      (item.current_load / item.carrying_capacity_people) * 100
                    );

                    return (
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
                        <td className="py-3.5 px-4 font-black text-slate-900">
                          {item.current_load.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.carrying_capacity_people.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-bold">
                          <span className={avail < 0 ? "text-rose-600" : "text-emerald-600"}>
                            {avail > 0 ? `+${avail}` : avail}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="w-20">
                            <span className="text-[11px] font-bold text-slate-700">{utilPct}%</span>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-0.5">
                              <div
                                className={`h-full rounded-full ${
                                  utilPct > 140
                                    ? "bg-rose-600"
                                    : utilPct > 100
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                                style={{ width: `${Math.min(100, utilPct)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-sm">
                          <span
                            className={
                              item.capacity_stress_ratio > 1.4
                                ? "text-rose-600"
                                : item.capacity_stress_ratio > 1.0
                                ? "text-amber-600"
                                : "text-emerald-600"
                            }
                          >
                            {item.capacity_stress_ratio}x
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium max-w-xs">
                          {item.limiting_factor}
                        </td>
                        <td className="py-3.5 px-4">
                          {getCapacityBadge(item.status, item.capacity_stress_ratio)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/habitations/${item.habitation_id}`}
                            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-emerald-700 text-white font-semibold text-xs inline-flex items-center space-x-1 transition-colors shadow-sm"
                          >
                            <span>Audit &rarr;</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

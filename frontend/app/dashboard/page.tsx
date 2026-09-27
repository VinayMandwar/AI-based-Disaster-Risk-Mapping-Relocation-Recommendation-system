"use client";

import React, { useEffect, useState } from "react";
import { fetchDashboardSummary } from "@/lib/api";
import { DashboardSummaryResponse } from "@/types";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RiskDistributionChart } from "@/components/dashboard/RiskDistributionChart";
import { PopulationVulnerabilityCard } from "@/components/dashboard/PopulationVulnerabilityCard";
import { HighRiskHabitationsTable } from "@/components/dashboard/HighRiskHabitationsTable";
import { RecentAlertsList } from "@/components/dashboard/RecentAlertsList";
import { MapContainer } from "@/components/map/MapContainer";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import {
  MapPin,
  AlertOctagon,
  AlertTriangle,
  Users,
  ArrowRightLeft,
  RefreshCw,
  Clock,
  MessageSquareWarning,
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDashboardSummary();
      setData(res);
      setLastRefreshed(new Date());
    } catch (err: any) {
      setError(err.message || "Failed to communicate with Disaster Intelligence Backend API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner / Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Disaster Risk & Relocation Intelligence Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time hazard monitoring, demographic vulnerability, and carrying capacity command center.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Updated: {lastRefreshed.toLocaleTimeString()}</span>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Sync</span>
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
          <span>Backend sync error: {error}</span>
          <button
            onClick={loadData}
            className="px-2.5 py-1 text-xs font-semibold bg-rose-100 hover:bg-rose-200 rounded text-rose-900"
          >
            Retry
          </button>
        </div>
      )}

      {/* Top 6 KPI Cards (Clickable Filter Shortcuts) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Habitations"
          value={data ? data.kpis.total_habitations : "--"}
          subtitle="Monitored settlements"
          icon={MapPin}
          variant="neutral"
          href="/habitations"
        />
        <KpiCard
          title="Critical Zones"
          value={data ? data.kpis.critical_zones : "--"}
          subtitle="Immediate red-zone threat"
          icon={AlertOctagon}
          variant="critical"
          href="/habitations?risk=CRITICAL"
        />
        <KpiCard
          title="High Risk Areas"
          value={data ? data.kpis.high_risk_areas : "--"}
          subtitle="Elevated vulnerability"
          icon={AlertTriangle}
          variant="high"
          href="/habitations?risk=HIGH"
        />
        <KpiCard
          title="Population at Risk"
          value={data ? data.kpis.population_at_risk : "--"}
          subtitle="In high & critical zones"
          icon={Users}
          variant="moderate"
          href="/habitations?risk=CRITICAL"
        />
        <KpiCard
          title="Immediate Relocations"
          value={data ? data.kpis.immediate_relocation_cases : "--"}
          subtitle="Urgent queue cases"
          icon={ArrowRightLeft}
          variant="critical"
          href="/relocation?priority=IMMEDIATE"
        />
        <KpiCard
          title="Open Complaints"
          value={data && data.kpis.open_complaints !== undefined ? data.kpis.open_complaints : 3}
          subtitle="Citizen reports pending"
          icon={MessageSquareWarning}
          variant="moderate"
          href="/complaints"
        />
      </div>

      {/* Map & Risk Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spatial Map Placeholder */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader
              title="Spatial Hazard & Zone Map"
              subtitle="Interactive geographic viewport for habitation markers, red zones, and evacuation hubs"
            />
            <CardContent className="p-3">
              <MapContainer />
            </CardContent>
          </Card>
        </div>

        {/* Risk Distribution & Vulnerability Summary */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader
              title="Risk Stratification"
              subtitle="Distribution of habitations by evaluated risk score"
            />
            <CardContent>
              {data ? (
                <RiskDistributionChart items={data.risk_distribution} />
              ) : (
                <div className="h-28 flex items-center justify-center text-xs text-slate-400">
                  Loading risk profile...
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title="Demographic Vulnerability"
              subtitle="High-priority vulnerable cohorts across surveyed zones"
            />
            <CardContent>
              {data ? (
                <PopulationVulnerabilityCard summary={data.population_vulnerability} />
              ) : (
                <div className="h-28 flex items-center justify-center text-xs text-slate-400">
                  Loading demographics...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tables & Alerts Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Highest Risk Habitations Table */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader
              title="Highest-Risk Habitations (Red Zone Candidates)"
              subtitle="Prioritized list of settlements ranked by composite vulnerability index"
            />
            <CardContent className="p-0">
              {data ? (
                <HighRiskHabitationsTable habitations={data.highest_risk_habitations} />
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  Loading habitation records...
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts Feed */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader
              title="Live Hazard Warnings"
              subtitle="Real-time warning bulletins and operational advisories"
            />
            <CardContent>
              {data ? (
                <RecentAlertsList alerts={data.recent_alerts} />
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  Loading alerts stream...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

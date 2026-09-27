"use client";

import React, { useEffect, useState } from "react";
import { fetchAlerts } from "@/lib/api";
import { AlertListResponse } from "@/types";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Bell, AlertOctagon, AlertTriangle, Info, CheckCircle2, ShieldAlert } from "lucide-react";

export default function AlertsPage() {
  const [data, setData] = useState<AlertListResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts(false)
      .then(setData)
      .catch((err) => console.error("Failed to load alerts:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Hazard Warning & Emergency Broadcast Center
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Active dispatches, early warning triggers, and evacuation advisories for disaster response forces.
        </p>
      </div>

      {/* Alert KPI Cards */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-rose-800 uppercase">Critical Warnings</span>
              <div className="text-2xl font-bold text-rose-800 mt-1">{data.active_critical_count}</div>
            </div>
            <AlertOctagon className="w-8 h-8 text-rose-500 opacity-80" />
          </div>

          <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-orange-800 uppercase">High Severity Alerts</span>
              <div className="text-2xl font-bold text-orange-800 mt-1">{data.active_high_count}</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500 opacity-80" />
          </div>

          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-800 uppercase">Medium Advisories</span>
              <div className="text-2xl font-bold text-amber-800 mt-1">{data.active_medium_count}</div>
            </div>
            <Info className="w-8 h-8 text-amber-500 opacity-80" />
          </div>
        </div>
      )}

      {/* Alerts Feed */}
      <Card>
        <CardHeader
          title="Active Operational Dispatches"
          subtitle="Real-time bulletins ordered by timestamp"
        />
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-400">Loading active bulletins...</div>
          ) : !data || data.items.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">No active alerts at this moment.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data.items.map((alert) => (
                <div key={alert.id} className="p-5 flex items-start space-x-4 hover:bg-slate-50">
                  <div className="mt-1">
                    {alert.severity === "CRITICAL" ? (
                      <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
                        <AlertOctagon className="w-5 h-5" />
                      </div>
                    ) : alert.severity === "HIGH" ? (
                      <div className="p-2 bg-orange-100 text-orange-700 rounded-lg">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                        <Info className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-slate-900">{alert.title}</h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            alert.severity === "CRITICAL"
                              ? "bg-rose-100 text-rose-800"
                              : alert.severity === "HIGH"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(alert.issued_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{alert.message}</p>

                    <div className="mt-3 flex items-center space-x-4 text-xs text-slate-500">
                      <span>Target Habitation: <strong>{alert.habitation_name || "General Regional"}</strong></span>
                      <span>•</span>
                      <span>Type: <strong>{alert.alert_type}</strong></span>
                      <span>•</span>
                      <span className="flex items-center text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Dispatched via Incident Command
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

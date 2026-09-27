"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Settings, Shield, Key, Database, Server, Check, Users } from "lucide-react";

export default function SettingsPage() {
  const roles = [
    {
      name: "ADMIN",
      description: "Full platform configuration, user account provisioning, system logs",
      permissions: ["Manage Users", "Configure Models", "Publish Reports", "System Audit"],
      activeUsers: 1,
    },
    {
      name: "AUTHORITY",
      description: "Disaster management commissioner, district magistrate, evacuation signatory",
      permissions: ["Approve Relocations", "Issue Broadcast Alerts", "Export Official Data"],
      activeUsers: 2,
    },
    {
      name: "ANALYST",
      description: "Technical risk modeling, vulnerability audits, carrying capacity calculations",
      permissions: ["Calculate Risk Scores", "Update Infrastructure Profiles", "Query GeoJSON"],
      activeUsers: 4,
    },
    {
      name: "VIEWER",
      description: "Field relief workers, NGO observers, public information desks",
      permissions: ["View Dashboard", "View Safe Zones", "Read Warning Bulletins"],
      activeUsers: 12,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Platform Governance & System Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Role-based access matrix, database connection status, and deployment environment parameters.
        </p>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">FastAPI Backend</span>
              <span className="text-sm font-bold text-slate-900">v1.0.0 (Port 8001)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Database Engine</span>
              <span className="text-sm font-bold text-slate-900">PostgreSQL 16 (Port 5433)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Spatial Extension</span>
              <span className="text-sm font-bold text-slate-900">PostGIS / GeoJSON Ready</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-Based Access Control Matrix */}
      <Card>
        <CardHeader
          title="Role-Based Access Control (RBAC) Architecture"
          subtitle="Configured administrative tiers for disaster management operational protocols"
        />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Role Identifier</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Assigned Capabilities</th>
                  <th className="py-3 px-4 text-right">Demo Users</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roles.map((r) => (
                  <tr key={r.name} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 text-xs px-2.5 py-1 rounded bg-slate-100 border border-slate-200">
                        {r.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 max-w-sm">{r.description}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {r.permissions.map((p) => (
                          <span
                            key={p}
                            className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-800">
                      {r.activeUsers} accounts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

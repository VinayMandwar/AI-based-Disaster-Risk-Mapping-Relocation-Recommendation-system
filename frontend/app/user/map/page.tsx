"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Shield,
  Hospital,
  AlertTriangle,
  ArrowLeft,
  Navigation,
  Layers,
  Waves,
  Mountain,
} from "lucide-react";
import { MapContainer } from "@/components/map/MapContainer";
import { useAuth } from "@/context/AuthContext";
import { RAW_DEMO_HABITATIONS, RAW_DEMO_SAFE_ZONES } from "@/lib/demoData";
import { formatRiskLevel } from "@/lib/utils";

export default function UserMapPage() {
  const { selectedHabitationId, setSelectedHabitationId } = useAuth();
  const currentHab =
    RAW_DEMO_HABITATIONS.find((h) => h.id === selectedHabitationId) || RAW_DEMO_HABITATIONS[0];

  const nearbySafeZones = RAW_DEMO_SAFE_ZONES.filter(
    (sz) => sz.district.toLowerCase() === currentHab.district.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 uppercase tracking-wide">
            <Link href="/user-dashboard" className="flex items-center space-x-1 hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <span>•</span>
            <span>Citizen Spatial View</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            My Risk Map & Evacuation Havens
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Geospatial visualization of your settlement, surrounding hazard zones, and nearest safe havens.
          </p>
        </div>

        {/* Location selector */}
        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
          <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
          <div>
            <label className="block text-[9px] font-bold uppercase text-slate-400">
              Active Habitation
            </label>
            <select
              value={currentHab.id}
              onChange={(e) => setSelectedHabitationId(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              {RAW_DEMO_HABITATIONS.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.village}, {h.district})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Settlement Snapshot Info */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-slate-400">Current Risk Level</div>
          <div className="flex items-center space-x-2 mt-1">
            <span
              className={`px-2 py-0.5 rounded text-xs font-extrabold ${
                currentHab.latest_risk_level === "CRITICAL"
                  ? "bg-rose-100 text-rose-800"
                  : currentHab.latest_risk_level === "HIGH"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {currentHab.latest_risk_level}
            </span>
            <span className="text-xs font-bold text-slate-700">
              {currentHab.latest_risk_score.toFixed(1)}/100
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-slate-400">Primary Hazard Threat</div>
          <div className="text-xs font-bold text-slate-800 mt-1 truncate">
            {currentHab.primary_hazard}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-slate-400">Designated Safe Zone</div>
          <div className="text-xs font-bold text-emerald-700 mt-1 truncate">
            {nearbySafeZones[0]?.name || "District Relief Complex"}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold uppercase text-slate-400">Coordinates</div>
          <div className="text-xs font-mono text-slate-600 mt-1">
            {currentHab.latitude.toFixed(4)}° N, {currentHab.longitude.toFixed(4)}° E
          </div>
        </div>
      </div>

      {/* GIS Leaflet Map */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 font-bold text-slate-700">
            <Layers className="w-4 h-4 text-teal-600" />
            <span>Interactive Multi-Layer Map — Leaflet GIS</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-500 font-medium">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span>Critical Zone</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Designated Safe Zone</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              <span>Medical Lifeline</span>
            </span>
          </div>
        </div>

        <div className="h-[600px] w-full relative">
          <MapContainer selectedHabitationId={currentHab.id} />
        </div>
      </div>
    </div>
  );
}

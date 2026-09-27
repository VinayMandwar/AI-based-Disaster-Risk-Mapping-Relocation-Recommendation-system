"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  PhoneCall,
  Info,
  CheckCircle2,
  Clock,
  Waves,
  Mountain,
  MessageSquareWarning,
  Bot,
  Map,
  ArrowRightLeft,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { RAW_DEMO_HABITATIONS, RAW_DEMO_ALERTS, RAW_DEMO_SAFE_ZONES } from "@/lib/demoData";
import { formatRiskLevel } from "@/lib/utils";

export default function UserDashboardPage() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const { user, selectedHabitationId, setSelectedHabitationId } = useAuth();

  // Active habitation details
  const activeHab =
    RAW_DEMO_HABITATIONS.find((h) => h.id === selectedHabitationId) || RAW_DEMO_HABITATIONS[0];

  // Filter alerts specifically for this habitation
  const localAlerts = RAW_DEMO_ALERTS.filter(
    (a) => a.habitation_name === activeHab.name || a.is_active
  ).slice(0, 2);

  // Recommended safe zone
  const recommendedSafeZone =
    RAW_DEMO_SAFE_ZONES.find((sz) => sz.district.toLowerCase() === activeHab.district.toLowerCase()) ||
    RAW_DEMO_SAFE_ZONES[0];

  // Visual Relocation Progress Timeline Steps
  const RELOCATION_STEPS = [
    { key: "ASSESSMENT_COMPLETED", label: t("relocAssessmentCompleted", "Assessment Completed") },
    { key: "RECOMMENDED", label: t("relocRecommended", "Relocation Recommended") },
    { key: "PLANNING", label: t("relocPlanning", "Planning & Allocation") },
    { key: "IN_PROGRESS", label: t("relocInProgress", "Relocation In Progress") },
    { key: "COMPLETED", label: t("relocCompleted", "Relocated / Completed") },
  ];

  // Determine current step index based on activeHab.relocation.status
  const currentStatus = (activeHab.relocation?.status || "PROPOSED").toUpperCase();
  let activeStepIndex = 1; // Default Recommended
  if (currentStatus === "COMPLETED") activeStepIndex = 4;
  else if (currentStatus === "IN_PROGRESS") activeStepIndex = 3;
  else if (currentStatus === "APPROVED" || currentStatus === "PLANNING") activeStepIndex = 2;
  else if (currentStatus === "PROPOSED") activeStepIndex = 1;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Welcome & Location Selector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-600 uppercase tracking-wide">
            <UserCheck className="w-4 h-4" />
            <span>Citizen Protection Portal</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Welcome, {user?.full_name || "Resident"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time hazard monitoring, relocation notices, and grievance tracking for your settlement.
          </p>
        </div>

        {/* Change / Inspect Habitation Dropdown */}
        <div className="flex items-center space-x-2 shrink-0">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="text-right">
            <label className="block text-[10px] font-bold text-slate-400 uppercase">
              Registered Habitation
            </label>
            <select
              value={activeHab.id}
              onChange={(e) => setSelectedHabitationId(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
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

      {/* Main Status Grid (Risk Level & Score Card + Relocation Card) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: My Area Risk Profile */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                {t("myAreaHeading", "My Registered Location")}
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">{activeHab.name}</h2>
              <p className="text-xs text-slate-500">
                Village: {activeHab.village} • District: {activeHab.district}, {activeHab.state}
              </p>
            </div>

            {/* Risk Badge */}
            <div className="text-right">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase ${
                  activeHab.latest_risk_level === "CRITICAL"
                    ? "bg-rose-100 text-rose-800 border border-rose-300"
                    : activeHab.latest_risk_level === "HIGH"
                    ? "bg-orange-100 text-orange-800 border border-orange-300"
                    : "bg-amber-100 text-amber-800 border border-amber-300"
                }`}
              >
                {activeHab.latest_risk_level} RISK
              </span>
              <div className="text-xs font-extrabold text-slate-700 mt-1">
                Score: {activeHab.latest_risk_score.toFixed(1)}/100
              </div>
            </div>
          </div>

          {/* Factor Gauges Breakdown (Flood Exposure, Slope Instability, Housing, Accessibility) */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
              Ground Vulnerability Factors
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Flood Exposure</span>
                  <span className="font-bold">{Math.round(activeHab.hazard_assessment.flood_risk * 100)}/100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.round(activeHab.hazard_assessment.flood_risk * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Slope Instability & Debris Flow</span>
                  <span className="font-bold">{Math.round(activeHab.hazard_assessment.landslide_risk * 100)}/100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${Math.round(activeHab.hazard_assessment.landslide_risk * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Structural Housing Vulnerability</span>
                  <span className="font-bold">
                    {Math.round((5 - activeHab.infrastructure_profile.housing_condition) * 25)}/100
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{
                      width: `${Math.round((5 - activeHab.infrastructure_profile.housing_condition) * 25)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <Link
              href="/user/map"
              className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
            >
              <Map className="w-3.5 h-3.5" />
              <span>View My Risk Map</span>
            </Link>

            <Link
              href="/ai-assistant"
              className="py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <Bot className="w-3.5 h-3.5 text-teal-600" />
              <span>Ask AI</span>
            </Link>
          </div>
        </div>

        {/* Card 2: Relocation Status & Recommended Safe Zone */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                {t("navMyRelocation", "Relocation Status")}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
                Priority: {activeHab.relocation?.priority_level || "MEDIUM"}
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 mt-1">
              {activeHab.relocation?.status === "IN_PROGRESS"
                ? "Relocation Active"
                : activeHab.relocation?.status === "COMPLETED"
                ? "Relocation Completed"
                : "Relocation Planning in Progress"}
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              <strong>Official advisory:</strong> {activeHab.relocation?.reason}
            </p>
          </div>

          {/* Visual Progress Timeline (Assessment -> Recommended -> Planning -> In Progress -> Completed) */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
              Relocation Progress Timeline
            </div>

            <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {RELOCATION_STEPS.map((step, idx) => {
                const isPassed = idx < activeStepIndex;
                const isCurrent = idx === activeStepIndex;
                return (
                  <div key={step.key} className="relative flex items-center space-x-2.5 text-xs">
                    <div
                      className={`absolute -left-6 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isPassed
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : isCurrent
                          ? "bg-teal-500 border-teal-600 text-white animate-pulse"
                          : "bg-white border-slate-300"
                      }`}
                    >
                      {isPassed && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <span
                      className={`font-semibold ${
                        isCurrent
                          ? "text-teal-700 font-bold"
                          : isPassed
                          ? "text-slate-700"
                          : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safe Zone Details */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <div className="text-[10px] font-bold uppercase text-emerald-800">
                Designated Safe Haven
              </div>
              <div className="font-extrabold text-slate-900">{recommendedSafeZone.name}</div>
              <div className="text-slate-500 text-[11px]">
                {recommendedSafeZone.district} • {recommendedSafeZone.distance_km || 4.5} km via main road
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-emerald-700">
                {recommendedSafeZone.max_capacity - recommendedSafeZone.current_occupancy} Slots Avail.
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <Link
              href="/safe-zones"
              className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
            >
              <span>View Safe Zone Facilities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/user/complaints"
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <MessageSquareWarning className="w-3.5 h-3.5 text-slate-600" />
              <span>Report Issue</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Local Alerts specifically relevant to this settlement */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-black text-slate-900">
              Active Alerts for {activeHab.name}
            </h3>
          </div>
          <Link href="/alerts" className="text-xs font-bold text-teal-600 hover:underline">
            View All District Alerts →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {localAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-xl border border-rose-200 bg-rose-50/70 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-rose-800">
                  {alert.alert_type.replace("_", " ")}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white">
                  {alert.severity}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900">{alert.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{alert.message}</p>
              <div className="text-[10px] text-slate-400 font-medium pt-1">
                Issued by State Emergency Operations Center
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Guidance & Emergency Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Official Community Safety Guidelines</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 list-disc pl-5 leading-relaxed">
            <li>Keep emergency bag ready with national identity cards, prescription medicines, and flashlights.</li>
            <li>Do not attempt to cross flooded causeways or swollen mountain rivulets during active rain.</li>
            <li>In case of slope cracking sound or toe seepage, immediately move to designated shelter high ground.</li>
            <li>Check siren updates or SMS broadcasts before returning to riverside dwellings.</li>
          </ul>
        </div>

        {/* Emergency Contacts Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <PhoneCall className="w-4 h-4" />
            <span>Emergency Lifelines</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-700">
              <span className="text-slate-300">National Disaster Helpline</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">1078</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-700">
              <span className="text-slate-300">State Control Center</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">1070</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-300">District Emergency Liaison</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">01372-252101</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

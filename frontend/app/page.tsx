"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  UserCheck,
  ArrowRight,
  Waves,
  Mountain,
  AlertTriangle,
  MapPin,
  Scale,
  ArrowRightLeft,
  CheckCircle2,
  FileSpreadsheet,
  Bot,
} from "lucide-react";
import { AashrayLogo } from "@/components/ui/AashrayLogo";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const { loginAsAdmin, loginAsUser } = useAuth();

  const handleAdminLaunch = () => {
    loginAsAdmin();
    router.push("/dashboard");
  };

  const handleUserLaunch = () => {
    loginAsUser("HAB-UK-CHM-01");
    router.push("/user-dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="h-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <AashrayLogo size="md" light={true} />

        <div className="flex items-center space-x-3">
          {/* Language Switcher */}
          <div className="flex items-center rounded-lg bg-slate-800/90 border border-slate-700 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 rounded transition-colors ${
                lang === "en" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-2.5 py-1 rounded transition-colors ${
                lang === "hi" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              हिंदी
            </button>
          </div>

          <Link
            href="/login"
            className="text-xs font-bold px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {t("btnLogin")}
          </Link>
        </div>
      </header>

      {/* Main Hero & Role Selection */}
      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16 flex flex-col justify-center space-y-12">
        {/* Core Product Identification & Message */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>AI-Based Disaster Risk Mapping & Relocation Recommendation System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Identify Risk. Protect Communities.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Plan Safer Relocation.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Aashray is a real-world disaster-management platform designed for intelligent multi-hazard risk assessment,
            vulnerability indexing, safe carrying-capacity modeling, and infrastructure-aware relocation decision support.
          </p>

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest pt-1">
            Philosophy: From Disaster Response to Disaster Prevention
          </div>
        </div>

        {/* Dual Role Entry Cards (ADMIN vs USER) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full pt-4">
          {/* ADMIN ROLE CARD */}
          <div className="group relative rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700 hover:border-emerald-500/80 p-8 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-emerald-950/40">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Shield className="w-7 h-7" />
                </div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
                  Authority Command
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
                  <span>ADMIN</span>
                </h2>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  Manage risk data, alerts, habitations, relocation planning and system insights.
                </p>
              </div>

              <div className="pt-2 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Interactive GIS multi-layer mapping & zone filtration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Carrying capacity & multi-criteria safe zone allocation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Citizen grievance & field complaint management</span>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-2">
              <Link
                href="/login?role=admin"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/40 transition-colors"
              >
                <span>Enter Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={handleAdminLaunch}
                className="w-full py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-slate-700"
              >
                <span>DEMO MODE — Instant Admin Access</span>
              </button>
            </div>
          </div>

          {/* USER / CITIZEN ROLE CARD */}
          <div className="group relative rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-slate-700 hover:border-teal-400/80 p-8 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-teal-950/40">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-7 h-7" />
                </div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
                  Citizen Portal
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
                  <span>USER</span>
                </h2>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  View local risks, alerts, relocation status and report issues.
                </p>
              </div>

              <div className="pt-2 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>My Habitation Risk Level, Score & contributing factors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Visual relocation status timeline & designated safe haven</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>Report hazard issues (Flooding, Landslide, Blocked Roads)</span>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-2">
              <Link
                href="/login?role=user"
                className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-teal-900/40 transition-colors"
              >
                <span>Enter Citizen Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={handleUserLaunch}
                className="w-full py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-slate-700"
              >
                <span>DEMO MODE — Instant Citizen Access</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hazard Focus Pillars (Flood, Landslide, Erosion) */}
        <div className="pt-8 border-t border-slate-800 max-w-4xl mx-auto w-full">
          <h3 className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
            Core Multi-Hazard Assessment Focus
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-blue-950 text-blue-400 shrink-0 mt-0.5">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Flood Risk</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Inundation modeling, riverine surge zones, drainage capacity stress, and high-water runoff lines.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-amber-950 text-amber-400 shrink-0 mt-0.5">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Landslide Risk</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Slope stability index, rockfall vulnerability, shear plane saturation, and debris flow channels.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-rose-950 text-rose-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Riverine Erosion</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Bank toe scouring, active sediment displacement, structural undermining, and protective buffer loss.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Disclaimer Footer */}
        <div className="text-center text-xs text-slate-500 pt-6 border-t border-slate-800/80">
          <p className="font-semibold text-amber-400/90">
            DEMO MODE — Not Official Government Data
          </p>
          <p className="mt-1 max-w-xl mx-auto text-[11px] text-slate-500">
            All settlement names, hazard indices, population demographics, and relocation recommendations are illustrative records designed for technical evaluation of the Aashray system.
          </p>
        </div>
      </main>
    </div>
  );
}

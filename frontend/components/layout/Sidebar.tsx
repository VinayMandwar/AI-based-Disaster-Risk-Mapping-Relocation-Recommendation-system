"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  Scale,
  ArrowRightLeft,
  ShieldCheck,
  Bell,
  FileText,
  Settings,
  LogOut,
  UserCheck,
  Shield,
  MessageSquareWarning,
  Bot,
  Map,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { role, user, switchRole } = useAuth();

  const ADMIN_NAV_ITEMS = [
    { label: t("navDashboard"), href: "/dashboard", icon: LayoutDashboard },
    { label: t("navHabitations"), href: "/habitations", icon: MapPin },
    { label: t("navRiskAssessment"), href: "/risk-assessment", icon: AlertTriangle },
    { label: t("navCarryingCapacity"), href: "/capacity", icon: Scale },
    { label: t("navRelocation"), href: "/relocation", icon: ArrowRightLeft },
    { label: t("navSafeZones"), href: "/safe-zones", icon: ShieldCheck },
    { label: t("navAlerts"), href: "/alerts", icon: Bell },
    { label: t("navComplaints"), href: "/complaints", icon: MessageSquareWarning },
    { label: t("navAIAssistant"), href: "/ai-assistant", icon: Bot },
    { label: t("navReports"), href: "/reports", icon: FileText },
    { label: t("navSettings"), href: "/settings", icon: Settings },
  ];

  const USER_NAV_ITEMS = [
    { label: t("navMyDashboard"), href: "/user-dashboard", icon: LayoutDashboard },
    { label: t("navMyRiskMap"), href: "/user/map", icon: Map },
    { label: t("navReportIssue"), href: "/user/complaints", icon: MessageSquareWarning },
    { label: t("navAIAssistant"), href: "/ai-assistant", icon: Bot },
    { label: t("navAlerts"), href: "/alerts", icon: Bell },
    { label: t("navSafeZones"), href: "/safe-zones", icon: ShieldCheck },
  ];

  const activeItems = role === "ADMIN" ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  return (
    <aside className="w-64 bg-gov-slate text-slate-300 border-r border-gov-border flex flex-col justify-between shrink-0 select-none min-h-[calc(100vh-4rem)]">
      {/* Navigation Header & Items */}
      <div className="py-4 px-3 space-y-1">
        <div className="px-3 pb-3 border-b border-gov-border/50 mb-2">
          <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            {role === "ADMIN" ? (
              <>
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Authority Command Center</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Citizen Protection Portal</span>
              </>
            )}
          </div>
          <div className="text-[11px] text-slate-400 font-medium italic mt-0.5">
            &quot;From Disaster Response to Disaster Prevention&quot;
          </div>
        </div>

        <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {role === "ADMIN" ? "Operational Modules" : "Citizen Services"}
        </div>

        <nav className="space-y-1">
          {activeItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                item.href !== "/user-dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-emerald-600/20 text-emerald-400 border-l-4 border-emerald-500 font-semibold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-emerald-400" : "text-slate-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Role Switcher */}
      <div className="p-3 border-t border-gov-border/60 bg-slate-900/40 space-y-2">
        <div className="flex items-center space-x-3 px-2 py-2 rounded-md bg-slate-800/60 border border-slate-700/50">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-emerald-400 font-semibold text-xs shrink-0">
            {role === "ADMIN" ? <Shield className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-200 truncate">
              {user?.full_name || (role === "ADMIN" ? "Dr. S. K. Raman" : "Ramesh Kumar")}
            </p>
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                {role === "ADMIN" ? "Operations Chief" : `Resident (${user?.habitation_name || "Chamoli"})`}
              </p>
            </div>
          </div>
        </div>

        {/* Switch Role / Exit to Landing */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => {
              const targetRole = role === "ADMIN" ? "USER" : "ADMIN";
              switchRole(targetRole);
            }}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-emerald-300 py-1 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Switch to {role === "ADMIN" ? "Citizen View" : "Admin View"}</span>
          </button>

          <Link
            href="/login"
            className="text-slate-400 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition-colors"
            title="Switch User / Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
};

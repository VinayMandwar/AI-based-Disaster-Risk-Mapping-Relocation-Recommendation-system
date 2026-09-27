"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  AlertTriangle,
  Search,
  MapPin,
  X,
  ArrowRight,
  Globe,
  UserCheck,
  Shield,
  LogOut,
} from "lucide-react";
import { fetchHealth, fetchHabitations } from "@/lib/api";
import { HabitationItem } from "@/types";
import { formatRiskLevel } from "@/lib/utils";
import { AashrayLogo } from "@/components/ui/AashrayLogo";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export const Header: React.FC = () => {
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const { role, user, switchRole, logout } = useAuth();

  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HabitationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHealth()
      .then((data) => setApiOnline(data.status === "online"))
      .catch(() => setApiOnline(false));
  }, []);

  // Live search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetchHabitations({ search: searchQuery.trim(), limit: 5 });
        setSearchResults(res.items);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search fetch failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectHabitation = (id: string) => {
    setShowDropdown(false);
    setSearchQuery("");
    if (role === "USER") {
      router.push(`/user-dashboard`);
    } else {
      router.push(`/habitations/${id}`);
    }
  };

  return (
    <header className="h-16 bg-gov-navy text-white border-b border-gov-border px-3 md:px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Brand & Subtitle */}
      <div className="flex items-center space-x-3 shrink-0">
        <Link
          href={role === "USER" ? "/user-dashboard" : "/dashboard"}
          className="flex items-center space-x-3 group"
        >
          <AashrayLogo size="md" light={true} />
        </Link>
      </div>

      {/* Global Interactive Habitation Search Bar (Search by habitation, village, district) */}
      <div ref={dropdownRef} className="relative hidden lg:block w-72 xl:w-96 mx-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder={
              lang === "hi"
                ? "बस्ती, गांव या जिले का नाम खोजें..."
                : "Search habitation, village, or district..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setShowDropdown(true);
            }}
            className="w-full pl-9 pr-8 py-1.5 bg-slate-800/90 border border-slate-700 rounded-md text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setShowDropdown(false);
              }}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Dropdown */}
        {showDropdown && (
          <div className="absolute top-full mt-1.5 w-full bg-white text-slate-900 rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50">
            <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>{isSearching ? "Searching..." : `Results (${searchResults.length})`}</span>
              <span className="font-mono text-[10px]">CLICK → VIEW</span>
            </div>
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching habitations found.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {searchResults.map((hab) => (
                  <div
                    key={hab.id}
                    onClick={() => handleSelectHabitation(hab.id)}
                    className="p-2.5 hover:bg-emerald-50/70 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-xs text-slate-900">{hab.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>
                          {hab.village}, {hab.district} ({hab.state})
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          hab.latest_risk_level === "CRITICAL"
                            ? "bg-rose-100 text-rose-800"
                            : hab.latest_risk_level === "HIGH"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {formatRiskLevel(hab.latest_risk_level)}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Demo Notice Badge */}
      <div className="hidden 2xl:flex items-center bg-amber-950/70 border border-amber-800/80 px-3 py-1 rounded-full text-[11px] text-amber-300 font-medium">
        <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-400 shrink-0" />
        <span>{t("demoModeNotice")}</span>
      </div>

      {/* Right Controls: Language Selector, Role Switcher, Alerts */}
      <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
        {/* Language Selector Dropdown */}
        <div className="flex items-center rounded-lg bg-slate-800 border border-slate-700 p-0.5 text-xs font-semibold">
          <button
            onClick={() => setLang("en")}
            className={`px-2 py-1 rounded transition-colors ${
              lang === "en" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
            }`}
            title="English"
          >
            EN
          </button>
          <button
            onClick={() => setLang("hi")}
            className={`px-2 py-1 rounded transition-colors ${
              lang === "hi" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
            }`}
            title="हिंदी (Hindi)"
          >
            हिंदी
          </button>
        </div>

        {/* Role Badge & Quick Switch */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => {
              const target = role === "ADMIN" ? "USER" : "ADMIN";
              switchRole(target);
              router.push(target === "ADMIN" ? "/dashboard" : "/user-dashboard");
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 transition-colors"
            title={`Active: ${role}. Click to switch.`}
          >
            {role === "ADMIN" ? (
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <UserCheck className="w-3.5 h-3.5 text-teal-400" />
            )}
            <span className="hidden sm:inline">
              {role === "ADMIN" ? t("roleAdmin") : t("roleUser")}
            </span>
          </button>
        </div>

        {/* Backend Connectivity Status */}
        <div className="hidden sm:flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700">
          {apiOnline === null ? (
            <span className="text-slate-400 text-[11px]">Checking...</span>
          ) : apiOnline ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 font-medium text-[11px]">Online</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-amber-300 font-medium text-[11px]">Demo Mode</span>
            </>
          )}
        </div>

        {/* Active Alerts Icon */}
        <Link
          href="/alerts"
          className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Active Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </Link>
      </div>
    </header>
  );
};

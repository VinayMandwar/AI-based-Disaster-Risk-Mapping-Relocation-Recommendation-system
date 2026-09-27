"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AashrayLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showSubtitle?: boolean;
  light?: boolean;
}

export const AashrayLogo: React.FC<AashrayLogoProps> = ({
  className,
  size = "md",
  showText = true,
  showSubtitle = true,
  light = true,
}) => {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const titleSizes = {
    sm: "text-base font-black tracking-wider",
    md: "text-lg font-black tracking-tight",
    lg: "text-2xl font-black tracking-tight",
    xl: "text-3xl font-black tracking-tight",
  };

  const subtitleSizes = {
    sm: "text-[9px]",
    md: "text-[11px]",
    lg: "text-xs",
    xl: "text-sm",
  };

  return (
    <div className={cn("flex items-center space-x-3 select-none", className)}>
      {/* Professional Logo Emblem */}
      <div
        className={cn(
          iconSizes[size],
          "relative rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-0.5 shadow-md shadow-emerald-950/20 flex items-center justify-center shrink-0 border border-emerald-400/30"
        )}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          {/* Hexagonal / Shield Protection Contour */}
          <path
            d="M20 4L34 10V21C34 29.5 28 35.5 20 38C12 35.5 6 29.5 6 21V10L20 4Z"
            fill="url(#shield_gradient)"
            stroke="#34d399"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Spatial Shelter Canopy Arch */}
          <path
            d="M13 22C15.5 16.5 24.5 16.5 27 22"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* GIS Location Focal Node */}
          <circle cx="20" cy="14.5" r="2.5" fill="#34d399" />
          <circle cx="20" cy="14.5" r="4.5" stroke="#34d399" strokeWidth="1" strokeDasharray="1 2" />
          {/* Elevation Baseline / Safe Ground */}
          <path
            d="M11 27.5H29"
            stroke="#a7f3d0"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="shield_gradient" x1="20" y1="4" x2="20" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#064e3b" stopOpacity="0.9" />
              <stop stopColor="#0f172a" stopOpacity="0.95" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <span
              className={cn(
                titleSizes[size],
                light ? "text-white" : "text-slate-900",
                "font-extrabold uppercase tracking-tight font-sans"
              )}
            >
              AASHRAY
            </span>
          </div>
          {showSubtitle && (
            <p
              className={cn(
                subtitleSizes[size],
                light ? "text-slate-300" : "text-slate-500",
                "font-medium leading-tight truncate"
              )}
            >
              AI-Based Disaster Risk Mapping & Relocation Recommendation System
            </p>
          )}
        </div>
      )}
    </div>
  );
};

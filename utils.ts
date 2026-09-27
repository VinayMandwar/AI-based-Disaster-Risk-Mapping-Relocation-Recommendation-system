import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRiskLevel(level?: string): string {
  if (!level) return "N/A";
  switch (level.toUpperCase()) {
    case "CRITICAL":
      return "Critical Red Zone";
    case "HIGH":
      return "High Risk";
    case "MODERATE":
      return "Moderate Risk";
    case "SAFE_LOW":
    case "LOW":
      return "Safe / Low";
    default:
      return level;
  }
}

export function getRiskColorClass(level?: string): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (level?.toUpperCase()) {
    case "CRITICAL":
      return {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        dot: "bg-rose-600",
      };
    case "HIGH":
      return {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
        dot: "bg-orange-500",
      };
    case "MODERATE":
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-500",
      };
    case "SAFE_LOW":
    case "LOW":
    default:
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        dot: "bg-emerald-600",
      };
  }
}

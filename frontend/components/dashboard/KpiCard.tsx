import React from "react";
import Link from "next/link";
import { LucideIcon, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  variant?: "neutral" | "critical" | "high" | "moderate" | "safe";
  href?: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "neutral",
  href,
  onClick,
}) => {
  const variantStyles = {
    neutral: {
      border: "border-slate-200 hover:border-slate-300",
      iconBg: "bg-slate-100 text-slate-700",
      accent: "text-slate-900",
      badge: "bg-slate-100 text-slate-700",
    },
    critical: {
      border: "border-rose-300 bg-rose-50/40 hover:border-rose-400 hover:bg-rose-50/60",
      iconBg: "bg-rose-100 text-rose-700",
      accent: "text-rose-700",
      badge: "bg-rose-100 text-rose-800",
    },
    high: {
      border: "border-orange-300 bg-orange-50/40 hover:border-orange-400 hover:bg-orange-50/60",
      iconBg: "bg-orange-100 text-orange-700",
      accent: "text-orange-700",
      badge: "bg-orange-100 text-orange-800",
    },
    moderate: {
      border: "border-amber-300 bg-amber-50/40 hover:border-amber-400 hover:bg-amber-50/60",
      iconBg: "bg-amber-100 text-amber-700",
      accent: "text-amber-700",
      badge: "bg-amber-100 text-amber-800",
    },
    safe: {
      border: "border-emerald-300 bg-emerald-50/40 hover:border-emerald-400 hover:bg-emerald-50/60",
      iconBg: "bg-emerald-100 text-emerald-700",
      accent: "text-emerald-700",
      badge: "bg-emerald-100 text-emerald-800",
    },
  };

  const style = variantStyles[variant];

  const content = (
    <div
      className={cn(
        "p-5 rounded-lg border bg-white shadow-sm flex items-start justify-between transition-all duration-200",
        style.border,
        (href || onClick) && "cursor-pointer group hover:shadow-md hover:-translate-y-0.5"
      )}
      onClick={onClick}
    >
      <div>
        <div className="flex items-center space-x-1.5 mb-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          {href && (
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
          )}
        </div>
        <div className="flex items-baseline space-x-2">
          <span className={cn("text-3xl font-extrabold tracking-tight", style.accent)}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>

      <div className={cn("p-2.5 rounded-lg transition-transform group-hover:scale-105", style.iconBg)}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};


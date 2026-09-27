import React from "react";
import { cn, getRiskColorClass } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  riskLevel?: string;
  variant?: "risk" | "neutral" | "brand";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  riskLevel,
  variant = "risk",
  className,
}) => {
  if (variant === "risk" && riskLevel) {
    const colors = getRiskColorClass(riskLevel);
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
          colors.bg,
          colors.text,
          colors.border,
          className
        )}
      >
        <span className={cn("w-1.5 h-1.5 rounded-full", colors.dot)} />
        {children}
      </span>
    );
  }

  if (variant === "brand") {
    return (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200",
          className
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200",
        className
      )}
    >
      {children}
    </span>
  );
};

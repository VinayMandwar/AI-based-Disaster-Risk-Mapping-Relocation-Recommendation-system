import React from "react";
import { RiskDistributionItem } from "@/types";
import { formatRiskLevel } from "@/lib/utils";

interface RiskDistributionChartProps {
  items: RiskDistributionItem[];
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ items }) => {
  const total = items.reduce((acc, curr) => acc + curr.count, 0) || 1;

  return (
    <div className="space-y-4">
      {/* Horizontal Stacked Bar */}
      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
        {items.map((item) => {
          const widthPct = (item.count / total) * 100;
          if (widthPct === 0) return null;
          return (
            <div
              key={item.risk_level}
              style={{ width: `${widthPct}%`, backgroundColor: item.color }}
              className="h-full transition-all duration-300 relative group"
              title={`${formatRiskLevel(item.risk_level)}: ${item.count} (${item.percentage}%)`}
            />
          );
        })}
      </div>

      {/* Legend & Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {items.map((item) => (
          <div
            key={item.risk_level}
            className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col justify-between"
          >
            <div className="flex items-center space-x-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-semibold text-slate-700 truncate">
                {formatRiskLevel(item.risk_level)}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-900">{item.count}</span>
              <span className="text-xs text-slate-500 font-medium">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

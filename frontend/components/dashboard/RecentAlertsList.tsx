import React from "react";
import Link from "next/link";
import { RecentAlertSummary } from "@/types";
import { AlertCircle, AlertTriangle, Info, ArrowUpRight } from "lucide-react";

interface RecentAlertsListProps {
  alerts: RecentAlertSummary[];
}

export const RecentAlertsList: React.FC<RecentAlertsListProps> = ({ alerts }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "CRITICAL":
        return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />;
      case "HIGH":
        return <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-amber-500 shrink-0" />;
    }
  };

  return (
    <div className="space-y-2.5">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-start space-x-3"
        >
          <div className="mt-0.5">{getSeverityIcon(alert.severity)}</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 truncate">{alert.title}</h4>
              <span className="text-[10px] text-slate-400">
                {new Date(alert.issued_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
              {alert.message}
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="font-medium text-slate-500">
                Loc: {alert.habitation_name || "Regional"}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {alert.alert_type}
              </span>
            </div>
          </div>
        </div>
      ))}

      <div className="pt-2 text-center">
        <Link
          href="/alerts"
          className="inline-flex items-center text-xs font-semibold text-emerald-700 hover:text-emerald-900"
        >
          <span>Open Full Alert Command Center</span>
          <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>
    </div>
  );
};

import React from "react";
import Link from "next/link";
import { HighRiskHabitationSummary } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatRiskLevel } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface HighRiskHabitationsTableProps {
  habitations: HighRiskHabitationSummary[];
}

export const HighRiskHabitationsTable: React.FC<HighRiskHabitationsTableProps> = ({
  habitations,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
            <th className="py-3 px-4">Habitation</th>
            <th className="py-3 px-4">District / State</th>
            <th className="py-3 px-4">Primary Hazard</th>
            <th className="py-3 px-4">Risk Level</th>
            <th className="py-3 px-4">Risk Score</th>
            <th className="py-3 px-4">Population</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {habitations.map((hab) => (
            <tr key={hab.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="py-3 px-4">
                <div className="font-semibold text-slate-900">{hab.habitation}</div>
                <div className="text-xs text-slate-400 font-mono">{hab.code}</div>
              </td>
              <td className="py-3 px-4 text-slate-600">
                <span className="font-medium text-slate-800">{hab.district}</span>
                <span className="text-xs text-slate-400 block">{hab.state}</span>
              </td>
              <td className="py-3 px-4">
                <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {hab.primary_hazard}
                </span>
              </td>
              <td className="py-3 px-4">
                <Badge riskLevel={hab.risk_level}>{formatRiskLevel(hab.risk_level)}</Badge>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-slate-900">{hab.risk_score.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">/100</span>
                </div>
              </td>
              <td className="py-3 px-4 font-medium text-slate-700">
                {hab.population.toLocaleString()}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    hab.status === "MONITORED"
                      ? "bg-amber-100 text-amber-800"
                      : hab.status === "RELOCATING"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {hab.status}
                </span>
              </td>
              <td className="py-3 px-2 text-right">
                <Link
                  href={`/habitations`}
                  className="inline-flex items-center text-xs font-medium text-emerald-700 hover:text-emerald-900 hover:underline p-1"
                >
                  <span>View</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

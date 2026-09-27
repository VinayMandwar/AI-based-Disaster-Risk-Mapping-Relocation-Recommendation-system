"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { FileText, Download, Printer, Shield, Calendar, CheckCircle } from "lucide-react";

export default function ReportsPage() {
  const reports = [
    {
      title: "Comprehensive Multi-Hazard Vulnerability Briefing",
      date: "September 15, 2026",
      type: "Executive Risk Summary",
      format: "PDF (1.8 MB)",
      description:
        "Full synthesis of Chamoli, Tehri Garhwal, Varanasi, and Baramulla hazard scores, slope stability indices, and demographic exposures.",
    },
    {
      title: "Carrying Capacity & Saturation Audit Q3",
      date: "September 12, 2026",
      type: "Infrastructural Analysis",
      format: "PDF (2.4 MB)",
      description:
        "Detailed evaluations of water supply, emergency shelter thresholds, and lifeline stress ratios across 6 surveyed clusters.",
    },
    {
      title: "Immediate Relocation Action Plan (Priority Red Zones)",
      date: "September 10, 2026",
      type: "Operational Directive",
      format: "PDF (3.1 MB)",
      description:
        "Allocation plan designating 1,720 citizens from Nandi Gram Tola and Varuna River Bank to Chamoli & Varanasi Safe Zones.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Executive Disaster Risk Reports
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Archived operational reports, carrying capacity assessments, and relocation action plans.
        </p>
      </div>

      <div className="space-y-4">
        {reports.map((rpt, i) => (
          <Card key={i}>
            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 text-base">{rpt.title}</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {rpt.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    {rpt.description}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{rpt.date}</span>
                    </span>
                    <span>•</span>
                    <span>File size: {rpt.format}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Certified Demo Record</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => alert("Report generation is configured for DEMO evaluation.")}
                  className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 flex items-center space-x-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Brief</span>
                </button>
                <button
                  onClick={() => alert("Downloading Demo Executive Report...")}
                  className="px-3 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-md flex items-center space-x-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

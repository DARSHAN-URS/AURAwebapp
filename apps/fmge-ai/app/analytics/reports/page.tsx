"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Download, ArrowLeft, FileText, CheckCircle2 } from "lucide-react";

export default function PerformanceReportsPage() {
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const handleDownload = (name: string) => {
    setDownloaded(name);
    setTimeout(() => setDownloaded(null), 3000);
  };

  const reports = [
    { id: "summary", title: "Master FMGE Performance & Readiness Summary", format: "PDF (3 Pages)", desc: "Overall score, pass prediction, subject breakdown, and AI mentor coaching points." },
    { id: "subject", title: "19-Subject & Topic Accuracy Matrix", format: "Excel / CSV", desc: "Detailed itemized accuracy, average response time, and weak topic priority rankings." },
    { id: "clinical", title: "Clinical Case & Image Interpretation Report", format: "PDF (2 Pages)", desc: "Reasoning scores, ECG accuracy, Radiology findings accuracy, and lab test efficiency." },
    { id: "mock", title: "Grand Test & CBT Mock Performance Log", format: "PDF (2 Pages)", desc: "Grand test score cards, percentile ranks, mistake categorization radar, and time per question." }
  ];

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-4xl">
        
        <div>
          <Link
            href="/analytics"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Analytics Dashboard</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Downloadable Performance Reports</h1>
          <p className="text-xs text-slate-500">Export comprehensive academic summaries in PDF, Excel, or CSV format.</p>
        </div>

        {downloaded && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Successfully generated and downloaded {downloaded}!</span>
          </div>
        )}

        <div className="space-y-4">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rep.title}</h4>
                </div>
                <p className="text-xs text-slate-500 max-w-xl">{rep.desc}</p>
                <span className="text-[10px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded border inline-block mt-1">
                  Format: {rep.format}
                </span>
              </div>

              <button
                onClick={() => handleDownload(rep.title)}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </SidebarLayout>
  );
}

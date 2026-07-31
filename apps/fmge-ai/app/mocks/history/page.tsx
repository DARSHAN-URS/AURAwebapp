"use client";

import React from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { History, CheckCircle2, ChevronRight, ExternalLink } from "lucide-react";

export default function TestHistoryPage() {
  const history = [
    { id: "gt-01", title: "NBE FMGE Official Grand Test #1", date: "2026-07-28", score: "188 / 300", passed: true, duration: "264 Mins", percentile: "88.4th" },
    { id: "mini-01", title: "Pharmacology & Pathology Mini Mock", date: "2026-07-20", score: "42 / 60", passed: true, duration: "48 Mins", percentile: "84.0th" },
    { id: "gt-00", title: "Baseline Diagnostic Test", date: "2026-07-10", score: "154 / 300", passed: true, duration: "280 Mins", percentile: "68.2th" }
  ];

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Past Test Attempt History</h1>
          <p className="text-xs text-slate-500">Review scores, AI diagnostic reports, and question streams from past tests.</p>
        </div>

        <div className="space-y-3">
          {history.map((t) => (
            <div
              key={t.id}
              className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.title}</h4>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                    PASSED
                  </span>
                </div>
                <p className="text-xs text-slate-500">{t.date} • Duration: {t.duration} • {t.percentile} Percentile</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-black text-lg text-teal-600 dark:text-teal-400">{t.score}</span>
                <Link
                  href={`/mocks/results/${t.id}`}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow flex items-center gap-1"
                >
                  <span>Report</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}

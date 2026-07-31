"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import {
  Trophy, ArrowLeft, Download, Award, CheckCircle2, ShieldCheck, Sparkles
} from "lucide-react";

export default function StudentPortfolioPage() {
  const [downloaded, setDownloaded] = useState(false);

  const handleExport = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-5xl">
        <Link
          href="/achievements"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Achievements Hub</span>
        </Link>

        {/* Profile Card Header */}
        <div className="glass-panel p-8 rounded-3xl border border-teal-200 dark:border-slate-800 bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-300 bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
                Verified Medical Student Portfolio
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Dr. Rahul Sharma</h1>
            <p className="text-xs text-slate-300">Kursk State Medical University, Russia • Target: FMGE Dec 2026</p>
          </div>

          <button
            onClick={handleExport}
            className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{downloaded ? "Portfolio PDF Exported!" : "Export Portfolio PDF"}</span>
          </button>
        </div>

        {/* Portfolio Key Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">AI Readiness Score</span>
            <div className="text-2xl font-black text-teal-600">84.5%</div>
            <span className="text-[11px] text-emerald-600 font-bold">194/300 Est. Marks</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Questions Solved</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">3,420 MCQs</div>
            <span className="text-[11px] text-slate-500">78.4% Avg Accuracy</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Clinical Cases</span>
            <div className="text-2xl font-black text-emerald-600">14 Solved</div>
            <span className="text-[11px] text-slate-500">88.4% Reasoning Score</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total XP & Badges</span>
            <div className="text-2xl font-black text-amber-500">4,250 XP</div>
            <span className="text-[11px] text-slate-500">5 Badges • 2 Certs</span>
          </div>
        </div>

        {/* Chronological Academic Timeline */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Chronological Academic Timeline</h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Completed Medical Image Interpretation Lab (Radiology & ECG)</span>
                <p className="text-slate-500 text-[11px]">89.0% Visual Recognition Accuracy</p>
              </div>
              <span className="font-mono text-slate-400">2026-07-31</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Issued Certificate of Clinical Case Mastery</span>
                <p className="text-slate-500 text-[11px]">QR Code Verified Credential (CERT-FMGE-901)</p>
              </div>
              <span className="font-mono text-slate-400">2026-07-30</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Scored 188 / 300 Marks in NBE Grand Test #1</span>
                <p className="text-slate-500 text-[11px]">88.4th Percentile Rank</p>
              </div>
              <span className="font-mono text-slate-400">2026-07-28</span>
            </div>
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}

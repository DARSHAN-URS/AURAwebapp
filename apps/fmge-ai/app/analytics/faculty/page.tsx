"use client";

import React from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Users, ArrowLeft, Download, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";

export default function FacultyAnalyticsPage() {
  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-6xl">
        
        <div>
          <Link
            href="/analytics"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Analytics Dashboard</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Faculty & Institution Cohort Dashboard</h1>
          <p className="text-xs text-slate-500">Monitor candidate cohort performance, weak subjects, attendance, and Grand Test pass rates.</p>
        </div>

        {/* Cohort Stats Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Enrolled Candidates</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">1,420 Doctors</div>
            <span className="text-[11px] text-slate-500">Kursk State Med Univ Cohort</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Readiness Score</span>
            <div className="text-2xl font-black text-teal-600">81.4%</div>
            <span className="text-[11px] text-emerald-600 font-bold">+3.2% vs last month</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Predicted Pass Rate</span>
            <div className="text-2xl font-black text-emerald-600">86.2%</div>
            <span className="text-[11px] text-slate-500">1,224 Candidates Projected Pass</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Priority Weak Spot</span>
            <div className="text-2xl font-black text-rose-600">PSM</div>
            <span className="text-[11px] text-rose-600 font-bold">Needs Faculty Intervention</span>
          </div>
        </div>

        {/* Faculty Action Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Faculty Quick Actions</h3>
          
          <div className="flex flex-wrap gap-3">
            <button className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow">
              Assign Remedial Quiz to Low Performers (&lt; 150 Marks)
            </button>

            <button className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200">
              Export Institution Cohort CSV
            </button>
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}

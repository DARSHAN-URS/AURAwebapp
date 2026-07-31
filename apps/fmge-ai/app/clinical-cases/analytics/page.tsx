"use client";

import React from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Activity, ArrowLeft, CheckCircle2, TrendingUp, Sparkles, AlertCircle } from "lucide-react";

export default function ClinicalAnalyticsPage() {
  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-4xl">
        
        <div>
          <Link
            href="/clinical-cases"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Clinical Hub</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Clinical Reasoning Analytics</h1>
          <p className="text-xs text-slate-500">Performance metrics across diagnostic accuracy, lab efficiency, and emergency cases.</p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Reasoning Score Avg</span>
            <div className="text-2xl font-black text-teal-600">91.2%</div>
            <span className="text-[11px] text-emerald-600 font-bold">Level 4 Clinical Decision Maker</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Diagnostic Accuracy</span>
            <div className="text-2xl font-black text-emerald-600">88.4%</div>
            <span className="text-[11px] text-slate-500">14 Patient Cases Solved</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency Mode Success</span>
            <div className="text-2xl font-black text-indigo-600">92.0%</div>
            <span className="text-[11px] text-slate-500">ACS, Sepsis, Stroke</span>
          </div>
        </div>

        {/* Specialty Strengths & Weaknesses */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Specialty Breakdown</h3>
          
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-900 dark:text-emerald-200">
              <span className="font-bold block mb-0.5">Top Performing Specialty: Cardiology & Emergency Medicine (95.4%)</span>
              <p>Strong diagnostic accuracy in ECG interpretation and Acute Coronary Syndrome management.</p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 text-amber-900 dark:text-amber-200">
              <span className="font-bold block mb-0.5">Recommended Priority Focus: Pediatric Airway Emergencies (72.0%)</span>
              <p>Re-review differentiate Acute Epiglottitis vs Croup inspiratory stridor management.</p>
            </div>
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { CheckCircle2, Sparkles, Trophy, ArrowRight, BarChart3, AlertCircle } from "lucide-react";

export default function MockTestResultsPage() {
  const [activeTab, setActiveTab] = useState<"analytics" | "review">("analytics");

  const resultData = {
    score: "188 / 300",
    cutoff: 150,
    passed: true,
    percentile: "88.4th",
    accuracy: "76.5%",
    speed: "48s / MCQ",
    pass_prediction: "89.4%",
    mistakes: [
      { category: "Knowledge Gap", pct: 45, desc: "Missing factual detail in Autonomic Drugs" },
      { category: "Concept Confusion", pct: 30, desc: "Confused IWMI RCA vs LCx vascular territory" },
      { category: "Carelessness", pct: 15, desc: "Misread EXCEPT in 3 question stems" },
      { category: "Time Pressure", pct: 10, desc: "Rushed last 10 questions in Part B" }
    ]
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-6xl">
        
        {/* Header */}
        <div className="glass-panel p-8 rounded-3xl border border-teal-200 dark:border-slate-800 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>PASSED (Cutoff: 150/300)</span>
              </span>
              <span className="text-xs font-bold text-teal-300 bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
                {resultData.percentile} Percentile
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Grand Test #1 Performance Report
            </h1>
            <p className="text-xs text-slate-300">Attempted on July 31, 2026 • Duration: 264 Mins</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center shrink-0 min-w-[180px]">
            <div className="text-3xl font-black text-teal-300">{resultData.score}</div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300 mt-1">
              Final Marks (62.6%)
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "analytics"
                ? "bg-teal-600 text-white shadow-md"
                : "bg-white dark:bg-slate-900 border border-slate-200 text-slate-600"
            }`}
          >
            AI Performance Analytics
          </button>
          <button
            onClick={() => setActiveTab("review")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "review"
                ? "bg-teal-600 text-white shadow-md"
                : "bg-white dark:bg-slate-900 border border-slate-200 text-slate-600"
            }`}
          >
            Question-by-Question Review Mode (300 Qs)
          </button>
        </div>

        {/* Tab 1: AI Performance Analytics */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Pass Prediction</span>
                <div className="text-2xl font-black text-emerald-600">{resultData.pass_prediction}</div>
                <span className="text-[11px] text-slate-500">High Confidence</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Overall Accuracy</span>
                <div className="text-2xl font-black text-teal-600">{resultData.accuracy}</div>
                <span className="text-[11px] text-slate-500">229 Correct / 71 Wrong</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Speed</span>
                <div className="text-2xl font-black text-indigo-600">{resultData.speed}</div>
                <span className="text-[11px] text-slate-500">12s faster than average</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Cutoff Margin</span>
                <div className="text-2xl font-black text-emerald-600">+38 Marks</div>
                <span className="text-[11px] text-slate-500">Above 150 Passing Cutoff</span>
              </div>
            </div>

            {/* AI Mistake Categorization Radar */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">AI Mistake Categorization Radar</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {resultData.mistakes.map((m) => (
                  <div key={m.category} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-900 dark:text-white">{m.category}</span>
                      <span className="text-teal-600">{m.pct}% of Errors</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Review Mode */}
        {activeTab === "review" && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Question Review Stream</h3>
            <p className="text-xs text-slate-500">Showing Question 1 of 300</p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-teal-600">Question #1 • General Medicine (Cardiology)</div>
              <p className="text-slate-800 dark:text-slate-200">
                A 45-year-old diabetic male presents with sudden onset crushing retrosternal chest pain...
              </p>
              <div className="text-emerald-600 font-bold">Your Answer: B. Right Coronary Artery (RCA) — Correct!</div>
            </div>
          </div>
        )}

      </div>
    </SidebarLayout>
  );
}

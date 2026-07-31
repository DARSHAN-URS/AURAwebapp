"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Target, ArrowLeft, Plus, CheckCircle2, TrendingUp, Clock, Zap } from "lucide-react";

export default function GoalsPage() {
  const [goals, setGoals] = useState([
    { id: "g1", title: "Master 1,850 Pharmacology QBank MCQs", target: "1,850 MCQs", progress: "1,420 / 1,850", pct: 76.7, deadline: "2026-08-15" },
    { id: "g2", title: "Maintain 7-Day Continuous Study Streak", target: "7 Days", progress: "7 / 7 Days", pct: 100.0, deadline: "Ongoing" },
    { id: "g3", title: "Score > 190 in NBE Grand Test #2", target: "190 Marks", progress: "Est. 188 Marks", pct: 98.9, deadline: "2026-08-05" }
  ]);

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-4xl">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/planner"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Planner Hub</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Study Goals & Productivity</h1>
            <p className="text-xs text-slate-500">Track target objectives, learning speed, and consistency metrics.</p>
          </div>

          <button className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs shadow flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add Study Goal</span>
          </button>
        </div>

        {/* Productivity Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Weekly Focus Time</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">28.5 Hours</div>
            <span className="text-[11px] text-emerald-600 font-bold">+4.2 hrs vs last week</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Task Completion Rate</span>
            <div className="text-2xl font-black text-teal-600">92.4%</div>
            <span className="text-[11px] text-slate-500">38 of 41 Tasks Done</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Learning Velocity</span>
            <div className="text-2xl font-black text-indigo-600">42 Qs / Hour</div>
            <span className="text-[11px] text-slate-500">High Retention Score</span>
          </div>
        </div>

        {/* Active Goals List */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Active FMGE Study Goals</h3>
          
          <div className="space-y-4">
            {goals.map((g) => (
              <div key={g.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{g.title}</h4>
                  <span className="text-[11px] font-bold text-teal-600">{g.progress}</span>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                  <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${g.pct}%` }} />
                </div>
                
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>Target: {g.target}</span>
                  <span>Deadline: {g.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}

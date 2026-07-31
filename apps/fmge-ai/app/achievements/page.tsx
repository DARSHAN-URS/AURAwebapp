"use client";

import React from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import {
  Award, Sparkles, Trophy, Zap, ShieldCheck, CheckCircle2, ArrowRight,
  FileCheck, Layers, Eye
} from "lucide-react";

const badges = [
  { id: "b1", name: "First NBE Mock", desc: "Completed your first 300-Q NBE Grand Test", category: "Mock Tests", unlocked: true, date: "2026-07-10", xp: 100 },
  { id: "b2", name: "1,000 Questions Solved", desc: "Crossed 1,000 practice MCQs in QBank", category: "QBank", unlocked: true, date: "2026-07-18", xp: 150 },
  { id: "b3", name: "7-Day Study Streak", desc: "Studied continuously for 7 days without missing a target", category: "Consistency", unlocked: true, date: "2026-07-28", xp: 75 },
  { id: "b4", name: "Clinical Case Expert", desc: "Solved 10 EMR virtual patient encounters with 90%+ reasoning", category: "Clinical", unlocked: true, date: "2026-07-30", xp: 200 },
  { id: "b5", name: "Radiology & ECG Master", desc: "Completed 50 Radiology X-Ray & ECG visual diagnoses", category: "Image Lab", unlocked: true, date: "2026-07-31", xp: 150 },
  { id: "b6", name: "NBE Top Performer (90%+)", desc: "Scored over 90% accuracy in a full Grand Test", category: "Mock Tests", unlocked: false, date: null, xp: 500 }
];

export default function AchievementsPage() {
  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-7xl">
        
        {/* Header Ribbon */}
        <div className="glass-panel p-8 rounded-3xl border border-teal-200 dark:border-slate-800 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-300 bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
                Gamification & Progression
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Level 4: <span className="text-teal-400">Clinician</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Earn XP points, unlock digital badges, complete daily challenges, and build a verifiable academic portfolio.
            </p>
          </div>

          {/* XP Level Gauge */}
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center shrink-0 min-w-[220px]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">Level 4 Progression</span>
            <div className="text-3xl font-black text-teal-400 mt-1">4,250 / 5,000 XP</div>
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
              <div className="bg-teal-400 h-2 rounded-full" style={{ width: "85%" }} />
            </div>
            <span className="text-[11px] font-bold text-slate-300 block mt-1">Next: Level 5 Medical Expert</span>
          </div>
        </div>

        {/* Quick Nav Bar */}
        <div className="flex justify-end gap-3">
          <Link
            href="/certificates"
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 shadow-sm"
          >
            <FileCheck className="w-4 h-4 text-teal-600" />
            <span>Digital Certificates Showcase</span>
          </Link>

          <Link
            href="/portfolio"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Learning Portfolio</span>
          </Link>
        </div>

        {/* Digital Trophy Cabinet & Badges Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Digital Trophy Cabinet</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`glass-panel p-6 rounded-2xl border transition-all ${
                  b.unlocked
                    ? "border-teal-200 dark:border-slate-800 space-y-3"
                    : "border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50 dark:bg-slate-950"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow ${
                    b.unlocked ? "bg-teal-600" : "bg-slate-700"
                  }`}>
                    <Award className="w-5 h-5" />
                  </div>

                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                    +{b.xp} XP
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{b.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
                </div>

                <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-slate-100 dark:border-slate-800">
                  <span>Category: {b.category}</span>
                  <span>{b.unlocked ? `Unlocked: ${b.date}` : "Locked"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}

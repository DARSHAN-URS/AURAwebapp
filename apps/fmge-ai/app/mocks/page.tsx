"use client";

import React from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Clock, Trophy, Play, Settings, History, CheckCircle2, Zap, ArrowRight, ShieldCheck } from "lucide-react";

export default function MocksHubPage() {
  const templates = [
    {
      id: "gt-01",
      title: "NBE FMGE Official Grand Test #1",
      subtitle: "300 Questions • 300 Minutes • Official NBE Exam Pattern",
      parts: "Part A (150 Qs) + Part B (150 Qs)",
      attempts: "8,940 Candidates",
      avgScore: "178 / 300",
      cutoff: "150 Marks"
    },
    {
      id: "gt-02",
      title: "NBE FMGE Official Grand Test #2",
      subtitle: "300 Questions • 300 Minutes • High Yield Clinical Focus",
      parts: "Part A (150 Qs) + Part B (150 Qs)",
      attempts: "6,420 Candidates",
      avgScore: "184 / 300",
      cutoff: "150 Marks"
    }
  ];

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-7xl">
        
        {/* Header Banner */}
        <div className="glass-panel p-8 rounded-3xl border border-teal-200 dark:border-slate-800 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white space-y-4 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-300 bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
              Official NBE Computer-Based Test (CBT) Simulator
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            FMGE AI <span className="text-teal-400">Mock Test Engine</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Replicate the exact NBE examination environment with Part A & B split sessions, timed question palettes, auto-save, and AI pass prediction analytics.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/mocks/builder"
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span>Configure Custom Test</span>
            </Link>

            <Link
              href="/mocks/history"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-2"
            >
              <History className="w-4 h-4 text-teal-300" />
              <span>Past Attempt History</span>
            </Link>

            <Link
              href="/mocks/leaderboard"
              className="px-6 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              <span>View Leaderboard</span>
            </Link>
          </div>
        </div>

        {/* Daily 20-Q Challenge Banner */}
        <div className="glass-panel p-6 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <Zap className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Today's Daily 20-Q Challenge</h3>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Live Leaderboard</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">20 Adaptive Questions • 20 Mins • Earn 50 XP Rank Points</p>
            </div>
          </div>

          <Link
            href="/mocks/simulation?test_id=daily-challenge"
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow shrink-0"
          >
            Start Daily Challenge
          </Link>
        </div>

        {/* Full NBE Grand Tests Directory */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Full NBE Grand Tests (300 Questions)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((gt) => (
              <div
                key={gt.id}
                className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-teal-600 uppercase bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded border">
                      NBE CBT Pattern
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{gt.attempts}</span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{gt.title}</h3>
                  <p className="text-xs text-slate-500">{gt.subtitle}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Session Layout:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{gt.parts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pass Cutoff:</span>
                    <span className="font-bold text-emerald-600">{gt.cutoff} (50%)</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Avg Score: {gt.avgScore}</span>
                  <Link
                    href={`/mocks/simulation?test_id=${gt.id}`}
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Launch NBE Exam</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}

"use client";

import React, { useState } from "react";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Trophy, Award, ShieldCheck, Crown } from "lucide-react";

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "grand">("grand");

  const ranks = [
    { rank: 1, name: "Dr. Ananya Patel", college: "Tbilisi State Med Univ, Georgia", score: "242 / 300", percentile: "99.9th" },
    { rank: 2, name: "Dr. Mohammed Nizam", college: "Davao Med School, Philippines", score: "238 / 300", percentile: "99.7th" },
    { rank: 3, name: "Dr. Rahul Sharma (You)", college: "Kursk State Med Univ, Russia", score: "234 / 300", percentile: "99.4th", currentUser: true },
    { rank: 4, name: "Dr. Sneha Verma", college: "Samarkand State Med Univ, Uzbekistan", score: "228 / 300", percentile: "98.9th" },
    { rank: 5, name: "Dr. Alexey Ivanov", college: "First Moscow State Med Univ, Russia", score: "222 / 300", percentile: "98.1th" },
  ];

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Candidate Leaderboards</h1>
            <p className="text-xs text-slate-500">Compare performance with 14,000+ foreign medical graduates worldwide.</p>
          </div>

          <div className="flex gap-2">
            {[
              { id: "daily", label: "Daily Challenge" },
              { id: "weekly", label: "Weekly Top" },
              { id: "grand", label: "Grand Test Ranks" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  period === p.id
                    ? "bg-amber-500 text-slate-950 shadow-md font-black"
                    : "bg-white dark:bg-slate-900 border border-slate-200 text-slate-600"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium Card */}
        <div className="glass-panel p-8 rounded-3xl border border-amber-200 dark:border-slate-800 bg-slate-900 text-white space-y-6 shadow-2xl">
          <div className="text-center space-y-1">
            <Trophy className="w-10 h-10 text-amber-400 mx-auto" />
            <h2 className="text-xl font-extrabold">July 2026 NBE Grand Test Leaders</h2>
            <p className="text-xs text-slate-400">National FMG Aspirants Ranking</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {ranks.slice(0, 3).map((r) => (
              <div
                key={r.rank}
                className={`p-4 rounded-2xl border text-center space-y-2 ${
                  r.rank === 1
                    ? "bg-amber-950/80 border-amber-500 ring-2 ring-amber-500/30"
                    : "bg-slate-800/80 border-slate-700"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto">
                  #{r.rank}
                </div>
                <h4 className="font-bold text-xs text-white truncate">{r.name}</h4>
                <p className="text-[10px] text-slate-400 truncate">{r.college}</p>
                <div className="text-xs font-black text-amber-300">{r.score}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Rank Table */}
        <div className="space-y-2">
          {ranks.map((r) => (
            <div
              key={r.rank}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                r.currentUser
                  ? "bg-teal-50 dark:bg-teal-950/80 border-teal-500 font-bold"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 font-black text-xs text-slate-400">#{r.rank}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{r.name}</h4>
                  <p className="text-[10px] text-slate-500">{r.college}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-black text-teal-600">{r.score}</div>
                <span className="text-[10px] text-slate-400 font-semibold">{r.percentile}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </SidebarLayout>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Zap, Clock, ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";

export default function RapidRevisionPage() {
  const [count, setCount] = useState(50);

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-4xl">
        <Link
          href="/qbank"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to QBank Explorer</span>
        </Link>

        <div className="glass-panel p-8 rounded-3xl border border-amber-200 dark:border-slate-800 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 text-white space-y-4 shadow-2xl">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Rapid Revision Engine
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            High-Yield <span className="text-amber-400">Rapid Fire MCQ Review</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Rapid-fire question stream for fast recall before exam day. Select 50 or 100 questions set.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setCount(50)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                count === 50
                  ? "bg-amber-500 text-slate-950 border-amber-500 font-extrabold"
                  : "bg-white/10 text-white border-white/20"
              }`}
            >
              50 High-Yield Set (~30 Mins)
            </button>

            <button
              onClick={() => setCount(100)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                count === 100
                  ? "bg-amber-500 text-slate-950 border-amber-500 font-extrabold"
                  : "bg-white/10 text-white border-white/20"
              }`}
            >
              100 Rapid Review Set (~60 Mins)
            </button>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link
            href={`/qbank/session?mode=rapid&count=${count}`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/30"
          >
            <span>Launch {count}-Question Rapid Session</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </SidebarLayout>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { BookOpen, ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";

export default function AIQuizPage() {
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-4xl">
        <Link
          href="/ai-tutor"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to AI Tutor Workspace</span>
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">AI Generated Mini Quiz</h1>
          <p className="text-xs text-slate-500">10-Question topic evaluation generated from your recent tutor chat.</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-teal-600">Question 1 of 10 • Pharmacology</span>
          </div>

          <p className="text-xs font-semibold text-slate-900 dark:text-white">
            Which arrhythmia is considered most specific for digitalis toxicity?
          </p>

          <div className="space-y-2">
            {["Sinus Bradycardia", "Paroxysmal Atrial Tachycardia with AV Block", "Ventricular Fibrillation", "Atrial Flutter"].map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelectedOpt(i)}
                className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all ${
                  selectedOpt === i
                    ? "bg-teal-50 border-teal-500 text-teal-900 font-bold"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

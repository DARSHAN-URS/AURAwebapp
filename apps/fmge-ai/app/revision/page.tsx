"use client";

import React, { useState } from "react";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Layers, RotateCw, CheckCircle2, Sparkles } from "lucide-react";

export default function RevisionPage() {
  const [flipped, setFlipped] = useState(false);

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
            SM-2 Spaced Repetition Engine
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Revision Center & High-Yield Flashcards
          </h1>
          <p className="text-xs text-slate-500">
            5,000+ medical flashcards for rapid-fire recall of drug side effects, triads, and syndromes.
          </p>
        </div>

        {/* Flashcard Component */}
        <div
          onClick={() => setFlipped(!flipped)}
          className="glass-panel p-10 rounded-3xl border border-teal-200 dark:border-slate-800 shadow-xl cursor-pointer text-center space-y-4 transition-all hover:scale-[1.01] min-h-[260px] flex flex-col justify-center items-center"
        >
          {!flipped ? (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-teal-600">Flashcard Question • Click to Flip</span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                What is the classic triad of Normal Pressure Hydrocephalus (NPH)?
              </h3>
              <p className="text-xs text-slate-400">Subject: Neurology / Psychiatry</p>
            </div>
          ) : (
            <div className="space-y-2 animate-fadeIn">
              <span className="text-xs font-bold uppercase text-emerald-600">Answer & High-Yield Triad</span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                "Wet, Wacky, and Wobbly"
              </h3>
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p>1. Urinary Incontinence (Wet)</p>
                <p>2. Dementia & Cognitive Decline (Wacky)</p>
                <p>3. Gait Ataxia & Apraxia (Wobbly)</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 pt-4">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Click card to flip answer</span>
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Layers, ArrowLeft, RotateCw, Plus, Sparkles } from "lucide-react";

export default function AIFlashcardsPage() {
  const [cards, setCards] = useState([
    { q: "What is the mechanism of action of Digoxin?", a: "Inhibits Na+/K+-ATPase pump -> Increases intracellular Ca2+ -> Positive Inotropy." },
    { q: "What is the most specific arrhythmia seen in Digoxin toxicity?", a: "Paroxysmal Atrial Tachycardia (PAT) with AV Block." },
    { q: "What is the classic ECG ST segment appearance in digitalis effect?", a: "Reverse Tick / 'Hockey Stick' ST segment depression." }
  ]);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

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
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">AI Generated Flashcards</h1>
          <p className="text-xs text-slate-500">Auto-generated spaced-repetition flashcards from your AI Tutor conversations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((c, i) => (
            <div
              key={i}
              onClick={() => setFlipped((prev) => ({ ...prev, [i]: !prev[i] }))}
              className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 cursor-pointer text-center min-h-[180px] flex flex-col justify-center items-center hover:scale-[1.01] transition-transform"
            >
              {!flipped[i] ? (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-teal-600 uppercase">Question • Tap to Flip</span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{c.q}</h4>
                </div>
              ) : (
                <div className="space-y-1 animate-fadeIn">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Answer</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{c.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}

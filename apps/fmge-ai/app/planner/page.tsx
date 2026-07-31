"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import {
  Calendar as CalendarIcon, Sparkles, CheckCircle2, Clock, Zap,
  RotateCw, ArrowRight, Target, Plus, Check, Sliders, ChevronRight
} from "lucide-react";

export default function StudyPlannerPage() {
  const [selectedMode, setSelectedMode] = useState("Standard 120-Day");
  const [tasks, setTasks] = useState([
    {
      id: "task-01",
      subject: "Pharmacology",
      title: "Antimicrobial Drug Mechanisms & Resistance",
      details: "Solve 50 MCQs + Review 20 Spaced Repetition Flashcards",
      mins: 45,
      completed: true
    },
    {
      id: "task-02",
      subject: "Community Medicine (PSM)",
      title: "National Immunization Schedule & Vaccine Storage",
      details: "30 MCQs + Cold Chain System Notes",
      mins: 30,
      completed: false
    },
    {
      id: "task-03",
      subject: "Radiology",
      title: "X-Ray Sign Interpretations (IBQ Focus)",
      details: "15 Radiology Case Slides + Diagnostic Rationale",
      mins: 25,
      completed: false
    }
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-7xl">
        
        {/* Header */}
        <div className="glass-panel p-8 rounded-3xl border border-teal-200 dark:border-slate-800 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white space-y-4 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-300 bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
              Personalized FMGE AI Mentor
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Adaptive <span className="text-teal-400">Study Planner</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Dynamic daily timetables tailored to your target exam date, learning velocity, and spaced repetition revision cycles.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/planner/calendar"
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Interactive Calendar View</span>
            </Link>

            <Link
              href="/planner/goals"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-2"
            >
              <Target className="w-4 h-4 text-teal-300" />
              <span>Study Goals & Productivity</span>
            </Link>
          </div>
        </div>

        {/* AI Mentor Coaching Insight Banner */}
        <div className="glass-panel p-6 rounded-2xl border border-teal-500/40 bg-teal-50/60 dark:bg-teal-950/40 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">AI Mentor Insight</h3>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
            “You're consistently improving in Pharmacology (+14% accuracy this week). We recommend spending 30 minutes revising PSM Biostatistics formulas today.”
          </p>
        </div>

        {/* Plan Mode Selector Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Preparation Mode Selector</h2>
              <p className="text-xs text-slate-500">Switch modes to instantly adjust daily study workload.</p>
            </div>

            <div className="flex gap-2">
              {["Fast Track 60-Day", "Standard 120-Day", "Long-Term 9-Month"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedMode === mode
                      ? "bg-teal-600 text-white shadow-md"
                      : "bg-white dark:bg-slate-900 border border-slate-200 text-slate-600"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Today's Daily Target Checklist */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-teal-600" />
                <span>Today's Daily Target Checklist ({selectedMode})</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">Auto-generated by AI</span>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    task.completed
                      ? "bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 opacity-75"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-500"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {}}
                      className="mt-1 w-4 h-4 accent-teal-600 cursor-pointer"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-teal-600 uppercase bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded border">
                        {task.subject}
                      </span>
                      <h4 className={`font-bold text-xs mt-1 ${task.completed ? "line-through text-slate-500" : "text-slate-900 dark:text-white"}`}>
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{task.details}</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-slate-400 shrink-0">{task.mins} mins</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spaced Repetition Queue */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <RotateCw className="w-5 h-5 text-indigo-600" />
              <span>Spaced Repetition Revision Queue</span>
            </h3>
            <span className="text-xs text-indigo-600 font-bold">SM-2 Algorithm</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">Due Today</span>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Pharmacology • Autonomic Drugs</h4>
              <p className="text-[11px] text-slate-500">7-Day Revision Cycle • 24 Cards</p>
              <Link href="/revision" className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:underline pt-1">
                <span>Revise Cards</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">Tomorrow</span>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Medicine • ECG Signs of MI</h4>
              <p className="text-[11px] text-slate-500">14-Day Revision Cycle • 18 Cards</p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">In 3 Days</span>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Pathology • Hodgkin Lymphoma</h4>
              <p className="text-[11px] text-slate-500">30-Day Revision Cycle • 15 Cards</p>
            </div>
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}

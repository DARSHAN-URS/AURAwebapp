"use client";

import React from "react";
import Link from "next/link";
import { Clock, ShieldCheck, CheckCircle2, Award, Zap, ChevronRight, Play } from "lucide-react";

export function MockPreview() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Mock Exam Card Simulation */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-800 space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-extrabold text-sm text-slate-100 tracking-wide uppercase">
                    NBE Official CBT Exam Interface
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono font-bold bg-amber-950/60 px-3 py-1 rounded border border-amber-800">
                  <Clock className="w-4 h-4" />
                  <span>Time Left: 142:18 Mins</span>
                </div>
              </div>

              {/* Session Parts */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-xs font-bold text-teal-400 uppercase">Part A • Morning</span>
                  <div className="text-xl font-extrabold text-white mt-1">150 Questions</div>
                  <p className="text-xs text-slate-400 mt-1">Pre & Para-Clinical Focus</p>
                  <div className="mt-3 text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed (150/150)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-teal-950/80 border border-teal-700">
                  <span className="text-xs font-bold text-teal-300 uppercase">Part B • Afternoon</span>
                  <div className="text-xl font-extrabold text-white mt-1">150 Questions</div>
                  <p className="text-xs text-slate-300 mt-1">Clinical Specialties Focus</p>
                  <div className="mt-3 text-xs text-amber-300 font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>In Progress (88/150)</span>
                  </div>
                </div>
              </div>

              {/* Question Palette Preview */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Live Question Palette (Part B):
                </span>
                <div className="grid grid-cols-10 gap-1.5 mt-3 text-center text-xs font-bold">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const status = i < 12 ? "answered" : i === 12 ? "current" : i === 14 ? "review" : "unvisited";
                    return (
                      <div
                        key={i}
                        className={`py-1.5 rounded transition-all ${
                          status === "answered"
                            ? "bg-emerald-600 text-white"
                            : status === "current"
                            ? "bg-amber-500 text-white ring-2 ring-amber-300"
                            : status === "review"
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {i + 1}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between pt-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500" /> Answered</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo-500" /> Marked for Review</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-slate-700" /> Unvisited</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Text & Features */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
              Exam Simulation Engine
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Authentic <span className="gradient-text">300-Q NBE CBT Exam</span> Simulator
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              Never experience exam hall anxiety. Practice under exact NBE timing, layout, keyboard shortcuts, and review flags.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Part A & Part B Split</h4>
                  <p className="text-xs text-slate-500">150 Questions in Morning (150 mins) and 150 Questions in Afternoon (150 mins) mimicking the exact national exam.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Instant Score & Cutoff Analysis</h4>
                  <p className="text-xs text-slate-500">Find out immediately if you cross the mandatory <strong>150/300 marks cutoff</strong> with subject-wise percentile rankings.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">High-Yield IBQ & Image Bank</h4>
                  <p className="text-xs text-slate-500">Includes 4,500+ high-resolution Radiology X-rays, CT/MRI scans, ECGs, and Histopathology slides.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/mocks"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20"
              >
                <span>Take Free 60-Q Mini GT</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

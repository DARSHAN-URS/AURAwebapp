"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Calendar as CalendarIcon, ArrowLeft, Download, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  const events = [
    { day: "Jul 31", title: "Pharmacology & PSM Practice", type: "study", status: "completed" },
    { day: "Aug 05", title: "NBE Full Mock Test #2", type: "mock", status: "upcoming" },
    { day: "Aug 08", title: "14-Day Spaced Repetition Review", type: "revision", status: "upcoming" },
    { day: "Aug 12", title: "Obstetrics & Gynecology High-Yield Set", type: "study", status: "upcoming" }
  ];

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
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Interactive Study Calendar</h1>
            <p className="text-xs text-slate-500">Visual schedule of study sessions, mock tests, and revision days.</p>
          </div>

          <button className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            <span>Export Calendar (.ics)</span>
          </button>
        </div>

        {/* Monthly Events List */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">August 2026 Schedule Events</h3>
          
          <div className="space-y-3">
            {events.map((ev, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-200 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center text-center leading-tight shrink-0">
                    {ev.day}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{ev.title}</h4>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">{ev.type} session</span>
                  </div>
                </div>

                <span className={`text-xs font-bold px-2.5 py-1 rounded ${
                  ev.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-teal-100 text-teal-800"
                }`}>
                  {ev.status === "completed" ? "Completed" : "Upcoming"}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}

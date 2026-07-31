"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { BookOpen, ArrowLeft, Plus, CheckCircle2, Calendar } from "lucide-react";

export default function AssignmentsManagerPage() {
  const [showModal, setShowModal] = useState(false);
  const [created, setCreated] = useState(false);

  const assignments = [
    {
      id: "asg-101",
      title: "Emergency Cardiology ECG & Chest X-Ray Clinical Assignment",
      batch: "Batch 2026-A",
      type: "Clinical Case & Image Lab",
      due: "2026-08-05",
      completed: 118,
      total: 145,
      status: "In Progress"
    },
    {
      id: "asg-102",
      title: "NBE Grand Test #2 Cohort Simulation",
      batch: "Batch 2026-A",
      type: "Full Mock Test",
      due: "2026-08-10",
      completed: 42,
      total: 145,
      status: "Scheduled"
    }
  ];

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-5xl">
        <Link
          href="/institution"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Institution Dashboard</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Assignment & Assessment Engine</h1>
            <p className="text-xs text-slate-500">Publish mock test assignments, clinical cases, and revision worksheets to batches.</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Assignment</span>
          </button>
        </div>

        {created && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Assignment published successfully to Batch 2026-A!</span>
          </div>
        )}

        <div className="space-y-4">
          {assignments.map((asg) => (
            <div
              key={asg.id}
              className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded border">
                    {asg.type}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{asg.batch}</span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{asg.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Due Date: {asg.due}</span>
                </p>
              </div>

              <div className="text-right shrink-0 space-y-1">
                <span className="text-xs font-bold text-emerald-600">Submissions: {asg.completed} / {asg.total}</span>
                <p className="text-[11px] text-slate-400 font-semibold">{asg.status}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </SidebarLayout>
  );
}

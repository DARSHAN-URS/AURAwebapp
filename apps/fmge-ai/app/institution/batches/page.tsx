"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Layers, ArrowLeft, Plus, Upload, CheckCircle2, Copy } from "lucide-react";

export default function BatchesManagerPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const batches = [
    {
      id: "b-2026-a",
      name: "Batch 2026-A (Dec FMGE Target)",
      code: "KURSK-2026-A",
      department: "General Medicine & Clinical Sciences",
      count: 145,
      max: 150,
      lead: "Dr. V. K. Ivanov",
      readiness: "84.5%"
    },
    {
      id: "b-2026-b",
      name: "Batch 2026-B (Fast-Track Revision)",
      code: "KURSK-2026-B",
      department: "Para-Clinical & High-Yield Revisions",
      count: 120,
      max: 150,
      lead: "Prof. Elena Petrov",
      readiness: "78.2%"
    }
  ];

  const handleCopyCode = (code: string) => {
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

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
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Batch & Student Management</h1>
            <p className="text-xs text-slate-500">Create batches, manage enrollment codes, and bulk import candidates via CSV.</p>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Create New Batch</span>
            </button>

            <button className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-sm flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-teal-600" />
              <span>Bulk CSV Import</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {batches.map((b) => (
            <div
              key={b.id}
              className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{b.name}</h3>
                  <span className="text-[10px] font-mono font-bold text-teal-600 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded border">
                    Code: {b.code}
                  </span>
                  <button
                    onClick={() => handleCopyCode(b.code)}
                    className="p-1 text-slate-400 hover:text-teal-600"
                    title="Copy Enrollment Code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copiedCode === b.code && (
                    <span className="text-[10px] font-bold text-emerald-600">Copied!</span>
                  )}
                </div>

                <p className="text-xs text-slate-500">{b.department} • Lead: {b.lead}</p>
                <p className="text-xs font-bold text-teal-600">Avg Cohort Readiness: {b.readiness}</p>
              </div>

              <div className="text-right shrink-0 space-y-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Enrolled: {b.count} / {b.max}</span>
                <div className="w-36 bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${(b.count / b.max) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </SidebarLayout>
  );
}

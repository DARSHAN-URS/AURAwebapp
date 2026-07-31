"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Lock, ArrowLeft, ShieldCheck, Terminal, ToggleLeft, ToggleRight } from "lucide-react";

export default function SecurityAndAuditLogsPage() {
  const [flags, setFlags] = useState([
    { key: "clinical_simulator_v2", name: "AI Clinical Case Simulator V2", enabled: true },
    { key: "voice_tutor_stt", name: "Speech-to-Text Voice Tutor", enabled: true },
    { key: "pacs_viewer_3d", name: "3D PACS Medical Image Viewer", enabled: false },
    { key: "next_exam_prep_mode", name: "NExT & NEET PG Expansion Mode", enabled: true }
  ]);

  const auditLogs = [
    { id: "log-1", admin: "SuperAdmin (Sunil)", action: "Updated AI Model to Gemini 1.5 Pro", time: "2026-07-31 16:30:00" },
    { id: "log-2", admin: "SuperAdmin (Sunil)", action: "Enabled Feature Flag: clinical_simulator_v2", time: "2026-07-31 15:10:00" },
    { id: "log-3", admin: "SuperAdmin (Sunil)", action: "Issued License to Kursk State Med Univ (1,500 Seats)", time: "2026-07-30 11:00:00" }
  ];

  const toggleFlag = (key: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f))
    );
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-6xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Super Admin Command Center</span>
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Security Center & Feature Flags</h1>
          <p className="text-xs text-slate-500">Immutable audit logs, feature flags toggle registry, and security alerts.</p>
        </div>

        {/* Feature Flags Registry */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Feature Flags Toggle Registry</h3>

          <div className="space-y-2 text-xs">
            {flags.map((f) => (
              <div
                key={f.key}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{f.name}</span>
                  <span className="text-[10px] font-mono text-slate-400 block font-semibold">{f.key}</span>
                </div>

                <button
                  onClick={() => toggleFlag(f.key)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    f.enabled ? "bg-teal-600 text-white shadow" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {f.enabled ? "ENABLED" : "DISABLED"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Immutable Audit Logs Feed */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Immutable Administrative Audit Log</h3>

          <div className="space-y-2 text-xs font-mono">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between"
              >
                <div>
                  <span className="text-teal-400 font-bold">[{log.admin}]</span> {log.action}
                </div>
                <span className="text-slate-500 text-[11px]">{log.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}

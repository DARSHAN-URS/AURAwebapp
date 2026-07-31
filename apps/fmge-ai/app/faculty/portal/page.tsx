"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import {
  Users, ArrowLeft, AlertTriangle, CheckCircle2, Send, BookOpen, Calendar
} from "lucide-react";

export default function FacultyPortalPage() {
  const [announcementMsg, setAnnouncementMsg] = useState("");
  const [announced, setAnnounced] = useState(false);

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementMsg.trim()) return;

    setAnnounced(true);
    setAnnouncementMsg("");
    setTimeout(() => setAnnounced(false), 3000);
  };

  const riskStudents = [
    { id: "st-501", name: "Candidate #501", batch: "Batch 2026-B", estMarks: "138 / 300", reason: "Declining mock test score & Pharmacology accuracy < 50%" },
    { id: "st-502", name: "Candidate #502", batch: "Batch 2026-A", estMarks: "146 / 300", reason: "Low attendance in Clinical Cases & missed 2 weekly study goals" }
  ];

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-6xl">
        
        <div>
          <Link
            href="/institution"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Institution Dashboard</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Faculty Professor Portal</h1>
          <p className="text-xs text-slate-500">Dr. V. K. Ivanov — Professor of Cardiology & General Medicine</p>
        </div>

        {/* Faculty Stats Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Classes</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">3 Active Batches</div>
            <span className="text-[11px] text-slate-500">265 Candidates Managed</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Class Pass Rate</span>
            <div className="text-2xl font-black text-emerald-600">88.5%</div>
            <span className="text-[11px] text-emerald-600 font-bold">+4.1% vs College Average</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Faculty Rating</span>
            <div className="text-2xl font-black text-teal-600">4.9 / 5.0</div>
            <span className="text-[11px] text-slate-500">Student Feedback Score</span>
          </div>
        </div>

        {/* Student Risk Radar Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Candidates Requiring Remedial Intervention</h3>
          </div>

          <div className="space-y-3">
            {riskStudents.map((st) => (
              <div key={st.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{st.name}</span>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">HIGH RISK</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">{st.reason}</p>
                </div>
                <span className="font-bold text-rose-600 shrink-0">Est: {st.estMarks}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Announcement to Class */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Broadcast Class Announcement</h3>

          {announced && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-xs text-emerald-800 dark:text-emerald-300 font-bold">
              Announcement broadcasted to all assigned candidates!
            </div>
          )}

          <form onSubmit={handleSendAnnouncement} className="space-y-3">
            <textarea
              rows={3}
              value={announcementMsg}
              onChange={(e) => setAnnouncementMsg(e.target.value)}
              placeholder="Type urgent study instructions or lecture updates..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Announcement</span>
            </button>
          </form>
        </div>

      </div>
    </SidebarLayout>
  );
}

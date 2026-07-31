"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Stethoscope, AlertTriangle, ChevronRight, Play, HeartPulse, ShieldCheck, Activity } from "lucide-react";

const casesList = [
  {
    id: "c-101",
    title: "Case 101: 45M with Crushing Chest Pain & Diaphoresis",
    subject: "General Medicine",
    organ: "Cardiovascular System",
    difficulty: "Intermediate",
    isEmergency: true,
    patient: "Mr. Rajesh Kumar (45M)",
    complaint: "Severe 2-hour retrosternal chest pain radiating to left jaw & arm.",
    completionRate: "84.5%"
  },
  {
    id: "c-102",
    title: "Case 102: 28F Primigravida at 34 Weeks with Severe Headache",
    subject: "Obstetrics & Gynecology",
    organ: "Reproductive / Renal",
    difficulty: "Hard (NBE Level)",
    isEmergency: true,
    patient: "Mrs. Priya Sharma (28F)",
    complaint: "Severe frontal headache, epigastric discomfort, & blurred vision.",
    completionRate: "79.2%"
  },
  {
    id: "c-103",
    title: "Case 103: 6Y Child with High Fever, Stridor & Drooling",
    subject: "Pediatrics",
    organ: "Respiratory / Airway",
    difficulty: "Emergency",
    isEmergency: true,
    patient: "Master Aarav (6M)",
    complaint: "Sudden onset high fever, severe sore throat, inspiratory stridor, & drooling.",
    completionRate: "72.0%"
  }
];

export default function ClinicalCasesHubPage() {
  const [selectedSubject, setSelectedSubject] = useState("All");

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-7xl">
        
        {/* Header Banner */}
        <div className="glass-panel p-8 rounded-3xl border border-teal-200 dark:border-slate-800 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white space-y-4 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-300 bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
              Interactive EMR Virtual Patient Simulator
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            AI Clinical Case Simulator & <span className="text-teal-400">Medical Reasoning Engine</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Interact with AI virtual patients, take clinical histories, perform physical examinations, order lab investigations & X-rays, formulate differential diagnoses, and receive AI evidence-based feedback.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/clinical-cases/simulator?case_id=c-101"
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Launch Virtual Patient EMR (#101)</span>
            </Link>

            <Link
              href="/clinical-cases/analytics"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-teal-300" />
              <span>Clinical Reasoning Analytics</span>
            </Link>
          </div>
        </div>

        {/* Emergency Case Simulator Banner */}
        <div className="glass-panel p-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Emergency Countdown Mode</h3>
                <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">Time-Critical</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">Simulate acute shock, MI, airway obstruction, & anaphylaxis with 10-minute emergency timers.</p>
            </div>
          </div>

          <Link
            href="/clinical-cases/simulator?case_id=c-103&mode=emergency"
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow shrink-0"
          >
            Start Emergency Case
          </Link>
        </div>

        {/* Clinical Case Directory */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Clinical Patient Encounter Directory</h2>
              <p className="text-xs text-slate-500">Select any patient vignette to launch the interactive EMR workspace.</p>
            </div>

            <div className="flex gap-2">
              {["All", "Medicine", "Surgery", "OBG", "Pediatrics"].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSubject === sub
                      ? "bg-teal-600 text-white shadow-md"
                      : "bg-white dark:bg-slate-900 border border-slate-200 text-slate-600"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {casesList.map((c) => (
              <div
                key={c.id}
                className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-teal-600 uppercase bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded border">
                      {c.subject}
                    </span>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
                      {c.difficulty}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{c.title}</h3>
                  <p className="text-xs text-slate-500 italic">“{c.complaint}”</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Organ System:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{c.organ}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student Success:</span>
                    <span className="font-bold text-emerald-600">{c.completionRate}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    href={`/clinical-cases/simulator?case_id=${c.id}`}
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                  >
                    <span>Open EMR Simulator</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}

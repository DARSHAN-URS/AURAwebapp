"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import {
  Eye, Sparkles, Zap, ChevronRight, Layers, Maximize2, Sliders, Play, Award
} from "lucide-react";

const labs = [
  { id: "radiology", name: "AI Radiology Lab", category: "Radiology", total: 1450, completion: 68, subtypes: "X-Ray, CT Brain, MRI Spine, USG" },
  { id: "pathology", name: "AI Pathology Lab", category: "Pathology", total: 980, completion: 74, subtypes: "Histopathology Slides, Gross Specimens" },
  { id: "ecg", name: "AI 12-Lead ECG Lab", category: "Cardiology", total: 850, completion: 82, subtypes: "STEMI, NSTEMI, AV Blocks, Arrhythmias" },
  { id: "dermatology", name: "AI Dermatology Image Lab", category: "Dermatology", total: 620, completion: 89, subtypes: "Papulosquamous Lesions, Rashes, STDs" },
  { id: "hematology", name: "AI Hematology Lab", category: "Hematology", total: 540, completion: 62, subtypes: "Peripheral Blood Smears, Bone Marrow" },
  { id: "microbiology", name: "AI Microbiology Lab", category: "Microbiology", total: 480, completion: 71, subtypes: "Gram Stains, Culture Plates, Fungi" },
  { id: "ophthalmology", name: "AI Ophthalmology Lab", category: "Ophthalmology", total: 420, completion: 80, subtypes: "Fundoscopy, Retina, Cataract, Glaucoma" },
];

export default function ImageLabDirectoryPage() {
  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-7xl">
        
        {/* Header Banner */}
        <div className="glass-panel p-8 rounded-3xl border border-teal-200 dark:border-slate-800 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white space-y-4 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-300 bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
              Educational PACS Medical Workstation
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            AI Radiology, Pathology & <span className="text-teal-400">Medical Image Lab</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Master visual diagnosis for FMGE with interactive PACS DICOM controls, zoom/contrast sliders, annotation toolbars, and side-by-side normal vs abnormal comparison pairs.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/images/viewer?id=img-101"
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-2"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Launch Educational PACS Workstation</span>
            </Link>

            <Link
              href="/images/compare"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-teal-300" />
              <span>Side-by-Side Comparison Tool</span>
            </Link>
          </div>
        </div>

        {/* Daily Visual Challenge Card */}
        <div className="glass-panel p-6 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Image of the Day: Reed-Sternberg Histopathology</h3>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Daily Challenge</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">Identify the 'owl-eye' nucleoli cell and earn 50 XP Rank Points.</p>
            </div>
          </div>

          <Link
            href="/images/viewer?id=img-daily"
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow shrink-0"
          >
            Solve Image Challenge
          </Link>
        </div>

        {/* 8 Medical Domain Labs Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Medical Image Laboratories</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labs.map((lab) => (
              <div
                key={lab.id}
                className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-teal-600 uppercase bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded border">
                      {lab.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{lab.total} Images</span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{lab.name}</h3>
                  <p className="text-xs text-slate-500">{lab.subtypes}</p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-500">Completion:</span>
                    <span className="text-teal-600">{lab.completion}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                    <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${lab.completion}%` }} />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    href={`/images/viewer?lab=${lab.id}`}
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow"
                  >
                    <span>Open Workstation</span>
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

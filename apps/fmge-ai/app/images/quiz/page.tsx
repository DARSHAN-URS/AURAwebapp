"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Eye, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ImageQuizPage() {
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-4xl">
        <Link
          href="/images"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Image Lab Directory</span>
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Visual Image Quiz Challenge</h1>
          <p className="text-xs text-slate-500">Test your visual recognition accuracy across Radiology, Pathology, and ECG slides.</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-teal-600">Question 1 of 10 • Radiology IBQ</span>
          </div>

          <div className="rounded-xl overflow-hidden bg-slate-950 max-h-64 flex items-center justify-center p-2">
            <img
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80"
              alt="Radiology Slide"
              className="max-h-64 object-contain rounded"
            />
          </div>

          <p className="text-xs font-semibold text-slate-900 dark:text-white">
            Identify the primary abnormality shown in this Chest X-Ray:
          </p>

          <div className="space-y-2">
            {["Left Lower Lobe Pneumonia", "Right Tension Pneumothorax", "Bilateral Pleural Effusion", "Aortic Dissection"].map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelectedOpt(i)}
                className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all ${
                  selectedOpt === i
                    ? "bg-teal-50 border-teal-500 text-teal-900 font-bold"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Layers, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ImageComparePage() {
  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-6xl">
        
        <div>
          <Link
            href="/images"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Image Lab Directory</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Side-by-Side Image Comparison</h1>
          <p className="text-xs text-slate-500">Compare Normal anatomy vs Pathological lesions side-by-side for rapid visual differentiation.</p>
        </div>

        {/* Dual Pane Viewer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Normal Image */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded">
                Normal Reference
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Normal Chest X-Ray (PA View)</h3>
            <div className="rounded-xl overflow-hidden bg-slate-950 max-h-72 flex items-center justify-center p-2">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"
                alt="Normal Chest X-Ray"
                className="max-h-72 object-contain rounded"
              />
            </div>
            <p className="text-xs text-slate-500">Symmetrical vascular lung markings extending to peripheral 1/3 of both hemithoraces.</p>
          </div>

          {/* Pathological Image */}
          <div className="glass-panel p-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-xs text-rose-600 bg-rose-50 dark:bg-rose-950 px-2.5 py-0.5 rounded">
                Pathological Lesion
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Right Tension Pneumothorax</h3>
            <div className="rounded-xl overflow-hidden bg-slate-950 max-h-72 flex items-center justify-center p-2">
              <img
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80"
                alt="Right Tension Pneumothorax"
                className="max-h-72 object-contain rounded"
              />
            </div>
            <p className="text-xs text-slate-500">Hyperlucent right hemithorax without lung markings + Tracheal shift to left side.</p>
          </div>

        </div>

      </div>
    </SidebarLayout>
  );
}

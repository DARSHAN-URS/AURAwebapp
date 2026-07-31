"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import {
  ZoomIn, ZoomOut, RotateCcw, Eye, Sparkles, CheckCircle2, ArrowLeft,
  Sliders, Maximize2, Layers, Move, Square, Check
} from "lucide-react";

export default function PACSViewerPage() {
  const [zoomScale, setZoomScale] = useState(1);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [showLabels, setShowLabels] = useState(true);
  const [activeTool, setActiveTool] = useState<"pointer" | "box" | "arrow">("pointer");
  const [annotationSaved, setAnnotationSaved] = useState(false);

  const sampleImage = {
    title: "Chest X-Ray PA View: Right Tension Pneumothorax",
    modality: "Radiology • Chest X-Ray (PA View)",
    url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
    dicom: {
      position: "Erect PA",
      kvp: "120 kV",
      exposure: "15 ms"
    },
    findings: {
      summary: "Complete collapse of the right lung with a hyperlucent right hemithorax devoid of vascular markings and mediastinal shift to the contralateral side.",
      normal: "Left lung field, ribs, diaphragm, cardiac silhouette.",
      abnormal: "Visceral pleural line, right hyperlucent pleural space, tracheal shift to left.",
      diagnosis: "Right Tension Pneumothorax",
      fmge_tip: "Immediate management: Needle thoracostomy in 2nd intercostal space (mid-clavicular line) followed by ICD insertion."
    }
  };

  const handleSaveAnnotation = () => {
    setAnnotationSaved(true);
    setTimeout(() => setAnnotationSaved(false), 3000);
  };

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-7xl">
        
        {/* Top Control Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/images" className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:text-teal-600">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-extrabold text-base text-slate-900 dark:text-white">{sampleImage.title}</h1>
              <p className="text-xs text-slate-500">{sampleImage.modality} • Position: {sampleImage.dicom.position}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                showLabels ? "bg-teal-600 text-white shadow" : "bg-white dark:bg-slate-900 border-slate-200 text-slate-600"
              }`}
            >
              Label Overlays
            </button>

            <Link
              href="/images/compare"
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1"
            >
              <Layers className="w-4 h-4 text-teal-600" />
              <span>Compare Pair</span>
            </Link>
          </div>
        </div>

        {/* Split Screen PACS Workstation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: PACS Educational DICOM Viewer & Annotation Toolbar */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            
            {/* Viewer Controls Toolbar */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 text-white text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomScale((s) => Math.min(s + 0.3, 3))}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomScale((s) => Math.max(s - 0.3, 0.8))}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setZoomScale(1);
                    setContrast(100);
                    setBrightness(100);
                  }}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700"
                  title="Reset DICOM View"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Annotation Tools */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Tools:</span>
                <button
                  onClick={() => setActiveTool("pointer")}
                  className={`p-1.5 rounded text-[11px] font-bold ${activeTool === "pointer" ? "bg-teal-600 text-white" : "bg-slate-800 text-slate-300"}`}
                >
                  Pointer
                </button>
                <button
                  onClick={() => setActiveTool("box")}
                  className={`p-1.5 rounded text-[11px] font-bold ${activeTool === "box" ? "bg-teal-600 text-white" : "bg-slate-800 text-slate-300"}`}
                >
                  Lesion Box
                </button>
              </div>
            </div>

            {/* PACS Image Frame */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 min-h-[380px] flex items-center justify-center border border-slate-800 p-4">
              <img
                src={sampleImage.url}
                alt={sampleImage.title}
                style={{
                  transform: `scale(${zoomScale})`,
                  filter: `contrast(${contrast}%) brightness(${brightness}%)`,
                  transition: "transform 0.2s ease, filter 0.2s ease"
                }}
                className="max-h-[50vh] object-contain rounded"
              />

              {/* Simulated Label Overlays */}
              {showLabels && (
                <div className="absolute top-4 left-4 p-2 rounded bg-slate-950/80 border border-teal-500/50 text-[10px] font-bold text-teal-400 pointer-events-none">
                  ← Tracheal & Mediastinal Shift to Left
                </div>
              )}
            </div>

            {/* Sliders Bar */}
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div>
                <span>Contrast: {contrast}%</span>
                <input
                  type="range"
                  min="50"
                  max="180"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              <div>
                <span>Brightness: {brightness}%</span>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSaveAnnotation}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow"
              >
                {annotationSaved ? "Annotation Saved!" : "Submit Lesion Annotation"}
              </button>
            </div>

          </div>

          {/* Right Column: AI Visual Findings & Rationale Panel */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">AI Visual Diagnostic Analysis</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-900 dark:text-emerald-200 font-bold">
                Primary Diagnosis: {sampleImage.findings.diagnosis}
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Key Diagnostic Findings:</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  {sampleImage.findings.summary}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 text-teal-900 dark:text-teal-200">
                <span className="font-bold block text-teal-800 dark:text-teal-300 mb-0.5">FMGE High-Yield Exam Tip:</span>
                {sampleImage.findings.fmge_tip}
              </div>
            </div>

          </div>

        </div>

      </div>
    </SidebarLayout>
  );
}

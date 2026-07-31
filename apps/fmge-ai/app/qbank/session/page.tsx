"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { ImageZoomModal } from "@/components/qbank/ImageZoomModal";
import {
  Clock, Bookmark, Flag, Sparkles, CheckCircle2, XCircle, Maximize2,
  Strikethrough, ChevronRight, ArrowLeft, RefreshCw, AlertTriangle
} from "lucide-react";

export default function QBankSessionPage() {
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [strikethroughs, setStrikethroughs] = useState<Record<number, boolean>>({});
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const sampleQuestion = {
    id: 101,
    subject: "General Medicine",
    topic: "Cardiology • Acute Coronary Syndromes",
    difficulty: "Hard (NBE Level)",
    estimated_time: 60,
    is_ibq: true,
    image_url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80",
    question_stem: "A 45-year-old diabetic male presents with acute onset crushing retrosternal chest pain radiating to his left shoulder for 2 hours. ECG demonstrates ST-segment elevation in leads II, III, and aVF with reciprocal depression in I and aVL. Which coronary vessel is acutely occluded?",
    options: [
      { id: 0, label: "A", text: "Left Anterior Descending Artery (LAD)" },
      { id: 1, label: "B", text: "Right Coronary Artery (RCA)" },
      { id: 2, label: "C", text: "Left Circumflex Artery (LCx)" },
      { id: 3, label: "D", text: "Left Main Coronary Artery (LMCA)" },
    ],
    correct_option: 1
  };

  const toggleStrikethrough = (optId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setStrikethroughs((prev) => ({ ...prev, [optId]: !prev[optId] }));
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null) return;
    setSubmitted(true);
  };

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-6xl">
        
        {/* Top Controls Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Link
            href="/qbank"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Session</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500">Question 1 of 50</span>
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-teal-600 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded border border-teal-200">
              <Clock className="w-3.5 h-3.5" />
              <span>00:45</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1 ${
                isBookmarked
                  ? "bg-teal-50 text-teal-600 border-teal-300"
                  : "bg-white dark:bg-slate-900 border-slate-200 text-slate-600"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-teal-600" : ""}`} />
              <span className="hidden sm:inline">Bookmark</span>
            </button>

            <button className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 hover:text-rose-600">
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question + Split Explanation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Top: Question & Options Card */}
          <div className={`space-y-6 ${submitted ? "lg:col-span-6" : "lg:col-span-12 max-w-3xl mx-auto"}`}>
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded border border-teal-200">
                  {sampleQuestion.subject} • {sampleQuestion.topic}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">{sampleQuestion.difficulty}</span>
              </div>

              {/* Question Stem */}
              <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                {sampleQuestion.question_stem}
              </p>

              {/* Medical Image Thumbnail with Zoom */}
              {sampleQuestion.is_ibq && sampleQuestion.image_url && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-56 bg-slate-950 flex items-center justify-center">
                  <img
                    src={sampleQuestion.image_url}
                    alt="Radiology ECG Finding"
                    className="max-h-56 object-cover w-full cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setShowImageZoom(true)}
                  />
                  <button
                    onClick={() => setShowImageZoom(true)}
                    className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1 shadow"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Zoom Image</span>
                  </button>
                </div>
              )}

              {/* Answer Options (A, B, C, D) */}
              <div className="space-y-3 pt-2">
                {sampleQuestion.options.map((opt) => {
                  const isSelected = selectedOpt === opt.id;
                  const isStriked = strikethroughs[opt.id];
                  const isCorrect = opt.id === sampleQuestion.correct_option;

                  let optionStyle = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-teal-500";
                  if (isSelected) {
                    optionStyle = "bg-teal-50 border-teal-500 text-teal-900 dark:bg-teal-950 dark:text-teal-200 font-bold ring-2 ring-teal-500/20";
                  }
                  if (submitted) {
                    if (isCorrect) {
                      optionStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 font-bold";
                    } else if (isSelected && !isCorrect) {
                      optionStyle = "bg-rose-50 border-rose-500 text-rose-900 dark:bg-rose-950 dark:text-rose-200 font-bold";
                    }
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => !submitted && setSelectedOpt(opt.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${optionStyle} ${
                        isStriked ? "opacity-40 line-through" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
                          {opt.label}
                        </span>
                        <span className="text-xs">{opt.text}</span>
                      </div>

                      {!submitted && (
                        <button
                          type="button"
                          onClick={(e) => toggleStrikethrough(opt.id, e)}
                          className="text-slate-400 hover:text-slate-600 p-1"
                          title="Strikethrough Option"
                        >
                          <Strikethrough className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {submitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {!submitted && (
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOpt === null}
                    className="px-7 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-teal-600/20"
                  >
                    Submit Answer & View AI Rationale
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Split-Panel AI Explanation Engine */}
          {submitted && (
            <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-teal-200 dark:border-slate-800 space-y-5 animate-fadeIn">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>FMGE AI Explanation Engine</span>
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded ${
                  selectedOpt === sampleQuestion.correct_option ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                }`}>
                  {selectedOpt === sampleQuestion.correct_option ? "Correct Answer!" : "Incorrect Answer"}
                </span>
              </div>

              {/* Rationale Breakdown */}
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Core Clinical Rationale:</h4>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
                    ST-segment elevation in inferior leads (II, III, and aVF) is diagnostic of <strong>Inferior Wall Myocardial Infarction (IWMI)</strong>. In over 85–90% of individuals, the inferior LV wall is supplied by the <strong>Right Coronary Artery (RCA)</strong>.
                  </p>
                </div>

                {/* Distractor Analysis */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <h5 className="font-bold text-slate-900 dark:text-white">Option Distractor Breakdown:</h5>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                    <li>• <strong>A. LAD:</strong> Supplies Anterior Wall (V1-V4).</li>
                    <li>• <strong>B. RCA (Correct):</strong> Supplies Inferior Wall (II, III, aVF) & SA/AV nodes.</li>
                    <li>• <strong>C. LCx:</strong> Supplies Lateral Wall (I, aVL, V5-V6).</li>
                    <li>• <strong>D. LMCA:</strong> Causes massive Antero-lateral MI with cardiogenic shock.</li>
                  </ul>
                </div>

                {/* High Yield Mnemonic */}
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 text-teal-900 dark:text-teal-200 font-medium">
                  <span className="font-bold block text-teal-800 dark:text-teal-300 mb-0.5">High-Yield Memory Mnemonic:</span>
                  Inferior MI = RCA (II, III, aVF) | Anterior MI = LAD (V1-V4) | Lateral MI = LCx (I, aVL)
                </div>
              </div>

              {/* AI Follow-Up Recommendations */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">AI Next Steps:</span>
                <div className="flex flex-col gap-2">
                  <button className="text-left p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 text-xs font-semibold text-teal-600 hover:bg-teal-50 flex items-center justify-between">
                    <span>Attempt Similar Coronary Anatomy Vignette</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setSelectedOpt(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md"
                >
                  Next Question →
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Medical Image Zoom Modal */}
      {showImageZoom && (
        <ImageZoomModal
          imageUrl={sampleQuestion.image_url!}
          title="Cardiology Radiology ECG Finding — Leads II, III, aVF"
          onClose={() => setShowImageZoom(false)}
        />
      )}
    </SidebarLayout>
  );
}

"use client";

import React, { useState } from "react";
import { Bot, Calendar, TrendingUp, Sparkles, Send, CheckCircle, RefreshCw, BarChart2, ShieldAlert } from "lucide-react";

export function AIShowcase() {
  const [activeTab, setActiveTab] = useState<"tutor" | "planner" | "analytics">("tutor");
  const [userQuery, setUserQuery] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: "Hello Doctor! I am your FMGE AI Clinical Tutor. Ask me any doubt on Indian NMC guidelines, pathology image diagnosis, or drug mechanisms."
    },
    {
      sender: "user",
      text: "What is the classic triad of Normal Pressure Hydrocephalus (NPH)?"
    },
    {
      sender: "ai",
      text: "The classic triad of NPH is remembered as 'Wet, Wacky, and Wobbly': 1. Urinary Incontinence (Wet), 2. Dementia (Wacky), 3. Gait Ataxia (Wobbly)."
    }
  ]);

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    const newMsg = { sender: "user", text: userQuery };
    setChatMessages((prev) => [...prev, newMsg]);
    setUserQuery("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Here is the high-yield FMGE breakdown for "${userQuery}": Focus on NBE previous years questions (PYQs) and clinical presentation features.`
        }
      ]);
    }, 600);
  };

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
            Powered by Healthcare AI Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Experience Next-Gen <span className="gradient-text">Medical AI Intelligence</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Interact with our specialized AI tools designed to eliminate study gaps and guarantee peak NBE CBT exam performance.
          </p>

          {/* Nav Tabs */}
          <div className="flex justify-center gap-3 pt-6">
            <button
              onClick={() => setActiveTab("tutor")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "tutor"
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>AI Clinical Tutor</span>
            </button>

            <button
              onClick={() => setActiveTab("planner")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "planner"
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>AI Study Planner</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "analytics"
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Pass Radar & Analytics</span>
            </button>
          </div>
        </div>

        {/* Tab 1: AI Tutor */}
        {activeTab === "tutor" && (
          <div className="mt-10 max-w-4xl mx-auto glass-panel p-6 rounded-2xl shadow-xl border border-teal-100 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-sm text-slate-900 dark:text-white">FMGE AI Tutor • Active Session</span>
              </div>
              <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded border border-teal-200 dark:border-teal-800">
                NMC Guideline Engine
              </span>
            </div>

            <div className="h-64 overflow-y-auto space-y-3 p-3 bg-white/60 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xl p-3 rounded-xl text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-teal-600 text-white font-medium"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendQuery} className="mt-4 flex gap-2">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ask doubt about ECG, drug mechanism, PSM formula..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <span>Ask AI</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: AI Planner */}
        {activeTab === "planner" && (
          <div className="mt-10 max-w-4xl mx-auto glass-panel p-6 rounded-2xl shadow-xl border border-teal-100 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Target Exam: FMGE December 2026</h3>
                <p className="text-xs text-slate-500">142 Days Remaining • University: TSMU Tbilisi</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                Schedule On Track (100%)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase">Today's Target</span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">Pharmacology • Antimicrobials</h4>
                <p className="text-xs text-slate-500 mt-1">50 MCQs + 20 High-Yield Drug Flashcards</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed (50/50 Qs)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-amber-600 uppercase">Tomorrow's Target</span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">PSM • Epidemiology & Biostats</h4>
                <p className="text-xs text-slate-500 mt-1">NBE Formula Revision + 60 Qs</p>
                <div className="mt-3 text-xs text-slate-400 font-medium">Pending (Scheduled 09:00 AM)</div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-indigo-600 uppercase">Weekend GT</span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">Full Grand Test #6</h4>
                <p className="text-xs text-slate-500 mt-1">300 Qs Timed CBT (Part A & B)</p>
                <div className="mt-3 text-xs text-indigo-600 font-bold">Sunday 10:00 AM</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Analytics Radar */}
        {activeTab === "analytics" && (
          <div className="mt-10 max-w-4xl mx-auto glass-panel p-6 rounded-2xl shadow-xl border border-teal-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Estimated FMGE Pass Probability</h3>
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">86.2%</span>
              </div>
              <p className="text-xs text-slate-500">Based on your recent 4 Grand Test scores (Avg: 184/300, Cutoff: 150/300).</p>
              
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Clinical Subjects (Medicine, Surgery, OBG)</span>
                    <span className="text-emerald-600">82% Accuracy</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full w-[82%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Para-Clinical (Patho, Pharm, Micro)</span>
                    <span className="text-teal-600">76% Accuracy</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full w-[76%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Pre-Clinical (Anatomy, Physio, Biochem)</span>
                    <span className="text-amber-600">62% Accuracy</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full w-[62%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-3">
              <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 text-sm">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span>AI Gap Detection Notice</span>
              </div>
              <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
                Your score drops in <strong>Neuroanatomy Tracts</strong> and <strong>Autonomic Pharmacology</strong>. Re-solving 45 targeted MCQs will boost your score by an estimated +12 marks!
              </p>
              <button className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow">
                Launch Weak Area Revision
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

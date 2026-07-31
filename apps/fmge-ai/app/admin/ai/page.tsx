"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { Cpu, ArrowLeft, CheckCircle2, Sliders, DollarSign } from "lucide-react";

export default function AIOperationsStudioPage() {
  const [model, setModel] = useState("gemini-1.5-pro");
  const [saved, setSaved] = useState(false);

  const handleSaveConfig = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-5xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Super Admin Command Center</span>
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">AI Operations & Prompt Studio</h1>
          <p className="text-xs text-slate-500">Configure LLM providers, temperature parameters, fallback models, and token budgets.</p>
        </div>

        {saved && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>AI Provider Configuration updated successfully!</span>
          </div>
        )}

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Primary AI Model Settings</h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Primary LLM Provider & Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              >
                <option value="gemini-1.5-pro">Google DeepMind Gemini 1.5 Pro (Recommended)</option>
                <option value="gemini-1.5-flash">Google DeepMind Gemini 1.5 Flash (High Speed)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Fallback LLM Model</label>
              <input
                type="text"
                disabled
                value="gemini-1.5-flash (Automated Fallback)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 font-bold text-slate-500"
              />
            </div>

            <button
              onClick={handleSaveConfig}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow"
            >
              Save AI Provider Settings
            </button>
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}

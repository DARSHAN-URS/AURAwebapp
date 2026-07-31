"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import {
  ShieldCheck, Cpu, Users, DollarSign, Activity, Server, Sliders,
  Lock, Terminal, ChevronRight, CheckCircle2, AlertTriangle, Layers
} from "lucide-react";

export default function SuperAdminCommandCenterPage() {
  const [selectedProduct, setSelectedProduct] = useState("fmge");

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-7xl">
        
        {/* Top Header Banner */}
        <div className="glass-panel p-8 rounded-3xl border border-rose-200 dark:border-slate-800 bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-300 bg-rose-950 px-3 py-1 rounded-full border border-rose-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>Super Admin Operational Command Center</span>
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Platform & AI Operations <span className="text-rose-400">Control Panel</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Real-time multi-tenant operations, AI model token costs, user directory, audit logs, and security infrastructure.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center shrink-0 min-w-[220px]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">Monthly Suite MRR</span>
            <div className="text-3xl font-black text-emerald-400 mt-1">₹1.42 Cr</div>
            <span className="text-xs font-bold text-teal-300 mt-1 block">48,250 Active Suite Users</span>
          </div>
        </div>

        {/* Multi-Tenant Product Selector Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">Multi-Tenant Ecosystem:</span>
          </div>

          <div className="flex gap-2">
            {[
              { id: "fmge", name: "FMGE AI (14.2k Users)" },
              { id: "aura", name: "Aura Routes (21.4k Users)" },
              { id: "nursepass", name: "NursePass (12.6k Users)" }
            ].map((prod) => (
              <button
                key={prod.id}
                onClick={() => setSelectedProduct(prod.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedProduct === prod.id
                    ? "bg-rose-600 text-white shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                {prod.name}
              </button>
            ))}
          </div>
        </div>

        {/* Executive KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Total Active Students</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">14,200</div>
            <span className="text-[11px] text-emerald-600 font-bold">+1,240 this month</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">AI Cost / Student</span>
            <div className="text-2xl font-black text-teal-600">₹12.4 / Mo</div>
            <span className="text-[11px] text-slate-500">Gemini 1.5 Pro / Flash</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">API Latency</span>
            <div className="text-2xl font-black text-indigo-600">145 ms</div>
            <span className="text-[11px] text-emerald-600 font-bold">Optimal Speed</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px]">System Health</span>
            <div className="text-2xl font-black text-emerald-600">99.98%</div>
            <span className="text-[11px] text-slate-500">All Nodes Operational</span>
          </div>
        </div>

        {/* Quick Admin Hub Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <Cpu className="w-6 h-6 text-teal-600" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">AI Operations Studio</h3>
              <p className="text-xs text-slate-500">Model selection, temperature, token cost tracker, and prompt templates.</p>
            </div>
            <Link
              href="/admin/ai"
              className="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow flex items-center justify-between"
            >
              <span>Open AI Studio</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <Users className="w-6 h-6 text-indigo-600" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">User Directory & Roles</h3>
              <p className="text-xs text-slate-500">Manage 14.2k candidates, role assignments, suspension, and impersonation.</p>
            </div>
            <Link
              href="/admin/users"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow flex items-center justify-between"
            >
              <span>Manage Users</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <Lock className="w-6 h-6 text-rose-600" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Security & Audit Logs</h3>
              <p className="text-xs text-slate-500">Feature flags toggle registry, failed login alerts, and immutable audit logs.</p>
            </div>
            <Link
              href="/admin/security"
              className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow flex items-center justify-between"
            >
              <span>Security Center</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}

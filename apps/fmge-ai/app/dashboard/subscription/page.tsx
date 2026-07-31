"use client";

import React from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { CreditCard, CheckCircle2, ShieldCheck, Download, Sparkles, Layers, ArrowUpRight } from "lucide-react";

export default function SubscriptionManagerPage() {
  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-5xl">
        
        {/* Header Ribbon */}
        <div className="glass-panel p-8 rounded-3xl border border-teal-200 dark:border-slate-800 bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-300 bg-teal-950 px-3 py-1 rounded-full border border-teal-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>ACTIVE SUBSCRIPTION</span>
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Premium Pro Plan</h1>
            <p className="text-xs text-slate-300">Renews on August 31, 2026 • ₹2,999 / month</p>
          </div>

          <Link
            href="/pricing"
            className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-1.5 shrink-0"
          >
            <span>Upgrade to Ultimate</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Feature Usage Meters */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Subscription Usage & Entitlements</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">QBank MCQs</span>
              <div className="text-xl font-black text-teal-600">3,420 / UNLIMITED</div>
              <span className="text-[11px] text-emerald-600 font-bold">19 FMGE Subjects Enabled</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">NBE Grand Tests</span>
              <div className="text-xl font-black text-teal-600">6 / UNLIMITED</div>
              <span className="text-[11px] text-emerald-600 font-bold">CBT Simulation Engine</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Clinical Simulator & PACS</span>
              <div className="text-xl font-black text-teal-600">ACTIVE</div>
              <span className="text-[11px] text-emerald-600 font-bold">Full Access Enabled</span>
            </div>
          </div>
        </div>

        {/* Payment History & Tax Invoices */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Billing History & GST Tax Invoices</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Invoice Number</th>
                  <th className="p-3">Plan Details</th>
                  <th className="p-3">Amount (Incl 18% GST)</th>
                  <th className="p-3">Payment Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Tax Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">INV-2026-0701</td>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">Premium Pro Monthly</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">₹3,184.82</td>
                  <td className="p-3 text-slate-500">2026-07-01</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800">PAID</span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href="/invoices/INV-2026-0701"
                      className="inline-flex items-center gap-1 font-bold text-teal-600 hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF Tax Invoice</span>
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </SidebarLayout>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Printer, ShieldCheck, Download } from "lucide-react";

export default function PrintableTaxInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex justify-center">
      
      <div className="max-w-3xl w-full bg-white text-slate-900 rounded-3xl p-8 space-y-6 shadow-2xl font-sans">
        
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">TAX INVOICE</h1>
            <p className="text-xs text-slate-500 font-mono mt-1">Invoice #: {resolvedParams.id || "INV-2026-0701"}</p>
            <p className="text-xs text-slate-500">Date: July 01, 2026</p>
          </div>
          <div className="text-right">
            <h2 className="font-extrabold text-base text-teal-700">FMGE AI Healthcare Suite</h2>
            <p className="text-xs text-slate-500">GSTIN: 07AABCH1234F1Z5</p>
            <p className="text-xs text-slate-500">SAC Code: 998431 (Online Education)</p>
          </div>
        </div>

        {/* Customer & Billing Details */}
        <div className="grid grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="font-bold text-slate-500 uppercase text-[10px]">Billed To:</span>
            <p className="font-bold text-slate-900 mt-0.5">Dr. Rahul Sharma</p>
            <p className="text-slate-600">Kursk State Medical University</p>
            <p className="text-slate-600">Email: rahul.sharma@example.com</p>
          </div>
          <div>
            <span className="font-bold text-slate-500 uppercase text-[10px]">Payment Details:</span>
            <p className="font-bold text-slate-900 mt-0.5">Razorpay Online (UPI / Card)</p>
            <p className="text-slate-600">Payment ID: pay_rzp_fmge_9901</p>
            <p className="text-emerald-700 font-bold mt-0.5">Status: PAID</p>
          </div>
        </div>

        {/* Item Breakdown Table */}
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-3">Description</th>
              <th className="p-3 text-right">Base Amount</th>
              <th className="p-3 text-right">GST (18%)</th>
              <th className="p-3 text-right">Total Payable</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="p-3 font-bold">FMGE AI Premium Pro Monthly Subscription</td>
              <td className="p-3 text-right font-mono">₹2,699.00</td>
              <td className="p-3 text-right font-mono">₹485.82</td>
              <td className="p-3 text-right font-bold font-mono">₹3,184.82</td>
            </tr>
          </tbody>
        </table>

        {/* Actions Bar */}
        <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
          <Link href="/dashboard/subscription" className="font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Subscription Dashboard</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
        </div>

      </div>

    </div>
  );
}

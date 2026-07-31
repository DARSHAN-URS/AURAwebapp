"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, QrCode, ArrowLeft, ExternalLink } from "lucide-react";

export default function CertificateVerificationPortalPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6">
      
      <div className="max-w-xl w-full glass-panel p-8 rounded-3xl border border-teal-500/30 bg-slate-900 text-center space-y-6 shadow-2xl">
        
        {/* Verified Shield Badge */}
        <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/20 shadow-xl">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800 uppercase tracking-wider">
            Verified Digital Credential
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-2">Certificate of Clinical Case Mastery</h1>
          <p className="text-xs text-slate-400">ID: {resolvedParams.id || "CERT-FMGE-901"}</p>
        </div>

        {/* Credential Details Card */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Candidate Name:</span>
            <span className="font-bold text-white">Dr. Rahul Sharma</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Medical College:</span>
            <span className="font-bold text-teal-300">Kursk State Medical University, Russia</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Issuing Authority:</span>
            <span className="font-bold text-slate-200">FMGE AI & Healthcare AI Suite</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Issue Date:</span>
            <span className="font-mono text-slate-300">July 30, 2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">QR Verification Timestamp:</span>
            <span className="font-mono text-emerald-400">2026-07-30T14:22:10Z (Valid)</span>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/certificates"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to FMGE AI Dashboard</span>
          </Link>
        </div>

      </div>

    </div>
  );
}

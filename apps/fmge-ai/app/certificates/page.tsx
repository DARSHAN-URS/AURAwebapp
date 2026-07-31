"use client";

import React from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import { FileCheck, ArrowLeft, Download, ShieldCheck, QrCode, ExternalLink } from "lucide-react";

export default function CertificatesShowcasePage() {
  const certificates = [
    {
      id: "CERT-FMGE-901",
      title: "Certificate of Clinical Case Mastery",
      issuer: "FMGE AI & National Medical Education Board",
      student: "Dr. Rahul Sharma",
      date: "July 30, 2026",
      status: "Verified & Active",
      url: "/verify/CERT-FMGE-901"
    },
    {
      id: "CERT-FMGE-804",
      title: "Certificate of NBE Grand Test Excellence",
      issuer: "FMGE AI Academic Council",
      student: "Dr. Rahul Sharma",
      date: "July 28, 2026",
      status: "Verified & Active",
      url: "/verify/CERT-FMGE-804"
    }
  ];

  return (
    <SidebarLayout>
      <div className="space-y-8 max-w-5xl">
        <Link
          href="/achievements"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-teal-600 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Achievements Hub</span>
        </Link>

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Verifiable Digital Certificates</h1>
          <p className="text-xs text-slate-500">Institution-backed credentials with QR verification and unique Certificate IDs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="glass-panel p-6 rounded-3xl border border-teal-200 dark:border-slate-800 space-y-4 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded border">
                    ID: {cert.id}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>{cert.status}</span>
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{cert.title}</h3>
                <p className="text-xs text-slate-500">Issued to: <span className="font-bold text-slate-800 dark:text-slate-200">{cert.student}</span></p>
                <p className="text-xs text-slate-500">Issuer: {cert.issuer}</p>
                <p className="text-[11px] text-slate-400 font-mono">Issued Date: {cert.date}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Link
                  href={cert.url}
                  className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Public Verification Portal</span>
                </Link>

                <button className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}

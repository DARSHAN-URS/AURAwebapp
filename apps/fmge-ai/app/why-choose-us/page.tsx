import React from "react";
import Link from "next/link";
import { Check, X, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function WhyChooseUsPage() {
  const comparison = [
    { feature: "Question Bank Size", traditional: "5,000 Static MCQs", fmge_ai: "15,000+ AI Adaptive QBank" },
    { feature: "CBT Mock Exam Interface", traditional: "Basic PDF / Web Quiz", fmge_ai: "Authentic NBE 300-Q CBT Engine" },
    { feature: "Doubt Clearing", traditional: "24-48 Hour Forum Delay", fmge_ai: "Instant 24/7 Medical AI Tutor" },
    { feature: "Study Planning", traditional: "Fixed Static Timetable", fmge_ai: "Adaptive AI Daily Revision Generator" },
    { feature: "Weak Topic Analysis", traditional: "Manual Marking", fmge_ai: "19-Subject AI Radar & Pass Probability" },
    { feature: "Image-Based Questions (IBQs)", traditional: "Limited Low-Res Images", fmge_ai: "4,500+ Radiology & Pathology Image Bank" },
    { feature: "Cost", traditional: "₹40,000 - ₹80,000 / year", fmge_ai: "Starts at ₹2,999 / 6 months" },
  ];

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
          The AI Advantage
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          Why Choose <span className="gradient-text">FMGE AI</span> vs Traditional Coaching?
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base">
          See how AI-driven personalized revision produces 4x higher pass rates compared to generic offline lectures.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-extrabold">
              <th className="py-3 px-4">Feature / Aspect</th>
              <th className="py-3 px-4 text-slate-500">Traditional Offline Coaching</th>
              <th className="py-3 px-4 text-teal-600 dark:text-teal-400 font-extrabold">FMGE AI Platform</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {comparison.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{item.feature}</td>
                <td className="py-3.5 px-4 text-slate-500">{item.traditional}</td>
                <td className="py-3.5 px-4 font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{item.fmge_ai}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-teal-600 text-white font-bold text-sm shadow-lg shadow-teal-600/30"
        >
          <span>Choose Your Plan & Start Today</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

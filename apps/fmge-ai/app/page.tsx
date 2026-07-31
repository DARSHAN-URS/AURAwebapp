import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FMGE AI — Foreign Medical Graduate Examination Prep",
  description:
    "AI-powered FMGE preparation platform. Coming soon — adaptive mock tests, subject-wise question bank, clinical case discussions, and AI study planner.",
};

export default function FMGEHome() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-900/40 border border-cyan-700/50 text-cyan-300 text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Healthcare AI Suite — FMGE AI Product
        </div>

        <h1 className="text-5xl md:text-7xl font-black leading-tight">
          FMGE AI
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mt-2">
            Coming Soon
          </span>
        </h1>

        <p className="text-xl text-slate-400 max-w-xl mx-auto leading-relaxed">
          AI-powered preparation for the Foreign Medical Graduate Examination. Adaptive mock tests,
          subject-wise question banks, clinical case discussions, and AI study planner — all in one platform.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
          {[
            "AI Mock Tests (FMGE Pattern)",
            "Subject-wise Question Bank",
            "AI Study Planner",
            "Clinical Case Discussions",
            "Performance Analytics",
            "AI Chat Tutor",
          ].map((f) => (
            <div key={f} className="flex items-start gap-2 p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-cyan-400 mt-0.5">✓</span>
              <span className="text-slate-300 text-sm font-medium">{f}</span>
            </div>
          ))}
        </div>

        <Link
          href="https://auraroutes.com"
          className="inline-block px-8 py-4 rounded-2xl bg-slate-800 border border-slate-700 hover:border-cyan-700/50 text-white font-bold text-lg transition-all"
        >
          ← Back to Healthcare AI Suite
        </Link>
      </div>
    </main>
  );
}

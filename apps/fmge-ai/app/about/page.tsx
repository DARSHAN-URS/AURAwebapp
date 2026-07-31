import React from "react";
import Link from "next/link";
import { Stethoscope, Award, Shield, Target, Users, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
          Empowering Foreign Medical Graduates
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          About <span className="gradient-text">FMGE AI</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
          FMGE AI was founded by senior Indian medical educators and AI researchers to bridge the preparation gap for foreign medical graduates (FMGs) taking the NBE FMGE and NMC NExT licensing exams in India.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Our Mission</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            To ensure every hard-working foreign medical graduate clears their Indian licensing exam on their first attempt with personalized AI precision and high-yield clinical mastery.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">100% NBE & NMC Aligned</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Our question bank and CBT test engine match the exact NBE difficulty level, clinical scenario formats, and image-based questions (IBQs) mandated by the National Medical Commission.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Proven 89.4% Pass Rate</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            While national FMGE pass rates hover around 22%, students who complete FMGE AI's 10 Grand Tests achieve an average pass rate of 89.4%.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-teal-900 text-white text-center space-y-4">
        <h2 className="text-2xl font-extrabold">Ready to Clear Your FMGE Exam?</h2>
        <p className="text-teal-100 text-sm max-w-xl mx-auto">
          Join 14,000+ medical graduates from Russia, Georgia, Philippines, Uzbekistan, Kazakhstan, Ukraine, and China.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-teal-950 font-bold text-sm shadow-lg"
        >
          <span>Start Free Trial</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}

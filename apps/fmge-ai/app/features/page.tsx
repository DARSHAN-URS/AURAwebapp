import React from "react";
import Link from "next/link";
import { BookOpen, Clock, Bot, Calendar, TrendingUp, Layers, Microscope, Sparkles, ArrowRight } from "lucide-react";

export default function FeaturesPage() {
  const featuresList = [
    {
      id: "qbank",
      title: "AI Adaptive Question Bank",
      description: "15,000+ NBE-pattern MCQs with high-yield clinical vignettes, image-based questions (IBQs), and active distractor analysis.",
      icon: <BookOpen className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      details: ["NBE & NMC Pattern Aligned", "Detailed Rationale for Every Option", "Custom Quiz Generator by Subject & Topic"]
    },
    {
      id: "mock_engine",
      title: "300-Q NBE CBT Mock Engine",
      description: "Authentic computer-based test simulation with Part A (150 Qs) and Part B (150 Qs), precise 150-minute timers, and instant score reporting.",
      icon: <Clock className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      details: ["Real Exam Interface & Palette", "Morning & Afternoon Timed Sessions", "Instant Pass/Fail Cutoff Determination (150 Marks)"]
    },
    {
      id: "ai_tutor",
      title: "FMGE AI Clinical Tutor",
      description: "24/7 AI tutor specialized in Indian NMC guidelines, differential diagnoses, histopathology image explanations, and doubt clearing.",
      icon: <Bot className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      details: ["Sub-second Instant Answers", "High-Yield Clinical Scenario Breakdown", "Radiology & Pathology Image Explainer"]
    },
    {
      id: "study_planner",
      title: "AI Adaptive Study Planner",
      description: "Dynamically builds your daily revision schedule based on your target FMGE exam date, university background, and weak subjects.",
      icon: <Calendar className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      details: ["Daily Target Micro-Tasks", "Auto-Adjusts when You Miss a Day", "Integrates Active Recall & Spaced Repetition"]
    },
    {
      id: "analytics",
      title: "AI Weak Topic Detection & Pass Probability",
      description: "Real-time FMGE pass probability algorithm with 19-subject accuracy radar charts and personalized gap-closing recommendations.",
      icon: <TrendingUp className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      details: ["19 Subject Radar Chart", "Personalized Score Predictor", "Targeted Weak Topic Remediation Quizzes"]
    },
    {
      id: "flashcards",
      title: "5,000+ High-Yield Medical Flashcards",
      description: "Spaced repetition (SM-2 algorithm) flashcards for rapid-fire recall of drug side effects, triad signs, and anatomical landmarks.",
      icon: <Layers className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      details: ["SM-2 Spaced Repetition Engine", "Triads, Syndromes & Drug Side Effects", "Image Flashcards for Histopathology & X-Rays"]
    }
  ];

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
          Core Platform Modules
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          Powerful <span className="gradient-text">AI Features</span> Built for Medical Excellence
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base">
          Explore every feature designed to convert study hours into guaranteed FMGE pass marks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuresList.map((feat) => (
          <div key={feat.id} className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-100 dark:border-teal-900 w-fit">
              {feat.icon}
            </div>
            <h3 className="font-bold text-xl text-slate-900 dark:text-white">{feat.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{feat.description}</p>
            <ul className="space-y-1.5 pt-2 text-xs font-semibold text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800">
              {feat.details.map((d, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="text-center pt-6">
        <Link
          href="/qbank"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-teal-600 text-white font-bold text-sm shadow-lg shadow-teal-600/30"
        >
          <span>Try Features Free</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

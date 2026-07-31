"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SidebarLayout } from "@/components/dashboard/SidebarLayout";
import {
  Stethoscope, Sparkles, CheckCircle2, Clock, Calendar, TrendingUp,
  BookOpen, Bot, Award, ArrowRight, ShieldCheck, Zap, AlertCircle
} from "lucide-react";

interface OverviewData {
  student: {
    name: string;
    medical_college: string;
    country: string;
    target_exam: string;
    days_until_exam: number;
    study_streak_days: number;
    daily_motivation: string;
    subscription_plan: string;
  };
  readiness_score: {
    overall_pct: number;
    subject_mastery_pct: number;
    clinical_reasoning_pct: number;
    time_management_pct: number;
    estimated_marks: string;
    cutoff_met: boolean;
    trend: string;
  };
  daily_targets: Array<{
    id: string;
    title: string;
    subtitle: string;
    estimated_mins: number;
    completed: boolean;
  }>;
  overall_progress: {
    questions_solved: number;
    total_qbank: number;
    mock_tests_completed: number;
    subjects_completed: number;
    course_completion_pct: number;
  };
  recent_activities: Array<{
    id: string;
    title: string;
    meta: string;
    time: string;
    type: string;
  }>;
  ai_recommendations: Array<{
    id: string;
    title: string;
    reason: string;
    action_url: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [tasks, setTasks] = useState<Array<{ id: string; title: string; subtitle: string; estimated_mins?: number; completed: boolean }>>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/fmge/dashboard/overview")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData);
          setTasks(resData.daily_targets);
        }
      })
      .catch(() => {
        // Fallback demo state
        const fallback: OverviewData = {
          student: {
            name: "Dr. Rahul Sharma",
            medical_college: "Kursk State Medical University",
            country: "Russia",
            target_exam: "FMGE Dec 2026",
            days_until_exam: 142,
            study_streak_days: 7,
            daily_motivation: "“Wherever the art of Medicine is loved, there is also a love of Humanity.” — Hippocrates",
            subscription_plan: "Pro Clinical Pass"
          },
          readiness_score: {
            overall_pct: 84.5,
            subject_mastery_pct: 82.0,
            clinical_reasoning_pct: 88.4,
            time_management_pct: 81.2,
            estimated_marks: "194 / 300",
            cutoff_met: true,
            trend: "+4.2% this week"
          },
          daily_targets: [
            { id: "t1", title: "Pharmacology • Antimicrobial Drug Mechanisms", subtitle: "50 MCQs + 20 High-Yield Flashcards", estimated_mins: 45, completed: true },
            { id: "t2", title: "PSM • Vaccine Schedule & Biostatistics", subtitle: "30 MCQs + Formula Review", estimated_mins: 30, completed: false },
            { id: "t3", title: "Radiology IBQ • X-Ray Sign Interpretations", subtitle: "15 High-Resolution Case Slides", estimated_mins: 25, completed: false }
          ],
          overall_progress: {
            questions_solved: 3420,
            total_qbank: 15000,
            mock_tests_completed: 6,
            subjects_completed: 12,
            course_completion_pct: 68.4
          },
          recent_activities: [
            { id: "a1", title: "Completed NBE Grand Test #5", meta: "Scored 188/300 (Pass)", time: "2 hours ago", type: "mock" },
            { id: "a2", title: "Solved 50 Pharmacology MCQs", meta: "Accuracy 84%", time: "Yesterday", type: "qbank" },
            { id: "a3", title: "AI Clinical Tutor Session", meta: "Asked about NPH Triad & ECG Signs", time: "2 days ago", type: "ai" }
          ],
          ai_recommendations: [
            { id: "r1", title: "Revise Autonomic Pharmacology", reason: "Accuracy dropped below 70% in recent Grand Test #5", action_url: "/qbank" },
            { id: "r2", title: "Take 60-Q Mini Mock Test", reason: "Improve time management speed by 5 seconds per MCQ", action_url: "/mocks" }
          ]
        };
        setData(fallback);
        setTasks(fallback.daily_targets);
      });
  }, []);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  if (!data) {
    return (
      <SidebarLayout>
        <div className="p-8 text-center text-xs font-bold text-slate-500">Loading student workspace...</div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="space-y-8">
        
        {/* Welcome Card & Countdown */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-teal-100 dark:border-slate-800 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-300 bg-teal-950/80 border border-teal-800 px-3 py-1 rounded-full">
                  Target: {data.student.target_exam}
                </span>
                <span className="text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-800 px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-amber-400" />
                  {data.student.study_streak_days}-Day Streak
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {data.student.name}!
              </h1>
              <p className="text-xs text-slate-300 italic">{data.student.daily_motivation}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center shrink-0 min-w-[160px]">
              <div className="text-3xl font-black text-teal-400">{data.student.days_until_exam}</div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300 mt-1">
                Days Until Exam
              </div>
            </div>
          </div>
        </div>

        {/* AI Readiness Score & Progress Ribbon */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: AI Readiness Score Card */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">AI FMGE Readiness Score</h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200">
                {data.readiness_score.trend}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
              <div className="p-4 rounded-xl bg-teal-50/80 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-center space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Estimated FMGE Marks</span>
                <div className="text-3xl font-black text-teal-700 dark:text-teal-300">{data.readiness_score.estimated_marks}</div>
                <div className="text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Above Cutoff (150 Marks)</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs font-semibold">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Subject Mastery</span>
                    <span className="text-teal-600">{data.readiness_score.subject_mastery_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                    <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${data.readiness_score.subject_mastery_pct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Clinical Reasoning</span>
                    <span className="text-emerald-600">{data.readiness_score.clinical_reasoning_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${data.readiness_score.clinical_reasoning_pct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Time Management</span>
                    <span className="text-indigo-600">{data.readiness_score.time_management_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${data.readiness_score.time_management_pct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quick Stats & Progress */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Questions Solved</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {data.overall_progress.questions_solved.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500">out of 15,000 QBank</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">300-Q Mocks</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {data.overall_progress.mock_tests_completed} Tests
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">Avg: 188 / 300</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Subjects Mastered</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {data.overall_progress.subjects_completed} / 19
              </div>
              <span className="text-[11px] text-slate-500">7 Clinical, 5 Para</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Course Progress</span>
              <div className="text-2xl font-black text-teal-600">
                {data.overall_progress.course_completion_pct}%
              </div>
              <span className="text-[11px] text-slate-500">On Track for Dec 2026</span>
            </div>
          </div>

        </div>

        {/* Daily Study Target Checklist & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Daily Study Goal */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <span>Today's Daily Target Checklist</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">Auto-generated by AI</span>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    task.completed
                      ? "bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 opacity-75"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-500"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 accent-teal-600 cursor-pointer"
                  />
                  <div className="flex-1">
                    <h4 className={`font-bold text-xs ${task.completed ? "line-through text-slate-500" : "text-slate-900 dark:text-white"}`}>
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{task.subtitle}</p>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">{task.estimated_mins} mins</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Quick Actions</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/qbank"
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 shadow-sm transition-all group space-y-1"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-teal-600">Solve QBank</h4>
                <p className="text-[10px] text-slate-500">15,000+ Clinical MCQs</p>
              </Link>

              <Link
                href="/mocks"
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 shadow-sm transition-all group space-y-1"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-teal-600">300-Q CBT Mock</h4>
                <p className="text-[10px] text-slate-500">NBE Official Timed Session</p>
              </Link>

              <Link
                href="/ai-tutor"
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 shadow-sm transition-all group space-y-1"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-teal-600">Ask AI Tutor</h4>
                <p className="text-[10px] text-slate-500">24/7 Clinical Doubt Solver</p>
              </Link>

              <Link
                href="/clinical-cases"
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 shadow-sm transition-all group space-y-1"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-teal-600">Clinical Cases</h4>
                <p className="text-[10px] text-slate-500">Patient Diagnostic Vignettes</p>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </SidebarLayout>
  );
}

"use client";

import React from "react";
import { 
  Sparkles, 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  FileText, 
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface JourneyStats {
  overall_progress: number;
  current_stage: string;
  health_score: number;
  total_tasks: number;
  completed_tasks: number;
  applications_count: number;
  visa_readiness: number;
}

interface JourneyAnalyticsProps {
  stats: JourneyStats;
  onTabNavigate: (tabId: string) => void;
}

export default function JourneyAnalytics({
  stats,
  onTabNavigate
}: JourneyAnalyticsProps) {
  // Compute AI Recommendations based on current stage
  const getAIRecommendations = (stage: string) => {
    const list = [];
    if (stage === "Eligibility") {
      list.push({
        title: "Complete eligibility details",
        desc: "Fill in academic details to let Aura AI map suitable universities.",
        actionLabel: "Edit Profile",
        tab: "profile"
      });
    } else if (stage === "Universities") {
      list.push({
        title: "Shortlist recommended choices",
        desc: "Aura AI mapped 3 high-probability choices for you. Save them to shortlist.",
        actionLabel: "Explore Matcher",
        tab: "overview"
      });
    } else if (stage === "SOP") {
      list.push({
        title: "Draft SOP with Aura AI",
        desc: "Generate your Statement of Purpose matching University of Toronto standards.",
        actionLabel: "Write SOP",
        tab: "sop"
      });
    } else if (stage === "Visa Documents" || stage === "Visa Submission") {
      list.push({
        title: "Start Visa Scan audit",
        desc: "Scan financial certificates and passport copy to check readiness status.",
        actionLabel: "Audit Visa Docs",
        tab: "visa"
      });
    } else {
      list.push({
        title: "Book advisor consultation call",
        desc: "Meet pre-departure coordinators to verify housing plans and travel schedules.",
        actionLabel: "Book Appointment",
        tab: "appointments"
      });
    }

    // Default general advice
    list.push({
      title: "Upload Vault files",
      desc: "Save digital scans of transcripts, passport, and tests for quick application access.",
      actionLabel: "Document Vault",
      tab: "vault"
    });

    return list;
  };

  const recommendations = getAIRecommendations(stats.current_stage);

  return (
    <div className="flex flex-col gap-6 w-full select-none">
      {/* Analytics stats metrics grids */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Progress gauge */}
        <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[120px]">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Overall Progress</span>
          <div className="my-2">
            <span className="text-2xl font-black text-blue-600 leading-none">{stats.overall_progress}%</span>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${stats.overall_progress}%` }}
              />
            </div>
          </div>
          <span className="text-[9px] text-gray-400 font-bold block">Target: Completed Arrival</span>
        </div>

        {/* Health Index */}
        <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[120px]">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Journey Health</span>
          <div className="my-2 flex items-center justify-between">
            <span className="text-2xl font-black text-gray-900 leading-none">{stats.health_score}%</span>
            <Heart className={`w-6 h-6 shrink-0 ${stats.health_score > 80 ? "text-rose-500 fill-rose-50 animate-pulse" : "text-amber-500 animate-pulse"}`} />
          </div>
          <span className="text-[9px] text-gray-400 font-bold block">Overdue check: None</span>
        </div>

        {/* Task complete ratios */}
        <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[120px]">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Milestones Completed</span>
          <div className="my-2">
            <span className="text-2xl font-black text-gray-900 leading-none">
              {stats.completed_tasks} / {stats.total_tasks}
            </span>
          </div>
          <span className="text-[9px] text-gray-400 font-bold block">
            {stats.total_tasks > 0 ? `${Math.round((stats.completed_tasks / stats.total_tasks) * 100)}% of checklist completed` : "0 tasks created"}
          </span>
        </div>

        {/* Visa readiness score check */}
        <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[120px]">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Visa Readiness</span>
          <div className="my-2 flex items-center justify-between">
            <span className={`text-2xl font-black leading-none ${
              stats.visa_readiness > 75 ? "text-emerald-600" :
              stats.visa_readiness > 40 ? "text-amber-600" : "text-rose-600"
            }`}>
              {stats.visa_readiness}%
            </span>
            <ShieldCheck className={`w-6 h-6 shrink-0 ${stats.visa_readiness > 70 ? "text-emerald-500" : "text-gray-300"}`} />
          </div>
          <span className="text-[9px] text-gray-400 font-bold block">Checked with AI Auditor</span>
        </div>
      </div>

      {/* Aura AI Next Best Actions recommendations list */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-5">
        <div>
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5 select-none">
            <Lightbulb className="w-4.5 h-4.5 text-amber-500 fill-amber-50" />
            Aura AI Recommendations
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">Personalized study-abroad action plans driven by real-time milestone logs.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendations.map((rec, idx) => (
            <div 
              key={idx}
              className="bg-gray-50/50 hover:bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-col justify-between gap-4 transition-all"
            >
              <div>
                <h4 className="text-xs font-black text-gray-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  {rec.title}
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed leading-normal">{rec.desc}</p>
              </div>

              <Button
                variant="link"
                onClick={() => onTabNavigate(rec.tab)}
                className="text-[10px] font-black text-blue-600 hover:text-blue-700 p-0 h-auto self-start flex items-center gap-0.5 cursor-pointer no-underline hover:underline"
              >
                <span>{rec.actionLabel}</span>
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

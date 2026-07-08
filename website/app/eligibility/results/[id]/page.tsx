"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  Award, 
  ShieldCheck, 
  Clock, 
  GraduationCap, 
  MapPin, 
  Info,
  ChevronRight,
  RefreshCw,
  PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEligibilityResultById } from "@/services/eligibility";
import { EligibilityCheckResponse } from "@/types/eligibility";
import { useBooking } from "@/components/common/BookingContext";

export default function EligibilityResultPage() {
  const params = useParams();
  const router = useRouter();
  const { openBooking } = useBooking();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EligibilityCheckResponse | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getEligibilityResultById(id);
        setData(response);
      } catch (err: any) {
        console.error(err);
        setError("Unable to retrieve evaluation report. Please make sure the ID is correct or try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  const handleRetry = () => {
    router.push("/eligibility");
  };

  // Skeleton Loader for premium UX
  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-24 flex justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Skeleton Title */}
          <div className="h-8 bg-gray-100 rounded-full w-2/3 mb-4 animate-pulse mx-auto" />
          <div className="h-4 bg-gray-50 rounded-full w-1/3 mb-16 animate-pulse mx-auto" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Score Ring Skeleton */}
            <div className="md:col-span-4 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col items-center gap-4 animate-pulse">
              <div className="w-36 h-36 rounded-full border-8 border-gray-100 flex items-center justify-center" />
              <div className="h-6 bg-gray-100 rounded-full w-2/3" />
              <div className="h-4 bg-gray-50 rounded-full w-1/2" />
            </div>

            {/* Metrics List Skeleton */}
            <div className="md:col-span-8 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col gap-6 animate-pulse">
              <div className="h-5 bg-gray-100 rounded-full w-1/4" />
              <div className="h-10 bg-gray-50 rounded-xl w-full" />
              <div className="h-10 bg-gray-50 rounded-xl w-full" />
              <div className="h-10 bg-gray-50 rounded-xl w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State display
  if (error || !data || !data.result) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="max-w-md w-full px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Evaluation Loading Failed</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">{error || "Data is unavailable."}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-6 cursor-pointer">
              Start New Check
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline" className="border-gray-200 text-gray-700 rounded-full px-6 cursor-pointer">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { request, result } = data;
  const score = result.overall_score;

  // Color mappings based on status values
  const getProbabilityColor = (prob: string) => {
    switch (prob) {
      case "High": return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case "Medium": return "text-amber-600 bg-amber-50 border-amber-100";
      default: return "text-rose-600 bg-rose-50 border-rose-100";
    }
  };

  const getStrokeDashOffset = (scoreVal: number) => {
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    return circumference - (scoreVal / 100) * circumference;
  };

  return (
    <div className="bg-white pt-32 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Eligibility Evaluation Report
          </h1>
          <p className="text-sm text-gray-400 mt-2 font-medium">
            Student: <strong className="text-gray-900">{request.full_name}</strong> • Reference: {request.id.slice(0, 8)}
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Column: Radial score indicator */}
          <div className="lg:col-span-4 bg-white border border-gray-100 rounded-3xl p-8 shadow-lg flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600" />
            
            <h3 className="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-6">Overall Score</h3>

            {/* SVG Circle Progress */}
            <div className="relative w-36 h-36 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="58" className="stroke-gray-100 fill-none" strokeWidth="8" />
                <motion.circle 
                  cx="72" 
                  cy="72" 
                  r="58" 
                  className="stroke-blue-600 fill-none" 
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: getStrokeDashOffset(0) }}
                  animate={{ strokeDashoffset: getStrokeDashOffset(score) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{ strokeDasharray: 2 * Math.PI * 58 }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-gray-900">{score}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Scale 100</span>
              </div>
            </div>

            <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold border ${getProbabilityColor(result.admission_probability)}`}>
              {result.admission_probability} Admission Chance
            </span>

            <p className="text-xs text-gray-400 leading-relaxed mt-6 border-t border-gray-50 pt-6">
              Evaluated against university criteria, IELTS thresholds, and financial limits in <span className="font-bold text-gray-600 capitalize">{request.preferred_country}</span>.
            </p>
          </div>

          {/* Right Column: Key metrics assessment */}
          <div className="lg:col-span-8 bg-white border border-gray-100 rounded-3xl p-8 shadow-lg flex flex-col justify-between h-full min-h-[320px]">
            <div>
              <h3 className="font-extrabold text-gray-950 text-sm uppercase tracking-wider mb-8">AI Evaluation Indexes</h3>
              
              <div className="flex flex-col gap-6">
                
                {/* 1. Admission Probability */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      <span>Admission Probability</span>
                    </span>
                    <span className="text-gray-900">{result.admission_probability}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        result.admission_probability === "High" ? "bg-emerald-500 w-[90%]" : result.admission_probability === "Medium" ? "bg-amber-500 w-[60%]" : "bg-rose-500 w-[30%]"
                      }`}
                    />
                  </div>
                </div>

                {/* 2. Scholarship Potential */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span>Scholarship Potential</span>
                    </span>
                    <span className="text-gray-900">{result.scholarship_potential}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        result.scholarship_potential === "High" ? "bg-emerald-500 w-[85%]" : result.scholarship_potential === "Medium" ? "bg-amber-500 w-[55%]" : "bg-rose-500 w-[25%]"
                      }`}
                    />
                  </div>
                </div>

                {/* 3. Visa Readiness */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Visa Readiness</span>
                    </span>
                    <span className="text-gray-900">{result.visa_readiness}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        result.visa_readiness === "High" ? "bg-emerald-500 w-[88%]" : result.visa_readiness === "Medium" ? "bg-amber-500 w-[58%]" : "bg-rose-500 w-[28%]"
                      }`}
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="flex items-center gap-2 mt-8 pt-6 border-t border-gray-50 text-[11px] text-gray-400 font-medium">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Score variables are simulated using AI models. Speak with a legal advisor to file applications.</span>
            </div>
          </div>

        </div>

        {/* Strengths & Weaknesses double column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Strengths */}
          <div className="bg-emerald-50/20 border border-emerald-100/50 rounded-3xl p-8">
            <h3 className="font-extrabold text-emerald-800 text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Strengths Identified</span>
            </h3>
            <ul className="flex flex-col gap-3.5">
              {result.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-gray-700 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-rose-50/20 border border-rose-100/50 rounded-3xl p-8">
            <h3 className="font-extrabold text-rose-800 text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <span>Areas for Concern</span>
            </h3>
            <ul className="flex flex-col gap-3.5">
              {result.weaknesses.map((weak, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-gray-700 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Suggested Improvements */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-lg mb-12">
          <h3 className="font-extrabold text-gray-950 text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 fill-blue-50" />
            <span>AI Suggested Profile Optimizations</span>
          </h3>
          <ul className="flex flex-col gap-4">
            {result.suggested_improvements.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
                <ChevronRight className="w-4 h-4 text-blue-600 shrink-0 mt-1" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Universities */}
        <div className="mb-12">
          <h3 className="font-extrabold text-gray-950 text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span>Recommended Universities ({result.recommended_universities.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.recommended_universities.map((univ, idx) => (
              <div key={idx} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 flex flex-col justify-between min-h-[180px]">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-gray-400 capitalize">{univ.location}</span>
                  </div>
                  <h4 className="font-bold text-gray-950 text-base mb-2">{univ.name}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{univ.reasoning}</p>
                </div>
                
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit mt-4">
                  Match Suggestion
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Next Steps / Timeline checklist */}
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 sm:p-10 mb-12">
          <h3 className="font-extrabold text-gray-950 text-sm uppercase tracking-wider mb-8 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Suggested Action Plan</span>
          </h3>
          <div className="flex flex-col gap-6">
            {result.suggested_next_steps.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-blue-600 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
                  {idx + 1}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-700 leading-relaxed mt-1">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Book Free Call Consultation */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl flex flex-col items-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg className="w-full h-full stroke-white/10" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="30" strokeWidth="0.5" fill="none" />
            </svg>
          </div>
          <div className="relative z-10 max-w-xl">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-6 mx-auto">
              <PhoneCall className="w-5 h-5 text-blue-200" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Discuss Your Evaluation report with a Mentor</h2>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed mb-8">
              Take the next step. Book a free 1-on-1 virtual call to discuss university entries, visa checklists, and scholarship filing options based on your score.
            </p>
            <Button
              onClick={openBooking}
              className="bg-white hover:bg-gray-50 text-blue-600 font-bold px-8 py-3.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer text-sm flex items-center gap-2 mx-auto"
            >
              <span>Book consultation slot</span>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

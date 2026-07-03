"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles, CheckCircle2, TrendingUp, Globe2, ShieldOff, MapPin
} from "lucide-react";

const WHY = [
  {
    icon: Globe2,
    title: "One Platform, End to End",
    description: "From your first university search to your arrival abroad, everything lives in one place — university matching, admissions, accommodation, loans, and career support.",
    color: "bg-blue-50 text-blue-600 border-blue-100/50",
  },
  {
    icon: Sparkles,
    title: "Intelligent, Not Generic",
    description: "AI-driven matching gives you recommendations tailored to you — not one-size-fits-all agent advice. Our models audit your grades, NEET scores, budget, and goals directly.",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100/50",
  },
  {
    icon: MapPin,
    title: "Built for India & the World",
    description: "Designed specifically for Indian students and NRI families. Headquartered in Delhi with deep roots across the Kerala–Gulf corridor, we understand your ambitions.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
  },
  {
    icon: ShieldOff,
    title: "Transparent by Design",
    description: "Clear information and honest guidance, without hidden agendas or surprise costs. Zero commissions, zero forced partnerships — you see exactly what you pay for.",
    color: "bg-amber-50 text-amber-600 border-amber-100/50",
  },
  {
    icon: TrendingUp,
    title: "High Success Rates",
    description: "With AI document checkers scanning SOPs, LORs, and financial documentation for gaps, we achieve a consistent visa approval rate of 98.4%.",
    color: "bg-rose-50 text-rose-600 border-rose-100/50",
  },
  {
    icon: CheckCircle2,
    title: "Full Life-Cycle Support",
    description: "We don't stop at admissions. Aura Routes manages your education loans, verified housing near campus, and post-study settlement assistance.",
    color: "bg-purple-50 text-purple-600 border-purple-100/50",
  },
];

export default function WhyAura() {
  return (
    <section className="py-24 sm:py-32 bg-[#F8FAFC] border-t border-gray-100" id="why-us">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left: Sticky text column */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <h2 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-[1.1] mb-6">
              Why Students Choose Aura Routes
            </h2>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-medium mb-8">
              Traditional study abroad agencies operate on commissions, leading them to recommend partner colleges that may not match your profile.
              <br /><br />
              Aura Routes was built to be different — transparent, AI-driven, and student-first from day one.
            </p>

            {/* Highlight proof point */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/50 flex items-center justify-center font-black text-base shrink-0">
                  98%
                </div>
                <div>
                  <h4 className="font-black text-gray-950 text-sm">Visa Approval Rate</h4>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">Verified across all processed student applications</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Benefits grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-blue-100/50 hover:-translate-y-0.5 transition-all duration-300 flex gap-4"
                >
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-950 text-sm mb-1.5 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

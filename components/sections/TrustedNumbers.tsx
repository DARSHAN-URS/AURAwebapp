"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Globe2, 
  BedDouble, 
  Sparkles, 
  CircleDollarSign, 
  Clock, 
  FileText, 
  Briefcase 
} from "lucide-react";

const SCALE_STATS = [
  {
    value: "1,500+",
    label: "University Worldwide",
    sub: "Direct admission pathways",
    icon: GraduationCap,
    color: "bg-primary/10 text-primary border-primary/20/50",
  },
  {
    value: "500K+",
    label: "Courses to Explore",
    sub: "Undergrad, postgrad & medical",
    icon: Globe2,
    color: "bg-indigo-50 text-indigo-600 border-indigo-100/50",
  },
  {
    value: "1M+",
    label: "Student Beds",
    sub: "Verified near-campus housing",
    icon: BedDouble,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
  },
  {
    value: "7",
    label: "AI Tools Built In",
    sub: "SOP builder, eligibility checkers & more",
    icon: Sparkles,
    color: "bg-purple-50 text-purple-600 border-purple-100/50",
  },
];

const DIFFERENTIATOR_STATS = [
  {
    value: "Rs 0",
    label: "Consultant Fee",
    sub: "100% free guidance, no hidden costs",
    icon: CircleDollarSign,
    color: "bg-rose-50 text-rose-600 border-rose-100/50",
  },
  {
    value: "20 Min",
    label: "University Match",
    sub: "AI-powered recommendation engine",
    icon: Clock,
    color: "bg-amber-50 text-amber-600 border-amber-100/50",
  },
  {
    value: "14+",
    label: "Exams Covered",
    sub: "IELTS, TOEFL, GRE, GMAT & more",
    icon: FileText,
    color: "bg-teal-50 text-teal-600 border-teal-100/50",
  },
  {
    value: "40+",
    label: "Career Countries",
    sub: "Global post-study work opportunities",
    icon: Briefcase,
    color: "bg-cyan-50 text-cyan-600 border-cyan-100/50",
  },
];

const PARTNERS = [
  "University of Toronto",
  "University of Melbourne",
  "University of Bristol",
  "NUS Singapore",
  "LMU Munich",
  "Trinity College Dublin",
];

export default function TrustedNumbers() {
  return (
    <section className="py-20 bg-[#F8FAFC] border-t border-border select-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Partner logos row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] font-black uppercase text-muted-text tracking-widest mb-7">
            Trusted by students at leading institutions worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {PARTNERS.map((p) => (
              <span key={p} className="text-sm font-extrabold text-gray-300 tracking-tight hover:text-muted-foreground transition-colors cursor-default">
                {p}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Mission statement banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card border border-border rounded-3xl p-8 sm:p-10 mb-12 shadow-sm"
        >
          <div className="max-w-3xl">
            <p className="text-base sm:text-lg text-foreground/80 leading-relaxed font-medium">
              For too long, studying abroad has meant navigating opaque agents, scattered information, and unpredictable costs.{" "}
              <span className="text-foreground font-extrabold">We're here to change that.</span>{" "}
              Our mission is to make global education and careers <span className="text-primary font-bold">accessible, transparent, and intelligent</span> — giving every student a clear, personalized route to their future.
            </p>
          </div>
        </motion.div>

        {/* First Row of Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {SCALE_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-primary/20/50 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tight block">
                    {stat.value}
                  </span>
                  <h4 className="text-xs font-bold text-foreground mt-1.5">{stat.label}</h4>
                  <p className="text-[10px] text-muted-text font-medium mt-0.5">{stat.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Section divider & Label for Differentiators */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 mb-8 text-center"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <span className="relative px-4 bg-[#F8FAFC] text-[10px] font-black uppercase tracking-widest text-primary">
              Unique Differentiators
            </span>
          </div>
        </motion.div>

        {/* Second Row of Stats (Differentiators) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIFFERENTIATOR_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-primary/20/50 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tight block">
                    {stat.value}
                  </span>
                  <h4 className="text-xs font-bold text-foreground mt-1.5">{stat.label}</h4>
                  <p className="text-[10px] text-muted-text font-medium mt-0.5">{stat.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

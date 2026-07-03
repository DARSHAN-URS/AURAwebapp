"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, GraduationCap, BedDouble, Globe2, Briefcase } from "lucide-react";

const STATS = [
  {
    value: "1,500+",
    label: "Universities Worldwide",
    sub: "Direct admission pathways",
    icon: GraduationCap,
    color: "bg-blue-50 text-blue-600 border-blue-100/50",
  },
  {
    value: "500,000+",
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
    value: "50+",
    label: "Career Countries",
    sub: "Global job opportunities",
    icon: Briefcase,
    color: "bg-amber-50 text-amber-600 border-amber-100/50",
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
    <section className="py-20 bg-[#F8FAFC] border-t border-gray-100 select-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Partner logos row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-7">
            Trusted by students at leading institutions worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {PARTNERS.map((p) => (
              <span key={p} className="text-sm font-extrabold text-gray-300 tracking-tight hover:text-gray-500 transition-colors cursor-default">
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
          className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 mb-10 shadow-xs"
        >
          <div className="max-w-3xl">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium">
              For too long, studying abroad has meant navigating opaque agents, scattered information, and unpredictable costs.{" "}
              <span className="text-gray-950 font-extrabold">We're here to change that.</span>{" "}
              Our mission is to make global education and careers <span className="text-blue-600 font-bold">accessible, transparent, and intelligent</span> — giving every student a clear, personalized route to their future.
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 shadow-xs hover:shadow-md hover:border-blue-100/50 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight block">
                    {stat.value}
                  </span>
                  <h4 className="text-xs font-bold text-gray-900 mt-1.5">{stat.label}</h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">{stat.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

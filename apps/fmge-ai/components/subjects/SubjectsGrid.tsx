"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Brain, Activity, Dna, Microscope, Bug, Pill, Scale, Users, Stethoscope, Scissors, HeartPulse, Baby, Bone, Eye, Ear, Sparkles, BrainCircuit, Scan, Syringe, ChevronRight } from "lucide-react";

interface SubjectItem {
  id: string;
  name: string;
  category: string;
  weightage_qs: number;
  high_yield_topics: string[];
  icon: string;
}

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  Activity: <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  Dna: <Dna className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  Microscope: <Microscope className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  Bug: <Bug className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  Pill: <Pill className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  Scale: <Scale className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  Users: <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  Stethoscope: <Stethoscope className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  Scissors: <Scissors className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  HeartPulse: <HeartPulse className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  Baby: <Baby className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  Bone: <Bone className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  Eye: <Eye className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  Ear: <Ear className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  Sparkles: <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  BrainCircuit: <BrainCircuit className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  Scan: <Scan className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
  Syringe: <Syringe className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
};

export function SubjectsGrid() {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    fetch("http://localhost:8000/api/fmge/subjects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSubjects(data.subjects);
        }
      })
      .catch(() => {});
  }, []);

  const categories = ["All", "Pre-Clinical", "Para-Clinical", "Clinical"];

  const filteredSubjects = activeCategory === "All"
    ? subjects
    : subjects.filter((s) => s.category === activeCategory);

  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
            NBE Syllabus Alignment
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Comprehensive Coverage Across All <span className="gradient-text">19 FMGE Subjects</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Every subject includes high-yield revision topics, image-based questions, and previous years' NBE exam questions.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((sub) => (
            <Link
              key={sub.id}
              href={`/syllabus#${sub.id}`}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-teal-500/50 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-100 dark:border-teal-900 group-hover:scale-110 transition-transform">
                      {iconMap[sub.icon] || <Stethoscope className="w-5 h-5 text-teal-600" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                        {sub.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {sub.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-950 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                    ~{sub.weightage_qs} Qs
                  </span>
                </div>

                {/* High Yield Topics */}
                <div className="mt-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    High Yield Focus:
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {sub.high_yield_topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform">
                <span>Practice {sub.name} MCQs</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

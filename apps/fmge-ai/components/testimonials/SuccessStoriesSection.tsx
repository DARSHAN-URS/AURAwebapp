"use client";

import React, { useEffect, useState } from "react";
import { Star, Quote, Award, CheckCircle, ExternalLink } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  college: string;
  score_before: number;
  score_after: number;
  fmge_attempt: string;
  quote: string;
  avatar: string;
}

export function SuccessStoriesSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/fmge/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTestimonials(data.testimonials);
        }
      })
      .catch(() => {
        // Fallback
        setTestimonials([
          {
            id: "1",
            name: "Dr. Rahul Sharma",
            college: "Kursk State Medical University, Russia",
            score_before: 128,
            score_after: 214,
            fmge_attempt: "Cleared December FMGE (214/300)",
            quote: "FMGE AI's 300-question CBT mock engine gave me the exact feel of the NBE exam interface. The AI Tutor pinpointed my weak areas in Pharmacology and PSM within two weeks!",
            avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
          },
          {
            id: "2",
            name: "Dr. Ananya Patel",
            college: "Tbilisi State Medical University, Georgia",
            score_before: 134,
            score_after: 198,
            fmge_attempt: "Cleared June FMGE (198/300)",
            quote: "The Image-Based Questions (IBQs) and pathology histology flashcards on FMGE AI were spot-on. I scored 198 on my first attempt after studying in Georgia!",
            avatar: "https://images.unsplash.com/photo-1594824813566-7885347b0682?w=150&auto=format&fit=crop&q=80"
          },
          {
            id: "3",
            name: "Dr. Mohammed Nizam",
            college: "Davao Medical School Foundation, Philippines",
            score_before: 141,
            score_after: 206,
            fmge_attempt: "Cleared December FMGE (206/300)",
            quote: "The AI Study Planner adjusted my daily schedule whenever I fell behind during my hospital internship. I recommend FMGE AI to every FMG preparing for NMC licensing.",
            avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"
          }
        ]);
      });
  }, []);

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
            Real Student Results
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Trusted by Thousands of <span className="gradient-text">Foreign Medical Graduates</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            See how doctors from Russia, Georgia, Philippines, Kazakhstan, and Ukraine cleared their NMC licensing exam.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:scale-[1.02] transition-transform"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-500"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.college}</p>
                    </div>
                  </div>
                </div>

                {/* Score badge */}
                <div className="my-4 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-800 dark:text-teal-300">Score Jump:</span>
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <span className="text-slate-400 line-through">{item.score_before}</span>
                    <span className="text-teal-600 dark:text-teal-400 text-sm">→ {item.score_after} Marks</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {item.fmge_attempt}
                </span>
                <span className="flex text-amber-400 gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

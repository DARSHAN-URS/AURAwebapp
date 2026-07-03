"use client";

import React from "react";
import { motion } from "framer-motion";
import { STUDENT_JOURNEY } from "@/constants";
import { Sparkles, ArrowRight } from "lucide-react";

export default function StudentJourney() {
  return (
    <section className="py-24 sm:py-32 bg-background border-t border-border" id="journey">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-2xl mb-20">
          <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            The Aura{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">
              Student Journey
            </span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            A clear, structured, and technology-driven pathway from your current academic profile to landing on your dream campus.
          </p>
        </div>

        {/* Vertical Stepper layout */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical progress line */}
          <div className="absolute left-6 md:left-8 top-2 bottom-2 w-[2px] bg-border/60" />

          <div className="flex flex-col gap-10">
            {STUDENT_JOURNEY.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex gap-6 md:gap-10 relative group"
                >
                  {/* Step Bubble Indicator */}
                  <div className="relative z-10 shrink-0">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg group-hover:border-primary/50 group-hover:shadow-primary/5 transition-all duration-300">
                      <span className="text-sm md:text-base font-black text-primary" style={{ fontFamily: "var(--font-heading)" }}>
                        {step.step}
                      </span>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-card border border-border rounded-3xl p-6 sm:p-8 hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight group-hover:text-primary transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase mt-0.5">
                          Step {step.step}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium">
                      {step.description}
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

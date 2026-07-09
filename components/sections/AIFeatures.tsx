"use client";

import React from "react";
import { motion as motionFramer } from "framer-motion";
import {
  UserCheck,
  FileText,
  SearchCode,
  Search,
  Award,
  CheckSquare,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function AIFeatures() {
  const tools = [
    {
      title: "AI Eligibility Checker",
      description: "Evaluate academic eligibility metrics, GPA cutoffs, and target country visa probability matching models in 30 seconds.",
      icon: UserCheck,
      href: "/eligibility",
      large: true,
      color: "from-blue-500/10 to-indigo-500/10"
    },
    {
      title: "AI SOP Generator",
      description: "Draft compelling, highly personalized Statements of Purpose tailored directly to target admissions gates.",
      icon: FileText,
      href: "/sop",
      large: false,
      color: "from-purple-500/10 to-pink-500/10"
    },
    {
      title: "AI Document Checker",
      description: "Verify transcripts, LORs, CVs, and gap certificates against country visa checklist criteria.",
      icon: SearchCode,
      href: "/visa-check",
      large: false,
      color: "from-rose-500/10 to-amber-500/10"
    },
    {
      title: "AI University Matcher",
      description: "Impartially screen 1500+ world-class courses based on family budgets, target qualifications, and intakes.",
      icon: Search,
      href: "/universities",
      large: false,
      color: "from-teal-500/10 to-emerald-500/10"
    },
    {
      title: "AI Scholarship Finder",
      description: "Scan thousands of active bursaries, tuition waivers, and country-specific sponsorships to minimize study funding gaps.",
      icon: Award,
      href: "/scholarships",
      large: true,
      color: "from-cyan-500/10 to-blue-500/10"
    },
    {
      title: "AI Visa Success Center",
      description: "Evaluate your visa readiness scores, prepare with simulated interview coaches, and map out financial safety logs.",
      icon: CheckSquare,
      href: "/visa-success",
      large: false,
      color: "from-emerald-500/10 to-blue-500/10"
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-card border-y border-border" id="ai-tools">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Block */}
        <div className="max-w-2xl mb-16 text-left">
          <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.1] mb-6" style={{ fontFamily: "var(--font-heading)" }}>
            AI Student Workspace
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Explore the powerful AI tools engineered to automate profile evaluation, shortlisting, scholarship matches, and SOP compilation in seconds.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <motionFramer.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={`group border border-border rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden bg-background shadow-sm hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 ${
                  tool.large ? "md:col-span-2" : "md:col-span-1"
                }`}
              >
                {/* Visual subtle colored radial glow blob in card back */}
                <div className={`absolute top-0 right-0 w-36 h-36 rounded-full bg-gradient-to-br ${tool.color} filter blur-xl opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none`} />

                <div>
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 border border-primary/10">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-foreground tracking-tight mb-3 group-hover:text-primary transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                    {tool.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground font-medium">
                    {tool.description}
                  </p>
                </div>

                <Link
                  href={tool.href}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary mt-8 group-hover:gap-2.5 transition-all relative z-10 w-fit"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

              </motionFramer.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

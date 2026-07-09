"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Shield, Users, HeartHandshake, Eye } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/common/BookingContext";

export default function AboutPage() {
  const { openBooking } = useBooking();

  const values = [
    {
      title: "Absolute Transparency",
      description: "We are building an agentic AI search experience. We do not hide matching metrics or push sponsored, unaligned universities.",
      icon: Shield,
    },
    {
      title: "Student-First Philosophy",
      description: "Every feature—from visa checker rules to housing placement—is built to minimize costs and maximize student outcomes.",
      icon: HeartHandshake,
    },
    {
      title: "Advanced Technology",
      description: "We bring modern ML workflows, automatic documentation auditing, and instant profile matching to an industry stagnant for decades.",
      icon: Sparkles,
    },
  ];

  return (
    <div className="bg-white pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6"
          >
            Redefining Study Abroad with <span className="text-blue-600">Integrity & AI</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-500 leading-relaxed"
          >
            Aura Routes AI was founded by a team of international alumni and software engineers who experienced the friction, opacity, and exorbitant costs of traditional study abroad agencies. We set out to build a platform that gives every student unbiased, immediate, and complete support.
          </motion.p>
        </div>

        {/* Brand Vision Image/Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden aspect-[21/9] max-w-5xl mx-auto bg-gradient-to-r from-blue-600/90 to-indigo-600/95 p-8 sm:p-12 text-white flex flex-col justify-end shadow-xl mb-24"
        >
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg className="w-full h-full stroke-white/10" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="25" strokeWidth="0.5" fill="none" />
            </svg>
          </div>
          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-blue-200" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">The Vision</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Empowering 1 Million Students by 2030</h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              We want to democratize access to elite education, helping students secure loans, optimize documents, and bypass commission-based consultancy pipelines.
            </p>
          </div>
        </motion.div>

        {/* Our Values */}
        <div className="max-w-5xl mx-auto mb-24">
          <SectionTitle
            title="Our Core Values"
            subtitle="The principles that guide our product development and how we work with students every single day."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col items-start"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 border border-blue-100">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Final CTA */}
        <div className="max-w-3xl mx-auto text-center bg-gray-50 border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mb-3">Speak with a Mentor Today</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-md mx-auto">
            Get your academic profile evaluated by one of our senior study abroad counsellors and set up your action plan.
          </p>
          <Button
            onClick={openBooking}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-full shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Schedule Free Call
          </Button>
        </div>

      </div>
    </div>
  );
}

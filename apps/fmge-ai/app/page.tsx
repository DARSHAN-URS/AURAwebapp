import React from "react";
import { HeroSection } from "@/components/hero/HeroSection";
import { SubjectsGrid } from "@/components/subjects/SubjectsGrid";
import { AIShowcase } from "@/components/ai/AIShowcase";
import { MockPreview } from "@/components/mocks/MockPreview";
import { SuccessStoriesSection } from "@/components/testimonials/SuccessStoriesSection";
import { PricingSection } from "@/components/pricing/PricingSection";
import Link from "next/link";
import { ArrowRight, HelpCircle, Mail, Phone, MessageSquare, Send } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* Hero Section with Dynamic Live Metrics */}
      <HeroSection />

      {/* 19 FMGE Medical Subjects Grid */}
      <SubjectsGrid />

      {/* Interactive AI Showcase (Tutor, Planner, Analytics) */}
      <AIShowcase />

      {/* 300-Q NBE CBT Mock Test Preview */}
      <MockPreview />

      {/* Real Student Success Stories */}
      <SuccessStoriesSection />

      {/* Subscription Pricing Plans */}
      <PricingSection />

      {/* Lead Generation & Contact Form Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
                Academic Counseling
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Have Questions About FMGE 2026 or NExT Eligibility?
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Connect directly with our senior medical faculty counselors. We help FMG students from Russia, Georgia, Philippines, Kazakhstan, Ukraine, and China structure custom 6-month revision roadmaps.
              </p>

              <div className="space-y-3 pt-4 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span>Instant WhatsApp Support: +91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>Academic Support Email: support@fmge.ai</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <form className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-4 text-slate-900 dark:text-white">
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Request Free Academic Consultation</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="Dr. Rahul Verma"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="rahul@example.com"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Country of Medical Study</label>
                    <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500">
                      <option value="Russia">Russia</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Uzbekistan">Uzbekistan</option>
                      <option value="Kazakhstan">Kazakhstan</option>
                      <option value="Ukraine">Ukraine</option>
                      <option value="China">China</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Exam Session</label>
                    <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500">
                      <option value="Dec 2026">December 2026 FMGE</option>
                      <option value="June 2027">June 2027 FMGE</option>
                      <option value="NExT 2027">NExT 2027</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Message / Question</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us your current score or weak subjects..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Submit Consultation Request</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

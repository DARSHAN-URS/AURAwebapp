"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, Search } from "lucide-react";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is the NBE FMGE exam pattern and cutoff?",
      a: "The FMGE is a 300-question computer-based test split into Part A (150 Qs, 150 mins) and Part B (150 Qs, 150 mins). The passing cutoff is 150 out of 300 marks (50%). There is no negative marking."
    },
    {
      q: "How does FMGE AI help me clear on my first attempt?",
      a: "FMGE AI combines 15,000+ NBE-pattern clinical vignette questions, authentic CBT exam simulations, instant AI clinical doubt solving, and a 19-subject pass probability radar to eliminate your weak areas."
    },
    {
      q: "Are the questions updated for the upcoming FMGE & NExT exam?",
      a: "Yes! Our academic team updates the question bank daily in alignment with the latest National Medical Commission (NMC) guidelines and NBE exam trends."
    },
    {
      q: "Can I access FMGE AI on my phone or iPad?",
      a: "Absolutely. FMGE AI is fully responsive on desktop, tablet, and mobile browsers, allowing you to practice MCQs during hospital rotations or travel."
    },
    {
      q: "What payment methods are supported for subscription plans?",
      a: "We support Razorpay, UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, and No-Cost EMI plans for Indian and international cards."
    }
  ];

  const filteredFaqs = faqs.filter(
    (f) => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
          Frequently Asked Questions
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
          Got Questions? <span className="gradient-text">We Have Answers</span>
        </h1>
        
        <div className="relative pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-[22px]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs by keyword (e.g., cutoff, CBT, NExT)..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 shadow-sm"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => (
          <div
            key={idx}
            className="glass-panel rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-4 text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-teal-600 transition-transform ${openIdx === idx ? "rotate-180" : ""}`} />
            </button>
            {openIdx === idx && (
              <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60 pt-3 leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

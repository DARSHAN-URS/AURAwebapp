"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Shield, ArrowRight } from "lucide-react";

interface PlanItem {
  id: string;
  name: string;
  price: number;
  billing: string;
  badge?: string;
  features: string[];
  recommended: boolean;
  cta: string;
}

export function PricingSection() {
  const [plans, setPlans] = useState<PlanItem[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/fmge/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlans(data.plans);
        }
      })
      .catch(() => {
        setPlans([
          {
            id: "free",
            name: "Free Starter",
            price: 0,
            billing: "Forever Free",
            badge: "Trial",
            features: [
              "500+ Practice MCQs across 19 Subjects",
              "1 Mini NBE Mock Test (60 Qs)",
              "5 AI Tutor Queries / day",
              "Basic Performance Summary"
            ],
            recommended: false,
            cta: "Get Started Free"
          },
          {
            id: "basic",
            name: "Basic Pass",
            price: 2999,
            billing: "6 Months Access",
            badge: "Popular",
            features: [
              "Full 15,000+ NBE Pattern QBank",
              "10 Full-Length 300-Q CBT Mock Tests",
              "Subject-wise & Topic-wise Tests",
              "100 AI Tutor Queries / month",
              "AI Weak Area Analytics"
            ],
            recommended: false,
            cta: "Enroll in Basic"
          },
          {
            id: "premium",
            name: "Pro Clinical Pass",
            price: 4999,
            billing: "12 Months Access",
            badge: "Best Value",
            features: [
              "Everything in Basic Pass",
              "Unlimited NBE Grand Tests (GTs)",
              "Unlimited AI Clinical Tutor & IBQ Assistant",
              "AI Study Planner with Daily Re-indexing",
              "5,000+ High-Yield Spaced Repetition Flashcards",
              "Image Bank (4,500+ Radiology & Pathology slides)"
            ],
            recommended: true,
            cta: "Start Pro Trial"
          },
          {
            id: "ultimate",
            name: "Ultimate Institutional",
            price: 8999,
            billing: "18 Months (Full Intern Pack)",
            badge: "Complete Pack",
            features: [
              "Everything in Pro Clinical Pass",
              "1-on-1 AI Faculty Doubt Sessions",
              "NExT / NEET PG Transition Modules",
              "Printed High-Yield Revision Workbooks Shipped",
              "100% Refund Pass Guarantee*"
            ],
            recommended: false,
            cta: "Get Ultimate Access"
          }
        ]);
      });
  }, []);

  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
            Simple Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Invest in Your Medical License with <span className="gradient-text">Zero Risk</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Choose the subscription plan that fits your study timeline. All plans include shared Razorpay secure payment processing.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                plan.recommended
                  ? "bg-slate-900 text-white shadow-2xl ring-2 ring-teal-500 transform lg:-translate-y-2"
                  : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-teal-500 text-slate-950">
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="font-extrabold text-xl">{plan.name}</h3>
                <p className={`text-xs mt-1 ${plan.recommended ? "text-slate-400" : "text-slate-500 dark:text-slate-400"}`}>
                  {plan.billing}
                </p>

                <div className="my-6">
                  <span className="text-4xl font-black">
                    {plan.price === 0 ? "₹0" : `₹${plan.price.toLocaleString()}`}
                  </span>
                  {plan.price > 0 && <span className="text-xs font-semibold ml-1">/ one-time</span>}
                </div>

                <ul className="space-y-3 text-xs">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.recommended ? "text-teal-400" : "text-teal-600 dark:text-teal-400"}`} />
                      <span className={plan.recommended ? "text-slate-300" : "text-slate-600 dark:text-slate-300"}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href={`/checkout?plan=${plan.id}`}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                    plan.recommended
                      ? "bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/30"
                      : "bg-teal-600 hover:bg-teal-700 text-white"
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

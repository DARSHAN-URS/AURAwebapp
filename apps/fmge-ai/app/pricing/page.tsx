"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard, Check, Sparkles, ShieldCheck, Tag, ArrowRight, X
} from "lucide-react";

export default function PricingCheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Free Trial",
      price: 0,
      period: "Forever Free",
      desc: "Basic question access & daily study planner",
      popular: false,
      features: ["100 QBank Practice Questions", "1 Full NBE Mock Test", "Basic Study Planner", "Community Forum Access"]
    },
    {
      id: "basic",
      name: "Basic Aspirant",
      price: 1499,
      period: "per month",
      desc: "Full 19-subject QBank & standard mock tests",
      popular: false,
      features: ["Full 19-Subject Question Bank", "5 NBE CBT Mock Tests", "AI Study Planner & SM-2 Spaced Repetition", "Basic AI Tutor Doubt Solver"]
    },
    {
      id: "premium",
      name: "Premium Pro",
      price: 2999,
      period: "per month",
      desc: "Everything + AI Tutor, Clinical Cases & PACS Image Lab",
      popular: true,
      features: ["Unlimited QBank & Custom Test Builder", "Unlimited NBE CBT Mock Tests & Analytics", "24/7 AI Medical Tutor & Voice Assistant", "AI Clinical Case Simulator & EMR Workbench", "PACS Educational Medical Image Lab", "Downloadable GST Tax Invoices & Reports"]
    },
    {
      id: "ultimate",
      name: "Ultimate Institutional",
      price: 4999,
      period: "per month",
      desc: "1-on-1 Faculty Mentorship & Institution Cohorts",
      popular: false,
      features: ["Everything in Premium Pro", "1-on-1 Faculty Mentorship Sessions", "Institution Cohort Leaderboard Access", "Priority 24/7 Academic Support"]
    }
  ];

  const currentPlanObj = plans.find((p) => p.id === selectedPlan) || plans[2];
  const basePrice = currentPlanObj.price;
  const finalPriceAfterDiscount = Math.max(basePrice - discountApplied, 0);
  const gst18 = Math.round(finalPriceAfterDiscount * 0.18);
  const totalPayable = Math.round(finalPriceAfterDiscount + gst18);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "FMGEAI10" || couponCode.toUpperCase() === "DRSUMIT20") {
      setDiscountApplied(300);
    } else {
      alert("Invalid Promo Coupon Code. Try FMGEAI10 for ₹300 OFF.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-teal-400 bg-teal-950 px-3 py-1 rounded-full border border-teal-800 uppercase tracking-wider">
            FMGE AI Premium Plans
          </span>
          <h1 className="text-4xl font-extrabold text-white">Invest in Your FMGE Success</h1>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Choose the subscription plan that fits your preparation speed. Every plan includes Razorpay instant access & 18% GST tax invoices.
          </p>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                p.popular
                  ? "border-teal-500 bg-slate-900 shadow-2xl ring-2 ring-teal-500/30"
                  : "border-slate-800 bg-slate-900/60"
              }`}
            >
              <div className="space-y-4">
                {p.popular && (
                  <span className="text-[10px] font-extrabold uppercase text-slate-950 bg-teal-400 px-3 py-0.5 rounded-full inline-block">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="font-extrabold text-lg text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{p.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">₹{p.price.toLocaleString("en-IN")}</span>
                  <span className="text-xs text-slate-400 font-medium">/ {p.period}</span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  {p.features.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    setSelectedPlan(p.id);
                    setShowCheckoutModal(true);
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all ${
                    p.popular
                      ? "bg-teal-500 hover:bg-teal-400 text-slate-950"
                      : "bg-slate-800 hover:bg-slate-700 text-white"
                  }`}
                >
                  {p.price === 0 ? "Get Started Free" : `Subscribe to ${p.name}`}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Razorpay Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-teal-400" />
                <h3 className="font-extrabold text-base text-white">Razorpay Secure Checkout</h3>
              </div>
              <button onClick={() => setShowCheckoutModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Plan Details */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-300">Plan: {currentPlanObj.name}</span>
                <span className="text-white">₹{basePrice}</span>
              </div>
              {discountApplied > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Promo Discount (FMGEAI10):</span>
                  <span>-₹{discountApplied}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>GST (18% Tax):</span>
                <span>+₹{gst18}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-teal-400 pt-2 border-t border-slate-800">
                <span>Total Payable Amount:</span>
                <span>₹{totalPayable}</span>
              </div>
            </div>

            {/* Coupon Form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2 text-xs">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter Promo Code (e.g. FMGEAI10)"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white font-mono uppercase"
              />
              <button type="submit" className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold">
                Apply Code
              </button>
            </form>

            <button
              onClick={() => {
                alert(`Razorpay Payment Successful! You are now subscribed to ${currentPlanObj.name}.`);
                setShowCheckoutModal(false);
              }}
              className="w-full py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Pay ₹{totalPayable} via Razorpay (UPI / Cards / NetBanking)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

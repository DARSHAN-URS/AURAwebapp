"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ShoppingBag, ArrowRight, ShieldCheck, Mail, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const receipt = searchParams.get("receipt") || `INV_${Math.random().toString(36).substring(3, 9).toUpperCase()}`;
  const service = searchParams.get("service") || "AI SOP Generator";

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-md w-full bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
      {/* Top accent border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500" />

      {/* Success Animation Ring */}
      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-8 h-8 fill-emerald-500/10" />
      </div>

      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Payment Completed</h1>
      <p className="text-xs sm:text-sm text-gray-400 font-semibold mb-8">Your service package is now active.</p>

      {/* Invoice summary info */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-left mb-8 flex flex-col gap-3.5 text-xs sm:text-sm">
        <h4 className="font-extrabold text-gray-950 uppercase tracking-wider text-xs border-b border-gray-200 pb-2 flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4 text-blue-600" />
          <span>Purchase Details</span>
        </h4>
        
        <div className="flex justify-between font-semibold text-gray-700">
          <span>Item:</span>
          <span className="text-gray-900 text-right">{service}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-700">
          <span>Receipt No:</span>
          <span className="font-mono text-gray-900">{receipt}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-700">
          <span>Date:</span>
          <span className="text-gray-900">{currentDate}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-700">
          <span>Status:</span>
          <span className="text-emerald-600 font-extrabold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Captured</span>
          </span>
        </div>
      </div>

      {/* Receipt note */}
      <div className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl flex gap-2.5 text-xs text-blue-800 text-left leading-relaxed mb-8">
        <Mail className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
        <span>
          A detailed PDF receipt invoice and access coordinates have been dispatched to your registered billing email address.
        </span>
      </div>

      <div className="flex flex-col gap-3.5">
        <Button
          onClick={() => router.push("/eligibility")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-full shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <span>Access Your Tool</span>
          <ArrowRight className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full py-3.5 text-sm cursor-pointer"
        >
          Return to Home
        </Button>
      </div>

      <div className="flex items-center gap-1.5 justify-center mt-8 text-[11px] text-gray-400 font-semibold">
        <HelpCircle className="w-4 h-4 text-blue-600" />
        <span>Need support? Contact billing@auraroutes.com</span>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24 flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <p className="text-sm font-semibold text-gray-500">Loading invoice receipt...</p>
          </div>
        }>
          <PaymentSuccessContent />
        </Suspense>
      </div>
    </div>
  );
}

"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, RefreshCw, AlertTriangle, ShieldCheck, Mail, HelpCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorMsg = searchParams.get("error") || "Transaction declined by issuing bank.";

  return (
    <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
      {/* Top accent border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500" />

      {/* Failure Icon */}
      <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-8 h-8 fill-rose-500/10" />
      </div>

      <h1 className="text-2xl font-extrabold text-foreground mb-2">Payment Failed</h1>
      <p className="text-xs sm:text-sm text-muted-text font-semibold mb-8">We could not process your transaction.</p>

      {/* Details */}
      <div className="bg-background border border-border rounded-2xl p-5 text-left mb-8 flex flex-col gap-3.5 text-xs sm:text-sm">
        <h4 className="font-extrabold text-foreground uppercase tracking-wider text-xs border-b border-border pb-2 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>Failure Reason</span>
        </h4>
        <p className="text-muted-foreground font-medium leading-relaxed">
          {errorMsg}
        </p>
      </div>

      {/* Security note */}
      <div className="p-4 bg-primary/10/50 border border-primary/20/50 rounded-2xl flex gap-2.5 text-xs text-blue-800 text-left leading-relaxed mb-8">
        <ShieldCheck className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
        <span>
          If money was deducted from your account, it will be automatically refunded by your bank within 3 to 5 working days.
        </span>
      </div>

      <div className="flex flex-col gap-3.5">
        <Button
          onClick={() => router.push("/services")}
          className="bg-primary hover:bg-primary text-white font-bold py-3.5 rounded-full shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <RefreshCw className="w-4 h-4 animate-spin-slow" />
          <span>Retry Package Purchase</span>
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="border-border text-muted-foreground hover:bg-background rounded-full py-3.5 text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Home</span>
        </Button>
      </div>

      <div className="flex items-center gap-1.5 justify-center mt-8 text-[11px] text-muted-text font-semibold">
        <HelpCircle className="w-4 h-4 text-primary" />
        <span>Billing assistance: billing@auraroutes.com</span>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <div className="bg-card min-h-screen pt-32 pb-24 flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm font-semibold text-muted-foreground">Loading checkout forms...</p>
          </div>
        }>
          <PaymentFailedContent />
        </Suspense>
      </div>
    </div>
  );
}

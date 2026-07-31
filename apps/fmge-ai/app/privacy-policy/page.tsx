import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
      <p className="text-slate-500">Last updated: July 31, 2026</p>

      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
        <p>FMGE AI collects personal account details (name, email address, medical university, country of study), payment history via Razorpay, and learning performance analytics (question attempts, test scores, study duration).</p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white">2. How We Use Your Data</h2>
        <p>Your performance data is processed by our AI engines to calculate your FMGE pass probability, detect weak subjects, generate personalized revision schedules, and improve platform question quality.</p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Data Security & Encryption</h2>
        <p>All user communication is encrypted via TLS 1.3. We do not sell or rent user data to third parties. Payments are handled securely via PCI-DSS compliant Razorpay servers.</p>
      </div>
    </div>
  );
}

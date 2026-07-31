import React from "react";

export default function TermsPage() {
  return (
    <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Terms & Conditions</h1>
      <p className="text-slate-500">Last updated: July 31, 2026</p>

      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">1. User Agreement</h2>
        <p>By registering on FMGE AI, you agree to access educational material strictly for personal examination preparation for the FMGE / NExT licensing exams.</p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Intellectual Property Rights</h2>
        <p>All question banks, CBT mock engine code, AI explanations, medical illustrations, and flashcards are proprietary intellectual property of Healthcare AI Suite.</p>

        <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Subscription & Refund Terms</h2>
        <p>Subscriptions provide access for the specified duration (6, 12, or 18 months). Refund requests are subject to our refund policy terms.</p>
      </div>
    </div>
  );
}

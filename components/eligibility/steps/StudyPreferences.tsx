"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { EligibilityFormValues } from "@/schemas/eligibility";

import { useRouter } from "next/navigation";

interface StepProps {
  register: UseFormRegister<EligibilityFormValues>;
  errors: FieldErrors<EligibilityFormValues>;
  countryTier?: number;
}

export default function StudyPreferences({ register, errors, countryTier = 1 }: StepProps) {
  const router = useRouter();

  const TIER_1_COUNTRIES = ["Canada", "UK", "USA", "Australia", "Germany", "Ireland", "New Zealand", "Dubai", "Singapore", "France"];
  const TIER_2_COUNTRIES = [
    "Georgia", "Kazakhstan", "Uzbekistan", "Philippines", "Poland", "Italy", "Netherlands", "Portugal", "Finland", "Malta", "Romania", "Serbia", "Hungary"
  ];
  const TIER_3_COUNTRIES = [
    "Switzerland", "Sweden", "Norway", "Denmark", "Belgium", "Spain", "Japan", "South Korea"
  ];

  const handleUpgrade = async (slug: string) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiBaseUrl}/api/services`);
      if (res.ok) {
        const services = await res.json();
        const matched = services.find((s: any) => s.slug === slug);
        if (matched) {
          router.push(`/checkout?service=${matched.id}`);
        } else {
          alert("Upgrade package not found. Please try again later.");
        }
      }
    } catch (err) {
      console.error("Upgrade checkout navigation failed:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-gray-50 pb-4">
        <h2 className="text-xl font-bold text-foreground">Step 4: Study Preferences</h2>
        <p className="text-xs text-muted-text mt-1">Specify your dream educational destination coordinates.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-text uppercase">Preferred Target Country</label>
          <select
            {...register("studyPreferences.preferredCountry")}
            className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
          >
            <option value="">Select country</option>
            
            {/* Tier 1 - Free countries */}
            <optgroup label="Free Destinations (Tier 1)">
              {TIER_1_COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </optgroup>

            {/* Tier 2 countries */}
            <optgroup label="Tier 2 Destinations (Locked unless upgraded)">
              {TIER_2_COUNTRIES.map((c) => (
                <option key={c} value={c} disabled={countryTier < 2}>
                  {countryTier < 2 ? `🔒 ${c} (Upgrade required)` : c}
                </option>
              ))}
            </optgroup>

            {/* Tier 3 countries */}
            <optgroup label="Tier 3 Destinations (Locked unless upgraded)">
              {TIER_3_COUNTRIES.map((c) => (
                <option key={c} value={c} disabled={countryTier < 3}>
                  {countryTier < 3 ? `🔒 ${c} (Upgrade required)` : c}
                </option>
              ))}
            </optgroup>
          </select>
          {errors.studyPreferences?.preferredCountry && (
            <span className="text-[11px] text-red-500 font-semibold">{errors.studyPreferences.preferredCountry.message}</span>
          )}

          {/* Premium upgrades CTAs */}
          <div className="flex flex-wrap gap-2 mt-1.5">
            {countryTier < 2 && (
              <button
                type="button"
                onClick={() => handleUpgrade("tier-2-country-access")}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl text-[10px] transition-all w-fit cursor-pointer"
              >
                <span>💎 Unlock 20+ more countries (Tier 2) - ₹399</span>
              </button>
            )}
            {countryTier < 3 && (
              <button
                type="button"
                onClick={() => handleUpgrade("tier-3-country-access")}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-orange-500/20 text-amber-700 dark:text-amber-400 font-bold rounded-xl text-[10px] transition-all w-fit cursor-pointer"
              >
                <span>👑 View all destinations (Tier 3) - ₹999</span>
              </button>
            )}
            {countryTier === 2 && (
              <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                ✓ Tier 2 Active
              </span>
            )}
            {countryTier === 3 && (
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                ✓ Tier 3 Active (All unlocked)
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-text uppercase">Preferred Intake</label>
          <select
            {...register("studyPreferences.preferredIntake")}
            className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
          >
            <option value="">Select intake</option>
            <option value="Sept/Fall 2026">Sept/Fall 2026</option>
            <option value="Jan/Winter 2027">Jan/Winter 2027</option>
            <option value="Spring 2027">Spring 2027</option>
            <option value="Fall 2027">Fall 2027</option>
          </select>
          {errors.studyPreferences?.preferredIntake && (
            <span className="text-[11px] text-red-500 font-semibold">{errors.studyPreferences.preferredIntake.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-text uppercase">Preferred Course / Major</label>
          <input
            type="text"
            {...register("studyPreferences.preferredCourse")}
            placeholder="e.g. Computer Science or MBBS Abroad"
            className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
          />
          {errors.studyPreferences?.preferredCourse && (
            <span className="text-[11px] text-red-500 font-semibold">{errors.studyPreferences.preferredCourse.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-text uppercase">Annual Budget (Tuition + Living)</label>
          <select
            {...register("studyPreferences.budgetRange")}
            className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
          >
            <option value="">Select budget range</option>
            <option value="Below $15,000 / €13,000">Below $15,000 / €13,000</option>
            <option value="$15,000 - $25,000 / €13,000 - €22,000">$15,000 - $25,000 / €13,000 - €22,000</option>
            <option value="$25,000 - $45,000 / €22,000 - €40,000">$25,000 - $45,000 / €22,000 - €40,000</option>
            <option value="Above $45,000 / €40,000">Above $45,000 / €40,000</option>
          </select>
          {errors.studyPreferences?.budgetRange && (
            <span className="text-[11px] text-red-500 font-semibold">{errors.studyPreferences.budgetRange.message}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-background border border-border rounded-2xl">
        <input
          type="checkbox"
          id="scholarshipRequired"
          {...register("studyPreferences.scholarshipRequired")}
          className="w-4 h-4 text-primary border-border rounded focus:ring-blue-500"
        />
        <label htmlFor="scholarshipRequired" className="text-xs sm:text-sm font-semibold text-foreground/80 cursor-pointer select-none">
          I want to apply for dynamic financial aid and institutional scholarships.
        </label>
      </div>
    </div>
  );
}

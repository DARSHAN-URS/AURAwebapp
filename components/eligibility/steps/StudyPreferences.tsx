"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { EligibilityFormValues } from "@/schemas/eligibility";

interface StepProps {
  register: UseFormRegister<EligibilityFormValues>;
  errors: FieldErrors<EligibilityFormValues>;
}

export default function StudyPreferences({ register, errors }: StepProps) {
  const targetCountries = ["Canada", "UK", "USA", "Australia", "Germany", "Ireland", "New Zealand", "Dubai"];

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
            {targetCountries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.studyPreferences?.preferredCountry && (
            <span className="text-[11px] text-red-500 font-semibold">{errors.studyPreferences.preferredCountry.message}</span>
          )}
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

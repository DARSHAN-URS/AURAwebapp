"use client";

import React from "react";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { EligibilityFormValues } from "@/schemas/eligibility";

interface StepProps {
  register: UseFormRegister<EligibilityFormValues>;
  errors: FieldErrors<EligibilityFormValues>;
  watch: UseFormWatch<EligibilityFormValues>;
}

export default function AdditionalInfo({ register, errors, watch }: StepProps) {
  // Watch preferred course selection to dynamically display NEET score
  const preferredCourse = watch("studyPreferences.preferredCourse") || "";
  const showNeet = preferredCourse.toLowerCase().includes("mbbs");

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-gray-50 pb-4">
        <h2 className="text-xl font-bold text-gray-950">Step 5: Additional Background</h2>
        <p className="text-xs text-gray-400 mt-1">Provide work and passport compliance history details.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase">Work Experience (Years)</label>
          <input
            type="number"
            step="0.1"
            {...register("additionalInfo.workExperience")}
            placeholder="e.g. 1.5 (Enter 0 if none)"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
          />
          {errors.additionalInfo?.workExperience && (
            <span className="text-[11px] text-red-500 font-semibold">{errors.additionalInfo.workExperience.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase">Academic Gap Years</label>
          <input
            type="number"
            {...register("additionalInfo.gapYears")}
            placeholder="e.g. 2 (Enter 0 if none)"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
          />
          {errors.additionalInfo?.gapYears && (
            <span className="text-[11px] text-red-500 font-semibold">{errors.additionalInfo.gapYears.message}</span>
          )}
        </div>
      </div>

      {showNeet && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase">NEET Score (Required for MBBS abroad)</label>
          <input
            type="number"
            {...register("additionalInfo.neetScore")}
            placeholder="e.g. 350 (Out of 720)"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
          />
          {errors.additionalInfo?.neetScore && (
            <span className="text-[11px] text-red-500 font-semibold">{errors.additionalInfo.neetScore.message}</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
        <input
          type="checkbox"
          id="passportAvailable"
          {...register("additionalInfo.passportAvailable")}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="passportAvailable" className="text-xs sm:text-sm font-semibold text-gray-700 cursor-pointer select-none">
          I hold a valid passport for travel and visa filing.
        </label>
      </div>
    </div>
  );
}

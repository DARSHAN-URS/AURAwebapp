"use client";

import React from "react";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { EligibilityFormValues } from "@/schemas/eligibility";

interface StepProps {
  register: UseFormRegister<EligibilityFormValues>;
  errors: FieldErrors<EligibilityFormValues>;
  watch: UseFormWatch<EligibilityFormValues>;
}

export default function AcademicProfile({ register, errors, watch }: StepProps) {
  const qualification = watch("academicProfile.qualification");

  const showBachelor = ["Bachelors Degree", "Masters Degree", "Doctorate (PhD)"].includes(qualification);
  const showMaster = ["Masters Degree", "Doctorate (PhD)"].includes(qualification);

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-gray-50 pb-4">
        <h2 className="text-xl font-bold text-gray-950">Step 2: Academic Profile</h2>
        <p className="text-xs text-gray-400 mt-1">Provide your scores and graduation metrics.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-400 uppercase">Highest Qualification</label>
        <select
          {...register("academicProfile.qualification")}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
        >
          <option value="">Select qualification</option>
          <option value="High School (12th Grade)">High School (12th Grade)</option>
          <option value="Diploma">Diploma / Vocational</option>
          <option value="Bachelors Degree">Bachelors Degree</option>
          <option value="Masters Degree">Masters Degree</option>
          <option value="Doctorate (PhD)">Doctorate (PhD)</option>
        </select>
        {errors.academicProfile?.qualification && (
          <span className="text-[11px] text-red-500 font-semibold">{errors.academicProfile.qualification.message}</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase">10th Score (Percentage / GPA)</label>
          <input
            type="number"
            step="0.01"
            {...register("academicProfile.gpa10th")}
            placeholder="e.g. 85 or 8.5"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
          />
          {errors.academicProfile?.gpa10th && (
            <span className="text-[11px] text-red-500 font-semibold">{errors.academicProfile.gpa10th.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase">12th Score (Percentage / GPA)</label>
          <input
            type="number"
            step="0.01"
            {...register("academicProfile.gpa12th")}
            placeholder="e.g. 82 or 8.2"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
          />
          {errors.academicProfile?.gpa12th && (
            <span className="text-[11px] text-red-500 font-semibold">{errors.academicProfile.gpa12th.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {showBachelor && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase">Bachelor's CGPA (Out of 10 or 4)</label>
            <input
              type="number"
              step="0.01"
              {...register("academicProfile.cgpaBachelors")}
              placeholder="e.g. 8.12"
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
            />
            {errors.academicProfile?.cgpaBachelors && (
              <span className="text-[11px] text-red-500 font-semibold">{errors.academicProfile.cgpaBachelors.message}</span>
            )}
          </div>
        )}

        {showMaster && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase">Master's CGPA (Optional)</label>
            <input
              type="number"
              step="0.01"
              {...register("academicProfile.cgpaMasters")}
              placeholder="e.g. 7.9"
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
            />
            {errors.academicProfile?.cgpaMasters && (
              <span className="text-[11px] text-red-500 font-semibold">{errors.academicProfile.cgpaMasters.message}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-400 uppercase">Graduation / Completion Year</label>
        <input
          type="number"
          {...register("academicProfile.gradYear")}
          placeholder="e.g. 2025"
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
        />
        {errors.academicProfile?.gradYear && (
          <span className="text-[11px] text-red-500 font-semibold">{errors.academicProfile.gradYear.message}</span>
        )}
      </div>
    </div>
  );
}

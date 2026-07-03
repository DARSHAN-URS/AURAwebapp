"use client";

import React from "react";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { EligibilityFormValues } from "@/schemas/eligibility";

interface StepProps {
  register: UseFormRegister<EligibilityFormValues>;
  errors: FieldErrors<EligibilityFormValues>;
  watch: UseFormWatch<EligibilityFormValues>;
}

export default function EnglishProficiency({ register, errors, watch }: StepProps) {
  const englishExam = watch("englishProficiency.englishExam");
  const showScore = englishExam && englishExam !== "Not Yet Taken";

  // Dynamic placeholder helper
  const getScorePlaceholder = () => {
    switch (englishExam) {
      case "IELTS":
        return "e.g. 7.5 (0 - 9.0)";
      case "TOEFL":
        return "e.g. 102 (0 - 120)";
      case "PTE":
        return "e.g. 72 (10 - 90)";
      case "Duolingo":
        return "e.g. 125 (10 - 160)";
      default:
        return "Enter exam score";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-gray-50 pb-4">
        <h2 className="text-xl font-bold text-gray-950">Step 3: English Proficiency</h2>
        <p className="text-xs text-gray-400 mt-1">Select your language certification metrics.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-400 uppercase">English Language Exam</label>
        <select
          {...register("englishProficiency.englishExam")}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
        >
          <option value="">Select exam type</option>
          <option value="IELTS">IELTS</option>
          <option value="TOEFL">TOEFL</option>
          <option value="PTE">PTE</option>
          <option value="Duolingo">Duolingo English Test (DET)</option>
          <option value="Not Yet Taken">Not Yet Taken / Planning to Take</option>
        </select>
        {errors.englishProficiency?.englishExam && (
          <span className="text-[11px] text-red-500 font-semibold">{errors.englishProficiency.englishExam.message}</span>
        )}
      </div>

      {showScore && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase">{englishExam} Overall Score</label>
          <input
            type="number"
            step="0.5"
            {...register("englishProficiency.englishScore")}
            placeholder={getScorePlaceholder()}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
          />
          {errors.englishProficiency?.englishScore && (
            <span className="text-[11px] text-red-500 font-semibold">{errors.englishProficiency.englishScore.message}</span>
          )}
        </div>
      )}
    </div>
  );
}

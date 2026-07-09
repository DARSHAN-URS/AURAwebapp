"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { EligibilityFormValues } from "@/schemas/eligibility";

interface StepProps {
  register: UseFormRegister<EligibilityFormValues>;
  errors: FieldErrors<EligibilityFormValues>;
}

export default function PersonalInfo({ register, errors }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-gray-50 pb-4">
        <h2 className="text-xl font-bold text-foreground">Step 1: Personal Information</h2>
        <p className="text-xs text-muted-text mt-1">Please provide your contact credentials to register your assessment.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-text uppercase">Full Name</label>
          <input
            type="text"
            {...register("personalInfo.fullName")}
            placeholder="e.g. Rahul Sen"
            className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
          />
          {errors.personalInfo?.fullName && (
            <span className="text-[11px] text-red-500 font-semibold">{errors.personalInfo.fullName.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-text uppercase">Email Address</label>
          <input
            type="email"
            {...register("personalInfo.email")}
            placeholder="e.g. rahul@example.com"
            className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
          />
          {errors.personalInfo?.email && (
            <span className="text-[11px] text-red-500 font-semibold">{errors.personalInfo.email.message}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-muted-text uppercase">Phone Number</label>
        <input
          type="tel"
          {...register("personalInfo.phone")}
          placeholder="e.g. +91 98912 63337"
          className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
        />
        {errors.personalInfo?.phone && (
          <span className="text-[11px] text-red-500 font-semibold">{errors.personalInfo.phone.message}</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-text uppercase">Country of Residence</label>
          <input
            type="text"
            {...register("personalInfo.countryResidence")}
            placeholder="e.g. India"
            className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
          />
          {errors.personalInfo?.countryResidence && (
            <span className="text-[11px] text-red-500 font-semibold">{errors.personalInfo.countryResidence.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-text uppercase">Nationality</label>
          <input
            type="text"
            {...register("personalInfo.nationality")}
            placeholder="e.g. Indian"
            className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
          />
          {errors.personalInfo?.nationality && (
            <span className="text-[11px] text-red-500 font-semibold">{errors.personalInfo.nationality.message}</span>
          )}
        </div>
      </div>
    </div>
  );
}

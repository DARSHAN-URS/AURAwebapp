"use client";

import React from "react";
import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export default function Stepper({ currentStep, totalSteps }: StepperProps) {
  const steps = [
    { title: "Personal Info", desc: "Contact Details" },
    { title: "Academic", desc: "GPA & CGPA" },
    { title: "English", desc: "Language Scores" },
    { title: "Preferences", desc: "Country & Intake" },
    { title: "Background", desc: "NEET & Experience" },
  ];

  return (
    <div className="w-full mb-12">
      {/* Visual Line Stepper */}
      <div className="flex items-center justify-between relative max-w-3xl mx-auto">
        
        {/* Connecting bar in background */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-muted -z-10" />
        
        {/* Active connecting bar indicator */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary -z-10 transition-all duration-500 ease-in-out" 
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = currentStep > stepNum;
          const isActive = currentStep === stepNum;

          return (
            <div key={idx} className="flex flex-col items-center select-none shrink-0 relative">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold text-sm ${
                  isCompleted 
                    ? "bg-primary border-blue-600 text-white" 
                    : isActive 
                      ? "bg-card border-blue-600 text-primary shadow-md ring-4 ring-blue-50" 
                      : "bg-card border-border text-muted-text"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4.5 h-4.5 stroke-[2.5]" />
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>

              {/* Labels displayed on desktop viewports */}
              <div className="absolute top-11 hidden md:flex flex-col items-center text-center w-28">
                <span className={`text-xs font-bold ${isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-text"}`}>
                  {step.title}
                </span>
                <span className="text-[10px] text-muted-text font-medium mt-0.5 whitespace-nowrap">
                  {step.desc}
                </span>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, AlertCircle } from "lucide-react";

import { eligibilityFormSchema, EligibilityFormValues } from "@/schemas/eligibility";
import { checkStudentEligibility } from "@/services/eligibility";
import Stepper from "@/components/eligibility/Stepper";
import PersonalInfo from "@/components/eligibility/steps/PersonalInfo";
import AcademicProfile from "@/components/eligibility/steps/AcademicProfile";
import EnglishProficiency from "@/components/eligibility/steps/EnglishProficiency";
import StudyPreferences from "@/components/eligibility/steps/StudyPreferences";
import AdditionalInfo from "@/components/eligibility/steps/AdditionalInfo";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "aura_eligibility_form_progress";

export default function EligibilityFormPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [countryTier, setCountryTier] = useState<number>(1);

  useEffect(() => {
    const fetchUserTier = async () => {
      try {
        const token = localStorage.getItem("supabase_token") || "";
        if (!token) return;
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiBaseUrl}/api/dashboard`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.country_tier) {
            setCountryTier(data.country_tier);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user tier details:", err);
      }
    };
    fetchUserTier();
  }, []);
  
  const totalSteps = 5;

  const form = useForm<any>({
    resolver: zodResolver(eligibilityFormSchema),
    defaultValues: {
      personalInfo: { fullName: "", email: "", phone: "", countryResidence: "", nationality: "" },
      academicProfile: { qualification: "", gpa10th: 0, gpa12th: 0, cgpaBachelors: "", cgpaMasters: "", gradYear: new Date().getFullYear() },
      englishProficiency: { englishExam: "Not Yet Taken", englishScore: "" },
      studyPreferences: { preferredCountry: "Canada", preferredCourse: "", preferredIntake: "Sept/Fall 2026", budgetRange: "", scholarshipRequired: false },
      additionalInfo: { workExperience: 0, gapYears: 0, neetScore: "", passportAvailable: false },
    },
    mode: "onTouched",
  });

  const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } = form;

  // 1. Auto-resume saved progress from localStorage on Mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        // Loop over the keys and set value
        Object.keys(parsed).forEach((key) => {
          setValue(key as any, parsed[key]);
        });
        
        // Auto-resume step if saved
        const savedStep = localStorage.getItem(`${STORAGE_KEY}_step`);
        if (savedStep) {
          setCurrentStep(Number(savedStep));
        }
      }
    } catch (e) {
      console.error("Failed to load saved form progress:", e);
    }
  }, [setValue]);

  // 2. Auto-save progress to localStorage on changes
  const formValues = watch();
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
      localStorage.setItem(`${STORAGE_KEY}_step`, String(currentStep));
    } catch (e) {
      console.error("Failed to save form progress:", e);
    }
  }, [formValues, currentStep]);

  // Step field mapping for localized validations
  const stepFields: Record<number, any> = {
    1: "personalInfo",
    2: "academicProfile",
    3: "englishProficiency",
    4: "studyPreferences",
    5: "additionalInfo",
  };

  const handleNext = async () => {
    // Validate current step fields only
    const activeSection = stepFields[currentStep];
    const isStepValid = await trigger(activeSection);
    
    if (isStepValid) {
      setApiError(null);
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setApiError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFormSubmit = async (values: EligibilityFormValues) => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await checkStudentEligibility(values);
      
      // Clear saved progress on success
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(`${STORAGE_KEY}_step`);
      
      // Redirect to results page
      router.push(`/eligibility/results/${response.request.id}`);
    } catch (error: any) {
      console.error("Submission failed:", error);
      setApiError(error.message || "An unexpected error occurred. Please verify your details and try again.");
      setLoading(false);
    }
  };

  // Animation variants for step transitions
  const slideVariants: any = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      transition: { duration: 0.25, ease: "easeIn" },
    }),
  };

  return (
    <div className="bg-card min-h-screen pt-32 pb-24 flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        
        {/* Loading overlay during AI Evaluation */}
        {loading && (
          <div className="fixed inset-0 bg-card/95 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-6 max-w-sm text-center px-6">
              <div className="relative flex items-center justify-center">
                <Loader2 className="w-16 h-16 animate-spin text-primary" />
                <Sparkles className="w-6 h-6 text-indigo-500 absolute animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-foreground mb-2">Analyzing Your Profile</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Aura Routes AI is reviewing your transcripts, English scores, and study choices against global criteria...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stepper Node header */}
        <Stepper currentStep={currentStep} totalSteps={totalSteps} />

        {/* Form Console Container */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden mt-6">
          
          {/* Subtle gradient light decoration inside card */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10/40 rounded-full filter blur-xl -z-10" />

          {/* API submission errors */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 text-xs sm:text-sm font-semibold rounded-2xl flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p>{apiError}</p>
                <button 
                  onClick={() => handleFormSubmit(form.getValues())}
                  className="mt-2 text-xs text-primary underline font-bold hover:text-primary"
                >
                  Retry Submission
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <AnimatePresence mode="wait" custom={currentStep}>
              <motion.div
                key={currentStep}
                custom={currentStep}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {currentStep === 1 && (
                  <PersonalInfo register={register} errors={errors} />
                )}
                {currentStep === 2 && (
                  <AcademicProfile register={register} errors={errors} watch={watch} />
                )}
                {currentStep === 3 && (
                  <EnglishProficiency register={register} errors={errors} watch={watch} />
                )}
                {currentStep === 4 && (
                  <StudyPreferences register={register} errors={errors} countryTier={countryTier} />
                )}
                {currentStep === 5 && (
                  <AdditionalInfo register={register} errors={errors} watch={watch} />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Stepper Actions footer */}
            <div className="flex items-center justify-between border-t border-border pt-8 mt-10">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="rounded-full px-6 text-muted-foreground disabled:opacity-30 flex items-center gap-1.5 cursor-pointer text-sm font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary text-white font-bold px-7 py-3 rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer text-sm"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary text-white font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 cursor-pointer text-sm"
                >
                  <Sparkles className="w-4 h-4 fill-white/10" />
                  <span>Submit Profile for Audit</span>
                </Button>
              )}
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}

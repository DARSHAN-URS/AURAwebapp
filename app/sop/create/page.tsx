"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SOPProfileWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const totalSteps = 6;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const { register, handleSubmit, trigger, formState: { errors } } = useForm<any>({
    defaultValues: {
      personal_info: { full_name: "", date_of_birth: "", nationality: "", current_country: "", email: "" },
      academic_background: { highest_qualification: "", university: "", cgpa_percentage: "", graduation_year: "", academic_achievements: "" },
      professional_experience: { work_experience: "0", internships: "", projects: "", technical_skills: "", certifications: "", research_experience: "" },
      target_education: { country: "USA", university: "", degree: "Masters", course: "", intake: "Sept/Fall 2026" },
      career_goals: { short_term_goals: "", long_term_goals: "", reason_course: "", reason_university: "", reason_country: "", career_aspirations: "" },
      additional_info: { extracurriculars: "", leadership: "", volunteer_work: "", awards: "", challenges: "", hobbies: "", notes: "" }
    }
  });

  const handleNext = async () => {
    // Validate current step before proceeding
    let sectionKey = "";
    if (step === 1) sectionKey = "personal_info";
    else if (step === 2) sectionKey = "academic_background";
    else if (step === 3) sectionKey = "professional_experience";
    else if (step === 4) sectionKey = "target_education";
    else if (step === 5) sectionKey = "career_goals";
    else if (step === 6) sectionKey = "additional_info";

    const isStepValid = await trigger(sectionKey);
    if (isStepValid) {
      setError(null);
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (values: any) => {
    setLoading(true);
    setError(null);
    try {
      // Call generate endpoint
      // We pass bypass_check=true in development to make it testable immediately,
      // or standard production calls. Let's send a standard POST request
      const res = await fetch(`${apiBaseUrl}/api/sop/generate?bypass_check=true`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.status === 402) {
        // Redirect to pricing if unpaid
        router.push("/services");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "AI SOP Generator experienced a prompt issue.");
      }

      const document = await res.json();
      router.push(`/sop/editor/${document.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate SOP. Please retry.");
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, title: "Personal Details" },
    { num: 2, title: "Academic Background" },
    { num: 3, title: "Work & Skills" },
    { num: 4, title: "Target Program" },
    { num: 5, title: "Career Vision" },
    { num: 6, title: "Extra Details" }
  ];

  return (
    <div className="bg-card min-h-screen pt-32 pb-24 flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        
        {/* Full screen draft builder overlay */}
        {loading && (
          <div className="fixed inset-0 bg-card/95 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-6 max-w-sm text-center px-6">
              <div className="relative flex items-center justify-center">
                <Loader2 className="w-16 h-16 animate-spin text-primary" />
                <Sparkles className="w-6 h-6 text-indigo-500 absolute animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-foreground mb-2">Drafting Your Statement of Purpose</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Aura SOP AI is processing your achievements, motivation notes, and university parameters to compile a natural, human-grade draft...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Progression Stepper */}
        <div className="mb-12 flex justify-between items-center max-w-xl mx-auto border-b border-border pb-6">
          {stepsList.map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-1.5 shrink-0">
              <div 
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  step >= s.num ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-text"
                }`}
              >
                {s.num}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider hidden sm:inline ${
                step === s.num ? "text-primary" : "text-muted-text"
              }`}>
                {s.title.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>

        {/* Card wrapper */}
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 text-xs sm:text-sm font-semibold rounded-2xl flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            
            {/* STEP 1: PERSONAL INFORMATION */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <div className="border-b border-gray-50 pb-4">
                  <h2 className="text-xl font-bold text-foreground">Step 1: Personal Credentials</h2>
                  <p className="text-xs text-muted-text mt-1 font-medium">Please provide contact credentials to register your document template logs.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-text uppercase">Full Name</label>
                    <input
                      type="text"
                      {...register("personal_info.full_name", { required: true })}
                      placeholder="e.g. Priyan Bose"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-text uppercase">Date of Birth</label>
                    <input
                      type="date"
                      {...register("personal_info.date_of_birth", { required: true })}
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-text uppercase">Nationality</label>
                    <input
                      type="text"
                      {...register("personal_info.nationality", { required: true })}
                      placeholder="e.g. Indian"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-text uppercase">Current Country</label>
                    <input
                      type="text"
                      {...register("personal_info.current_country", { required: true })}
                      placeholder="e.g. India"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-text uppercase">Email Address</label>
                  <input
                    type="email"
                    {...register("personal_info.email", { required: true })}
                    placeholder="e.g. bose@example.com"
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                    required
                  />
                </div>
              </div>
            )}

            {/* STEP 2: ACADEMIC BACKGROUND */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <div className="border-b border-gray-50 pb-4">
                  <h2 className="text-xl font-bold text-foreground">Step 2: Academic Performance</h2>
                  <p className="text-xs text-muted-text mt-1 font-medium">Outline transcripts and previous college credentials.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-text uppercase">Highest Qualification</label>
                  <input
                    type="text"
                    {...register("academic_background.highest_qualification", { required: true })}
                    placeholder="e.g. Bachelor of Technology in Computer Science"
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-text uppercase">University / School</label>
                  <input
                    type="text"
                    {...register("academic_background.university", { required: true })}
                    placeholder="e.g. Vellore Institute of Technology"
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-text uppercase">CGPA / Percentage</label>
                    <input
                      type="text"
                      {...register("academic_background.cgpa_percentage", { required: true })}
                      placeholder="e.g. 8.92/10 or 85%"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-text uppercase">Graduation / Completion Year</label>
                    <input
                      type="text"
                      {...register("academic_background.graduation_year", { required: true })}
                      placeholder="e.g. 2024"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-text uppercase">Academic Achievements / Awards</label>
                  <textarea
                    {...register("academic_background.academic_achievements")}
                    placeholder="e.g. Ranked 3rd in department, National Olympiad gold medalist"
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium h-20 resize-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: PROFESSIONAL EXPERIENCE */}
            {step === 3 && (
              <div className="flex flex-col gap-5">
                <div className="border-b border-gray-50 pb-4">
                  <h2 className="text-xl font-bold text-foreground">Step 3: Industry Experience & Skills</h2>
                  <p className="text-xs text-muted-text mt-1">Provide details of work experience, internships, and tools.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-text uppercase">Years of Work Experience</label>
                    <input
                      type="number"
                      step="0.5"
                      {...register("professional_experience.work_experience", { required: true })}
                      placeholder="e.g. 2 (Enter 0 if fresh graduate)"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-text uppercase">Key Technical Skills</label>
                    <input
                      type="text"
                      {...register("professional_experience.technical_skills", { required: true })}
                      placeholder="e.g. Python, SQL, Neural Networks, Git"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-text uppercase">Internships Completed</label>
                  <textarea
                    {...register("professional_experience.internships")}
                    placeholder="e.g. Worked as Software Engineer intern at Techcorp for 6 months, optimized DB queries"
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium h-16 resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-text uppercase">Key Projects Developed</label>
                  <textarea
                    {...register("professional_experience.projects")}
                    placeholder="e.g. Capstone project: Designed an AI-powered crop health monitoring sensor using Python"
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium h-16 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-text uppercase">Certifications</label>
                    <input
                      type="text"
                      {...register("professional_experience.certifications")}
                      placeholder="e.g. AWS Developer Associate"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-text uppercase">Research Experience</label>
                    <input
                      type="text"
                      {...register("professional_experience.research_experience")}
                      placeholder="e.g. Co-authored paper on Edge AI published in IEEE"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: TARGET EDUCATION */}
            {step === 4 && (
              <div className="flex flex-col gap-5">
                <div className="border-b border-gray-50 pb-4">
                  <h2 className="text-xl font-bold text-foreground">Step 4: Target Admission Program</h2>
                  <p className="text-xs text-muted-text mt-1">Specify your targeted study abroad destination program.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-text uppercase">Target Country</label>
                    <select
                      {...register("target_education.country", { required: true })}
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                    >
                      <option value="USA">USA</option>
                      <option value="Canada">Canada</option>
                      <option value="UK">UK</option>
                      <option value="Germany">Germany</option>
                      <option value="Australia">Australia</option>
                      <option value="Ireland">Ireland</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-text uppercase">Target Intake Term</label>
                    <select
                      {...register("target_education.intake", { required: true })}
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                    >
                      <option value="Sept/Fall 2026">Sept/Fall 2026</option>
                      <option value="Jan/Winter 2027">Jan/Winter 2027</option>
                      <option value="Fall 2027">Fall 2027</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-text uppercase">Target University</label>
                  <input
                    type="text"
                    {...register("target_education.university", { required: true })}
                    placeholder="e.g. Stanford University"
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="flex flex-col gap-1.5 sm:col-span-1">
                    <label className="text-xs font-bold text-muted-text uppercase">Degree Type</label>
                    <input
                      type="text"
                      {...register("target_education.degree", { required: true })}
                      placeholder="e.g. MS"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-muted-text uppercase">Target Course / Major</label>
                    <input
                      type="text"
                      {...register("target_education.course", { required: true })}
                      placeholder="e.g. Computer Science"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: CAREER GOALS */}
            {step === 5 && (
              <div className="flex flex-col gap-5">
                <div className="border-b border-gray-50 pb-4">
                  <h2 className="text-xl font-bold text-foreground">Step 5: Career Goals & Motivations</h2>
                  <p className="text-xs text-muted-text mt-1">Delineate short-term and long-term plans to customize prompts.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-text uppercase">Short-Term Goals (1-3 Years)</label>
                    <input
                      type="text"
                      {...register("career_goals.short_term_goals", { required: true })}
                      placeholder="e.g. Work as an AI research analyst at OpenAI"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-text uppercase">Long-Term Goals (5-10 Years)</label>
                    <input
                      type="text"
                      {...register("career_goals.long_term_goals", { required: true })}
                      placeholder="e.g. Lead an enterprise AI engineering development lab"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-text uppercase">Why choose this Course?</label>
                  <textarea
                    {...register("career_goals.reason_course", { required: true })}
                    placeholder="e.g. I want to build mathematical foundations in machine learning to work on generative model alignment."
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium h-16 resize-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-text uppercase">Why choose this University?</label>
                  <textarea
                    {...register("career_goals.reason_university", { required: true })}
                    placeholder="e.g. The AI research lab led by Dr. Smith works specifically on neural architecture search, matching my thesis goals."
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium h-16 resize-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-text uppercase">Why choose this Country?</label>
                  <textarea
                    {...register("career_goals.reason_country", { required: true })}
                    placeholder="e.g. The Silicon Valley ecosystem in the USA provides unparalleled collaboration and internship options."
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium h-16 resize-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* STEP 6: ADDITIONAL INFORMATION */}
            {step === 6 && (
              <div className="flex flex-col gap-5">
                <div className="border-b border-gray-50 pb-4">
                  <h2 className="text-xl font-bold text-foreground">Step 6: Additional Reflections</h2>
                  <p className="text-xs text-muted-text mt-1">Provide volunteer work, hobbies, or obstacles to enhance draft quality.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-text uppercase">Extracurricular Activities</label>
                    <input
                      type="text"
                      {...register("additional_info.extracurriculars")}
                      placeholder="e.g. Captained university football team"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-text uppercase">Leadership Experience</label>
                    <input
                      type="text"
                      {...register("additional_info.leadership")}
                      placeholder="e.g. Organized national level student hackathon"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-text uppercase">Volunteer & Social Work</label>
                    <input
                      type="text"
                      {...register("additional_info.volunteer_work")}
                      placeholder="e.g. Taught math to underprivileged kids"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-text uppercase">Awards & Honors</label>
                    <input
                      type="text"
                      {...register("additional_info.awards")}
                      placeholder="e.g. Best Student Project Award 2024"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-text uppercase">Personal Challenges Overcome (Optional)</label>
                  <textarea
                    {...register("additional_info.challenges")}
                    placeholder="e.g. Balanced studies while managing family business during financial constraints"
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium h-16 resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-text uppercase">Extra Notes for the AI Writer</label>
                  <textarea
                    {...register("additional_info.notes")}
                    placeholder="e.g. Emphasize my transition from mechanical engineering to computer science"
                    className="bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium h-16 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Stepper Wizard Actions */}
            <div className="flex items-center justify-between border-t border-border pt-8 mt-10">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={step === 1}
                className="rounded-full px-6 text-muted-foreground disabled:opacity-30 flex items-center gap-1.5 cursor-pointer text-sm font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>

              {step < totalSteps ? (
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
                  <span>Draft SOP Now</span>
                </Button>
              )}
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}

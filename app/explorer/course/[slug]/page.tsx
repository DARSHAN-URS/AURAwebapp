"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen, GraduationCap, MapPin, DollarSign, Clock, Briefcase,
  Award, CheckCircle, ArrowRight, ChevronRight, Loader2, Sparkles,
  Users, BarChart2, Calendar, Globe2, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!user || !slug) return;
    fetch(`${API}/api/explorer/course/${slug}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug, user]);

  const handleApply = async () => {
    if (!data || applying) return;
    setApplying(true);
    const res = await fetch(`${API}/api/explorer/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ university_id: data.university_id, course_id: data.id }),
    });
    setApplied(true);
    setApplying(false);
    setTimeout(() => router.push("/dashboard?tab=journey"), 1500);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <BookOpen className="w-12 h-12 text-muted-foreground opacity-40" />
        <h2 className="text-xl font-bold">Course not found</h2>
        <Link href="/explorer/search?type=courses"><Button variant="outline">Back to Courses</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-900 via-indigo-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-600/20" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        <div className="relative z-10 container mx-auto px-4 py-12">
          <nav className="flex items-center gap-2 text-xs text-white/60 mb-4">
            <Link href="/explorer" className="hover:text-white">Explorer</Link>
            <ChevronRight className="w-3 h-3" />
            {data.university_slug && (
              <>
                <Link href={`/explorer/university/${data.university_slug}`} className="hover:text-white">{data.university_name}</Link>
                <ChevronRight className="w-3 h-3" />
              </>
            )}
            <span className="text-white/40 truncate">{data.name}</span>
          </nav>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-violet-500/80 text-white text-xs font-bold px-3 py-0.5 rounded-full">{data.degree}</span>
                <span className="bg-white/10 text-white text-xs px-3 py-0.5 rounded-full">{data.field}</span>
                {data.mode && <span className="bg-white/10 text-white text-xs px-3 py-0.5 rounded-full">{data.mode}</span>}
                {data.scholarship_available && <span className="bg-emerald-500/80 text-white text-xs font-bold px-3 py-0.5 rounded-full">Scholarship Available</span>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">{data.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-white/70 text-sm">
                {data.university_name && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {data.university_name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {data.country}
                </span>
                {data.duration_display && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {data.duration_display}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {data.description && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-3">About This Course</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{data.description}</p>
              </div>
            )}

            {/* Curriculum highlights */}
            {data.curriculum_highlights?.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-4">Curriculum Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.curriculum_highlights.map((item: string) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4">Admission Requirements</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "IELTS", value: data.ielts_requirement ? `${data.ielts_requirement}` : "—" },
                  { label: "TOEFL", value: data.toefl_requirement ? `${data.toefl_requirement}` : "—" },
                  { label: "PTE", value: data.pte_requirement ? `${data.pte_requirement}` : "—" },
                  { label: "GRE", value: data.gre_requirement ? `${data.gre_requirement}` : "—" },
                  { label: "GMAT", value: data.gmat_requirement ? `${data.gmat_requirement}` : "—" },
                  { label: "Min. GPA", value: data.min_gpa ? `${data.min_gpa}/4.0` : "—" },
                  { label: "Work Exp.", value: data.work_experience_years ? `${data.work_experience_years}+ years` : "Not required" },
                  { label: "Duration", value: data.duration_display || "—" },
                  { label: "Mode", value: data.mode || "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/50 rounded-xl p-3 text-center">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
                    <div className="font-bold text-sm">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Outcomes */}
            {data.career_outcomes?.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-4">Career Outcomes</h2>
                <div className="flex flex-wrap gap-2">
                  {data.career_outcomes.map((outcome: string) => (
                    <span key={outcome} className="flex items-center gap-1.5 text-sm bg-primary/8 text-primary font-semibold px-3 py-1.5 rounded-full border border-primary/20">
                      <Briefcase className="w-3.5 h-3.5" />{outcome}
                    </span>
                  ))}
                </div>
                {data.salary_estimate_display && (
                  <div className="mt-4 flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                    <BarChart2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Average Graduate Salary</div>
                      <div className="font-black text-emerald-500 text-lg">{data.salary_estimate_display}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Apply CTA */}
            <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-2xl p-5">
              <div className="text-center mb-4">
                <div className="text-2xl font-black text-foreground">{data.tuition_display || "Contact University"}</div>
                <div className="text-xs text-muted-foreground mt-1">Annual Tuition Fee</div>
              </div>
              {data.application_deadline && (
                <div className="flex items-center gap-2 text-sm text-amber-500 font-semibold bg-amber-500/10 rounded-xl px-3 py-2 mb-4">
                  <Calendar className="w-4 h-4 shrink-0" />
                  Deadline: {data.application_deadline}
                </div>
              )}
              <Button onClick={handleApply} disabled={applying || applied} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl mb-2">
                {applied ? "Application Created ✓" : applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Apply Now <ArrowRight className="w-4 h-4 ml-1" /></>}
              </Button>
              {data.university_slug && (
                <Link href={`/explorer/university/${data.university_slug}`} className="block text-center text-xs text-primary hover:underline mt-2">
                  View University Profile →
                </Link>
              )}
            </div>

            {/* Key info */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-sm">Quick Facts</h3>
              {[
                { icon: Clock, label: "Duration", value: data.duration_display },
                { icon: Globe2, label: "Country", value: data.country },
                { icon: Users, label: "Mode", value: data.mode },
                { icon: Award, label: "Scholarship", value: data.scholarship_available ? data.scholarship_amount || "Available" : "None" },
                { icon: Briefcase, label: "Employment", value: data.employment_rate ? `${data.employment_rate}%` : null },
              ].filter((item) => item.value).map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
                    <div className="text-sm font-semibold">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Intake months */}
            {data.intake_months?.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="font-semibold text-sm mb-2">Available Intakes</h3>
                <div className="flex flex-wrap gap-2">
                  {data.intake_months.map((m: string) => (
                    <span key={m} className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20">{m}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Other reqs */}
            {data.other_requirements?.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="font-semibold text-sm mb-3">Additional Requirements</h3>
                <div className="space-y-2">
                  {data.other_requirements.map((req: string) => (
                    <div key={req} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {req}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Prompt */}
            <div className="bg-gradient-to-br from-indigo-500/5 to-violet-500/5 border border-indigo-500/20 rounded-2xl p-4 text-center">
              <Sparkles className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
              <h3 className="font-bold text-sm mb-1">Ask Aura AI</h3>
              <p className="text-xs text-muted-foreground mb-3">Get personalized guidance on this course, admission strategy, and scholarships.</p>
              <Link href="/ai-tools">
                <Button size="sm" variant="outline" className="border-indigo-500/30 text-indigo-500 hover:bg-indigo-500/10 rounded-xl w-full">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Open Aura AI
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

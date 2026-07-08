"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  GraduationCap, MapPin, DollarSign, Globe2, Award, Star, Bookmark,
  BookOpen, Briefcase, Clock, Users, ExternalLink, CheckCircle, ChevronRight,
  Sparkles, ArrowRight, Shield, TrendingUp, Share2, GitCompare, Loader2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const VISA_BADGE: Record<string, string> = {
  Easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Hard: "bg-red-500/10 text-red-500",
};

const TABS = ["Overview", "Programs", "Admissions", "Scholarships", "Reviews", "Location"] as const;
type Tab = (typeof TABS)[number];

export default function UniversityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("Overview");
  const [bookmarked, setBookmarked] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewPros, setReviewPros] = useState("");
  const [reviewCons, setReviewCons] = useState("");

  useEffect(() => {
    if (!user || !slug) return;
    fetch(`${API}/api/explorer/university/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setBookmarked(d.is_bookmarked || false);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, user]);

  const handleBookmark = async () => {
    if (!data) return;
    const newState = !bookmarked;
    setBookmarked(newState);
    await fetch(`${API}/api/explorer/bookmark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "university", item_id: data.id }),
    });
  };

  const handleAISummary = async () => {
    if (!data) return;
    setAiLoading(true);
    const res = await fetch(`${API}/api/explorer/ai-summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        university_name: data.name,
        country: data.country,
        course: data.popular_courses?.[0] || "General",
        student_profile: {}
      }),
    });
    const result = await res.json();
    setAiSummary(result.summary);
    setAiLoading(false);
  };

  const handleApply = async () => {
    if (!data || applying) return;
    setApplying(true);
    const res = await fetch(`${API}/api/explorer/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ university_id: data.id, intake: "Fall 2026" }),
    });
    const result = await res.json();
    setApplied(true);
    setApplying(false);
    setTimeout(() => router.push("/dashboard?tab=journey"), 1500);
  };

  const handleReviewSubmit = async () => {
    if (!data) return;
    await fetch(`${API}/api/explorer/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        university_id: data.id,
        rating: reviewRating,
        review_text: reviewText,
        pros: reviewPros.split(",").map((s) => s.trim()).filter(Boolean),
        cons: reviewCons.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    });
    setReviewModal(false);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <GraduationCap className="w-12 h-12 text-muted-foreground opacity-40" />
        <h2 className="text-xl font-bold">University not found</h2>
        <Link href="/explorer"><Button variant="outline">Back to Explorer</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-violet-600/20" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-6">
          <div className="flex items-end gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {data.qs_ranking && (
                  <span className="bg-yellow-500/90 text-black text-xs font-black px-2 py-0.5 rounded-full">QS #{data.qs_ranking}</span>
                )}
                {data.scholarship_available && (
                  <span className="bg-emerald-500/80 text-white text-xs font-bold px-2 py-0.5 rounded-full">Scholarships Available</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg">{data.name}</h1>
              <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
                <MapPin className="w-3.5 h-3.5" />
                {data.city}, {data.country}
                {data.university_type && <span className="text-white/50">· {data.university_type}</span>}
                {data.founded_year && <span className="text-white/50">· Est. {data.founded_year}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="sticky top-16 z-30 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={handleBookmark}
              className={`p-2 rounded-lg border transition-colors ${bookmarked ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
              <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-primary" : ""}`} />
            </button>
            <Link href={`/explorer/compare?slugs=${slug}`}>
              <button className="p-2 rounded-lg border border-border text-muted-foreground hover:border-primary/50 transition-colors">
                <GitCompare className="w-4 h-4" />
              </button>
            </Link>
            {data.website && (
              <a href={data.website} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border text-muted-foreground hover:border-primary/50 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <Button onClick={handleApply} disabled={applying || applied}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl h-9 text-xs px-4">
              {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : applied ? <><CheckCircle className="w-4 h-4 mr-1" />Applied!</> : <>Apply Now <ArrowRight className="w-3.5 h-3.5 ml-1" /></>}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* ── OVERVIEW TAB ── */}
            {tab === "Overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {/* About */}
                {data.description && (
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="font-bold text-lg mb-3">About {data.name}</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">{data.description}</p>
                    {data.highlights && data.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {data.highlights.map((h: string) => (
                          <span key={h} className="flex items-center gap-1 text-xs bg-primary/8 text-primary font-semibold px-3 py-1 rounded-full border border-primary/20">
                            <Star className="w-3 h-3" />{h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* AI Insight Card */}
                <div className="bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-purple-500/5 border border-indigo-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">Aura AI Analysis</h3>
                      <p className="text-xs text-muted-foreground">Personalized admission & career insights</p>
                    </div>
                    {!aiSummary && (
                      <Button onClick={handleAISummary} disabled={aiLoading} size="sm" variant="outline" className="ml-auto text-xs rounded-xl border-indigo-500/30 text-indigo-500 hover:bg-indigo-500/10">
                        {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Sparkles className="w-3.5 h-3.5 mr-1" />Analyze</>}
                      </Button>
                    )}
                  </div>
                  {aiSummary ? (
                    <p className="text-sm text-foreground leading-relaxed">{aiSummary}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Click "Analyze" to get a personalized assessment of your chances at {data.name} based on your profile.</p>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Acceptance Rate", value: data.acceptance_rate ? `${data.acceptance_rate}%` : "N/A", icon: Users, color: "text-blue-500" },
                    { label: "Employment Rate", value: data.employment_rate ? `${data.employment_rate}%` : "N/A", icon: Briefcase, color: "text-emerald-500" },
                    { label: "Total Programs", value: data.total_programs ? `${data.total_programs}+` : "N/A", icon: BookOpen, color: "text-violet-500" },
                    { label: "Student Population", value: data.student_population ? `${(data.student_population / 1000).toFixed(0)}K+` : "N/A", icon: GraduationCap, color: "text-amber-500" },
                  ].map((s) => (
                    <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
                      <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
                      <div className="font-bold text-lg">{s.value}</div>
                      <div className="text-[10px] text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Top Employers */}
                {data.top_employers?.length > 0 && (
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      Top Hiring Companies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.top_employers.map((e: string) => (
                        <span key={e} className="text-xs bg-muted rounded-lg px-3 py-1.5 font-medium border border-border">{e}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── PROGRAMS TAB ── */}
            {tab === "Programs" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="font-bold text-lg">Available Programs</h2>
                {data.courses?.length > 0 ? data.courses.map((c: any) => (
                  <Link key={c.id} href={`/explorer/course/${c.slug}`}
                    className="group flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer block">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground">{c.degree}</div>
                          <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{c.name}</h3>
                        </div>
                        {c.is_featured && <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full shrink-0">Featured</span>}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {c.tuition_display && <span className="text-xs font-semibold text-foreground">{c.tuition_display}</span>}
                        {c.ielts_requirement && <span className="text-xs text-muted-foreground">IELTS {c.ielts_requirement}+</span>}
                        {c.scholarship_available && <span className="text-xs text-emerald-500 font-medium">Scholarship Available</span>}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                  </Link>
                )) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>No courses listed yet. Visit the university website for full program catalog.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── ADMISSIONS TAB ── */}
            {tab === "Admissions" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="font-bold text-lg">Admission Requirements</h2>
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Requirement</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { label: "IELTS (min.)", value: data.ielts_requirement ? `${data.ielts_requirement}` : "Not specified" },
                        { label: "TOEFL (min.)", value: data.toefl_requirement ? `${data.toefl_requirement}` : "Not specified" },
                        { label: "PTE (min.)", value: data.pte_requirement ? `${data.pte_requirement}` : "Not specified" },
                        { label: "GRE (min.)", value: data.gre_requirement ? `${data.gre_requirement}` : "Not required" },
                        { label: "GMAT (min.)", value: data.gmat_requirement ? `${data.gmat_requirement}` : "Not required" },
                        { label: "Min. GPA", value: data.min_gpa ? `${data.min_gpa} / 4.0` : "Not specified" },
                        { label: "Acceptance Rate", value: data.acceptance_rate ? `${data.acceptance_rate}%` : "N/A" },
                        { label: "Application Fee", value: data.application_fee ? `${data.tuition_currency} ${data.application_fee}` : "Free" },
                      ].map(({ label, value }) => (
                        <tr key={label} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium">{label}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground text-right">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {data.intake_months?.length > 0 && (
                  <div className="bg-card border border-border rounded-2xl p-4">
                    <h3 className="font-semibold text-sm mb-3">Intake Months</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.intake_months.map((m: string) => (
                        <span key={m} className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20">{m}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── SCHOLARSHIPS TAB ── */}
            {tab === "Scholarships" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="font-bold text-lg">Scholarships & Funding</h2>
                {data.scholarship_details?.length > 0 ? data.scholarship_details.map((s: any, i: number) => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{s.name}</h3>
                        <div className="text-lg font-black text-emerald-500 mt-1">{s.amount}</div>
                        <div className="text-xs text-muted-foreground mt-1">{s.type} · {data.name}</div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Award className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>Contact the university directly for scholarship information.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── REVIEWS TAB ── */}
            {tab === "Reviews" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-lg">Student Reviews</h2>
                    {data.average_rating > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">{[1,2,3,4,5].map((n) => <Star key={n} className={`w-4 h-4 ${n <= Math.round(data.average_rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />)}</div>
                        <span className="font-bold">{data.average_rating}</span>
                        <span className="text-muted-foreground text-sm">({data.total_reviews} reviews)</span>
                      </div>
                    )}
                  </div>
                  <Button onClick={() => setReviewModal(true)} size="sm" variant="outline" className="rounded-xl">Write a Review</Button>
                </div>

                {data.reviews?.length > 0 ? data.reviews.map((r: any) => (
                  <div key={r.id} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">{[1,2,3,4,5].map((n) => <Star key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />)}</div>
                      {r.program_studied && <span className="text-xs text-muted-foreground ml-2">{r.program_studied}</span>}
                    </div>
                    {r.review_text && <p className="text-sm text-muted-foreground">{r.review_text}</p>}
                    {r.pros?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {r.pros.map((p: string) => <span key={p} className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full px-2 py-0.5">✓ {p}</span>)}
                      </div>
                    )}
                    {r.cons?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {r.cons.map((c: string) => <span key={c} className="text-xs bg-red-500/10 text-red-500 rounded-full px-2 py-0.5">✗ {c}</span>)}
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>No reviews yet. Be the first to share your experience!</p>
                    <Button onClick={() => setReviewModal(true)} className="mt-4" size="sm">Write a Review</Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── LOCATION TAB ── */}
            {tab === "Location" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="font-bold text-lg">Location & Campus</h2>
                {data.address && (
                  <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">{data.address}</div>
                      <div className="text-xs text-muted-foreground">{data.campus_type} Campus · {data.city}, {data.country}</div>
                    </div>
                  </div>
                )}
                {data.accommodation_available && (
                  <div className="bg-card border border-border rounded-2xl p-4">
                    <h3 className="font-semibold text-sm mb-2">Student Accommodation</h3>
                    <p className="text-sm text-muted-foreground">On-campus accommodation available.</p>
                    {data.accommodation_cost_display && (
                      <p className="text-sm font-semibold text-foreground mt-1">{data.accommodation_cost_display}</p>
                    )}
                  </div>
                )}
                {data.latitude && data.longitude && (
                  <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <iframe
                      title="Campus Map"
                      className="w-full h-80"
                      loading="lazy"
                      src={`https://maps.google.com/maps?q=${data.latitude},${data.longitude}&z=14&output=embed`}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Key Info Card */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm">Quick Info</h3>
              <div className="space-y-3">
                {[
                  { icon: DollarSign, label: "Tuition", value: data.tuition_display, color: "text-primary" },
                  { icon: Globe2, label: "Living Cost", value: data.living_cost_display, color: "text-blue-500" },
                  { icon: Shield, label: "Visa Difficulty", value: data.visa_difficulty, color: "text-amber-500" },
                  { icon: Star, label: "QS Ranking", value: data.qs_ranking ? `#${data.qs_ranking}` : "N/A", color: "text-yellow-500" },
                  { icon: TrendingUp, label: "THE Ranking", value: data.the_ranking ? `#${data.the_ranking}` : "N/A", color: "text-violet-500" },
                  { icon: Briefcase, label: "Post-Study Salary", value: data.average_salary_post_study, color: "text-emerald-500" },
                ].map(({ icon: Icon, label, value, color }) => value && (
                  <div key={label} className="flex items-start gap-2.5">
                    <Icon className={`w-4 h-4 ${color} shrink-0 mt-0.5`} />
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
                      <div className="text-sm font-semibold">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
              {data.website && (
                <a href={data.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-primary hover:underline mt-2">
                  <ExternalLink className="w-3.5 h-3.5" /> Official Website
                </a>
              )}
            </div>

            {/* Apply CTA */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-5 text-center">
              <GraduationCap className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
              <h3 className="font-bold text-sm mb-1">Start Your Application</h3>
              <p className="text-xs text-muted-foreground mb-4">Let Aura guide you through the entire application process</p>
              <Button onClick={handleApply} disabled={applying || applied} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl">
                {applied ? "Application Created ✓" : applying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply Now"}
              </Button>
            </div>

            {/* Related links */}
            <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
              <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">Explore More</h3>
              {[
                { label: "Compare Universities", href: `/explorer/compare?slugs=${slug}`, icon: GitCompare },
                { label: "Browse All Courses", href: "/explorer/search?type=courses", icon: BookOpen },
                { label: "Use AI Matcher", href: "/universities", icon: Sparkles },
              ].map(({ label, href, icon: Icon }) => (
                <Link key={label} href={href}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg px-3 py-2 transition-colors">
                  <Icon className="w-4 h-4 text-primary" />
                  {label}
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">Write a Review</h3>
              <button onClick={() => setReviewModal(false)} className="p-1 rounded-lg hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((n) => (
                    <button key={n} onClick={() => setReviewRating(n)}>
                      <Star className={`w-7 h-7 transition-colors ${n <= reviewRating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">Your Review</label>
                <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={3}
                  className="w-full text-sm bg-background border border-border rounded-xl px-3 py-2 outline-none focus:border-primary resize-none" placeholder="Share your experience..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">Pros (comma-separated)</label>
                <input type="text" value={reviewPros} onChange={(e) => setReviewPros(e.target.value)}
                  className="w-full text-sm bg-background border border-border rounded-xl px-3 py-2 outline-none focus:border-primary" placeholder="Great campus, Strong alumni..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">Cons (comma-separated)</label>
                <input type="text" value={reviewCons} onChange={(e) => setReviewCons(e.target.value)}
                  className="w-full text-sm bg-background border border-border rounded-xl px-3 py-2 outline-none focus:border-primary" placeholder="Expensive housing, Cold weather..." />
              </div>
              <Button onClick={handleReviewSubmit} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl">Submit Review</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

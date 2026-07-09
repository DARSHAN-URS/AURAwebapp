"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe2, DollarSign, Briefcase, Shield, Clock, MapPin, ChevronRight,
  GraduationCap, BookOpen, Users, Award, CheckCircle, ArrowRight,
  Loader2, Sparkles, Home, Utensils, Bus, CreditCard, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const VISA_COLORS: Record<string, { bg: string; text: string }> = {
  Easy: { bg: "bg-emerald-500/10", text: "text-emerald-500" },
  Medium: { bg: "bg-amber-500/10", text: "text-amber-500" },
  Hard: { bg: "bg-red-500/10", text: "text-red-500" },
};

export default function CountryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!user || !slug) return;
    fetch(`${API}/api/explorer/country/${slug}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug, user]);

  const handleBookmark = async () => {
    setBookmarked(!bookmarked);
    await fetch(`${API}/api/explorer/bookmark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "country", item_id: slug }),
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Globe2 className="w-12 h-12 text-muted-foreground opacity-40" />
        <h2 className="text-xl font-bold">Country not found</h2>
        <Link href="/explorer"><Button variant="outline">Back to Explorer</Button></Link>
      </div>
    );
  }

  const visaColors = VISA_COLORS[data.visa_difficulty] || VISA_COLORS.Medium;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-8">
          <div className="text-6xl mb-2">{data.flag_emoji}</div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">{data.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${visaColors.bg} ${visaColors.text}`}>
              {data.visa_difficulty} Visa
            </span>
            {data.total_universities && (
              <span className="text-xs bg-card/10 text-white px-3 py-1 rounded-full">
                {data.total_universities}+ Universities
              </span>
            )}
            {data.official_language && (
              <span className="text-xs bg-card/10 text-white px-3 py-1 rounded-full">
                🗣 {data.official_language}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {data.description && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-3">Why Study in {data.name}?</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{data.description}</p>
              </div>
            )}

            {/* Living Costs */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Living Costs
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Home, label: "Rent/Month", value: data.avg_rent_display },
                  { icon: Utensils, label: "Food/Month", value: data.avg_food_display },
                  { icon: Bus, label: "Transport/Month", value: data.avg_transport_display },
                  { icon: CreditCard, label: "Total/Month", value: data.living_cost_monthly_display },
                ].map(({ icon: Icon, label, value }) => value && (
                  <div key={label} className="bg-muted/50 rounded-xl p-4 text-center">
                    <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
                    <div className="font-bold text-xs leading-tight">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visa Information */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Visa Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {[
                  { label: "Visa Type", value: data.student_visa_name },
                  { label: "Processing Time", value: data.visa_processing_time },
                  { label: "Application Fee", value: data.visa_fee_display },
                  { label: "Difficulty", value: data.visa_difficulty },
                ].map(({ label, value }) => value && (
                  <div key={label} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">{label}</div>
                      <div className="font-semibold text-sm">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
              {data.visa_requirements_summary?.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Required Documents</div>
                  <div className="space-y-1.5">
                    {data.visa_requirements_summary.map((req: string) => (
                      <div key={req} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        {req}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Work Rights */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Work Rights & Employment
              </h2>
              <div className="space-y-3">
                {data.work_rights_during_study && (
                  <div className="flex items-start gap-3 bg-primary/5 border border-blue-500/20 rounded-xl p-3">
                    <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-primary">During Study</div>
                      <div className="text-sm">{data.work_rights_during_study}</div>
                    </div>
                  </div>
                )}
                {data.post_study_work_visa && (
                  <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
                    <Award className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-emerald-500">Post-Study Work</div>
                      <div className="text-sm font-medium">{data.post_study_work_visa}</div>
                      {data.post_study_work_duration && (
                        <div className="text-xs text-muted-foreground">{data.post_study_work_duration}</div>
                      )}
                    </div>
                  </div>
                )}
                {data.average_salary_display && (
                  <div className="flex items-start gap-3 bg-violet-500/5 border border-violet-500/20 rounded-xl p-3">
                    <DollarSign className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-violet-500">Average Graduate Salary</div>
                      <div className="text-sm font-bold">{data.average_salary_display}</div>
                    </div>
                  </div>
                )}
              </div>
              {data.top_industries?.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Top Industries</div>
                  <div className="flex flex-wrap gap-2">
                    {data.top_industries.map((ind: string) => (
                      <span key={ind} className="text-xs bg-muted rounded-lg px-3 py-1 font-medium border border-border">{ind}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Scholarships */}
            {data.government_scholarships?.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Government Scholarships
                </h2>
                <div className="space-y-3">
                  {data.government_scholarships.map((s: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                      <Award className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-sm">{s.name}</div>
                        <div className="text-emerald-500 font-black">{s.amount}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{s.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Universities */}
            {data.top_universities?.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg">Top Universities in {data.name}</h2>
                  <Link href={`/explorer/search?country=${encodeURIComponent(data.name)}`}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {data.top_universities.map((uni: any) => (
                    <Link key={uni.id} href={`/explorer/university/${uni.slug}`}
                      className="group flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer block">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm group-hover:text-primary transition-colors">{uni.name}</div>
                        <div className="text-xs text-muted-foreground">{uni.city}</div>
                      </div>
                      {uni.qs_ranking && (
                        <span className="text-xs bg-yellow-500/10 text-yellow-600 font-bold px-2 py-0.5 rounded-full shrink-0">QS #{uni.qs_ranking}</span>
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Quick Facts */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-4">Country Overview</h3>
              <div className="space-y-3">
                {[
                  { icon: Globe2, label: "Language", value: data.official_language },
                  { icon: CreditCard, label: "Currency", value: data.currency },
                  { icon: Users, label: "Universities", value: data.total_universities ? `${data.total_universities}+` : null },
                  { icon: Clock, label: "Post-Study Work", value: data.post_study_work_duration },
                  { icon: Shield, label: "Visa", value: data.student_visa_name },
                  { icon: MapPin, label: "Climate", value: data.climate?.split(";")[0] },
                ].filter((i) => i.value).map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
                      <div className="text-sm font-semibold">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Courses */}
            {data.popular_courses?.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold text-sm mb-3">Popular Courses</h3>
                <div className="flex flex-wrap gap-2">
                  {data.popular_courses.map((c: string) => (
                    <Link key={c} href={`/explorer/search?q=${encodeURIComponent(c)}&country=${encodeURIComponent(data.name)}`}
                      className="text-xs bg-muted hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/20 text-muted-foreground rounded-full px-3 py-1.5 transition-colors font-medium">
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* AI Summary */}
            {data.ai_summary && (
              <div className="bg-gradient-to-br from-indigo-500/5 to-violet-500/5 border border-indigo-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <h3 className="font-bold text-sm">Aura AI Summary</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{data.ai_summary}</p>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-5 text-center">
              <GraduationCap className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
              <h3 className="font-bold text-sm mb-2">Find Universities in {data.name}</h3>
              <Link href={`/explorer/search?country=${encodeURIComponent(data.name)}`}>
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Universities
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ← Must import Search for the CTA button
function Search({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

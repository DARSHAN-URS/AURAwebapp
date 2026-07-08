"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitCompare, Plus, X, GraduationCap, Star, MapPin, DollarSign,
  Award, Briefcase, Clock, Shield, Users, BookOpen, Loader2, ChevronRight,
  CheckCircle, XCircle, Minus, ArrowLeft, Sparkles, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface CompareUni {
  id: string; slug: string; name: string; country: string; city: string;
  qs_ranking: number | null; the_ranking: number | null;
  acceptance_rate: number | null; tuition_min: number | null;
  tuition_display: string | null; living_cost_display: string | null;
  scholarship_available: boolean; scholarship_details: any[];
  employment_rate: number | null; average_salary_post_study: string | null;
  visa_difficulty: string; highlights: string[]; intake_months: string[];
  total_programs: number | null; logo_url: string | null; hero_image_url: string | null;
  website: string | null;
}

type RowKey = keyof CompareUni | "qs_ranking" | "the_ranking" | "acceptance_rate" | "tuition_display" | "living_cost_display" | "scholarship_available" | "employment_rate" | "visa_difficulty" | "total_programs";

const COMPARE_ROWS: { key: RowKey; label: string; format?: (v: any) => string; best?: "min" | "max" | "none" }[] = [
  { key: "qs_ranking", label: "QS World Ranking", format: (v) => v ? `#${v}` : "N/A", best: "min" },
  { key: "the_ranking", label: "THE Ranking", format: (v) => v ? `#${v}` : "N/A", best: "min" },
  { key: "acceptance_rate", label: "Acceptance Rate", format: (v) => v != null ? `${v}%` : "N/A", best: "none" },
  { key: "tuition_display", label: "Annual Tuition", best: "none" },
  { key: "living_cost_display", label: "Living Cost / Year", best: "none" },
  { key: "scholarship_available", label: "Scholarship Available", format: (v) => v ? "✓ Yes" : "✗ No", best: "none" },
  { key: "employment_rate", label: "Employment Rate", format: (v) => v != null ? `${v}%` : "N/A", best: "max" },
  { key: "average_salary_post_study", label: "Post-Study Salary", best: "none" },
  { key: "visa_difficulty", label: "Visa Difficulty", best: "none" },
  { key: "total_programs", label: "Total Programs", format: (v) => v ? `${v}+` : "N/A", best: "max" },
];

const VISA_COLOR: Record<string, string> = {
  Easy: "text-emerald-500",
  Medium: "text-amber-500",
  Hard: "text-red-500",
};

function CompareContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSlugs = searchParams.get("slugs")?.split(",").filter(Boolean) || [];
  const [slugs, setSlugs] = useState<string[]>(initialSlugs.slice(0, 5));
  const [universities, setUniversities] = useState<CompareUni[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (slugs.length === 0) { setUniversities([]); return; }
    setLoading(true);
    fetch(`${API}/api/explorer/compare?slugs=${slugs.join(",")}`)
      .then((r) => r.json())
      .then((data) => { setUniversities(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slugs, user]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(() => {
      setSearchLoading(true);
      fetch(`${API}/api/explorer/search?q=${encodeURIComponent(searchQuery)}&limit=6`)
        .then((r) => r.json())
        .then((data) => { setSearchResults(data.universities || []); setSearchLoading(false); })
        .catch(() => setSearchLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, user]);

  const addUniversity = (slug: string) => {
    if (!slugs.includes(slug) && slugs.length < 5) {
      setSlugs([...slugs, slug]);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const removeUniversity = (slug: string) => {
    setSlugs(slugs.filter((s) => s !== slug));
    setUniversities(universities.filter((u) => u.slug !== slug));
  };

  // Find best value for numeric rows
  const getBestValue = (row: typeof COMPARE_ROWS[0]) => {
    if (row.best === "none" || universities.length < 2) return null;
    const values = universities.map((u) => u[row.key as keyof CompareUni] as number).filter((v) => v != null && !isNaN(v));
    if (values.length === 0) return null;
    return row.best === "min" ? Math.min(...values) : Math.max(...values);
  };

  const isBest = (row: typeof COMPARE_ROWS[0], uni: CompareUni) => {
    const best = getBestValue(row);
    if (best == null) return false;
    return (uni[row.key as keyof CompareUni] as number) === best;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-bold text-lg flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-primary" />
                University Comparison
              </h1>
              <p className="text-xs text-muted-foreground">Side-by-side comparison of up to 5 universities</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Add University Search */}
        {slugs.length < 5 && (
          <div className="mb-8 bg-card border border-dashed border-border rounded-2xl p-6">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              Add a University ({slugs.length}/5)
            </h3>
            <div className="relative max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a university..."
                className="w-full pl-4 pr-10 py-2.5 text-sm bg-background border border-border rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
              {searchLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />}

              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-20">
                  {searchResults.map((u) => (
                    <button key={u.id} onClick={() => addUniversity(u.slug)} disabled={slugs.includes(u.slug)}
                      className={`w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors ${slugs.includes(u.slug) ? "opacity-40 cursor-not-allowed" : ""}`}>
                      <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <div className="text-sm font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.country}{u.qs_ranking ? ` · QS #${u.qs_ranking}` : ""}</div>
                      </div>
                      {slugs.includes(u.slug) && <span className="ml-auto text-xs text-muted-foreground">Added</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {slugs.length === 0 && (
          <div className="text-center py-24">
            <GitCompare className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h2 className="font-bold text-xl mb-2">No Universities Added</h2>
            <p className="text-muted-foreground text-sm mb-6">Search for universities above or browse the Explorer to find ones to compare.</p>
            <Link href="/explorer/search"><Button variant="outline">Browse Universities</Button></Link>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* Comparison Table */}
        {!loading && universities.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[640px]">
              {/* University Headers */}
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 w-44 bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Criteria
                  </th>
                  {universities.map((uni) => (
                    <th key={uni.id} className="px-4 py-4 text-center align-top min-w-[180px]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-indigo-500" />
                          <button onClick={() => removeUniversity(uni.slug)}
                            className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-background border border-border rounded-full flex items-center justify-center hover:bg-muted">
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <Link href={`/explorer/university/${uni.slug}`}
                          className="font-bold text-xs text-center hover:text-primary transition-colors leading-tight">
                          {uni.name}
                        </Link>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" />{uni.city}, {uni.country}
                        </div>
                        {uni.qs_ranking && (
                          <span className="bg-yellow-500/10 text-yellow-600 text-[10px] font-black px-2 py-0.5 rounded-full">QS #{uni.qs_ranking}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Comparison Rows */}
              <tbody>
                {COMPARE_ROWS.map((row, ri) => (
                  <tr key={row.key} className={`border-b border-border ${ri % 2 === 0 ? "bg-muted/10" : ""}`}>
                    <td className="px-4 py-3 text-xs font-semibold text-muted-foreground whitespace-nowrap">{row.label}</td>
                    {universities.map((uni) => {
                      const rawValue = uni[row.key as keyof CompareUni];
                      const displayValue = row.format ? row.format(rawValue) : (rawValue as string ?? "N/A");
                      const best = isBest(row, uni);

                      return (
                        <td key={uni.id} className={`px-4 py-3 text-center text-sm ${best ? "font-bold text-emerald-500 bg-emerald-500/5" : "text-muted-foreground"}`}>
                          {row.key === "visa_difficulty" ? (
                            <span className={`font-semibold ${VISA_COLOR[rawValue as string] || ""}`}>{rawValue as string || "N/A"}</span>
                          ) : row.key === "scholarship_available" ? (
                            rawValue ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" /> : <Minus className="w-4 h-4 text-muted-foreground mx-auto opacity-30" />
                          ) : (
                            <span>
                              {displayValue}
                              {best && <Star className="w-3 h-3 inline ml-1 text-emerald-500" />}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Highlights row */}
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-xs font-semibold text-muted-foreground">Highlights</td>
                  {universities.map((uni) => (
                    <td key={uni.id} className="px-4 py-3 text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {(uni.highlights || []).slice(0, 3).map((h: string) => (
                          <span key={h} className="text-[10px] bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">{h}</span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Action row */}
                <tr>
                  <td className="px-4 py-4 text-xs font-semibold text-muted-foreground">Apply</td>
                  {universities.map((uni) => (
                    <td key={uni.id} className="px-4 py-4 text-center">
                      <Link href={`/explorer/university/${uni.slug}`}>
                        <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl h-8 text-xs">
                          View & Apply <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                        </Button>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* AI Recommendation (if 2+ universities) */}
        {universities.length >= 2 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-6 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-purple-500/5 border border-indigo-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">Aura AI Comparison Tip</h3>
                <p className="text-xs text-muted-foreground">Based on your comparison</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You're comparing {universities.length} universities.
              {universities.some(u => u.qs_ranking && u.qs_ranking <= 50) && (
                <> <strong className="text-foreground">{universities.find(u => u.qs_ranking && u.qs_ranking <= 50)?.name}</strong> is ranked in the global top 50 — an excellent choice for research and international recognition.</>
              )}
              {universities.some(u => u.scholarship_available) && (
                <> Scholarship opportunities are available at {universities.filter(u => u.scholarship_available).map(u => u.name).join(" and ")} — be sure to apply early.</>
              )}
              {" "}Use the Aura AI chat to get a personalized recommendation based on your complete academic profile.
            </p>
            <Link href="/ai-tools" className="inline-flex items-center gap-2 mt-4 text-sm text-indigo-500 font-semibold hover:underline">
              <Sparkles className="w-4 h-4" />
              Chat with Aura AI
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <CompareContent />
    </React.Suspense>
  );
}

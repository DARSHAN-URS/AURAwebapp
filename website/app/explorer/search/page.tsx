"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search, Filter, X, GraduationCap, BookOpen, MapPin, DollarSign,
  Award, ChevronDown, ChevronUp, Loader2, SlidersHorizontal,
  Star, ArrowRight, Globe2, Briefcase, Clock, RefreshCcw, Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const COUNTRIES = ["Canada", "United Kingdom", "Australia", "United States", "Germany", "Ireland", "Singapore", "New Zealand", "Netherlands", "France"];
const DEGREES = ["Bachelor's", "Master's", "PhD", "Diploma", "Certificate"];
const FIELDS = ["Computer Science", "Engineering", "Business Administration", "Medicine", "Law", "Data Science", "Finance", "Architecture", "Pharmacy", "Nursing"];
const VISA_OPTS = ["Easy", "Medium", "Hard"];
const SORT_OPTIONS = [
  { value: "qs_ranking", label: "QS Ranking" },
  { value: "acceptance_rate", label: "Acceptance Rate" },
  { value: "tuition_min", label: "Tuition (Low-High)" },
  { value: "employment_rate", label: "Employment Rate" },
  { value: "name", label: "Name A-Z" },
];

type SearchType = "universities" | "courses";

interface UniResult {
  id: string; slug: string; name: string; country: string; city: string;
  qs_ranking: number | null; tuition_display: string | null; living_cost_display: string | null;
  acceptance_rate: number | null; employment_rate: number | null;
  scholarship_available: boolean; visa_difficulty: string; intake_months: string[];
  is_bookmarked: boolean; popular_courses: string[]; total_programs: number | null;
  logo_url: string | null; hero_image_url: string | null;
}

interface CourseResult {
  id: string; slug: string; name: string; university_name: string; country: string;
  degree: string; field: string; duration_display: string; tuition_display: string;
  ielts_requirement: number | null; scholarship_available: boolean;
  salary_estimate_display: string; employment_rate: number | null;
  intake_months: string[]; application_deadline: string | null;
}

const VISA_BADGE: Record<string, string> = {
  Easy: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  Medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  Hard: "bg-red-500/15 text-red-500",
};

function SearchContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchType, setSearchType] = useState<SearchType>("universities");
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [uniResults, setUniResults] = useState<UniResult[]>([]);
  const [courseResults, setCourseResults] = useState<CourseResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);

  // Filters
  const [country, setCountry] = useState(searchParams.get("country") || "");
  const [degree, setDegree] = useState("");
  const [field, setField] = useState("");
  const [ieltsMax, setIeltsMax] = useState<string>("8.0");
  const [tuitionMax, setTuitionMax] = useState<string>("");
  const [scholarshipOnly, setScholarshipOnly] = useState(false);
  const [visaDifficulty, setVisaDifficulty] = useState("");
  const [sortBy, setSortBy] = useState("qs_ranking");
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const buildQuery = useCallback((p = 1) => {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (country) params.set("country", country);
    if (ieltsMax !== "8.0") params.set("ielts_max", ieltsMax);
    if (tuitionMax) params.set("tuition_max", tuitionMax);
    if (scholarshipOnly) params.set("scholarship_only", "true");
    if (visaDifficulty) params.set("visa_difficulty", visaDifficulty);
    if (degree) params.set("degree", degree);
    if (field) params.set("field", field);
    params.set("sort_by", sortBy);
    params.set("sort_dir", "asc");
    params.set("page", p.toString());
    params.set("page_size", "12");
    return params.toString();
  }, [query, country, ieltsMax, tuitionMax, scholarshipOnly, visaDifficulty, degree, field, sortBy]);

  const fetchResults = useCallback(async (p = 1) => {
    if (!user) return;
    setLoading(true);
    try {
      const endpoint = searchType === "universities" ? "/api/explorer/universities" : "/api/explorer/courses";
      const res = await fetch(`${API}${endpoint}?${buildQuery(p)}`);
      const data = await res.json();
      if (searchType === "universities") {
        setUniResults(data.data || []);
      } else {
        setCourseResults(data.data || []);
      }
      setTotalCount(data.total || 0);
      setTotalPages(data.total_pages || 1);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, [user, searchType, buildQuery]);

  useEffect(() => {
    fetchResults(1);
  }, [fetchResults]);

  const handleBookmark = async (id: string) => {
    if (!user) return;
    const isBookmarked = bookmarkedIds.has(id);
    if (isBookmarked) {
      setBookmarkedIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    } else {
      setBookmarkedIds((prev) => new Set([...prev, id]));
      await fetch(`${API}/api/explorer/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "university", item_id: id }),
      });
    }
  };

  const clearFilters = () => {
    setCountry(""); setDegree(""); setField("");
    setIeltsMax("8.0"); setTuitionMax("");
    setScholarshipOnly(false); setVisaDifficulty("");
    setSortBy("qs_ranking");
  };

  const activeFiltersCount = [country, degree, field, scholarshipOnly, visaDifficulty, tuitionMax !== ""]
    .filter(Boolean).length;

  const FilterPanel = () => (
    <div className="space-y-5">
      {/* Country */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Country</label>
        <div className="space-y-1">
          {COUNTRIES.map((c) => (
            <button key={c} onClick={() => setCountry(country === c ? "" : c)}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${country === c ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-muted-foreground"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Degree (courses only) */}
      {searchType === "courses" && (
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Degree Level</label>
          <div className="flex flex-wrap gap-1.5">
            {DEGREES.map((d) => (
              <button key={d} onClick={() => setDegree(degree === d ? "" : d)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${degree === d ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50 text-muted-foreground"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Field */}
      {searchType === "courses" && (
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Field of Study</label>
          <select value={field} onChange={(e) => setField(e.target.value)}
            className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:border-primary">
            <option value="">All Fields</option>
            {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      )}

      {/* IELTS */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex justify-between">
          <span>Max IELTS Req.</span>
          <span className="text-primary">{ieltsMax}</span>
        </label>
        <input type="range" min="5.0" max="8.0" step="0.5" value={ieltsMax}
          onChange={(e) => setIeltsMax(e.target.value)}
          className="w-full accent-primary" />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>5.0</span><span>6.0</span><span>6.5</span><span>7.0</span><span>8.0</span>
        </div>
      </div>

      {/* Scholarship */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Funding</label>
        <button onClick={() => setScholarshipOnly(!scholarshipOnly)}
          className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border transition-colors w-full ${scholarshipOnly ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600" : "border-border hover:border-primary/50 text-muted-foreground"}`}>
          <Award className="w-4 h-4" />
          Scholarship Available
          {scholarshipOnly && <X className="w-3 h-3 ml-auto" />}
        </button>
      </div>

      {/* Visa Difficulty (universities only) */}
      {searchType === "universities" && (
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Visa Difficulty</label>
          <div className="flex gap-1.5">
            {VISA_OPTS.map((v) => (
              <button key={v} onClick={() => setVisaDifficulty(visaDifficulty === v ? "" : v)}
                className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${visaDifficulty === v ? "bg-primary/10 border-primary text-primary font-bold" : "border-border hover:border-primary/50 text-muted-foreground"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeFiltersCount > 0 && (
        <button onClick={clearFilters} className="w-full text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 py-2 border border-border rounded-lg hover:border-primary/50 transition-colors">
          <RefreshCcw className="w-3 h-3" />
          Clear All Filters ({activeFiltersCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search input */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchResults(1)}
                placeholder={searchType === "universities" ? "Search universities, cities, countries..." : "Search courses, fields, degrees..."}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-background border border-border rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" />
            </div>

            {/* Type toggle */}
            <div className="flex items-center bg-muted rounded-xl p-1 gap-1 shrink-0">
              <button onClick={() => setSearchType("universities")}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${searchType === "universities" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <GraduationCap className="w-4 h-4 inline mr-1" />Universities
              </button>
              <button onClick={() => setSearchType("courses")}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${searchType === "courses" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <BookOpen className="w-4 h-4 inline mr-1" />Courses
              </button>
            </div>

            {/* Sort */}
            <div className="relative shrink-0">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-background border border-border rounded-xl px-3 py-2.5 pr-8 outline-none focus:border-primary appearance-none cursor-pointer">
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Mobile filter toggle */}
            <button onClick={() => setMobileFilters(!mobileFilters)}
              className="sm:hidden flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:border-primary/50 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              Filters {activeFiltersCount > 0 && <span className="bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center">{activeFiltersCount}</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-36 bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm">Filters</h3>
                {activeFiltersCount > 0 && (
                  <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">{activeFiltersCount} active</span>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Mobile Filters */}
          {mobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/60" onClick={() => setMobileFilters(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-72 bg-card border-l border-border p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Filters</h3>
                  <button onClick={() => setMobileFilters(false)} className="p-1 rounded-lg hover:bg-muted">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterPanel />
                <Button onClick={() => setMobileFilters(false)} className="w-full mt-4">Apply Filters</Button>
              </div>
            </div>
          )}

          {/* Results */}
          <main className="flex-1 min-w-0">
            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground">
                {loading ? "Searching..." : (
                  <>
                    <span className="font-semibold text-foreground">{totalCount.toLocaleString()}</span>{" "}
                    {searchType === "universities" ? "universities" : "courses"} found
                    {query && <> for "<span className="text-primary">{query}</span>"</>}
                  </>
                )}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />)}
              </div>
            ) : searchType === "universities" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {uniResults.map((uni, i) => (
                  <motion.div key={uni.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all">
                      {/* Hero */}
                      <div className="relative h-32 bg-gradient-to-br from-indigo-900 to-violet-900">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-violet-600/20" />
                        {uni.qs_ranking && (
                          <div className="absolute top-3 left-3 bg-yellow-500/90 text-black text-xs font-black px-2 py-0.5 rounded-full">QS #{uni.qs_ranking}</div>
                        )}
                        {uni.scholarship_available && (
                          <div className="absolute top-3 right-10 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Scholarship</div>
                        )}
                        <button onClick={() => handleBookmark(uni.id)}
                          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-colors ${(bookmarkedIds.has(uni.id) || uni.is_bookmarked) ? "bg-primary text-white" : "bg-black/30 text-white/70 hover:bg-black/50"}`}>
                          <Bookmark className={`w-3.5 h-3.5 ${(bookmarkedIds.has(uni.id) || uni.is_bookmarked) ? "fill-white" : ""}`} />
                        </button>
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <Link href={`/explorer/university/${uni.slug}`}>
                          <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 cursor-pointer">{uni.name}</h3>
                        </Link>
                        <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {uni.city}, {uni.country}
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {uni.acceptance_rate != null && (
                            <span className="text-[10px] bg-muted rounded-md px-2 py-0.5 text-muted-foreground font-medium">{uni.acceptance_rate}% Accept</span>
                          )}
                          {uni.employment_rate != null && (
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md px-2 py-0.5 font-medium">{uni.employment_rate}% Employed</span>
                          )}
                          {uni.visa_difficulty && (
                            <span className={`text-[10px] rounded-md px-2 py-0.5 font-medium ${VISA_BADGE[uni.visa_difficulty]}`}>{uni.visa_difficulty} Visa</span>
                          )}
                        </div>

                        <div className="mt-auto pt-3 flex items-center justify-between">
                          {uni.tuition_display && (
                            <div className="text-xs font-semibold text-foreground">{uni.tuition_display}</div>
                          )}
                          <Link href={`/explorer/university/${uni.slug}`}>
                            <Button size="sm" variant="outline" className="h-7 text-xs rounded-lg ml-auto">
                              View <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {courseResults.map((course, i) => (
                  <motion.div key={course.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="group flex flex-col bg-card border border-border rounded-2xl p-5 hover:shadow-xl hover:border-primary/30 transition-all">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5 text-violet-500" />
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">{course.degree} · {course.field}</div>
                          <h3 className="font-bold text-sm text-foreground line-clamp-2">{course.name}</h3>
                          <div className="text-xs text-muted-foreground mt-0.5">{course.university_name}</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {course.duration_display && (
                          <span className="text-[10px] bg-muted px-2 py-0.5 rounded-md text-muted-foreground flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />{course.duration_display}
                          </span>
                        )}
                        {course.ielts_requirement && (
                          <span className="text-[10px] bg-muted px-2 py-0.5 rounded-md text-muted-foreground">IELTS {course.ielts_requirement}</span>
                        )}
                        {course.scholarship_available && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md font-medium">Scholarship</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <div className="text-xs font-bold text-foreground">{course.tuition_display}</div>
                          {course.salary_estimate_display && (
                            <div className="text-[10px] text-emerald-500">{course.salary_estimate_display}</div>
                          )}
                        </div>
                        <Link href={`/explorer/course/${course.slug}`}>
                          <Button size="sm" variant="outline" className="h-7 text-xs rounded-lg">
                            View <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && (uniResults.length === 0 && courseResults.length === 0) && (
              <div className="text-center py-24">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                <h3 className="font-bold text-lg mb-2">No results found</h3>
                <p className="text-muted-foreground text-sm mb-6">Try adjusting your filters or using different keywords</p>
                <Button onClick={clearFilters} variant="outline">Clear All Filters</Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => fetchResults(page - 1)}>
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground px-4">
                  Page {page} of {totalPages}
                </span>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => fetchResults(page + 1)}>
                  Next
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ExplorerSearchPage() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <SearchContent />
    </React.Suspense>
  );
}

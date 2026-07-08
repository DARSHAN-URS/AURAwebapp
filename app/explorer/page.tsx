"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Globe2, GraduationCap, BookOpen, TrendingUp, Sparkles,
  Star, ArrowRight, ChevronRight, Award, MapPin, DollarSign,
  Clock, Users, Bookmark, Shield, Briefcase, X, Loader2, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FeaturedUniversity {
  id: string; slug: string; name: string; country: string; city: string;
  qs_ranking: number | null; hero_image_url: string | null; logo_url: string | null;
  tuition_display: string | null; scholarship_available: boolean;
  acceptance_rate: number | null; employment_rate: number | null;
}
interface FeaturedCountry {
  slug: string; name: string; flag_emoji: string; hero_image_url: string | null;
  living_cost_monthly_display: string; post_study_work_duration: string;
  visa_difficulty: string; total_universities: number;
}
interface TrendingCourse {
  id: string; slug: string; name: string; university_name: string;
  degree: string; field: string; tuition_display: string; salary_estimate_display: string;
}
interface SearchResult {
  universities: { id: string; slug: string; name: string; country: string; qs_ranking: number | null; type: string }[];
  courses: { id: string; slug: string; name: string; university_name: string; degree: string; type: string }[];
  countries: { slug: string; name: string; flag_emoji: string; type: string }[];
}

const COUNTRY_BG_MAP: Record<string, string> = {
  Canada: "from-red-900/80 to-red-700/60",
  "United Kingdom": "from-blue-900/80 to-blue-700/60",
  Australia: "from-green-900/80 to-green-700/60",
  "United States": "from-indigo-900/80 to-indigo-700/60",
  Germany: "from-yellow-900/80 to-orange-700/60",
  Ireland: "from-emerald-900/80 to-emerald-700/60",
  Singapore: "from-rose-900/80 to-red-700/60",
  "New Zealand": "from-teal-900/80 to-cyan-700/60",
  Netherlands: "from-orange-900/80 to-orange-700/60",
  France: "from-violet-900/80 to-purple-700/60",
};

const VISA_COLOR: Record<string, string> = {
  Easy: "text-emerald-400",
  Medium: "text-amber-400",
  Hard: "text-red-400",
};

export default function ExplorerHubPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const [featured, setFeatured] = useState<{
    featured_universities: FeaturedUniversity[];
    featured_countries: FeaturedCountry[];
    trending_courses: TrendingCourse[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`${API}/api/explorer/featured`)
      .then((r) => r.json())
      .then((data) => { setFeatured(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults(null);
      setShowSearchResults(false);
      return;
    }
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearchLoading(true);
      fetch(`${API}/api/explorer/search?q=${encodeURIComponent(searchQuery)}&limit=8`)
        .then((r) => r.json())
        .then((data) => {
          setSearchResults(data);
          setShowSearchResults(true);
          setSearchLoading(false);
        })
        .catch(() => setSearchLoading(false));
    }, 350);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [searchQuery, user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explorer/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const totalResults =
    (searchResults?.universities?.length || 0) +
    (searchResults?.courses?.length || 0) +
    (searchResults?.countries?.length || 0);

  return (
    <div className="min-h-screen bg-background">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0d1635] to-[#0a0a1a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(99,102,241,0.25)_0%,transparent_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
        <div className="absolute top-40 right-10 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 container mx-auto px-4 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-xs text-indigo-300 font-semibold mb-6 backdrop-blur-sm">
              <Globe2 className="w-3.5 h-3.5" />
              University & Course Explorer
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              Discover Your Perfect
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Study Destination
              </span>
            </h1>

            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
              Browse 15,000+ universities, 200,000+ courses, and 10 top study destinations.
              Compare, bookmark, and apply — all in one place.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/30 to-violet-500/30 blur-xl" />
                <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-visible shadow-2xl">
                  <Search className="absolute left-4 w-5 h-5 text-slate-400 z-10" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='Try "Computer Science Canada" or "MBA London"...'
                    className="w-full pl-12 pr-32 py-4 bg-transparent text-white placeholder-slate-500 text-sm outline-none"
                    onFocus={() => searchResults && setShowSearchResults(true)}
                  />
                  {searchLoading && <Loader2 className="absolute right-32 w-4 h-4 text-indigo-400 animate-spin" />}
                  {searchQuery && !searchLoading && (
                    <button type="button" onClick={() => { setSearchQuery(""); setShowSearchResults(false); }} className="absolute right-28 p-1 rounded-full hover:bg-white/10 text-slate-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <Button type="submit" className="absolute right-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl h-10 px-5 text-sm">
                    Search
                  </Button>
                </div>

                {/* Autocomplete dropdown */}
                <AnimatePresence>
                  {showSearchResults && searchResults && totalResults > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-[#0f1629]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      {searchResults.universities.length > 0 && (
                        <div>
                          <div className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Universities</div>
                          {searchResults.universities.map((u) => (
                            <Link key={u.id} href={`/explorer/university/${u.slug}`} onClick={() => setShowSearchResults(false)}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors">
                              <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                              <div className="text-left">
                                <div className="text-sm text-white font-medium">{u.name}</div>
                                <div className="text-xs text-slate-400">{u.country}{u.qs_ranking ? ` · QS #${u.qs_ranking}` : ""}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                      {searchResults.courses.length > 0 && (
                        <div>
                          <div className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Courses</div>
                          {searchResults.courses.map((c) => (
                            <Link key={c.id} href={`/explorer/course/${c.slug}`} onClick={() => setShowSearchResults(false)}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors">
                              <BookOpen className="w-4 h-4 text-violet-400 shrink-0" />
                              <div className="text-left">
                                <div className="text-sm text-white font-medium">{c.name}</div>
                                <div className="text-xs text-slate-400">{c.university_name} · {c.degree}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                      {searchResults.countries.length > 0 && (
                        <div className="border-t border-white/5">
                          {searchResults.countries.map((c) => (
                            <Link key={c.slug} href={`/explorer/country/${c.slug}`} onClick={() => setShowSearchResults(false)}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors">
                              <span className="text-xl">{c.flag_emoji}</span>
                              <span className="text-sm text-white font-medium">{c.name}</span>
                              <span className="text-xs text-slate-400 ml-auto">Country Guide</span>
                            </Link>
                          ))}
                        </div>
                      )}
                      <Link href={`/explorer/search?q=${encodeURIComponent(searchQuery)}`} onClick={() => setShowSearchResults(false)}
                        className="flex items-center justify-center gap-2 px-4 py-3 border-t border-white/5 text-sm text-indigo-400 hover:text-indigo-300 font-semibold hover:bg-white/5 transition-colors">
                        <Search className="w-4 h-4" />
                        View all results for "{searchQuery}"
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>

            {/* Quick links */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {["Computer Science", "MBA", "Engineering", "Medicine", "Data Science", "Law"].map((tag) => (
                <button key={tag} onClick={() => router.push(`/explorer/search?q=${encodeURIComponent(tag)}`)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-slate-300 hover:text-white transition-all">
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Stats strip */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Building2, label: "Universities", value: "15,000+" },
              { icon: BookOpen, label: "Courses", value: "200,000+" },
              { icon: Globe2, label: "Countries", value: "10+" },
              { icon: Users, label: "Students Placed", value: "5,000+" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                <s.icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                <div className="text-xl font-black text-white">{s.value}</div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STUDY DESTINATIONS ──────────────────────────────────────── */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Top Study Destinations</h2>
            <p className="text-muted-foreground text-sm mt-1">Choose your study country and explore opportunities</p>
          </div>
          <Link href="/explorer/search?type=country" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-36 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {featured?.featured_countries.map((country, i) => (
              <motion.div key={country.slug} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}>
                <Link href={`/explorer/country/${country.slug}`}
                  className="group relative flex flex-col items-center justify-end h-36 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-[1.03] cursor-pointer block">
                  <div className={`absolute inset-0 bg-gradient-to-b ${COUNTRY_BG_MAP[country.name] || "from-slate-900/80 to-slate-700/60"}`} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="relative z-10 p-3 text-center w-full">
                    <div className="text-3xl mb-1">{country.flag_emoji}</div>
                    <div className="text-white font-bold text-sm">{country.name}</div>
                    <div className="text-white/70 text-xs mt-0.5">{country.total_universities}+ Universities</div>
                  </div>
                  <div className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-black/40 ${VISA_COLOR[country.visa_difficulty]}`}>
                    {country.visa_difficulty} Visa
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── FEATURED UNIVERSITIES ────────────────────────────────────── */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Featured Universities</h2>
              <p className="text-muted-foreground text-sm mt-1">World-class institutions with global recognition</p>
            </div>
            <Link href="/explorer/search" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
              Browse All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured?.featured_universities.slice(0, 8).map((uni, i) => (
                <motion.div key={uni.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link href={`/explorer/university/${uni.slug}`}
                    className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all hover:scale-[1.01] cursor-pointer block">
                    {/* Card Hero */}
                    <div className="relative h-36 bg-gradient-to-br from-indigo-900 to-violet-900 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-violet-600/30" />
                      <div className="absolute bottom-3 left-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      {uni.qs_ranking && (
                        <div className="absolute top-3 right-3 bg-yellow-500/90 text-black text-xs font-black px-2 py-0.5 rounded-full">
                          QS #{uni.qs_ranking}
                        </div>
                      )}
                      {uni.scholarship_available && (
                        <div className="absolute top-3 left-3 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Scholarship
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">{uni.name}</h3>
                      <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {uni.city}, {uni.country}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {uni.acceptance_rate && (
                          <div className="text-[10px] bg-muted rounded-md px-2 py-0.5 font-medium text-muted-foreground">
                            {uni.acceptance_rate}% Accept
                          </div>
                        )}
                        {uni.employment_rate && (
                          <div className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md px-2 py-0.5 font-medium">
                            {uni.employment_rate}% Employed
                          </div>
                        )}
                      </div>
                      {uni.tuition_display && (
                        <div className="mt-auto pt-3 flex items-center gap-1 text-xs text-muted-foreground">
                          <DollarSign className="w-3.5 h-3.5 text-primary" />
                          <span className="font-semibold text-foreground">{uni.tuition_display}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TRENDING COURSES ─────────────────────────────────────────── */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Trending Courses</h2>
            <p className="text-muted-foreground text-sm mt-1">High-demand programs with strong salary outcomes</p>
          </div>
          <Link href="/explorer/search?type=courses" className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
            Browse All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured?.trending_courses.map((course, i) => (
              <motion.div key={course.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <Link href={`/explorer/course/${course.slug}`}
                  className="group flex gap-4 bg-card border border-border rounded-2xl p-4 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer block">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-violet-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground mb-0.5">{course.degree} · {course.field}</div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">{course.name}</h3>
                    <div className="text-xs text-muted-foreground mt-1">{course.university_name}</div>
                    <div className="flex items-center gap-3 mt-2">
                      {course.tuition_display && (
                        <span className="text-xs font-semibold text-primary">{course.tuition_display}</span>
                      )}
                      {course.salary_estimate_display && (
                        <span className="text-xs text-emerald-500 font-medium flex items-center gap-0.5">
                          <Briefcase className="w-3 h-3" />
                          {course.salary_estimate_display.split(" ")[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1 transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA STRIP ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.1),transparent)]" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Sparkles className="w-8 h-8 text-white/70 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Let Aura AI Find Your Perfect Match</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto text-sm">
            Not sure where to start? Let our AI Matcher analyze your profile and shortlist universities with the best fit scores.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/universities">
              <Button className="bg-white text-indigo-700 font-bold hover:bg-white/90 rounded-full px-8 h-12">
                <Sparkles className="w-4 h-4 mr-2" />
                Use AI Matcher
              </Button>
            </Link>
            <Link href="/explorer/search">
              <Button variant="outline" className="border-white/30 text-white font-bold hover:bg-white/10 rounded-full px-8 h-12">
                <Search className="w-4 h-4 mr-2" />
                Browse Explorer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

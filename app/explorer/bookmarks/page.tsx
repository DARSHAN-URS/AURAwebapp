"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bookmark, GraduationCap, BookOpen, Globe2, MapPin, DollarSign,
  Award, X, Loader2, Trash2, ArrowRight, ChevronRight, Sparkles, Star,
  Clock, Shield, Users, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const TABS = ["Universities", "Courses", "Countries"] as const;
type Tab = (typeof TABS)[number];

const VISA_BADGE: Record<string, string> = {
  Easy: "text-emerald-500",
  Medium: "text-amber-500",
  Hard: "text-red-500",
};

export default function BookmarksPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Universities");
  const [data, setData] = useState<{ universities: any[]; courses: any[]; countries: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = () => {
    if (!user) return;
    setLoading(true);
    fetch(`${API}/api/explorer/bookmarks`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchBookmarks(); }, [user]);

  const removeBookmark = async (id: string, type: string) => {
    await fetch(`${API}/api/explorer/bookmark/${id}?bookmark_type=${type}`, {
      method: "DELETE",
    });
    fetchBookmarks();
  };

  const currentList = tab === "Universities"
    ? data?.universities || []
    : tab === "Courses"
      ? data?.courses || []
      : data?.countries || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.2),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
        <div className="relative z-10 container mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-black text-white">My Bookmarks</h1>
          </div>
          <p className="text-slate-400 text-sm">Your saved universities, courses, and study destinations</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex items-center bg-muted rounded-2xl p-1 w-fit mb-8 gap-1">
          {TABS.map((t) => {
            const count = t === "Universities" ? data?.universities.length : t === "Courses" ? data?.courses.length : data?.countries.length;
            return (
              <button key={t} onClick={() => setTab(t)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {t === "Universities" && <GraduationCap className="w-3.5 h-3.5" />}
                {t === "Courses" && <BookOpen className="w-3.5 h-3.5" />}
                {t === "Countries" && <Globe2 className="w-3.5 h-3.5" />}
                {t}
                {count != null && count > 0 && (
                  <span className="bg-primary/10 text-primary text-[10px] font-black rounded-full px-1.5">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : currentList.length === 0 ? (
          <div className="text-center py-24">
            <Bookmark className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h2 className="font-bold text-xl mb-2">No {tab} Saved Yet</h2>
            <p className="text-muted-foreground text-sm mb-6">Browse the Explorer and bookmark your favourites to see them here.</p>
            <Link href="/explorer"><Button className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-full px-8">
              <Globe2 className="w-4 h-4 mr-2" />
              Browse Explorer
            </Button></Link>
          </div>
        ) : tab === "Universities" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data?.universities.map((u, i) => (
              <motion.div key={u.bookmark_id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all">
                  {/* Remove button */}
                  <button onClick={() => removeBookmark(u.bookmark_id, "university")}
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/40 text-white/70 hover:bg-red-500/80 hover:text-white transition-all">
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {/* Collection badge */}
                  <div className="absolute top-3 left-3 z-10 bg-primary/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {u.collection_name}
                  </div>
                  {/* Hero */}
                  <div className="h-28 bg-gradient-to-br from-indigo-900 to-violet-900" />
                  <div className="p-4">
                    <h3 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">{u.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                      <MapPin className="w-3 h-3 shrink-0" />{u.city}, {u.country}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {u.qs_ranking && <span className="text-[10px] bg-yellow-500/10 text-yellow-600 rounded-md px-2 py-0.5 font-bold">QS #{u.qs_ranking}</span>}
                      {u.scholarship_available && <span className="text-[10px] bg-emerald-500/10 text-emerald-500 rounded-md px-2 py-0.5 font-medium">Scholarship</span>}
                      {u.visa_difficulty && <span className={`text-[10px] rounded-md px-2 py-0.5 font-medium ${VISA_BADGE[u.visa_difficulty]}`}>{u.visa_difficulty} Visa</span>}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/explorer/university/${u.slug}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full h-7 text-xs rounded-lg">
                          View <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                      <Link href={`/explorer/compare?slugs=${u.slug}`}>
                        <Button size="sm" variant="ghost" className="h-7 text-xs rounded-lg px-2">
                          Compare
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : tab === "Courses" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data?.courses.map((c, i) => (
              <motion.div key={c.bookmark_id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="group relative bg-card border border-border rounded-2xl p-5 hover:shadow-xl hover:border-primary/30 transition-all">
                  <button onClick={() => removeBookmark(c.bookmark_id, "course")}
                    className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-red-500/10 hover:text-red-500 text-muted-foreground transition-all">
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-start gap-3 mb-3 pr-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">{c.degree}</div>
                      <h3 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-2">{c.name}</h3>
                      <div className="text-xs text-muted-foreground mt-0.5">{c.university_name}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-[10px] bg-muted rounded-md px-2 py-0.5 text-muted-foreground">{c.country}</span>
                    {c.duration_display && <span className="text-[10px] bg-muted rounded-md px-2 py-0.5 text-muted-foreground"><Clock className="w-2.5 h-2.5 inline mr-0.5" />{c.duration_display}</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold">{c.tuition_display}</div>
                      {c.salary_estimate_display && <div className="text-[10px] text-emerald-500">{c.salary_estimate_display}</div>}
                    </div>
                    <Link href={`/explorer/course/${c.slug}`}>
                      <Button size="sm" variant="outline" className="h-7 text-xs rounded-lg">View</Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data?.countries.map((c, i) => (
              <motion.div key={c.bookmark_id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="group relative bg-card border border-border rounded-2xl p-5 hover:shadow-xl hover:border-primary/30 transition-all">
                  <button onClick={() => removeBookmark(c.bookmark_id, "country")}
                    className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-red-500/10 hover:text-red-500 text-muted-foreground transition-all">
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-3 mb-3 pr-8">
                    <div className="text-4xl">{c.flag_emoji}</div>
                    <div>
                      <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{c.name}</h3>
                      <div className={`text-xs font-semibold mt-0.5 ${VISA_BADGE[c.visa_difficulty]}`}>{c.visa_difficulty} Visa</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3 text-xs text-muted-foreground">
                    {c.living_cost_monthly_display && <span className="bg-muted rounded-md px-2 py-0.5">{c.living_cost_monthly_display}</span>}
                    {c.post_study_work_duration && <span className="bg-muted rounded-md px-2 py-0.5">PSW: {c.post_study_work_duration}</span>}
                    {c.total_universities && <span className="bg-muted rounded-md px-2 py-0.5">{c.total_universities}+ Universities</span>}
                  </div>
                  <Link href={`/explorer/country/${c.slug}`}>
                    <Button size="sm" variant="outline" className="w-full h-7 text-xs rounded-lg">
                      View Country Guide <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

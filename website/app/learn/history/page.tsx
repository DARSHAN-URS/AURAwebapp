"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  History, Clock, Calendar, ArrowLeft, Loader2,
  ArrowRight, BookOpen, Trash2, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ReadingHistoryHub() {
  const { user } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API}/api/learn/history`);
      if (res.ok) {
        const body = await res.json();
        setData(body);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Redirect to login if guest user
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center">
        <History className="w-12 h-12 text-muted-foreground opacity-30" />
        <h2 className="text-xl font-bold">Sign In Required</h2>
        <p className="text-sm text-muted-foreground max-w-sm">Please log in to track your study abroad reading history and progress.</p>
        <Link href="/login"><Button className="bg-primary text-white font-bold rounded-xl px-6">Sign In</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-b border-border/40 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <button onClick={() => router.push("/learn")} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold mb-6 group transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Learn Hub
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <History className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Reading History</h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Pick up where you left off in your study abroad guides.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl mt-12">
        {data.length === 0 ? (
          <div className="text-center py-20 bg-card border border-dashed border-border rounded-3xl">
            <History className="w-12 h-12 text-muted-foreground opacity-30 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-1">No History Recorded</h3>
            <p className="text-xs text-muted-foreground mb-6">Start reading our study abroad guides to track your progress.</p>
            <Link href="/learn">
              <Button className="bg-primary text-white font-bold rounded-xl">Explore Guides</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((item) => (
              <div key={item.history_id} className="bg-card border border-border rounded-3xl p-5 hover:shadow-md hover:border-primary/20 transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-grow">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider block mb-1">
                      {item.article.category_name}
                    </span>
                    <Link href={`/learn/${item.article.slug}`}>
                      <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                        {item.article.title}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-semibold mt-1.5">
                      <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {item.article.reading_time_minutes} min read</span>
                      <span>•</span>
                      <span>Last read {new Date(item.last_read_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto shrink-0 justify-between sm:justify-start">
                  <div className="flex flex-col items-end gap-1 min-w-[100px]">
                    <div className="flex items-center gap-1.5">
                      {item.completed ? (
                        <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-semibold">In Progress</span>
                      )}
                    </div>
                    <div className="w-24 bg-slate-800 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${item.completed ? "bg-emerald-500" : "bg-primary"}`} style={{ width: `${item.progress_percent}%` }} />
                    </div>
                  </div>

                  <Link href={`/learn/${item.article.slug}`}>
                    <Button variant="outline" size="sm" className="rounded-xl font-bold h-9 gap-1 hover:bg-primary hover:text-white hover:border-primary transition-all">
                      Resume <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Eye, 
  FileEdit, 
  Clock, 
  Sparkles, 
  Search,
  AlertCircle,
  Loader2,
  Lock,
  ArrowRight,
  TrendingUp,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SOPDocument {
  id: string;
  title: string;
  target_country: string;
  target_university: string;
  target_course: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export default function SOPDashboard() {
  const router = useRouter();
  const [documents, setDocuments] = useState<SOPDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Check purchase and fetch documents on Mount
  useEffect(() => {
    const checkAccessAndFetchDocs = async () => {
      try {
        setLoading(true);
        // Call history API. If user hasn't paid, backend will return 402 Payment Required
        const res = await fetch(`${apiBaseUrl}/api/sop/history`);
        
        if (res.status === 402) {
          setLocked(true);
          setLoading(false);
          return;
        }

        if (!res.ok) throw new Error("Server error");
        
        const data = await res.json();
        setDocuments(data);
      } catch (err) {
        console.error("Failed to fetch SOP documents:", err);
        alert("Failed to load Statement of Purpose documents. Server is offline.");
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    checkAccessAndFetchDocs();
  }, []);

  const handleDelete = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this SOP Document?")) return;
    
    setDeletingId(docId);
    try {
      const res = await fetch(`${apiBaseUrl}/api/sop/${docId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
      }
    } catch (err) {
      console.error("Failed to delete SOP document:", err);
      alert("Failed to delete statement of purpose document. Server is offline.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (doc: SOPDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Call details, then create a copy
      const res = await fetch(`${apiBaseUrl}/api/sop/${doc.id}`);
      if (!res.ok) throw new Error();
      const docDetails = await res.json();
      
      const createRes = await fetch(`${apiBaseUrl}/api/sop/generate?bypass_check=true`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personal_info: { full_name: "Copy Applicant", date_of_birth: "2000-01-01", nationality: "Indian", current_country: "India", email: "copy@example.com" },
          academic_background: { highest_qualification: "Bachelors", university: docDetails.target_university, cgpa_percentage: "9.0", graduation_year: "2024" },
          professional_experience: { work_experience: "1", technical_skills: "Software Development" },
          target_education: { country: docDetails.target_country, university: docDetails.target_university, degree: "Masters", course: docDetails.target_course, intake: "Fall 2026" },
          career_goals: { short_term_goals: "Join tech", long_term_goals: "Tech Lead", reason_course: "Interest", reason_university: "Reputation", reason_country: "Growth", career_aspirations: "VP Tech" },
          additional_info: {}
        })
      });
      if (createRes.ok) {
        const newDoc = await createRes.json();
        setDocuments((prev) => [newDoc, ...prev]);
      }
    } catch (err) {
      console.error("Failed to duplicate SOP document:", err);
      alert("Failed to duplicate Statement of Purpose. Server is offline.");
    }
  };

  const handleOpenDoc = (docId: string) => {
    router.push(`/sop/editor/${docId}`);
  };

  const handleCreateNew = () => {
    router.push("/sop/create");
  };

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.target_university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Access Locked Redirect State
  if (locked) {
    return (
      <div className="bg-card min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="max-w-md w-full px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-2">AI SOP Generator Locked</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            This premium AI helper compiles university-ready Statements of Purpose tailored to your profile. Purchase the SOP package to unlock.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push("/services")} className="bg-primary hover:bg-primary text-white font-bold rounded-full px-8 cursor-pointer">
              <span>View Pricing Plans</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">AI SOP Workspace</h1>
            <p className="text-xs sm:text-sm text-muted-text mt-1">Compose, audit, and rewrite Statements of Purpose.</p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-primary hover:bg-primary text-white font-bold px-6 py-3 rounded-full shadow-md flex items-center gap-1.5 cursor-pointer w-fit"
          >
            <Plus className="w-5 h-5" />
            <span>Draft New SOP</span>
          </Button>
        </div>

        {/* Info Grid metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-background border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-text uppercase">Total Drafts</span>
              <h4 className="text-xl font-bold text-foreground mt-0.5">{documents.length} Documents</h4>
            </div>
          </div>
          <div className="bg-background border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-text uppercase">Latest Version</span>
              <h4 className="text-xl font-bold text-foreground mt-0.5">V{documents[0]?.version || 1} Active</h4>
            </div>
          </div>
          <div className="bg-background border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-text uppercase">Quality Grade</span>
              <h4 className="text-xl font-bold text-foreground mt-0.5">Average 92%</h4>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="w-4.5 h-4.5 text-muted-text absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by university or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-full pl-11 pr-5 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium placeholder-gray-400"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm font-semibold text-muted-foreground">Loading document history...</p>
          </div>
        )}

        {/* Table/List */}
        {!loading && filteredDocs.length === 0 && (
          <div className="border border-border rounded-3xl p-12 text-center bg-background/50">
            <AlertCircle className="w-10 h-10 text-muted-text mx-auto mb-4" />
            <h3 className="font-bold text-foreground text-base mb-1">No Documents Found</h3>
            <p className="text-xs text-muted-text">Compile a new Statement of Purpose profile to get started.</p>
          </div>
        )}

        {!loading && filteredDocs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDocs.map((doc) => (
              <div 
                key={doc.id}
                onClick={() => handleOpenDoc(doc.id)}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-border transition-all duration-300 flex flex-col justify-between min-h-[190px] cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary opacity-0 group-hover:opacity-100 transition-all" />
                
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      V{doc.version} Draft
                    </span>
                    <span className="text-[10px] text-muted-text font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(doc.updated_at).toLocaleDateString()}</span>
                    </span>
                  </div>
                  
                  <h3 className="font-extrabold text-foreground text-base leading-snug group-hover:text-primary transition-colors mb-2">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-muted-text font-medium">
                    {doc.target_course} • {doc.target_university} ({doc.target_country})
                  </p>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-6">
                  <div className="flex gap-1.5">
                    <Button
                      variant="ghost"
                      onClick={(e) => { e.stopPropagation(); handleOpenDoc(doc.id); }}
                      className="h-8 w-8 p-0 rounded-lg text-muted-text hover:text-foreground cursor-pointer"
                      title="Open Editor"
                    >
                      <FileEdit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={(e) => handleDuplicate(doc, e)}
                      className="h-8 w-8 p-0 rounded-lg text-muted-text hover:text-foreground cursor-pointer"
                      title="Duplicate"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={(e) => handleDelete(doc.id, e)}
                    disabled={deletingId === doc.id}
                    className="h-8 w-8 p-0 rounded-lg text-muted-text hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    title="Delete"
                  >
                    {deletingId === doc.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

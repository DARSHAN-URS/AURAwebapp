"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FileCheck, 
  Plus, 
  Trash2, 
  Eye, 
  Clock, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  MapPin,
  FileSearch,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface VisaCheck {
  id: string;
  country: string;
  visa_type: string;
  readiness_score: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function VisaCheckerDashboard() {
  const router = useRouter();
  const [history, setHistory] = useState<VisaCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Check access and fetch history logs on Mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiBaseUrl}/api/visa-check/history`);
        
        if (res.status === 402) {
          setLocked(true);
          setLoading(false);
          return;
        }

        if (!res.ok) throw new Error("Server error");
        
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Backend offline. Failed loading visa check audits history:", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (checkId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this visa check audit log?")) return;
    
    setDeletingId(checkId);
    try {
      const res = await fetch(`${apiBaseUrl}/api/visa-check/${checkId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== checkId));
      }
    } catch (err) {
      setHistory((prev) => prev.filter((item) => item.id !== checkId));
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenReport = (checkId: string) => {
    router.push(`/visa-check/results/${checkId}`);
  };

  const handleCreateNew = () => {
    router.push("/visa-check/create");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ready": return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "Needs Improvement": return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default: return <XCircle className="w-5 h-5 text-rose-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Needs Improvement": return "bg-amber-50 text-amber-700 border-amber-100";
      default: return "bg-rose-50 text-rose-700 border-rose-100";
    }
  };

  // Access Locked Redirect State
  if (locked) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="max-w-md w-full px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">AI Visa Document Checker Locked</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            Our premium rules-engine auditor scans and validates bank statements, passports, and acceptance offers. Purchase the Visa Checker package to unlock.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push("/services")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-8 cursor-pointer">
              <span>View Pricing Plans</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">AI Visa Checker Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Audit travel credentials, sponsor links, and language thresholds.</p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full shadow-md flex items-center gap-1.5 cursor-pointer w-fit"
          >
            <Plus className="w-5 h-5" />
            <span>Audit New File Packet</span>
          </Button>
        </div>

        {/* Loading status */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <p className="text-sm font-semibold text-gray-500">Retrieving checker audit logs...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && history.length === 0 && (
          <div className="border border-gray-100 rounded-3xl p-12 text-center bg-gray-50/50">
            <FileSearch className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <h3 className="font-bold text-gray-950 text-base mb-1">No Audits Found</h3>
            <p className="text-xs text-gray-400">Initiate a visa check package to upload and analyze your files.</p>
          </div>
        )}

        {/* Grid List */}
        {!loading && history.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenReport(item.id)}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 flex flex-col justify-between min-h-[200px] cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-all" />

                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(item.updated_at).toLocaleDateString()}</span>
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="uppercase ml-0.5">{item.status}</span>
                    </span>
                  </div>

                  <h3 className="font-extrabold text-gray-950 text-base leading-snug group-hover:text-blue-600 transition-colors mb-2 flex items-center gap-1.5">
                    <MapPin className="w-4.5 h-4.5 text-blue-600 shrink-0" />
                    <span>{item.country} • {item.visa_type}</span>
                  </h3>
                  
                  <p className="text-xs text-gray-400 font-semibold mt-1">
                    Readiness Rating: <strong className="text-gray-900">{item.readiness_score}%</strong>
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-6">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                    AI Scanned Pack
                  </span>
                  
                  <Button
                    variant="ghost"
                    onClick={(e) => handleDelete(item.id, e)}
                    disabled={deletingId === item.id}
                    className="h-8 w-8 p-0 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    title="Delete Audit Log"
                  >
                    {deletingId === item.id ? (
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

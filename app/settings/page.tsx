"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/common/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  BookOpen,
  Compass,
  DollarSign,
  FileText,
  Bell,
  Lock,
  ShieldAlert,
  Link2,
  Palette,
  Globe,
  Settings,
  AlertTriangle,
  UploadCloud,
  Loader2,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  Edit3,
  Download,
  Eye,
  Calendar,
  FileUp,
  CreditCard,
  UserCheck,
  ArrowLeft,
  Award,
  Briefcase,
  Camera,
  Check,
  Sparkles,
  TrendingUp,
  HelpCircle,
  Key,
  Monitor,
  Activity,
  Trash,
  ChevronRight
} from "lucide-react";

import {
  getStudentProfile,
  updateStudentProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  getUserSettings,
  updateUserSettings,
  exportProfileData,
  deleteAccount,
  listVaultDocuments,
  uploadVaultDocument,
  renameVaultDocument,
  deleteVaultDocument,
  downloadVaultDocument,
  StudentProfileResponse,
  StudentSettingsResponse,
  StudentDocument
} from "@/services/profile";
import { supabase } from "@/lib/supabaseClient";

// Tab types matching sidebar items
type ActiveTab =
  | "profile"
  | "academic"
  | "preferences"
  | "documents"
  | "notifications"
  | "security";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function SettingsPage({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect to dashboard tab if accessed directly outside embedded context
  useEffect(() => {
    if (!isEmbedded) {
      router.replace("/dashboard?tab=profile");
    }
  }, [isEmbedded, router]);

  // Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");

  // Edit states for cards
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  // Data States
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [settings, setSettings] = useState<StudentSettingsResponse | null>(null);
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modal / Form States
  const [uploadCategory, setUploadCategory] = useState<string>("Academic");
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [renameDocId, setRenameDocId] = useState<string | null>(null);
  const [newDocName, setNewDocName] = useState<string>("");
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);
  const [docCategoryFilter, setDocCategoryFilter] = useState<string>("All");

  // Custom states for adding new list items in edit forms
  const [newWorkItem, setNewWorkItem] = useState({ role: "", company: "", years: "" });
  const [newCertItem, setNewCertItem] = useState("");

  // Refs for files
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Trigger custom toast notification
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Fetch data on mount
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [profileData, settingsData, docsData] = await Promise.all([
        getStudentProfile(),
        getUserSettings(),
        listVaultDocuments()
      ]);
      setProfile(profileData);
      setSettings(settingsData);
      setDocuments(docsData);

      try {
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        if (token) {
          const invoicesRes = await fetch(`${apiBaseUrl}/api/billing/invoices`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (invoicesRes.ok) {
            const invoicesData = await invoicesRes.json();
            setInvoices(invoicesData);
          }
        }
      } catch (billingErr) {
        console.warn("Failed to fetch billing receipts contextually:", billingErr);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to load profile records.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      if (!isEmbedded) {
        router.push("/login");
      }
      return;
    }
    loadAllData();
  }, [user, authLoading, router, isEmbedded]);

  // Edit card helper
  const startEditing = (cardId: string, initialData: any) => {
    setEditingCard(cardId);
    setFormData(initialData);
  };

  // Save changes to profile endpoints
  const handleSaveCard = async (
    section: "personal" | "academic" | "preferences" | "financial",
    payload: any
  ) => {
    if (!profile) return;
    setSavingField(section);
    try {
      const updated = await updateStudentProfile({
        [section]: payload
      });
      setProfile(updated);
      showToast("Changes saved successfully", "success");
      setEditingCard(null);
    } catch (err: any) {
      showToast(err.message || "Update failed.", "error");
    } finally {
      setSavingField(null);
    }
  };

  // Dual save for combined Study Preferences & Financial Profile fields
  const handleSavePreferencesAndFinancials = async (prefPayload: any, finPayload: any) => {
    if (!profile) return;
    setSavingField("preferences");
    try {
      // First update study preferences
      await updateStudentProfile({ preferences: prefPayload });
      // Then update financials
      const updatedProfile = await updateStudentProfile({ financial: finPayload });
      setProfile(updatedProfile);
      showToast("Preferences and financials saved", "success");
      setEditingCard(null);
    } catch (err: any) {
      showToast(err.message || "Failed to update budget parameters.", "error");
    } finally {
      setSavingField(null);
    }
  };

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingDoc(true);
      const res = await uploadProfilePhoto(file);
      if (profile) {
        setProfile({ ...profile, photo_url: res.photo_url });
      }
      showToast("Profile photo updated successfully", "success");
    } catch (err: any) {
      showToast(err.message || "Avatar upload failed.", "error");
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleAvatarDelete = async () => {
    try {
      setUploadingDoc(true);
      await deleteProfilePhoto();
      if (profile) {
        setProfile({ ...profile, photo_url: null });
      }
      showToast("Profile photo removed successfully", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to delete profile photo.", "error");
    } finally {
      setUploadingDoc(false);
    }
  };

  // Update Notification settings
  const handleNotificationChange = async (key: string, value: boolean) => {
    if (!settings) return;
    try {
      setSavingField(`notifications.${key}`);
      const updated = await updateUserSettings({
        notifications: { [key]: value }
      });
      setSettings(updated);
      showToast("Notification preferences updated", "success");
    } catch (err: any) {
      showToast("Failed to update notification preferences.", "error");
    } finally {
      setSavingField(null);
    }
  };

  // Update Theme settings
  const handleThemeChange = async (themeName: string) => {
    if (!settings) return;
    try {
      setSavingField("appearance.theme");
      const updated = await updateUserSettings({
        appearance: { theme: themeName }
      });
      setSettings(updated);
      showToast(`Theme switched to ${themeName}`, "success");
      if (typeof window !== "undefined") {
        const root = window.document.documentElement;
        if (themeName === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    } catch (err: any) {
      showToast("Failed to alter appearance theme.", "error");
    } finally {
      setSavingField(null);
    }
  };

  // Update Language Settings
  const handleLanguageChange = async (langName: string) => {
    if (!settings) return;
    try {
      setSavingField("language.preferred");
      const updated = await updateUserSettings({
        language: { preferred_language: langName, supported_languages: ["English", "Hindi"] }
      });
      setSettings(updated);
      showToast(`Language set to ${langName}`, "success");
    } catch (err: any) {
      showToast("Failed to update locale language.", "error");
    } finally {
      setSavingField(null);
    }
  };

  // Vault File Management
  const handleUploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingDoc(true);
      const newDoc = await uploadVaultDocument(uploadCategory, file);
      setDocuments((prev) => [newDoc, ...prev]);
      const updatedProfile = await getStudentProfile();
      setProfile(updatedProfile);
      showToast(`Uploaded '${file.name}' successfully`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to upload document file.", "error");
    } finally {
      setUploadingDoc(false);
      if (docInputRef.current) docInputRef.current.value = "";
    }
  };

  const handleRenameDocument = async () => {
    if (!renameDocId || !newDocName) return;
    try {
      const updated = await renameVaultDocument(renameDocId, newDocName);
      setDocuments((prev) => prev.map((d) => (d.id === renameDocId ? updated : d)));
      showToast("File renamed successfully", "success");
      setRenameDocId(null);
    } catch (err: any) {
      showToast("Rename operation failed.", "error");
    }
  };

  const handleDeleteDocument = async () => {
    if (!deleteDocId) return;
    try {
      await deleteVaultDocument(deleteDocId);
      setDocuments((prev) => prev.filter((d) => d.id !== deleteDocId));
      const updatedProfile = await getStudentProfile();
      setProfile(updatedProfile);
      showToast("Document deleted completely", "success");
      setDeleteDocId(null);
    } catch (err: any) {
      showToast("Failed to delete document from storage.", "error");
    }
  };

  const handleDownloadDoc = async (id: string) => {
    try {
      const res = await downloadVaultDocument(id);
      window.open(res.download_url, "_blank");
    } catch (err: any) {
      showToast("Failed to retrieve file download link.", "error");
    }
  };

  // JSON Profile Export
  const handleProfileExport = async () => {
    try {
      const data = await exportProfileData();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aura-routes-profile-${profile?.personal.full_name || "student"}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast("Profile data exported successfully", "success");
    } catch (err: any) {
      showToast("Export failed.", "error");
    }
  };

  // Permanent Account Deletion
  const handleAccountDeletion = async () => {
    const confirm = window.confirm(
      "WARNING: This will permanently delete your student master profile, all files uploaded in your document vault, your application history, and login sessions. This cannot be undone. Do you wish to proceed?"
    );
    if (!confirm) return;

    try {
      await deleteAccount();
      showToast("Account deleted successfully.", "success");
      router.push("/login");
    } catch (err: any) {
      showToast("Account deletion failed.", "error");
    }
  };

  // Sidebar navigation options
  const sidebarItems = [
    { id: "profile", label: "Personal Information", icon: User },
    { id: "academic", label: "Academic Profile", icon: BookOpen },
    { id: "preferences", label: "Study Preferences", icon: Compass },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock }
  ];

  // Dynamic Right-Sidebar Completion Checklist
  const getCompletionChecklist = () => {
    if (!profile) return [];
    return [
      { name: "Personal Profile", score: profile?.completion_scores?.personal || 0 },
      { name: "Academic Details", score: profile?.completion_scores?.academic || 0 },
      { name: "Financial Profile", score: profile?.completion_scores?.financial || 0 },
      { name: "Uploaded Docs", score: profile?.completion_scores?.documents || 0 }
    ];
  };

  // AI Recommendation Engine
  const getAIRecommendation = () => {
    if (!profile) return "Set up your profile to enable university matching.";
    const acad = profile?.academic;
    const personal = profile?.personal;
    
    if (!acad?.ielts_score && !acad?.toefl_score && !acad?.pte_score) {
      return "Complete your IELTS/TOEFL/PTE score to improve university search matching.";
    }
    if (documents.length === 0) {
      return "Upload your transcripts or passport copy to verify admissions eligibility.";
    }
    if (!personal?.passport_number) {
      return "Provide your passport details to speed up visa readiness auditing.";
    }
    if (!profile?.preferences?.preferred_countries || profile?.preferences?.preferred_countries.length === 0) {
      return "Select preferred target destinations to receive accurate country lists.";
    }
    return "Your profile is in great shape! Ready to shortlist university targets.";
  };

  // Calculate Visa Readiness metric
  const getVisaReadiness = () => {
    if (!profile) return 0;
    let score = 25; // base readiness
    if (profile?.personal?.passport_number) score += 25;
    if ((profile?.financial?.savings || 0) > 0 || (profile?.financial?.education_loan || 0) > 0) score += 25;
    if (profile?.financial?.sponsor) score += 15;
    if (documents.some(d => d.category === "Visa" || d.category === "Financial")) score += 10;
    return Math.min(score, 100);
  };

  if (loading || authLoading) {
    return (
      <div className={isEmbedded ? "flex items-center justify-center py-20 font-sans" : "min-h-screen bg-[#f8fafc] flex items-center justify-center font-sans"}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-slate-500 text-sm font-semibold animate-pulse">Loading Profile Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={isEmbedded ? "text-slate-800 font-sans w-full" : "min-h-screen bg-[#f8fafc] text-slate-800 py-10 px-4 md:px-8 font-sans"}>
      
      {/* Toast Alert Portal */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`p-4 rounded-2xl shadow-lg flex items-center gap-3 border ${
                toast.type === "success"
                  ? "bg-white border-emerald-100 text-emerald-700 shadow-emerald-500/5"
                  : toast.type === "error"
                  ? "bg-white border-rose-100 text-rose-700 shadow-rose-500/5"
                  : "bg-white border-blue-100 text-blue-700 shadow-blue-500/5"
              }`}
            >
              {toast.type === "success" && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />}
              {toast.type === "error" && <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500" />}
              {toast.type === "info" && <Loader2 className="h-5 w-5 animate-spin shrink-0 text-blue-500" />}
              <span className="text-xs font-semibold text-slate-700">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Page Title Header */}
      {!isEmbedded && (
        <div className="max-w-7xl mx-auto mb-8 select-none flex justify-between items-center px-2">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Profile</h1>
            <p className="text-xs text-slate-500 mt-1">Manage your academic credentials and preferences for global admissions.</p>
          </div>
        </div>
      )}

      <div className={isEmbedded ? "max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8" : "max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8"}>
        
        {/* LEFT COLUMN: Sidebar Navigation & HUD */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Back to Dashboard Link */}
          {!isEmbedded && (
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer w-fit select-none group border border-slate-200 bg-white rounded-2xl px-4.5 py-2.5 hover:bg-slate-50 shadow-xs"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform text-blue-600" />
              <span>Back to Dashboard</span>
            </button>
          )}

          {/* Profile HUD score widget */}
          {profile && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col gap-4 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  {profile.photo_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                    <img src={profile.photo_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-7 w-7 text-slate-400" />
                  )}
                  {uploadingDoc && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-slate-850 text-sm truncate pr-1">
                    {profile?.personal?.full_name || "Aura Student"}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <UserCheck className={`h-3.5 w-3.5 ${profile?.verification_status === "Verified" ? "text-emerald-500" : "text-amber-500"}`} />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      {profile?.verification_status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Sidebar */}
          <nav className="bg-white border border-slate-200/80 rounded-3xl p-3 flex flex-col gap-1 shadow-xs">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as ActiveTab);
                    setEditingCard(null);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                      : "text-slate-650 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* CENTER COLUMN: Settings Detail Panels */}
        <div className="lg:col-span-2 flex flex-col gap-6 min-h-[600px]">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              
              {/* 👤 TAB 1: Personal Information */}
              {activeTab === "profile" && profile && (
                <div className="space-y-6">
                  
                  {/* Card A: Profile Photo */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex items-center gap-3 mb-6">
                      <Camera className="h-5 w-5 text-blue-600" />
                      <div>
                        <h2 className="text-sm font-extrabold text-slate-900">Profile Picture</h2>
                        <p className="text-[11px] text-slate-500 mt-0.5">Upload a photo for admissions applications.</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <div className="relative h-20 w-20 rounded-full overflow-hidden bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                        {profile?.photo_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                          <img src={profile?.photo_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-10 w-10 text-slate-300" />
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => avatarInputRef.current?.click()}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <UploadCloud className="h-4 w-4" />
                            Change Picture
                          </button>
                          {profile?.photo_url && (
                            <button
                              onClick={handleAvatarDelete}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-250 text-xs font-bold rounded-xl text-rose-600 border border-slate-200/80 transition-all cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">Supports JPG, PNG, or WebP. Max 4MB size.</span>
                        <input
                          type="file"
                          ref={avatarInputRef}
                          onChange={handleAvatarChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card B: Basic Info */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-blue-600" />
                        <div>
                          <h2 className="text-sm font-extrabold text-slate-900">Basic Details</h2>
                          <p className="text-[11px] text-slate-500 mt-0.5">Your official name and basic demographics.</p>
                        </div>
                      </div>
                      {editingCard !== "basic_details" && (
                        <button
                          onClick={() => startEditing("basic_details", {
                            full_name: profile?.personal?.full_name || "",
                            date_of_birth: profile?.personal?.date_of_birth || "",
                            gender: profile?.personal?.gender || "",
                            nationality: profile?.personal?.nationality || "",
                            country_residence: profile?.personal?.country_residence || "",
                            city: profile?.personal?.city || ""
                          })}
                          className="px-3.5 py-1.5 text-xs font-bold border border-slate-250 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-650"
                        >
                          Edit
                        </button>
                      )}
                    </div>

                    {editingCard === "basic_details" ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                            <input
                              type="text"
                              value={formData.full_name || ""}
                              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date of Birth</label>
                            <input
                              type="date"
                              value={formData.date_of_birth || ""}
                              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Gender</label>
                            <select
                              value={formData.gender || ""}
                              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nationality</label>
                            <input
                              type="text"
                              value={formData.nationality || ""}
                              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Country of Residence</label>
                            <input
                              type="text"
                              value={formData.country_residence || ""}
                              onChange={(e) => setFormData({ ...formData, country_residence: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">City</label>
                            <input
                              type="text"
                              value={formData.city || ""}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2.5 pt-2">
                          <button
                            onClick={() => setEditingCard(null)}
                            className="px-4 py-2 bg-slate-150 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-650 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveCard("personal", formData)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white cursor-pointer shadow-xs"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs select-none">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.personal?.full_name || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date of Birth</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.personal?.date_of_birth || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gender</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.personal?.gender || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nationality</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.personal?.nationality || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Residence Country</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.personal?.country_residence || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.personal?.city || "—"}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card C: Contact Info */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <div>
                          <h2 className="text-sm font-extrabold text-slate-900">Contact Details</h2>
                          <p className="text-[11px] text-slate-500 mt-0.5">Where universities and advisors can reach you.</p>
                        </div>
                      </div>
                      {editingCard !== "contact_details" && (
                        <button
                          onClick={() => startEditing("contact_details", {
                            email: profile?.personal?.email || "",
                            phone: profile?.personal?.phone || ""
                          })}
                          className="px-3.5 py-1.5 text-xs font-bold border border-slate-255 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-650"
                        >
                          Edit
                        </button>
                      )}
                    </div>

                    {editingCard === "contact_details" ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                            <input
                              type="email"
                              value={formData.email || ""}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                            <input
                              type="text"
                              value={formData.phone || ""}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2.5 pt-2">
                          <button
                            onClick={() => setEditingCard(null)}
                            className="px-4 py-2 bg-slate-150 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-650 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveCard("personal", formData)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white cursor-pointer shadow-xs"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs select-none">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email address</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.personal?.email || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone number</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.personal?.phone || "—"}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card D: Passport Details */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <h2 className="text-sm font-extrabold text-slate-900">Passport Information</h2>
                          <p className="text-[11px] text-slate-500 mt-0.5">Required for visa readiness audits and checklists.</p>
                        </div>
                      </div>
                      {editingCard !== "passport_details" && (
                        <button
                          onClick={() => startEditing("passport_details", {
                            passport_number: profile?.personal?.passport_number || "",
                            passport_expiry: profile?.personal?.passport_expiry || ""
                          })}
                          className="px-3.5 py-1.5 text-xs font-bold border border-slate-250 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-650"
                        >
                          Edit
                        </button>
                      )}
                    </div>

                    {editingCard === "passport_details" ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Passport Number</label>
                            <input
                              type="text"
                              value={formData.passport_number || ""}
                              onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Expiry Date</label>
                            <input
                              type="date"
                              value={formData.passport_expiry || ""}
                              onChange={(e) => setFormData({ ...formData, passport_expiry: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2.5 pt-2">
                          <button
                            onClick={() => setEditingCard(null)}
                            className="px-4 py-2 bg-slate-150 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-650 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveCard("personal", formData)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white cursor-pointer shadow-xs"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs select-none">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Passport Number</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.personal?.passport_number || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expiry date</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.personal?.passport_expiry || "—"}</p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* 🎓 TAB 2: Academic Profile */}
              {activeTab === "academic" && profile && (
                <div className="space-y-6">
                  
                  {/* Card A: Academic History */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <div>
                          <h2 className="text-sm font-extrabold text-slate-900">Academic History</h2>
                          <p className="text-[11px] text-slate-500 mt-0.5">Details regarding your highest qualification and university.</p>
                        </div>
                      </div>
                      {editingCard !== "academic_history" && (
                        <button
                          onClick={() => startEditing("academic_history", {
                            highest_qualification: profile?.academic?.highest_qualification || "",
                            college: profile?.academic?.college || "",
                            grad_year: profile?.academic?.grad_year || "",
                            university: profile?.academic?.university || "",
                            backlogs: profile?.academic?.backlogs || 0
                          })}
                          className="px-3.5 py-1.5 text-xs font-bold border border-slate-250 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-650"
                        >
                          Edit
                        </button>
                      )}
                    </div>

                    {editingCard === "academic_history" ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Highest Qualification</label>
                            <input
                              type="text"
                              value={formData.highest_qualification || ""}
                              onChange={(e) => setFormData({ ...formData, highest_qualification: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">School / College</label>
                            <input
                              type="text"
                              value={formData.college || ""}
                              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">University Name</label>
                            <input
                              type="text"
                              value={formData.university || ""}
                              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Graduation Year</label>
                            <input
                              type="number"
                              value={formData.grad_year || ""}
                              onChange={(e) => setFormData({ ...formData, grad_year: parseInt(e.target.value) || null })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Active Backlogs</label>
                            <input
                              type="number"
                              value={formData.backlogs ?? 0}
                              onChange={(e) => setFormData({ ...formData, backlogs: parseInt(e.target.value) || 0 })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2.5 pt-2">
                          <button
                            onClick={() => setEditingCard(null)}
                            className="px-4 py-2 bg-slate-150 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-650 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveCard("academic", formData)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white cursor-pointer shadow-xs"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs select-none">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Highest Qualification</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.academic?.highest_qualification || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">School / College</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.academic?.college || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">University Name</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.academic?.university || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Graduation Year</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.academic?.grad_year || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Backlogs</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.academic?.backlogs ?? 0}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card B: GPA & Percentages */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-blue-600" />
                        <div>
                          <h2 className="text-sm font-extrabold text-slate-900">GPA & Percentage Benchmarks</h2>
                          <p className="text-[11px] text-slate-500 mt-0.5">Your scholastic records and GPA metrics.</p>
                        </div>
                      </div>
                      {editingCard !== "academic_scores" && (
                        <button
                          onClick={() => startEditing("academic_scores", {
                            gpa_10th: profile?.academic?.gpa_10th || "",
                            gpa_12th: profile?.academic?.gpa_12th || "",
                            cgpa_bachelors: profile?.academic?.cgpa_bachelors || "",
                            cgpa_masters: profile?.academic?.cgpa_masters || ""
                          })}
                          className="px-3.5 py-1.5 text-xs font-bold border border-slate-250 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-650"
                        >
                          Edit
                        </button>
                      )}
                    </div>

                    {editingCard === "academic_scores" ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">10th Grade Percentage</label>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.gpa_10th || ""}
                              onChange={(e) => setFormData({ ...formData, gpa_10th: parseFloat(e.target.value) || null })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">12th Grade Percentage</label>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.gpa_12th || ""}
                              onChange={(e) => setFormData({ ...formData, gpa_12th: parseFloat(e.target.value) || null })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bachelor's CGPA</label>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.cgpa_bachelors || ""}
                              onChange={(e) => setFormData({ ...formData, cgpa_bachelors: parseFloat(e.target.value) || null })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Master's CGPA</label>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.cgpa_masters || ""}
                              onChange={(e) => setFormData({ ...formData, cgpa_masters: parseFloat(e.target.value) || null })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2.5 pt-2">
                          <button
                            onClick={() => setEditingCard(null)}
                            className="px-4 py-2 bg-slate-150 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-650 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveCard("academic", formData)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white cursor-pointer shadow-xs"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs select-none">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">10th Percentage</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.academic?.gpa_10th ? `${profile?.academic?.gpa_10th}%` : "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">12th Percentage</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.academic?.gpa_12th ? `${profile?.academic?.gpa_12th}%` : "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bachelor's CGPA</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.academic?.cgpa_bachelors || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Master's CGPA</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.academic?.cgpa_masters || "—"}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card C: English & Standardized Tests */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-blue-600" />
                        <div>
                          <h2 className="text-sm font-extrabold text-slate-900">Standardized Test Scores</h2>
                          <p className="text-[11px] text-slate-500 mt-0.5">IELTS, TOEFL, PTE, GRE, and GMAT exam reports.</p>
                        </div>
                      </div>
                      {editingCard !== "standard_tests" && (
                        <button
                          onClick={() => startEditing("standard_tests", {
                            ielts_score: profile?.academic?.ielts_score || "",
                            ielts_expiry: profile?.academic?.ielts_expiry || "",
                            toefl_score: profile?.academic?.toefl_score || "",
                            toefl_expiry: profile?.academic?.toefl_expiry || "",
                            pte_score: profile?.academic?.pte_score || "",
                            pte_expiry: profile?.academic?.pte_expiry || "",
                            gre_score: profile?.academic?.gre_score || "",
                            gre_expiry: profile?.academic?.gre_expiry || "",
                            gmat_score: profile?.academic?.gmat_score || "",
                            gmat_expiry: profile?.academic?.gmat_expiry || ""
                          })}
                          className="px-3.5 py-1.5 text-xs font-bold border border-slate-250 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-650"
                        >
                          Edit
                        </button>
                      )}
                    </div>

                    {editingCard === "standard_tests" ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">IELTS Score</label>
                            <input
                              type="number"
                              step="0.5"
                              value={formData.ielts_score || ""}
                              onChange={(e) => setFormData({ ...formData, ielts_score: parseFloat(e.target.value) || null })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                              placeholder="e.g. 7.5"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">IELTS Expiry</label>
                            <input
                              type="date"
                              value={formData.ielts_expiry || ""}
                              onChange={(e) => setFormData({ ...formData, ielts_expiry: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">TOEFL Score</label>
                            <input
                              type="number"
                              value={formData.toefl_score || ""}
                              onChange={(e) => setFormData({ ...formData, toefl_score: parseFloat(e.target.value) || null })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                              placeholder="e.g. 104"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">TOEFL Expiry</label>
                            <input
                              type="date"
                              value={formData.toefl_expiry || ""}
                              onChange={(e) => setFormData({ ...formData, toefl_expiry: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">PTE Score</label>
                            <input
                              type="number"
                              value={formData.pte_score || ""}
                              onChange={(e) => setFormData({ ...formData, pte_score: parseFloat(e.target.value) || null })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                              placeholder="e.g. 72"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">PTE Expiry</label>
                            <input
                              type="date"
                              value={formData.pte_expiry || ""}
                              onChange={(e) => setFormData({ ...formData, pte_expiry: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">GRE Score</label>
                            <input
                              type="number"
                              value={formData.gre_score || ""}
                              onChange={(e) => setFormData({ ...formData, gre_score: parseFloat(e.target.value) || null })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                              placeholder="e.g. 318"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">GRE Expiry</label>
                            <input
                              type="date"
                              value={formData.gre_expiry || ""}
                              onChange={(e) => setFormData({ ...formData, gre_expiry: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">GMAT Score</label>
                            <input
                              type="number"
                              value={formData.gmat_score || ""}
                              onChange={(e) => setFormData({ ...formData, gmat_score: parseFloat(e.target.value) || null })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                              placeholder="e.g. 680"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">GMAT Expiry</label>
                            <input
                              type="date"
                              value={formData.gmat_expiry || ""}
                              onChange={(e) => setFormData({ ...formData, gmat_expiry: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2.5 pt-2">
                          <button
                            onClick={() => setEditingCard(null)}
                            className="px-4 py-2 bg-slate-150 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-650 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveCard("academic", formData)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white cursor-pointer shadow-xs"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs select-none">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">IELTS</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.academic?.ielts_score ? `${profile?.academic?.ielts_score} (Exp: ${profile?.academic?.ielts_expiry || "N/A"})` : "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOEFL</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.academic?.toefl_score ? `${profile?.academic?.toefl_score} (Exp: ${profile?.academic?.toefl_expiry || "N/A"})` : "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PTE Score</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.academic?.pte_score ? `${profile?.academic?.pte_score} (Exp: ${profile?.academic?.pte_expiry || "N/A"})` : "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GRE Score</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.academic?.gre_score ? `${profile?.academic?.gre_score} (Exp: ${profile?.academic?.gre_expiry || "N/A"})` : "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GMAT Score</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.academic?.gmat_score ? `${profile?.academic?.gmat_score} (Exp: ${profile?.academic?.gmat_expiry || "N/A"})` : "—"}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card D: Professional Experience & Certs */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                        <div>
                          <h2 className="text-sm font-extrabold text-slate-900">Work Experience & Certifications</h2>
                          <p className="text-[11px] text-slate-500 mt-0.5">Your professional history and supplementary credentials.</p>
                        </div>
                      </div>
                      {editingCard !== "work_certs" && (
                        <button
                          onClick={() => {
                            setNewWorkItem({ role: "", company: "", years: "" });
                            setNewCertItem("");
                            startEditing("work_certs", {
                              work_experience: profile?.academic?.work_experience || [],
                              certifications: profile?.academic?.certifications || []
                            });
                          }}
                          className="px-3.5 py-1.5 text-xs font-bold border border-slate-250 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-650"
                        >
                          Modify Lists
                        </button>
                      )}
                    </div>

                    {editingCard === "work_certs" ? (
                      <div className="space-y-6">
                        
                        {/* Work Experience array builder */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Add Work Experience</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                            <input
                              type="text"
                              placeholder="Role / Title (e.g. Intern)"
                              value={newWorkItem.role}
                              onChange={(e) => setNewWorkItem({ ...newWorkItem, role: e.target.value })}
                              className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium"
                            />
                            <input
                              type="text"
                              placeholder="Company"
                              value={newWorkItem.company}
                              onChange={(e) => setNewWorkItem({ ...newWorkItem, company: e.target.value })}
                              className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium"
                            />
                            <input
                              type="number"
                              placeholder="Years"
                              value={newWorkItem.years}
                              onChange={(e) => setNewWorkItem({ ...newWorkItem, years: e.target.value })}
                              className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium"
                            />
                          </div>
                          <button
                            onClick={() => {
                              if (!newWorkItem.role || !newWorkItem.company) {
                                showToast("Fill in both role and company details.", "info");
                                return;
                              }
                              const updated = [...formData.work_experience, { ...newWorkItem, years: parseInt(newWorkItem.years) || 0 }];
                              setFormData({ ...formData, work_experience: updated });
                              setNewWorkItem({ role: "", company: "", years: "" });
                            }}
                            className="w-full py-2 bg-slate-200 hover:bg-slate-250 text-xs font-bold rounded-lg text-slate-800 cursor-pointer"
                          >
                            + Append Experience
                          </button>

                          {formData.work_experience.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {formData.work_experience.map((work: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center bg-white border border-slate-150 p-2.5 rounded-xl text-xs font-bold">
                                  <span>{work.role} at {work.company} ({work.years} yrs)</span>
                                  <button
                                    onClick={() => {
                                      const updated = formData.work_experience.filter((_: any, i: number) => i !== idx);
                                      setFormData({ ...formData, work_experience: updated });
                                    }}
                                    className="text-rose-600 font-extrabold hover:underline"
                                  >
                                    Delete
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Certifications array builder */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Add Certifications</h4>
                          <div className="flex gap-2 mb-3">
                            <input
                              type="text"
                              placeholder="Certificate name (e.g. AWS Cloud Practitioner)"
                              value={newCertItem}
                              onChange={(e) => setNewCertItem(e.target.value)}
                              className="flex-1 bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium"
                            />
                            <button
                              onClick={() => {
                                if (!newCertItem.trim()) return;
                                const updated = [...formData.certifications, newCertItem.trim()];
                                setFormData({ ...formData, certifications: updated });
                                setNewCertItem("");
                              }}
                              className="px-4 bg-slate-255 hover:bg-slate-300 text-xs font-bold rounded-lg text-slate-800 cursor-pointer"
                            >
                              Add
                            </button>
                          </div>

                          {formData.certifications.length > 0 && (
                            <div className="space-y-2">
                              {formData.certifications.map((cert: string, idx: number) => (
                                <div key={idx} className="flex justify-between items-center bg-white border border-slate-150 p-2.5 rounded-xl text-xs font-bold">
                                  <span>{cert}</span>
                                  <button
                                    onClick={() => {
                                      const updated = formData.certifications.filter((_: any, i: number) => i !== idx);
                                      setFormData({ ...formData, certifications: updated });
                                    }}
                                    className="text-rose-600 font-extrabold hover:underline"
                                  >
                                    Delete
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end gap-2.5 pt-2">
                          <button
                            onClick={() => setEditingCard(null)}
                            className="px-4 py-2 bg-slate-150 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-650 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveCard("academic", formData)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white cursor-pointer shadow-xs"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 text-xs select-none">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Work Experience</p>
                          {(!profile?.academic?.work_experience || profile?.academic?.work_experience?.length === 0) ? (
                            <p className="text-slate-400 font-semibold italic text-xs">No work experience listed.</p>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {profile?.academic?.work_experience?.map((work: any, idx: number) => (
                                <div key={idx} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-bold">
                                  <div>
                                    <p className="text-slate-800">{work.role}</p>
                                    <p className="text-slate-500 text-[10px] font-medium mt-0.5">{work.company}</p>
                                  </div>
                                  <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-650">{work.years} yrs</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Certifications</p>
                          {(!profile?.academic?.certifications || profile?.academic?.certifications?.length === 0) ? (
                            <p className="text-slate-400 font-semibold italic text-xs">No certifications uploaded.</p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {profile?.academic?.certifications?.map((cert: string, idx: number) => (
                                <span key={idx} className="inline-flex px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-[10px] font-bold">
                                  {cert}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* 🌍 TAB 3: Study Preferences */}
              {activeTab === "preferences" && profile && (
                <div className="space-y-6">
                  
                  {/* Card A: Study Abroad Preferences */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <Compass className="h-5 w-5 text-blue-600" />
                        <div>
                          <h2 className="text-sm font-extrabold text-slate-900">Study Abroad Destinations</h2>
                          <p className="text-[11px] text-slate-500 mt-0.5">Your target destinations, degree levels, and intakes.</p>
                        </div>
                      </div>
                      {editingCard !== "study_pref" && (
                        <button
                          onClick={() => startEditing("study_pref", {
                            preferred_countries_str: (profile?.preferences?.preferred_countries || []).join(", "),
                            preferred_courses_str: (profile?.preferences?.preferred_courses || []).join(", "),
                            preferred_universities_str: (profile?.preferences?.preferred_universities || []).join(", "),
                            degree_level: profile?.preferences?.degree_level || "",
                            target_intake: profile?.preferences?.target_intake || "",
                            career_goals: profile?.preferences?.career_goals || ""
                          })}
                          className="px-3.5 py-1.5 text-xs font-bold border border-slate-250 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-650"
                        >
                          Edit
                        </button>
                      )}
                    </div>

                    {editingCard === "study_pref" ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Countries (comma separated)</label>
                            <input
                              type="text"
                              value={formData.preferred_countries_str || ""}
                              onChange={(e) => setFormData({ ...formData, preferred_countries_str: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Preferred Courses (comma separated)</label>
                            <input
                              type="text"
                              value={formData.preferred_courses_str || ""}
                              onChange={(e) => setFormData({ ...formData, preferred_courses_str: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Preferred Universities</label>
                            <input
                              type="text"
                              value={formData.preferred_universities_str || ""}
                              onChange={(e) => setFormData({ ...formData, preferred_universities_str: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Intake</label>
                            <input
                              type="text"
                              value={formData.target_intake || ""}
                              onChange={(e) => setFormData({ ...formData, target_intake: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Degree Level</label>
                            <select
                              value={formData.degree_level || ""}
                              onChange={(e) => setFormData({ ...formData, degree_level: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            >
                              <option value="">Select Level</option>
                              <option value="Bachelors">Bachelor's Degree</option>
                              <option value="Masters">Master's Degree</option>
                              <option value="PhD">Doctorate / PhD</option>
                              <option value="Diploma">Diploma Pathways</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Career & Study Goals</label>
                          <textarea
                            value={formData.career_goals || ""}
                            onChange={(e) => setFormData({ ...formData, career_goals: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all h-24 resize-none font-semibold"
                          />
                        </div>

                        <div className="flex justify-end gap-2.5 pt-2">
                          <button
                            onClick={() => setEditingCard(null)}
                            className="px-4 py-2 bg-slate-150 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-650 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              const countries = (formData.preferred_countries_str || "").split(",").map((s: string) => s.trim()).filter(Boolean);
                              const courses = (formData.preferred_courses_str || "").split(",").map((s: string) => s.trim()).filter(Boolean);
                              const unis = (formData.preferred_universities_str || "").split(",").map((s: string) => s.trim()).filter(Boolean);
                              
                              const { preferred_countries_str, preferred_courses_str, preferred_universities_str, ...rest } = formData;
                              handleSaveCard("preferences", {
                                ...rest,
                                preferred_countries: countries,
                                preferred_courses: courses,
                                preferred_universities: unis
                              });
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white cursor-pointer shadow-xs"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 text-xs select-none">
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preferred Countries</p>
                            <p className="text-slate-800 font-bold mt-1 text-xs">{(profile?.preferences?.preferred_countries || []).join(", ") || "—"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preferred Courses</p>
                            <p className="text-slate-800 font-bold mt-1 text-xs">{(profile?.preferences?.preferred_courses || []).join(", ") || "—"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Universities</p>
                            <p className="text-slate-800 font-bold mt-1 text-xs">{(profile?.preferences?.preferred_universities || []).join(", ") || "—"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Degree Level</p>
                            <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.preferences?.degree_level || "—"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Intake</p>
                            <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.preferences?.target_intake || "—"}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Career Goals</p>
                          <p className="text-slate-700 font-semibold mt-1 text-xs leading-relaxed">{profile?.preferences?.career_goals || "—"}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card B: Funding & Financial Profile (Merged from Financial Tab!) */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                        <div>
                          <h2 className="text-sm font-extrabold text-slate-900">Financial Profile & Budget</h2>
                          <p className="text-[11px] text-slate-500 mt-0.5">Budget parameters and liquid savings capabilities.</p>
                        </div>
                      </div>
                      {editingCard !== "financial_budget" && (
                        <button
                          onClick={() => startEditing("financial_budget", {
                            budget: profile?.preferences?.budget || "",
                            scholarship_required: !!profile?.preferences?.scholarship_required,
                            annual_family_income: profile?.financial?.annual_family_income || "",
                            savings: profile?.financial?.savings || 0,
                            education_loan: profile?.financial?.education_loan || 0,
                            sponsor: profile?.financial?.sponsor || "",
                            currency: profile?.financial?.currency || "USD"
                          })}
                          className="px-3.5 py-1.5 text-xs font-bold border border-slate-250 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-650"
                        >
                          Edit
                        </button>
                      )}
                    </div>

                    {editingCard === "financial_budget" ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Maximum Annual Budget</label>
                            <input
                              type="text"
                              value={formData.budget || ""}
                              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                              placeholder="e.g. $30,000 USD"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Annual Family Income</label>
                            <input
                              type="text"
                              value={formData.annual_family_income || ""}
                              onChange={(e) => setFormData({ ...formData, annual_family_income: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                              placeholder="e.g. 10 LPA"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Liquid Savings</label>
                            <input
                              type="number"
                              value={formData.savings ?? 0}
                              onChange={(e) => setFormData({ ...formData, savings: parseFloat(e.target.value) || 0 })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Approved Education Loan</label>
                            <input
                              type="number"
                              value={formData.education_loan ?? 0}
                              onChange={(e) => setFormData({ ...formData, education_loan: parseFloat(e.target.value) || 0 })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sponsor Relationship</label>
                            <input
                              type="text"
                              value={formData.sponsor || ""}
                              onChange={(e) => setFormData({ ...formData, sponsor: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-semibold"
                              placeholder="e.g. Father, Self"
                            />
                          </div>
                          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                            <input
                              type="checkbox"
                              id="scholarship_req_card"
                              checked={formData.scholarship_required || false}
                              onChange={(e) => setFormData({ ...formData, scholarship_required: e.target.checked })}
                              className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="scholarship_req_card" className="text-xs font-bold text-slate-655 cursor-pointer">
                              Scholarship Required
                            </label>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2.5 pt-2">
                          <button
                            onClick={() => setEditingCard(null)}
                            className="px-4 py-2 bg-slate-150 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-650 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              const pref = { budget: formData.budget, scholarship_required: formData.scholarship_required };
                              const fin = {
                                annual_family_income: formData.annual_family_income,
                                savings: formData.savings,
                                education_loan: formData.education_loan,
                                sponsor: formData.sponsor,
                                currency: formData.currency || "USD"
                              };
                              handleSavePreferencesAndFinancials(pref, fin);
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white cursor-pointer shadow-xs"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs select-none">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Max Annual Budget</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.preferences?.budget || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Annual Family Income</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.financial?.annual_family_income || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Liquid Savings</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{(profile?.financial?.savings ?? 0).toLocaleString()} {profile?.financial?.currency}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Education Loan approved</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{(profile?.financial?.education_loan ?? 0).toLocaleString()} {profile?.financial?.currency}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sponsor</p>
                          <p className="text-slate-800 font-bold mt-1 text-xs">{profile?.financial?.sponsor || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scholarship Required</p>
                          <p className={`mt-1 text-xs font-bold ${profile?.preferences?.scholarship_required ? "text-blue-600" : "text-slate-500"}`}>
                            {profile?.preferences?.scholarship_required ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card C: Billing & Invoices (Contextual migration) */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex items-center gap-3 mb-6">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <h2 className="text-sm font-extrabold text-slate-900">Billing & Receipts</h2>
                        <p className="text-[11px] text-slate-500 mt-0.5">Download receipts for purchased premium services.</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto select-none">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            <th className="pb-3 pr-4">Invoice ID</th>
                            <th className="pb-3 px-4">Service</th>
                            <th className="pb-3 px-4 text-right">Amount</th>
                            <th className="pb-3 pl-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="text-center text-xs text-slate-400 py-6 italic font-medium">No purchases logged.</td>
                            </tr>
                          ) : (
                            invoices.map((inv) => (
                              <tr key={inv.id} className="border-b border-slate-50 text-[11px] font-bold text-slate-700 hover:bg-slate-50/50">
                                <td className="py-3 pr-4 font-mono">{inv.receipt_number}</td>
                                <td className="py-3 px-4 text-slate-600">{inv.service_title}</td>
                                <td className="py-3 px-4 text-right text-slate-900 font-extrabold">₹{inv.amount}</td>
                                <td className="py-3 pl-4 text-center">
                                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full text-[9px] uppercase font-bold">
                                    {inv.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* 📂 TAB 4: Documents */}
              {activeTab === "documents" && (
                <div className="space-y-6">
                  
                  {/* Documents list and upload controls */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <h2 className="text-sm font-extrabold text-slate-900">Document Vault</h2>
                          <p className="text-[11px] text-slate-500 mt-0.5">Upload SOP, resume, passport, and transcripts.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 select-none">
                        <select
                          value={uploadCategory}
                          onChange={(e) => setUploadCategory(e.target.value)}
                          className="bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
                        >
                          <option value="Passport">Passport</option>
                          <option value="Resume">Resume</option>
                          <option value="SOP">SOP</option>
                          <option value="Academic">Academic Document</option>
                          <option value="Financial">Financial Document</option>
                          <option value="Visa">Visa Document</option>
                        </select>
                        <button
                          onClick={() => docInputRef.current?.click()}
                          disabled={uploadingDoc}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          {uploadingDoc ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <FileUp className="h-4 w-4" />
                          )}
                          Upload File
                        </button>
                        <input
                          type="file"
                          ref={docInputRef}
                          onChange={handleUploadDocument}
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                        />
                      </div>
                    </div>

                    {/* Category quick filters */}
                    <div className="flex flex-wrap gap-1.5 mb-6 bg-slate-50/80 p-1 rounded-2xl border border-slate-100 select-none">
                      {["All", "Passport", "Resume", "SOP", "Academic", "Financial", "Visa"].map((cat) => {
                        const isSel = docCategoryFilter === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setDocCategoryFilter(cat)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                              isSel ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>

                    {/* Documents matching filter */}
                    <div className="space-y-3">
                      {documents.filter(d => docCategoryFilter === "All" || d.category.toLowerCase() === docCategoryFilter.toLowerCase()).length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl">
                          <UploadCloud className="h-10 w-10 text-slate-300 mb-3" />
                          <h4 className="font-extrabold text-sm text-slate-800 mb-1">No Files Found</h4>
                          <p className="text-xs text-slate-400 text-center max-w-xs leading-relaxed font-medium">Upload files in this category to link directly with matching suites.</p>
                        </div>
                      ) : (
                        documents
                          .filter(d => docCategoryFilter === "All" || d.category.toLowerCase() === docCategoryFilter.toLowerCase())
                          .map((doc) => (
                            <div
                              key={doc.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl gap-4 hover:border-slate-300 transition-all shadow-xs"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-slate-800 truncate pr-4">{doc.filename}</h4>
                                  <div className="flex items-center gap-2 mt-1 select-none">
                                    <span className="text-[9px] bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-full text-slate-600 font-bold">
                                      {doc.category}
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-bold">
                                      {Math.round(doc.file_size / 1024)} KB
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 select-none">
                                <button
                                  onClick={() => handleDownloadDoc(doc.id)}
                                  className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-slate-900 transition-all cursor-pointer shadow-xs"
                                  title="Download File"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setNewDocName(doc.filename);
                                    setRenameDocId(doc.id);
                                  }}
                                  className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-slate-900 transition-all cursor-pointer shadow-xs"
                                  title="Rename File"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteDocId(doc.id)}
                                  className="p-2 border border-rose-100 bg-rose-50/20 hover:bg-rose-50 rounded-xl text-rose-600 transition-all cursor-pointer shadow-xs"
                                  title="Delete File"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  {/* Rename Modal Dialog */}
                  {renameDocId && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                      <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-xl">
                        <h3 className="text-sm font-extrabold text-slate-900 mb-3">Rename Document</h3>
                        <input
                          type="text"
                          value={newDocName}
                          onChange={(e) => setNewDocName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
                        />
                        <div className="flex justify-end gap-2 text-xs select-none">
                          <button
                            onClick={() => setRenameDocId(null)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-150 rounded-xl text-slate-650 font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleRenameDocument}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold cursor-pointer shadow-xs"
                          >
                            Rename
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Confirm Delete Document Modal */}
                  {deleteDocId && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                      <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-xl">
                        <h3 className="text-sm font-extrabold text-slate-900 mb-2">Delete Vault Document?</h3>
                        <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">This will permanently delete the file copy from our secure storage servers.</p>
                        <div className="flex justify-end gap-2 text-xs select-none">
                          <button
                            onClick={() => setDeleteDocId(null)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-150 rounded-xl text-slate-655 font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleDeleteDocument}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 rounded-xl text-white font-bold cursor-pointer shadow-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* 🔔 TAB 5: Notifications */}
              {activeTab === "notifications" && settings && (
                <div className="space-y-6">
                  
                  {/* Card A: Channel Preferences */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex items-center gap-3 mb-6">
                      <Bell className="h-5 w-5 text-blue-600" />
                      <div>
                        <h2 className="text-sm font-extrabold text-slate-900">Communication Channels</h2>
                        <p className="text-[11px] text-slate-500 mt-0.5">Toggle how you want to be notified about deadlines and acceptances.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-slate-100">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Email Alerts</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Deadline details sent directly to your inbox.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={!!settings?.notifications?.email}
                          onChange={(e) => handleNotificationChange("email", e.target.checked)}
                          className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-slate-100">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">WhatsApp Dispatch</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Real-time chat acceptances and advisor reminders.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={!!settings?.notifications?.whatsapp}
                          onChange={(e) => handleNotificationChange("whatsapp", e.target.checked)}
                          className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between py-3">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">In-App Alerts</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Show panel notifications inside the dashboard header bell.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={!!settings?.notifications?.in_app}
                          onChange={(e) => handleNotificationChange("in_app", e.target.checked)}
                          className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card B: Topic Notifications */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex items-center gap-3 mb-6">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <div>
                        <h2 className="text-sm font-extrabold text-slate-900">Alert Categories</h2>
                        <p className="text-[11px] text-slate-500 mt-0.5">Choose which topics trigger platform updates.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-slate-100">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">AI Matches & Updates</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">New university recommendation updates.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={!!settings?.notifications?.ai_updates}
                          onChange={(e) => handleNotificationChange("ai_updates", e.target.checked)}
                          className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-slate-100">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Consultation Bookings</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Reminders for advisor sessions and scheduled calls.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={!!settings?.notifications?.consultation}
                          onChange={(e) => handleNotificationChange("consultation", e.target.checked)}
                          className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-slate-100">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Payment & Invoice alerts</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Billing notices and premium subscription details.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={!!settings?.notifications?.payments}
                          onChange={(e) => handleNotificationChange("payments", e.target.checked)}
                          className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-slate-100">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Scholarship Alerts</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Notifications regarding fresh waiver grants.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={!!settings?.notifications?.scholarships}
                          onChange={(e) => handleNotificationChange("scholarships", e.target.checked)}
                          className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between py-3">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Visa Milestones</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Updates regarding checklist audits and mock scheduling.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={!!settings?.notifications?.visa}
                          onChange={(e) => handleNotificationChange("visa", e.target.checked)}
                          className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* 🔒 TAB 6: Security */}
              {activeTab === "security" && settings && (
                <div className="space-y-6">
                  
                  {/* Card A: MFA & Password */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex items-center gap-3 mb-6">
                      <Lock className="h-5 w-5 text-blue-600" />
                      <div>
                        <h2 className="text-sm font-extrabold text-slate-900">Authentication Settings</h2>
                        <p className="text-[11px] text-slate-500 mt-0.5">Manage password configs and Multi-Factor Authentication.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Password Access</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Change password credentials regularly.</p>
                        </div>
                        <button
                          onClick={() => showToast("Simulated password reset email dispatched.", "success")}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-700 cursor-pointer shadow-xs border border-slate-200/50"
                        >
                          Change Password
                        </button>
                      </div>

                      <div className="flex justify-between items-center py-3">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">Two-Factor Checks (MFA)</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Secures device checks during authentication audits.</p>
                        </div>
                        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full select-none">
                          Architecture Ready
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card B: Google Connection (Merged Connected Accounts!) */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex items-center gap-3 mb-6">
                      <Link2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <h2 className="text-sm font-extrabold text-slate-900">Connected Accounts</h2>
                        <p className="text-[11px] text-slate-500 mt-0.5">OAuth identities linked for single sign-on checks.</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {(!settings?.connected_accounts || settings?.connected_accounts?.length === 0) ? (
                        <p className="text-xs text-slate-400 italic">No connected accounts.</p>
                      ) : (
                        settings?.connected_accounts?.map((acc, idx) => (
                          <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-xs">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-blue-500/10">
                                G
                              </div>
                              <div>
                                <p className="text-xs font-extrabold text-slate-850 capitalize">{acc?.provider} Login</p>
                                <p className="text-[10px] text-slate-500 font-medium">{acc?.email || "Linked Identity"}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-xl select-none">
                              Active Connected
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Card C: Active Devices */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex items-center gap-3 mb-6">
                      <Monitor className="h-5 w-5 text-blue-600" />
                      <div>
                        <h2 className="text-sm font-extrabold text-slate-900">Active Login Sessions</h2>
                        <p className="text-[11px] text-slate-500 mt-0.5">Sessions currently logged into this student profile.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-3">
                        {(settings?.security?.active_sessions || [])?.map((sess, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0">
                            <div>
                              <p className="text-xs font-bold text-slate-855">{sess?.device}</p>
                              <p className="text-[9px] text-slate-400 font-bold mt-0.5">IP: {sess?.ip}</p>
                            </div>
                            <span className="text-[9px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold select-none">
                              Active Now
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => showToast("Simulated device logout triggered.", "success")}
                        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-700 cursor-pointer shadow-xs border border-slate-200"
                      >
                        Logout Other Devices
                      </button>
                    </div>
                  </div>

                  {/* Card D: General Preferences (Merged Theme, Language, Privacy, Export, Delete!) */}
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs">
                    <div className="flex items-center gap-3 mb-6">
                      <Settings className="h-5 w-5 text-blue-600" />
                      <div>
                        <h2 className="text-sm font-extrabold text-slate-900">General Preferences</h2>
                        <p className="text-[11px] text-slate-500 mt-0.5">Language configurations, data portability, and account options.</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      
                      {/* Theme & Language row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Preferred Language */}
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Preferred Language</label>
                          <select
                            value={settings?.language?.preferred_language || "English"}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-bold focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
                          >
                            <option value="English">English</option>
                            <option value="Hindi">Hindi (हिंदी)</option>
                          </select>
                        </div>

                        {/* Theme */}
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Interface Theme</label>
                          <select
                            value={settings?.appearance?.theme || "light"}
                            onChange={(e) => handleThemeChange(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-bold focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs"
                          >
                            <option value="light">Light Theme</option>
                            <option value="dark">Dark Theme</option>
                          </select>
                        </div>
                      </div>

                      {/* Policy links */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-t border-b border-slate-100 gap-3 select-none">
                        <div className="flex gap-4 text-xs font-bold text-blue-600">
                          <a href="/privacy-policy" target="_blank" className="hover:underline">Privacy Policy</a>
                          <a href="/terms" target="_blank" className="hover:underline">Terms of Service</a>
                        </div>
                        <button
                          onClick={handleProfileExport}
                          className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-bold rounded-xl text-slate-700 border border-slate-200 shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download JSON Data
                        </button>
                      </div>

                      {/* Delete profile option */}
                      <div className="p-4 bg-rose-50/20 border border-rose-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h4 className="text-xs font-extrabold text-rose-700">Permanent Account Deletion</h4>
                          <p className="text-[10px] text-rose-600 font-semibold mt-0.5 leading-relaxed">Remove all eligibility profile logs and files completely.</p>
                        </div>
                        <button
                          onClick={handleAccountDeletion}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-xs font-bold rounded-xl text-white shadow-xs cursor-pointer"
                        >
                          Delete Account
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>

        {/* RIGHT COLUMN: Profile Completion & AI Suggestions */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Profile Completion Card */}
          {profile && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col gap-4 shadow-xs">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Profile Completion</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Keep your credentials fresh for matching audits.</p>
              </div>
              
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5 text-slate-650">
                  <span>Overall Setup</span>
                  <span className="text-blue-600 font-black">{profile.completion_scores.overall}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${profile.completion_scores.overall}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-slate-100 select-none">
                {getCompletionChecklist().map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">{item.name}</span>
                    <span className={`font-black ${item.score === 100 ? "text-emerald-600" : "text-slate-700"}`}>
                      {item.score}%
                    </span>
                  </div>
                ))}
              </div>

              {/* AI Recommendation Box */}
              <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-4 flex gap-3 mt-1 shadow-xs">
                <Sparkles className="h-5 w-5 text-blue-600 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="text-xs font-extrabold text-blue-900">Aura AI Recommendation</h4>
                  <p className="text-[10px] text-blue-800 leading-relaxed mt-1 font-semibold">
                    {getAIRecommendation()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Aura AI Suggestions Card */}
          {profile && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col gap-4 shadow-xs">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Aura AI Suggestions</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Opportunities based on profile matching logs.</p>
              </div>

              <div className="space-y-4">
                {/* Destination matching */}
                <div className="flex gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-xs">
                    <BookOpen className="h-4.5 w-4.5 text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800">Target Matches</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-semibold">
                      {profile?.preferences?.preferred_countries && profile?.preferences?.preferred_countries?.length > 0 ? (
                        `Matching universities in ${profile?.preferences?.preferred_countries?.join(", ")}.`
                      ) : (
                        "Add target study destinations to receive matching options."
                      )}
                    </p>
                  </div>
                </div>

                {/* Scholarship Opportunities */}
                <div className="flex gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 shadow-xs">
                    <Award className="h-4.5 w-4.5 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800">Scholarships</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-semibold">
                      {profile?.preferences?.scholarship_required ? (
                        "Matching with Commonwealth & Global Excellence grants."
                      ) : (
                        "Flag scholarship requirements in preferences to scan waiver programs."
                      )}
                    </p>
                  </div>
                </div>

                {/* Visa Readiness */}
                <div className="flex gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-xs">
                    <Activity className="h-4.5 w-4.5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800">Visa Audit Estimate</h4>
                    <div className="flex items-center gap-2 mt-1.5 select-none">
                      <div className="w-16 h-1.5 bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${getVisaReadiness()}%` }} />
                      </div>
                      <span className="text-[9px] font-black text-slate-600">{getVisaReadiness()}% Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

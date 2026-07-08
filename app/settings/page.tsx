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
  UserCheck
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

// Tab types matching sidebar items
type ActiveTab =
  | "profile"
  | "academic"
  | "preferences"
  | "financial"
  | "documents"
  | "notifications"
  | "privacy"
  | "security"
  | "connected"
  | "appearance"
  | "language"
  | "account";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");

  // Data States
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [settings, setSettings] = useState<StudentSettingsResponse | null>(null);
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modal / Form States
  const [uploadCategory, setUploadCategory] = useState<string>("Academic");
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [renameDocId, setRenameDocId] = useState<string | null>(null);
  const [newDocName, setNewDocName] = useState<string>("");
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);
  
  // Custom states for list arrays
  const [newPaper, setNewPaper] = useState({ title: "", journal: "", year: "" });
  const [newProject, setNewProject] = useState({ title: "", description: "", url: "" });
  const [newWork, setNewWork] = useState({ role: "", company: "", years: 0 });

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
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

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
      } catch (err: any) {
        showToast(err.message || "Failed to load setting records.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [user, authLoading, router]);

  // Debounced field updates / autosave handler
  const handleAutosave = async (
    section: "personal" | "academic" | "preferences" | "financial",
    field: string,
    value: any
  ) => {
    if (!profile) return;
    setSavingField(`${section}.${field}`);
    try {
      const payload = {
        [section]: { [field]: value }
      };
      const updated = await updateStudentProfile(payload);
      setProfile(updated);
      showToast("Changes saved automatically", "success");
    } catch (err: any) {
      showToast(err.message || "Autosave failed.", "error");
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
      setSettings({
        ...settings,
        notifications: { ...settings.notifications, [key]: value }
      });
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
      await updateUserSettings({
        appearance: { theme: themeName }
      });
      setSettings({
        ...settings,
        appearance: { ...settings.appearance, theme: themeName }
      });
      showToast(`Theme switched to ${themeName}`, "success");
      // Set global HTML class for preview
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
      await updateUserSettings({
        language: { preferred_language: langName, supported_languages: ["English", "Hindi"] }
      });
      setSettings({
        ...settings,
        language: { ...settings.language, preferred_language: langName }
      });
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
      // Update profile scores since documents changed
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
      // Re-fetch profile for updated completion scores
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
    { id: "profile", label: "Profile", icon: User },
    { id: "academic", label: "Academic Profile", icon: BookOpen },
    { id: "preferences", label: "Study Preferences", icon: Compass },
    { id: "financial", label: "Financial Profile", icon: DollarSign },
    { id: "documents", label: "Documents Vault", icon: FileText },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Data", icon: ShieldAlert },
    { id: "security", label: "Security & Logins", icon: Lock },
    { id: "connected", label: "Connected Accounts", icon: Link2 },
    { id: "appearance", label: "Appearance Theme", icon: Palette },
    { id: "language", label: "System Language", icon: Globe },
    { id: "account", label: "Account Options", icon: Settings }
  ];

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-zinc-400 text-sm animate-pulse">Initializing Master Profile Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-10 px-4 md:px-8 font-sans">
      
      {/* Toast Alert Portal */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 border ${
                toast.type === "success"
                  ? "bg-zinc-900/95 border-emerald-500/30 text-emerald-400"
                  : toast.type === "error"
                  ? "bg-zinc-900/95 border-rose-500/30 text-rose-400"
                  : "bg-zinc-900/95 border-indigo-500/30 text-indigo-400"
              }`}
            >
              {toast.type === "success" && <CheckCircle2 className="h-5 w-5 shrink-0" />}
              {toast.type === "error" && <AlertTriangle className="h-5 w-5 shrink-0" />}
              {toast.type === "info" && <Loader2 className="h-5 w-5 animate-spin shrink-0" />}
              <span className="text-xs font-medium text-zinc-200">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN: Sidebar Navigation & HUD */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Profile HUD score widget */}
          {profile && (
            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                  {profile.photo_url ? (
                    <img src={profile.photo_url} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-zinc-500" />
                  )}
                  {uploadingDoc && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-200 text-sm truncate max-w-[150px]">
                    {profile.personal.full_name || "Aura Student"}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <UserCheck className={`h-3.5 w-3.5 ${profile.verification_status === "Verified" ? "text-emerald-400" : "text-amber-500"}`} />
                    <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                      {profile.verification_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Completeness meters */}
              <div className="mt-2 space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1 text-zinc-400">
                    <span>Overall Setup</span>
                    <span className="text-indigo-400 font-bold">{profile.completion_scores.overall}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${profile.completion_scores.overall}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80">
                  <div>
                    <div className="text-[10px] text-zinc-500">Academic Setup</div>
                    <div className="text-xs font-bold text-zinc-300">{profile.completion_scores.academic}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500">Financial Setup</div>
                    <div className="text-xs font-bold text-zinc-300">{profile.completion_scores.financial}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Sidebar */}
          <nav className="bg-zinc-900/40 border border-zinc-850 rounded-3xl p-3 flex flex-col gap-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? "text-white" : "text-zinc-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* RIGHT COLUMN: Settings Detail Panels */}
        <div className="lg:col-span-3 bg-zinc-900/30 border border-zinc-850 rounded-3xl p-6 md:p-8 backdrop-blur-sm min-h-[600px]">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              
              {/* TAB 1: Profile (Personal Information) */}
              {activeTab === "profile" && profile && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Personal Information</h2>
                  <p className="text-xs text-zinc-400 mb-6">Update your basic details used for admissions and visa filings.</p>
                  
                  {/* Avatar section */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-zinc-900/60 rounded-2xl border border-zinc-800/80 mb-6">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
                      {profile.photo_url ? (
                        <img src={profile.photo_url} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-10 w-10 text-zinc-600" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => avatarInputRef.current?.click()}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-lg text-white transition-all flex items-center gap-1.5"
                        >
                          <UploadCloud className="h-4 w-4" />
                          Change Picture
                        </button>
                        {profile.photo_url && (
                          <button
                            onClick={handleAvatarDelete}
                            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-750 text-xs font-semibold rounded-lg text-rose-400 transition-all"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-500">Supports JPG, PNG, or WebP. Max 4MB size.</span>
                      <input
                        type="file"
                        ref={avatarInputRef}
                        onChange={handleAvatarChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        defaultValue={profile.personal.full_name || ""}
                        onBlur={(e) => handleAutosave("personal", "full_name", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        defaultValue={profile.personal.email || ""}
                        onBlur={(e) => handleAutosave("personal", "email", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="john.doe@gmail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        defaultValue={profile.personal.phone || ""}
                        onBlur={(e) => handleAutosave("personal", "phone", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="+91-9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Nationality</label>
                      <input
                        type="text"
                        defaultValue={profile.personal.nationality || ""}
                        onBlur={(e) => handleAutosave("personal", "nationality", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="Indian"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Country of Residence</label>
                      <input
                        type="text"
                        defaultValue={profile.personal.country_residence || ""}
                        onBlur={(e) => handleAutosave("personal", "country_residence", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="India"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">City</label>
                      <input
                        type="text"
                        defaultValue={profile.personal.city || ""}
                        onBlur={(e) => handleAutosave("personal", "city", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="New Delhi"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Gender</label>
                      <select
                        defaultValue={profile.personal.gender || ""}
                        onChange={(e) => handleAutosave("personal", "gender", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-300 transition-all"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Date of Birth</label>
                      <input
                        type="date"
                        defaultValue={profile.personal.date_of_birth || ""}
                        onBlur={(e) => handleAutosave("personal", "date_of_birth", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                      />
                    </div>
                  </div>

                  <hr className="my-8 border-zinc-800/80" />

                  {/* Passport details */}
                  <h3 className="text-sm font-bold text-white mb-4">Passport Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Passport Number</label>
                      <input
                        type="text"
                        defaultValue={profile.personal.passport_number || ""}
                        onBlur={(e) => handleAutosave("personal", "passport_number", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="P1234567"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Passport Expiry Date</label>
                      <input
                        type="date"
                        defaultValue={profile.personal.passport_expiry || ""}
                        onBlur={(e) => handleAutosave("personal", "passport_expiry", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                      />
                    </div>
                  </div>

                  <hr className="my-8 border-zinc-800/80" />

                  {/* Emergency contact */}
                  <h3 className="text-sm font-bold text-white mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Contact Name</label>
                      <input
                        type="text"
                        defaultValue={profile.personal.emergency_contact_name || ""}
                        onBlur={(e) => handleAutosave("personal", "emergency_contact_name", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Relation</label>
                      <input
                        type="text"
                        defaultValue={profile.personal.emergency_contact_relation || ""}
                        onBlur={(e) => handleAutosave("personal", "emergency_contact_relation", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="Father / Mother / Spouse"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Contact Phone</label>
                      <input
                        type="text"
                        defaultValue={profile.personal.emergency_contact_phone || ""}
                        onBlur={(e) => handleAutosave("personal", "emergency_contact_phone", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="Phone"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Academic Profile */}
              {activeTab === "academic" && profile && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Academic Profile</h2>
                  <p className="text-xs text-zinc-400 mb-6">Enter your qualifications, backlogs, test scores, and research papers.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Highest Qualification</label>
                      <input
                        type="text"
                        defaultValue={profile.academic.highest_qualification || ""}
                        onBlur={(e) => handleAutosave("academic", "highest_qualification", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="Bachelor of Science"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Graduation Year</label>
                      <input
                        type="number"
                        defaultValue={profile.academic.grad_year || ""}
                        onBlur={(e) => handleAutosave("academic", "grad_year", parseInt(e.target.value) || null)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="2025"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">10th Percentage</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={profile.academic.gpa_10th || ""}
                        onBlur={(e) => handleAutosave("academic", "gpa_10th", parseFloat(e.target.value) || null)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="92.4"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">12th Percentage</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={profile.academic.gpa_12th || ""}
                        onBlur={(e) => handleAutosave("academic", "gpa_12th", parseFloat(e.target.value) || null)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="95.0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Bachelor's CGPA</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={profile.academic.cgpa_bachelors || ""}
                        onBlur={(e) => handleAutosave("academic", "cgpa_bachelors", parseFloat(e.target.value) || null)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="8.9"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Master's CGPA</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={profile.academic.cgpa_masters || ""}
                        onBlur={(e) => handleAutosave("academic", "cgpa_masters", parseFloat(e.target.value) || null)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">University Name</label>
                      <input
                        type="text"
                        defaultValue={profile.academic.university || ""}
                        onBlur={(e) => handleAutosave("academic", "university", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="Delhi University"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">College</label>
                      <input
                        type="text"
                        defaultValue={profile.academic.college || ""}
                        onBlur={(e) => handleAutosave("academic", "college", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="St. Stephen's College"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Active Backlogs</label>
                      <input
                        type="number"
                        defaultValue={profile.academic.backlogs}
                        onBlur={(e) => handleAutosave("academic", "backlogs", parseInt(e.target.value) || 0)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <hr className="my-8 border-zinc-800/80" />

                  {/* Standardized test scores */}
                  <h3 className="text-sm font-bold text-white mb-4">English & Standardized Tests</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* IELTS */}
                    <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                      <label className="block text-xs font-bold text-zinc-300 mb-2">IELTS</label>
                      <div className="space-y-3">
                        <input
                          type="number"
                          step="0.5"
                          placeholder="Score"
                          defaultValue={profile.academic.ielts_score || ""}
                          onBlur={(e) => handleAutosave("academic", "ielts_score", parseFloat(e.target.value) || null)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                        <input
                          type="date"
                          placeholder="Expiry"
                          defaultValue={profile.academic.ielts_expiry || ""}
                          onBlur={(e) => handleAutosave("academic", "ielts_expiry", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-[10px] text-white"
                        />
                      </div>
                    </div>

                    {/* TOEFL */}
                    <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                      <label className="block text-xs font-bold text-zinc-300 mb-2">TOEFL</label>
                      <div className="space-y-3">
                        <input
                          type="number"
                          placeholder="Score"
                          defaultValue={profile.academic.toefl_score || ""}
                          onBlur={(e) => handleAutosave("academic", "toefl_score", parseFloat(e.target.value) || null)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                        <input
                          type="date"
                          placeholder="Expiry"
                          defaultValue={profile.academic.toefl_expiry || ""}
                          onBlur={(e) => handleAutosave("academic", "toefl_expiry", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-[10px] text-white"
                        />
                      </div>
                    </div>

                    {/* GMAT */}
                    <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                      <label className="block text-xs font-bold text-zinc-300 mb-2">GMAT</label>
                      <div className="space-y-3">
                        <input
                          type="number"
                          placeholder="Score"
                          defaultValue={profile.academic.gmat_score || ""}
                          onBlur={(e) => handleAutosave("academic", "gmat_score", parseFloat(e.target.value) || null)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                        />
                        <input
                          type="date"
                          placeholder="Expiry"
                          defaultValue={profile.academic.gmat_expiry || ""}
                          onBlur={(e) => handleAutosave("academic", "gmat_expiry", e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-[10px] text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Study Preferences */}
              {activeTab === "preferences" && profile && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Study Preferences</h2>
                  <p className="text-xs text-zinc-400 mb-6">Manage countries, courses, and intakes you are interested in.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Preferred Countries (Comma Separated)</label>
                      <input
                        type="text"
                        defaultValue={profile.preferences.preferred_countries.join(", ")}
                        onBlur={(e) => {
                          const list = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                          handleAutosave("preferences", "preferred_countries", list);
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="United Kingdom, Canada, USA"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Preferred Courses</label>
                      <input
                        type="text"
                        defaultValue={profile.preferences.preferred_courses.join(", ")}
                        onBlur={(e) => {
                          const list = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                          handleAutosave("preferences", "preferred_courses", list);
                        }}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="MSc Data Science, MBA"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Degree Level</label>
                      <select
                        defaultValue={profile.preferences.degree_level || ""}
                        onChange={(e) => handleAutosave("preferences", "degree_level", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-300 transition-all"
                      >
                        <option value="">Select Degree Level</option>
                        <option value="Bachelors">Bachelor's Degree</option>
                        <option value="Masters">Master's Degree</option>
                        <option value="PhD">Doctorate / PhD</option>
                        <option value="Diploma">Diploma Pathways</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Target Intake</label>
                      <input
                        type="text"
                        defaultValue={profile.preferences.target_intake || ""}
                        onBlur={(e) => handleAutosave("preferences", "target_intake", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="Fall 2026 / Spring 2027"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Maximum Annual Budget</label>
                      <input
                        type="text"
                        defaultValue={profile.preferences.budget || ""}
                        onBlur={(e) => handleAutosave("preferences", "budget", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="25,000 - 35,000 GBP"
                      />
                    </div>

                    <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3">
                      <input
                        type="checkbox"
                        id="scholarship_req"
                        defaultChecked={profile.preferences.scholarship_required}
                        onChange={(e) => handleAutosave("preferences", "scholarship_required", e.target.checked)}
                        className="h-4.5 w-4.5 rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label htmlFor="scholarship_req" className="text-xs font-medium text-zinc-300 cursor-pointer">
                        Scholarship Required
                      </label>
                    </div>
                  </div>

                  <hr className="my-8 border-zinc-800/80" />

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Career & Study Goals</label>
                    <textarea
                      defaultValue={profile.preferences.career_goals || ""}
                      onBlur={(e) => handleAutosave("preferences", "career_goals", e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all h-28 resize-none"
                      placeholder="Discuss your short-term and long-term academic and professional ambitions..."
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: Financial Profile */}
              {activeTab === "financial" && profile && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Financial Profile</h2>
                  <p className="text-xs text-zinc-400 mb-6">Input funding details used to evaluate visa and loan capabilities.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Annual Family Income</label>
                      <input
                        type="text"
                        defaultValue={profile.financial.annual_family_income || ""}
                        onBlur={(e) => handleAutosave("financial", "annual_family_income", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="8 - 12 Lakhs INR"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Liquid Savings (USD/INR Equivalent)</label>
                      <input
                        type="number"
                        defaultValue={profile.financial.savings}
                        onBlur={(e) => handleAutosave("financial", "savings", parseFloat(e.target.value) || 0.0)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Approved Education Loan</label>
                      <input
                        type="number"
                        defaultValue={profile.financial.education_loan}
                        onBlur={(e) => handleAutosave("financial", "education_loan", parseFloat(e.target.value) || 0.0)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">Sponsor Relationship</label>
                      <input
                        type="text"
                        defaultValue={profile.financial.sponsor || ""}
                        onBlur={(e) => handleAutosave("financial", "sponsor", e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 text-zinc-200 transition-all"
                        placeholder="Self, Father, Maternal Uncle"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: Documents Vault */}
              {activeTab === "documents" && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">Document Vault</h2>
                      <p className="text-xs text-zinc-400">Securely store documents used during shortlists and audits.</p>
                    </div>
                    
                    {/* Upload button wrapper */}
                    <div className="flex items-center gap-3">
                      <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none"
                      >
                        <option value="Passport">Passport</option>
                        <option value="Academic">Academic Transcript</option>
                        <option value="Financial">Financial Statement</option>
                        <option value="Visa">Visa Documents</option>
                        <option value="Certificates">Certificates</option>
                      </select>
                      <button
                        onClick={() => docInputRef.current?.click()}
                        disabled={uploadingDoc}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-lg text-white transition-all flex items-center gap-1.5"
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

                  {/* Document lists */}
                  <div className="space-y-3">
                    {documents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl">
                        <UploadCloud className="h-10 w-10 text-zinc-650 mb-3" />
                        <h4 className="font-semibold text-sm text-zinc-300 mb-1">No Vault Documents Found</h4>
                        <p className="text-xs text-zinc-500 text-center max-w-xs">Upload transcripts, passports, or financial drafts to connect with matching and verification suites.</p>
                      </div>
                    ) : (
                      documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/80 gap-4 hover:border-zinc-700/80 transition-all"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-950/40 border border-indigo-900/30 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-semibold text-zinc-200 truncate pr-4">{doc.filename}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] bg-zinc-850 px-2 py-0.5 rounded-full text-zinc-400 font-medium">
                                  {doc.category}
                                </span>
                                <span className="text-[10px] text-zinc-500">
                                  {Math.round(doc.file_size / 1024)} KB
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Vault controls */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleDownloadDoc(doc.id)}
                              className="p-2 hover:bg-zinc-850 rounded-lg text-zinc-400 hover:text-white transition-all"
                              title="Download File"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setNewDocName(doc.filename);
                                setRenameDocId(doc.id);
                              }}
                              className="p-2 hover:bg-zinc-850 rounded-lg text-zinc-400 hover:text-white transition-all"
                              title="Rename File"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteDocId(doc.id)}
                              className="p-2 hover:bg-zinc-850 rounded-lg text-rose-500/80 hover:bg-rose-950/10 hover:text-rose-400 transition-all"
                              title="Delete File"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Rename Modal Dialog */}
                  {renameDocId && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
                        <h3 className="text-sm font-bold text-white mb-3">Rename Document</h3>
                        <input
                          type="text"
                          value={newDocName}
                          onChange={(e) => setNewDocName(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none mb-4"
                        />
                        <div className="flex justify-end gap-2 text-xs">
                          <button
                            onClick={() => setRenameDocId(null)}
                            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-750 rounded-lg text-zinc-400 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleRenameDocument}
                            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-semibold"
                          >
                            Rename
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Confirm Delete Document Modal */}
                  {deleteDocId && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
                        <h3 className="text-sm font-bold text-white mb-2">Delete Vault Document?</h3>
                        <p className="text-xs text-zinc-400 mb-4">This will permanently delete the file copy from our secure storage servers.</p>
                        <div className="flex justify-end gap-2 text-xs">
                          <button
                            onClick={() => setDeleteDocId(null)}
                            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-750 rounded-lg text-zinc-400 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleDeleteDocument}
                            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-white font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: Notifications Preferences */}
              {activeTab === "notifications" && settings && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Notification Preferences</h2>
                  <p className="text-xs text-zinc-400 mb-6">Manage how and when you receive application updates and AI recommendations.</p>

                  <div className="bg-zinc-905 border border-zinc-850 rounded-2xl p-5 mb-6 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Core Channels</h3>
                    
                    <div className="flex items-center justify-between py-2 border-b border-zinc-850">
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-200">Email Alerts</h4>
                        <p className="text-[10px] text-zinc-500">Receive application deadlines and visa check details in your inbox.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={(e) => handleNotificationChange("email", e.target.checked)}
                        className="h-4.5 w-4.5 rounded border-zinc-700 bg-zinc-900 text-indigo-600"
                      />
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-zinc-850">
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-200">WhatsApp Dispatch</h4>
                        <p className="text-[10px] text-zinc-500">Real-time alerts for university acceptances and counselor chats.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.whatsapp}
                        onChange={(e) => handleNotificationChange("whatsapp", e.target.checked)}
                        className="h-4.5 w-4.5 rounded border-zinc-700 bg-zinc-900 text-indigo-600"
                      />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-200">SMS Verification (Future)</h4>
                        <p className="text-[10px] text-zinc-500">Mobile fallback channel for offline status updates.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifications.sms}
                        onChange={(e) => handleNotificationChange("sms", e.target.checked)}
                        className="h-4.5 w-4.5 rounded border-zinc-700 bg-zinc-900 text-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: Privacy */}
              {activeTab === "privacy" && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Privacy & Data Control</h2>
                  <p className="text-xs text-zinc-400 mb-6">Manage GDPR consent policies, data portability, and audit logs.</p>

                  <div className="space-y-6">
                    <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
                      <h3 className="text-xs font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-indigo-400" />
                        Export Master Data
                      </h3>
                      <p className="text-[11px] text-zinc-500 mb-4">You can download a complete clone of your personal settings, qualifications and files in structured JSON format.</p>
                      <button
                        onClick={handleProfileExport}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-750 text-xs font-semibold rounded-lg text-white"
                      >
                        Export Profile JSON
                      </button>
                    </div>

                    <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
                      <h3 className="text-xs font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
                        <ShieldAlert className="h-4 w-4 text-rose-400" />
                        Account Deletion
                      </h3>
                      <p className="text-[11px] text-zinc-500 mb-4">Completely remove all profile metadata and documents files from Aura Routes servers. This process is irreversible.</p>
                      <button
                        onClick={handleAccountDeletion}
                        className="px-4 py-2 bg-rose-900/20 hover:bg-rose-900/40 text-xs font-semibold rounded-lg text-rose-400 border border-rose-900/50"
                      >
                        Delete My Profile & Data
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: Security */}
              {activeTab === "security" && settings && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Security Settings</h2>
                  <p className="text-xs text-zinc-400 mb-6">Manage login auditing logs, active session tokens, and passwords.</p>

                  <div className="space-y-6">
                    {/* Password configuration placeholder */}
                    <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
                      <h3 className="text-xs font-bold text-zinc-300 mb-4">Two-Factor Authentication (MFA)</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-zinc-200">MFA via Email / TOTP</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">Enforces verification checks during fresh device login audits.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">Architecture Ready</span>
                        </div>
                      </div>
                    </div>

                    {/* Active Sessions */}
                    <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
                      <h3 className="text-xs font-bold text-zinc-300 mb-4">Active Login Sessions</h3>
                      <div className="space-y-3">
                        {settings.security.active_sessions.map((sess, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2 border-b border-zinc-850/60 last:border-0">
                            <div>
                              <p className="text-xs font-semibold text-zinc-200">{sess.device}</p>
                              <p className="text-[10px] text-zinc-500">IP: {sess.ip}</p>
                            </div>
                            <span className="text-[9px] bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                              Active Now
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: Connected Accounts */}
              {activeTab === "connected" && settings && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Connected Accounts</h2>
                  <p className="text-xs text-zinc-400 mb-6">Link third-party identities for secure OAuth sign-on.</p>

                  <div className="space-y-4">
                    {settings.connected_accounts.map((acc, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-zinc-800 flex items-center justify-center font-bold text-sm text-indigo-400">
                            G
                          </div>
                          <div>
                            <p className="text-xs font-bold text-zinc-200 capitalize">{acc.provider} Login</p>
                            <p className="text-[10px] text-zinc-500">{acc.email || "Linked Identity"}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2.5 py-1 rounded-lg">
                          Connected
                        </span>
                      </div>
                    ))}
                    
                    {/* Inactive providers */}
                    <div className="flex justify-between items-center p-4 bg-zinc-900/20 border border-zinc-850 rounded-2xl opacity-60">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-zinc-850 flex items-center justify-center font-bold text-xs text-zinc-500">
                          in
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-400">LinkedIn Connect</p>
                          <p className="text-[10px] text-zinc-500">Sync profile CV details and professional logs.</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-800 px-2.5 py-1 rounded-lg">
                        Future Integration
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 10: Appearance */}
              {activeTab === "appearance" && settings && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Appearance Settings</h2>
                  <p className="text-xs text-zinc-400 mb-6">Choose how Aura Routes looks on your screen.</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-3">Theme Selection</label>
                      <div className="grid grid-cols-3 gap-4">
                        <button
                          onClick={() => handleThemeChange("dark")}
                          className={`p-4 bg-zinc-950 rounded-2xl border flex flex-col gap-2 ${
                            settings.appearance.theme === "dark"
                              ? "border-indigo-500 bg-indigo-950/10"
                              : "border-zinc-800 hover:border-zinc-700"
                          }`}
                        >
                          <div className="h-6 w-full bg-zinc-900 rounded-md border border-zinc-800 flex items-center px-1.5">
                            <div className="h-2 w-full bg-zinc-800 rounded" />
                          </div>
                          <span className="text-[10px] font-bold text-zinc-300 text-left">Dark Mode</span>
                        </button>

                        <button
                          onClick={() => handleThemeChange("light")}
                          className={`p-4 bg-zinc-950 rounded-2xl border flex flex-col gap-2 ${
                            settings.appearance.theme === "light"
                              ? "border-indigo-500 bg-indigo-950/10"
                              : "border-zinc-800 hover:border-zinc-700"
                          }`}
                        >
                          <div className="h-6 w-full bg-zinc-200 rounded-md border border-zinc-300 flex items-center px-1.5">
                            <div className="h-2 w-full bg-zinc-300 rounded" />
                          </div>
                          <span className="text-[10px] font-bold text-zinc-300 text-left">Light Mode</span>
                        </button>

                        <button
                          onClick={() => handleThemeChange("system")}
                          className={`p-4 bg-zinc-950 rounded-2xl border flex flex-col gap-2 opacity-50 cursor-not-allowed`}
                          disabled
                        >
                          <div className="h-6 w-full bg-zinc-850 rounded-md border border-zinc-800 flex items-center px-1.5 justify-between">
                            <div className="h-2 w-2/5 bg-zinc-700 rounded" />
                            <div className="h-2 w-2/5 bg-zinc-300 rounded" />
                          </div>
                          <span className="text-[10px] font-bold text-zinc-400 text-left">System Theme</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 11: Language preferences */}
              {activeTab === "language" && settings && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Multilingual Locale Settings</h2>
                  <p className="text-xs text-zinc-400 mb-6">Choose your preferred reading language format across dashboard content.</p>

                  <div className="space-y-4">
                    <button
                      onClick={() => handleLanguageChange("English")}
                      className={`w-full flex items-center justify-between p-4 bg-zinc-950 border rounded-2xl text-left ${
                        settings.language.preferred_language === "English"
                          ? "border-indigo-500 bg-indigo-950/10"
                          : "border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-white">English (US/UK)</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Primary language format for forms, chats, and SOP edits.</p>
                      </div>
                      {settings.language.preferred_language === "English" && (
                        <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                      )}
                    </button>

                    <button
                      onClick={() => handleLanguageChange("Hindi")}
                      className={`w-full flex items-center justify-between p-4 bg-zinc-950 border rounded-2xl text-left ${
                        settings.language.preferred_language === "Hindi"
                          ? "border-indigo-500 bg-indigo-950/10"
                          : "border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-white">Hindi (हिंदी)</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Translated dashboard layout (Architecture Ready).</p>
                      </div>
                      {settings.language.preferred_language === "Hindi" && (
                        <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 12: Legacy Account Options */}
              {activeTab === "account" && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Account Management</h2>
                  <p className="text-xs text-zinc-400 mb-6">Verify login properties and user identifier variables.</p>

                  <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-4">
                    <div>
                      <label className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">User Sub Unique Identifier (sub)</label>
                      <div className="bg-zinc-950 px-4 py-3 rounded-xl border border-zinc-850 text-xs font-mono text-zinc-300 select-all">
                        {profile?.user_id || user?.id}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Auth Email address</label>
                      <div className="bg-zinc-950 px-4 py-3 rounded-xl border border-zinc-850 text-xs text-zinc-350 select-all">
                        {profile?.personal.email || user?.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}

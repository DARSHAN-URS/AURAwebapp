"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  ShieldCheck, 
  FolderLock, 
  Receipt, 
  CalendarDays, 
  Bell, 
  UserCog, 
  Settings2, 
  LogOut, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  Clock, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  CloudUpload, 
  Trash2, 
  ArrowRight,
  ExternalLink,
  GraduationCap,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/AuthContext";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { supabase } from "@/lib/supabaseClient";
import JourneyTimeline from "@/components/journey/JourneyTimeline";
import JourneyKanban from "@/components/journey/JourneyKanban";
import JourneyCalendar from "@/components/journey/JourneyCalendar";
import JourneyTasks from "@/components/journey/JourneyTasks";
import JourneyAnalytics from "@/components/journey/JourneyAnalytics";

interface Activity {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
}

interface Appointment {
  id: string;
  consultant_name: string;
  date_time: string;
  meeting_link: string;
  status: string;
  notes?: string;
}

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface DashboardStats {
  profile_completeness: number;
  purchased_services: string[];
  recent_activities: Activity[];
  upcoming_appointments: Appointment[];
  unread_notifications_count: number;
  total_drafts_count: number;
  total_payments_count: number;
}

interface StudentProfile {
  full_name: string;
  email: string;
  phone: string;
  country_residence: string;
  nationality: string;
  qualification: string;
  preferred_country: string;
  preferred_course: string;
  preferred_intake: string;
}

interface VaultFile {
  id: string;
  filename: string;
  document_type: string;
  file_size: number;
  created_at: string;
}

function StudentDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const initialTab = searchParams.get("tab") || "overview";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Dashboard state variables
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [aiSops, setAiSops] = useState<any[]>([]);
  const [aiVisas, setAiVisas] = useState<any[]>([]);
  
  // Aura AI Chat State
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatFiles, setChatFiles] = useState<any[]>([]);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Journey Dashboard State variables
  const [journey, setJourney] = useState<any | null>(null);
  const [journeyStages, setJourneyStages] = useState<any[]>([]);
  const [journeyTasks, setJourneyTasks] = useState<any[]>([]);
  const [journeyCalendar, setJourneyCalendar] = useState<any[]>([]);
  const [journeyApplications, setJourneyApplications] = useState<any[]>([]);
  const [journeyVisa, setJourneyVisa] = useState<any | null>(null);
  const [journeyActivities, setJourneyActivities] = useState<any[]>([]);
  const [journeyLoading, setJourneyLoading] = useState(false);
  const [showAddAppModal, setShowAddAppModal] = useState(false);

  // Application creation modal fields
  const [newAppUni, setNewAppUni] = useState("");
  const [newAppCountry, setNewAppCountry] = useState("");
  const [newAppCourse, setNewAppCourse] = useState("");
  const [newAppTuition, setNewAppTuition] = useState("");
  
  // Settings tab variables
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [langSetting, setLangSetting] = useState("English");

  // WhatsApp Notification Settings variables
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [whatsappCategories, setWhatsappCategories] = useState<string[]>(["payments", "sop", "documents", "consultations"]);
  const [whatsappHistory, setWhatsappHistory] = useState<any[]>([]);

  // Notifications Drawer dropdown state
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Dynamic Tabs sync
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Fetch Dashboard aggregate logs on Mount
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const handleResponse = async (res: Response) => {
        if (res.status === 401) {
          router.push("/login");
          throw new Error("Unauthorized");
        }
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      };
      
      // Fetch overview stats
      const statsRes = await fetch(`${apiBaseUrl}/api/dashboard`);
      const statsData = await handleResponse(statsRes);
      setStats(statsData);

      // Force to Profile tab if completeness < 50%
      if (statsData.profile_completeness < 50) {
        setActiveTab("profile");
        router.push("/dashboard?tab=profile");
      }

      // Fetch student profile details
      const profileRes = await fetch(`${apiBaseUrl}/api/dashboard/profile`);
      const profileData = await handleResponse(profileRes);
      setProfile(profileData);

      // Fetch notification alerts logs
      const notificationsRes = await fetch(`${apiBaseUrl}/api/notifications`);
      const notificationsData = await handleResponse(notificationsRes);
      setNotifications(notificationsData);

      // Fetch scheduled consultation slots
      const apptRes = await fetch(`${apiBaseUrl}/api/appointments`);
      const apptData = await handleResponse(apptRes);
      setAppointments(apptData);

      // Fetch files from Vault
      const vaultRes = await fetch(`${apiBaseUrl}/api/documents`);
      const vaultData = await handleResponse(vaultRes);
      setVaultFiles(vaultData);

      // Fetch billing transactions log
      const billRes = await fetch(`${apiBaseUrl}/api/payments`);
      const billData = await handleResponse(billRes);
      setInvoices(billData);

      // Fetch AI workspace reports
      const reportsRes = await fetch(`${apiBaseUrl}/api/reports`);
      const reportsData = await handleResponse(reportsRes);
      setAiSops(reportsData.sops || []);
      setAiVisas(reportsData.visa_reports || []);

      // Fetch WhatsApp preferences & logs
      try {
        const wpRes = await fetch(`${apiBaseUrl}/api/notifications/preferences`);
        if (wpRes.status === 401) {
          router.push("/login");
          return;
        }
        if (wpRes.ok) {
          const wpData = await wpRes.json();
          setWhatsappEnabled(wpData.enable_whatsapp);
          setWhatsappCategories(wpData.categories || []);
        }
        
        const whRes = await fetch(`${apiBaseUrl}/api/notifications/history`);
        if (whRes.status === 401) {
          router.push("/login");
          return;
        }
        if (whRes.ok) {
          const whData = await whRes.json();
          setWhatsappHistory(whData || []);
        }
      } catch (e) {
        console.warn("Could not fetch WhatsApp settings.");
      }

    } catch (err) {
      console.error("Backend connection error during dashboard retrieval:", err);
      setStats({
        profile_completeness: 0,
        purchased_services: [],
        unread_notifications_count: 0,
        total_drafts_count: 0,
        total_payments_count: 0,
        recent_activities: [],
        upcoming_appointments: []
      });
      setProfile({
        full_name: "",
        email: user?.email || "",
        phone: "",
        country_residence: "",
        nationality: "",
        qualification: "",
        preferred_country: "",
        preferred_course: "",
        preferred_intake: ""
      });
      setNotifications([]);
      setAppointments([]);
      setVaultFiles([]);
      setInvoices([]);
      setAiSops([]);
      setAiVisas([]);
      setWhatsappHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update profile handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/dashboard/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        alert("Profile settings saved successfully!");
        fetchDashboardData();
      }
    } catch (err) {
      alert("Simulated profile update saved locally.");
    }
  };

  const handleUpdateWhatsappPreferences = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/notifications/preferences`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enable_whatsapp: whatsappEnabled,
          categories: whatsappCategories
        })
      });
      if (res.ok) {
        alert("WhatsApp preferences updated successfully!");
        fetchDashboardData();
      }
    } catch (err) {
      alert("Simulated WhatsApp preferences update saved locally.");
    }
  };

  const handleToggleWhatsappCategory = (category: string) => {
    setWhatsappCategories((prev) => 
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleRetryNotification = async (notifId: string) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/notifications/retry/${notifId}`, { method: "POST" });
      if (res.ok) {
        alert("Retry triggered successfully!");
        fetchDashboardData();
      }
    } catch (err) {
      alert("Simulated retry completed.");
      setWhatsappHistory(prev => 
        prev.map(h => h.id === notifId ? { ...h, status: "Sent" } : h)
      );
    }
  };

  // Mark notification as read handler
  const handleMarkAsRead = async (notifId: string) => {
    try {
      await fetch(`${apiBaseUrl}/api/notifications/read/${notifId}`, { method: "PUT" });
      setNotifications((prev) => 
        prev.map((item) => item.id === notifId ? { ...item, is_read: true } : item)
      );
      if (stats) {
        setStats({ ...stats, unread_notifications_count: Math.max(0, stats.unread_notifications_count - 1) });
      }
    } catch (err) {
      setNotifications((prev) => 
        prev.map((item) => item.id === notifId ? { ...item, is_read: true } : item)
      );
    }
  };

  // Chat Session Handlers
  const fetchChatHistory = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/chat/history`);
      if (res.ok) {
        const historyData = await res.json();
        setChatSessions(historyData);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  const handleSelectChatSession = async (id: string) => {
    setActiveSessionId(id);
    setChatMessages([]);
    setChatFiles([]);
    setStreamingMessage("");
    try {
      const res = await fetch(`${apiBaseUrl}/api/chat/${id}`);
      if (res.ok) {
        const detail = await res.json();
        setChatMessages(detail.messages);
        setChatFiles(detail.files);
      }
    } catch (err) {
      console.error("Failed to load session details:", err);
    }
  };

  const handleCreateChatSession = () => {
    setActiveSessionId(null);
    setChatMessages([]);
    setChatFiles([]);
    setStreamingMessage("");
  };

  const handleDeleteChatSession = async (id: string) => {
    if (confirm("Are you sure you want to delete this conversation session?")) {
      try {
        const res = await fetch(`${apiBaseUrl}/api/chat/${id}`, { method: "DELETE" });
        if (res.ok) {
          setChatSessions(prev => prev.filter(s => s.id !== id));
          if (activeSessionId === id) {
            handleCreateChatSession();
          }
        }
      } catch (err) {
        console.error("Failed to delete chat session:", err);
      }
    }
  };

  const handleRenameChatSession = async (id: string, newTitle: string) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/chat/rename`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: id, title: newTitle })
      });
      if (res.ok) {
        setChatSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
      }
    } catch (err) {
      console.error("Failed to rename chat session:", err);
    }
  };

  const handleTogglePinSession = async (id: string) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/chat/pin/${id}`, { method: "PUT" });
      if (res.ok) {
        const detail = await res.json();
        setChatSessions(prev => 
          prev.map(s => s.id === id ? { ...s, is_pinned: detail.is_pinned } : s)
          .sort((a, b) => {
            if (a.id === id) return detail.is_pinned ? -1 : 1;
            if (b.id === id) return detail.is_pinned ? 1 : -1;
            return 0;
          })
        );
      }
    } catch (err) {
      console.error("Failed to toggle pin on session:", err);
    }
  };

  const handleSendChatMessage = async (text: string) => {
    setIsGenerating(true);
    setStreamingMessage("");

    // Append user message locally for immediate feedback
    const tempUserMsg = { id: `temp-user-${Date.now()}`, role: "user" as const, content: text };
    setChatMessages(prev => [...prev, tempUserMsg]);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch(`${apiBaseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: activeSessionId, message: text }),
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) {
        throw new Error("Failed to communicate with Aura AI server.");
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error("Failed to read response stream.");
      }

      const decoder = new TextDecoder();
      let accumulatedReply = "";
      let isFirstChunk = true;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        if (isFirstChunk && chunk.startsWith("[SESSION_ID:")) {
          const sessionEndIdx = chunk.indexOf("]");
          const newSessionId = chunk.substring(12, sessionEndIdx);
          setActiveSessionId(newSessionId);
          const cleanChunk = chunk.substring(sessionEndIdx + 1);
          accumulatedReply += cleanChunk;
          setStreamingMessage(accumulatedReply);
          isFirstChunk = false;
        } else {
          accumulatedReply += chunk;
          setStreamingMessage(accumulatedReply);
        }
      }

      // Add full assistant response to the message array
      const tempAiMsg = { id: `temp-ai-${Date.now()}`, role: "assistant" as const, content: accumulatedReply };
      setChatMessages(prev => [...prev.filter(m => !m.id.startsWith("temp-")), tempUserMsg, tempAiMsg]);
      setStreamingMessage("");
      
      // Refresh chat list to show correct latest updates/titles
      await fetchChatHistory();

      // If this was a new session, load details to match database schema IDs
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (token) {
        // Refresh details
        const historyRes = await fetch(`${apiBaseUrl}/api/chat/history`);
        if (historyRes.ok) {
          const hist = await historyRes.json();
          setChatSessions(hist);
          const activeId = activeSessionId || hist[0]?.id;
          if (activeId) {
            const detailRes = await fetch(`${apiBaseUrl}/api/chat/${activeId}`);
            if (detailRes.ok) {
              const detail = await detailRes.json();
              setChatMessages(detail.messages);
              setChatFiles(detail.files);
            }
          }
        }
      }

    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Chat error:", err);
        setChatMessages(prev => [
          ...prev, 
          { id: `err-${Date.now()}`, role: "assistant" as const, content: "Sorry, I encountered an issue processing your query. Please make sure OpenAI API key is properly configured." }
        ]);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleRegenerateChatMessage = async () => {
    if (!activeSessionId || isGenerating) return;
    setIsGenerating(true);
    setStreamingMessage("");

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch(`${apiBaseUrl}/api/chat/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: activeSessionId }),
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) {
        throw new Error("Failed to communicate with Aura AI server.");
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error("Failed to read response stream.");
      }

      const decoder = new TextDecoder();
      let accumulatedReply = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedReply += chunk;
        setStreamingMessage(accumulatedReply);
      }

      // Reload detail messages
      const detailRes = await fetch(`${apiBaseUrl}/api/chat/${activeSessionId}`);
      if (detailRes.ok) {
        const detail = await detailRes.json();
        setChatMessages(detail.messages);
        setChatFiles(detail.files);
      }
      setStreamingMessage("");

    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Regen chat error:", err);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      setStreamingMessage("");
    }
  };

  const handleUploadChatFile = async (file: File) => {
    if (!activeSessionId) return;
    const formData = new FormData();
    formData.append("session_id", activeSessionId);
    formData.append("file", file);

    try {
      const res = await fetch(`${apiBaseUrl}/api/chat/upload`, {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const detail = await res.json();
        setChatFiles(prev => [...prev, detail.file]);
      }
    } catch (err) {
      console.error("Failed to upload reference doc:", err);
    }
  };

  const handleChatMessageFeedback = async (messageId: string, rating: number, comment?: string) => {
    try {
      await fetch(`${apiBaseUrl}/api/chat/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_id: messageId, rating, comment })
      });
    } catch (err) {
      console.warn("Could not submit rating feedback.");
    }
  };

  // Load chat sessions when tab changes to aura-ai
  useEffect(() => {
    if (activeTab === "aura-ai") {
      fetchChatHistory();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Journey Action Handlers
  const fetchJourneyData = async () => {
    try {
      setJourneyLoading(true);
      const res = await fetch(`${apiBaseUrl}/api/journey`);
      if (res.ok) {
        const data = await res.json();
        setJourney(data.journey);
        setJourneyStages(data.stages);
        setJourneyVisa(data.visa_tracker);
        setJourneyActivities(data.recent_activities);
      }

      const tasksRes = await fetch(`${apiBaseUrl}/api/tasks`);
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setJourneyTasks(tasksData);
      }

      const appRes = await fetch(`${apiBaseUrl}/api/application`);
      if (appRes.ok) {
        const appData = await appRes.json();
        setJourneyApplications(appData);
      }

      const calRes = await fetch(`${apiBaseUrl}/api/calendar`);
      if (calRes.ok) {
        const calData = await calRes.json();
        setJourneyCalendar(calData);
      }
    } catch (err) {
      console.error("Failed to load journey stats:", err);
    } finally {
      setJourneyLoading(false);
    }
  };

  const handleUpdateJourneyStage = async (stageName: string) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/journey`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_stage: stageName })
      });
      if (res.ok) {
        await fetchJourneyData();
      }
    } catch (err) {
      console.error("Failed to shift journey milestone:", err);
    }
  };

  const handleToggleJourneyTask = async (taskId: string, completed: boolean) => {
    try {
      // Optimistic update
      setJourneyTasks(prev => 
        prev.map(t => t.id === taskId ? { ...t, completed } : t)
      );

      const res = await fetch(`${apiBaseUrl}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed })
      });
      if (res.ok) {
        await fetchJourneyData();
      }
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const handleUpdateApplicationStatus = async (appId: string, newStatus: string) => {
    try {
      // Optimistic update
      setJourneyApplications(prev => 
        prev.map(a => a.id === appId ? { ...a, current_status: newStatus } : a)
      );

      const res = await fetch(`${apiBaseUrl}/api/application/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_status: newStatus })
      });
      if (res.ok) {
        await fetchJourneyData();
      }
    } catch (err) {
      console.error("Failed to transition application:", err);
    }
  };

  const handleDeleteApplication = async (appId: string) => {
    if (confirm("Are you sure you want to remove this application workspace?")) {
      try {
        const res = await fetch(`${apiBaseUrl}/api/application/${appId}`, {
          method: "DELETE"
        });
        if (res.ok) {
          setJourneyApplications(prev => prev.filter(a => a.id !== appId));
          await fetchJourneyData();
        }
      } catch (err) {
        console.error("Failed to remove application:", err);
      }
    }
  };

  const handleCreateApplication = async () => {
    if (!newAppUni.trim() || !newAppCourse.trim()) {
      alert("Please fill in the University Name and Course Title.");
      return;
    }
    try {
      const res = await fetch(`${apiBaseUrl}/api/application`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          university: newAppUni,
          country: newAppCountry || "Canada",
          course: newAppCourse,
          degree: "Masters",
          tuition_fee: newAppTuition || "$25,000 CAD",
          current_status: "Interested"
        })
      });
      if (res.ok) {
        setNewAppUni("");
        setNewAppCountry("");
        setNewAppCourse("");
        setNewAppTuition("");
        setShowAddAppModal(false);
        await fetchJourneyData();
      }
    } catch (err) {
      console.error("Failed to save application shortlist:", err);
    }
  };

  // Load journey data when journey tab is selected
  useEffect(() => {
    if (activeTab === "journey") {
      fetchJourneyData();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchJourneyData();
  }, []);

  // Collapsible sidebar menu tab navigation items
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "journey", label: "Student Journey", icon: TrendingUp },
    { id: "aura-ai", label: "Aura AI Assistant", icon: MessageSquare },
    { id: "reports", label: "My AI Reports", icon: FileText },
    { id: "vault", label: "Document Vault", icon: FolderLock },
    { id: "payments", label: "Billing Center", icon: Receipt },
    { id: "appointments", label: "Consultation Appts", icon: CalendarDays },
    { id: "profile", label: "Profile Settings", icon: UserCog },
    { id: "settings", label: "Dashboard Settings", icon: Settings2 }
  ];

  const handleTabChange = (tabId: string) => {
    if (tabId === "profile" || tabId === "settings") {
      setMobileMenuOpen(false);
      router.push("/settings");
      return;
    }
    if (stats && stats.profile_completeness < 50 && tabId !== "profile") {
      alert(`Please complete at least 50% of your profile (current completeness: ${stats.profile_completeness}%) to explore all platform tools!`);
      return;
    }
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    router.push(`/dashboard?tab=${tabId}`);
  };

  const getUnreadNotifications = () => notifications.filter(n => !n.is_read);

  return (
    <div className="bg-background min-h-screen flex flex-col md:flex-row">
      
      {/* 1. Left Sidebar Navigation Panel */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0 py-6 px-4 justify-between shrink-0">
        <div>
          {/* Logo brand */}
          <div className="flex items-center gap-2.5 mb-8 px-2">
            <div className="relative w-7 h-7 overflow-hidden rounded-lg border border-border shadow-sm bg-card flex items-center justify-center shrink-0">
              <Image src="/images/logo.jpeg" alt="Aura Routes AI" width={28} height={28} priority className="object-contain" />
            </div>
            <span className="font-extrabold text-foreground text-sm tracking-tight">Aura Routes AI</span>
          </div>

          {/* Nav log menu links */}
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              const isLocked = stats && stats.profile_completeness < 50 && item.id !== "profile";
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    active 
                      ? "bg-primary/10 text-primary" 
                      : isLocked
                        ? "text-gray-300 opacity-60 hover:bg-red-50/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-background"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {isLocked && (
                    <FolderLock className="w-3.5 h-3.5 text-muted-text" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info logout */}
        <div className="border-t border-border pt-4 px-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs">
              {profile?.full_name?.charAt(0) || "P"}
            </div>
            <div className="truncate">
              <h4 className="text-xs font-extrabold text-foreground truncate">{profile?.full_name || "Priyan Bose"}</h4>
              <p className="text-[10px] text-muted-text truncate">{profile?.email || "priyan@gmail.com"}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="w-full text-left justify-start text-xs font-bold text-muted-text hover:text-red-600 hover:bg-red-50 py-2 px-3 rounded-xl cursor-pointer flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Return to Landing</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Header Nav Drawer */}
      <header className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 overflow-hidden rounded-md border border-border shadow-sm bg-card flex items-center justify-center shrink-0">
            <Image src="/images/logo.jpeg" alt="Aura Routes AI" width={24} height={24} priority className="object-contain" />
          </div>
          <span className="font-extrabold text-foreground text-xs">Aura Routes AI</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Notifications bell */}
          <div className="relative">
            <button onClick={() => handleTabChange("notifications")} className="p-1.5 text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
              {stats && stats.unread_notifications_count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
                  {stats.unread_notifications_count}
                </span>
              )}
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(true)} className="p-1.5 text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
          >
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="absolute right-0 top-0 bottom-0 w-64 bg-card p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-8">
                  <span className="font-extrabold text-foreground text-sm">Menu Portal</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-muted-text hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isLocked = stats && stats.profile_completeness < 50 && item.id !== "profile";
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                          activeTab === item.id 
                            ? "bg-primary/10 text-primary" 
                            : isLocked
                              ? "text-gray-300 opacity-60"
                              : "text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {isLocked && (
                          <FolderLock className="w-3.5 h-3.5 text-gray-300" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-border pt-4">
                <Button
                  onClick={() => router.push("/")}
                  className="w-full bg-background hover:bg-muted text-foreground/80 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out Portal</span>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header bar with Search and Notifications bell dropdown */}
        <header className="hidden md:flex bg-card border-b border-border h-16 px-8 items-center justify-between sticky top-0 z-30 no-print">
          {/* Search bar */}
          <div className="relative w-80">
            <Search className="w-4 h-4 text-muted-text absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports, vault docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background border border-border rounded-xl pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-blue-600 w-full font-medium"
            />
          </div>

          <div className="flex items-center gap-6">
            
            {/* Notification alert dropdown bell icon */}
            <div className="relative">
              <button 
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                className="p-1.5 text-muted-text hover:text-foreground transition-colors relative cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {stats && stats.unread_notifications_count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
                    {stats.unread_notifications_count}
                  </span>
                )}
              </button>

              {/* Notification Quick Dropdown Panel */}
              <AnimatePresence>
                {showNotificationsDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 p-4"
                  >
                    <div className="flex justify-between items-center border-b border-gray-50 pb-2 mb-3">
                      <span className="text-[10px] font-black uppercase text-muted-text">Recent Alerts</span>
                      <button 
                        onClick={() => handleTabChange("notifications")} 
                        className="text-[10px] text-primary hover:underline font-bold"
                      >
                        All Notifications
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                      {getUnreadNotifications().length === 0 ? (
                        <p className="text-center text-[11px] text-muted-text py-3">No unread alerts found.</p>
                      ) : (
                        getUnreadNotifications().slice(0, 3).map((item) => (
                          <div 
                            key={item.id} 
                            onClick={() => handleMarkAsRead(item.id)}
                            className="p-2 bg-primary/10/20 border border-blue-50 hover:border-primary/20 rounded-xl cursor-pointer"
                          >
                            <h5 className="text-xs font-bold text-foreground leading-snug">{item.title}</h5>
                            <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">{item.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-foreground/80 bg-background px-2.5 py-1 rounded-full uppercase">
                Student Account
              </span>
            </div>

          </div>
        </header>

        {/* Dynamic Panels */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-sm font-semibold text-muted-foreground">Compiling Workspace data...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              
              {/* TAB 1: OVERVIEW PANEL */}
              {activeTab === "overview" && stats && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col gap-8"
                >
                  {/* Welcome banner grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Welcome Card & Profile completeness */}
                    <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-8 shadow-sm flex flex-col justify-between min-h-[220px]">
                      <div>
                        <h2 className="text-2xl font-black text-foreground leading-tight">
                          Welcome Back, {profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "New Student"}!
                        </h2>
                        <p className="text-xs text-muted-text mt-1 leading-relaxed max-w-md">
                          You are currently tracking studies in <strong className="text-foreground">{profile?.preferred_country}</strong> for <strong className="text-foreground">{profile?.preferred_course}</strong>. Keep editing details.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-50 pt-6 mt-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                            {stats.profile_completeness}%
                          </div>
                          <div>
                            <h4 className="text-xs font-extrabold text-foreground">Profile Completeness</h4>
                            <p className="text-[10px] text-muted-text">Fill details to optimize AI suggestions.</p>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleTabChange("profile")}
                          className="bg-primary hover:bg-primary text-white font-bold px-5 py-2.5 rounded-full text-xs cursor-pointer shadow-sm w-fit"
                        >
                          Complete Profile
                        </Button>
                      </div>
                    </div>

                    {/* usage stats highlights */}
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm flex flex-col justify-between min-h-[220px]">
                      <h3 className="text-xs font-black uppercase text-muted-text tracking-wider">Scoring Indexes</h3>
                      <div className="grid grid-cols-2 gap-4 my-4">
                        <div className="bg-background border border-border rounded-2xl p-4 text-center">
                          <span className="text-2xl font-black text-foreground">{stats.total_drafts_count}</span>
                          <p className="text-[10px] font-bold text-muted-text uppercase mt-0.5">AI Reports</p>
                        </div>
                        <div className="bg-background border border-border rounded-2xl p-4 text-center">
                          <span className="text-2xl font-black text-foreground">{stats.total_payments_count}</span>
                          <p className="text-[10px] font-bold text-muted-text uppercase mt-0.5">Purchases</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-text font-semibold text-center">
                        Active Licenses: {stats.purchased_services.length} Premium services
                      </span>
                    </div>

                  </div>

                  {/* Quick actions grid link cards */}
                  <div>
                    <h3 className="text-xs font-black uppercase text-muted-text tracking-wider mb-4">Quick AI Workspaces</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      
                      <div 
                        onClick={() => router.push("/sop")}
                        className="bg-card border border-border hover:border-blue-300 rounded-2xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between min-h-[140px]"
                      >
                        <FileText className="w-8 h-8 text-primary bg-primary/10 p-1.5 rounded-lg mb-4" />
                        <div>
                          <h4 className="font-extrabold text-foreground text-sm">AI SOP Workspace</h4>
                          <p className="text-[10px] text-muted-text mt-0.5 leading-snug">Generate and polish academic SOPs.</p>
                        </div>
                      </div>

                      <div 
                        onClick={() => router.push("/visa-check")}
                        className="bg-card border border-border hover:border-blue-300 rounded-2xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between min-h-[140px]"
                      >
                        <ShieldCheck className="w-8 h-8 text-primary bg-primary/10 p-1.5 rounded-lg mb-4" />
                        <div>
                          <h4 className="font-extrabold text-foreground text-sm">AI Visa Checker</h4>
                          <p className="text-[10px] text-muted-text mt-0.5 leading-snug">Scan files for visa checks.</p>
                        </div>
                      </div>

                      <div 
                        onClick={() => handleTabChange("vault")}
                        className="bg-card border border-border hover:border-blue-300 rounded-2xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between min-h-[140px]"
                      >
                        <FolderLock className="w-8 h-8 text-primary bg-primary/10 p-1.5 rounded-lg mb-4" />
                        <div>
                          <h4 className="font-extrabold text-foreground text-sm">Document Vault</h4>
                          <p className="text-[10px] text-muted-text mt-0.5 leading-snug">Keep copies of travel files.</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Appointments calendar preview & recent activities timeline */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Appointments list */}
                    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
                      <div className="flex justify-between items-center border-b border-gray-50 pb-3 mb-6">
                        <h3 className="text-xs font-black uppercase text-muted-text tracking-wider">Upcoming Advisor Calls</h3>
                        <button onClick={() => handleTabChange("appointments")} className="text-[10px] text-primary hover:underline font-bold">
                          Full Calendar
                        </button>
                      </div>

                      <div className="flex flex-col gap-4">
                        {stats.upcoming_appointments.length === 0 ? (
                          <p className="text-center text-xs text-muted-text py-6">No advisor consultations booked.</p>
                        ) : (
                          stats.upcoming_appointments.map((appt) => (
                            <div key={appt.id} className="bg-background border border-border rounded-2xl p-4 flex flex-col justify-between">
                              <div>
                                <h4 className="font-extrabold text-foreground text-sm">{appt.consultant_name}</h4>
                                <span className="text-[10px] text-primary font-bold block mt-1">
                                  {new Date(appt.date_time).toLocaleString()}
                                </span>
                                {appt.notes && <p className="text-xs text-muted-text mt-1 leading-snug">{appt.notes}</p>}
                              </div>
                              
                              <a
                                href={appt.meeting_link}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-primary hover:bg-primary text-white font-bold py-2 rounded-xl text-xs text-center flex items-center justify-center gap-1 mt-4 shadow-sm cursor-pointer"
                              >
                                <span>Join Zoom Meeting</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Recent activities list */}
                    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
                      <div className="border-b border-gray-50 pb-3 mb-6">
                        <h3 className="text-xs font-black uppercase text-muted-text tracking-wider">Activity History Logs</h3>
                      </div>

                      <div className="flex flex-col gap-4">
                        {stats.recent_activities.length === 0 ? (
                          <p className="text-center text-xs text-muted-text py-6">No recent actions logged.</p>
                        ) : (
                          stats.recent_activities.map((act) => (
                            <div key={act.id} className="flex gap-3.5 items-start">
                              <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-1.5 animate-pulse" />
                              <div>
                                <h4 className="text-xs font-extrabold text-foreground leading-snug">{act.activity_type} Update</h4>
                                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{act.description}</p>
                                <span className="text-[9px] text-muted-text block mt-1">
                                  {new Date(act.created_at).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Recent AI Conversations Widget */}
                  <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm mt-8">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-3 mb-6">
                      <h3 className="text-xs font-black uppercase text-muted-text tracking-wider flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        Recent Aura AI Sessions
                      </h3>
                      <button onClick={() => handleTabChange("aura-ai")} className="text-[10px] text-primary hover:underline font-bold cursor-pointer">
                        Open Assistant Hub
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {chatSessions.slice(0, 3).length === 0 ? (
                        <div className="sm:col-span-3 text-center py-6 text-xs text-muted-text font-bold">
                          No recent conversations. Ask Aura AI to get started!
                        </div>
                      ) : (
                        chatSessions.slice(0, 3).map((session) => (
                          <div 
                            key={session.id}
                            onClick={() => {
                              handleSelectChatSession(session.id);
                              handleTabChange("aura-ai");
                            }}
                            className="bg-background border border-border hover:border-primary/40 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-sm flex flex-col justify-between min-h-[90px]"
                          >
                            <span className="text-[11px] font-bold text-foreground/90 truncate block">{session.title}</span>
                            <span className="text-[9px] text-muted-text font-semibold mt-2 block">
                              Updated: {new Date(session.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </motion.div>
              )}

              {/* TAB 2: AI REPORTS WORKSPACE */}
              {activeTab === "reports" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col gap-8"
                >
                  <div className="border-b border-border pb-4">
                    <h2 className="text-xl font-black text-foreground">AI Reports & Workspace Logs</h2>
                    <p className="text-xs text-muted-text mt-1">Access drafted SOPs and visa document assessment archives.</p>
                  </div>

                  {/* SOP Documents */}
                  <div>
                    <h3 className="font-extrabold text-foreground text-xs uppercase tracking-wider mb-4">Statement of Purpose Drafts</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {aiSops.length === 0 ? (
                        <p className="text-xs text-muted-text py-3">No SOP drafts available. Generate one under the SOP page.</p>
                      ) : (
                        aiSops.map((sop) => (
                          <div 
                            key={sop.id}
                            onClick={() => router.push(`/sop/editor/${sop.id}`)}
                            className="bg-card border border-border hover:border-primary/40 rounded-2xl p-5 shadow-sm flex justify-between items-center cursor-pointer group"
                          >
                            <div>
                              <h4 className="font-extrabold text-foreground text-sm group-hover:text-primary transition-colors leading-tight">
                                {sop.title}
                              </h4>
                              <p className="text-[10px] text-muted-text mt-0.5 leading-snug">{sop.target}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-all" />
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Visa Auditor logs */}
                  <div className="mt-4">
                    <h3 className="font-extrabold text-foreground text-xs uppercase tracking-wider mb-4">Visa Readiness Audits</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {aiVisas.length === 0 ? (
                        <p className="text-xs text-muted-text py-3">No Visa reports compiled. Run checks under the Visa page.</p>
                      ) : (
                        aiVisas.map((v) => (
                          <div 
                            key={v.id}
                            onClick={() => router.push(`/visa-check/results/${v.id}`)}
                            className="bg-card border border-border hover:border-primary/40 rounded-2xl p-5 shadow-sm flex justify-between items-center cursor-pointer group"
                          >
                            <div>
                              <h4 className="font-extrabold text-foreground text-sm group-hover:text-primary transition-colors leading-tight">
                                {v.title}
                              </h4>
                              <p className="text-[10px] text-muted-text mt-0.5 leading-snug">{v.target}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-all" />
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </motion.div>
              )}

              {/* TAB 3: DOCUMENT VAULT PANEL */}
              {activeTab === "vault" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col gap-8"
                >
                  <div className="border-b border-border pb-4">
                    <h2 className="text-xl font-black text-foreground">Document Vault Secure Storage</h2>
                    <p className="text-xs text-muted-text mt-1">Upload and coordinate documents for visa applications.</p>
                  </div>

                  {/* Document Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {vaultFiles.length === 0 ? (
                      <div className="sm:col-span-2 border border-dashed border-border rounded-3xl p-12 text-center bg-background/50">
                        <FolderLock className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-bold text-foreground text-sm">No Files in Vault</h3>
                        <p className="text-xs text-muted-text mt-1">Upload files under the Visa Checker flow to build your vault.</p>
                      </div>
                    ) : (
                      vaultFiles.map((file) => (
                        <div key={file.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                              PDF
                            </div>
                            <div className="truncate max-w-[200px]">
                              <h4 className="font-extrabold text-foreground text-xs truncate leading-snug">{file.filename}</h4>
                              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-muted-text uppercase tracking-wider block mt-1">
                                {file.document_type} • {Math.round(file.file_size / 1024)} KB
                              </span>
                            </div>
                          </div>
                          
                          <a
                            href={`${apiBaseUrl}${file.id}`}
                            download
                            className="h-8 px-3 rounded-lg border border-border hover:bg-background text-muted-foreground font-bold text-[10px] flex items-center justify-center cursor-pointer"
                          >
                            Download
                          </a>
                        </div>
                      ))
                    )}
                  </div>

                </motion.div>
              )}

              {/* TAB 4: BILLING CENTER PANEL */}
              {activeTab === "payments" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col gap-8"
                >
                  <div className="border-b border-border pb-4">
                    <h2 className="text-xl font-black text-foreground">Billing Center & Receipts</h2>
                    <p className="text-xs text-muted-text mt-1">Download official receipts and invoices for premium services.</p>
                  </div>

                  <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-background border-b border-border text-[10px] font-bold text-muted-text uppercase tracking-widest">
                            <th className="py-4 px-6">Invoice ID</th>
                            <th className="py-4 px-6">Service Package</th>
                            <th className="py-4 px-6 text-right">Amount</th>
                            <th className="py-4 px-6 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="text-center text-xs text-muted-text py-12">No purchases logged.</td>
                            </tr>
                          ) : (
                            invoices.map((inv) => (
                              <tr key={inv.id} className="border-b border-gray-50 text-xs font-semibold text-foreground/80 hover:bg-background/50">
                                <td className="py-4 px-6">{inv.receipt_number}</td>
                                <td className="py-4 px-6">{inv.service_title}</td>
                                <td className="py-4 px-6 text-right font-extrabold text-foreground">₹{inv.amount}</td>
                                <td className="py-4 px-6 text-center">
                                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold">
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

                </motion.div>
              )}

              {/* TAB 5: CONSULTATION APPOINTMENTS PANEL */}
              {activeTab === "appointments" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col gap-8"
                >
                  <div className="border-b border-border pb-4">
                    <h2 className="text-xl font-black text-foreground">Consultation Appointments</h2>
                    <p className="text-xs text-muted-text mt-1">Book and track advisory Zoom meetings with target advisors.</p>
                  </div>

                  <div className="flex flex-col gap-6">
                    {appointments.length === 0 ? (
                      <div className="border border-dashed border-border rounded-3xl p-12 text-center bg-background/50">
                        <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-bold text-foreground text-sm">No Appointments</h3>
                        <p className="text-xs text-muted-text mt-1">Unlock 1-on-1 calls under services catalog packages.</p>
                      </div>
                    ) : (
                      appointments.map((appt) => (
                        <div key={appt.id} className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                          <div>
                            <span className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              Virtual Zoom Call
                            </span>
                            <h3 className="font-black text-foreground text-lg mt-3">{appt.consultant_name}</h3>
                            <p className="text-xs text-primary font-bold block mt-1">
                              {new Date(appt.date_time).toLocaleString()}
                            </p>
                            {appt.notes && <p className="text-xs text-muted-text mt-2 leading-relaxed max-w-lg">{appt.notes}</p>}
                          </div>

                          <a
                            href={appt.meeting_link}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-primary hover:bg-primary text-white font-bold py-3 px-6 rounded-full text-xs text-center flex items-center justify-center gap-1.5 shadow-md cursor-pointer shrink-0"
                          >
                            <span>Launch Consultation Call</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      ))
                    )}
                  </div>

                </motion.div>
              )}

              {/* TAB 6: NOTIFICATIONS LIST */}
              {activeTab === "notifications" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col gap-8"
                >
                  <div className="border-b border-border pb-4">
                    <h2 className="text-xl font-black text-foreground">Notification Center</h2>
                    <p className="text-xs text-muted-text mt-1">Track payment unlocks and audit status changes.</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-muted-text py-6">No alerts available.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => handleMarkAsRead(notif.id)}
                          className={`border rounded-2xl p-5 flex flex-col justify-between transition-all relative overflow-hidden ${
                            notif.is_read 
                              ? "bg-card border-border opacity-60" 
                              : "bg-primary/10/20 border-primary/20 shadow-sm"
                          }`}
                        >
                          {!notif.is_read && <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary" />}
                          
                          <div>
                            <h4 className="font-extrabold text-foreground text-sm flex items-center gap-2">
                              <span>{notif.title}</span>
                              {!notif.is_read && (
                                <span className="text-[8px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                  Unread
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-1">{notif.message}</p>
                            <span className="text-[9px] text-muted-text block mt-2">
                              {new Date(notif.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                </motion.div>
              )}

              {/* TAB 7: PROFILE SETTINGS */}
              {activeTab === "profile" && profile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col gap-8"
                >
                  <div className="border-b border-border pb-4">
                    <h2 className="text-xl font-black text-foreground">Student Profile Settings</h2>
                    <p className="text-xs text-muted-text mt-1">Configure study goals, qualifications and contacts.</p>
                  </div>

                  <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm">
                    <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-text uppercase">Full Name</label>
                          <input
                            type="text"
                            value={profile.full_name}
                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                            className="bg-background border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-text uppercase">Contact Phone</label>
                          <input
                            type="text"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="bg-background border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-text uppercase">Country Residence</label>
                          <input
                            type="text"
                            value={profile.country_residence}
                            onChange={(e) => setProfile({ ...profile, country_residence: e.target.value })}
                            className="bg-background border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-text uppercase">Nationality</label>
                          <input
                            type="text"
                            value={profile.nationality}
                            onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
                            className="bg-background border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-text uppercase">Education Qualification</label>
                          <input
                            type="text"
                            value={profile.qualification}
                            onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
                            className="bg-background border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-text uppercase">Preferred Study Destination</label>
                          <input
                            type="text"
                            value={profile.preferred_country}
                            onChange={(e) => setProfile({ ...profile, preferred_country: e.target.value })}
                            className="bg-background border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-text uppercase">Target Degree & Course</label>
                          <input
                            type="text"
                            value={profile.preferred_course}
                            onChange={(e) => setProfile({ ...profile, preferred_course: e.target.value })}
                            className="bg-background border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-text uppercase">Preferred Intake</label>
                          <input
                            type="text"
                            value={profile.preferred_intake}
                            onChange={(e) => setProfile({ ...profile, preferred_intake: e.target.value })}
                            className="bg-background border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          className="bg-primary hover:bg-primary text-white font-bold py-3 px-8 rounded-full text-xs cursor-pointer shadow-md w-full sm:w-fit"
                        >
                          Save Profile Changes
                        </Button>
                      </div>

                    </form>
                  </div>

                </motion.div>
              )}

              {/* TAB 8: SETTINGS PANEL */}
              {activeTab === "settings" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col gap-8"
                >
                  <div className="border-b border-border pb-4">
                    <h2 className="text-xl font-black text-foreground">Dashboard Preferences</h2>
                    <p className="text-xs text-muted-text mt-1">Manage notification channels, WhatsApp opt-ins and general settings.</p>
                  </div>

                  <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col gap-6">
                    
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                      <div>
                        <h4 className="font-extrabold text-foreground text-sm">Email Alerts</h4>
                        <p className="text-[11px] text-muted-text mt-0.5">Receive report ready logs and payment confirmations.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailNotif}
                        onChange={(e) => setEmailNotif(e.target.checked)}
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                      <div>
                        <h4 className="font-extrabold text-foreground text-sm">SMS Reminders</h4>
                        <p className="text-[11px] text-muted-text mt-0.5">Receive reminders on upcoming consultant calls.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={smsNotif}
                        onChange={(e) => setSmsNotif(e.target.checked)}
                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                      />
                    </div>

                    {/* WhatsApp Preferences section */}
                    <div className="border-b border-gray-50 pb-6 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-extrabold text-foreground text-sm">WhatsApp Auto Notifications</h4>
                          <p className="text-[11px] text-muted-text mt-0.5">Get instant updates directly on your mobile chat.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={whatsappEnabled}
                          onChange={(e) => setWhatsappEnabled(e.target.checked)}
                          className="w-4 h-4 accent-blue-600 cursor-pointer"
                        />
                      </div>

                      {whatsappEnabled && (
                        <div className="bg-background border border-border rounded-2xl p-4 flex flex-col gap-3">
                          <span className="text-[9px] font-bold text-muted-text uppercase tracking-wide">Category Subscriptions</span>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-foreground/80">
                              <input type="checkbox" checked={whatsappCategories.includes("eligibility")} onChange={() => handleToggleWhatsappCategory("eligibility")} className="accent-blue-600" />
                              <span>Eligibility Report Alerts</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-foreground/80">
                              <input type="checkbox" checked={whatsappCategories.includes("payments")} onChange={() => handleToggleWhatsappCategory("payments")} className="accent-blue-600" />
                              <span>Payments Confirmation</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-foreground/80">
                              <input type="checkbox" checked={whatsappCategories.includes("sop")} onChange={() => handleToggleWhatsappCategory("sop")} className="accent-blue-600" />
                              <span>SOP Ready Alerts</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-foreground/80">
                              <input type="checkbox" checked={whatsappCategories.includes("documents")} onChange={() => handleToggleWhatsappCategory("documents")} className="accent-blue-600" />
                              <span>Document Checker Scans</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <label className="text-xs font-bold text-muted-text uppercase">Preferred Language</label>
                      <select
                        value={langSetting}
                        onChange={(e) => setLangSetting(e.target.value)}
                        className="bg-background border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium w-full sm:w-60"
                      >
                        <option value="English">English</option>
                        <option value="German">Deutsch (German)</option>
                        <option value="French">Français (French)</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        onClick={handleUpdateWhatsappPreferences}
                        className="bg-muted/80 hover:bg-muted/60 text-foreground/90 border border-border font-bold py-3 px-8 rounded-full text-xs cursor-pointer"
                      >
                        Save WhatsApp Settings
                      </Button>
                      <Button
                        onClick={() => alert("Preferences saved successfully!")}
                        className="bg-primary hover:bg-primary text-white font-bold py-3 px-8 rounded-full text-xs cursor-pointer shadow-md"
                      >
                        Save Main Settings
                      </Button>
                    </div>

                  </div>

                  {/* WhatsApp Delivery Logs History Table */}
                  <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col gap-6">
                    <div>
                      <h3 className="font-extrabold text-foreground text-sm">WhatsApp Auto Delivery Logs</h3>
                      <p className="text-xs text-muted-text mt-1">Audit status checks for auto triggered WhatsApp events.</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-background border-b border-border text-[10px] font-bold text-muted-text uppercase tracking-widest">
                            <th className="py-4 px-6">Event</th>
                            <th className="py-4 px-6">Phone Number</th>
                            <th className="py-4 px-6">Compiled Message</th>
                            <th className="py-4 px-6 text-center">Status</th>
                            <th className="py-4 px-6 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {whatsappHistory.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="text-center text-xs text-muted-text py-6">No notification logs recorded.</td>
                            </tr>
                          ) : (
                            whatsappHistory.map((notif) => (
                              <tr key={notif.id} className="border-b border-gray-50 text-xs font-semibold text-foreground/80">
                                <td className="py-4 px-6 font-extrabold text-foreground">{notif.event_type}</td>
                                <td className="py-4 px-6 font-bold">{notif.phone_number}</td>
                                <td className="py-4 px-6 max-w-[200px] truncate">{notif.message}</td>
                                <td className="py-4 px-6 text-center">
                                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                                    notif.status === "Sent" 
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                                      : "bg-amber-50 text-amber-700 border border-amber-100"
                                  }`}>
                                    {notif.status}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                  {notif.status === "Failed" || notif.status === "Retry" ? (
                                    <button
                                      onClick={() => handleRetryNotification(notif.id)}
                                      className="text-[9px] font-black text-primary hover:underline cursor-pointer"
                                    >
                                      Retry
                                    </button>
                                  ) : (
                                    <span className="text-[9px] text-muted-text font-bold">N/A</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* TAB: STUDENT JOURNEY DASHBOARD */}
              {activeTab === "journey" && journey && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col gap-8 w-full"
                >
                  {/* Dashboard Title & Quick Stats */}
                  <div className="border-b border-border pb-4 flex justify-between items-center select-none no-print">
                    <div>
                      <h2 className="text-xl font-black text-foreground">Student Journey Tracker</h2>
                      <p className="text-xs text-muted-text mt-1">Navigate admissions milestones, documents checklists, and visa schedules.</p>
                    </div>
                    <span className="bg-primary/10 text-primary text-xs font-black px-4.5 py-1.5 rounded-full border border-primary/20 shadow-sm uppercase tracking-wide">
                      Active Stage: {journey.current_stage}
                    </span>
                  </div>

                  {/* Journey Analytics Metrics cards */}
                  <JourneyAnalytics
                    stats={{
                      overall_progress: journey.overall_progress,
                      current_stage: journey.current_stage,
                      health_score: journey.health_score,
                      total_tasks: journeyTasks.length,
                      completed_tasks: journeyTasks.filter(t => t.completed).length,
                      applications_count: journeyApplications.length,
                      visa_readiness: journeyVisa ? journeyVisa.readiness_score : 0
                    }}
                    onTabNavigate={handleTabChange}
                  />

                  {/* Journey stages timeline */}
                  <JourneyTimeline
                    stages={journeyStages}
                    currentStage={journey.current_stage}
                    onUpdateStage={handleUpdateJourneyStage}
                  />

                  {/* Tasks list and Calendar details row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <JourneyTasks
                      tasks={journeyTasks}
                      onToggleTask={handleToggleJourneyTask}
                      currentStage={journey.current_stage}
                      isPremiumUnlocked={stats?.purchased_services?.includes("premium-advisor") || true}
                    />
                    <JourneyCalendar
                      events={journeyCalendar}
                    />
                  </div>

                  {/* University applications Kanban pipeline */}
                  <JourneyKanban
                    applications={journeyApplications}
                    onUpdateAppStatus={handleUpdateApplicationStatus}
                    onDeleteApplication={handleDeleteApplication}
                    onCreateApplication={() => setShowAddAppModal(true)}
                  />

                  {/* Add Application shortlists Modal Overlay */}
                  <AnimatePresence>
                    {showAddAppModal && (
                      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 no-print select-none">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-card border border-border rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl flex flex-col gap-6"
                        >
                          <div>
                            <h4 className="text-sm font-black text-foreground">Add University Shortlist</h4>
                            <p className="text-[11px] text-muted-text mt-1">Shortlist choices to initialize admissions tracking pipeline logs.</p>
                          </div>

                          <div className="flex flex-col gap-4 text-xs">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-muted-text uppercase">University Name</label>
                              <input 
                                type="text"
                                placeholder="e.g. University of Toronto"
                                value={newAppUni}
                                onChange={(e) => setNewAppUni(e.target.value)}
                                className="bg-background border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-muted-text uppercase">Country</label>
                              <input 
                                type="text"
                                placeholder="e.g. Canada"
                                value={newAppCountry}
                                onChange={(e) => setNewAppCountry(e.target.value)}
                                className="bg-background border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-muted-text uppercase">Course / Programme</label>
                              <input 
                                type="text"
                                placeholder="e.g. MSc Computer Science"
                                value={newAppCourse}
                                onChange={(e) => setNewAppCourse(e.target.value)}
                                className="bg-background border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                              />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-muted-text uppercase">Tuition Fee Estimate</label>
                              <input 
                                type="text"
                                placeholder="e.g. $35,000 CAD"
                                value={newAppTuition}
                                onChange={(e) => setNewAppTuition(e.target.value)}
                                className="bg-background border border-border rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-3.5 pt-2">
                            <Button
                              onClick={() => setShowAddAppModal(false)}
                              className="bg-muted/80 hover:bg-muted/60 text-foreground/90 border border-border font-bold py-2 px-6 rounded-full text-xs cursor-pointer"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleCreateApplication}
                              className="bg-primary hover:bg-primary text-white font-bold py-2 px-6 rounded-full text-xs cursor-pointer shadow-md"
                            >
                              Save Target
                            </Button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* TAB: AURA AI ASSISTANT */}
              {activeTab === "aura-ai" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col md:flex-row bg-card border border-border rounded-3xl overflow-hidden h-[calc(100vh-12rem)] min-h-[500px]"
                >
                  <ChatSidebar
                    sessions={chatSessions}
                    activeSessionId={activeSessionId}
                    onSelectSession={handleSelectChatSession}
                    onCreateSession={handleCreateChatSession}
                    onDeleteSession={handleDeleteChatSession}
                    onRenameSession={handleRenameChatSession}
                    onTogglePinSession={handleTogglePinSession}
                  />
                  <ChatWindow
                    messages={chatMessages}
                    files={chatFiles}
                    streamingMessage={streamingMessage}
                    isGenerating={isGenerating}
                    onSendMessage={handleSendChatMessage}
                    onUploadFile={handleUploadChatFile}
                    onRegenerate={handleRegenerateChatMessage}
                    onStopGeneration={handleStopGeneration}
                    onFeedback={handleChatMessageFeedback}
                    activeSessionId={activeSessionId}
                    profileCompleteness={stats?.profile_completeness || 0}
                    onTabNavigate={handleTabChange}
                  />
                </motion.div>
              )}

            </AnimatePresence>
          )}

        </div>

      </main>

    </div>
  );
}

export default function StudentDashboard() {
  return (
    <Suspense fallback={
      <div className="bg-card min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-semibold text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    }>
      <StudentDashboardContent />
    </Suspense>
  );
}

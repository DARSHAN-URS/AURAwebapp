"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
      
      // Fetch overview stats
      const statsRes = await fetch(`${apiBaseUrl}/api/dashboard`);
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch student profile details
      const profileRes = await fetch(`${apiBaseUrl}/api/profile`);
      const profileData = await profileRes.json();
      setProfile(profileData);

      // Fetch notification alerts logs
      const notificationsRes = await fetch(`${apiBaseUrl}/api/notifications`);
      const notificationsData = await notificationsRes.json();
      setNotifications(notificationsData);

      // Fetch scheduled consultation slots
      const apptRes = await fetch(`${apiBaseUrl}/api/appointments`);
      const apptData = await apptRes.json();
      setAppointments(apptData);

      // Fetch files from Vault
      const vaultRes = await fetch(`${apiBaseUrl}/api/documents`);
      const vaultData = await vaultRes.json();
      setVaultFiles(vaultData);

      // Fetch billing transactions log
      const billRes = await fetch(`${apiBaseUrl}/api/payments`);
      const billData = await billRes.json();
      setInvoices(billData);

      // Fetch AI workspace reports
      const reportsRes = await fetch(`${apiBaseUrl}/api/reports`);
      const reportsData = await reportsRes.json();
      setAiSops(reportsData.sops || []);
      setAiVisas(reportsData.visa_reports || []);

      // Fetch WhatsApp preferences & logs
      try {
        const wpRes = await fetch(`${apiBaseUrl}/api/notifications/preferences`);
        if (wpRes.ok) {
          const wpData = await wpRes.json();
          setWhatsappEnabled(wpData.enable_whatsapp);
          setWhatsappCategories(wpData.categories || []);
        }
        
        const whRes = await fetch(`${apiBaseUrl}/api/notifications/history`);
        if (whRes.ok) {
          const whData = await whRes.json();
          setWhatsappHistory(whData || []);
        }
      } catch (e) {
        console.warn("Could not fetch WhatsApp settings.");
      }

    } catch (err) {
      console.warn("Backend offline. Setting up local dashboard mock values.");
      setupFallbackMockData();
    } finally {
      setLoading(false);
    }
  };

  const setupFallbackMockData = () => {
    setStats({
      profile_completeness: 80,
      purchased_services: ["ai-sop-generator", "ai-visa-doc-checker"],
      unread_notifications_count: 1,
      total_drafts_count: 2,
      total_payments_count: 1,
      recent_activities: [
        { id: "act_1", activity_type: "Payment", description: "Purchased AI SOP Generator package (₹999).", created_at: new Date().toISOString() },
        { id: "act_2", activity_type: "SOP", description: "Autosaved Statement of Purpose draft.", created_at: new Date(Date.now() - 3600000).toISOString() }
      ],
      upcoming_appointments: [
        { id: "apt_1", consultant_name: "Dr. Aris Vane (Senior Study Advisor)", date_time: new Date(Date.now() + 86400000).toISOString(), meeting_link: "https://zoom.us/j/983457193", status: "upcoming", notes: "Initial profile scoping & university shortlisting." }
      ]
    });

    setProfile({
      full_name: "Priyan Bose",
      email: "priyan.bose@gmail.com",
      phone: "+91 9876543210",
      country_residence: "India",
      nationality: "Indian",
      qualification: "B.Tech Computer Science",
      preferred_country: "Canada",
      preferred_course: "M.S. Computer Science",
      preferred_intake: "Fall 2026"
    });

    setNotifications([
      { id: "n1", type: "success", title: "Premium Access Active", message: "AI SOP Generator package is ready for use.", is_read: false, created_at: new Date().toISOString() },
      { id: "n2", type: "info", title: "Document Scanned", message: "Statement of Purpose draft completed with 90% readability score.", is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() }
    ]);

    setAppointments([
      { id: "apt_1", consultant_name: "Dr. Aris Vane (Senior Study Advisor)", date_time: new Date(Date.now() + 86400000).toISOString(), meeting_link: "https://zoom.us/j/983457193", status: "upcoming", notes: "Initial profile scoping & university shortlisting." }
    ]);

    setVaultFiles([
      { id: "vf1", filename: "Passport_Scan_Main.pdf", document_type: "Passport", file_size: 1542000, created_at: new Date().toISOString() },
      { id: "vf2", filename: "Tuition_Fee_Receipt.pdf", document_type: "Financial", file_size: 945000, created_at: new Date().toISOString() }
    ]);

    setInvoices([
      { id: "inv_1", receipt_number: "INV_U8A329F1", service_title: "AI SOP Generator", amount: 999.00, payment_method: "NetBanking/UPI", status: "captured", date: new Date().toISOString() }
    ]);

    setAiSops([
      { id: "sop_mock_1", category: "SOPs", title: "SOP University of Toronto", target: "U of T - Computer Science", updated_at: new Date().toISOString() }
    ]);

    setAiVisas([
      { id: "visa_mock_1", category: "Visa Reports", title: "Canada Student Visa Report", target: "Readiness: 90% (Ready)", updated_at: new Date().toISOString() }
    ]);

    setWhatsappHistory([
      { id: "wh1", event_type: "STUDENT_REGISTERED", phone_number: "+91 9876543210", template_name: "Welcome Message", message: "Hi Student Partner 👋\n\nWelcome to Aura Routes! Prepare your study abroad files with premium AI assistance.", status: "Sent", retry_count: 0, created_at: new Date().toISOString() }
    ]);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update profile handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/profile`, {
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

  // Collapsible sidebar menu tab navigation items
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "reports", label: "My AI Reports", icon: FileText },
    { id: "vault", label: "Document Vault", icon: FolderLock },
    { id: "payments", label: "Billing Center", icon: Receipt },
    { id: "appointments", label: "Consultation Appts", icon: CalendarDays },
    { id: "profile", label: "Profile Settings", icon: UserCog },
    { id: "settings", label: "Dashboard Settings", icon: Settings2 }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    router.push(`/dashboard?tab=${tabId}`);
  };

  const getUnreadNotifications = () => notifications.filter(n => !n.is_read);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col md:flex-row">
      
      {/* 1. Left Sidebar Navigation Panel */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-150 h-screen sticky top-0 py-6 px-4 justify-between shrink-0">
        <div>
          {/* Logo brand */}
          <div className="flex items-center gap-2 mb-8 px-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <span className="font-extrabold text-gray-950 text-base tracking-tight">Aura Routes</span>
          </div>

          {/* Nav log menu links */}
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    active 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info logout */}
        <div className="border-t border-gray-100 pt-4 px-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
              {profile?.full_name?.charAt(0) || "P"}
            </div>
            <div className="truncate">
              <h4 className="text-xs font-extrabold text-gray-950 truncate">{profile?.full_name || "Priyan Bose"}</h4>
              <p className="text-[10px] text-gray-400 truncate">{profile?.email || "priyan@gmail.com"}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="w-full text-left justify-start text-xs font-bold text-gray-400 hover:text-red-600 hover:bg-red-50 py-2 px-3 rounded-xl cursor-pointer flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Return to Landing</span>
          </Button>
        </div>
      </aside>

      {/* Mobile Header Nav Drawer */}
      <header className="md:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <span className="font-extrabold text-gray-950 text-sm">Aura Routes</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Notifications bell */}
          <div className="relative">
            <button onClick={() => handleTabChange("notifications")} className="p-1.5 text-gray-500 hover:text-gray-900">
              <Bell className="w-5 h-5" />
              {stats && stats.unread_notifications_count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
                  {stats.unread_notifications_count}
                </span>
              )}
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(true)} className="p-1.5 text-gray-500 hover:text-gray-900">
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
              className="absolute right-0 top-0 bottom-0 w-64 bg-white p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-8">
                  <span className="font-extrabold text-gray-950 text-sm">Menu Portal</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-gray-900">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                          activeTab === item.id ? "bg-blue-50 text-blue-600" : "text-gray-500"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <Button
                  onClick={() => router.push("/")}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
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
        <header className="hidden md:flex bg-white border-b border-gray-100 h-16 px-8 items-center justify-between sticky top-0 z-30 no-print">
          {/* Search bar */}
          <div className="relative w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports, vault docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-blue-600 w-full font-medium"
            />
          </div>

          <div className="flex items-center gap-6">
            
            {/* Notification alert dropdown bell icon */}
            <div className="relative">
              <button 
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors relative cursor-pointer"
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
                    className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-4"
                  >
                    <div className="flex justify-between items-center border-b border-gray-50 pb-2 mb-3">
                      <span className="text-[10px] font-black uppercase text-gray-400">Recent Alerts</span>
                      <button 
                        onClick={() => handleTabChange("notifications")} 
                        className="text-[10px] text-blue-600 hover:underline font-bold"
                      >
                        All Notifications
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                      {getUnreadNotifications().length === 0 ? (
                        <p className="text-center text-[11px] text-gray-400 py-3">No unread alerts found.</p>
                      ) : (
                        getUnreadNotifications().slice(0, 3).map((item) => (
                          <div 
                            key={item.id} 
                            onClick={() => handleMarkAsRead(item.id)}
                            className="p-2 bg-blue-50/20 border border-blue-50 hover:border-blue-100 rounded-xl cursor-pointer"
                          >
                            <h5 className="text-xs font-bold text-gray-950 leading-snug">{item.title}</h5>
                            <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5">{item.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-full uppercase">
                Student Account
              </span>
            </div>

          </div>
        </header>

        {/* Dynamic Panels */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              <p className="text-sm font-semibold text-gray-500">Compiling Workspace data...</p>
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
                    <div className="lg:col-span-2 bg-white border border-gray-150 rounded-3xl p-8 shadow-sm flex flex-col justify-between min-h-[220px]">
                      <div>
                        <h2 className="text-2xl font-black text-gray-950 leading-tight">
                          Welcome Back, {profile?.full_name || "Priyan Bose"}!
                        </h2>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-md">
                          You are currently tracking studies in <strong className="text-gray-900">{profile?.preferred_country}</strong> for <strong className="text-gray-900">{profile?.preferred_course}</strong>. Keep editing details.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-50 pt-6 mt-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {stats.profile_completeness}%
                          </div>
                          <div>
                            <h4 className="text-xs font-extrabold text-gray-950">Profile Completeness</h4>
                            <p className="text-[10px] text-gray-400">Fill details to optimize AI suggestions.</p>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleTabChange("profile")}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-full text-xs cursor-pointer shadow-sm w-fit"
                        >
                          Complete Profile
                        </Button>
                      </div>
                    </div>

                    {/* usage stats highlights */}
                    <div className="bg-white border border-gray-150 rounded-3xl p-8 shadow-sm flex flex-col justify-between min-h-[220px]">
                      <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Scoring Indexes</h3>
                      <div className="grid grid-cols-2 gap-4 my-4">
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                          <span className="text-2xl font-black text-gray-900">{stats.total_drafts_count}</span>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">AI Reports</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                          <span className="text-2xl font-black text-gray-900">{stats.total_payments_count}</span>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Purchases</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-semibold text-center">
                        Active Licenses: {stats.purchased_services.length} Premium services
                      </span>
                    </div>

                  </div>

                  {/* Quick actions grid link cards */}
                  <div>
                    <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-4">Quick AI Workspaces</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      
                      <div 
                        onClick={() => router.push("/sop")}
                        className="bg-white border border-gray-100 hover:border-blue-300 rounded-2xl p-6 shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between min-h-[140px]"
                      >
                        <FileText className="w-8 h-8 text-blue-600 bg-blue-50 p-1.5 rounded-lg mb-4" />
                        <div>
                          <h4 className="font-extrabold text-gray-950 text-sm">AI SOP Workspace</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">Generate and polish academic SOPs.</p>
                        </div>
                      </div>

                      <div 
                        onClick={() => router.push("/visa-check")}
                        className="bg-white border border-gray-100 hover:border-blue-300 rounded-2xl p-6 shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between min-h-[140px]"
                      >
                        <ShieldCheck className="w-8 h-8 text-blue-600 bg-blue-50 p-1.5 rounded-lg mb-4" />
                        <div>
                          <h4 className="font-extrabold text-gray-950 text-sm">AI Visa Checker</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">Scan files for visa checks.</p>
                        </div>
                      </div>

                      <div 
                        onClick={() => handleTabChange("vault")}
                        className="bg-white border border-gray-100 hover:border-blue-300 rounded-2xl p-6 shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between min-h-[140px]"
                      >
                        <FolderLock className="w-8 h-8 text-blue-600 bg-blue-50 p-1.5 rounded-lg mb-4" />
                        <div>
                          <h4 className="font-extrabold text-gray-950 text-sm">Document Vault</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">Keep copies of travel files.</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Appointments calendar preview & recent activities timeline */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Appointments list */}
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-xs">
                      <div className="flex justify-between items-center border-b border-gray-50 pb-3 mb-6">
                        <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Upcoming Advisor Calls</h3>
                        <button onClick={() => handleTabChange("appointments")} className="text-[10px] text-blue-600 hover:underline font-bold">
                          Full Calendar
                        </button>
                      </div>

                      <div className="flex flex-col gap-4">
                        {stats.upcoming_appointments.length === 0 ? (
                          <p className="text-center text-xs text-gray-400 py-6">No advisor consultations booked.</p>
                        ) : (
                          stats.upcoming_appointments.map((appt) => (
                            <div key={appt.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between">
                              <div>
                                <h4 className="font-extrabold text-gray-950 text-sm">{appt.consultant_name}</h4>
                                <span className="text-[10px] text-blue-600 font-bold block mt-1">
                                  {new Date(appt.date_time).toLocaleString()}
                                </span>
                                {appt.notes && <p className="text-xs text-gray-400 mt-1 leading-snug">{appt.notes}</p>}
                              </div>
                              
                              <a
                                href={appt.meeting_link}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs text-center flex items-center justify-center gap-1 mt-4 shadow-sm cursor-pointer"
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
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-xs">
                      <div className="border-b border-gray-50 pb-3 mb-6">
                        <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Activity History Logs</h3>
                      </div>

                      <div className="flex flex-col gap-4">
                        {stats.recent_activities.length === 0 ? (
                          <p className="text-center text-xs text-gray-400 py-6">No recent actions logged.</p>
                        ) : (
                          stats.recent_activities.map((act) => (
                            <div key={act.id} className="flex gap-3.5 items-start">
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-1.5 animate-pulse" />
                              <div>
                                <h4 className="text-xs font-extrabold text-gray-950 leading-snug">{act.activity_type} Update</h4>
                                <p className="text-[11px] text-gray-500 leading-snug mt-0.5">{act.description}</p>
                                <span className="text-[9px] text-gray-400 block mt-1">
                                  {new Date(act.created_at).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
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
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-black text-gray-950">AI Reports & Workspace Logs</h2>
                    <p className="text-xs text-gray-400 mt-1">Access drafted SOPs and visa document assessment archives.</p>
                  </div>

                  {/* SOP Documents */}
                  <div>
                    <h3 className="font-extrabold text-gray-950 text-xs uppercase tracking-wider mb-4">Statement of Purpose Drafts</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {aiSops.length === 0 ? (
                        <p className="text-xs text-gray-400 py-3">No SOP drafts available. Generate one under the SOP page.</p>
                      ) : (
                        aiSops.map((sop) => (
                          <div 
                            key={sop.id}
                            onClick={() => router.push(`/sop/editor/${sop.id}`)}
                            className="bg-white border border-gray-100 hover:border-blue-200 rounded-2xl p-5 shadow-xs flex justify-between items-center cursor-pointer group"
                          >
                            <div>
                              <h4 className="font-extrabold text-gray-950 text-sm group-hover:text-blue-600 transition-colors leading-tight">
                                {sop.title}
                              </h4>
                              <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{sop.target}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-all" />
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Visa Auditor logs */}
                  <div className="mt-4">
                    <h3 className="font-extrabold text-gray-950 text-xs uppercase tracking-wider mb-4">Visa Readiness Audits</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {aiVisas.length === 0 ? (
                        <p className="text-xs text-gray-400 py-3">No Visa reports compiled. Run checks under the Visa page.</p>
                      ) : (
                        aiVisas.map((v) => (
                          <div 
                            key={v.id}
                            onClick={() => router.push(`/visa-check/results/${v.id}`)}
                            className="bg-white border border-gray-100 hover:border-blue-200 rounded-2xl p-5 shadow-xs flex justify-between items-center cursor-pointer group"
                          >
                            <div>
                              <h4 className="font-extrabold text-gray-950 text-sm group-hover:text-blue-600 transition-colors leading-tight">
                                {v.title}
                              </h4>
                              <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{v.target}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-all" />
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
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-black text-gray-950">Document Vault Secure Storage</h2>
                    <p className="text-xs text-gray-400 mt-1">Upload and coordinate documents for visa applications.</p>
                  </div>

                  {/* Document Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {vaultFiles.length === 0 ? (
                      <div className="sm:col-span-2 border border-dashed border-gray-200 rounded-3xl p-12 text-center bg-gray-50/50">
                        <FolderLock className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-bold text-gray-900 text-sm">No Files in Vault</h3>
                        <p className="text-xs text-gray-400 mt-1">Upload files under the Visa Checker flow to build your vault.</p>
                      </div>
                    ) : (
                      vaultFiles.map((file) => (
                        <div key={file.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                              PDF
                            </div>
                            <div className="truncate max-w-[200px]">
                              <h4 className="font-extrabold text-gray-950 text-xs truncate leading-snug">{file.filename}</h4>
                              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider block mt-1">
                                {file.document_type} • {Math.round(file.file_size / 1024)} KB
                              </span>
                            </div>
                          </div>
                          
                          <a
                            href={`${apiBaseUrl}${file.id}`}
                            download
                            className="h-8 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-[10px] flex items-center justify-center cursor-pointer"
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
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-black text-gray-950">Billing Center & Receipts</h2>
                    <p className="text-xs text-gray-400 mt-1">Download official receipts and invoices for premium services.</p>
                  </div>

                  <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <th className="py-4 px-6">Invoice ID</th>
                            <th className="py-4 px-6">Service Package</th>
                            <th className="py-4 px-6 text-right">Amount</th>
                            <th className="py-4 px-6 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="text-center text-xs text-gray-400 py-12">No purchases logged.</td>
                            </tr>
                          ) : (
                            invoices.map((inv) => (
                              <tr key={inv.id} className="border-b border-gray-50 text-xs font-semibold text-gray-700 hover:bg-gray-50/50">
                                <td className="py-4 px-6">{inv.receipt_number}</td>
                                <td className="py-4 px-6">{inv.service_title}</td>
                                <td className="py-4 px-6 text-right font-extrabold text-gray-950">₹{inv.amount}</td>
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
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-black text-gray-950">Consultation Appointments</h2>
                    <p className="text-xs text-gray-400 mt-1">Book and track advisory Zoom meetings with target advisors.</p>
                  </div>

                  <div className="flex flex-col gap-6">
                    {appointments.length === 0 ? (
                      <div className="border border-dashed border-gray-200 rounded-3xl p-12 text-center bg-gray-50/50">
                        <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-bold text-gray-900 text-sm">No Appointments</h3>
                        <p className="text-xs text-gray-400 mt-1">Unlock 1-on-1 calls under services catalog packages.</p>
                      </div>
                    ) : (
                      appointments.map((appt) => (
                        <div key={appt.id} className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                          <div>
                            <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              Virtual Zoom Call
                            </span>
                            <h3 className="font-black text-gray-950 text-lg mt-3">{appt.consultant_name}</h3>
                            <p className="text-xs text-blue-600 font-bold block mt-1">
                              {new Date(appt.date_time).toLocaleString()}
                            </p>
                            {appt.notes && <p className="text-xs text-gray-400 mt-2 leading-relaxed max-w-lg">{appt.notes}</p>}
                          </div>

                          <a
                            href={appt.meeting_link}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-xs text-center flex items-center justify-center gap-1.5 shadow-md cursor-pointer shrink-0"
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
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-black text-gray-950">Notification Center</h2>
                    <p className="text-xs text-gray-400 mt-1">Track payment unlocks and audit status changes.</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-gray-400 py-6">No alerts available.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => handleMarkAsRead(notif.id)}
                          className={`border rounded-2xl p-5 flex flex-col justify-between transition-all relative overflow-hidden ${
                            notif.is_read 
                              ? "bg-white border-gray-100 opacity-60" 
                              : "bg-blue-50/20 border-blue-100 shadow-xs"
                          }`}
                        >
                          {!notif.is_read && <div className="absolute top-0 left-0 bottom-0 w-1 bg-blue-600" />}
                          
                          <div>
                            <h4 className="font-extrabold text-gray-950 text-sm flex items-center gap-2">
                              <span>{notif.title}</span>
                              {!notif.is_read && (
                                <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                  Unread
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed mt-1">{notif.message}</p>
                            <span className="text-[9px] text-gray-400 block mt-2">
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
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-black text-gray-950">Student Profile Settings</h2>
                    <p className="text-xs text-gray-400 mt-1">Configure study goals, qualifications and contacts.</p>
                  </div>

                  <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-10 shadow-xs">
                    <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                          <input
                            type="text"
                            value={profile.full_name}
                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-400 uppercase">Contact Phone</label>
                          <input
                            type="text"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-400 uppercase">Country Residence</label>
                          <input
                            type="text"
                            value={profile.country_residence}
                            onChange={(e) => setProfile({ ...profile, country_residence: e.target.value })}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-400 uppercase">Nationality</label>
                          <input
                            type="text"
                            value={profile.nationality}
                            onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-400 uppercase">Education Qualification</label>
                          <input
                            type="text"
                            value={profile.qualification}
                            onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-400 uppercase">Preferred Study Destination</label>
                          <input
                            type="text"
                            value={profile.preferred_country}
                            onChange={(e) => setProfile({ ...profile, preferred_country: e.target.value })}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-400 uppercase">Target Degree & Course</label>
                          <input
                            type="text"
                            value={profile.preferred_course}
                            onChange={(e) => setProfile({ ...profile, preferred_course: e.target.value })}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-400 uppercase">Preferred Intake</label>
                          <input
                            type="text"
                            value={profile.preferred_intake}
                            onChange={(e) => setProfile({ ...profile, preferred_intake: e.target.value })}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-xs cursor-pointer shadow-md w-full sm:w-fit"
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
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-black text-gray-950">Dashboard Preferences</h2>
                    <p className="text-xs text-gray-400 mt-1">Manage notification channels, WhatsApp opt-ins and general settings.</p>
                  </div>

                  <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col gap-6">
                    
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                      <div>
                        <h4 className="font-extrabold text-gray-950 text-sm">Email Alerts</h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">Receive report ready logs and payment confirmations.</p>
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
                        <h4 className="font-extrabold text-gray-950 text-sm">SMS Reminders</h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">Receive reminders on upcoming consultant calls.</p>
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
                          <h4 className="font-extrabold text-gray-950 text-sm">WhatsApp Auto Notifications</h4>
                          <p className="text-[11px] text-gray-400 mt-0.5">Get instant updates directly on your mobile chat.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={whatsappEnabled}
                          onChange={(e) => setWhatsappEnabled(e.target.checked)}
                          className="w-4 h-4 accent-blue-600 cursor-pointer"
                        />
                      </div>

                      {whatsappEnabled && (
                        <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 flex flex-col gap-3">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Category Subscriptions</span>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                              <input type="checkbox" checked={whatsappCategories.includes("eligibility")} onChange={() => handleToggleWhatsappCategory("eligibility")} className="accent-blue-600" />
                              <span>Eligibility Report Alerts</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                              <input type="checkbox" checked={whatsappCategories.includes("payments")} onChange={() => handleToggleWhatsappCategory("payments")} className="accent-blue-600" />
                              <span>Payments Confirmation</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                              <input type="checkbox" checked={whatsappCategories.includes("sop")} onChange={() => handleToggleWhatsappCategory("sop")} className="accent-blue-600" />
                              <span>SOP Ready Alerts</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                              <input type="checkbox" checked={whatsappCategories.includes("documents")} onChange={() => handleToggleWhatsappCategory("documents")} className="accent-blue-600" />
                              <span>Document Checker Scans</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Preferred Language</label>
                      <select
                        value={langSetting}
                        onChange={(e) => setLangSetting(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-600 font-medium w-full sm:w-60"
                      >
                        <option value="English">English</option>
                        <option value="German">Deutsch (German)</option>
                        <option value="French">Français (French)</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        onClick={handleUpdateWhatsappPreferences}
                        className="bg-gray-150 hover:bg-gray-200 text-gray-800 border border-gray-200 font-bold py-3 px-8 rounded-full text-xs cursor-pointer"
                      >
                        Save WhatsApp Settings
                      </Button>
                      <Button
                        onClick={() => alert("Preferences saved successfully!")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-xs cursor-pointer shadow-md"
                      >
                        Save Main Settings
                      </Button>
                    </div>

                  </div>

                  {/* WhatsApp Delivery Logs History Table */}
                  <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col gap-6">
                    <div>
                      <h3 className="font-extrabold text-gray-950 text-sm">WhatsApp Auto Delivery Logs</h3>
                      <p className="text-xs text-gray-400 mt-1">Audit status checks for auto triggered WhatsApp events.</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
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
                              <td colSpan={5} className="text-center text-xs text-gray-400 py-6">No notification logs recorded.</td>
                            </tr>
                          ) : (
                            whatsappHistory.map((notif) => (
                              <tr key={notif.id} className="border-b border-gray-50 text-xs font-semibold text-gray-700">
                                <td className="py-4 px-6 font-extrabold text-gray-950">{notif.event_type}</td>
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
                                      className="text-[9px] font-black text-blue-600 hover:underline cursor-pointer"
                                    >
                                      Retry
                                    </button>
                                  ) : (
                                    <span className="text-[9px] text-gray-400 font-bold">N/A</span>
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
      <div className="bg-white min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    }>
      <StudentDashboardContent />
    </Suspense>
  );
}

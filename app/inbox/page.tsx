"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox, Bell, Mail, MessageSquare, Calendar, ShieldAlert,
  Download, Search, Filter, RefreshCw, Send, CheckCircle2,
  XCircle, AlertTriangle, Plus, Clock, ExternalLink, Paperclip,
  Check, ChevronRight, User, AlertCircle, FileText, Loader2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/common/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Tab = "notifications" | "emails" | "whatsapp" | "appointments" | "support" | "announcements" | "downloads";

export default function CommunicationCenter() {
  const { user } = useAuth();
  const router = useRouter();

  // Selected tab
  const [activeTab, setActiveTab] = useState<Tab>("notifications");

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all"); // all, unread, today, payments, ai, downloads

  // Unified stats
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [openTicketsCount, setOpenTicketsCount] = useState(0);

  // Tab Data states
  const [notifications, setNotifications] = useState<any[]>([]);
  const [emails, setEmails] = useState<any[]>([]);
  const [whatsapp, setWhatsapp] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  
  // Loading indicators
  const [loading, setLoading] = useState(true);
  const [retryId, setRetryId] = useState<string | null>(null);

  // Support Ticket state
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [ticketMessages, setTicketMessages] = useState<any[]>([]);
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  
  // New ticket fields
  const [newTicketTitle, setNewTicketTitle] = useState("");
  const [newTicketCategory, setNewTicketCategory] = useState("General");
  const [newTicketPriority, setNewTicketPriority] = useState("Medium");
  const [newTicketMessage, setNewTicketMessage] = useState("");
  const [creatingTicket, setCreatingTicket] = useState(false);

  // Active email popup
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  // Fetch functions
  const fetchInboxStats = async () => {
    try {
      const res = await fetch(`${API}/api/inbox`);
      if (res.ok) {
        const body = await res.json();
        setUnreadNotifCount(body.unread_notifications_count || 0);
        setOpenTicketsCount(body.open_tickets_count || 0);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTabContent = async () => {
    if (!user) return;
    try {
      const endpoints = {
        notifications: "/api/notifications",
        emails: "/api/emails",
        whatsapp: "/api/whatsapp",
        appointments: "/api/appointments",
        support: "/api/support",
        announcements: "/api/announcements",
        downloads: "/api/downloads"
      };

      const res = await fetch(`${API}${endpoints[activeTab]}`);
      if (res.ok) {
        const data = await res.json();
        if (activeTab === "notifications") setNotifications(data);
        else if (activeTab === "emails") setEmails(data);
        else if (activeTab === "whatsapp") setWhatsapp(data);
        else if (activeTab === "appointments") setAppointments(data);
        else if (activeTab === "support") {
          setTickets(data);
          // Auto select first ticket if none selected and tickets exist
          if (data.length > 0 && !selectedTicketId) {
            setSelectedTicketId(data[0].id);
          }
        }
        else if (activeTab === "announcements") setAnnouncements(data);
        else if (activeTab === "downloads") setDownloads(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run on tab change & user change
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchInboxStats();
    fetchTabContent().then(() => setLoading(false));
  }, [activeTab, user]);

  // Load ticket details when selectedTicketId changes
  useEffect(() => {
    if (!selectedTicketId || activeTab !== "support") return;
    const fetchTicketDetails = async () => {
      try {
        const res = await fetch(`${API}/api/support/${selectedTicketId}`);
        if (res.ok) {
          const body = await res.json();
          setSelectedTicket(body.ticket);
          setTicketMessages(body.messages || []);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchTicketDetails();
  }, [selectedTicketId, activeTab]);

  const handleMarkAllRead = async () => {
    await fetch(`${API}/api/notifications/read`, { method: "PUT" });
    setUnreadNotifCount(0);
    fetchTabContent();
  };

  const handleRetryWhatsapp = async (msgId: string) => {
    setRetryId(msgId);
    try {
      const res = await fetch(`${API}/api/whatsapp/${msgId}/retry`, { method: "POST" });
      if (res.ok) {
        fetchTabContent();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRetryId(null);
    }
  };

  const handleCreateTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle.trim() || !newTicketMessage.trim()) return;
    setCreatingTicket(true);

    try {
      const res = await fetch(`${API}/api/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTicketTitle,
          category: newTicketCategory,
          priority: newTicketPriority,
          message: newTicketMessage
        }),
      });

      if (res.ok) {
        const newT = await res.json();
        setTickets((prev) => [newT, ...prev]);
        setSelectedTicketId(newT.id);
        setShowCreateTicketModal(false);
        setNewTicketTitle("");
        setNewTicketMessage("");
        fetchInboxStats();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingTicket(false);
    }
  };

  const handleSendTicketMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicketId) return;

    try {
      const res = await fetch(`${API}/api/support/${selectedTicketId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyText })
      });

      if (res.ok) {
        const newMsg = await res.json();
        setTicketMessages((prev) => [...prev, newMsg]);
        setReplyText("");
        // Update ticket list state updated_at
        setTickets((prev) =>
          prev.map((t) => (t.id === selectedTicketId ? { ...t, updated_at: new Date().toISOString() } : t))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCloseTicket = async (statusVal: "Resolved" | "Closed") => {
    if (!selectedTicketId) return;
    try {
      const res = await fetch(`${API}/api/support/${selectedTicketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusVal })
      });
      if (res.ok) {
        setSelectedTicket((prev: any) => ({ ...prev, status: statusVal }));
        setTickets((prev) =>
          prev.map((t) => (t.id === selectedTicketId ? { ...t, status: statusVal } : t))
        );
        fetchInboxStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center bg-background">
        <Inbox className="w-12 h-12 text-muted-foreground opacity-30 animate-pulse" />
        <h2 className="text-xl font-bold">Sign In Required</h2>
        <p className="text-sm text-muted-foreground max-w-sm">Please log in to access your unified communications inbox.</p>
        <Link href="/login"><Button className="bg-primary hover:opacity-95 text-white font-bold rounded-xl px-6">Sign In</Button></Link>
      </div>
    );
  }

  // Filter lists based on query & selected type
  const filterAndSearch = (items: any[], searchKey: string) => {
    return items.filter((item) => {
      const queryMatch = searchQuery
        ? String(item[searchKey] || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(item.message || "").toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      if (filterType === "unread" && item.is_read !== undefined) {
        return queryMatch && !item.is_read;
      }
      return queryMatch;
    });
  };

  const filteredNotifs = filterAndSearch(notifications, "title");
  const filteredEmails = filterAndSearch(emails, "subject");
  const filteredWhatsapp = filterAndSearch(whatsapp, "message");
  const filteredAppts = filterAndSearch(appointments, "consultant_name");
  const filteredTickets = filterAndSearch(tickets, "title");
  const filteredAnnouncements = filterAndSearch(announcements, "title");
  const filteredDownloads = filterAndSearch(downloads, "title");

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Search Header Bar */}
      <div className="border-b border-border/40 bg-card/60 sticky top-16 z-30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Inbox className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white leading-none">Communication Center</h1>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-black tracking-widest">Unified Student Feed</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-grow sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs and tickets..."
                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-card border border-border rounded-xl px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">All Items</option>
              <option value="unread">Unread Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ── Left Sidebar: Navigation tabs ── */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-border rounded-3xl p-4 space-y-1">
              {[
                { id: "notifications", label: "Notifications", icon: Bell, badge: unreadNotifCount },
                { id: "whatsapp", label: "WhatsApp Log", icon: MessageSquare },
                { id: "emails", label: "Email History", icon: Mail },
                { id: "appointments", label: "Consultations", icon: Calendar },
                { id: "support", label: "Support Tickets", icon: AlertCircle, badge: openTicketsCount },
                { id: "announcements", label: "Announcements", icon: ShieldAlert },
                { id: "downloads", label: "Downloads Hub", icon: Download },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${active ? "bg-primary text-white font-bold" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge != null && tab.badge > 0 && (
                      <span className={`px-2 py-0.5 text-[10px] font-black rounded-full shrink-0 ${active ? "bg-white text-primary" : "bg-primary/10 text-primary"}`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ── Main View Area ── */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {/* --- 1. Notifications --- */}
                  {activeTab === "notifications" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Notifications Inbox ({filteredNotifs.length})</h3>
                        {unreadNotifCount > 0 && (
                          <Button onClick={handleMarkAllRead} variant="ghost" size="sm" className="h-7 text-xs font-bold text-primary hover:underline">
                            Mark all as read
                          </Button>
                        )}
                      </div>
                      
                      {filteredNotifs.length === 0 ? (
                        <div className="text-center py-16 bg-card border border-dashed border-border rounded-3xl">
                          <Bell className="w-10 h-10 text-muted-foreground opacity-30 mx-auto mb-3" />
                          <h4 className="font-bold text-sm">Notifications Clear</h4>
                        </div>
                      ) : (
                        filteredNotifs.map((n) => (
                          <div 
                            key={n.id} 
                            className={`bg-card border rounded-2xl p-4 flex gap-3.5 transition-all ${!n.is_read ? "border-primary/45 bg-gradient-to-r from-primary/5 via-card to-card" : "border-border"}`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.type === "success" ? "bg-emerald-500/10 text-emerald-500" : n.type === "warning" ? "bg-amber-500/10 text-amber-500" : "bg-indigo-500/10 text-indigo-400"}`}>
                              <Bell className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-grow">
                              <div className="flex items-center justify-between gap-4">
                                <h4 className="font-bold text-sm text-foreground">{n.title}</h4>
                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{new Date(n.created_at).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed mt-1.5 font-medium">{n.message}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* --- 2. WhatsApp Log --- */}
                  {activeTab === "whatsapp" && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">WhatsApp Delivery Timelines</h3>
                      {filteredWhatsapp.length === 0 ? (
                        <div className="text-center py-16 bg-card border border-dashed border-border rounded-3xl">
                          <MessageSquare className="w-10 h-10 text-muted-foreground opacity-30 mx-auto mb-3" />
                          <h4 className="font-bold text-sm">No WhatsApp message history</h4>
                        </div>
                      ) : (
                        filteredWhatsapp.map((w) => (
                          <div key={w.id} className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="min-w-0 flex-grow">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-foreground">{w.phone_number}</span>
                                <span className="text-[9px] bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                                  {w.template_name}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium bg-muted/40 p-3 rounded-xl">
                                {w.message}
                              </p>
                              <div className="text-[10px] text-muted-foreground mt-2">
                                Sent {new Date(w.created_at).toLocaleString()}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                              {w.status === "Sent" ? (
                                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                                  <Check className="w-3.5 h-3.5" /> Delivered
                                </span>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-red-500 font-bold flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                                    <XCircle className="w-3.5 h-3.5" /> Send Failed
                                  </span>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleRetryWhatsapp(w.id)}
                                    disabled={retryId === w.id}
                                    className="rounded-xl h-8 text-[10px] font-bold bg-primary hover:opacity-95 text-white gap-1"
                                  >
                                    {retryId === w.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                                    Retry
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* --- 3. Email History --- */}
                  {activeTab === "emails" && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Transactional Email Logs</h3>
                      {filteredEmails.length === 0 ? (
                        <div className="text-center py-16 bg-card border border-dashed border-border rounded-3xl">
                          <Mail className="w-10 h-10 text-muted-foreground opacity-30 mx-auto mb-3" />
                          <h4 className="font-bold text-sm">No emails sent yet</h4>
                        </div>
                      ) : (
                        filteredEmails.map((e) => (
                          <div key={e.id} className="bg-card border border-border rounded-2xl p-4 hover:border-primary/20 transition-all cursor-pointer group" onClick={() => setSelectedEmail(e)}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{e.subject}</h4>
                                <div className="text-[10px] text-muted-foreground mt-1">To: {e.recipient_email} • Sent {new Date(e.created_at).toLocaleString()}</div>
                              </div>
                              <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                                {e.status}
                              </span>
                            </div>
                            
                            {e.attachments?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/40">
                                {e.attachments.map((file: any, fidx: number) => (
                                  <a 
                                    key={fidx} 
                                    href={file.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    onClick={(event) => event.stopPropagation()}
                                    className="flex items-center gap-1.5 text-[10px] bg-muted/60 border border-border px-2 py-1 rounded-md text-muted-foreground hover:text-primary transition-colors"
                                  >
                                    <Paperclip className="w-3 h-3" />
                                    <span>{file.name} ({file.size})</span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* --- 4. Consultations & Appointments --- */}
                  {activeTab === "appointments" && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Advising & Consultations Schedule</h3>
                      {filteredAppts.length === 0 ? (
                        <div className="text-center py-16 bg-card border border-dashed border-border rounded-3xl">
                          <Calendar className="w-10 h-10 text-muted-foreground opacity-30 mx-auto mb-3" />
                          <h4 className="font-bold text-sm">No consultations scheduled</h4>
                        </div>
                      ) : (
                        filteredAppts.map((ap) => (
                          <div key={ap.id} className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="min-w-0 flex-grow">
                              <div className="flex items-center gap-2.5">
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${ap.status === "upcoming" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`}>
                                  {ap.status}
                                </span>
                                <h4 className="font-bold text-sm text-foreground">{ap.consultant_name}</h4>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2 font-medium">
                                Schedule time: <span className="text-foreground">{new Date(ap.date_time).toLocaleString()}</span>
                              </p>
                              {ap.notes && (
                                <div className="text-xs text-muted-foreground bg-muted/30 border border-border/40 p-3 rounded-xl mt-3 font-medium">
                                  <strong>Meeting Notes:</strong> {ap.notes}
                                </div>
                              )}
                            </div>

                            {ap.status === "upcoming" && (
                              <a href={ap.meeting_link} target="_blank" rel="noreferrer" className="shrink-0 self-end sm:self-center">
                                <Button className="bg-primary hover:opacity-95 text-white font-bold rounded-xl h-9 text-xs gap-1.5">
                                  Launch Zoom/Calendly <ExternalLink className="w-3.5 h-3.5" />
                                </Button>
                              </a>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* --- 5. Support Tickets --- */}
                  {activeTab === "support" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Ticket list side */}
                      <div className="space-y-3 lg:col-span-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-2 scrollbar-none">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">My Support Tickets</h3>
                          <Button onClick={() => setShowCreateTicketModal(true)} size="sm" className="h-7 text-xs font-bold bg-primary text-white rounded-xl gap-1">
                            <Plus className="w-3.5 h-3.5" /> Create
                          </Button>
                        </div>

                        {filteredTickets.length === 0 ? (
                          <div className="text-center py-12 bg-card border border-dashed border-border rounded-2xl">
                            <AlertCircle className="w-8 h-8 text-muted-foreground opacity-30 mx-auto mb-2" />
                            <h4 className="font-bold text-xs">No active tickets</h4>
                          </div>
                        ) : (
                          filteredTickets.map((t) => {
                            const active = selectedTicketId === t.id;
                            return (
                              <div
                                key={t.id}
                                onClick={() => setSelectedTicketId(t.id)}
                                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${active ? "border-primary bg-primary/5" : "bg-card border-border hover:border-primary/20"}`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[9px] bg-slate-800 border border-slate-700 text-slate-400 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">{t.category}</span>
                                  <span className={`text-[10px] font-bold ${t.priority === "Urgent" ? "text-red-500" : t.priority === "High" ? "text-amber-500" : "text-slate-400"}`}>{t.priority}</span>
                                </div>
                                <h4 className="font-bold text-xs text-foreground mt-2 line-clamp-1">{t.title}</h4>
                                <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground font-semibold">
                                  <span className={t.status === "Open" ? "text-primary" : t.status === "InProgress" ? "text-amber-500" : "text-emerald-500"}>{t.status}</span>
                                  <span>{new Date(t.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Ticket details thread pane */}
                      <div className="lg:col-span-2">
                        {selectedTicket ? (
                          <div className="bg-card border border-border rounded-3xl p-5 flex flex-col h-[calc(100vh-220px)] justify-between">
                            <div>
                              {/* Ticket title header */}
                              <div className="flex items-start justify-between gap-4 border-b border-border/40 pb-4 mb-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{selectedTicket.category}</span>
                                    <span className="text-xs text-muted-foreground font-semibold">Status: <strong className={selectedTicket.status === "Resolved" ? "text-emerald-500" : "text-primary"}>{selectedTicket.status}</strong></span>
                                  </div>
                                  <h4 className="font-bold text-base text-foreground mt-2">{selectedTicket.title}</h4>
                                </div>
                                
                                {selectedTicket.status !== "Closed" && (
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <Button onClick={() => handleCloseTicket("Resolved")} size="sm" variant="outline" className="h-8 text-xs font-bold border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10">
                                      Resolve
                                    </Button>
                                    <Button onClick={() => handleCloseTicket("Closed")} size="sm" variant="ghost" className="h-8 text-xs font-bold text-red-500 hover:bg-red-500/10">
                                      Close
                                    </Button>
                                  </div>
                                )}
                              </div>

                              {/* Ticket message scroll thread */}
                              <div className="space-y-4 max-h-[calc(100vh-420px)] overflow-y-auto pr-2 scrollbar-thin">
                                {ticketMessages.map((msg) => {
                                  const isUser = msg.sender_role === "student";
                                  return (
                                    <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                                      <div className={`w-7.5 h-7.5 rounded-full shrink-0 flex items-center justify-center font-bold text-xs uppercase ${isUser ? "bg-primary text-white" : "bg-slate-800 text-slate-300 border border-slate-700"}`}>
                                        {isUser ? "U" : "S"}
                                      </div>
                                      <div className={`p-3 rounded-2xl border text-xs leading-relaxed font-medium ${isUser ? "bg-primary/5 border-primary/20 text-foreground" : "bg-muted/40 border-border text-muted-foreground"}`}>
                                        <p>{msg.message}</p>
                                        <span className="text-[9px] text-muted-foreground mt-1.5 block text-right font-semibold">
                                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Reply Input block */}
                            {selectedTicket.status !== "Closed" ? (
                              <form onSubmit={handleSendTicketMessageSubmit} className="relative mt-4 border-t border-border/40 pt-4 flex gap-2">
                                <input
                                  type="text"
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Type reply message on ticket..."
                                  className="w-full bg-background border border-border rounded-xl py-2.5 pl-4 pr-10 text-xs outline-none focus:border-primary"
                                />
                                <button type="submit" className="absolute right-3 top-[26px] text-muted-foreground hover:text-primary transition-colors">
                                  <Send className="w-4 h-4" />
                                </button>
                              </form>
                            ) : (
                              <div className="text-center py-3 text-xs text-muted-foreground font-semibold uppercase tracking-wider bg-muted/40 border border-border rounded-2xl mt-4">
                                Ticket has been closed.
                              </div>
                            )}

                          </div>
                        ) : (
                          <div className="text-center py-20 bg-card border border-dashed border-border rounded-3xl h-[calc(100vh-220px)] flex flex-col items-center justify-center">
                            <AlertCircle className="w-10 h-10 text-muted-foreground opacity-30 mb-3" />
                            <h4 className="font-bold text-sm">Select a ticket</h4>
                            <p className="text-xs text-muted-foreground mt-1">Select from list to view chat conversation.</p>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* --- 6. Announcements --- */}
                  {activeTab === "announcements" && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground font-sans">Global System Bulletins</h3>
                      {filteredAnnouncements.length === 0 ? (
                        <div className="text-center py-16 bg-card border border-dashed border-border rounded-3xl">
                          <ShieldAlert className="w-10 h-10 text-muted-foreground opacity-30 mx-auto mb-3" />
                          <h4 className="font-bold text-sm">No announcements posted</h4>
                        </div>
                      ) : (
                        filteredAnnouncements.map((an) => (
                          <div key={an.id} className="bg-card border border-border rounded-2xl p-5 space-y-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${an.priority === "Critical" ? "bg-red-500/10 text-red-500 border border-red-500/20" : an.priority === "Important" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"}`}>
                                  {an.priority}
                                </span>
                                <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">{an.category}</span>
                              </div>
                              <span className="text-xs text-muted-foreground font-semibold">{new Date(an.created_at).toLocaleDateString()}</span>
                            </div>
                            <h4 className="font-bold text-sm text-foreground">{an.title}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed font-medium">{an.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* --- 7. Downloads Hub --- */}
                  {activeTab === "downloads" && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Unified Downloads Center</h3>
                      {filteredDownloads.length === 0 ? (
                        <div className="text-center py-16 bg-card border border-dashed border-border rounded-3xl">
                          <Download className="w-10 h-10 text-muted-foreground opacity-30 mx-auto mb-3" />
                          <h4 className="font-bold text-sm">No files ready for download</h4>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {filteredDownloads.map((dl) => (
                            <div key={dl.id} className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:border-primary/20 transition-all group">
                              <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                  <FileText className="w-4.5 h-4.5 text-primary" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-bold text-xs text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">{dl.title}</h4>
                                  <span className="text-[9px] text-muted-foreground font-semibold mt-1.5 block uppercase tracking-wider">{dl.file_type}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-4">
                                <span className="text-[10px] text-muted-foreground font-semibold">
                                  {dl.file_size_bytes ? `${(dl.file_size_bytes / (1024 * 1024)).toFixed(1)} MB` : "Unknown Size"}
                                </span>
                                <a href={dl.file_url} target="_blank" rel="noreferrer">
                                  <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold rounded-lg gap-1">
                                    Download <Download className="w-3 h-3" />
                                  </Button>
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            )}
          </main>

        </div>
      </div>

      {/* --- Rich Email Viewer Modal Popup --- */}
      <AnimatePresence>
        {selectedEmail && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-border/60 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-base text-foreground leading-snug">{selectedEmail.subject}</h4>
                  <div className="text-xs text-muted-foreground mt-1">To: {selectedEmail.recipient_email} • Sent {new Date(selectedEmail.created_at).toLocaleString()}</div>
                </div>
                <button onClick={() => setSelectedEmail(null)} className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Email body render */}
              <div 
                className="p-6 overflow-y-auto flex-grow text-sm leading-relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: selectedEmail.body_html }}
              />

              {/* Attachments if any */}
              {selectedEmail.attachments?.length > 0 && (
                <div className="p-4 bg-muted/40 border-t border-border/60 flex flex-wrap gap-2">
                  {selectedEmail.attachments.map((file: any, fidx: number) => (
                    <a 
                      key={fidx} 
                      href={file.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs bg-card border border-border px-3 py-1.5 rounded-xl text-muted-foreground hover:text-primary transition-all shadow-xs"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{file.name} ({file.size})</span>
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Create support ticket modal --- */}
      <AnimatePresence>
        {showCreateTicketModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border rounded-3xl w-full max-w-md overflow-hidden"
            >
              <div className="p-5 border-b border-border/60 flex items-center justify-between">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Open Support Ticket</h3>
                <button onClick={() => setShowCreateTicketModal(false)} className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTicketSubmit} className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ticket Title</label>
                  <input
                    type="text"
                    value={newTicketTitle}
                    onChange={(e) => setNewTicketTitle(e.target.value)}
                    placeholder="Brief summary of request..."
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Category</label>
                    <select
                      value={newTicketCategory}
                      onChange={(e) => setNewTicketCategory(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="General">General</option>
                      <option value="Technical">Technical</option>
                      <option value="Payments">Payments</option>
                      <option value="Visa">Visa</option>
                      <option value="University">University</option>
                      <option value="Scholarships">Scholarships</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Priority</label>
                    <select
                      value={newTicketPriority}
                      onChange={(e) => setNewTicketPriority(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-2.5 py-2 text-xs font-semibold outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Initial Message</label>
                  <textarea
                    value={newTicketMessage}
                    onChange={(e) => setNewTicketMessage(e.target.value)}
                    placeholder="Describe your issue in detail..."
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-primary min-h-[100px] resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" onClick={() => setShowCreateTicketModal(false)} variant="ghost" className="rounded-xl h-9 text-xs font-semibold">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={creatingTicket} className="rounded-xl bg-primary text-white font-bold h-9 text-xs px-5">
                    {creatingTicket ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Submit Ticket"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

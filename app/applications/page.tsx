"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trello, 
  List, 
  CalendarDays, 
  Plus, 
  Search, 
  Filter, 
  Loader2, 
  CheckSquare, 
  FileText, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  MapPin, 
  DollarSign, 
  ChevronRight,
  BookOpen,
  Calendar,
  X,
  FileCheck,
  ClipboardList,
  Sparkles,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  status: "pending" | "completed";
  due_date?: string;
  priority: string;
}

interface AppDoc {
  id: string;
  document_name: string;
  status: string;
}

interface AppNote {
  id: string;
  title: string;
  content: string;
}

interface TimelineEvent {
  id: string;
  event_title: string;
  event_description?: string;
  created_at: string;
}

interface Application {
  id: string;
  university: string;
  country: string;
  course: string;
  degree: string;
  intake: string;
  tuition_fee?: string;
  application_fee?: string;
  deadline?: string;
  current_status: string;
  priority: string;
  notes?: string;
  tasks: Task[];
  documents: AppDoc[];
  notes_list: AppNote[];
  timeline: TimelineEvent[];
}

export default function ApplicationManager() {
  const router = useRouter();
  
  // View states
  const [viewMode, setViewMode] = useState<"kanban" | "list" | "calendar">("kanban");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");

  // Core data states
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Create Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUni, setNewUni] = useState("");
  const [newCountry, setNewCountry] = useState("Canada");
  const [newCourse, setNewCourse] = useState("");
  const [newDegree, setNewDegree] = useState("Master's");
  const [newIntake, setNewIntake] = useState("Fall 2026");
  const [newDeadline, setNewDeadline] = useState("2026-01-15");
  const [newTuition, setNewTuition] = useState("");
  const [newAppFee, setNewAppFee] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newNotes, setNewNotes] = useState("");

  // Quick task adding state in detail pane
  const [quickTaskTitle, setQuickTaskTitle] = useState("");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Pipeline lanes definitions
  const stages = [
    "Interested",
    "Shortlisted",
    "Documents Preparing",
    "Application Submitted",
    "Offer Letter Received",
    "Ready to Travel"
  ];

  // Fetch all applications on Mount
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/api/applications`);
      if (!res.ok) throw new Error("Could not load application logs.");
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.warn("Backend offline. Setting up local fallback application seeds.");
      setupFallbackSeeds();
    } finally {
      setLoading(false);
    }
  };

  const setupFallbackSeeds = () => {
    const mockApps: Application[] = [
      {
        id: "app_uoft",
        university: "University of Toronto",
        country: "Canada",
        course: "M.S. in Computer Science",
        degree: "Master's",
        intake: "Fall 2026",
        tuition_fee: "$38,000 CAD",
        application_fee: "$125 CAD",
        deadline: "2026-01-15",
        current_status: "Shortlisted",
        priority: "High",
        notes: "Requires strong GPA and research experience summary.",
        tasks: [
          { id: "t1", title: "Draft Statement of Purpose", status: "completed", priority: "High" },
          { id: "t2", title: "Request Academic LORs", status: "pending", priority: "Medium" }
        ],
        documents: [
          { id: "d1", document_name: "Passport", status: "Uploaded" },
          { id: "d2", document_name: "SOP", status: "Uploaded" },
          { id: "d3", document_name: "Transcripts", status: "Pending" }
        ],
        notes_list: [],
        timeline: [
          { id: "tm1", event_title: "Application Created", event_description: "Shortlisted course for Fall 2026 intake.", created_at: new Date().toISOString() }
        ]
      },
      {
        id: "app_tum",
        university: "TUM (Technical University of Munich)",
        country: "Germany",
        course: "M.S. in Software Engineering",
        degree: "Master's",
        intake: "Fall 2026",
        tuition_fee: "€0 EUR",
        application_fee: "€0 EUR",
        deadline: "2026-05-31",
        current_status: "Interested",
        priority: "Medium",
        notes: "No tuition fee. Verify credit matching rules.",
        tasks: [
          { id: "t3", title: "Get transcripts certified", status: "pending", priority: "Medium" }
        ],
        documents: [
          { id: "d4", document_name: "Passport", status: "Uploaded" },
          { id: "d5", document_name: "Resume", status: "Pending" }
        ],
        notes_list: [],
        timeline: [
          { id: "tm2", event_title: "Application Created", event_description: "Added to backlog list.", created_at: new Date().toISOString() }
        ]
      }
    ];
    setApplications(mockApps);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // HTML5 Native Drag Start Handler
  const handleDragStart = (e: React.DragEvent, appId: string) => {
    e.dataTransfer.setData("text/plain", appId);
  };

  // HTML5 Native Drop Handler
  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData("text/plain");
    
    // Update state locally
    setApplications((prev) => 
      prev.map((app) => app.id === appId ? { ...app, current_status: targetStatus } : app)
    );

    // Call backend API update
    try {
      await fetch(`${apiBaseUrl}/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_status: targetStatus })
      });
    } catch (err) {
      console.warn("Backend offline. Status update cached locally.");
    }
  };

  // Create application handler
  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      university: newUni,
      country: newCountry,
      course: newCourse,
      degree: newDegree,
      intake: newIntake,
      tuition_fee: newTuition || null,
      application_fee: newAppFee || null,
      deadline: newDeadline || null,
      current_status: "Interested",
      priority: newPriority,
      notes: newNotes
    };

    try {
      const res = await fetch(`${apiBaseUrl}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowCreateModal(false);
        fetchApplications();
      }
    } catch (err) {
      console.warn("Offline. Appending simulated application.");
      const simulatedApp: Application = {
        id: `app_sim_${Math.random().toString(36).substr(2, 9)}`,
        university: newUni,
        country: newCountry,
        course: newCourse,
        degree: newDegree,
        intake: newIntake,
        tuition_fee: newTuition,
        application_fee: newAppFee,
        deadline: newDeadline,
        current_status: "Interested",
        priority: newPriority,
        notes: newNotes,
        tasks: [
          { id: `t_${Math.random()}`, title: "Generate SOP", status: "pending", priority: "High" },
          { id: `t_${Math.random()}`, title: "Upload Passport", status: "pending", priority: "High" }
        ],
        documents: [
          { id: `d_${Math.random()}`, document_name: "Passport", status: "Pending" },
          { id: `d_${Math.random()}`, document_name: "SOP", status: "Pending" }
        ],
        notes_list: [],
        timeline: [
          { id: `tm_${Math.random()}`, event_title: "Application Created", created_at: new Date().toISOString() }
        ]
      };
      setApplications((prev) => [...prev, simulatedApp]);
      setShowCreateModal(false);
    } finally {
      setLoading(false);
    }
  };

  // Toggle task checkbox status
  const handleToggleTask = async (taskId: string) => {
    if (!selectedApp) return;
    
    // Local Update
    const updatedTasks = selectedApp.tasks.map(t => 
      t.id === taskId ? { ...t, status: t.status === "completed" ? "pending" as const : "completed" as const } : t
    );
    const updatedApp = { ...selectedApp, tasks: updatedTasks };
    
    setSelectedApp(updatedApp);
    setApplications(prev => prev.map(a => a.id === selectedApp.id ? updatedApp : a));

    try {
      await fetch(`${apiBaseUrl}/api/application/tasks/${taskId}/toggle`, { method: "PUT" });
    } catch (err) {
      console.warn("Task state saved locally.");
    }
  };

  // Add new task handler in details panel
  const handleAddQuickTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !quickTaskTitle.trim()) return;

    const payload = {
      application_id: selectedApp.id,
      title: quickTaskTitle,
      priority: "Medium"
    };

    try {
      const res = await fetch(`${apiBaseUrl}/api/application/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      const updatedApp = { ...selectedApp, tasks: [...selectedApp.tasks, data] };
      setSelectedApp(updatedApp);
      setApplications(prev => prev.map(a => a.id === selectedApp.id ? updatedApp : a));
    } catch (err) {
      const mockTask: Task = {
        id: `t_sim_${Math.random()}`,
        title: quickTaskTitle,
        status: "pending",
        priority: "Medium"
      };
      const updatedApp = { ...selectedApp, tasks: [...selectedApp.tasks, mockTask] };
      setSelectedApp(updatedApp);
      setApplications(prev => prev.map(a => a.id === selectedApp.id ? updatedApp : a));
    } finally {
      setQuickTaskTitle("");
    }
  };

  // Document Checklist Status Change
  const handleDocStatusChange = async (docName: string, statusVal: string) => {
    if (!selectedApp) return;

    // Local state change
    const updatedDocs = selectedApp.documents.map(d => 
      d.document_name === docName ? { ...d, status: statusVal } : d
    );
    const updatedApp = { ...selectedApp, documents: updatedDocs };
    setSelectedApp(updatedApp);
    setApplications(prev => prev.map(a => a.id === selectedApp.id ? updatedApp : a));

    try {
      await fetch(`${apiBaseUrl}/api/application/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id: selectedApp.id,
          document_name: docName,
          status: statusVal
        })
      });
    } catch (err) {
      console.warn("Document state saved locally.");
    }
  };

  // Remove application handler
  const handleDeleteApp = async (appId: string) => {
    if (!confirm("Are you sure you want to delete this application workspace?")) return;
    
    // Local delete
    setApplications(prev => prev.filter(a => a.id !== appId));
    if (selectedApp?.id === appId) setSelectedApp(null);

    try {
      await fetch(`${apiBaseUrl}/api/applications/${appId}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Removed locally.");
    }
  };

  // Filter search results
  const getFilteredApplications = () => {
    return applications.filter((app) => {
      const matchSearch = app.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.course.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCountry = countryFilter === "All" || app.country === countryFilter;
      return matchSearch && matchCountry;
    });
  };

  // Timeline events calculator
  const statsOverview = {
    total: applications.length,
    shortlisted: applications.filter(a => a.current_status === "Shortlisted").length,
    submitted: applications.filter(a => a.current_status === "Application Submitted").length,
    visa: applications.filter(a => a.current_status.startsWith("Visa")).length
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">Applications Hub</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Track deadlines, checklist milestones, and document folders.</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full shadow-md flex items-center gap-1.5 cursor-pointer w-fit"
          >
            <Plus className="w-5 h-5" />
            <span>Track New Course</span>
          </Button>
        </div>

        {/* Stats Grid Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Tracked Programs</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{statsOverview.total}</h3>
          </div>
          <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Shortlisted list</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{statsOverview.shortlisted}</h3>
          </div>
          <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Submitted Packs</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{statsOverview.submitted}</h3>
          </div>
          <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Visa Processing</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{statsOverview.visa}</h3>
          </div>
        </div>

        {/* View Toggle Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50 border border-gray-150 rounded-2xl p-3 mb-8">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="ghost"
              onClick={() => setViewMode("kanban")}
              className={`h-9 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                viewMode === "kanban" ? "bg-white text-blue-600 shadow-xs border border-gray-250/20" : "text-gray-500"
              }`}
            >
              <Trello className="w-4 h-4" />
              <span>Kanban Board</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setViewMode("list")}
              className={`h-9 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                viewMode === "list" ? "bg-white text-blue-600 shadow-xs border border-gray-250/20" : "text-gray-500"
              }`}
            >
              <List className="w-4 h-4" />
              <span>List View</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setViewMode("calendar")}
              className={`h-9 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                viewMode === "calendar" ? "bg-white text-blue-600 shadow-xs border border-gray-250/20" : "text-gray-500"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Deadlines Calendar</span>
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none w-full font-medium"
              />
            </div>

            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none font-bold shrink-0"
            >
              <option value="All">All Countries</option>
              <option value="Canada">Canada</option>
              <option value="USA">USA</option>
              <option value="Germany">Germany</option>
              <option value="UK">UK</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <p className="text-sm font-semibold text-gray-500">Retrieving applications timeline...</p>
          </div>
        ) : (
          <div>
            
            {/* VIEW A: KANBAN PIPELINE BOARD */}
            {viewMode === "kanban" && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5 overflow-x-auto min-h-[500px] items-start pb-6">
                {stages.map((stage) => {
                  const stageApps = getFilteredApplications().filter(a => a.current_status === stage);
                  return (
                    <div 
                      key={stage}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, stage)}
                      className="bg-gray-50/50 border border-gray-150 rounded-2xl p-4 min-h-[400px] flex flex-col gap-4 shrink-0 min-w-[200px]"
                    >
                      {/* Lane Header */}
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-1">
                        <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-wider truncate max-w-[120px]">
                          {stage}
                        </h4>
                        <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                          {stageApps.length}
                        </span>
                      </div>

                      {/* Cards list */}
                      <div className="flex flex-col gap-3">
                        {stageApps.map((app) => (
                          <div
                            key={app.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, app.id)}
                            onClick={() => setSelectedApp(app)}
                            className="bg-white border border-gray-100 hover:border-blue-400 rounded-xl p-3.5 shadow-xs cursor-pointer transition-all hover:shadow-sm"
                          >
                            <h5 className="font-extrabold text-gray-950 text-xs leading-snug">{app.university}</h5>
                            <p className="text-[9px] text-gray-400 font-bold mt-1">{app.course}</p>
                            
                            <div className="flex items-center justify-between border-t border-gray-50 pt-2 mt-3 text-[9px] text-gray-400 font-semibold">
                              <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                                {app.country}
                              </span>
                              {app.deadline && (
                                <span className="flex items-center gap-0.5 text-rose-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{app.deadline.slice(5)}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW B: LIST VIEW TABLE */}
            {viewMode === "list" && (
              <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <th className="py-4 px-6">University</th>
                        <th className="py-4 px-6">Course / Degree</th>
                        <th className="py-4 px-6">Intake</th>
                        <th className="py-4 px-6">Pipeline Status</th>
                        <th className="py-4 px-6 text-center">Priority</th>
                        <th className="py-4 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredApplications().length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center text-xs text-gray-400 py-12">No applications match criteria.</td>
                        </tr>
                      ) : (
                        getFilteredApplications().map((app) => (
                          <tr 
                            key={app.id}
                            onClick={() => setSelectedApp(app)}
                            className="border-b border-gray-50 text-xs font-semibold text-gray-700 hover:bg-gray-50/50 cursor-pointer"
                          >
                            <td className="py-4 px-6 font-extrabold text-gray-950">{app.university}</td>
                            <td className="py-4 px-6">{app.course} ({app.degree})</td>
                            <td className="py-4 px-6">{app.intake}</td>
                            <td className="py-4 px-6">
                              <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                {app.current_status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold ${
                                app.priority === "High" ? "bg-rose-50 text-rose-600" : "bg-gray-100 text-gray-600"
                              }`}>
                                {app.priority}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={() => handleDeleteApp(app.id)}
                                className="p-1 text-gray-400 hover:text-red-650 rounded hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW C: CALENDAR DEADLINES VIEW */}
            {viewMode === "calendar" && (
              <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-xs">
                <div className="border-b border-gray-50 pb-3 mb-6">
                  <h3 className="font-extrabold text-gray-950 text-xs uppercase tracking-wider">Scheduled Application Deadlines</h3>
                </div>
                <div className="flex flex-col gap-4">
                  {getFilteredApplications().filter(a => a.deadline).length === 0 ? (
                    <p className="text-center text-xs text-gray-400 py-12">No upcoming application deadlines recorded.</p>
                  ) : (
                    getFilteredApplications().filter(a => a.deadline).map((app) => (
                      <div key={app.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-8 h-8 text-blue-600" />
                          <div>
                            <h4 className="font-extrabold text-gray-950 text-sm">{app.university}</h4>
                            <p className="text-[10px] text-gray-400 font-bold">{app.course}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-rose-500 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                            Deadline: {app.deadline}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================================================================== */}
        {/* SLIDE-OVER OVERLAY PANE: SINGLE APPLICATION DETAILS WORKSPACE */}
        {/* ==================================================================== */}
        <AnimatePresence>
          {selectedApp && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end no-print"
            >
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                className="w-full max-w-2xl bg-white h-screen overflow-y-auto p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="absolute right-4 top-4 p-1.5 rounded-lg text-gray-450 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div>
                  {/* Pane Header */}
                  <div className="border-b border-gray-100 pb-4 mb-6">
                    <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                      Workspace Details
                    </span>
                    <h3 className="font-black text-gray-950 text-xl mt-2 leading-snug">
                      {selectedApp.university}
                    </h3>
                    <p className="text-xs text-gray-400 font-bold mt-1">
                      {selectedApp.country} • {selectedApp.course}
                    </p>
                  </div>

                  {/* Accordion Panels Checklist grids */}
                  <div className="flex flex-col gap-6">
                    
                    {/* Task checklist manager */}
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-1">
                        <ClipboardList className="w-4 h-4 text-blue-500" />
                        <span>Tasks Checksheet</span>
                      </h4>

                      <div className="flex flex-col gap-2 bg-gray-50/50 border border-gray-150 p-4 rounded-2xl">
                        {selectedApp.tasks.length === 0 ? (
                          <p className="text-[11px] text-gray-400 text-center py-2">No tasks logged.</p>
                        ) : (
                          selectedApp.tasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-3 py-1 border-b border-gray-50 last:border-0">
                              <input
                                type="checkbox"
                                checked={task.status === "completed"}
                                onChange={() => handleToggleTask(task.id)}
                                className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
                              />
                              <span className={`text-xs font-semibold ${
                                task.status === "completed" ? "line-through text-gray-450" : "text-gray-700"
                              }`}>
                                {task.title}
                              </span>
                            </div>
                          ))
                        )}

                        {/* Quick Task add */}
                        <form onSubmit={handleAddQuickTask} className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                          <input
                            type="text"
                            placeholder="Add new task..."
                            value={quickTaskTitle}
                            onChange={(e) => setQuickTaskTitle(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none w-full font-medium"
                          />
                          <Button type="submit" className="bg-blue-650 hover:bg-blue-750 text-white font-bold text-xs h-8 px-3 rounded-lg cursor-pointer">
                            Add
                          </Button>
                        </form>
                      </div>
                    </div>

                    {/* Document vault checklist slots mapping */}
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-1">
                        <FileCheck className="w-4 h-4 text-blue-500" />
                        <span>Document Checklist</span>
                      </h4>

                      <div className="flex flex-col gap-3 bg-gray-50/50 border border-gray-150 p-4 rounded-2xl">
                        {selectedApp.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between gap-4 py-1 border-b border-gray-50 last:border-0">
                            <span className="text-xs font-semibold text-gray-700">{doc.document_name}</span>
                            <select
                              value={doc.status}
                              onChange={(e) => handleDocStatusChange(doc.document_name, e.target.value)}
                              className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-[10px] focus:outline-none font-bold"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Uploaded">Uploaded</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline Logs details */}
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>Activity Timeline Logs</span>
                      </h4>

                      <div className="flex flex-col gap-3 bg-gray-50/50 border border-gray-150 p-4 rounded-2xl max-h-48 overflow-y-auto">
                        {selectedApp.timeline.map((event) => (
                          <div key={event.id} className="flex gap-3 items-start text-xs border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                            <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                            <div>
                              <h5 className="font-extrabold text-gray-950">{event.event_title}</h5>
                              {event.event_description && <p className="text-[10px] text-gray-500 leading-snug mt-0.5">{event.event_description}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 mt-8">
                  <Button
                    onClick={() => setSelectedApp(null)}
                    className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 rounded-full text-xs cursor-pointer shadow-xs"
                  >
                    Close Sidebar Workspace
                  </Button>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================================================================== */}
        {/* CREATE APPLICATION DIALOG MODAL */}
        {/* ==================================================================== */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 sm:p-6 no-print"
            >
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl"
              >
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="absolute right-4 top-4 p-1.5 rounded-lg text-gray-450 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="border-b border-gray-50 pb-4 mb-6">
                  <h3 className="text-lg font-black text-gray-950 flex items-center gap-1.5">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span>Track New Application</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Add university and course details to the pipeline tracker.</p>
                </div>

                <form onSubmit={handleCreateApplication} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">University Name</label>
                    <input
                      type="text"
                      value={newUni}
                      onChange={(e) => setNewUni(e.target.value)}
                      className="bg-gray-55 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 font-medium"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Country</label>
                      <select
                        value={newCountry}
                        onChange={(e) => setNewCountry(e.target.value)}
                        className="bg-gray-55 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 font-bold"
                      >
                        <option value="Canada">Canada</option>
                        <option value="USA">USA</option>
                        <option value="Germany">Germany</option>
                        <option value="UK">UK</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Course / Major</label>
                      <input
                        type="text"
                        value={newCourse}
                        onChange={(e) => setNewCourse(e.target.value)}
                        className="bg-gray-55 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Degree Level</label>
                      <select
                        value={newDegree}
                        onChange={(e) => setNewDegree(e.target.value)}
                        className="bg-gray-55 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 font-bold"
                      >
                        <option value="Bachelor's">Bachelor's</option>
                        <option value="Master's">Master's</option>
                        <option value="Ph.D.">Ph.D.</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Intake Term</label>
                      <input
                        type="text"
                        value={newIntake}
                        onChange={(e) => setNewIntake(e.target.value)}
                        className="bg-gray-55 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 font-medium"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Deadline</label>
                      <input
                        type="date"
                        value={newDeadline}
                        onChange={(e) => setNewDeadline(e.target.value)}
                        className="bg-gray-55 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Tuition Fee / Year</label>
                      <input
                        type="text"
                        value={newTuition}
                        onChange={(e) => setNewTuition(e.target.value)}
                        className="bg-gray-55 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 font-medium"
                        placeholder="Optional"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Application Fee</label>
                      <input
                        type="text"
                        value={newAppFee}
                        onChange={(e) => setNewAppFee(e.target.value)}
                        className="bg-gray-55 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 font-medium"
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mt-2">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full text-xs shadow-md cursor-pointer"
                    >
                      Start Tracking Application
                    </Button>
                  </div>
                </form>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

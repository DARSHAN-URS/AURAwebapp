"use client";

import React, { useState } from "react";
import { 
  Plus, 
  MapPin, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  ClipboardList,
  FolderSync
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApplicationDocument {
  id: string;
  document_name: string;
  status: string;
  file_path: string | null;
}

interface Application {
  id: string;
  university: string;
  country: string;
  course: string;
  degree: string;
  intake: string;
  tuition_fee: string | null;
  application_fee: string | null;
  deadline: string | null;
  current_status: string; // Kanban column
  priority: string; // High, Medium, Low
  notes: string | null;
  documents: ApplicationDocument[];
}

interface JourneyKanbanProps {
  applications: Application[];
  onUpdateAppStatus: (appId: string, newStatus: string) => void;
  onDeleteApplication: (appId: string) => void;
  onCreateApplication: () => void;
}

const KANBAN_COLUMNS = [
  "Interested",
  "Shortlisted",
  "Preparing Documents",
  "Applied",
  "Under Review",
  "Offer Received",
  "Accepted",
  "Visa Stage",
  "Completed"
];

export default function JourneyKanban({
  applications,
  onUpdateAppStatus,
  onDeleteApplication,
  onCreateApplication
}: JourneyKanbanProps) {
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);

  const getPriorityBadgeColor = (p: string) => {
    if (p === "High") return "bg-rose-50 text-rose-600 border border-rose-100";
    if (p === "Medium") return "bg-amber-50 text-amber-600 border border-amber-100";
    return "bg-primary/10 text-primary border border-primary/20";
  };

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, appId: string) => {
    setDraggedAppId(appId);
    e.dataTransfer.setData("text/plain", appId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData("text/plain") || draggedAppId;
    if (appId) {
      onUpdateAppStatus(appId, targetStatus);
    }
    setDraggedAppId(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full select-none">
      {/* Action Header */}
      <div className="flex justify-between items-center no-print">
        <div>
          <h3 className="text-xs font-black uppercase text-muted-text tracking-wider">University Application Board</h3>
          <p className="text-[11px] text-muted-text mt-0.5 leading-snug">Drag and drop cards or click dropdowns to shift stages of admission.</p>
        </div>
        <Button
          onClick={onCreateApplication}
          className="bg-primary hover:bg-primary text-white font-bold py-1.5 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Application</span>
        </Button>
      </div>

      {/* Kanban Board Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin select-none snap-x snap-mandatory">
        {KANBAN_COLUMNS.map((colName) => {
          const colApps = applications.filter(a => a.current_status === colName);

          return (
            <div
              key={colName}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, colName)}
              className="w-72 bg-background/70 border border-border rounded-3xl p-4 flex flex-col gap-4 shrink-0 snap-align-start min-h-[420px]"
            >
              {/* Column Title Header */}
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="text-xs font-black text-foreground leading-none truncate max-w-[200px]">{colName}</span>
                <span className="bg-gray-250 text-muted-foreground font-extrabold text-[9px] px-2 py-0.5 rounded-full select-none leading-none">
                  {colApps.length}
                </span>
              </div>

              {/* Cards wrapper */}
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[360px] scrollbar-none pr-1">
                {colApps.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-10 border-2 border-dashed border-border rounded-2xl bg-card/40">
                    <ClipboardList className="w-6 h-6 text-gray-300 mb-1" />
                    <span className="text-[9px] text-muted-text font-bold">Drag cards here</span>
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div
                      key={app.id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, app.id)}
                      className="bg-card border border-border hover:border-blue-400 rounded-2xl p-4 shadow-sm hover:shadow-sm cursor-grab active:cursor-grabbing transition-all flex flex-col justify-between min-h-[140px]"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start gap-1">
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${getPriorityBadgeColor(app.priority)}`}>
                            {app.priority} Priority
                          </span>
                          <button
                            onClick={() => onDeleteApplication(app.id)}
                            className="text-muted-text hover:text-rose-600 p-0.5 rounded hover:bg-background cursor-pointer"
                            title="Remove Application"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <h4 className="text-xs font-black text-foreground truncate" title={app.university}>{app.university}</h4>
                          <span className="text-[10px] text-muted-foreground font-medium truncate block mt-0.5">{app.course}</span>
                        </div>
                      </div>

                      {/* Footer Info details */}
                      <div className="border-t border-border pt-2.5 mt-3 flex items-center justify-between text-[10px] text-muted-text">
                        <span className="flex items-center gap-1 font-bold">
                          <MapPin className="w-3 h-3 text-muted-text shrink-0" />
                          {app.country}
                        </span>
                        {app.deadline && (
                          <span className="font-extrabold text-[9px] bg-background text-muted-foreground px-1.5 py-0.5 rounded">
                            📅 {app.deadline}
                          </span>
                        )}
                      </div>

                      {/* Dropdown status selector helper for touch/mobile devices */}
                      <div className="mt-2.5 pt-2 border-t border-gray-50 flex items-center justify-between no-print">
                        <span className="text-[8px] text-muted-text font-bold uppercase flex items-center gap-1">
                          <FolderSync className="w-3 h-3 text-primary shrink-0" /> Status
                        </span>
                        <select
                          value={app.current_status}
                          onChange={(e) => onUpdateAppStatus(app.id, e.target.value)}
                          className="bg-background border border-border rounded px-1 py-0.5 text-[9px] font-bold text-muted-foreground focus:outline-none"
                        >
                          {KANBAN_COLUMNS.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

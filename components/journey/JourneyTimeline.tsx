"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  HelpCircle, 
  Clock, 
  BookOpen, 
  FileText,
  AlertCircle,
  MapPin,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Stage {
  id: string;
  stage_name: string;
  status: string;
  completion_percentage: number;
  notes: string | null;
  tasks_count: number;
  completed_tasks_count: number;
}

interface JourneyTimelineProps {
  stages: Stage[];
  currentStage: string;
  onUpdateStage: (stageName: string) => void;
}

export default function JourneyTimeline({
  stages,
  currentStage,
  onUpdateStage
}: JourneyTimelineProps) {
  const [selectedStageName, setSelectedStageName] = useState<string>("Eligibility");

  const selectedStage = stages.find(s => s.stage_name === selectedStageName) || stages[0];

  const getStatusColor = (status: string, isCurrent: boolean) => {
    if (isCurrent) return "border-blue-600 bg-primary/10 text-primary font-extrabold shadow-sm shadow-blue-100 ring-2 ring-blue-100 animate-pulse";
    if (status === "Completed") return "border-emerald-600 bg-emerald-50 text-emerald-700 font-bold";
    if (status === "Blocked") return "border-rose-600 bg-rose-50 text-rose-700 font-bold";
    if (status === "In Progress") return "border-amber-600 bg-amber-50 text-amber-700 font-bold";
    return "border-border bg-card text-muted-text font-semibold";
  };

  const getStageIcon = (stageName: string, status: string, isCurrent: boolean) => {
    if (status === "Completed") return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
    if (isCurrent) return <Clock className="w-5 h-5 text-primary shrink-0 animate-spin" style={{ animationDuration: '4s' }} />;
    return <Circle className="w-5 h-5 text-gray-300 shrink-0" />;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
      {/* Stages Interactive Track Line */}
      <div className="flex-1 w-full bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div>
          <h3 className="text-xs font-black uppercase text-muted-text tracking-wider">Aura Interactive Journey Path</h3>
          <p className="text-[11px] text-muted-text mt-0.5 leading-snug">Click any stage node below to detail tasks and track milestones.</p>
        </div>

        <div className="relative flex flex-col gap-3 max-h-[460px] overflow-y-auto pr-2 scrollbar-thin">
          {/* Vertical line connector */}
          <div className="absolute left-[22px] top-6 bottom-6 w-0.5 bg-muted z-0" />

          {stages.map((stage) => {
            const isCurrent = currentStage === stage.stage_name;
            const isSelected = selectedStageName === stage.stage_name;
            
            return (
              <div 
                key={stage.stage_name}
                onClick={() => setSelectedStageName(stage.stage_name)}
                className={`relative flex items-center justify-between p-3 rounded-2xl cursor-pointer border transition-all z-10 ${
                  isSelected 
                    ? "bg-primary/10/20 border-primary/40 shadow-sm" 
                    : "bg-card border-transparent hover:bg-background/50"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Status Indicator circle */}
                  <div className="relative shrink-0 z-20 bg-card">
                    {getStageIcon(stage.stage_name, stage.status, isCurrent)}
                  </div>

                  <div className="min-w-0">
                    <span className={`text-xs block leading-none font-bold ${isCurrent ? "text-primary" : isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                      {stage.stage_name}
                    </span>
                    <span className="text-[9px] text-muted-text font-semibold block mt-1">
                      {stage.completed_tasks_count} / {stage.tasks_count} Milestones
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Completion bubble */}
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${getStatusColor(stage.status, isCurrent)}`}>
                    {stage.completion_percentage}%
                  </span>
                  
                  {isCurrent && (
                    <span className="bg-primary/15 text-primary text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md animate-pulse">
                      Current
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Sidebar Panel */}
      <div className="w-full lg:w-80 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between shrink-0 min-h-[380px]">
        {selectedStage ? (
          <div className="flex flex-col gap-5 h-full">
            <div className="border-b border-border pb-3">
              <span className="text-[9px] font-black uppercase text-primary tracking-widest block mb-1">Timeline Stage Node</span>
              <h4 className="text-sm font-black text-foreground flex items-center justify-between">
                <span>{selectedStage.stage_name}</span>
                <span className="text-xs font-bold text-muted-text">({selectedStage.completion_percentage}%)</span>
              </h4>
            </div>

            <div className="flex-1 flex flex-col gap-4 text-xs">
              {/* Status card */}
              <div className="bg-background border border-border p-4 rounded-2xl flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-muted-text uppercase tracking-wide">Stage Status</span>
                <span className="font-extrabold text-foreground flex items-center gap-1.5 capitalize text-xs">
                  <span className={`w-2 h-2 rounded-full ${
                    selectedStage.status === "Completed" ? "bg-emerald-500" :
                    selectedStage.status === "In Progress" ? "bg-amber-500" :
                    selectedStage.status === "Blocked" ? "bg-rose-500" : "bg-gray-400 animate-pulse"
                  }`} />
                  {selectedStage.status}
                </span>
              </div>

              {/* Stage Notes description */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-muted-text uppercase tracking-wide">Advisor Notes</span>
                <p className="text-muted-foreground font-medium leading-relaxed leading-normal">
                  {selectedStage.notes || `This stage covers student actions relating to the ${selectedStage.stage_name} processes. Complete the task manager checkboxes to advance.`}
                </p>
              </div>

              {/* Stats overview */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-background/50 border border-border p-3 rounded-xl text-center">
                  <span className="text-sm font-black text-foreground/90">{selectedStage.tasks_count}</span>
                  <p className="text-[9px] text-muted-text uppercase font-bold mt-0.5">Total Tasks</p>
                </div>
                <div className="bg-background/50 border border-border p-3 rounded-xl text-center">
                  <span className="text-sm font-black text-emerald-600">{selectedStage.completed_tasks_count}</span>
                  <p className="text-[9px] text-muted-text uppercase font-bold mt-0.5">Completed</p>
                </div>
              </div>
            </div>

            {/* Quick Actions shift button */}
            {currentStage !== selectedStage.stage_name && (
              <Button
                onClick={() => onUpdateStage(selectedStage.stage_name)}
                className="w-full bg-primary hover:bg-primary text-white font-extrabold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm"
              >
                <span>Set active stage to {selectedStage.stage_name}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-text font-bold text-xs">
            Select a timeline node to load metrics.
          </div>
        )}
      </div>
    </div>
  );
}

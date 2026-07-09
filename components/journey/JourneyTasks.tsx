"use client";

import React, { useState } from "react";
import { 
  CheckSquare, 
  Square, 
  Lock, 
  Sparkles, 
  HelpCircle, 
  Clock, 
  AlertCircle,
  ListTodo
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface JourneyTask {
  id: string;
  stage_name: string;
  title: string;
  priority: string;
  due_date: string | null;
  completed: boolean;
  notes: string | null;
  is_premium: boolean;
}

interface JourneyTasksProps {
  tasks: JourneyTask[];
  onToggleTask: (taskId: string, completed: boolean) => void;
  currentStage: string;
  isPremiumUnlocked: boolean;
}

export default function JourneyTasks({
  tasks,
  onToggleTask,
  currentStage,
  isPremiumUnlocked
}: JourneyTasksProps) {
  const [filter, setFilter] = useState<string>("All");

  const filteredTasks = tasks.filter(t => {
    if (filter === "Active Stage") return t.stage_name === currentStage;
    if (filter === "Pending") return !t.completed;
    if (filter === "Completed") return t.completed;
    return true; // All
  }).sort((a, b) => {
    // Current stage first, then incomplete first, then priority High first
    if (a.stage_name === currentStage && b.stage_name !== currentStage) return -1;
    if (a.stage_name !== currentStage && b.stage_name === currentStage) return 1;
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    if (a.priority === "High" && b.priority !== "High") return -1;
    if (a.priority !== "High" && b.priority === "High") return 1;
    return 0;
  });

  const getPriorityColor = (priority: string) => {
    if (priority === "High") return "text-rose-600 bg-rose-50 border-rose-100";
    if (priority === "Medium") return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-primary bg-primary/10 border-primary/20";
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 w-full">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border pb-4 no-print">
        <div>
          <h3 className="text-xs font-black uppercase text-muted-text tracking-wider flex items-center gap-2">
            <ListTodo className="w-4.5 h-4.5 text-primary" />
            Automatic Task Manager
          </h3>
          <p className="text-[11px] text-muted-text mt-0.5 leading-snug">Check off completed steps to automatically update timeline percentages.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 bg-background border border-border rounded-xl w-fit select-none">
          {["All", "Active Stage", "Pending", "Completed"].map(tabName => (
            <button
              key={tabName}
              onClick={() => setFilter(tabName)}
              className={`px-3 py-1 text-[10px] font-black rounded-lg cursor-pointer transition-all ${
                (filter === "All" && tabName === "All") ||
                (filter === "Active Stage" && tabName === "Active Stage") ||
                (filter === "Pending" && tabName === "Pending") ||
                (filter === "Completed" && tabName === "Completed")
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-text hover:text-muted-foreground"
              }`}
            >
              {tabName}
            </button>
          ))}
        </div>
      </div>

      {/* Task list container */}
      <div className="flex-1 overflow-y-auto max-h-[420px] pr-2 scrollbar-thin select-text space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 text-muted-text font-bold text-xs select-none">
            No tasks listed under this filter.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isStageActive = task.stage_name === currentStage;
            
            return (
              <div
                key={task.id}
                className={`flex gap-3.5 items-start p-3.5 border rounded-2xl transition-all ${
                  task.completed 
                    ? "bg-background/50 border-border opacity-60" 
                    : isStageActive 
                    ? "bg-primary/10/10 border-blue-150 shadow-sm" 
                    : "bg-card border-border hover:bg-background/30"
                }`}
              >
                {/* Checkbox controller */}
                {task.is_premium && !isPremiumUnlocked ? (
                  <div className="p-0.5 text-muted-text shrink-0 cursor-not-allowed" title="Premium Action: Locked">
                    <Lock className="w-4 h-4 text-muted-text" />
                  </div>
                ) : (
                  <button
                    onClick={() => onToggleTask(task.id, !task.completed)}
                    className="p-0.5 text-muted-text hover:text-primary shrink-0 cursor-pointer"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-4.5 h-4.5 text-primary" />
                    ) : (
                      <Square className="w-4.5 h-4.5 text-muted-text" />
                    )}
                  </button>
                )}

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`text-xs font-bold leading-tight select-text ${task.completed ? "line-through text-muted-text" : "text-foreground/90"}`}>
                      {task.title}
                    </span>
                    {task.is_premium && (
                      <span className="bg-amber-100 text-amber-700 text-[8px] font-black uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 shrink-0" /> Premium
                      </span>
                    )}
                  </div>

                  {/* Metadata flags */}
                  <div className="flex flex-wrap gap-2.5 items-center mt-2 text-[9px] font-extrabold text-muted-text select-none">
                    <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded uppercase tracking-wide">
                      {task.stage_name}
                    </span>

                    <span className={`px-2 py-0.5 rounded border uppercase ${getPriorityColor(task.priority)}`}>
                      {task.priority} Priority
                    </span>

                    {task.due_date && (
                      <span className="flex items-center gap-1">
                        📅 Due: {task.due_date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

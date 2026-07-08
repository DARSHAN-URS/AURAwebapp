"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Trash2, 
  Edit3, 
  Pin, 
  PinOff,
  FolderLock
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Session {
  id: string;
  title: string;
  is_pinned: boolean;
  is_favorite: boolean;
  is_archived: boolean;
}

interface ChatSidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onTogglePinSession: (id: string) => void;
}

export default function ChatSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onRenameSession,
  onTogglePinSession
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRename = (session: Session) => {
    setEditingSessionId(session.id);
    setRenameValue(session.title);
  };

  const saveRename = (id: string) => {
    if (renameValue.trim()) {
      onRenameSession(id, renameValue.trim());
    }
    setEditingSessionId(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      saveRename(id);
    } else if (e.key === "Escape") {
      setEditingSessionId(null);
    }
  };

  return (
    <div className="w-full md:w-64 bg-gray-50 border-r border-gray-150 flex flex-col h-full shrink-0">
      {/* Action Header */}
      <div className="p-4 border-b border-gray-100 flex flex-col gap-3">
        <Button
          onClick={onCreateSession}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Consultation Chat</span>
        </Button>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-[11px] focus:outline-none focus:border-blue-600 font-medium"
          />
        </div>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-8 px-4">
            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-[11px] text-gray-400 font-semibold">No discussions found.</p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const isActive = activeSessionId === session.id;
            const isEditing = editingSessionId === session.id;

            return (
              <div
                key={session.id}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  isActive 
                    ? "bg-blue-50/70 border border-blue-100 text-blue-700 shadow-xs" 
                    : "text-gray-600 hover:bg-gray-100 border border-transparent"
                }`}
              >
                {isEditing ? (
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => saveRename(session.id)}
                    onKeyDown={(e) => handleKeyPress(e, session.id)}
                    className="w-full bg-white border border-blue-500 rounded px-1.5 py-0.5 text-xs text-gray-800 focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <div 
                    onClick={() => onSelectSession(session.id)}
                    className="flex items-center gap-2.5 min-w-0 flex-1"
                  >
                    <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                    <span className="text-xs font-bold truncate leading-none">{session.title}</span>
                    {session.is_pinned && (
                      <Pin className="w-3 h-3 text-blue-500 shrink-0 transform rotate-45" />
                    )}
                  </div>
                )}

                {/* Hover actions */}
                {!isEditing && (
                  <div className="hidden group-hover:flex items-center gap-1.5 ml-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePinSession(session.id);
                      }}
                      className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-white"
                      title={session.is_pinned ? "Unpin Chat" : "Pin Chat"}
                    >
                      {session.is_pinned ? (
                        <PinOff className="w-3.5 h-3.5" />
                      ) : (
                        <Pin className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startRename(session);
                      }}
                      className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-white"
                      title="Rename Chat"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="p-1 rounded text-gray-400 hover:text-rose-600 hover:bg-white"
                      title="Delete Chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

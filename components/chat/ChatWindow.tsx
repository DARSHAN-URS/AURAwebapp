"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Paperclip, 
  Mic, 
  Sparkles, 
  RotateCcw, 
  StopCircle, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown,
  CloudUpload,
  FileText,
  Loader2,
  Trash2,
  Lock,
  ChevronRight,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Markdown from "./Markdown";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at?: string;
  feedbacks?: Array<{ rating: number; comment?: string }>;
}

interface ChatFile {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
}

interface ChatWindowProps {
  messages: Message[];
  files: ChatFile[];
  streamingMessage: string;
  isGenerating: boolean;
  onSendMessage: (text: string) => void;
  onUploadFile: (file: File) => void;
  onRegenerate: () => void;
  onStopGeneration: () => void;
  onFeedback: (messageId: string, rating: number, comment?: string) => void;
  activeSessionId: string | null;
  profileCompleteness: number;
  onTabNavigate: (tabId: string) => void;
}

const SUGGESTED_QUESTIONS = [
  "Which universities suit my profile?",
  "Estimate my education and living expenses.",
  "Suggest scholarships I qualify for.",
  "Improve my SOP draft.",
  "Compare UK vs Canada study pathways.",
  "Check my visa readiness checklist."
];

export default function ChatWindow({
  messages,
  files,
  streamingMessage,
  isGenerating,
  onSendMessage,
  onUploadFile,
  onRegenerate,
  onStopGeneration,
  onFeedback,
  activeSessionId,
  profileCompleteness,
  onTabNavigate
}: ChatWindowProps) {
  const [inputText, setInputText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [ratedMessages, setRatedMessages] = useState<Record<string, number>>({});
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto Scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  const handleSend = () => {
    if (inputText.trim() && !isGenerating) {
      onSendMessage(inputText.trim());
      setInputText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRate = (messageId: string, rating: number) => {
    setRatedMessages(prev => ({
      ...prev,
      [messageId]: rating
    }));
    onFeedback(messageId, rating);
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFileHelper(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFileHelper(e.target.files[0]);
    }
  };

  const uploadFileHelper = async (file: File) => {
    if (!activeSessionId) {
      alert("Please send a message to start the conversation before attaching reference documents.");
      return;
    }
    setIsUploading(true);
    try {
      await onUploadFile(file);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      className={`flex-1 flex flex-col bg-white h-full relative ${dragOver ? "bg-blue-50/10" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleFileDrop}
    >
      {/* Drag & drop overlay indicator */}
      <AnimatePresence>
        {dragOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-600/10 backdrop-blur-xs flex flex-col items-center justify-center border-2 border-dashed border-blue-500 z-50 p-6 rounded-3xl"
          >
            <CloudUpload className="w-12 h-12 text-blue-600 animate-bounce mb-2" />
            <h4 className="text-sm font-black text-gray-900">Upload Reference document</h4>
            <p className="text-[10px] text-gray-500 mt-1 font-semibold">Drop PDF, transcripts, bank logs, or resumes to inject into Aura AI</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Context banner bar at top */}
      <div className="bg-gray-50/70 border-b border-gray-100 px-6 py-2.5 flex items-center justify-between no-print select-none">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Aura Context Engine</span>
          <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase">Active</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500">
          <span className="flex items-center gap-1">📝 Profile ({profileCompleteness}%)</span>
          {files.length > 0 && (
            <span className="bg-blue-50 text-blue-600 border border-blue-100 rounded px-1.5 py-0.5 text-[9px] font-black">
              📎 {files.length} Reference Docs
            </span>
          )}
        </div>
      </div>

      {/* Main chat history list area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scroll-smooth select-text"
      >
        {messages.length === 0 && !streamingMessage ? (
          /* EMPTY STATE */
          <div className="max-w-2xl mx-auto flex flex-col justify-center h-full py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-gray-950">Ask Aura AI</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed mt-1.5 font-medium">
              I know your profile preferences, academic GPAs, visa logs, and generated files. Ask any study abroad query below!
            </p>

            {/* Quick Actions Modules */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              <Button
                variant="outline"
                onClick={() => onTabNavigate("sop")}
                className="border-gray-150 text-[10px] font-extrabold py-2 px-3 rounded-xl cursor-pointer hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/10 flex flex-col gap-1 items-center justify-center text-center h-16 transition-all"
              >
                <span>Write SOP</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => onTabNavigate("visa")}
                className="border-gray-150 text-[10px] font-extrabold py-2 px-3 rounded-xl cursor-pointer hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/10 flex flex-col gap-1 items-center justify-center text-center h-16 transition-all"
              >
                <span>Audit Visa Docs</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => onTabNavigate("overview")}
                className="border-gray-150 text-[10px] font-extrabold py-2 px-3 rounded-xl cursor-pointer hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/10 flex flex-col gap-1 items-center justify-center text-center h-16 transition-all"
              >
                <span>Shortlist Univs</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => onTabNavigate("profile")}
                className="border-gray-150 text-[10px] font-extrabold py-2 px-3 rounded-xl cursor-pointer hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/10 flex flex-col gap-1 items-center justify-center text-center h-16 transition-all"
              >
                <span>Update Profile</span>
              </Button>
            </div>

            {/* Suggested Questions list */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h5 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-3">Suggested queries</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputText(q)}
                    className="p-2.5 text-xs text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50/30 border border-gray-100 hover:border-blue-100 rounded-xl cursor-pointer transition-all flex items-center justify-between font-bold leading-normal"
                  >
                    <span>{q}</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* MESSAGES LIST */
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((message) => {
              const isUser = message.role === "user";
              const currentRating = ratedMessages[message.id] || (message.feedbacks?.[0]?.rating ?? 0);

              return (
                <div key={message.id} className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
                  {/* Left avatar icon */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 select-none">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  {/* Bubble content */}
                  <div className="flex flex-col gap-1.5 max-w-[80%]">
                    <div 
                      className={`px-4 py-3.5 rounded-2xl ${
                        isUser 
                          ? "bg-blue-600 text-white rounded-br-none shadow-sm text-xs font-semibold select-text" 
                          : "bg-gray-50/90 border border-gray-150 text-gray-900 rounded-bl-none text-xs leading-relaxed"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap leading-relaxed select-text">{message.content}</p>
                      ) : (
                        <Markdown content={message.content} />
                      )}
                    </div>

                    {/* Metadata controls footer */}
                    {!isUser && (
                      <div className="flex items-center justify-between px-2 text-[10px] text-gray-400 no-print">
                        {/* Source citations details */}
                        <span className="font-semibold text-gray-400 flex items-center gap-1 select-none">
                          ⚡ Context Injected
                        </span>
                        
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => handleCopy(message.id, message.content)}
                            className="hover:text-gray-900 transition-colors cursor-pointer flex items-center gap-0.5 font-bold"
                          >
                            {copiedId === message.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          {/* Thumbs up */}
                          <button
                            onClick={() => handleRate(message.id, 1)}
                            className={`p-0.5 rounded hover:bg-gray-100 cursor-pointer ${currentRating === 1 ? "text-blue-600 bg-blue-50/50" : ""}`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>

                          {/* Thumbs down */}
                          <button
                            onClick={() => handleRate(message.id, -1)}
                            className={`p-0.5 rounded hover:bg-gray-100 cursor-pointer ${currentRating === -1 ? "text-rose-600 bg-rose-50/50" : ""}`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center shrink-0 font-black text-xs uppercase select-none">
                      U
                    </div>
                  )}
                </div>
              );
            })}

            {/* Streaming block output */}
            {streamingMessage && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-1.5 max-w-[80%]">
                  <div className="px-4 py-3.5 bg-gray-50 border border-gray-150 text-gray-900 rounded-2xl rounded-bl-none text-xs leading-relaxed select-text">
                    <Markdown content={streamingMessage} />
                  </div>
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {isGenerating && !streamingMessage && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 bg-gray-50 border border-gray-150 rounded-2xl rounded-bl-none flex items-center gap-1.5 h-9 w-16 justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce delay-300" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reference files attachments bar */}
      {files.length > 0 && messages.length > 0 && (
        <div className="px-6 py-2 bg-gray-50/50 border-t border-gray-100 flex flex-wrap gap-2 items-center select-none no-print">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider mr-2">Files Attached:</span>
          {files.map(file => (
            <div key={file.id} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-[10px] font-bold text-gray-600">
              <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate max-w-[120px]">{file.filename}</span>
              <span className="text-[9px] text-gray-400">({roundBytes(file.file_size)})</span>
            </div>
          ))}
        </div>
      )}

      {/* Input console area */}
      <div className="p-4 sm:p-6 border-t border-gray-100 no-print bg-white select-none rounded-b-3xl">
        <div className="max-w-3xl mx-auto flex flex-col gap-2">
          
          <div className="relative border border-gray-200 focus-within:border-blue-600 rounded-2xl p-2 bg-gray-50 flex flex-col">
            <textarea
              rows={2}
              placeholder="Ask anything about shortlists, loans, SOP improvements, or UK vs Canada pathway requirements..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-0 outline-none text-xs font-semibold px-2 py-1 placeholder-gray-400 focus:ring-0 resize-none"
            />
            
            {/* Control items row */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-150 px-1">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.docx,.doc,image/*"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-gray-200/50 cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                  title="Upload transcripts, resume, bank statements..."
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                  <span>Reference Doc</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert("Voice transcription interface initialized. Standard browser capture integration ready.")}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-gray-200/50 cursor-pointer"
                  title="Voice dictation (Future Ready)"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {isGenerating && (
                  <Button
                    onClick={onStopGeneration}
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-[10px] px-3.5 h-8 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs border border-gray-200"
                  >
                    <StopCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Stop</span>
                  </Button>
                )}

                {messages.length > 0 && !isGenerating && (
                  <Button
                    onClick={onRegenerate}
                    type="button"
                    className="bg-gray-50 hover:bg-gray-100 text-gray-600 font-extrabold text-[10px] px-3.5 h-8 rounded-xl flex items-center gap-1.5 cursor-pointer border border-gray-200 shadow-xs"
                    title="Regenerate Last response"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Regen</span>
                  </Button>
                )}

                <Button
                  onClick={handleSend}
                  disabled={!inputText.trim() || isGenerating}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs h-8 w-8 sm:w-auto sm:px-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ask AI</span>
                </Button>
              </div>
            </div>
          </div>
          
          <span className="text-[9px] text-gray-400 font-semibold text-center mt-1 select-none">
            Aura AI scans context parameters securely. Verify visa checklist details with your counsel planner.
          </span>
        </div>
      </div>
    </div>
  );
}

function roundBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

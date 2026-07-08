"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Sparkles, 
  Download, 
  Copy, 
  RotateCcw, 
  Check, 
  Loader2, 
  FileText, 
  AlertCircle,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Heading2,
  List,
  Printer,
  ChevronRight,
  TrendingUp,
  FileSignature
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SOPVersion {
  id: string;
  version_number: number;
  content: string;
  changes: string;
  created_at: string;
}

interface SOPDocumentDetails {
  id: string;
  title: string;
  target_country: string;
  target_university: string;
  target_course: string;
  content: string;
  version: number;
  updated_at: string;
  versions: SOPVersion[];
}

export default function SOPEditorWorkspace() {
  const params = useParams();
  const router = useRouter();
  const docId = params.id as string;

  const [document, setDocument] = useState<SOPDocumentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Editor State
  const [title, setTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [savingStatus, setSavingStatus] = useState<"Saved" | "Saving..." | "Error">("Saved");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Selected Text & AI State
  const [selectedText, setSelectedText] = useState("");
  const [aiWorking, setAiWorking] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Formatting Reference
  const editorRef = useRef<HTMLDivElement>(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // 1. Fetch Document Details on Mount
  useEffect(() => {
    if (!docId) return;

    const fetchDocument = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiBaseUrl}/api/sop/${docId}`);
        if (!res.ok) throw new Error("Could not load SOP document details.");
        const data: SOPDocumentDetails = await res.json();
        
        setDocument(data);
        setTitle(data.title);
        setEditorContent(data.content);
        updateCounts(data.content);
      } catch (err: any) {
        console.error("Failed to load SOP document:", err);
        setError("Failed to load Statement of Purpose document. Server is offline.");
        setDocument(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [docId]);

  // 2. Count Words and Characters
  const updateCounts = (text: string) => {
    // Strip HTML tags for accurate word count
    const stripped = text.replace(/<[^>]*>/g, " ");
    const words = stripped.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
    setCharCount(stripped.replace(/\s/g, "").length);
  };

  // 3. Debounce Autosave (Simulated & Backend)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerAutosave = (newContent: string, newTitle: string) => {
    setSavingStatus("Saving...");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/sop/save/${docId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle, content: newContent })
        });
        if (!res.ok) throw new Error();
        setSavingStatus("Saved");
      } catch (err) {
        console.error("Autosave failed:", err);
        setSavingStatus("Error");
      }
    }, 2000);
  };

  // Handle manual edits in contenteditable div
  const handleContentInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setEditorContent(html);
      updateCounts(html);
      triggerAutosave(html, title);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    triggerAutosave(editorContent, val);
  };

  // 4. Capture Text Highlighting for AI operations
  const handleSelection = () => {
    if (typeof window !== "undefined") {
      const selection = window.getSelection();
      if (selection) {
        const text = selection.toString().trim();
        if (text) setSelectedText(text);
      }
    }
  };

  // Format Command Executer (zero-dependency rich-text helper)
  const execCommand = (command: string, value: string = "") => {
    window.document.execCommand(command, false, value);
    handleContentInput();
  };

  // 5. Trigger AI Rewrite Instructions (Improve grammar, professionalize, expand)
  const triggerAiRewrite = async (instruction: string) => {
    setAiWorking(true);
    setAiError(null);
    try {
      const payload = {
        content: editorContent,
        instruction: instruction,
        selected_text: selectedText || null
      };

      const res = await fetch(`${apiBaseUrl}/api/sop/rewrite/${docId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("AI rewrite failed. Please check internet connection.");
      const data = await res.json();

      // Update Editor HTML
      setEditorContent(data.content);
      if (editorRef.current) {
        editorRef.current.innerHTML = data.content;
      }
      updateCounts(data.content);
      setSelectedText("");
      setSavingStatus("Saved");
    } catch (err: any) {
      console.error("AI rewrite failed:", err);
      setAiError(err.message || "Failed to edit document with AI.");
      alert("Failed to edit document with AI. Server is offline.");
    } finally {
      setAiWorking(false);
    }
  };

  // 6. Rollback to older version click
  const handleVersionRollback = (ver: SOPVersion) => {
    if (!confirm(`Rollback document to Version ${ver.version_number}?`)) return;
    setEditorContent(ver.content);
    if (editorRef.current) {
      editorRef.current.innerHTML = ver.content;
    }
    updateCounts(ver.content);
    triggerAutosave(ver.content, title);
  };

  // 7. Clipboard Copy
  const handleCopy = () => {
    const stripped = editorContent.replace(/<[^>]*>/g, "\n");
    navigator.clipboard.writeText(stripped);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 8. Dynamic MS Word DOCX local blob exporter
  const exportToDoc = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><title>Statement of Purpose</title><style>body { font-family: Arial, sans-serif; line-height: 1.5; padding: 40px; }</style></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + editorContent + footer;
    
    const blob = new Blob(['\ufeff' + sourceHTML], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.doc`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 9. PDF Print
  const exportToPdf = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-gray-500">Opening editor workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-24">
      {/* Hide page headers/footers during print layout export */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #print-workspace, #print-workspace * { visibility: visible; }
          #print-workspace { position: absolute; left: 0; top: 0; width: 100%; padding: 0; border: none; box-shadow: none; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl no-print">
        
        {/* Editor Top Bar Nav */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-100 pb-4">
          <button
            onClick={() => router.push("/sop")}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              savingStatus === "Saving..." ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50"
            }`}>
              {savingStatus}
            </span>
            <Button
              variant="outline"
              onClick={handleCopy}
              className="h-9 px-3 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer text-xs flex items-center gap-1"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>Copy</span>
            </Button>
            <Button
              variant="outline"
              onClick={exportToDoc}
              className="h-9 px-3 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer text-xs flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              <span>Word DOC</span>
            </Button>
            <Button
              onClick={exportToPdf}
              className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer text-xs flex items-center gap-1 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </Button>
          </div>
        </div>

        {/* Triple Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Version History */}
          <div className="lg:col-span-3 bg-gray-50 border border-gray-100 rounded-3xl p-5 min-h-[300px]">
            <h3 className="font-extrabold text-gray-950 text-xs uppercase tracking-wider mb-6 flex items-center gap-1.5 border-b border-gray-200/50 pb-2">
              <RotateCcw className="w-4 h-4 text-blue-600" />
              <span>Version History Logs</span>
            </h3>
            
            <div className="flex flex-col gap-4">
              {document?.versions && document.versions.map((ver, idx) => (
                <div 
                  key={ver.id}
                  onClick={() => handleVersionRollback(ver)}
                  className="bg-white border border-gray-100 hover:border-blue-100 p-4 rounded-xl shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col gap-1.5"
                >
                  <div className="flex justify-between items-center text-[10px] font-bold text-blue-600">
                    <span>Draft #{ver.version_number}</span>
                    <span className="text-gray-400 font-semibold">{new Date(ver.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 font-medium leading-tight">
                    {ver.changes}
                  </p>
                </div>
              ))}
              {(!document?.versions || document.versions.length === 0) && (
                <p className="text-xs text-gray-400 text-center py-6">No previous versions registered.</p>
              )}
            </div>
          </div>

          {/* CENTER PANEL: Notion Rich Editor */}
          <div className="lg:col-span-6 bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-lg min-h-[600px] flex flex-col justify-between" id="print-workspace">
            <div>
              {/* Header Title Editor */}
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="w-full text-2xl font-black text-gray-950 focus:outline-none border-b border-transparent focus:border-gray-100 pb-3 mb-6 no-print"
                placeholder="Document Title"
              />
              
              {/* Print layout title */}
              <h1 className="text-2xl font-bold hidden print:block mb-8">{title}</h1>

              {/* Rich text formatting bar */}
              <div className="flex items-center gap-1.5 border-b border-gray-50 pb-3 mb-6 no-print">
                <Button variant="ghost" onClick={() => execCommand("bold")} className="h-8 w-8 p-0 rounded-lg text-gray-500 hover:text-gray-900 cursor-pointer" title="Bold"><Bold className="w-4 h-4" /></Button>
                <Button variant="ghost" onClick={() => execCommand("italic")} className="h-8 w-8 p-0 rounded-lg text-gray-500 hover:text-gray-900 cursor-pointer" title="Italic"><Italic className="w-4 h-4" /></Button>
                <Button variant="ghost" onClick={() => execCommand("underline")} className="h-8 w-8 p-0 rounded-lg text-gray-500 hover:text-gray-900 cursor-pointer" title="Underline"><Underline className="w-4 h-4" /></Button>
                <Button variant="ghost" onClick={() => execCommand("formatBlock", "h2")} className="h-8 w-8 p-0 rounded-lg text-gray-500 hover:text-gray-900 cursor-pointer" title="Header"><Heading2 className="w-4 h-4" /></Button>
                <Button variant="ghost" onClick={() => execCommand("insertUnorderedList")} className="h-8 w-8 p-0 rounded-lg text-gray-500 hover:text-gray-900 cursor-pointer" title="List"><List className="w-4 h-4" /></Button>
                <div className="w-px h-5 bg-gray-200 mx-2" />
                <Button variant="ghost" onClick={() => execCommand("undo")} className="h-8 w-8 p-0 rounded-lg text-gray-500 hover:text-gray-900 cursor-pointer" title="Undo"><Undo2 className="w-4 h-4" /></Button>
                <Button variant="ghost" onClick={() => execCommand("redo")} className="h-8 w-8 p-0 rounded-lg text-gray-500 hover:text-gray-900 cursor-pointer" title="Redo"><Redo2 className="w-4 h-4" /></Button>
              </div>

              {/* HTML Contenteditable div */}
              <div 
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleContentInput}
                onMouseUp={handleSelection}
                onKeyUp={handleSelection}
                className="focus:outline-none min-h-[420px] text-sm sm:text-base text-gray-800 leading-relaxed font-medium prose max-w-none"
                dangerouslySetInnerHTML={{ __html: editorContent }}
              />
            </div>

            {/* Counts Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-8 text-xs text-gray-400 font-semibold no-print">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>{wordCount} words / {charCount} chars</span>
              </span>
              <span>Target: 900-1200 words</span>
            </div>
          </div>

          {/* RIGHT PANEL: AI Assistant & Quality Scores */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* 1. Quality Scores Gauge Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
              <h3 className="font-extrabold text-gray-950 text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <TrendingUp className="w-4.5 h-4.5 text-blue-600" />
                <span>Writing Audit Score</span>
              </h3>
              
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase mb-1">
                    <span>Writing Quality</span>
                    <span className="text-gray-900">92%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[92%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase mb-1">
                    <span>Readability</span>
                    <span className="text-gray-900">Grade 11</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[82%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase mb-1">
                    <span>Professionalism</span>
                    <span className="text-gray-900">95%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[95%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Highlight Rewrite Assistant Panel */}
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5 min-h-[220px] flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-gray-950 text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-gray-200/50 pb-2">
                  <Sparkles className="w-4.5 h-4.5 text-blue-600" />
                  <span>SOP AI Assistant</span>
                </h3>

                {selectedText ? (
                  <div className="flex flex-col gap-3.5">
                    <div className="p-3 bg-white border border-gray-150 rounded-xl max-h-24 overflow-y-auto">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Selected text segment:</p>
                      <p className="text-[11px] text-gray-700 italic leading-snug">"{selectedText}"</p>
                    </div>

                    {aiError && (
                      <div className="p-2 bg-red-50 text-red-700 text-[10px] font-bold rounded-lg flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        <span>{aiError}</span>
                      </div>
                    )}

                    {/* AI Commands List */}
                    <div className="grid grid-cols-1 gap-2">
                      <button 
                        onClick={() => triggerAiRewrite("improve_grammar")}
                        disabled={aiWorking}
                        className="text-left text-[11px] font-bold text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-gray-100 transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span>Fix Grammar & Flow</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => triggerAiRewrite("more_professional")}
                        disabled={aiWorking}
                        className="text-left text-[11px] font-bold text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-gray-100 transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span>Make More Professional</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => triggerAiRewrite("more_human")}
                        disabled={aiWorking}
                        className="text-left text-[11px] font-bold text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-gray-100 transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span>Rewrite Naturally (Human)</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => triggerAiRewrite("reduce_ai")}
                        disabled={aiWorking}
                        className="text-left text-[11px] font-bold text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-gray-100 transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span>Minimize AI Signature</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <Button 
                          onClick={() => triggerAiRewrite("shorten")}
                          disabled={aiWorking}
                          className="h-8 rounded-lg bg-white border border-gray-200 text-gray-700 text-[10px] font-bold hover:bg-gray-50 cursor-pointer"
                        >
                          Shorten
                        </Button>
                        <Button 
                          onClick={() => triggerAiRewrite("expand")}
                          disabled={aiWorking}
                          className="h-8 rounded-lg bg-white border border-gray-200 text-gray-700 text-[10px] font-bold hover:bg-gray-50 cursor-pointer"
                        >
                          Expand
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileSignature className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-xs text-gray-400 max-w-xs leading-relaxed mx-auto">
                      Highlight any sentence or paragraph in the editor to activate localized AI editing tools.
                    </p>
                  </div>
                )}
              </div>

              {aiWorking && (
                <div className="mt-4 p-3 bg-white border border-gray-150 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing AI rewrite...</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

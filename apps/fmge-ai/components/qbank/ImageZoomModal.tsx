"use client";

import React, { useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react";

interface ImageZoomModalProps {
  imageUrl: string;
  title: string;
  onClose: () => void;
}

export function ImageZoomModal({ imageUrl, title, onClose }: ImageZoomModalProps) {
  const [scale, setScale] = useState(1);
  const [contrast, setContrast] = useState(100);

  const zoomIn = () => setScale((s) => Math.min(s + 0.3, 3));
  const zoomOut = () => setScale((s) => Math.max(s - 0.3, 0.8));
  const resetZoom = () => {
    setScale(1);
    setContrast(100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 space-y-4 shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-white truncate">{title}</h3>
          
          <div className="flex items-center gap-2">
            <button
              onClick={zoomIn}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={zoomOut}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetZoom}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-rose-950 text-rose-300 hover:bg-rose-900"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image Display Area */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-950 rounded-2xl p-4 min-h-[350px]">
          <img
            src={imageUrl}
            alt={title}
            style={{
              transform: `scale(${scale})`,
              filter: `contrast(${contrast}%)`,
              transition: "transform 0.2s ease, filter 0.2s ease"
            }}
            className="max-h-[60vh] object-contain rounded"
          />
        </div>

        {/* Contrast Control Slider */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>Medical Image Contrast: {contrast}%</span>
          <input
            type="range"
            min="50"
            max="180"
            value={contrast}
            onChange={(e) => setContrast(Number(e.target.value))}
            className="w-48 accent-teal-500 cursor-pointer"
          />
        </div>

      </div>
    </div>
  );
}

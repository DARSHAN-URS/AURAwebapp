"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface BookingContextType {
  openBooking: () => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/aura-routes/consultation";

  const openBooking = () => setIsOpen(true);
  const closeBooking = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
    }
  }, [isOpen]);

  return (
    <BookingContext.Provider value={{ openBooking, closeBooking }}>
      {children}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-[85vh] p-0 overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-2xl">
          <div className="sr-only">
            <DialogTitle>Book a Free Consultation</DialogTitle>
            <DialogDescription>
              Schedule a 1-on-1 session with a senior study abroad advisor.
            </DialogDescription>
          </div>
          <div className="relative w-full h-full flex flex-col">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                  <p className="text-sm font-medium text-gray-500">Loading scheduler...</p>
                </div>
              </div>
            )}
            <iframe
              src={`${calendlyUrl}?hide_landing_page_details=1&hide_gdpr_banner=1`}
              width="100%"
              height="100%"
              frameBorder="0"
              onLoad={() => setLoading(false)}
              className="w-full h-full border-none min-h-[500px]"
              title="Calendly Scheduler"
            />
          </div>
        </DialogContent>
      </Dialog>
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}

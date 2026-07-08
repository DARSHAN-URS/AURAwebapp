"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919891263337";
  // Remove spaces, dashes, or plus signs from number for WhatsApp wa.me API
  const formattedNumber = rawNumber.replace(/[+\s-]/g, "");
  const message = encodeURIComponent(
    "Hi Aura Routes, I am looking to study abroad and would love to check my eligibility."
  );
  
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:bg-[#20ba5a] hover:scale-105 active:scale-95 transition-all duration-300 group"
      aria-label="Contact us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping group-hover:animate-none" />
      <MessageCircle className="w-6 h-6 fill-white text-[#25D366] relative z-10" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap font-medium text-sm transition-all duration-300 group-hover:max-w-xs group-hover:ml-2 relative z-10 hidden sm:inline-block">
        Chat with Us
      </span>
    </motion.a>
  );
}

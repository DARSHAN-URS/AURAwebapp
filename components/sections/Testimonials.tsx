"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const TESTIMONIALS = [
  {
    name: "Sneha Patel",
    university: "University of Toronto, Canada",
    course: "M.S. in Computer Science",
    quote: "Aura Routes AI's University Matcher saved me weeks of manual research. The AI identified my profile was strong enough for U of T and predicted a 90% match score. I got in with a partial scholarship!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    country: "🇮🇳 India → 🇨🇦 Canada",
  },
  {
    name: "Aman Sharma",
    university: "Trinity College Dublin, Ireland",
    course: "MSc in Finance",
    quote: "The SOP Generator and Document Checker are unmatched. It flagged missing parameters in my recommendation letters that would have delayed my application. Highly recommend this platform.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    country: "🇮🇳 India → 🇮🇪 Ireland",
  },
  {
    name: "Sarah Jenkins",
    university: "King's College London, UK",
    course: "BSc in Business Administration",
    quote: "The integrated loan and accommodation booking made moving to London stress-free. My verified student bed was booked and loan approved within 10 days of my university offer letter!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
    country: "🇮🇳 India → 🇬🇧 UK",
  },
  {
    name: "Vikram Malhotra",
    university: "LMU Munich, Germany",
    course: "M.Sc. in Data Science",
    quote: "Securing tuition-free education in Germany seemed complex, but Aura Routes AI laid out every step clearly. The AI timeline tracker kept my documents synchronized — visa approved in record time!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120",
    country: "🇮🇳 India → 🇩🇪 Germany",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-white border-t border-gray-100" id="testimonials">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-[1.1] mb-4">
            Real Students,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Real Results
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-medium">
            Join thousands of Indian students and NRI families who have secured admissions at top global universities with Aura Routes AI.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-white border border-gray-100 rounded-3xl p-7 sm:p-8 shadow-xs hover:shadow-lg hover:border-blue-100/60 transition-all duration-300"
            >
              {/* Top: Quote icon + stars */}
              <div className="flex items-start justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/50 flex items-center justify-center">
                  <Quote className="w-4.5 h-4.5" />
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Quote text */}
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium mb-7 italic">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-5 border-t border-gray-50">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100 shrink-0">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <h4 className="font-black text-gray-950 text-sm">{t.name}</h4>
                  <p className="text-[11px] text-blue-600 font-bold tracking-tight">{t.course}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">{t.university}</p>
                  <span className="text-[9px] text-gray-400 font-medium">{t.country}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom aggregate trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <p className="text-2xl font-black text-gray-950 mb-1">4.9 ★ Average Rating</p>
            <p className="text-sm text-gray-500 font-medium">Based on 2,000+ verified student reviews</p>
          </div>
          <div className="flex -space-x-3">
            {[
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=60",
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60",
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=60",
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=60",
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=60",
            ].map((src, i) => (
              <div key={i} className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <Image src={src} alt="Student" fill className="object-cover" sizes="40px" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center shadow-sm">
              <span className="text-[9px] font-black text-white">25K+</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

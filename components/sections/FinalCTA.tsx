"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Phone, Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/common/BookingContext";
import Image from "next/image";
import Link from "next/link";

export default function FinalCTA() {
  const { openBooking } = useBooking();

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1600"
              alt="Students celebrating graduation abroad"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/80 to-indigo-900/70" />
          </div>

          {/* Decorative pattern on top of image */}
          <svg className="absolute inset-0 w-full h-full stroke-white/5 z-[1]" aria-hidden="true">
            <defs>
              <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M.5 40V.5H40" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>

          {/* Content */}
          <div className="relative z-10 py-16 px-6 sm:px-12 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left: CTA content */}
              <div>

                <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-5">
                  Start Your Global Journey Today
                </h2>

                <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed mb-8 max-w-md font-medium">
                  Join 25,000+ Indian students and NRI families who chose Aura Routes AI to navigate their path to the world's best universities — transparently and intelligently.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Button
                    onClick={openBooking}
                    size="lg"
                    className="bg-card hover:bg-background text-primary font-black px-8 rounded-full shadow-xl hover:scale-[1.02] transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer h-12"
                  >
                    <Calendar className="w-4 h-4" />
                    Book Free Consultation
                  </Button>
                  <Link href="/ai-tools">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-white/30 text-white hover:bg-card/10 font-bold px-8 rounded-full transition-all duration-200 text-sm flex items-center justify-center gap-2 h-12 cursor-pointer"
                    >
                      Try AI Tools Free
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Contact quick links */}
                <div className="flex flex-wrap gap-5">
                  <a href="tel:+919891263337" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-xs font-semibold">
                    <Phone className="w-3.5 h-3.5" />
                    Call Our Advisors
                  </a>
                  <a href="https://wa.me/919891263337" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-xs font-semibold">
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp Us Now
                  </a>
                </div>
              </div>

              {/* Right: Social proof stack */}
              <div className="hidden lg:flex flex-col gap-4">
                {[
                  {
                    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=80",
                    name: "Priya Nair",
                    detail: "Admitted to University of Melbourne · Nursing",
                    time: "2 days ago",
                  },
                  {
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80",
                    name: "Rahul Kumar",
                    detail: "Visa approved — LMU Munich · Engineering",
                    time: "5 days ago",
                  },
                  {
                    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80",
                    name: "Ananya Singh",
                    detail: "Scholarship secured at York University · Business",
                    time: "1 week ago",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-4 bg-card/10 backdrop-blur-md border border-white/20 rounded-2xl p-4"
                  >
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
                      <Image src={item.avatar} alt={item.name} fill className="object-cover" sizes="44px" />
                    </div>
                    <div>
                      <p className="text-white font-black text-xs">{item.name}</p>
                      <p className="text-blue-200 text-[10px] font-medium leading-tight mt-0.5">{item.detail}</p>
                      <p className="text-blue-300/60 text-[9px] mt-0.5">{item.time}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 block animate-pulse" />
                    </div>
                  </motion.div>
                ))}

                <div className="bg-card/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
                  <p className="text-white font-black text-lg">25,000+</p>
                  <p className="text-blue-200 text-xs font-medium">Students successfully guided this year</p>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

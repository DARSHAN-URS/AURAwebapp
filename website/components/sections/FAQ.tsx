"use client";

import React from "react";
import SectionTitle from "@/components/ui/SectionTitle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/constants";

export default function FAQ() {
  return (
    <section className="py-20 sm:py-28 bg-white border-b border-gray-100" id="faqs">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionTitle
          title="Frequently Asked Questions"
          subtitle="Clear answers to the most common queries about our AI tools, admission pathways, services, and consultation bookings."
        />

        {/* Accordion Layout */}
        <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-[0_4px_25px_-5px_rgba(0,0,0,0.01)] overflow-hidden">
          <Accordion className="divide-y divide-gray-100">
            {FAQS.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`}
                className="border-none px-6 py-2 hover:bg-gray-50/50 transition-colors"
              >
                <AccordionTrigger className="text-left font-bold text-gray-900 text-base py-4 hover:no-underline hover:text-blue-600 transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 text-sm leading-relaxed pb-4 pt-1">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </section>
  );
}

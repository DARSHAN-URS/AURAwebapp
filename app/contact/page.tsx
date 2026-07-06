"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, HelpCircle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/common/BookingContext";

export default function ContactPage() {
  const { openBooking } = useBooking();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Study Abroad Match",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", subject: "Study Abroad Match", message: "" });
    }, 1000);
  };

  return (
    <div className="bg-white pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
            We are Here to Help
          </h1>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
            Have questions about admissions, visas, or AI matched programs? Send us a message or schedule a direct consultation slot.
          </p>
        </div>

        {/* Form and info details */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Info Details */}
          <div className="lg:col-span-5 bg-gray-50/60 border border-gray-100 rounded-3xl p-8 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="font-extrabold text-gray-950 text-lg mb-6">Contact Channels</h3>
              
              <ul className="flex flex-col gap-6 text-sm text-gray-600 mb-8">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Corporate HQ</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      102, Innovation Arcade, Sector 5, HSR Layout, Bengaluru, Karnataka, India - 560102
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Email Inquiries</h4>
                    <a href="mailto:info@auraroutes.com" className="text-xs text-gray-500 hover:text-blue-600 hover:underline">
                      info@auraroutes.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Phone Helpline</h4>
                    <a href="tel:+919876543210" className="text-xs text-gray-500 hover:text-blue-600 hover:underline">
                      +91 98765 43210
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Working Hours</h4>
                    <p className="text-xs text-gray-500">Mon - Sat: 9:00 AM to 6:00 PM (IST)</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Calendly booking info */}
            <div className="pt-6 border-t border-gray-200/50">
              <h4 className="font-bold text-sm text-gray-900 mb-2">Need immediate advisory?</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Book a 1-on-1 virtual slot with our senior study abroad planners to outline university pathways.
              </p>
              <Button
                onClick={openBooking}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-full shadow-sm text-xs cursor-pointer"
              >
                Schedule Virtual Meeting
              </Button>
            </div>
          </div>

          {/* Form console */}
          <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col justify-center">
            {formSubmitted ? (
              <div className="flex flex-col items-center justify-center text-center py-10">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 fill-emerald-50" />
                <h3 className="text-xl font-bold text-gray-950 mb-2">Message Transmitted!</h3>
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                  Thank you for connecting. An Aura study abroad coordinator will reach out to you within the next 4 hours.
                </p>
                <Button 
                  onClick={() => setFormSubmitted(false)}
                  className="mt-6 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs px-4 py-2 border border-gray-200 rounded-lg cursor-pointer"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Your Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                      placeholder="e.g. Aman Gupta"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                      placeholder="e.g. aman@gmail.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                      placeholder="e.g. +91 98765 43210"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Topic of Interest</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium"
                    >
                      <option>Study Abroad Match</option>
                      <option>MBBS Abroad Pathway</option>
                      <option>Education Loans Assistance</option>
                      <option>Student Accommodation</option>
                      <option>General Support Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">How can we help you?</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 font-medium resize-none"
                    placeholder="Provide details about your grades, target countries, or specific queries..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 mt-2 w-full sm:w-fit"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Query</span>
                </Button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

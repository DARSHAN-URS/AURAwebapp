"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/components/common/BookingContext";

export default function BookingButton() {
  const { openBooking } = useBooking();

  return (
    <Button 
      onClick={openBooking}
      className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-black rounded-full py-3 shadow-md cursor-pointer relative z-10"
    >
      Book Consultation Call
    </Button>
  );
}

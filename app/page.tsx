import React from "react";
import Hero from "@/components/sections/Hero";
import TrustedNumbers from "@/components/sections/TrustedNumbers";
import Services from "@/components/sections/Services";
import AIFeatures from "@/components/sections/AIFeatures";
import Countries from "@/components/sections/Countries";
import WhyAura from "@/components/sections/WhyAura";
import StudentJourney from "@/components/sections/StudentJourney";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import StatsChart from "@/components/sections/StatsChart";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedNumbers />
      <Services />
      <AIFeatures />
      <Countries />
      <WhyAura />
      <StudentJourney />
      <Testimonials />
      <StatsChart />
      <FAQ />
      <FinalCTA />
    </>
  );
}

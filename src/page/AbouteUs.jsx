import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../Components/ui/Card";
import { HeroSection } from "../Components/HeroSection";
import { HistorySection } from "../Components/HistorySection";
import { CallToActionSection } from "../Components/CallToActionSection";

const AbouteUs = () => {
  return (
    <div className="">
      <main className="min-h-screen">
        <HeroSection />
        <HistorySection />
        <CallToActionSection />
      </main>

    </div>
  );
};

export default AbouteUs;
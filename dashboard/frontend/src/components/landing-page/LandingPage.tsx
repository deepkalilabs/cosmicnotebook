import React from "react";
import Header from "@/components/landing-page/Header";
import HeroSection from "@/components/landing-page/sections/HeroSection";
import FeaturesSection from "@/components/landing-page/sections/FeaturesSection";
import IntegrationsSection from "@/components/landing-page/sections/IntegrationsSection";
import PricingSection from "@/components/landing-page/sections/PricingSection";
import FaqSection from "@/components/landing-page/sections/FaqSection";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <IntegrationsSection />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
} 
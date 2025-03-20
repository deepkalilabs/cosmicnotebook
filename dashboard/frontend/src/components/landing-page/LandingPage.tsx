import React from "react";
import AnnouncementBar from "@/components/landing-page/AnnouncementBar";
import Header from "@/components/landing-page/Header";
import HeroSection from "@/components/landing-page/sections/HeroSection";
import SocialProofSection from "@/components/landing-page/sections/SocialProofSection";
import FeaturesSection from "@/components/landing-page/sections/FeaturesSection";
import HowItWorksSection from "@/components/landing-page/sections/HowItWorksSection";
import PricingSection from "@/components/landing-page/sections/PricingSection";
// import TestimonialsSection from "@/components/landing-page/sections/TestimonialsSection";
// import PricingSection from "@/components/landing-page/sections/PricingSection";
// import CTASection from "@/components/landing-page/sections/CTASection";
import IntegrationsSection from "@/components/landing-page/sections/IntegrationsSection";
import Footer from "@/components/landing-page/Footer";
import FAQSection from "@/components/landing-page/sections/FaqSection";

export default function LandingPage() {
  return ( 
    <div>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-black">
        <Header />
      </div>

        <HeroSection />
        {/* <SocialProofSection /> */}
        <FeaturesSection />
        <IntegrationsSection />
        <PricingSection />
        <FAQSection />
          {/* <HowItWorksSection /> */}
        {/* <TestimonialsSection /> */}
        {/* <PricingSection /> */}
        {/* <CTASection /> */}

      <Footer />
      </div>
  );
} 
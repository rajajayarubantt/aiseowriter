import React, { Suspense } from "react";

import HeroSection from "@/components/sections/HeroSection";
import EarlyAccessSection from "@/components/sections/EarlyAccessSection";
import DemoVideoSection from "@/components/sections/DemoVideoSection";
// import TrustedBrandsSection from '@/components/sections/TrustedBrandsSection'
import FeaturesSection from "@/components/sections/FeaturesSection";
import UseCasesSection from "@/components/sections/UseCasesSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import IntegrationsSection from "@/components/sections/IntegrationsSection";
import PricingSection from "@/components/sections/PricingSection";
// import TestimonialsSection from '@/components/sections/TestimonialsSection'
import BlogSection from "@/components/sections/BlogSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      {/* <EarlyAccessSection /> */}
      <DemoVideoSection />
      <FeaturesSection />
      <UseCasesSection />
      <ComparisonSection />
      <IntegrationsSection />
      <PricingSection />
      <BlogSection />
    </main>
  );
}

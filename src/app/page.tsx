import { Hero } from "@/components/Hero";
import { PopularConversions } from "@/components/PopularConversions";
import { FormatShowcase } from "@/components/FormatShowcase";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ProUpsell } from "@/components/ProUpsell";

export default function Home() {
  return (
    <>
      <Hero />
      <PopularConversions />
      <FormatShowcase />
      <HowItWorks />
      <FeaturesSection />
      <ProUpsell />
    </>
  );
}

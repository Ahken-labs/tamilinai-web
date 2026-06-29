import HeroSection from "../sections/HeroSection";
import WhyInaiSection from "../sections/WhyInaiSection";
import DiasporaSection from "../sections/DiasporaSection";
import AboutSection from "../sections/AboutSection";
import { HelpSection } from "../sections/HelpSection";
import FAQSection from "../sections/FAQSection";
import SectionScroller from "../SectionScroller";
import BusinessSection from "../sections/BusinessSection";
import CardsSection from "../sections/CardsSection";
import AdvantageSection from "../sections/AdvantageSection";
import BoostedProfileSection from "../sections/BoostedProfileSection";
// import ServicesSection from "../sections/ServicesSection";

export const metadata = {
  title: "FAQ - Inai Tamil Matrimony",
  description: "Frequently asked questions about Inai Tamil Matrimony. How to create a profile, search for matches, send interests, and membership options.",
  alternates: { canonical: "https://inai.lk/faq" },
};

export default function FAQPage() {
  return (
    <main className="overflow-x-hidden">
      <SectionScroller sectionId="faq" />
      <section id="hero">
        <HeroSection />
      </section>
      {/* <ServicesSection /> */}
      <BusinessSection />
      <CardsSection />
      <AdvantageSection/>
      <BoostedProfileSection />

      <WhyInaiSection />
      <DiasporaSection />
      <section id="about">
        <AboutSection />
      </section>
      <HelpSection />
      <section id="faq">
        <FAQSection />
      </section>
    </main>
  );
}

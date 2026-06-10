import HeroSection from "../sections/HeroSection";
import HowItWorksSection from "../sections/HowItWorksSection";
import ContactSection from "../sections/ContactSection";
import DiasporaSection from "../sections/DiasporaSection";
import AboutSection from "../sections/AboutSection";
import { HelpSection } from "../sections/HelpSection";
import FAQSection from "../sections/FAQSection";
import SectionScroller from "../SectionScroller";

export const metadata = {
  title: "FAQ — Inai Tamil Matrimony",
  description: "Frequently asked questions about Inai Tamil Matrimony. How to create a profile, search for matches, send interests, and membership options.",
  alternates: { canonical: "https://inai.lk/faq" },
};

export default function FAQPage() {
  return (
    <main>
      <SectionScroller sectionId="faq" />
      <section id="hero">
        <HeroSection />
      </section>
      <HowItWorksSection />
      <section id="contact">
        <ContactSection />
      </section>
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

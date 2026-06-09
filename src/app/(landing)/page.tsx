import ContactInfoSection from "@/src/components/profile/sections/ContactInfoSection";
import HeroSection from "./sections/HeroSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import ContactSection from "./sections/ContactSection";
import DiasporaSection from "./sections/DiasporaSection";
import { HelpSection } from "./sections/HelpSection";
import FAQSection from "./sections/FAQSection";
import AboutSection from "./sections/AboutSection";

export default function HomePage() {
  return (
    <main>
      <section id="hero">
        <HeroSection />
      </section>
      <HowItWorksSection />
      <section>
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

//src/app/page.tsx

import Footer from "../components/Footer";
import AboutSection from "../sections/AboutSection";
import ContactSection from "../sections/ContactSection";
import FAQSection from "../sections/FAQSection";
import { HelpSection } from "../sections/HelpSection";
import HeroSection from "../sections/HeroSection";
import HowItWorksSection from "../sections/HowItWorksSection";

export default function HomePage() {
  return (
    <>
      <main>
        <section id="hero">
          <HeroSection />
        </section>
        <HowItWorksSection />
        <section id="about">
          <AboutSection />
        </section>
        <ContactSection />
        <HelpSection />
        <FAQSection />
        <Footer />
      </main>
    </>
  );
}

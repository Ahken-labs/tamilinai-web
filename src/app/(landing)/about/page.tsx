import HeroSection from "../sections/HeroSection";
import HowItWorksSection from "../sections/HowItWorksSection";
import ContactSection from "../sections/ContactSection";
import DiasporaSection from "../sections/DiasporaSection";
import AboutSection from "../sections/AboutSection";
import { HelpSection } from "../sections/HelpSection";
import FAQSection from "../sections/FAQSection";
import SectionScroller from "../SectionScroller";

export const metadata = {
  title: "About Inai — Tamil Matrimony Sri Lanka",
  description: "Learn about Inai, the Tamil matrimony platform connecting Sri Lankan Tamils and the global diaspora. Rooted in Tamil values, built for modern families.",
  alternates: { canonical: "https://inai.lk/about" },
};

export default function AboutPage() {
  return (
    <main>
      <SectionScroller sectionId="about" />
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

import HeroSection from "../sections/HeroSection";
import WhyInaiSection from "../sections/WhyInaiSection";
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
      <section id="contact">
        <WhyInaiSection />
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

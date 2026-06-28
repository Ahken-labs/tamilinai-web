import HeroSection from "./sections/HeroSection";
import WhyInaiSection from "./sections/WhyInaiSection";
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

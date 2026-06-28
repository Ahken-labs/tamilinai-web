import HeroSection from "./sections/HeroSection";
import WhyInaiSection from "./sections/WhyInaiSection";
import DiasporaSection from "./sections/DiasporaSection";
import { HelpSection } from "./sections/HelpSection";
import FAQSection from "./sections/FAQSection";
import AboutSection from "./sections/AboutSection";
import BusinessSection from "./sections/BusinessSection";
import CardsSection from "./sections/CardsSection";
import AdvantageSection from "./sections/AdvantageSection";

export default function HomePage() {
  return (
    <main>
      <section id="hero">
        <HeroSection />
      </section>
      <BusinessSection />
      <CardsSection />
      <AdvantageSection />

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

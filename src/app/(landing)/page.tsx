import HeroSection from "./sections/HeroSection";
import WhyInaiSection from "./sections/WhyInaiSection";
import DiasporaSection from "./sections/DiasporaSection";
import { HelpSection } from "./sections/HelpSection";
import FAQSection from "./sections/FAQSection";
import AboutSection from "./sections/AboutSection";
import BusinessSection from "./sections/BusinessSection";
import CardsSection from "./sections/CardsSection";
import AdvantageSection from "./sections/AdvantageSection";
import BoostedProfileSection from "./sections/BoostedProfileSection";
import ServicesSection from "./sections/ServicesSection";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <section id="hero">
        <HeroSection />
      </section>
      <ServicesSection />
      <BusinessSection />
      <CardsSection />
      <AdvantageSection />
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

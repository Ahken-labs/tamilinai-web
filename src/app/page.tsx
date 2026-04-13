//src/app/page.tsx

import Footer from "../components/Footer";
import AboutSection from "../sections/AboutSection";
import HeroSection from "../sections/HeroSection";
import HowItWorksSection from "../sections/HowItWorksSection";

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <HowItWorksSection />
        <AboutSection />
        <Footer />
      </main>
    </>
  );
}

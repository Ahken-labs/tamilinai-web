//src/app/page.tsx

import Footer from "../components/Footer";
import HeroSection from "../sections/HeroSection";
import HowItWorksSection from "../sections/HowItWorksSection";

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <HowItWorksSection />
        <Footer />
      </main>
    </>
  );
}

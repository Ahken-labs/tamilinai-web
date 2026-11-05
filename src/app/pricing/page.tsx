import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import EliteUpgradeBody from "@/src/components/elite/EliteUpgradeBody";

export const metadata = {
  title: "Elite plans",
  robots: { index: false, follow: false },
};

export default function PricingPage() {
  return (
    <>
      <Header />
      <EliteUpgradeBody isPublic />
      <Footer />
    </>
  );
}

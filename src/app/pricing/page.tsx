import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import PricingClient from "./PricingClient";

export const metadata = {
  title: "Elite plans",
  robots: { index: false, follow: false },
};

export default function PricingPage() {
  return (
    <>
      <Header />
      <PricingClient />
      <Footer />
    </>
  );
}

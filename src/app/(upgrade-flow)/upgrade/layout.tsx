import FocusedHeader from "@/src/components/FocusedHeader";
import Footer from "@/src/components/Footer";

export default function UpgradeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FocusedHeader />
      {children}
      <Footer />
    </>
  );
}

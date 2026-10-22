import Footer from "../../components/Footer";
import FocusedHeader from "@/src/components/FocusedHeader";

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FocusedHeader />
      {children}
      <Footer />
    </>
  );
}

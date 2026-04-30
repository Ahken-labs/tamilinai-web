import AppHeader from "../../components/AppHeader";
import Footer from "../../components/Footer";
import { ShortlistProvider } from "../../context/ShortlistContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShortlistProvider>
      <AppHeader />
      {children}
      <Footer variant="app" />
    </ShortlistProvider>
  );
}

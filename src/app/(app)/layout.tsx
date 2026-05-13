import AppHeader from "../../components/AppHeader";
import Footer from "../../components/Footer";
import AuthGuard from "../../components/AuthGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppHeader />
      {children}
      <Footer variant="app" />
    </AuthGuard>
  );
}

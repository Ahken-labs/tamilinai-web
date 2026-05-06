import AppHeader from "@/src/components/AppHeader";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      {children}
      </>
  );
}

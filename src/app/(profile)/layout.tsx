import AppHeader from "@/src/components/AppHeader";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      {children}
      </>
  );
}

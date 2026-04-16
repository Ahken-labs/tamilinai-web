import "./globals.css";
import Header from "../components/Header";
import { LangProvider } from "../context/LangContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LangProvider>
          <Header />
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
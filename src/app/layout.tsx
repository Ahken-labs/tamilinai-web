import "./globals.css";
import { LangProvider } from "../context/LangContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
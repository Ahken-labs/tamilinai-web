import "./globals.css";
import { LangProvider } from "../context/LangContext";
import QueryProvider from "../components/QueryProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <QueryProvider>
          <LangProvider>
            {children}
          </LangProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import { LangProvider } from "../context/LangContext";
import QueryProvider from "../components/QueryProvider";
import SeoSchema from "./SeoSchema";

export const metadata = {
  metadataBase: new URL('https://inai.lk'),
  title: {
    default: 'Inai',
    template: '%s | Inai',
  },
  description:
    'Inai Tamil Matrimony is an online matchmaking platform based in Sri Lanka, helping Tamil brides and grooms find life partners locally and across the global diaspora. We connect Sri Lankan Tamils with matches in Canada, the UK, Australia, Germany, Singapore, Malaysia, and India. Members search verified profiles by religion, caste, education, profession, and city, serving Hindu, Catholic, Christian, and Muslim Tamil communities. The platform offers secure messaging, video verification, and membership options for matrimonial search. Parents, siblings, and individuals can create and manage profiles for family members. Inai is a culturally rooted matrimonial service for Tamil families in Sri Lanka and worldwide.',
    
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://inai.lk',
  },
  openGraph: {
    title: 'Inai',
    description:
      'Inai Tamil Matrimony is an online matchmaking platform based in Sri Lanka, helping Tamil brides and grooms find life partners locally and across the global diaspora. We connect Sri Lankan Tamils with matches in Canada, the UK, Australia, Germany, Singapore, Malaysia, and India. Members search verified profiles by religion, caste, education, profession, and city, serving Hindu, Catholic, Christian, and Muslim Tamil communities. The platform offers secure messaging, video verification, and membership options for matrimonial search. Parents, siblings, and individuals can create and manage profiles for family members. Inai is a culturally rooted matrimonial service for Tamil families in Sri Lanka and worldwide.',
    url: 'https://inai.lk',
    siteName: 'Inai',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <SeoSchema/>
        <QueryProvider>
          <LangProvider>
            {children}
          </LangProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

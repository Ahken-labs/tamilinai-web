import "./globals.css";
import { LangProvider } from "../context/LangContext";
import QueryProvider from "../providers/QueryProvider";
import SeoSchema from "./SeoSchema";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Arima+Madurai:wght@700;900&family=Poppins:wght@400;500;600&family=Noto+Sans+Tamil:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
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

import "./globals.css";
import Script from "next/script";
import { Poppins, Noto_Sans_Tamil, Arima } from "next/font/google";
import { LangProvider } from "../context/LangContext";
import QueryProvider from "../providers/QueryProvider";
import SeoSchema from "./SeoSchema";
import NoContextMenu from "../components/NoContextMenu";
import ConsoleWarning from "../components/ConsoleWarning";
import { ToastProvider } from "../components/ui/Toast";
import SessionRestorer from "../components/SessionRestorer";
import GoogleAuthProvider from "../providers/GoogleAuthProvider";
import GoogleAnalytics from "../components/GoogleAnalytics";
import MetaPixel from "../components/MetaPixel";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-poppins", display: "swap" });
const notoSansTamil = Noto_Sans_Tamil({ subsets: ["tamil"], weight: ["400", "500", "700"], variable: "--font-tamil", display: "swap" });
const arima = Arima({ subsets: ["tamil", "latin"], weight: ["700"], variable: "--font-arima", display: "swap" });

// Holds Chrome's install prompt for our own banner (InstallAppBanner); the service worker is registered on the live site only
const PWA_SCRIPT = `window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();window.__inaiInstall=e;window.dispatchEvent(new Event("inai-install-ready"));});
window.addEventListener("appinstalled",function(){window.__inaiInstall=null;window.dispatchEvent(new Event("inai-install-ready"));});
${process.env.NODE_ENV === "production" ? `if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").catch(function(){});});}` : ""}`;

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL('https://inai.lk'),
  title: {
    default: 'Inai - Sri Lankan Tamil Matrimony',
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
    title: 'Inai - Sri Lankan Tamil Matrimony',
    description:
      'Inai Tamil Matrimony is an online matchmaking platform based in Sri Lanka, helping Tamil brides and grooms find life partners locally and across the global diaspora. We connect Sri Lankan Tamils with matches in Canada, the UK, Australia, Germany, Singapore, Malaysia, and India. Members search verified profiles by religion, caste, education, profession, and city, serving Hindu, Catholic, Christian, and Muslim Tamil communities. The platform offers secure messaging, video verification, and membership options for matrimonial search. Parents, siblings, and individuals can create and manage profiles for family members. Inai is a culturally rooted matrimonial service for Tamil families in Sri Lanka and worldwide.',
    url: 'https://inai.lk',
    siteName: 'Inai - Sri Lankan Tamil Matrimony',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Inai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inai - Sri Lankan Tamil Matrimony',
    description: 'Find your life partner on Inai — Tamil matrimony platform for Sri Lanka and the global diaspora.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${poppins.variable} ${notoSansTamil.variable} ${arima.variable}`}>
      <head>
        {/* LCP hero image — fetchpriority=high ensures browser fetches this first */}
        <link rel="preload" as="image" fetchPriority="high" href="/_next/image?url=%2Fimages%2Fhero_image.webp&w=750&q=75" type="image/webp" />
      </head>
      <body>
        <Script id="pwa-setup" strategy="beforeInteractive">{PWA_SCRIPT}</Script>
        <SessionRestorer />
        <NoContextMenu />
        <ConsoleWarning />
        <SeoSchema/>
        <GoogleAnalytics />
        <MetaPixel />
        <GoogleAuthProvider>
          <QueryProvider>
            <LangProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </LangProvider>
          </QueryProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}

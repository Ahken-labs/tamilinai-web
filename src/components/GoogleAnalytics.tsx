import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// EEA + UK + Switzerland: Google requires consent for ads/analytics cookies here.
// We don't show a banner, so these visitors default to "denied" (cookieless pings,
// modelled conversions, no remarketing). Everyone else is measured normally.
const CONSENT_REQUIRED_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  "IS", "LI", "NO", "GB", "CH",
];

// Unset NEXT_PUBLIC_GA_ID (local, staging) → nothing loads, no fake visits.
export default function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      {/* Consent default must be queued before gtag.js loads */}
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            region: ${JSON.stringify(CONSENT_REQUIRED_REGIONS)}
          });
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    </>
  );
}

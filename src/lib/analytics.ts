// Thin wrapper over the gtag loaded by components/GoogleAnalytics.tsx.
// No-op when analytics isn't loaded (local, staging, or blocked by an ad blocker).

type Gtag = (...args: unknown[]) => void;

function gtag(...args: unknown[]): void {
  if (typeof window === "undefined") return;
  const fn = (window as unknown as { gtag?: Gtag }).gtag;
  fn?.(...args);
}

// Google Ads conversion: a new account was created. Fire once, at the moment of
// account creation — not on a page, so Back/refresh never double-count.
export function trackAccountCreated(): void {
  gtag("event", "ads_conversion_SUBMIT_LEAD_FORM_1", {});
}

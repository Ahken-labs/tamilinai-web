// Thin wrappers over the Google tag (components/GoogleAnalytics.tsx) and the Meta
// pixel (components/MetaPixel.tsx). Each is a no-op when its script isn't loaded
// (local, staging, or blocked by an ad blocker), so sign-up never depends on them.

import type { MetaEventContext } from "../types/auth";

type TrackFn = (...args: unknown[]) => void;

function call(name: "gtag" | "fbq", ...args: unknown[]): void {
  if (typeof window === "undefined") return;
  const fn = (window as unknown as Record<string, TrackFn | undefined>)[name];
  fn?.(...args);
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

// Created before the API call so the server (Conversions API) and the browser
// pixel send the same eventId — Meta then counts the event once.
export function newMetaContext(): MetaEventContext {
  // randomUUID is missing on older browsers (e.g. iOS < 15.4) — must never break sign-up
  const eventId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return { eventId, fbp: readCookie("_fbp"), fbc: readCookie("_fbc") };
}

// Landing form submitted and OTP sent. Meta only — tracked to see drop-off.
export function trackLead(meta: MetaEventContext): void {
  call("fbq", "track", "Lead", {}, { eventID: meta.eventId });
}

// A new account was created. Fire once, at the moment of account creation — not on
// a page, so Back/refresh and existing users never count. Google Ads + Meta goal.
export function trackAccountCreated(meta: MetaEventContext): void {
  call("gtag", "event", "ads_conversion_SUBMIT_LEAD_FORM_1", {});
  call("fbq", "track", "CompleteRegistration", {}, { eventID: meta.eventId });
}

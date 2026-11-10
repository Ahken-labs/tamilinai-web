"use client";

import { useSyncExternalStore } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window { __inaiInstall?: BeforeInstallPromptEvent | null }
}

// Fired by the early script in the root layout when the browser's install prompt becomes available or is used up
const READY_EVENT = "inai-install-ready";
const SUPPORTED_DEVICES = /Android|Windows/;

function subscribe(callback: () => void) {
  window.addEventListener(READY_EVENT, callback);
  return () => window.removeEventListener(READY_EVENT, callback);
}

// The browser stops offering the prompt once the app is installed, so this also turns false for installed users
export function useCanInstall(): boolean {
  return useSyncExternalStore(subscribe, () => !!window.__inaiInstall && SUPPORTED_DEVICES.test(navigator.userAgent), () => false);
}

// Opens the browser's install confirmation; returns true if the user installed
export async function runInstall(): Promise<boolean> {
  const event = window.__inaiInstall;
  if (!event) return false;
  // Each prompt can be used only once
  window.__inaiInstall = null;
  window.dispatchEvent(new Event(READY_EVENT));
  try {
    await event.prompt();
    const { outcome } = await event.userChoice;
    return outcome === "accepted";
  } catch {
    return false;
  }
}

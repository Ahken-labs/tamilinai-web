"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiShare, FiX } from "react-icons/fi";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window { __inaiInstall?: BeforeInstallPromptEvent | null }
}

// Fired by the early script in the root layout when Chrome's install prompt becomes available or is used up
const READY_EVENT = "inai-install-ready";
const SHOWN_KEY = "inai_install_banner_shown_at";
const HIDE_MS = 30 * 24 * 60 * 60 * 1000;
const SHOW_DELAY_MS = 4000;

function subscribe(callback: () => void) {
  window.addEventListener(READY_EVENT, callback);
  return () => window.removeEventListener(READY_EVENT, callback);
}

// True when Chrome or Edge can install the app (never on iPhone)
export function useCanInstall(): boolean {
  return useSyncExternalStore(subscribe, () => !!window.__inaiInstall, () => false);
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

function isInstalledApp(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

// iPhone or iPad browser that can "Add to Home Screen" (in-app browsers like Facebook and Instagram can't)
function isIosBrowser(): boolean {
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return ios && !/FBAN|FBAV|Instagram|Line\/|Snapchat|musical_ly|TikTok/i.test(ua);
}

// Small "Get the Inai app" bar for logged-in users; shown at most once every 30 days
export default function InstallAppBanner() {
  const pathname = usePathname();
  const canInstall = useCanInstall();
  const [ready, setReady] = useState(false);
  const [ios, setIos] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    try {
      const shownAt = Number(localStorage.getItem(SHOWN_KEY));
      if (shownAt && Date.now() - shownAt < HIDE_MS) return;
    } catch { return; }
    if (isInstalledApp()) return;
    // Waits a few seconds so it never competes with the page loading
    const timer = setTimeout(() => { setIos(isIosBrowser()); setReady(true); }, SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const onPaymentPage = pathname.startsWith("/elite-upgrade") || pathname.startsWith("/upgrade");
  const visible = ready && !closed && !onPaymentPage && (canInstall || ios);

  useEffect(() => {
    if (!visible) return;
    try { localStorage.setItem(SHOWN_KEY, String(Date.now())); } catch { /* unavailable */ }
  }, [visible]);

  if (!visible) return null;

  async function handleInstall() {
    setClosed(true);
    await runInstall();
  }

  return (
    <div
      role="dialog"
      aria-label="Install the Inai app"
      className="font-poppins fixed z-[60] left-3 right-3 bottom-[68px] min-[900px]:left-auto min-[900px]:right-6 min-[900px]:bottom-6 min-[900px]:w-[380px] flex items-center gap-3 rounded-[16px] border border-[#EEEEEE] bg-white p-3 shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
    >
      <Image src="/icons/app-icon-192.png" alt="" width={44} height={44} unoptimized className="shrink-0 rounded-[10px]" />
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold leading-[140%] text-[#222222]">Get the Inai app</p>
        <p className="text-[12px] leading-[140%] text-[#6B6B6B]">
          {ios ? (
            <>Tap <FiShare className="inline h-3.5 w-3.5 -mt-0.5 text-[#007AFF]" /> Share, then &quot;Add to Home Screen&quot;</>
          ) : (
            "Quick access from your home screen"
          )}
        </p>
      </div>
      {!ios && (
        <button
          type="button"
          onClick={handleInstall}
          className="shrink-0 cursor-pointer rounded-full bg-[#B31B38] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#9A1730] active:scale-95"
        >
          Install
        </button>
      )}
      <button
        type="button"
        onClick={() => setClosed(true)}
        aria-label="Close"
        className="shrink-0 cursor-pointer rounded-full p-1 text-[#6B6B6B] transition-colors hover:bg-[#F2F2F2]"
      >
        <FiX className="h-4 w-4" />
      </button>
    </div>
  );
}

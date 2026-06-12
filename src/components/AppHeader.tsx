"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Logo,
  SearchIcon,
  MatchesIcon,
  NotificationsIcon,
  ShortlistedIcon,
  InterestedIcon,
  SettingsIcon,
  EditIcon,
  EliteIcon,
  HeartIcon,
  LogoutIcon,
  SettingIcon
} from "../assets/Icons";
import Image from "next/image";
import ProtectedImage from "./common-layout/ProtectedImage";
import { getProgressWidth } from "../utils/getProgressWidth";
import PartnerPreferenceModal from "./app/PartnerPreferenceModal";
import LogoutPopup from "./app/LogoutPopup";
import { getMe } from "../lib/api/user";
import { getNotifications } from "../lib/api/notifications";
import { getSentInterests, getReceivedInterests } from "../lib/api/interests";
import type { Me } from "../types/user";

const ME_CACHE_KEY = "inai_me_cache";

function readCache(): Me | null {
  try {
    const raw = localStorage.getItem(ME_CACHE_KEY);
    return raw ? (JSON.parse(raw) as Me) : null;
  } catch { return null; }
}

function writeCache(me: Me): void {
  try { localStorage.setItem(ME_CACHE_KEY, JSON.stringify(me)); } catch { /* unavailable */ }
}

export function readMeCache(): Me | null { return readCache(); }
export function writeMeCache(me: Me): void { writeCache(me); }
export function invalidateMeCache(): void {
  try { localStorage.removeItem(ME_CACHE_KEY); } catch { /* unavailable */ }
}

const NAV_TABS = [
  { labelKey: "Matches" as const, href: "/matches", Icon: MatchesIcon },
  { labelKey: "Notifications" as const, href: "/notifications", Icon: NotificationsIcon },
  { labelKey: "Shortlisted" as const, href: "/shortlisted", Icon: ShortlistedIcon },
  { labelKey: "Interested" as const, href: "/interested", Icon: InterestedIcon },
] as const;

export default function AppHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const [openModal, setOpenModal] = useState<null | "search" | "edit">(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const [me, setMe] = useState<Me | null>(null);

  // Load from cache instantly after mount, then refresh from API in background
  useEffect(() => {
    const cached = readCache();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (cached) setMe(cached);
    const token = localStorage.getItem("tamilinai_access_token");
    if (!token) return;
    getMe()
      .then((data) => { writeCache(data); setMe(data); })
      .catch(() => { /* keep cached data */ });
  }, []);

  // Re-fetch me whenever my-profile page signals a successful save
  useEffect(() => {
    const handler = () => {
      const cached = readCache();
      if (cached) setMe(cached); // instant update from cache
    };
    window.addEventListener("me-updated", handler);
    return () => window.removeEventListener("me-updated", handler);
  }, []);

  // Unread notification count — shared cache with notifications page
  const queryClient = useQueryClient();
  const { data: hasUnread = false } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (data) => data.some((n) => !n.isRead && n.category !== 'interest'),
  });
  const { data: hasUnreadInterestSent = false } = useQuery({
    queryKey: ["interests", "sent"],
    queryFn: getSentInterests,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (data) => data.some((item) => item.isNew),
  });
  const { data: hasUnreadInterestReceived = false } = useQuery({
    queryKey: ["interests", "received"],
    queryFn: getReceivedInterests,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (data) => data.some((item) => item.isNew),
  });
  const hasUnreadInterest = hasUnreadInterestSent || hasUnreadInterestReceived;

  // Close settings dropdown on outside click
  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [settingsOpen]);

  // Global SSE — runs on every page so new notifications arrive in real time
  useEffect(() => {
    const token = localStorage.getItem("tamilinai_access_token");
    if (!token) return;
    const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
    let mounted = true;
    let controller: AbortController;
    let retryTimer: ReturnType<typeof setTimeout>;
    let retryDelay = 1_000;

    async function connect() {
      if (!mounted) return;
      controller = new AbortController();
      try {
        const res = await fetch(`${BASE}/api/notifications/stream`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          if (mounted) retryTimer = setTimeout(() => { retryDelay = Math.min(retryDelay * 2, 30_000); connect(); }, retryDelay);
          return;
        }
        retryDelay = 1_000; // reset on successful connection
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            if (line.startsWith("data:")) {
              queryClient.invalidateQueries({ queryKey: ["notifications"] });
              queryClient.invalidateQueries({ queryKey: ["interests", "received"] });
              queryClient.invalidateQueries({ queryKey: ["interests", "sent"] });
            }
          }
        }
      } catch { /* aborted or network drop — retry below */ }
      if (mounted) retryTimer = setTimeout(() => { retryDelay = Math.min(retryDelay * 2, 30_000); connect(); }, retryDelay);
    }

    connect();
    return () => { mounted = false; controller?.abort(); clearTimeout(retryTimer); };
  }, [queryClient]);

  // Sync unread dot when another tab marks notifications as read
  useEffect(() => {
    let ch: BroadcastChannel;
    try {
      ch = new BroadcastChannel("inai_notifications");
      ch.onmessage = (e: MessageEvent<{ type: string }>) => {
        if (e.data?.type === "notifications_read") {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
      };
    } catch { /* BroadcastChannel not supported in this environment */ }
    return () => { try { ch?.close(); } catch { /* ignore */ } };
  }, [queryClient]);

  const trustBadge = me?.trustBadge ?? false;
  const isElite = me?.isElite ?? false;
  const score = me?.profileCompletionScore ?? 0;
  const displayName = me?.name ?? "";
  const displayId = me?.displayId ?? "";
  const photo = me?.profile?.photoUrl
    ?? (me?.gender === "male" ? "/images/no_photo_male.png" : "/images/no_photo.png");

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  // Scroll-hide for mobile (≤900px)
  const [navVisible, setNavVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!isMobile) return;
      const y = window.scrollY;
      if (y <= 10) setNavVisible(true);
      else if (y > lastScrollY.current + 4) setNavVisible(false);
      else if (y < lastScrollY.current - 4) setNavVisible(true);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <>
      <header
        className="font-poppins select-none sticky top-0 z-[100] w-full bg-white/60 backdrop-blur-sm transition-transform duration-300"
        style={isMobile && !navVisible ? { transform: "translateY(-100%)" } : undefined}
      >
        <div className="max-w-[1920px] mx-auto flex px-5 lg:px-10 max-[320px]:h-[56px] max-[768px]:h-[66px] h-[74px] max-[320px]:pt-2 pt-5 gap-5 min-[900px]:gap-6">

          {/* Left: Logo + Search — desktop only */}
          <div className="hidden min-[900px]:flex mb-2 items-center gap-2 lg:gap-3 flex-1 min-w-0">
            <Link href={"/matches"}>
              <Logo />
            </Link>
            <button
              type="button"
              onClick={() => { setSettingsOpen(false); setMobileOpen(false); setOpenModal("search"); }}
              className="flex items-center pr-4 pl-2 py-2 gap-2 rounded-[41px] bg-[#E0E0E0] cursor-pointer hover:bg-[#D4D4D4] transition-colors duration-150"
            >
              {/* desktop */}
              <SearchIcon className="w-5 md:w-5.3 lg:w-6 h-5 md:h-5.3 lg:h-6 text-[#525252]" />
              <span className="bg-transparent text-[14px] md:text-[15px] lg:text-[16px] font-normal text-[#4A4A4A]">
                Search
              </span>
            </button>
          </div>

          {/* Center: Nav tabs — all sizes */}
          <nav className="flex items-center justify-between min-[420px]:mx-3 min-[500px]:mx-10 min-[600px]:mx-20 min-[720px]:mx-30 min-[900px]:justify-center min-[500px]:mx-0 min-[900px]:justify-center min-[900px]:mx-0 min-[900px]:gap-5 lg:gap-9 flex-1 mt-0">
            {NAV_TABS.map(({ labelKey, href, Icon }) => {
              const active = pathname.startsWith(href);
              const showDot = (labelKey === "Notifications" && hasUnread) || (labelKey === "Interested" && hasUnreadInterest);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex flex-col items-center pb-1 md:pb-1 gap-0.5 border-b-[2.4px] transition-colors duration-150 ${active ? "border-[#222222]" : "border-transparent"}`}
                >
                  <div className="relative">
                    <Icon className={`w-5 md:w-6 h-5 md:h-6 shrink-0 transition-colors duration-150 ${active ? "text-[#222222]" : "text-[#888888]"}`} />
                    {showDot && <span className="absolute -top-0 -right-1.5 h-2 md:h-2.5 lg:h-3 w-2 md:w-2.5 lg:w-3 rounded-full bg-[#B31B38]" />}
                  </div>
                  <span className={`text-[12px] sm:text-[14px] md:text-[16px] font-normal leading-[150%] transition-colors duration-150 whitespace-nowrap ${active ? "text-dark max-[500px]:font-semibold font-normal" : "text-secondary"}`}>
                    {(labelKey) as string}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Profile + Settings — desktop only */}
          <div className="hidden min-[900px]:flex items-center gap-3 flex-1 justify-end">

            {/* ── Desktop profile/settings button ── */}
            <div ref={settingsRef} className="hidden min-[900px]:relative mb-2 min-[900px]:flex items-center">
              <button
                type="button"
                onClick={() => { setMobileOpen(false); setSettingsOpen((v) => !v); }}
                className={`cursor-pointer flex items-center py-1 pl-1 pr-2 rounded-[42px] transition-colors duration-150 gap-2 ${isElite && trustBadge ? "" : "bg-[#E0E0E0] hover:bg-[#D4D4D4]"}`}
                style={
                  isElite && trustBadge
                    ? { background: "linear-gradient(269deg, #FFE0C2 44.21%, #FFF2D9 98.97%), #E0E0E0" }
                    : undefined
                }
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white bg-[#D9D9D9] relative">
                  <ProtectedImage src={photo} fill className="object-cover" alt="my profile" sizes="32px" />
                </div>
                <div className="flex flex-col gap-1">
                  {!trustBadge ? (
                    <>
                      <span className="text-[12px] md:text-[14px] font-semibold text-[#525252] leading-none">Profile points</span>
                      <div className="flex items-center gap-2">
                        <div className="w-[52px] h-2 bg-white rounded-[19px] overflow-hidden">
                          <div className="h-full bg-[#B31B38] rounded-[19px] transition-[width] duration-700 ease-in-out" style={{ width: `${getProgressWidth(score)}%` }} />
                        </div>
                        <span className="font-16 font-normal text-[#B31B38] leading-none">{score}%</span>
                      </div>
                    </>
                  ) : !isElite ? (
                    <span className="font-14 font-semibold text-[#B31B38] leading-none">Upgrade</span>
                  ) : (
                    <span className="font-14 font-semibold text-[#8D5900] leading-none">Elite</span>
                  )}
                </div>
                <div className="w-px self-stretch bg-white mx-1 py-0.5" />
                <SettingsIcon className={`w-6 h-6 ${isElite && trustBadge ? "text-[#8D5900]" : "text-[#525252]"}`} />
              </button>

              {/* Desktop settings dropdown */}
              <div
                className={`absolute top-full right-0 mt-5 z-[200] ${trustBadge && !isElite ? "w-[309px]" : "w-[270px]"} rounded-[16px] bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.08)] p-2 transition-all duration-200 ease-out origin-top-right ${settingsOpen
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
              >
                <div className="flex flex-col items-start gap-2">
                  <div className="w-full">
                    <div className="overflow-hidden text-ellipsis text-dark font-18 font-medium leading-[150%]">{displayName}</div>
                    <div className="text-dark font-16 font-normal leading-[150%]">({displayId})</div>
                  </div>
                  <div className="h-px self-stretch bg-[#EAEAEA]" />
                  {!trustBadge ? (
                    <Link
                      href="/trust-badge"
                      onClick={() => setSettingsOpen(false)}
                      className="cursor-pointer w-full flex items-center gap-3 rounded-[8px] px-2 py-3 text-left bg-gradient-to-r from-[#FFE0C2] to-[#FFF2D9] hover:bg-[linear-gradient(0deg,rgba(255,255,255,0.30)_0%,rgba(255,255,255,0.30)_100%),linear-gradient(269deg,#FFE0C2_44.21%,#FFF2D9_98.97%)] hover:shadow-[0_0_4px_0_#B31B38_inset] transition-all duration-150"
                    >
                      <Image src="/icons/trust_Badge.png" alt="" width={37} height={40} />
                      <span className="text-dark font-16 font-normal leading-[150%]">Get trust badge</span>
                      <span className="ml-auto rounded-[41px] bg-[#B31B38] px-2 py-[2px] text-white font-poppins font-16 font-normal leading-[150%]">Free</span>
                    </Link>
                  ) : !isElite ? (
                    <Link
                      href="/elite-upgrade"
                      onClick={() => setSettingsOpen(false)}
                      className="cursor-pointer w-full flex items-center gap-3 rounded-[8px] px-2 py-3 text-left bg-gradient-to-r from-[#FFE0C2] to-[#FFF2D9] hover:bg-[linear-gradient(0deg,rgba(255,255,255,0.30)_0%,rgba(255,255,255,0.30)_100%),linear-gradient(269deg,#FFE0C2_44.21%,#FFF2D9_98.97%)] hover:shadow-[0_0_4px_0_#B31B38_inset] transition-all duration-150"
                    >
                      <Image src="/icons/elite_Badge.png" alt="" width={37} height={40} />
                      <span className="text-dark font-16 font-normal leading-[150%]">Upgrade to Elite</span>
                      <span className="ml-auto rounded-[41px] bg-[#B31B38] px-2 py-[2px] text-white font-poppins font-16 font-normal leading-[150%]">Upgrade</span>
                    </Link>
                  ) : null}
                  <div className="w-full flex flex-col z-20 gap-2">
                    {[
                      { text: "Complete / Edit profile", Icon: EditIcon, href: "/my-profile" },
                      ...(trustBadge || isElite ? [] : [{ text: "Upgrade to Elite", Icon: EliteIcon, href: "/elite-upgrade" }]),
                      { text: "Edit partner preference", Icon: HeartIcon, onClick: () => { setSettingsOpen(false); setOpenModal("edit"); } },
                      { text: "Account settings", Icon: SettingIcon, href: "/account-settings" },
                      { text: "Logout", Icon: LogoutIcon, onClick: () => { setSettingsOpen(false); setLogoutOpen(true); } },
                    ].map(({ text, Icon, href, onClick }) =>
                      href ? (
                        <Link
                          key={text}
                          href={href}
                          className="w-full flex items-center gap-3 rounded-[8px] px-2 py-1 hover:bg-[#EAEAEA] transition-colors duration-150"
                          onClick={() => setSettingsOpen(false)}
                        >
                          <Icon className="w-4 h-4 shrink-0 text-dark" />
                          <span className="text-dark font-16 font-normal leading-[150%]">{text}</span>
                        </Link>
                      ) : (
                        <button
                          key={text}
                          type="button"
                          onClick={onClick}
                          className="w-full cursor-pointer flex items-center gap-3 rounded-[8px] px-2 py-1 text-left hover:bg-[#EAEAEA] transition-colors duration-150"
                        >
                          <Icon className="w-4 h-4 shrink-0 text-dark" />
                          <span className="text-dark font-16 font-normal leading-[150%]">{text}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* ── Bottom overlay — mobile only (< 900px) ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 min-[900px]:hidden bg-white/80 backdrop-blur-sm border-t border-[#EAEAEA] transition-transform duration-300"
        style={isMobile && !navVisible ? { transform: "translateY(100%)" } : undefined}
      >
        <div className="max-w-[1920px] mx-auto flex items-center max-[420px]:px-3 px-5 h-[56px] gap-3 justify-between">

          {/* Left: Logo + Search */}
          <div className="flex items-center gap-2">
            <Logo className="w-9 h-9" />
            <button
              type="button"
              onClick={() => { setSettingsOpen(false); setMobileOpen(false); setOpenModal("search"); }}
              className="flex items-center max-[420px]:pr-1.5 pr-3 max-[420px]:pl-1.5 pl-2 py-1.5 max-[420px]:gap-0.5 gap-2 rounded-[41px] bg-[#E0E0E0] cursor-pointer hover:bg-[#D4D4D4] transition-colors duration-150"
            >
              <SearchIcon className="w-5 sm:w-6 h-5 sm:h-6 text-[#525252]" />
              <span className="text-[14px] sm:text-[16px] font-normal text-[#4A4A4A] max-[420px]:hidden">
                Search
              </span>
              <span className="text-[12px] sm:text-[16px] font-normal text-[#4A4A4A] min-[420px]:hidden">
                Search
              </span>
            </button>
          </div>

          {/* Right: Profile indicator — opens drawer */}
          <button
            type="button"
            onClick={() => { setSettingsOpen(false); setMobileOpen((v) => !v); }}
            className={`cursor-pointer flex items-center py-0.5 pl-0.5 pr-1.5 rounded-[42px] transition-colors duration-150 gap-1 ${isElite && trustBadge ? "" : "bg-[#E0E0E0] hover:bg-[#D4D4D4]"}`}
            style={isElite && trustBadge ? { background: "linear-gradient(269deg, #FFE0C2 44.21%, #FFF2D9 98.97%), #E0E0E0" } : undefined}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white bg-[#D9D9D9] relative">
              <ProtectedImage src={photo} fill className="object-cover" alt="my profile" sizes="32px" />
            </div>
            <div className="flex flex-col gap-0.5">
              {!trustBadge ? (
                <>
                  <span className="text-[12px] md:text-[14px] font-semibold text-[#525252] leading-none">Profile points</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-[40px] h-2 bg-white rounded-[19px] overflow-hidden">
                      <div className="h-full bg-[#B31B38] rounded-[19px] transition-[width] duration-700 ease-in-out" style={{ width: `${getProgressWidth(score)}%` }} />
                    </div>
                    <span className="text-[14px] font-normal text-[#B31B38] leading-none">{score}%</span>
                  </div>
                </>
              ) : !isElite ? (
                <span className="text-[12px] font-semibold text-[#B31B38] leading-none">Upgrade</span>
              ) : (
                <span className="text-[12px] font-semibold text-[#8D5900] leading-none">Elite</span>
              )}
            </div>
            <div className="w-px self-stretch bg-white mx-0.5" />
            <SettingsIcon className={`w-6 h-6 ${isElite && trustBadge ? "text-[#8D5900]" : "text-[#525252]"}`} />
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div
        onClick={closeMobile}
        aria-hidden="true"
        className={`fixed inset-0 z-[110] bg-black/40 backdrop-blur-[2px] min-[900px]:hidden
          transition-opacity duration-300 ease-in-out
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full z-[120] w-[min(72vw,320px)] bg-white
          shadow-[-8px_0_32px_0_rgba(0,0,0,0.13)] flex flex-col min-[900px]:hidden
          transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)]
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >

        {/* ── Header: avatar + user info + close ── */}
        <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-[#EAEAEA] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-full overflow-hidden border border-[#E0E0E0] bg-[#D9D9D9] relative shrink-0"
              style={
                isElite && trustBadge
                  ? { boxShadow: "0 0 0 2px #FFD9A0" }
                  : undefined
              }
            >
              <ProtectedImage src={photo} fill className="object-cover" alt="my profile" sizes="40px" />
            </div>
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-[#222222] leading-tight truncate">{displayName}</div>
              <div className="text-[13px] font-normal text-[#888888] leading-tight">({displayId})</div>
            </div>
          </div>
          {/* Close button */}
          <button
            onClick={closeMobile}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F0F0F0] transition-colors duration-150 shrink-0 ml-2"
            aria-label="Close menu"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="#525252" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {/* Profile progress */}
          {!trustBadge && (
            <div className="px-4 py-3.5 border-b border-[#F0F0F0]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] md:text-[14px] font-semibold text-[#525252] uppercase tracking-wide">Profile points</span>
                <span className="text-[16px] font-semibold text-[#B31B38]">{score}%</span>
              </div>
              <div className="w-full h-2 bg-[#EBEBEB] rounded-[19px] overflow-hidden">
                <div
                  className="h-full bg-[#B31B38] rounded-[19px] transition-[width] duration-700 ease-in-out"
                  style={{ width: `${getProgressWidth(score)}%` }}
                />
              </div>
            </div>
          )}

          {/* Trust badge / Elite upgrade CTA — mirrors desktop */}
          {!trustBadge ? (
            <div className="px-3 pt-3 pb-1">
              <Link
                href="/trust-badge"
                onClick={closeMobile}
                className="flex items-center gap-3 rounded-[10px] px-3 py-2.5
                  bg-gradient-to-r from-[#FFE0C2] to-[#FFF2D9]
                  hover:shadow-[0_0_4px_0_#B31B38_inset] transition-all duration-150"
              >
                <Image src="/icons/trust_Badge.png" alt="" width={32} height={35} />
                <span className="text-[14px] font-normal text-[#222222] flex-1 leading-tight">Get trust badge</span>
                <span className="rounded-[41px] bg-[#B31B38] px-2.5 py-[3px] text-white text-[12px] font-normal shrink-0">
                  Free
                </span>
              </Link>
            </div>
          ) : !isElite ? (
            <div className="px-3 pt-3 pb-1">
              <Link
                href="/elite-upgrade"
                onClick={closeMobile}
                className="flex items-center gap-3 rounded-[10px] px-3 py-2.5
                  bg-gradient-to-r from-[#FFE0C2] to-[#FFF2D9]
                  hover:shadow-[0_0_4px_0_#B31B38_inset] transition-all duration-150"
              >
                <Image src="/icons/elite_Badge.png" alt="" width={32} height={35} />
                <span className="text-[14px] font-normal text-[#222222] flex-1 leading-tight">Upgrade to Elite</span>
                <span className="rounded-[41px] bg-[#B31B38] px-2.5 py-[3px] text-white text-[12px] font-normal shrink-0">
                  Upgrade
                </span>
              </Link>
            </div>
          ) : null}

          {/* Nav tabs section */}
          {/* <div className="px-3 pt-4 pb-1">
            <p className="px-2 pb-1.5 text-[10.5px] font-semibold text-[#BBBBBB] uppercase tracking-[0.08em]">
              Navigation
            </p>
            {NAV_TABS.map(({ labelKey, href, Icon }) => {
              const active = pathname.startsWith(href);
              const showDot = (labelKey === "Notifications" && hasUnread) || (labelKey === "Interested" && hasUnreadInterest);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobile}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] mb-0.5 transition-colors duration-150 ${active ? "bg-[#fdf0f2]" : "hover:bg-[#F7F7F7]"
                    }`}
                >
                  <div className="relative shrink-0">
                    <Icon
                      className="w-[18px] h-[18px]"
                      style={{ color: active ? "#B31B38" : "#888888" }}
                    />
                    {showDot && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#B31B38]" />}
                  </div>
                  <span
                    className={`text-[14px] leading-[150%] flex-1 ${active ? "text-[#222222] font-semibold" : "text-[#6B6B6B] font-normal"
                      }`}
                  >
                    {(labelKey) as string}
                  </span>
                  {active && <div className="w-[6px] h-[6px] rounded-full bg-[#B31B38] shrink-0" />}
                </Link>
              );
            })}
          </div> */}

          {/* Divider */}
          {/* <div className="mx-4 my-2 border-t border-[#F0F0F0]" /> */}

          {/* Account section — mirrors desktop dropdown items exactly */}
          <div className="px-3 pb-4 mt-3">
            <p className="px-2 pb-1.5 text-[10.5px] font-semibold text-[#BBBBBB] uppercase tracking-[0.08em]">
              Account
            </p>
            {[
              { text: "Complete / Edit profile", Icon: EditIcon, href: "/my-profile" },
              ...(trustBadge || isElite ? [] : [{ text: "Upgrade to Elite", Icon: EliteIcon, href: "/elite-upgrade" }]),
              {
                text: "Edit partner preference",
                Icon: HeartIcon,
                onClick: () => { closeMobile(); setOpenModal("edit"); },
              },
              { text: "Account settings", Icon: SettingIcon, href: "/account-settings" },
              {
                text: "Logout",
                Icon: LogoutIcon,
                onClick: () => { closeMobile(); setLogoutOpen(true); },
                danger: true,
              },
            ].map(({ text, Icon, href, onClick, danger }) =>
              href ? (
                <Link
                  key={text}
                  href={href}
                  onClick={closeMobile}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] mb-0.5 hover:bg-[#F7F7F7] transition-colors duration-150"
                >
                  <Icon className="w-[16px] h-[16px] shrink-0 text-[#525252]" />
                  <span className="text-[14px] font-normal text-[#222222] leading-[150%]">{text}</span>
                </Link>
              ) : (
                <button
                  key={text}
                  type="button"
                  onClick={onClick}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] mb-0.5 text-left transition-colors duration-150 ${danger ? "hover:bg-[#FFF0F2]" : "hover:bg-[#F7F7F7]"
                    }`}
                >
                  <Icon
                    className={`w-[16px] h-[16px] shrink-0 ${danger ? "text-[#B31B38]" : "text-[#525252]"}`}
                  />
                  <span
                    className={`text-[14px] font-normal leading-[150%] ${danger ? "text-[#B31B38]" : "text-[#222222]"
                      }`}
                  >
                    {text}
                  </span>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <PartnerPreferenceModal
        isOpen={openModal !== null}
        onClose={() => setOpenModal(null)}
        variant={openModal ?? "edit"}
      />

      <LogoutPopup isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </>
  );
}

// Note: breakpoint uses min-[900px] instead of md
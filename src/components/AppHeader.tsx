"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
import { getProgressWidth } from "../utils/getProgressWidth";
import PartnerPreferenceModal from "./app/PartnerPreferenceModal";
import LogoutPopup from "./app/LogoutPopup";

const trustBadge = false;
const isElite = false;

const NAV_TABS = [
  { labelKey: "Matches" as const, href: "/matches", Icon: MatchesIcon },
  { labelKey: "Notifications" as const, href: "/notifications", Icon: NotificationsIcon },
  { labelKey: "Shortlisted" as const, href: "/shortlisted", Icon: ShortlistedIcon },
  { labelKey: "Interested" as const, href: "/interested", Icon: InterestedIcon },
] as const;

export default function AppHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const photo = "/images/no_photo.png";
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [openModal, setOpenModal] = useState<null | "search" | "edit">(null);
  const [logoutOpen, setLogoutOpen] = useState(false);

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

  return (
    <>
      <header
        className="font-poppins select-none sticky top-0 z-50 w-full bg-white/60 backdrop-blur-sm"
      >
        <div className="max-w-[1920px] mx-auto flex px-5 lg:px-10 h-[74px] pt-5 gap-5 min-[900px]:gap-6">

          {/* Left: Logo + Search */}
          <div className="flex mb-2 items-center gap-2 lg:gap-3 flex-1 min-w-0">
            <Logo />
            <button
              type="button"
              onClick={() => { setSettingsOpen(false); setMobileOpen(false); setOpenModal("search"); }}
              className="flex items-center pr-4 pl-2 py-2 gap-2 rounded-[41px] bg-[#E0E0E0] cursor-pointer hover:bg-[#D4D4D4] transition-colors duration-150"
            >
              <SearchIcon className="w-5 md:w-5.3 lg:w-6 h-5 md:h-5.3 lg:h-6 text-[#525252]" />
              <span className="bg-transparent text-[14px] md:text-[15px] lg:text-[16px] font-normal text-[#4A4A4A]">
                Search
              </span>
            </button>
          </div>

          {/* Center: Nav tabs — desktop only */}
          <nav className="hidden min-[900px]:flex items-center gap-6 lg:gap-9 flex-1 mt-0 md:mt-2 lg:mt-0 justify-center">
            {NAV_TABS.map(({ labelKey, href, Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex flex-col items-center pb-1 gap-0.5 border-b-[2.4px] transition-colors duration-150 ${active ? "border-[#222222]" : "border-transparent"}`}
                >
                  <Icon className={`w-5 lg:w-6 h-5 lg:h-6 shrink-0 transition-colors duration-150 ${active ? "text-[#222222]" : "text-[#888888]"}`} />
                  <span className={`font-16 font-normal leading-[150%] transition-colors duration-150 ${active ? "text-dark" : "text-secondary"}`}>
                    {(labelKey) as string}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Profile + Settings (desktop) | Hamburger (mobile) */}
          <div className="flex items-center gap-3 flex-1 justify-end">

            {/* ── Desktop profile/settings button ── */}
            <div className="hidden min-[900px]:relative mb-2 min-[900px]:flex items-center">
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
                  <Image src={photo} fill className="object-cover" alt="my profile" sizes="32px" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                </div>
                <div className="flex flex-col gap-1">
                  {!trustBadge ? (
                    <>
                      <span className="font-14 font-semibold text-[#525252] leading-none">Profile points</span>
                      <div className="flex items-center gap-2">
                        <div className="w-[52px] h-2 bg-white rounded-[19px] overflow-hidden">
                          <div className="h-full bg-[#B31B38] rounded-[19px]" style={{ width: `${getProgressWidth(80)}%` }} />
                        </div>
                        <span className="font-16 font-normal text-[#B31B38] leading-none">80%</span>
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
                className={`absolute top-full right-0 mt-5 z-50 ${trustBadge && !isElite ? "w-[309px]" : "w-[270px]"} rounded-[16px] bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.08)] p-2 transition-all duration-200 ease-out origin-top-right ${
                  settingsOpen
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="flex flex-col items-start gap-2">
                  <div className="w-full">
                    <div className="overflow-hidden text-ellipsis text-dark font-18 font-medium leading-[150%]">username</div>
                    <div className="text-dark font-16 font-normal leading-[150%]">(IN247)</div>
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
                  <div className="w-full flex flex-col gap-2">
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

            {/* ── Hamburger button — mobile only (< 900px) ── */}
            <button
              onClick={() => { setSettingsOpen(false); setMobileOpen((v) => !v); }}
              className="min-[900px]:hidden flex flex-col justify-center cursor-pointer select-none gap-[5px] p-1 shrink-0"
              aria-label="Toggle menu"
            >
              <span
                className="block w-6 h-[2px] bg-[#222222] rounded"
                style={{
                  transition: "transform 0.25s cubic-bezier(.4,0,.2,1)",
                  transform: mobileOpen ? "translateY(7px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="block w-6 h-[2px] bg-[#222222] rounded"
                style={{
                  transition: "opacity 0.25s cubic-bezier(.4,0,.2,1)",
                  opacity: mobileOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-6 h-[2px] bg-[#222222] rounded"
                style={{
                  transition: "transform 0.25s cubic-bezier(.4,0,.2,1)",
                  transform: mobileOpen ? "translateY(-7px) rotate(-45deg)" : "none",
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        onClick={closeMobile}
        aria-hidden="true"
        className={`fixed inset-0 z-[55] bg-black/40 backdrop-blur-[2px] min-[900px]:hidden
          transition-opacity duration-300 ease-in-out
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full z-[60] w-[min(72vw,320px)] bg-white
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
              <Image src={photo} fill className="object-cover" alt="my profile" sizes="40px" />
            </div>
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-[#222222] leading-tight truncate">username</div>
              <div className="text-[13px] font-normal text-[#888888] leading-tight">(IN247)</div>
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
                <span className="text-[12px] font-semibold text-[#525252] uppercase tracking-wide">Profile points</span>
                <span className="text-[13px] font-semibold text-[#B31B38]">80%</span>
              </div>
              <div className="w-full h-2 bg-[#EBEBEB] rounded-[19px] overflow-hidden">
                <div
                  className="h-full bg-[#B31B38] rounded-[19px]"
                  style={{ width: `${getProgressWidth(80)}%` }}
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
          <div className="px-3 pt-4 pb-1">
            <p className="px-2 pb-1.5 text-[10.5px] font-semibold text-[#BBBBBB] uppercase tracking-[0.08em]">
              Navigation
            </p>
            {NAV_TABS.map(({ labelKey, href, Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobile}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] mb-0.5 transition-colors duration-150 ${
                    active ? "bg-[#fdf0f2]" : "hover:bg-[#F7F7F7]"
                  }`}
                >
                  <Icon
                    className="w-[18px] h-[18px] shrink-0"
                    style={{ color: active ? "#B31B38" : "#888888" }}
                  />
                  <span
                    className={`text-[14px] leading-[150%] flex-1 ${
                      active ? "text-[#222222] font-semibold" : "text-[#6B6B6B] font-normal"
                    }`}
                  >
                    {(labelKey) as string}
                  </span>
                  {active && <div className="w-[6px] h-[6px] rounded-full bg-[#B31B38] shrink-0" />}
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="mx-4 my-2 border-t border-[#F0F0F0]" />

          {/* Account section — mirrors desktop dropdown items exactly */}
          <div className="px-3 pb-4">
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
                onClick: () => { closeMobile(); },
                danger: true,
              onClick: () => { closeMobile(); setLogoutOpen(true); },
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] mb-0.5 text-left transition-colors duration-150 ${
                    danger ? "hover:bg-[#FFF0F2]" : "hover:bg-[#F7F7F7]"
                  }`}
                >
                  <Icon
                    className={`w-[16px] h-[16px] shrink-0 ${danger ? "text-[#B31B38]" : "text-[#525252]"}`}
                  />
                  <span
                    className={`text-[14px] font-normal leading-[150%] ${
                      danger ? "text-[#B31B38]" : "text-[#222222]"
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

      {/* Shared modal */}
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
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

  return (
    <header className="font-poppins select-none sticky top-0 z-50 w-full bg-white/60 backdrop-blur-sm"
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
            <SearchIcon
              className="w-5 md:w-5.3 lg:w-6 h-5 md:h-5.3 lg:h-6 text-[#525252]" />
            <span className="bg-transparent text-[14px] md:text-[15px] lg:text-[16px] font-normal text-[#4A4A4A]">
              Search
            </span>
          </button>
        </div>

        {/* Center: Nav tabs */}
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
                <span
                  className={`font-16 font-normal leading-[150%] transition-colors duration-150 ${active ? "text-dark" : "text-secondary"}`} >
                  {(labelKey) as string}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Profile + Settings | Hamburger (mobile) */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="hidden min-[900px]:relative mb-2 min-[900px]:flex items-center"
          >
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setSettingsOpen((v) => !v);
              }}
              className="cursor-pointer flex items-center py-1 pl-1 pr-2 rounded-[42px] bg-[#E0E0E0] hover:bg-[#D4D4D4] transition-colors duration-150 gap-2"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white bg-[#D9D9D9] relative">
                <Image
                  src={photo}
                  fill
                  className="object-cover"
                  alt="my profile"
                  sizes="32px"
                />
              </div>

              {/* Group */}
              <div className="flex flex-col gap-1">
                <span className="font-14 font-semibold text-[#525252] leading-none">
                  Profile points
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-[52px] h-2 bg-white rounded-[19px] overflow-hidden">
                    <div
                      className="h-full bg-[#B31B38] rounded-[19px]"
                      style={{ width: `${getProgressWidth(80)}%` }}
                    />
                  </div>
                  <span className="font-16 font-normal text-[#B31B38] leading-none">
                    80%
                  </span>
                </div>
              </div>
              <div className="w-px self-stretch bg-white mx-1 py-0.5" />
              <SettingsIcon className="w-6 h-6 text-[#525252]" />
            </button>

            {/* Setting modal  */}
            <div
              className={`absolute top-full right-0 mt-5 z-50 w-[264px] rounded-[16px] bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.08)] p-2 transition-all duration-200 ease-out origin-top-right ${settingsOpen
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
            >
              <div className="flex flex-col items-start gap-2">
                <div className="w-full">
                  <div className="overflow-hidden text-ellipsis text-dark font-18 font-medium leading-[150%]">
                    username
                  </div>
                  <div className="text-dark font-16 font-normal leading-[150%]">
                    (IN247)
                  </div>
                </div>

                <div className="h-px self-stretch bg-[#EAEAEA]" />

                <Link
                  href="/trust-batch"
                  onClick={() => setSettingsOpen(false)}
                  className="cursor-pointer w-full flex items-center gap-3 rounded-[8px] px-2 py-3 text-left bg-gradient-to-r from-[#FFE0C2] to-[#FFF2D9] hover:bg-[linear-gradient(0deg,rgba(255,255,255,0.30)_0%,rgba(255,255,255,0.30)_100%),linear-gradient(269deg,#FFE0C2_44.21%,#FFF2D9_98.97%)] hover:shadow-[0_0_4px_0_#B31B38_inset] transition-all duration-150"
                >
                  <Image src="/icons/trust_batch.png" alt="" width={37} height={40} />
                  <span className="text-dark font-16 font-normal leading-[150%]">
                    Get trust batch
                  </span>
                  <span className="ml-auto rounded-[41px] bg-[#B31B38] px-2 py-[2px] text-white font-poppins font-16 font-normal leading-[150%]">
                    Free
                  </span>
                </Link>

                <div className="w-full flex flex-col gap-2">
                  {[
                    { text: "Complete / Edit profile", Icon: EditIcon, href: "/account" },
                    { text: "Upgrade to Elite", Icon: EliteIcon, href: "/elite-upgrade" },
                    { text: "Edit partner preference", Icon: HeartIcon, onClick: () => { setSettingsOpen(false); setOpenModal("edit"); }, },
                    { text: "Account settings", Icon: SettingIcon, href: "/account-settings" },
                    { text: "Logout", Icon: LogoutIcon, onClick: () => { setSettingsOpen(false);
                        // setOpenModal("logout"); // your popup trigger
                      },},
                  ].map(({ text, Icon, href, onClick }) =>
                    href ? (
                      <Link
                        key={text}
                        href={href}
                        className="w-full flex items-center gap-3 rounded-[8px] px-2 py-1 hover:bg-[#EAEAEA] transition-colors duration-150"
                        onClick={() => setSettingsOpen(false)}
                      >
                        <Icon className="w-4 h-4 shrink-0 text-dark" />
                        <span className="text-dark font-16 font-normal leading-[150%]">
                          {text}
                        </span>
                      </Link>
                    ) : (
                      <button
                        key={text}
                        type="button"
                        onClick={onClick}
                        className="w-full flex items-center gap-3 rounded-[8px] px-2 py-1 text-left hover:bg-[#EAEAEA] transition-colors duration-150"
                      >
                        <Icon className="w-4 h-4 shrink-0 text-dark" />
                        <span className="text-dark font-16 font-normal leading-[150%]">
                          {text}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
            {/* //---------------------------------------// */}
          </div>
          {/* Hamburger — less than 900px */}
          <button
            onClick={() => {
              setSettingsOpen(false);
              setMobileOpen((v) => !v);
            }}
            className="min-[900px]:hidden flex flex-col justify-center cursor-pointer select-none gap-[5px] p-1 shrink-0"
            aria-label="Toggle menu"
          >
            <span
              className="block w-6 h-[2px] bg-[#222222] rounded"
              style={{ transition: "transform 0.2s", transform: mobileOpen ? "translateY(7px) rotate(45deg)" : "none" }}
            />
            <span
              className="block w-6 h-[2px] bg-[#222222] rounded"
              style={{ transition: "opacity 0.2s", opacity: mobileOpen ? 0 : 1 }}
            />
            <span
              className="block w-6 h-[2px] bg-[#222222] rounded"
              style={{ transition: "transform 0.2s", transform: mobileOpen ? "translateY(-7px) rotate(-45deg)" : "none" }}
            />
          </button>
        </div>
      </div>

      <PartnerPreferenceModal
        isOpen={openModal !== null}
        onClose={() => setOpenModal(null)}
        variant={openModal ?? "edit"}
      />

      {/* Mobile dropdown */}
      <div
        className={`fixed top-[74px] border-t border-[#EEE] left-0 right-0 z-50 bg-white shadow-lg flex flex-col p-4 gap-1 min-[900px]:hidden transition-all duration-300 ease-in-out 
          ${mobileOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"
          }`}
      >
        {NAV_TABS.map(({ labelKey, href, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-150 ${active ? "bg-[#fdf0f2]" : "hover:bg-[#fdf0f2]"
                }`}
            >
              <Icon
                className="w-5.5 h-5.5 shrink-0 transition-colors duration-150"
                style={{ color: active ? "#222222" : "#888888" }}
              />
              <span
                className={`text-[15px] leading-[150%] transition-colors duration-150 ${active ? "text-[#222222] font-medium" : "text-[#6B6B6B] font-normal"
                  }`}
              >
                {(labelKey) as string}
              </span>
              {active && <div className="ml-auto w-2 h-2 rounded-full bg-[#B31B38]" />}
            </Link>
          );
        })}

        <div className="my-1 border-t border-[#F0F0F0]" />
        <Link
          href="/settings"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6B6B6B] hover:bg-[#fdf0f2] transition-colors duration-150"
        >
          <SettingsIcon className="w-5.5 h-5.5 shrink-0 text-[#888888]" />
          <span className="text-[15px] font-normal leading-[150%]">Settings</span>
        </Link>
      </div>
    </header>
  );
}


// Note- breaking point instead of md I used min-[900px]

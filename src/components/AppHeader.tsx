"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Logo,
  SearchIcon,
  MatchesIcon,
  NotificationsIcon,
  ShortlistedIcon,
  InterestedIcon,
  ProfileIcon,
  SettingsIcon,
} from "../assets/Icons";
import { useLang } from "../context/LangContext";

const NAV_TABS = [
  { labelKey: "App_Matches" as const, href: "/matches", Icon: MatchesIcon },
  { labelKey: "App_Notifications" as const, href: "/notifications", Icon: NotificationsIcon },
  { labelKey: "App_Shortlisted" as const, href: "/shortlisted", Icon: ShortlistedIcon },
  { labelKey: "App_Interested" as const, href: "/interested", Icon: InterestedIcon },
] as const;

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLang();
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const q = searchValue.trim();
      if (q) {
        router.replace(`/matches?q=${encodeURIComponent(q)}`, { scroll: false });
      } else if (pathname === "/matches") {
        router.replace("/matches", { scroll: false });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue, pathname, router]);

  return (
    <header className="select-none sticky top-0 z-50 w-full bg-white/60 backdrop-blur-sm">
      <div className="max-w-[1920px] mx-auto flex px-5 lg:px-10 h-[74px] pt-5 gap-5 min-[840px]:gap-6">
        {/* Left: Logo + Search */}
        {/* <div className="flex items-center gap-2 lg:gap-3 flex-1 min-[840px]:flex-none mr-5 min-w-0"> */}
        <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">

          <Logo />
          <div
            className={`flex items-center flex-1 min-[840px]:flex-none min-w-[180px] min-[840px]:w-[200px] lg:w-[240px] pr-3 pl-2 py-2 gap-2 rounded-[41px] bg-[#E0E0E0] border-[1px] transition-colors duration-150 ${searchActive ? "border-[#B31B38]" : "border-transparent"
              }`}
          >
            <SearchIcon
              className={`w-5 min-[840px]:w-5.3 lg:w-6 h-5 min-[840px]:h-5.3 lg:h-6 shrink-0 transition-colors duration-150 ${searchActive ? "text-[#B31B38]" : "text-[#525252]"
                }`}
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchActive(true)}
              onBlur={() => setSearchActive(false)}
              placeholder={t("App_Search")}
              className="bg-transparent text-[14px] min-[840px]:text-[15px] lg:text-[16px] font-normal text-[#4A4A4A] font-poppins outline-none w-full min-w-0 placeholder:text-[#4A4A4A]"
            />
          </div>
        </div>

        {/* Center: Nav tabs — desktop only */}
        {/* <nav className="hidden min-[840px]:flex items-center gap-4 lg:gap-6 flex-1 min-w-0 justify-center"> */}
        <nav className="hidden min-[1146px]:flex items-center gap-9 flex-1 justify-center">
          {NAV_TABS.map(({ labelKey, href, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center pb-1 gap-0.5 border-b-[2.4px] transition-colors duration-150 ${active ? "border-[#222222]" : "border-transparent"
                  }`}
              >
                <Icon
                  className={`w-5 lg:w-6 h-5 lg:h-6 shrink-0 transition-colors duration-150 ${active ? "text-[#222222]" : "text-[#888888]"
                    }`}
                />
                <span
                  className={`font-poppins font-16 font-normal leading-[150%] transition-colors duration-150 ${active ? "text-dark" : "text-secondary"
                    }`}
                >
                  {t(labelKey)}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Profile + Settings (desktop) | Hamburger (mobile) */}
        {/* <div className="flex items-center gap-3 shrink-0 ml-5"> */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <Link
            href="/my-profile"
            aria-label={t("App_My_Profile")}
            className="hidden min-[1146px]:flex p-2 flex-col justify-center items-center rounded-[41px] bg-[#E0E0E0] hover:bg-[#D4D4D4] transition-colors duration-150"
          >
            <ProfileIcon className="w-5.3 lg:w-6 h-5.3 lg:h-6 shrink-0 text-[#525252]" />
          </Link>
          <Link
            href="/settings"
            aria-label={t("App_Settings")}
            className="hidden min-[1146px]:flex p-2 flex-col justify-center items-center rounded-[41px] bg-[#E0E0E0] hover:bg-[#D4D4D4] transition-colors duration-150"
          >
            <SettingsIcon className="w-5.3 lg:w-6 h-5.3 lg:h-6 shrink-0 text-[#525252]" />
          </Link>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="min-[1146px]:hidden flex flex-col justify-center cursor-pointer select-none gap-[5px] p-1 shrink-0"
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

      {/* Mobile dropdown */}
      <div
        className={`fixed top-[74px] border-t border-[#EEE] left-0 right-0 z-50 bg-white shadow-lg flex flex-col p-4 gap-1 min-[1146px]:hidden transition-all duration-300 ease-in-out 
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
                className={`font-poppins text-[15px] leading-[150%] transition-colors duration-150 ${active ? "text-[#222222] font-medium" : "text-[#6B6B6B] font-normal"
                  }`}
              >
                {t(labelKey)}
              </span>
              {active && <div className="ml-auto w-2 h-2 rounded-full bg-[#B31B38]" />}
            </Link>
          );
        })}

        <div className="my-1 border-t border-[#F0F0F0]" />

        <Link
          href="/my-profile"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6B6B6B] hover:bg-[#fdf0f2] transition-colors duration-150"
        >
          <ProfileIcon className="w-5.5 h-5.5 shrink-0 text-[#888888]" />
          <span className="font-poppins text-[15px] font-normal leading-[150%]">{t("App_My_Profile")}</span>
        </Link>
        <Link
          href="/settings"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6B6B6B] hover:bg-[#fdf0f2] transition-colors duration-150"
        >
          <SettingsIcon className="w-5.5 h-5.5 shrink-0 text-[#888888]" />
          <span className="font-poppins text-[15px] font-normal leading-[150%]">{t("App_Settings")}</span>
        </Link>
      </div>
    </header>
  );
}


// Note- breaking point instaed of md I used min-[840px]
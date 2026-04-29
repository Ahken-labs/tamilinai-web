"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MatchesIcon,
  NotificationsIcon,
  ShortlistedIcon,
  InterestedIcon,
  ProfileIcon,
} from "../../assets/Icons";

const NAV_ITEMS = [
  { label: "Matches", href: "/matches", Icon: MatchesIcon },
  { label: "Alerts", href: "/notifications", Icon: NotificationsIcon },
  { label: "Saved", href: "/shortlisted", Icon: ShortlistedIcon },
  { label: "Interested", href: "/interested", Icon: InterestedIcon },
  { label: "Me", href: "/my-profile", Icon: ProfileIcon },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white border-t border-[#E6E6E6]">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map(({ label, href, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors duration-150 ${
                active ? "text-[#222222]" : "text-[#888888]"
              }`}
            >
              <Icon className="w-6 h-6 shrink-0" />
              <span className="text-[10px] font-poppins font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

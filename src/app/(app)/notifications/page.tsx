"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRightIcon,
  EliteIcon,
  Logo,
} from "@/src/assets/Icons";
import { PhotoIcon } from "@heroicons/react/16/solid";
import { CgPhotoscan } from "react-icons/cg";
import { MdDiscount } from "react-icons/md";
import { getNotifications } from "../../../lib/api/notifications";
import type { AppNotification } from "../../../types/notification";

function getNotificationHref(type: string): string {
  if (type.startsWith("interest")) return "/interested";
  if (type.startsWith("photo")) return "/my-profile";
  if (type.startsWith("elite")) return "/settings";
  if (type === "trust_badge_reminder") return "/my-profile";
  if (type === "profile_viewed") return "/my-profile";
  return "/matches";
}

function getCtaLabel(type: string): string {
  if (type.startsWith("interest_received") || type === "interest_reminder") return "View";
  if (type === "interest_accepted") return "View match";
  if (type.startsWith("elite_expiring") || type === "elite_expired") return "Renew";
  if (type === "payment_success") return "View";
  if (type === "trust_badge_reminder") return "Complete profile";
  if (type === "profile_viewed") return "See viewers";
  return "View";
}

function getNotificationIcon(type: string) {
  if (type === "photo_access_accepted" || type === "photo_requested" || type === "photo_added") {
    return <PhotoIcon className="h-5 w-5 md:h-6 md:w-6" />;
  }
  if (type === "photo_request_declined") return <CgPhotoscan className="h-5 w-5 md:h-6 md:w-6" />;
  if (type === "promo") return <MdDiscount className="h-5 w-5 md:h-6 md:w-6" />;
  if (type.startsWith("elite")) return <EliteIcon className="h-5 w-5 md:h-6 md:w-6" />;
  return <Logo className="h-10 w-10 md:h-16 md:w-14" />;
}

function NotificationRow({ item }: { item: AppNotification }) {
  const href = getNotificationHref(item.type);
  const ctaLabel = getCtaLabel(item.type);

  return (
    <div className="flex items-center justify-between border-b gap-4 border-[#EAEAEA] bg-light px-4 py-3 sm:py-4 md:py-5 lg:py-6 md:px-4 rounded-[16px]">
      <div className="flex min-w-0 items-center gap-3 md:gap-4">
        {item.fromUser?.photoUrl ? (
          <Image
            src={item.fromUser.photoUrl}
            alt={item.fromUser.name}
            width={56}
            height={56}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            className="h-10 w-10 md:h-14 md:w-14 rounded-full object-cover bg-[#FFDED3] shrink-0"
          />
        ) : (
          <div className="flex h-10 w-10 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-full bg-[#FFDED3]">
            {getNotificationIcon(item.type)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="truncate text-dark font-18 font-medium leading-[150%]">
            {item.title}
          </div>
          {item.subtitle ? (
            <div className="mt-1 md:mt-1.5 truncate text-secondary3 font-16 font-normal leading-[150%]">
              {item.subtitle}
            </div>
          ) : null}
        </div>
      </div>

      <Link href={href} className="flex shrink-0 items-center gap-0.5 md:gap-1.5">
        {!item.isRead ? <div className="h-3 w-3 rounded-full bg-[#B31B38]" /> : <div className="h-3 w-3" />}
        <span className="text-primary font-16 font-normal leading-[150%]">{ctaLabel}</span>
        <ChevronRightIcon className="h-4 w-4 md:h-6 md:w-6 text-[#B31B38]" />
      </Link>
    </div>
  );
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getNotifications(1);
        setNotifications(res.notifications);
      } catch {
        setError("Failed to load notifications.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F5F2]">
      <div className="mx-auto flex max-w-[1024px] flex-col px-4 pt-[27px] pb-4 lg:px-8 gap-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[72px] rounded-[16px] bg-white animate-pulse" />
          ))
        ) : error ? (
          <p className="text-center py-12 text-[#B31B38]">{error}</p>
        ) : notifications.length === 0 ? (
          <p className="text-center py-12 text-[#888888]">No notifications yet.</p>
        ) : (
          notifications.map((item) => <NotificationRow key={item.id} item={item} />)
        )}
      </div>
    </main>
  );
}

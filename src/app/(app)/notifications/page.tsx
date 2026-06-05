"use client";

import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ProtectedImage from "../../../components/common-layout/ProtectedImage";
import {
  ChevronRightIcon,
  EliteCrownIcon,
  ProfileVerifiedBadgeIcon,
  CakeIcon,
  ProfileBoxIcon,
  NotifPhotoApprovedIcon,
  NotifPhotoSlashIcon,
  NotifPromoIcon,
  NotifPhotoViewIcon,
  NotifPhotoUploadIcon,
  NotifPhotoDeclinedIcon,
  NotifPhotoAddedIcon,
  NotifPaymentSuccessIcon,
  NotifPaymentFailedIcon,
  ProfileCompletionRequestIcon,
} from "@/src/assets/Icons";
import { getNotifications, markNotificationRead } from "../../../lib/api/notifications";
import { getProfilePhotoSrc } from "../../../utils/profilePhoto";
import { readMeCache } from "../../../components/AppHeader";
import type { AppNotification } from "../../../types/notification";
import NotificationSkeleton from "../../../components/app/skeleton-layout/NotificationSkeleton";

const SKELETON_COUNT = 5;

// Time helper

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
}

// CTA config per notification type

function getCtaConfig(type: string, fromUserId?: string): { label: string; href: string } {
  const profileHref = fromUserId ? `/user-profile?id=${fromUserId}` : "/matches";
  switch (type) {
    case "welcome":               return { label: "View",              href: "/matches" };
    case "photo_under_review":    return { label: "My profile",        href: "/my-profile" };
    case "photo_approved":        return { label: "See matches",       href: "/matches" };
    case "photo_rejected":        return { label: "Upload photo",      href: "/my-profile" };
    case "trust_badge_reminder":  return { label: "Complete",          href: "/my-profile" };
    case "photo_access_accepted": return { label: "View photo",        href: profileHref };
    case "photo_access_declined": return { label: "View profile",      href: profileHref };
    case "photo_access_requested":return { label: "Review request",    href: profileHref };
    case "photo_requested":       return { label: "Upload photo",      href: profileHref };
    case "photo_added":           return { label: "View photo",        href: profileHref };
    case "photo_request_declined":return { label: "View profile",      href: profileHref };
    case "payment_failed":        return { label: "Retry payment",     href: "/elite-upgrade" };
    case "payment_success":       return { label: "Explore features",  href: "/matches" };
    case "interest_received":     return { label: "View",              href: "/interested" };
    case "interest_accepted":     return { label: "View match",        href: "/interested" };
    case "interest_declined":     return { label: "View",              href: "/interested" };
    case "interest_reminder":     return { label: "Send Reminder",     href: profileHref };
    case "elite_expiring_7d":
    case "elite_expiring_3d":
    case "elite_expired":         return { label: "Renew",             href: "/elite-upgrade" };
    case "promo":                 return { label: "Claim offer",       href: "/elite-upgrade" };
    case "profile_viewed":        return { label: "See all viewers",   href: "/my-profile" };
    case "profile_completion_request": return { label: "Update profile", href: "/my-profile" };
    case "birthday":              return { label: "View matches",      href: "/matches" };
    default:                      return { label: "View",              href: "/matches" };
  }
}

// Avatar

const ICON_CLS = "h-5 w-5 md:h-6 md:w-6 text-[#B31B38]";

function NotifIcon({ type }: { type: string }) {
  switch (type) {
    case "trust_badge_reminder":  return <ProfileVerifiedBadgeIcon className="h-5 w-5 md:h-6 md:w-6" />;
    case "photo_access_accepted": return <NotifPhotoApprovedIcon className={ICON_CLS} />;
    case "photo_access_declined": return <NotifPhotoSlashIcon className={ICON_CLS} />;
    case "photo_access_requested":return <NotifPhotoViewIcon className={ICON_CLS} />;
    case "photo_requested":       return <NotifPhotoUploadIcon className={ICON_CLS} />;
    case "photo_request_declined":return <NotifPhotoDeclinedIcon className={ICON_CLS} />;
    case "photo_added":           return <NotifPhotoAddedIcon className={ICON_CLS} />;
    case "payment_success":       return <NotifPaymentSuccessIcon className={ICON_CLS} />;
    case "payment_failed":        return <NotifPaymentFailedIcon className={ICON_CLS} />;
    case "promo":                 return <NotifPromoIcon className={ICON_CLS} />;
    case "birthday":              return <CakeIcon className={ICON_CLS} />;
    case "profile_viewed":        return <ProfileBoxIcon className={ICON_CLS} />;
    case "profile_completion_request": return <ProfileCompletionRequestIcon className={ICON_CLS} />;
    default:
      if (type.startsWith("elite")) return <EliteCrownIcon className="h-5 w-5 md:h-6 md:w-6 text-[#A97216]" />;
      return null;
  }
}

function NotifAvatar({ item }: { item: AppNotification }) {
  const me = readMeCache();

  if (item.type === "welcome") {
    return (
      <div
        className="pt-[7.8px] pr-[10.6px] pb-[10.6px] pl-[7.8px] md:pt-[9.8px] md:pr-[12.6px] md:pb-[12.6px] md:pl-[9.8px] h-10 w-10 md:h-14 md:w-14 shrink-0 rounded-[28px] bg-[#B31B41] flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34" fill="none" className="w-[21.5px] h-[21.5px] md:w-[33.6px] md:h-[33.6px]">
          <path d="M32.7319 6.74179C32.1758 5.42711 31.3801 4.2465 30.3668 3.2332C29.3535 2.22017 28.1732 1.42444 26.8582 0.868349C25.4963 0.29215 24.0504 0 22.5609 0C21.0714 0 19.6254 0.29215 18.2633 0.868349C16.9486 1.42444 15.7683 2.22017 14.755 3.2332C13.7416 4.2465 12.9459 5.42711 12.3898 6.74179C11.8136 8.10394 11.5215 9.54961 11.5215 11.0394V11.5215H11.0394C9.54988 11.5215 8.10394 11.8136 6.74179 12.3895C5.42711 12.9456 4.24678 13.7416 3.23348 14.7547C2.22017 15.768 1.42444 16.9486 0.868349 18.2633C0.29215 19.6254 0 21.0711 0 22.5606C0 24.0501 0.29215 25.4961 0.868349 26.8582C1.42444 28.1729 2.22017 29.3535 3.23348 30.3668C4.24678 31.3798 5.42711 32.1756 6.74179 32.7317C8.10394 33.3078 9.54988 33.6 11.0394 33.6H30.7651C32.1331 33.6 33.2777 32.6264 33.5425 31.3357C33.552 31.2896 33.5601 31.2433 33.5673 31.1963C33.5746 31.1494 33.5804 31.1022 33.5855 31.0544C33.5952 30.9595 33.6 30.8628 33.6 30.7651V11.0394C33.6 9.54961 33.3078 8.10394 32.7319 6.74179ZM11.0394 30.1646C6.84652 30.1646 3.43541 26.7535 3.43541 22.5606C3.43541 18.3677 6.84652 14.9569 11.0394 14.9569H11.5215V26.4155C11.5215 27.3936 11.7212 28.3427 12.1153 29.2365C12.2574 29.5588 12.4222 29.8685 12.6094 30.1646H11.0394ZM23.0438 26.4155C23.0438 28.4829 21.2585 30.1646 19.0637 30.1646H18.9369C16.7425 30.1646 14.9569 28.379 14.9569 26.1845V14.9569H23.0438V26.4155ZM30.1646 30.1646H25.3916C25.5785 29.8685 25.7435 29.5588 25.8857 29.2365C26.2795 28.3427 26.4792 27.3936 26.4792 26.4155V14.9678C28.5368 15.1192 30.1646 16.8413 30.1646 18.9369V30.1646ZM30.1646 12.6772C29.0675 11.9765 27.8042 11.579 26.4792 11.5276V10.9763C26.4792 10.4048 26.3895 9.84064 26.213 9.29935L26.2035 9.30242C25.7041 7.76766 24.2599 6.6552 22.5609 6.6552C20.4491 6.6552 18.7311 8.37319 18.7311 10.485C18.7311 10.8442 18.7808 11.1916 18.8738 11.5215H14.9569V11.0394C14.9569 6.84652 18.368 3.43541 22.5609 3.43541C26.7538 3.43541 30.1646 6.84652 30.1646 11.0394V12.6772Z" fill="white"/>
        </svg>
      </div>
    );
  }

  if (item.type === "photo_under_review" || item.type === "photo_approved") {
    const src = getProfilePhotoSrc(me?.profile?.photoUrl, "approved", me?.gender, true);
    return (
      <ProtectedImage
        src={src}
        alt="Your photo"
        width={56}
        height={56}
        className="h-10 w-10 md:h-14 md:w-14 shrink-0 rounded-full object-cover bg-[#FFDED3]"
      />
    );
  }

  if (item.type === "photo_rejected") {
    const placeholder = me?.gender === "male" ? "/images/no_photo_male.png" : "/images/no_photo.png";
    return (
      <ProtectedImage
        src={placeholder}
        alt="Photo"
        width={56}
        height={56}
        className="h-10 w-10 md:h-14 md:w-14 shrink-0 rounded-full object-cover bg-[#FFDED3]"
        style={{ filter: "blur(4.75px)" }}
      />
    );
  }

  if (item.fromUser && item.type !== "profile_completion_request") {
    const photoSrc = item.fromUser.photoUrl
      ?? (item.fromUser.gender === "male" ? "/images/no_photo_male.png" : "/images/no_photo.png");
    return (
      <ProtectedImage
        src={photoSrc}
        alt={item.fromUser.name ?? ""}
        width={56}
        height={56}
        className="h-10 w-10 md:h-14 md:w-14 shrink-0 rounded-full object-cover bg-[#FFDED3]"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-full bg-[#FFDED3]">
      <NotifIcon type={item.type} />
    </div>
  );
}

// Row

function NotificationRow({
  item,
  onRead,
}: {
  item: AppNotification;
  onRead: (id: string) => void;
}) {
  const router = useRouter();
  const { label, href } = getCtaConfig(item.type, item.fromUser?.id);

  function markRead() {
    if (!item.isRead) onRead(item.id);
  }

  function navigate() {
    markRead();
    router.push(href);
  }

  return (
    <div
      className="select-none font-poppins flex items-center justify-between border-b gap-4 border-[#EAEAEA] bg-light max-[370px]:px-2 px-4 py-3 sm:py-4 md:py-5 lg:py-6 md:px-4 rounded-[16px] cursor-pointer"
      onClick={navigate}
    >
      <div className="flex min-w-0 items-center gap-3 md:gap-4 flex-1">
        <div className="shrink-0">
          <NotifAvatar item={item} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-dark text-[14px] sm:text-[16px] md:text-[18px] font-medium leading-[150%]">
            {item.title}
          </div>
          <div className="mt-1 md:mt-1.5 md:line-clamp-2 text-secondary3 font-16 font-normal leading-[150%]">
            {item.type === "welcome"
              ? item.subtitle
              : item.subtitle
                ? `${item.subtitle} • ${timeAgo(item.createdAt)}`
                : timeAgo(item.createdAt)}
          </div>
          {/* CTA below text on mobile */}
          <button
            onClick={(e) => e.stopPropagation()}
            className="sm:hidden max-[370px]:mt-0.5 mt-2 flex cursor-pointer items-center gap-0.5"
          >
            {!item.isRead ? <div className="h-2 w-2 rounded-full bg-[#B31B38]" /> : <div className="h-0 md:h-2 w-0 md:w-2" />}
            <span className="font-poppins text-primary font-16 font-normal mb-0.5 leading-[150%] whitespace-nowrap">
              {label}
            </span>
            <ChevronRightIcon className="h-4 w-4 text-[#B31B38]" />
          </button>
        </div>
      </div>

      {/* CTA on right on sm+ */}
      <button
        onClick={(e) => e.stopPropagation()}
        className="hidden sm:flex shrink-0 cursor-pointer items-center gap-0.5 md:gap-1.5"
      >
        {!item.isRead ? <div className="h-2 md:h-3 w-2 md:w-3 rounded-full bg-[#B31B38]" /> : <div className="h-2 md:h-3 w-2 md:w-3" />}
        <span className="font-poppins text-primary font-16 font-normal mb-0.5 leading-[150%] whitespace-nowrap">
          {label}
        </span>
        <ChevronRightIcon className="h-4 w-4 md:h-6 md:w-6 text-[#B31B38]" />
      </button>
    </div>
  );
}

// Page 
export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const isBackgroundFetching = isFetching && !isLoading;

  // SSE lives in AppHeader (always connected) — no duplicate connection needed here

  function handleRead(id: string) {
    queryClient.setQueryData<AppNotification[]>(["notifications"], (old) =>
      old?.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    markNotificationRead(id).catch(() => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });
    // Sync unread dot in other open tabs
    try {
      const ch = new BroadcastChannel("inai_notifications");
      ch.postMessage({ type: "notifications_read" });
      ch.close();
    } catch { /* unsupported */ }
  }

  return (
    <main className="font-poppins min-h-screen bg-[#F8F5F2]">
      <div className="mx-auto flex max-w-[1024px] flex-col gap-3 max-[370px]:px-2 px-4 max-[500px]:pt-5 pt-[27px] pb-10 lg:px-8">
        {isLoading ? (
          Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <NotificationSkeleton key={i} />
          ))
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-poppins text-[16px] font-medium text-[#B31B38]">
              Failed to load notifications. Please try again.
            </p>
          </div>
        ) : !data || data.filter((n) => !n.type.startsWith("interest")).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-poppins text-[16px] font-semibold text-[#444444]">
              No notifications yet
            </p>
            <p className="mt-2 font-poppins text-[14px] font-normal text-[#888888] max-w-[320px]">
              You&apos;ll see updates here when your photo is reviewed, someone views your profile, or your payment status changes.
            </p>
          </div>
        ) : (
          <div className={isBackgroundFetching ? "opacity-60 pointer-events-none transition-opacity" : ""}>
            {data
              .filter((n) => !n.type.startsWith("interest") || n.type === "interest_reminder")
              .map((item) => (
                <NotificationRow key={item.id} item={item} onRead={handleRead} />
              ))}
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ProtectedPhoto from "../common-layout/ProtectedPhoto";
import { getCachedPhoto, setCachedPhoto } from "../../utils/othersPhotoCache";
import { useRouter } from "next/navigation";
import { Profile } from "../../types/profile";
import {
  ProfileVerifiedBadgeIcon,
  EliteCrownIcon,
  CakeIcon,
  LocationPinIcon,
  EducationCapIcon,
  MapRegionIcon,
  WorkBriefcaseIcon,
  ReligionSparkleIcon,
  HeightRulerIcon,
  CasteCircleIcon,
  ShortlistIcon,
  ShortlistRemoveIcon,
  SendInterestMsgIcon,
  ViewedIcon,
  ShieldLockIcon,
} from "../../assets/Icons";
import Button from "../common-layout/Button";
import { shortlistProfile, unshortlistProfile } from "../../lib/api/profiles";
import { sendInterest } from "../../lib/api/interests";
import { ApiError } from "../../lib/api/client";

interface ProfileCardProps {
  profile: Profile;
  onUnshortlist?: () => void;
  onInterestSent?: () => void;
}

function getTags(profile: Profile): Array<{ label: string; type: "elite" | "viewed" | "new" }> {
  const tags: Array<{ label: string; type: "elite" | "viewed" | "new" }> = [];
  if (profile.isElite) tags.push({ label: "Elite", type: "elite" });
  if (profile.isViewed) tags.push({ label: "Viewed", type: "viewed" });
  if (profile.isNew) tags.push({ label: "New", type: "new" });
  return tags.slice(0, 2);
}

const TAG_STYLES: Record<string, string> = {
  elite: "bg-[#FFDED3] text-[#A97216]",
  viewed: "bg-[#EDEDED] text-[#222222]",
  new: "bg-[#D5ECFF] text-[#5D5D5D]",
};

export default function ProfileCard({ profile, onUnshortlist, onInterestSent }: ProfileCardProps) {
  const router = useRouter();
  const [shortlisted, setShortlisted] = useState(profile.isShortlisted ?? false);
  const [shortlistPending, setShortlistPending] = useState(false);
  const [interestSent, setInterestSent] = useState(
    () => profile.interestStatus === "sent" || profile.interestStatus === "accepted"
  );
  const [interestPending, setInterestPending] = useState(false);
  const tags = getTags(profile);

  const placeholder = profile.gender === "male" ? "/images/no_photo_male.png" : "/images/no_photo.png";

  // Cache other user's photo in sessionStorage — cleared on logout
  const [photoSrc, setPhotoSrc] = useState<string>(() => {
    if (profile.isPrivate || !profile.photo) return placeholder;
    return getCachedPhoto(profile.id) ?? profile.photo;
  });

  useEffect(() => {
    if (!profile.isPrivate && profile.photo) {
      const cached = getCachedPhoto(profile.id);
      if (!cached) setCachedPhoto(profile.id, profile.photo);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhotoSrc(cached ?? profile.photo);
    }
  }, [profile.id, profile.photo, profile.isPrivate]);

  async function handleShortlist() {
    if (shortlistPending) return;
    const next = !shortlisted;
    setShortlisted(next); // optimistic
    setShortlistPending(true);
    try {
      if (next) {
        await shortlistProfile(profile.id);
      } else {
        await unshortlistProfile(profile.id);
        onUnshortlist?.();
      }
    } catch {
      setShortlisted(!next); // revert on error
    } finally {
      setShortlistPending(false);
    }
  }

  async function handleSendInterest() {
    if (interestPending || interestSent) return;
    setInterestPending(true);
    try {
      await sendInterest(profile.id);
      setInterestSent(true);
      onInterestSent?.();
    } catch (err) {
      // 409 = already sent — treat as success so button locks
      if (err instanceof ApiError && err.status === 409) { setInterestSent(true); onInterestSent?.(); }
    } finally {
      setInterestPending(false);
    }
  }

  const detailRows = [
    [
      { Icon: CakeIcon, value: `${profile.age} yrs` },
      { Icon: LocationPinIcon, value: profile.location },
    ],
    [
      { Icon: EducationCapIcon, value: profile.education },
      { Icon: MapRegionIcon, value: profile.country },
    ],
    [
      { Icon: WorkBriefcaseIcon, value: profile.work },
      { Icon: ReligionSparkleIcon, value: profile.religion },
    ],
    [
      { Icon: HeightRulerIcon, value: profile.height },
      { Icon: CasteCircleIcon, value: profile.caste },
    ],
  ];

  return (
    <div className={`w-full select-none max-w-[944px] p-4 mx-auto rounded-[32px] bg-white
      ${profile.isElite ? "shadow-[0_4px_40px_0_rgba(255,140,60,0.18)]" : "shadow-none"} overflow-hidden`}>
      <div className="flex flex-col min-[840px]:flex-row">
        {/* Photo */}
        <div className="relative w-full min-[840px]:w-[220px] md:min-w-[220px] h-[240px] md:h-[263px] lg:h-[293.33px] rounded-[16px] overflow-hidden bg-[#DBDBDB]/20">
          {profile.photo && !profile.isPrivate ? (
            <ProtectedPhoto
              src={photoSrc}
              alt={profile.name}
              fill
              className="object-cover"
              sizes="(max-width: 840px) 100vw, 220px"
            />
          ) : (
            <Image
              src={placeholder}
              alt={profile.name}
              fill
              className="object-cover"
              sizes="(max-width: 840px) 100vw, 220px"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          )}
          {(!profile.photo || profile.isPrivate) && (
            <>
              <div
                className="absolute bottom-0 left-0 right-0 h-[25%] pointer-events-none"
                style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.00) 0%, #FFF 80%)" }}
              />
              <div className="absolute bottom-2.5 left-0 right-0 flex justify-center">
                {profile.isPrivate ? (
                  <ShieldLockIcon />
                ) : (
                  <span className="flex items-center px-3 py-[2px] rounded-[38px] bg-white font-poppins font-16 font-normal leading-[150%] text-[#5D5D5D]">
                    No photo
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 ml-0 min-[840px]:ml-5 pt-5 min-[840px]:pt-0 min-w-0">
          {/* Name + badge + tags */}
          <div className="flex justify-between flex-wrap items-center gap-2">
            <h2 className="font-poppins flex gap-2 text-[14px] sm:text-[15px] md:text-[17px] lg:text-[18px] font-semibold text-dark leading-tight">
              {profile.name}
              {profile.isVerified && (
                <ProfileVerifiedBadgeIcon className="w-4 md:w-5 h-4 md:h-5 shrink-0" />
              )}
            </h2>
            <div className="flex gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.type}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full font-16 font-poppins font-medium leading-none ${TAG_STYLES[tag.type]}`}
                >
                  {tag.type === "elite" && <EliteCrownIcon className="w-3.5 h-3.5 shrink-0" />}
                  {tag.type === "viewed" && <ViewedIcon />}
                  {tag.label}
                </span>
              ))}
            </div>
          </div>

          {/* ID */}
          <p className="mt-[3px] font-poppins font-16 text-[#888888] font-normal">
            ID: {profile.displayId}
          </p>

          {/* Divider */}
          <div className="mt-3 md:mt-4 mb-4 md:mb-5 border-t border-[#EBEBEB]" />

          {/* Detail rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 md:gap-y-3">
            {detailRows.map((row, ri) =>
              row.map(({ Icon, value }, ci) => (
                <div key={`${ri}-${ci}`} className="flex items-center gap-3 md:gap-4 min-w-0">
                  <Icon className="w-4 md:w-5 h-4 md:h-5 shrink-0 text-[#222222]" />
                  <span className="font-poppins font-16 min-[840px]:text-[14px] text-[#6B6B6B] truncate">
                    {value}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-5 md:mt-6">
            <Button
              className="basis-full [@media(min-width:450px)]:basis-[calc(50%-0.375rem)] [@media(min-width:690px)]:basis-[calc(33.333%-0.5rem)] [@media(min-width:838px)]:basis-[calc(50%-0.375rem)] [@media(min-width:940px)]:basis-[calc(33.333%-0.5rem)]"
              text="View Full Profile"
              onPress={() => router.push(`/user-profile?id=${profile.id}`)}
            />
            <Button
              onPress={handleShortlist}
              className="basis-full flex-1 [@media(min-width:450px)]:basis-[calc(50%-0.375rem)] [@media(min-width:690px)]:basis-[calc(33.333%-0.5rem)] [@media(min-width:838px)]:basis-[calc(50%-0.375rem)] [@media(min-width:940px)]:basis-[calc(33.333%-0.5rem)] !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]"
              text={shortlisted ? "Remove" : "Shortlist"}
              iconLeft={
                shortlisted ? (
                  <ShortlistRemoveIcon className="w-4 h-4 shrink-0" />
                ) : (
                  <ShortlistIcon className="w-4 h-4 shrink-0" />
                )
              }
            />
            <Button
              onPress={handleSendInterest}
              className="basis-full flex-1 [@media(min-width:450px)]:basis-[calc(50%-0.375rem)] [@media(min-width:690px)]:basis-[calc(33.333%-0.5rem)] [@media(min-width:838px)]:basis-full [@media(min-width:940px)]:basis-[calc(33.333%-0.5rem)] !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE] disabled:opacity-50"
              text={
                profile.interestStatus === "accepted" ? "Connected"
                : interestSent ? "Interest Sent"
                : interestPending ? "Sending..."
                : "Send Interest"
              }
              iconLeft={<SendInterestMsgIcon className="w-4 h-4 shrink-0" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

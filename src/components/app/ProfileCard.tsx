"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ProtectedPhoto from "../common-layout/ProtectedPhoto";
import ProtectedImage from "../common-layout/ProtectedImage";
import { useRouter } from "next/navigation";
import { Profile } from "../../types/profile";
import {
  ProfileVerifiedBadgeIcon,
  EliteCrownIcon, EliteProIcon, EliteVIPIcon,
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
import EliteUpgradePopup from "../ui/EliteUpgradePopup";
import { shortlistProfile, unshortlistProfile } from "../../lib/api/profiles";
import { sendInterest } from "../../lib/api/interests";
import { ApiError } from "../../lib/api/client";
import { readMeCache } from "../AppHeader";
import { useToast } from "../ui/Toast";

interface ProfileCardProps {
  profile: Profile;
  onUnshortlist?: () => void;
  onInterestSent?: () => void;
}

const ELITE_PLAN_UI: Record<string, { label: string; bg: string; color: string; iconFill: string; Icon: React.ComponentType<{ className?: string; fill?: string }> }> = {
  basic: { label: "Elite basic", bg: "#FFDED3", color: "#725E4C", iconFill: "#725E4C", Icon: EliteCrownIcon },
  pro:   { label: "Elite pro",   bg: "#FFDED3", color: "#B31B38", iconFill: "#B31B38", Icon: EliteProIcon },
  max:   { label: "Elite VIP",   bg: "#222222", color: "#FFDED3", iconFill: "#FFDED3", Icon: EliteVIPIcon },
};

function getElitePlanUI(planKey?: string | null) {
  return ELITE_PLAN_UI[planKey ?? ""] ?? ELITE_PLAN_UI.basic;
}

function getTags(profile: Profile): Array<{ label: string; type: "elite" | "viewed" | "new" }> {
  const tags: Array<{ label: string; type: "elite" | "viewed" | "new" }> = [];
  if (profile.isElite) tags.push({ label: getElitePlanUI(profile.elitePlanKey).label, type: "elite" });
  if (profile.isViewed) tags.push({ label: "Viewed", type: "viewed" });
  if (profile.isNew) tags.push({ label: "New", type: "new" });
  return tags.slice(0, 2);
}

const TAG_STYLES: Record<string, string> = {
  viewed: "bg-[#EDEDED] text-[#222222]",
  new: "bg-[#D5ECFF] text-[#5D5D5D]",
};

export default function ProfileCard({ profile, onUnshortlist, onInterestSent }: ProfileCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [shortlisted, setShortlisted] = useState(profile.isShortlisted ?? false);
  const [shortlistPending, setShortlistPending] = useState(false);
  const [interestSent, setInterestSent] = useState(
    () => profile.interestStatus === "sent" || profile.interestStatus === "accepted"
  );
  const [mutualMatch, setMutualMatch] = useState(
    () => profile.interestStatus === "accepted"
  );
  const [interestPending, setInterestPending] = useState(false);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const tags = getTags(profile);
  const viewerIsElite = readMeCache()?.isElite ?? false;

  const placeholder = profile.gender === "male" ? "/images/no_photo_male.png" : "/images/no_photo.png";
  const photoSrc = profile.isPrivate || !profile.photo ? placeholder : profile.photo;

  async function handleShortlist() {
    if (shortlistPending) return;
    const next = !shortlisted;
    setShortlisted(next); // optimistic
    setShortlistPending(true);
    try {
      if (next) {
        await shortlistProfile(profile.id);
        queryClient.invalidateQueries({ queryKey: ["shortlisted"] });
        toast({ type: "success", title: "Added to shortlist", message: `${profile.name} has been shortlisted.` });
      } else {
        await unshortlistProfile(profile.id);
        queryClient.invalidateQueries({ queryKey: ["shortlisted"] });
        onUnshortlist?.();
        toast({ type: "neutral", title: "Removed from shortlist", message: `${profile.name} has been removed.` });
      }
    } catch {
      setShortlisted(!next); // revert on error
    } finally {
      setShortlistPending(false);
    }
  }

  async function handleSendInterest() {
    if (interestPending) return;
    if (mutualMatch) {
      toast({ type: "success", title: "Already connected 🎉", message: `You and ${profile.name} are matched.` });
      return;
    }
    if (interestSent) {
      toast({ type: "neutral", title: "Interest already sent", message: "Wait for their response." });
      return;
    }
    setInterestPending(true);
    try {
      const res = await sendInterest(profile.id);
      setInterestSent(true);
      if (res.message?.includes('Mutual')) {
        setMutualMatch(true);
        toast({ type: "success", title: "It's a match! 🎉", message: `${profile.name} already sent you interest.` });
      } else {
        toast({ type: "success", title: "Interest sent!", message: `${profile.name} will be notified.` });
      }
      queryClient.invalidateQueries({ queryKey: ["interests"] });
      onInterestSent?.();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) { setInterestSent(true); onInterestSent?.(); }
      else if (err instanceof ApiError && err.status === 403 && !viewerIsElite) { setShowLimitPopup(true); }
    } finally {
      setInterestPending(false);
    }
  }

  const detailRows = [
    [
      { Icon: CakeIcon, value: profile.age > 0 ? `${profile.age} yrs` : "Age not specified" },
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
    <div className={`w-full select-none max-w-[944px] p-2 md:p-4 mx-auto rounded-[24px] md:rounded-[32px] bg-white mb-4 md:mb-6
      ${profile.isElite ? "shadow-[0_4px_40px_0_rgba(255,140,60,0.18)]" : "shadow-none"} overflow-hidden`}>

      {/* ── Top row: image + name/id/tags ── */}
      <div className="flex flex-row items-center min-[600px]:items-start">
        {/* Photo */}
        <div className="relative shrink-0 w-[80px] h-[106.665px] min-[600px]:w-[155.76px] min-[600px]:h-[207.68px] min-[840px]:w-[220px] min-[840px]:h-[293.33px] rounded-[16px] overflow-hidden bg-[#DBDBDB]/20 transition-all duration-300">
          {profile.photo && !profile.isPrivate ? (
            <ProtectedPhoto
              src={photoSrc}
              alt={profile.name}
              fill
              className="object-cover"
              sizes="(max-width: 840px) 80px, 220px"
            />
          ) : (
            <ProtectedImage
              src={placeholder}
              alt={profile.name}
              fill
              className="object-cover"
              sizes="(max-width: 840px) 80px, 220px"
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
                  <span className="hidden min-[600px]:flex items-center px-3 py-[2px] rounded-[38px] bg-white font-poppins font-16 font-normal leading-[150%] text-[#5D5D5D]">
                    No photo
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Name / ID / Tags */}
        <div className="flex-1 ml-3 min-[840px]:ml-5 lg:ml-8 min-w-0">
          {/* Name + verified badge */}
          <div className="flex justify-between flex-wrap items-center gap-1 sm:gap-2">
            <h2 className="font-poppins flex gap-2 items-center text-[16px] sm:text-[17px] md:text-[18px] font-medium text-dark leading-tight">
              {profile.name}
              {profile.isVerified && (
                <ProfileVerifiedBadgeIcon className="w-4 md:w-6 h-4 md:h-6 shrink-0" />
              )}
            </h2>
            {/* Tags — desktop: beside name */}
            <div className="hidden min-[840px]:flex gap-2">
              {tags.map((tag) => {
                const eliteUi = tag.type === "elite" ? getElitePlanUI(profile.elitePlanKey) : null;
                return (
                  <span
                    key={tag.type}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-[14px] md:text-[16px] font-poppins font-medium leading-none ${TAG_STYLES[tag.type] ?? ""}`}
                    style={eliteUi ? { background: eliteUi.bg, color: eliteUi.color } : undefined}
                  >
                    {tag.type === "elite" && eliteUi && <eliteUi.Icon className="w-4 md:w-5 h-4 md:h-5 shrink-0" fill={eliteUi.iconFill} />}
                    {tag.type === "viewed" && <ViewedIcon />}
                    {tag.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* ID */}
          <p className="md:mt-[3px] font-poppins text-[14px] md:text-[16px] text-dark font-normal">
            ID: {profile.displayId}
          </p>

          {/* Tags — mobile: below ID */}
          {tags.length > 0 && (
            <div className="flex gap-2 mt-2 min-[840px]:hidden flex-wrap">
              {tags.map((tag) => {
                const eliteUi = tag.type === "elite" ? getElitePlanUI(profile.elitePlanKey) : null;
                return (
                  <span
                    key={tag.type}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-[14px] md:text-[16px] font-poppins font-medium leading-none ${TAG_STYLES[tag.type] ?? ""}`}
                    style={eliteUi ? { background: eliteUi.bg, color: eliteUi.color } : undefined}
                  >
                    {tag.type === "elite" && eliteUi && <eliteUi.Icon className="w-4 md:w-5 h-4 md:h-5 shrink-0" fill={eliteUi.iconFill} />}
                    {tag.type === "viewed" && <ViewedIcon />}
                    {tag.label}
                  </span>
                );
              })}
            </div>
          )}

          {/* 600px+: detail rows in right column (buttons stay at bottom) */}
          <div className="hidden min-[600px]:block">
            <div className="mt-3 mb-4 border-t border-[#EBEBEB]" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 md:gap-y-3">
              {detailRows.map((row, ri) =>
                row.map(({ Icon, value }, ci) => (
                  <div key={`${ri}-${ci}`} className="flex items-center gap-3 md:gap-4 min-w-0">
                    <Icon className="w-4 md:w-5 h-4 md:h-5 shrink-0 text-[#222222]" />
                    <span className="font-poppins text-[14px] md:text-[16px] text-[#6B6B6B] truncate">{value}</span>
                  </div>
                ))
              )}
            </div>
            {/* Desktop 840px+: buttons inside right column */}
            <div className="hidden min-[840px]:flex gap-3 mt-5 md:mt-6">
              <Button
                className="flex-1 !px-4"
                text="View Full Profile"
                onPress={() => router.push(`/user-profile?id=${profile.id}`)}
              />
              <Button
                onPress={handleShortlist}
                className="!px-4 flex-1 !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]"
                text={shortlisted ? "Remove" : "Shortlist"}
                iconLeft={shortlisted ? <ShortlistRemoveIcon className="w-4 h-4 shrink-0" /> : <ShortlistIcon className="w-4 h-4 shrink-0" />}
              />
              <Button
                onPress={handleSendInterest}
                className="!px-4 flex-1 !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE] disabled:opacity-50"
                text={mutualMatch ? "Connected 🎉" : interestSent ? "Interest Sent" : interestPending ? "Sending..." : "Send Interest"}
                iconLeft={<SendInterestMsgIcon className="w-4 h-4 shrink-0" />}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Below 840px: buttons always at bottom. Detail rows only shown here below 600px. */}
      <div className="min-[840px]:hidden mt-0">
        <div className="min-[600px]:hidden">
          <div className="mt-4" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {detailRows.map((row, ri) =>
              row.map(({ Icon, value }, ci) => (
                <div key={`${ri}-${ci}`} className="flex items-center max-[370px]:gap-1.5 gap-2 min-w-0">
                  <Icon className="w-[14px] md:w-5 h-[14px] md:h-5 shrink-0 text-[#222222]" />
                  <span className="font-poppins text-[14px] md:text-[16px] text-[#6B6B6B] truncate">{value}</span>
                </div>
              ))
            )}
          </div>
        </div>
        {/* >= 640px: full buttons with text */}
        <div className="hidden min-[500px]:flex gap-3 mt-4">
          <Button
            className="!px-3 flex-1"
            text="View Full Profile"
            onPress={() => router.push(`/user-profile?id=${profile.id}`)}
          />
          <Button
            onPress={handleShortlist}
            className="!px-3 flex-1 !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]"
            text={shortlisted ? "Remove" : "Shortlist"}
            iconLeft={shortlisted ? <ShortlistRemoveIcon className="w-4 h-4 shrink-0" /> : <ShortlistIcon className="w-4 h-4 shrink-0" />}
          />
          <Button
            onPress={handleSendInterest}
            className="!px-2.5 flex-1 !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE] disabled:opacity-50"
            text={mutualMatch ? "Connected🎉" : interestSent ? "Interest Sent" : interestPending ? "Sending..." : "Send Interest"}
            iconLeft={<SendInterestMsgIcon className="w-4 h-4 shrink-0" />}
          />
        </div>

        {/* < 640px: View Full Profile as-is, shortlist + interest icon-only */}
        <div className="flex min-[500px]:hidden max-[360px]:gap-2 gap-3 mt-4">
          <Button
            className="flex-1 !py-2 max-[350]:!px-4"
            text="View Full Profile"
            onPress={() => router.push(`/user-profile?id=${profile.id}`)}
          />
          <div
            onClick={handleShortlist}
            className="flex items-center flex max-[302px]:hidden justify-center py-2 px-3 rounded-[43px] bg-[#FFF0F3] cursor-pointer hover:bg-[#FFE4E9] active:bg-[#FFD6DE]"
          >
            {shortlisted ? <ShortlistRemoveIcon className="w-5 h-5 shrink-0 text-[#B31B38]" /> : <ShortlistIcon className="w-5 h-5 shrink-0 text-[#B31B38]" />}
          </div>
          <div
            onClick={handleSendInterest}
            className="flex items-center  flex max-[302px]:hidden justify-center py-2 px-3 rounded-[43px] bg-[#FFF0F3] cursor-pointer hover:bg-[#FFE4E9] active:bg-[#FFD6DE]"
          >
            <SendInterestMsgIcon className="w-5 h-5 shrink-0 text-[#B31B38]" />
          </div>
        </div>
      </div>

      {showLimitPopup && <EliteUpgradePopup trigger="daily_limit" onClose={() => setShowLimitPopup(false)} />}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FormCardLayout from "@/src/components/common-layout/FormCardLayout";
import { getProgressWidth } from "@/src/utils/getProgressWidth";
import Button from "@/src/components/common-layout/Button";
import { CheckmarkIcon, MailIcon, PhoneIcon, ProfileIcon } from "@/src/assets/Icons";
import { getMe, claimTrustBadge } from "@/src/lib/api/user";
import { readMeCache, writeMeCache, invalidateMeCache } from "@/src/components/AppHeader";
import type { Me } from "@/src/types/user";

export default function TrustBadgePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    // Show cached data instantly, then refresh silently in background
    const cached = readMeCache();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (cached) setMe(cached);
    getMe()
      .then((data) => { writeMeCache(data); setMe(data); })
      .catch(() => {});
  }, []);

  const isPhoneVerified = me?.isPhoneVerified ?? false;
  const isEmailVerified = me?.isEmailVerified ?? false;
  const score = me?.profileCompletionScore ?? 0;
  const isProfileVerified = score >= 90;
  const hasBadge = me?.trustBadge ?? false;

  const completedCount = [isPhoneVerified, isEmailVerified, isProfileVerified].filter(Boolean).length;
  const progress = (completedCount / 3) * 100;
  const allDone = completedCount === 3;

  const tasks = [
    {
      text: "Verify your mobile number",
      Icon: PhoneIcon,
      verified: isPhoneVerified,
      actionLabel: "Verify now",
      href: "/verify-identity?method=phone",
    },
    {
      text: "Verify your email address",
      Icon: MailIcon,
      verified: isEmailVerified,
      actionLabel: "Verify now",
      href: "/verify-identity?method=email",
    },
    {
      text: "Reach 90% profile completion points",
      Icon: ProfileIcon,
      verified: isProfileVerified,
      actionLabel: "Add details",
      href: "/my-profile",
    },
  ];

  const handleClaim = async () => {
    if (!allDone || hasBadge || claiming) return;
    setClaiming(true);
    try {
      await claimTrustBadge();
      invalidateMeCache();
      const fresh = await getMe();
      setMe(fresh);
    } catch {
      // badge not granted — conditions not met server-side
    } finally {
      setClaiming(false);
    }
  };

  const claimButtonClass = allDone
    ? ""
    : "!bg-[#F0F0F0] !text-[#656565] hover:!bg-[#BBBBBB] active:!bg-[#BBBBBB]";

  return (
    <div className="font-poppins min-h-screen bg-[#F8F5F2]">
      <FormCardLayout
        title="Get trust badge"
        subtitle="Complete 3 quick tasks to show other members you're real and trustworthy."
        subtitleMarginTop="mt-4 sm:mt-5 md:mt-6.5 lg:mt-8"
        childrenTopMargin="mt-4 sm:mt-5 md:mt-6"
        paddingBottom="pb-4 sm:pb-5 md:pb-6"
      >
        <div>
          {/* Progress bar */}
          <div className="flex flex-col gap-2 rounded-[16px] bg-[#F0F0F0] p-3 md:p-4">
            <div className="flex items-center justify-between">
              <span className="font-16 text-dark">Your progress</span>
              <span className="font-16 text-dark">{completedCount} of 3 completed</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-[19px] bg-white">
              <div
                className="h-full rounded-[19px] bg-[#B31B38] transition-[width] duration-700 ease-in-out"
                style={{ width: `${getProgressWidth(progress)}%` }}
              />
            </div>
          </div>

          {/* Tasks */}
          <div className="mt-5 flex flex-col gap-4 sm:mt-5 md:mt-6">
            {tasks.map(({ text, Icon, verified, actionLabel, href }) => (
              <div key={text} className="flex items-center justify-between gap-4 px-4 py-1 md:py-2">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3 md:gap-4">
                  <Icon className="h-4 sm:h-4.5 md:h-5.5 lg:h-6 w-4 sm:w-4.5 md:w-5.5 lg:w-6 shrink-0 text-dark" />
                  <span className="text-dark font-16 font-normal leading-[150%]">{text}</span>
                </div>
                {verified ? (
                  <div className="flex shrink-0 items-center gap-[2px] rounded-[41px] bg-[#F0F0F0] py-[2px] pl-3 pr-2">
                    <span className="font-16 font-normal leading-[150%] text-[#656565]">Verified</span>
                    <CheckmarkIcon className="h-4 sm:h-4.5 md:h-5.5 lg:h-6 w-4 sm:w-4.5 md:w-5.5 lg:w-6 shrink-0 text-[#656565]" />
                  </div>
                ) : (
                  <Link
                    href={href}
                    className="flex shrink-0 items-center rounded-[41px] bg-[#B31B38] px-3 py-[2px] hover:bg-[#8E162D] transition-colors"
                  >
                    <span className="font-16 font-normal leading-[150%] text-white">{actionLabel}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="my-3 h-px self-stretch bg-[#EAEAEA] md:my-4" />

          {/* Claim section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <Image
                src="/icons/trust_Badge.png"
                alt=""
                width={44}
                height={48}
                className="h-[48px] w-[44px] shrink-0"
              />
              <p className="flex-1 font-16 font-normal leading-[150%] text-secondary3">
                {hasBadge
                  ? "You have earned your Trust badge! It is now visible on your profile."
                  : "All three tasks must be completed to unlock your Trust badge."}
              </p>
              <div className="hidden min-[520px]:block">
                <Button
                  text={hasBadge ? "Badge claimed!" : claiming ? "Claiming..." : "Claim trust badge"}
                  onPress={handleClaim}
                  className={`!px-6 ${claimButtonClass}`}
                />
              </div>
            </div>

            <div className="min-[520px]:hidden">
              <Button
                text={hasBadge ? "Badge claimed!" : claiming ? "Claiming..." : "Claim trust badge"}
                onPress={handleClaim}
                className={`!px-6 w-full ${claimButtonClass}`}
              />
            </div>
          </div>
        </div>
      </FormCardLayout>
    </div>
  );
}

"use client";

import Link from "next/link";
import { CheckmarkIcon, PencilIcon } from "@/src/assets/Icons";
import type { Me } from "@/src/types/user";

type Props = { me: Me };

export default function ContactInfoSection({ me }: Props) {
  const isPhoneVerified = me.isPhoneVerified;
  const isEmailVerified = me.isEmailVerified;

  // Show the phone number without repeating the country code prefix
  const phone = me.phone ?? "—";
  const email = me.email ?? "—";

  return (
    <div className="font-poppins">
      {/* WhatsApp / Phone */}
      <div className="border-t border-[#EAEAEA] pt-3 md:pt-4 flex w-full justify-between items-start gap-2 max-[410px]:flex-col">
        <div className="text-secondary3 font-16 shrink-0">WhatsApp</div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap max-[410px]:flex-col max-[410px]:items-start min-[410px]:justify-end">
          <span className="font-16 text-dark font-medium select-none">{phone}</span>
          <div className="flex items-center gap-2">
            {isPhoneVerified ? (
              <div className="flex shrink-0 items-center gap-[2px] rounded-[41px] bg-[#F0F0F0] py-[2px] pl-3 pr-2">
                <span className="font-16 font-normal leading-[150%] text-[#656565]">Verified</span>
                <CheckmarkIcon className="h-4 sm:h-4.5 md:h-5.5 w-4 sm:w-4.5 md:w-5.5 shrink-0 text-[#656565]" />
              </div>
            ) : (
              <Link
                href="/verify-identity?method=phone"
                className="flex shrink-0 items-center rounded-[41px] bg-[#B31B38] px-3 py-[2px] hover:bg-[#8E162D] transition-colors"
              >
                <span className="font-16 font-normal leading-[150%] text-white">Verify now</span>
              </Link>
            )}
            <Link
              href="/change-contact?type=phone"
              className="group rounded-[41px] py-0.5 pl-3 pr-2 bg-[#F0F0F0] text-[#656565] hover:bg-[#B31B38] hover:text-white active:bg-[#6F1023]"
            >
              <PencilIcon className="h-4 w-4 md:h-5 md:w-5" stroke="currentColor" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-3 md:mt-4 border-b border-[#EAEAEA]" />

      {/* Email */}
      <div className="mt-3 md:mt-4 flex w-full justify-between items-start gap-2 max-[410px]:flex-col">
        <div className="text-secondary3 font-16 shrink-0">Email</div>
        <div className="flex items-center gap-2 md:gap-3 flex-wrap max-[410px]:flex-col max-[410px]:items-start min-[410px]:justify-end">
          <span className="font-16 text-dark font-medium select-none">{email}</span>
          <div className="flex items-center gap-2">
            {isEmailVerified ? (
              <div className="flex shrink-0 items-center gap-[2px] rounded-[41px] bg-[#F0F0F0] py-[2px] pl-3 pr-2">
                <span className="font-16 font-normal leading-[150%] text-[#656565]">Verified</span>
                <CheckmarkIcon className="h-4 w-4 shrink-0 text-[#656565]" />
              </div>
            ) : (
              <Link
                href="/verify-identity?method=email"
                className="flex shrink-0 items-center rounded-[41px] bg-[#B31B38] px-3 py-[2px] hover:bg-[#8E162D] transition-colors"
              >
                <span className="font-16 font-normal leading-[150%] text-white">Verify now</span>
              </Link>
            )}
            <Link
              href="/change-contact?type=email"
              className="group rounded-[41px] py-0.5 pl-3 pr-2 bg-[#F0F0F0] text-[#656565] hover:bg-[#B31B38] hover:text-white active:bg-[#6F1023]"
            >
              <PencilIcon className="h-4 w-4 md:h-5 md:w-5" stroke="currentColor" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

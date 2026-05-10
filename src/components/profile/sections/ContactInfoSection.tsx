"use client";

import { CheckmarkIcon, PencilIcon } from "@/src/assets/Icons";

const isPhoneVerified = true;
const isEmailVerified = false;

export default function ContactInfoSection() {
  return (
    <div className="font-poppins">
      <div className="border-t border-[#EAEAEA] pt-3 md:pt-4 flex w-full justify-between">
        <div className="text-secondary3 font-16">WhatsApp</div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 md:gap-4">
            <span className="font-16 text-[#767676]">+94 75 020 7507</span>
            {isPhoneVerified ? (
              <div className="flex shrink-0 items-center gap-[2px] rounded-[41px] bg-[#F0F0F0] py-[2px] pl-3 pr-2">
                <span className="font-16 font-normal leading-[150%] text-[#656565]">Verified</span>
                <CheckmarkIcon className="h-4 sm:h-4.5 md:h-5.5 lg:h-6 w-4 sm:w-4.5 md:w-5.5 lg:w-6 shrink-0 text-[#656565]" />
              </div>
            ) : (
              <button type="button" className="flex shrink-0 items-center rounded-[41px] bg-[#B31B38] px-3 py-[2px]">
                <span className="font-16 font-normal leading-[150%] text-white">verify now</span>
              </button>
            )}
            <div className="rounded-[41px] py-0.5 pl-3 pr-2 bg-[#F0F0F0]">
              <PencilIcon className="h-4 w-4 md:h-5 md:w-5" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 md:mt-4 border-b border-[#EAEAEA]" />

      <div className="mt-3 md:mt-4 flex w-full justify-between">
        <div className="text-secondary3 font-16">Email</div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 md:gap-4">
            <span className="font-16 text-[#767676]">contact@inai.lk</span>
            {isEmailVerified ? (
              <div className="flex shrink-0 items-center gap-[2px] rounded-[41px] bg-[#F0F0F0] py-[2px] pl-3 pr-2">
                <span className="font-16 font-normal leading-[150%] text-[#656565]">Verified</span>
                <CheckmarkIcon className="h-4 w-4 shrink-0 text-[#656565]" />
              </div>
            ) : (
              <button type="button" className="flex shrink-0 items-center rounded-[41px] bg-[#B31B38] px-3 py-[2px]">
                <span className="font-16 font-normal leading-[150%] text-white">verify now</span>
              </button>
            )}
            <div className="rounded-[41px] py-0.5 pl-3 pr-2 bg-[#F0F0F0]">
              <PencilIcon className="h-4 w-4 md:h-5 md:w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

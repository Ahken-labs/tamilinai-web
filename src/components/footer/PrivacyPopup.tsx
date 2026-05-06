"use client";

import { createPortal } from "react-dom";
import { CloseCircleIcon } from "../../assets/Icons";
import PrivacyPolicy from "../more/PrivacySection";
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PrivacyPopup({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-[910px] flex-col overflow-hidden rounded-[20px] bg-light shadow-2xl">
        <div className="flex items-center justify-between self-stretch border-b border-[#EAEAEA] px-4 pb-2 md:pb-4 pt-4 md:pt-6">
          <div className="flex flex-1 items-center justify-center">
            <span className="font-poppins font-24 font-semibold leading-[150%] text-dark">
              Privacy policy
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 cursor-pointer"
            aria-label="Close"
          >
            <CloseCircleIcon className="h-8 w-8 transition-transform duration-200 hover:scale-110 active:scale-95 " />
          </button>
        </div>

        <div className="flex-1 pt-2 overflow-y-auto">
          <PrivacyPolicy />
          <div className="border-t border-[#EAEAEA] my-4 md:my-6 mx-4 md:mx-6"/>
        </div>
      </div>
    </div>,
    document.body
  );
}

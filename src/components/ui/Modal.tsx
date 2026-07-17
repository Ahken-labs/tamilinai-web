"use client";

import { createPortal } from "react-dom";
import { useScrollLock } from "@/src/hooks/useScrollLock";
import { XIcon } from "@/src/assets/Icons";

type ModalProps = {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function Modal({ title, subtitle, onClose, children, footer }: ModalProps) {
  useScrollLock(true);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end min-[500px]:items-center justify-center min-[500px]:p-4 bg-black/60">
      <div className="flex h-[96dvh] max-h-[96dvh] min-[500px]:h-[85vh] min-[500px]:max-h-[85vh] w-full min-[500px]:max-w-[640px] flex-col overflow-hidden rounded-t-[32px] min-[500px]:rounded-[32px] bg-white shadow-2xl">
        <div className="shrink-0 flex items-center justify-between gap-2 px-1 sm:px-1.5 md:px-2 py-2 sm:py-3 md:py-4">
          <button type="button" onClick={onClose} className="cursor-pointer p-2" aria-label="Close">
            <XIcon className="h-6 sm:h-7 md:h-8 w-6 sm:h-7 md:w-8" stroke="#222222" />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <h2 className="font-poppins text-[16px] sm:text-[20px] md:text-[26px] lg:text-[32px] font-semibold leading-[150%] text-[#222222]">{title}</h2>
            {subtitle && <p className="font-poppins text-[14px] text-[#525252]">{subtitle}</p>}
          </div>
          <div className="h-6 sm:h-7 md:h-8 w-6 sm:h-7 md:w-8" />
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-4 sm:px-5 pt-3 sm:pt-4 pb-4 sm:pb-5">{children}</div>

        {footer && (
          <div className="shrink-0 flex items-center justify-between gap-3 border-t border-[#D8D8D8] px-4 sm:px-5 md:px-6 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

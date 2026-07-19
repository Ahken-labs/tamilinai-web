"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useScrollLock } from "../../../hooks/useScrollLock";
import { useLang } from "../../../context/LangContext";
import { GoogleIcon, XIcon } from "../../../assets/Icons";

interface GoogleSignInModalProps {
  onClose: () => void;
  onSuccess: (token: string, name: string, picture: string) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function GoogleSignInModal({ onClose, onSuccess }: GoogleSignInModalProps) {
  const { t } = useLang();
  useScrollLock(true);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const login = useGoogleLogin({
    flow: "auth-code",
    scope: "openid email profile",
    onSuccess: async ({ code }) => {
      const res = await fetch(`${API_BASE}/api/public/business/google-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) return;
      const data = await res.json();
      onSuccess(data.token, data.name, data.picture);
    },
  });
  
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end min-[500px]:items-center justify-center bg-black/60 min-[500px]:px-4 ">
      <div className="pb-8 flex h-[96dvh] max-h-[50dvh] min-[500px]:h-auto min-[500px]:max-h-[85vh] w-full min-[500px]:max-w-[640px] flex-col overflow-hidden rounded-t-[32px] min-[500px]:rounded-[32px] bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-end pl-4 max-[500px]:pr-1 pr-2 pt-2 min-[500px]:pb-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center p-2 cursor-pointer"
          >
            <XIcon className="w-8 max-[500px]:w-6 h-8 max-[500px]:h-6" stroke="#222" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto max-[500px]:px-4 px-5">
          <div className="text-center">
            <h2 className="text-[20px] font-semibold text-[#222222] leading-[135%] max-[500px]:mt-2">{t("Sign_in_to_review")}</h2>
            <p className="text-[14px] leading-[150%] mt-1 text-[#767676]">{t("Sign_in_to_review_sub")}</p>
          </div>

          <button
            onClick={() => login()}
            className="mt-5 mx-auto flex items-center gap-3 pl-2 pr-4 py-2 bg-[#F2F2F2] rounded-full hover:bg-[#ccc] transition-colors cursor-pointer font-poppins text-[16px] leading-[150%] font-medium text-[#222]"
          >
            <GoogleIcon className="w-11 h-11" />
            {t("Sign_in_with_Google")}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}

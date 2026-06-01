"use client";

import { useRouter } from "next/navigation";
import { useScrollLock } from "../../hooks/useScrollLock";
import { useQueryClient } from "@tanstack/react-query";
import { http } from "../../lib/api/client";
import { clearBlobCache } from "../common-layout/ProtectedPhoto";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutPopup({ isOpen, onClose }: Props) {
  const router = useRouter();
  useScrollLock(isOpen);
  const queryClient = useQueryClient();

  if (!isOpen) return null;

  async function handleLogout() {
    try {
      await http("/api/auth/logout", { method: "POST" });
    } catch {
      // proceed with local logout even if server call fails
    }
    clearBlobCache();
    localStorage.clear();
    sessionStorage.clear();
    queryClient.clear();
    router.replace("/");
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-[320px] rounded-[20px] bg-white p-6 shadow-xl">
        <p className="font-poppins text-[16px] font-semibold text-[#222222] leading-[150%]">
          Log out
        </p>
        <p className="mt-2 font-poppins text-[14px] font-normal text-[#6B6B6B] leading-[150%]">
          Are you sure you want to log out?
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-[10px] border border-[#E0E0E0] py-2.5 font-poppins text-[14px] font-medium text-[#222222] hover:bg-[#F5F5F5] transition-colors duration-150 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 rounded-[10px] bg-[#B31B38] py-2.5 font-poppins text-[14px] font-medium text-white hover:bg-[#8E162D] active:bg-[#6F1023] transition-colors duration-150 cursor-pointer"
          >
            Yes, log out
          </button>
        </div>
      </div>
    </div>
  );
}

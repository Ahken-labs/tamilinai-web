"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NotifPhotoUploadIcon, CheckmarkIcon } from "@/src/assets/Icons";
import { respondPhotoAccess, declinePhotoRequest } from "@/src/lib/api/profiles";
import Button from "@/src/components/common-layout/Button";
import { IoCloseOutline } from "react-icons/io5";

interface Props {
  profileId: string;
  profileName: string;
  type: "access" | "upload";
  onDismiss: () => void;
}

export default function IncomingPhotoRequestCard({ profileId, profileName, type, onDismiss }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<"accept" | "decline" | null>(null);

  async function handleAccept() {
    setLoading("accept");
    try {
      await respondPhotoAccess(profileId, "accept");
      onDismiss();
    } catch { }
    setLoading(null);
  }

  async function handleDecline() {
    setLoading("decline");
    try {
      if (type === "upload") {
        await declinePhotoRequest(profileId);
      } else {
        await respondPhotoAccess(profileId, "decline");
      }
      onDismiss();
    } catch { }
    setLoading(null);
  }

  return (
    <div className="rounded-[20px] bg-[#FFE9E2] p-4 md:p-5 font-poppins">
      <p className="font-16 font-medium text-dark leading-[150%]">
        {type === "upload"
          ? `${profileName} wishes to view your photo.`
          : `${profileName} wishes to view your photo.`}
      </p>
      <div className="mt-4 md:mt-5 flex flex-row max-[500px]:flex-col gap-3 md:gap-4">
        {type === "upload" ? (
          <Button
            text={loading === "accept" ? "..." : "Upload photo"}
            onPress={() => { onDismiss(); router.push("/my-profile"); }}
            iconLeft={<NotifPhotoUploadIcon className="h-4 w-4 shrink-0 text-white" />}
            className="flex-1 !py-2.5"
          />
        ) : (
          <Button
            text={loading === "accept" ? "..." : "Accept"}
            onPress={handleAccept}
            iconLeft={<CheckmarkIcon className="w-4 md:w-6 h-4 md:h-6"/>}
            className="flex-1 !py-2.5"
          />
        )}
        <Button onPress={handleDecline}
          className="!bg-[#FFF] flex-1 !text-[#B31B38] border border-[#B31B38]"
          text={loading === "decline" ? "..." : "Decline"} 
          iconLeft={<IoCloseOutline className="text-[#B31B38] w-4 md:w-6 h-4 md:h-6" />}
          />
      </div>
    </div>
  );
}

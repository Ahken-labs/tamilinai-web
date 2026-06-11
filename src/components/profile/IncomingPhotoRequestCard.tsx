"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NotifPhotoUploadIcon, CheckmarkIcon } from "@/src/assets/Icons";
import { respondPhotoAccess, declinePhotoRequest } from "@/src/lib/api/profiles";
import { uploadPhoto } from "@/src/lib/api/user";
import Button from "@/src/components/common-layout/Button";
import PhotoCropModal from "@/src/components/app/PhotoCropModal";
import { IoCloseOutline } from "react-icons/io5";

interface Props {
  profileId: string;
  profileName: string;
  type: "access" | "upload";
  onDismiss: () => void;
}

export default function IncomingPhotoRequestCard({ profileId, profileName, type, onDismiss }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<"accept" | "decline" | "uploading" | null>(null);

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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropSrc(URL.createObjectURL(file));
    e.target.value = "";
  }

  async function handleCropConfirm(file: File) {
    setCropSrc(null); // close modal immediately, same as my-profile
    setLoading("uploading");
    try {
      await uploadPhoto(file);
      onDismiss();
      if (pathname !== "/my-profile") router.push("/my-profile");
    } catch { }
    setLoading(null);
  }

  return (
    <>
      <div className="rounded-[20px] bg-[#FFE9E2] p-4 md:p-5 font-poppins">
        <p className="font-16 font-medium text-dark leading-[150%]">
          {type === "upload"
            ? `${profileName} wishes to view your photo.`
            : `${profileName} wishes to view your photo.`}
        </p>
        <div className="mt-4 md:mt-5 flex flex-row max-[500px]:flex-col gap-3 md:gap-4">
          {type === "upload" ? (
            <>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <Button
                text={loading === "uploading" ? "Uploading…" : "Upload photo"}
                onPress={() => fileInputRef.current?.click()}
                disabled={loading !== null}
                iconLeft={<NotifPhotoUploadIcon className="h-4 w-4 shrink-0 text-white" />}
                className="flex-1 !py-2.5"
              />
            </>
          ) : (
            <Button
              text={loading === "accept" ? "..." : "Accept"}
              onPress={handleAccept}
              disabled={loading !== null}
              iconLeft={<CheckmarkIcon className="w-4 md:w-6 h-4 md:h-6" />}
              className="flex-1 !py-2.5"
            />
          )}
          <Button
            onPress={handleDecline}
            disabled={loading !== null}
            className="!bg-[#FFF] flex-1 !text-[#B31B38] border border-[#B31B38]"
            text={loading === "decline" ? "..." : "Decline"}
            iconLeft={<IoCloseOutline className="text-[#B31B38] w-4 md:w-6 h-4 md:h-6" />}
          />
        </div>
      </div>

      {cropSrc && (
        <PhotoCropModal
          imageSrc={cropSrc}
          onConfirm={handleCropConfirm}
          onClose={() => setCropSrc(null)}
        />
      )}
    </>
  );
}

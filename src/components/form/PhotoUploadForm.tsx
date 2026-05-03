"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "../common/Button";
import StepProgress from "../more/StepProgress";
import FormCardLayout from "../more/FormCardLayout";
import { SecurityIcon, CheckmarkIcon, CameraIcon } from "@/src/assets/Icons";
import { useLang } from "@/src/context/LangContext";
import { countWords } from "@/src/utils/wordCount";

const MAX_WORDS = 60;

export default function PhotoUploadForm() {
  const router = useRouter();
  const { t } = useLang();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [aboutMe, setAboutMe] = useState("");

  const wordCount = countWords(aboutMe);
  const hasPhoto = !!photoUrl;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUrl(URL.createObjectURL(file));
  }

  function handleAboutMeChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    if (countWords(val) <= MAX_WORDS) {
      setAboutMe(val);
    }
  }
  function clearDraftData() {
    try {
      sessionStorage.removeItem("tamilinai_basic");
      sessionStorage.removeItem("tamilinai_personal");
      sessionStorage.removeItem("tamilinai_photo");
    } catch {
      /* storage unavailable */
    }
  }
  function handleSkip() {
    clearDraftData();
    router.push("/matches?welcome=1");
  }

  function handleSave() {
    if (!hasPhoto) return;
    try {
      sessionStorage.setItem("tamilinai_photo", JSON.stringify({ aboutMe }));
    } catch { /* unavailable */ }
    clearDraftData();
    router.push("/matches?welcome=1");
  }

  const bullets = [
    t("Photo_protected"),
    t("Control_who_sees_photo"),
    t("Manage_in_settings"),
  ];

  return (
    <FormCardLayout
      bgColor="bg-mvp"
      childrenTopMargin="mt-6 md:mt-8"
      footer={
        <div className="flex gap-5 w-full">
          <Button
            text={t("Skip")}
            onPress={handleSkip}
            className="flex-1 !bg-[#FFF] !text-[#767676] hover:!bg-gray-50 active:!bg-gray-100"
          />
          <Button
            text={t("Save")}
            onPress={handleSave}
            className={`flex-1 ${hasPhoto
              ? ""
              : "!bg-[#BBBBBB] hover:!bg-[#BBBBBB] active:!bg-[#BBBBBB] !cursor-default"
              }`}
          />
        </div>
      }
    >
      <StepProgress currentStep={3} />

      <h1 className="mt-6 md:mt-8 lg:mt-10 font-24 font-semibold text-dark leading-[150%] text-center">
        {t("Add_your_clear_photo")}
      </h1>

      <p className="mt-2 font-16 font-normal text-dark leading-[150%] text-center">
        {t("Photo_subtitle")}
      </p>

      {/* Photo circle + bullets row */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-10">

        {/* Photo circle */}
        <div className="relative shrink-0 mx-auto sm:mx-0">
          <div
            className={`w-31 sm:w-41 md:w-41 h-31 sm:h-41 md:h-41 rounded-full overflow-hidden flex items-center justify-center ${hasPhoto ? "" : "bg-[#D9D9D9]"
              }`}
          >
            <Image
              src={hasPhoto ? photoUrl! : "/icons/Ellipse.svg"}
              alt="Profile photo"
              width={164}
              height={164}
              className="w-full h-full object-cover"
              unoptimized
              priority={!hasPhoto}
            />
          </div>

          {/* Camera button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 translate-x-0/4 translate-y-0/4 px-2.5 py-2.5 rounded-full flex items-center justify-center transition-colors"
            style={{ background: hasPhoto ? "#B31B38" : "#767676" }}
          >
            <SecurityIcon />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Bullets + Add photo button */}
        <div className="flex flex-col items-center sm:items-start">
          <div className="flex flex-col gap-2 sm:gap-3">
            {bullets.map((text) => (
              <div key={text} className="flex items-center gap-2">
                <CheckmarkIcon
                  stroke={hasPhoto ? "#B31B38" : "#222222"}
                />
                <span className="font-14 font-normal text-dark leading-[150%]">{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-[22px]">
            <Button
              text={hasPhoto ? t("Change_photo") : t("Add_photo")}
              iconLeft={
                <CameraIcon
                  className={`w-4 h-4 ${hasPhoto ? "text-[#222222]" : "text-white"
                    }`}
                />
              }
              onPress={() => fileInputRef.current?.click()}
              className={`!px-10 ${hasPhoto
                ? "!bg-white !text-[#222222] hover:!bg-gray-50"
                : ""
                }`}
            />
          </div>
        </div>
      </div>

      {/* About me */}
      <div className="mt-8 sm:mt-12">
        <p className="font-16 font-medium text-dark">{t("About_me")}</p>
        <textarea
          value={aboutMe}
          onChange={handleAboutMeChange}
          placeholder={t("About_me_placeholder")}
          className="w-full mt-3 rounded-[12px] border border-[#767676] 
          font-16 font-normal text-dark placeholder:text-[#656565] resize-none outline-none 
          focus:border-[#B31B38] transition-colors h-[160px] md:h-[199px] p-3 sm:p-4"
        />
        <div className="flex text-secondary4 font-14 justify-between mt-1">
          <span >{t("Keep_it_genuine")}</span>
          <span >{wordCount} {t("Word_count")}</span>
        </div>
      </div>
    </FormCardLayout>
  );
}

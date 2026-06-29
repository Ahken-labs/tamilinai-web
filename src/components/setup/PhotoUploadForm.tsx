// "use client";

// import { useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Button from "../common-layout/Button";
// import StepProgress from "../more/StepProgress";
// import FormCardLayout from "../common-layout/FormCardLayout";
// import { SecurityIcon, CheckmarkIcon, CameraIcon, CheckboxIcon } from "@/src/assets/Icons";
// import { useLang } from "@/src/context/LangContext";
// import { countWords } from "@/src/utils/wordCount";
// import { validateAboutMe, splitHighlight } from "@/src/utils/aboutMeValidation";
// import PrivacyPopup from "../footer/PrivacyPopup";
// import { submitProfileSetup } from "../../lib/api/user";
// import PhotoCropModal from "../app/PhotoCropModal";

// const MAX_WORDS = 60;

// const MARITAL_STATUS_MAP: Record<string, string> = {
//   Unmarried: "unmarried",
//   "Widow/Widower": "widow_widower",
//   Divorced: "divorced",
//   Separated: "separated",
// };

// function parseCm(val?: string): number | undefined {
//   if (!val) return undefined;
//   const n = parseInt(val, 10);
//   return isNaN(n) ? undefined : n;
// }

// function buildSetupFormData(basic: Record<string, string>, personal: Record<string, string>, aboutMe: string, photo?: File): FormData {
//   const fd = new FormData();

//   if (basic.birthYear && basic.birthMonth && basic.birthDay) {
//     const MONTH_MAP: Record<string, string> = {
//       January: "01", February: "02", March: "03", April: "04",
//       May: "05", June: "06", July: "07", August: "08",
//       September: "09", October: "10", November: "11", December: "12",
//     };
//     const mm = MONTH_MAP[basic.birthMonth] ?? basic.birthMonth;
//     const dd = basic.birthDay.padStart(2, "0");
//     fd.append("dateOfBirth", `${basic.birthYear}-${mm}-${dd}`);
//   }

//   if (basic.maritalStatus) {
//     fd.append("maritalStatus", MARITAL_STATUS_MAP[basic.maritalStatus] ?? basic.maritalStatus.toLowerCase());
//   }

//   const heightCm = parseCm(basic.height);
//   if (heightCm !== undefined) fd.append("heightCm", String(heightCm));

//   const weightKg = parseCm(basic.weight);
//   if (weightKg !== undefined) fd.append("weightKg", String(weightKg));

//   if (basic.physicalChallenge === "yes") {
//     fd.append("hasPhysicalChallenge", "true");
//     if (basic.disability) fd.append("disabilityType", basic.disability);
//   } else {
//     fd.append("hasPhysicalChallenge", "false");
//   }

//   if (personal.education) fd.append("education", personal.education);
//   if (personal.occupation) fd.append("occupation", personal.occupation);
//   if (personal.religion) fd.append("religion", personal.religion);
//   if (personal.caste) fd.append("caste", personal.caste);
//   if (personal.country) fd.append("country", personal.country);
//   if (personal.city) fd.append("city", personal.city);
//   if (personal.citizenship) fd.append("citizenship", personal.citizenship);

//   if (aboutMe.trim()) fd.append("aboutMe", aboutMe.trim());
//   if (photo) fd.append("photo", photo);

//   return fd;
// }

// function clearDraftData() {
//   try {
//     sessionStorage.removeItem("inai_setup_basic");
//     sessionStorage.removeItem("inai_setup_personal");
//     sessionStorage.removeItem("inai_setup_start");
//   } catch { /* storage unavailable */ }
// }

// export default function PhotoUploadForm() {
//   const router = useRouter();
//   const { t } = useLang();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const gender = typeof window !== "undefined" ? (sessionStorage.getItem("inai_setup_gender") ?? "female") : "female";
//   const placeholderSrc = gender === "male" ? "/images/no_photo_male.webp" : "/images/no_photo.webp";

//   const [photoFile, setPhotoFile] = useState<File | null>(null);
//   const [photoUrl, setPhotoUrl] = useState<string | null>(null);
//   const [cropSrc, setCropSrc] = useState<string | null>(null);
//   const [aboutMe, setAboutMe] = useState("");
//   const [aboutMeError, setAboutMeError] = useState<{ message: string; offendingWord: string } | null>(null);
//   const [agreed, setAgreed] = useState(true);
//   const [showError, setShowError] = useState(false);
//   const [openPrivacy, setOpenPrivacy] = useState(false);

//   const wordCount = countWords(aboutMe);
//   const hasPhoto = !!photoUrl;

//   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     e.target.value = "";
//     setCropSrc(URL.createObjectURL(file));
//   }

//   function handleCropConfirm(file: File, previewUrl: string) {
//     setPhotoFile(file);
//     setPhotoUrl(previewUrl);
//     setCropSrc(null);
//   }

//   function handleAboutMeChange(val: string) {
//     if (countWords(val) <= MAX_WORDS) {
//       setAboutMe(val);
//       setAboutMeError(validateAboutMe(val));
//     }
//   }

//   function submitSetup(skipPhoto: boolean) {
//     if (!agreed) {
//       setShowError(true);
//       return;
//     }
//     if (!skipPhoto && !hasPhoto) return;

//     // Build FormData now before navigating (component unmounts on navigate)
//     const basic = JSON.parse(sessionStorage.getItem("inai_setup_basic") ?? "{}") as Record<string, string>;
//     const personal = JSON.parse(sessionStorage.getItem("inai_setup_personal") ?? "{}") as Record<string, string>;
//     const fd = buildSetupFormData(basic, personal, aboutMeError ? "" : aboutMe, skipPhoto ? undefined : (photoFile ?? undefined));

//     router.replace("/matches?welcome=1");

//     // Fire in background — user is already navigating forward
//     submitProfileSetup(fd)
//       .then(() => clearDraftData())
//       .catch(() => { /* user can re-enter details in profile */ });
//   }

//   const bullets = [
//     t("Photo_protected"),
//     t("Control_who_sees_photo"),
//     t("Manage_in_settings"),
//   ];

//   return (
//     <>
//       {/* Mobile: StepProgress fixed at top */}
//       <div className="mb-4 min-[500px]:hidden">
//         <div className="fixed top-[68px] bg-mvp left-0 right-0 z-40 px-4 pb-2">
//           <StepProgress currentStep={3} />
//         </div>
//       </div>

//       <FormCardLayout
//         bgColor="bg-mvp"
//         paddingHorizontal="max-[500px]:px-0 px-4 md:px-6"
//         childrenTopMargin="mt-6 md:mt-8"
//         paddingBottom="max-[500px]:pb-0 pb-8 md:pb-10"
//         footer={
//           <>
//             <div className="hidden min-[500px]:flex gap-5 w-full">
//               <Button
//                 text={t("Skip")}
//                 onPress={() => submitSetup(true)}
//                 className={`flex-1 ${!agreed
//                   ? "!bg-[#FFF] !text-[#999]"
//                   : "!bg-[#FFF] !text-[#767676] hover:!bg-gray-50 active:!bg-gray-100"
//                   }`}
//               />
//               <Button
//                 text={t("Save")}
//                 onPress={() => submitSetup(false)}
//                 className={`flex-1 ${!agreed || !hasPhoto
//                   ? "!bg-[#BBBBBB] hover:!bg-[#BBBBBB] active:!bg-[#BBBBBB]"
//                   : ""}`}
//               />
//             </div>

//             <div className="hidden min-[500px]:flex mt-8 gap-3 md:gap-4 items-start">
//               <button onClick={() => {
//                 setAgreed(prev => !prev);
//                 setShowError(false);
//               }}>
//                 <CheckboxIcon checked={agreed} />
//               </button>
//               <span className="text-[14px] text-secondary4 font-poppins font-normal">
//                 I have read and agree to Inai&apos;s{" "}
//                 <button
//                   type="button"
//                   onClick={() => setOpenPrivacy(true)}
//                   className="underline font-medium cursor-pointer"
//                 >
//                   Privacy Policy
//                 </button>{" "}
//                 and understand how my information will be used to help me find a partner.
//               </span>
//             </div>

//             {showError && (
//               <p className="hidden min-[500px]:block mt-2 text-[12px] text-[#B31B38]">
//                 * Please agree to the terms and conditions
//               </p>
//             )}
//           </>
//         }
//       >
//         <div className="hidden min-[500px]:block">
//           <StepProgress currentStep={3} />
//         </div>

//         <h1 className="max-[500px]:-mt-4 mt-6 md:mt-8 lg:mt-10 font-24 font-semibold text-dark leading-[150%] max-[500px]:text-left text-center">
//           {t("Add_your_clear_photo")}
//         </h1>

//         {/* Desktop subtitle */}
//         <p className="hidden min-[500px]:block mt-2 text-[14px] md:text-[16px] font-normal text-dark leading-[150%] text-center">
//           {t("Photo_subtitle")}
//         </p>

//         {/* Photo circle — shared */}
//         <div className="mt-6 sm:mt-8 flex flex-col min-[500px]:flex-row items-center justify-center gap-5 min-[500px]:gap-5">
//           <div className="relative shrink-0 mx-auto min-[500px]:mx-0">
//             <div
//               className={`w-31 min-[500px]:w-41 pt-8 h-31 min-[500px]:h-41 overflow-hidden flex items-center justify-center ${hasPhoto ? "rounded-full" : "rounded-full bg-[#D9D9D9]"}`}
//               style={!hasPhoto ? { border: "1.5px dashed #767676" } : {}}
//             >
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <Image
//                   src={hasPhoto ? photoUrl! : placeholderSrc}
//                   alt="Profile photo"
//                   width={164}
//                   height={164}
//                   className="w-full h-full object-cover"
//                   unoptimized
//                   priority={!hasPhoto}
//                 />
//               </button>
//             </div>

//             <div className="absolute bottom-1 right-1 px-2.5 py-2.5 rounded-full flex items-center justify-center transition-colors"
//               style={{ background: hasPhoto ? "#B31B38" : "#767676" }}>
//               <SecurityIcon />
//             </div>

//             <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
//           </div>

//           {/* Desktop: bullets + button beside photo */}
//           <div className="hidden min-[500px]:flex flex-col items-start">
//             <div className="flex flex-col gap-2">
//               {bullets.map((text) => (
//                 <div key={text} className="flex items-center gap-2">
//                   <CheckmarkIcon stroke={hasPhoto ? "#B31B38" : "#222222"} />
//                   <span className="text-[14px] md:text-[16px] font-normal text-dark leading-[150%]">{text}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-[22px]">
//               <Button
//                 text={hasPhoto ? t("Change_photo") : t("Add_photo")}
//                 iconLeft={<CameraIcon className={`w-4 h-4 ${hasPhoto ? "text-[#222222]" : "text-white"}`} />}
//                 onPress={() => fileInputRef.current?.click()}
//                 className={`!px-10 ${hasPhoto ? "!bg-white !text-[#222222] hover:!bg-gray-50" : ""}`}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Mobile: full-width Add photo button below circle */}
//         <div className="min-[500px]:hidden mt-4">
//           <Button
//             text={hasPhoto ? t("Change_photo") : t("Add_photo")}
//             iconLeft={<CameraIcon className={`w-4 h-4 ${hasPhoto ? "text-[#222222]" : "text-white"}`} />}
//             onPress={() => fileInputRef.current?.click()}
//             className={`!w-full ${hasPhoto ? "!bg-white !text-[#222222] hover:!bg-gray-50" : ""}`}
//           />
//         </div>

//         {/* About me */}
//         <div className="mt-8 sm:mt-12">
//           <p className="text-[16px] font-medium text-dark">{t("About_me")}</p>
//           <textarea
//             value={aboutMe}
//             onChange={(e) => handleAboutMeChange(e.target.value)}
//             placeholder={t("About_me_placeholder")}
//             className={`w-full mt-3 rounded-[12px] border text-[14px] md:text-[16px] font-normal text-dark placeholder:text-[#656565] resize-none outline-none focus:border-[#B31B38] transition-colors max-[500px]:h-[123px] h-[160px] md:h-[199px] p-3 sm:p-4 ${aboutMeError ? "border-[#B31B38]" : "border-[#767676]"}`}
//           />
//           <div className="flex text-[12px] md:text-[14px] justify-between mt-1 gap-2">
//             <span className={aboutMeError ? "text-[#B31B38] font-medium flex-1" : "text-secondary4"}>
//               {aboutMeError
//                 ? splitHighlight(aboutMeError.message, aboutMeError.offendingWord).map((seg, i) =>
//                   seg.highlight
//                     ? <span key={i} className="underline decoration-[0.5px] underline-offset-2">{seg.text}</span>
//                     : <span key={i}>{seg.text}</span>
//                 )
//                 : t("Keep_it_genuine")}
//             </span>
//             <span className="text-secondary4 shrink-0">{wordCount} {t("Word_count")}</span>
//           </div>
//         </div>

//         {/* Mobile: gray info box with subtitle + bullets + checkbox */}
//         <div className="min-[500px]:hidden mt-6 p-4 rounded-[16px] bg-[#EAEAEA] flex flex-col gap-4">
//           <p className="text-[14px] md:text-[16px] font-normal text-dark leading-[150%]">{t("Photo_subtitle")}</p>
//           <div className="flex flex-col gap-3">
//             {bullets.map((text) => (
//               <div key={text} className="flex items-center gap-2">
//                 <CheckmarkIcon stroke={hasPhoto ? "#B31B38" : "#222222"} />
//                 <span className="text-[14px] md:text-[16px] font-normal text-dark leading-[150%]">{text}</span>
//               </div>
//             ))}
//           </div>
//           <div className="flex max-[500px]:gap-2 gap-3 items-start">
//             <button onClick={() => { setAgreed(prev => !prev); setShowError(false); }}>
//               <CheckboxIcon checked={agreed} />
//             </button>
//             <span className="text-[14px] text-secondary4 font-normal">
//               I have read and agree to Inai&apos;s{" "}
//               <button type="button" onClick={() => setOpenPrivacy(true)} className="underline font-medium cursor-pointer">
//                 Privacy Policy
//               </button>{" "}
//               and understand how my information will be used to help me find a partner.
//             </span>
//           </div>
//           {showError && <p className="text-[14px] text-[#B31B38]">* Please agree to the terms and conditions</p>}
//         </div>

//         <PrivacyPopup
//           isOpen={openPrivacy}
//           onClose={() => setOpenPrivacy(false)}
//         />

//         {cropSrc && (
//           <PhotoCropModal
//             imageSrc={cropSrc}
//             onConfirm={handleCropConfirm}
//             onClose={() => setCropSrc(null)}
//           />
//         )}
//       </FormCardLayout>

//       {/* Mobile fixed bottom buttons (<500px) */}
//       <div
//         className="min-[500px]:hidden fixed bottom-0 left-0 right-0 px-4 py-2 flex flex-col gap-2"
//         style={{ background: "rgba(255, 255, 255, 0.60)", backdropFilter: "blur(11px)" }}
//       >
//         <Button
//           text={t("Save")}
//           onPress={() => submitSetup(false)}
//           className={`!w-full ${!agreed || !hasPhoto ? "!bg-[#525252] hover:!bg-[#BBBBBB] active:!bg-[#BBBBBB]" : ""}`}
//         />
//         <Button
//           text={t("Skip")}
//           onPress={() => submitSetup(true)}
//           className={`!w-full ${!agreed ? "!bg-[#FFF] !text-[#999]" : "!bg-[#FFF] !text-[#767676] hover:!bg-gray-50 active:!bg-gray-100"}`}
//         />
//       </div>
//     </>
//   );
// }


"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "../common-layout/Button";
import StepProgress from "../more/StepProgress";
import FormCardLayout from "../common-layout/FormCardLayout";
import { SecurityIcon, CheckmarkIcon, CameraIcon, CheckboxIcon } from "@/src/assets/Icons";
import { useLang } from "@/src/context/LangContext";
import { countWords } from "@/src/utils/wordCount";
import { validateAboutMe, splitHighlight } from "@/src/utils/aboutMeValidation";
import { generateAboutMe, ABOUT_ME_TEMPLATE_COUNT } from "@/src/utils/generateAboutMe";
import PrivacyPopup from "../footer/PrivacyPopup";
import { submitProfileSetup } from "../../lib/api/user";
import PhotoCropModal from "../app/PhotoCropModal";

const MAX_WORDS = 60;

const MARITAL_STATUS_MAP: Record<string, string> = {
  Unmarried: "unmarried",
  "Widow/Widower": "widow_widower",
  Divorced: "divorced",
  Separated: "separated",
};

function parseCm(val?: string): number | undefined {
  if (!val) return undefined;
  const n = parseInt(val, 10);
  return isNaN(n) ? undefined : n;
}

function buildSetupFormData(basic: Record<string, string>, personal: Record<string, string>, aboutMe: string, photo?: File): FormData {
  const fd = new FormData();

  if (basic.birthYear && basic.birthMonth && basic.birthDay) {
    const MONTH_MAP: Record<string, string> = {
      January: "01", February: "02", March: "03", April: "04",
      May: "05", June: "06", July: "07", August: "08",
      September: "09", October: "10", November: "11", December: "12",
    };
    const mm = MONTH_MAP[basic.birthMonth] ?? basic.birthMonth;
    const dd = basic.birthDay.padStart(2, "0");
    fd.append("dateOfBirth", `${basic.birthYear}-${mm}-${dd}`);
  }

  if (basic.maritalStatus) {
    fd.append("maritalStatus", MARITAL_STATUS_MAP[basic.maritalStatus] ?? basic.maritalStatus.toLowerCase());
  }

  const heightCm = parseCm(basic.height);
  if (heightCm !== undefined) fd.append("heightCm", String(heightCm));

  const weightKg = parseCm(basic.weight);
  if (weightKg !== undefined) fd.append("weightKg", String(weightKg));

  if (basic.physicalChallenge === "yes") {
    fd.append("hasPhysicalChallenge", "true");
    if (basic.disability) fd.append("disabilityType", basic.disability);
  } else {
    fd.append("hasPhysicalChallenge", "false");
  }

  if (personal.education) fd.append("education", personal.education);
  if (personal.occupation) fd.append("occupation", personal.occupation);
  if (personal.religion) fd.append("religion", personal.religion);
  if (personal.caste) fd.append("caste", personal.caste);
  if (personal.country) fd.append("country", personal.country);
  if (personal.city) fd.append("city", personal.city);
  if (personal.citizenship) fd.append("citizenship", personal.citizenship);

  if (aboutMe.trim()) fd.append("aboutMe", aboutMe.trim());
  if (photo) fd.append("photo", photo);

  return fd;
}

function clearDraftData() {
  try {
    sessionStorage.removeItem("inai_setup_basic");
    sessionStorage.removeItem("inai_setup_personal");
    sessionStorage.removeItem("inai_setup_start");
  } catch { /* storage unavailable */ }
}

export default function PhotoUploadForm() {
  const router = useRouter();
  const { t } = useLang();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { router.prefetch("/matches"); }, [router]);

  const gender = typeof window !== "undefined" ? (sessionStorage.getItem("inai_setup_gender") ?? "female") : "female";
  const placeholderSrc = gender === "male" ? "/images/no_photo_male.webp" : "/images/no_photo.webp";

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const buildAboutMeData = useCallback(() => {
    if (typeof window === "undefined") return {};
    const basic = JSON.parse(sessionStorage.getItem("inai_setup_basic") ?? "{}");
    const personal = JSON.parse(sessionStorage.getItem("inai_setup_personal") ?? "{}");
    const user = JSON.parse(localStorage.getItem("tamilinai_user") ?? "{}");
    return {
      name: user.name ?? "",
      gender: sessionStorage.getItem("inai_setup_gender") ?? "",
      maritalStatus: basic.maritalStatus ?? "",
      education: personal.education ?? "",
      occupation: personal.occupation ?? "",
      country: personal.country ?? "",
      city: personal.city ?? "",
      citizenship: personal.citizenship ?? "",
    };
  }, []);

  const [templateIndex, setTemplateIndex] = useState(0);
  const [aboutMe, setAboutMe] = useState(() => generateAboutMe({ ...buildAboutMeData(), templateIndex: 0 }));
  const [aboutMeError, setAboutMeError] = useState<{ message: string; offendingWord: string } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [showError, setShowError] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);

  const wordCount = countWords(aboutMe);
  const hasPhoto = !!photoUrl;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setCropSrc(URL.createObjectURL(file));
  }

  function handleCropConfirm(file: File, previewUrl: string) {
    setPhotoFile(file);
    setPhotoUrl(previewUrl);
    setCropSrc(null);
  }

  function handleAboutMeChange(val: string) {
    if (countWords(val) <= MAX_WORDS) {
      setAboutMe(val);
      setAboutMeError(validateAboutMe(val));
    }
  }

  function submitSetup(skipPhoto: boolean) {
    if (!agreed) {
      setShowError(true);
      return;
    }
    if (!skipPhoto && !hasPhoto) return;

    // Build FormData now before navigating (component unmounts on navigate)
    const basic = JSON.parse(sessionStorage.getItem("inai_setup_basic") ?? "{}") as Record<string, string>;
    const personal = JSON.parse(sessionStorage.getItem("inai_setup_personal") ?? "{}") as Record<string, string>;
    const fd = buildSetupFormData(basic, personal, aboutMeError ? "" : aboutMe, skipPhoto ? undefined : (photoFile ?? undefined));

    router.replace("/matches?welcome=1");

    // Fire in background — user is already navigating forward
    submitProfileSetup(fd)
      .then(() => clearDraftData())
      .catch(() => { /* user can re-enter details in profile */ });
  }

  const bullets = [
    t("Photo_protected"),
    t("Control_who_sees_photo"),
    t("Manage_in_settings"),
  ];

  return (
    <>
      {/* Mobile: StepProgress fixed at top */}
      <div className="mb-4 min-[500px]:hidden">
        <div className="fixed top-[68px] bg-mvp left-0 right-0 z-40 px-4 pb-2">
          <StepProgress currentStep={3} />
        </div>
      </div>

      <FormCardLayout
        bgColor="bg-mvp"
        paddingHorizontal="max-[500px]:px-0 px-4 md:px-6"
        childrenTopMargin="mt-6 md:mt-8"
        paddingBottom="max-[500px]:pb-0 pb-8 md:pb-10"
        footer={
          <>
            <div className="hidden min-[500px]:flex gap-5 w-full">
              <Button
                text={t("Skip")}
                onPress={() => submitSetup(true)}
                className={`flex-1 ${!agreed
                  ? "!bg-[#FFF] !text-[#999]"
                  : "!bg-[#FFF] !text-[#767676] hover:!bg-gray-50 active:!bg-gray-100"
                  }`}
              />
              <Button
                text={t("Save")}
                onPress={() => submitSetup(false)}
                className={`flex-1 ${!agreed || !hasPhoto
                  ? "!bg-[#BBBBBB] hover:!bg-[#BBBBBB] active:!bg-[#BBBBBB]"
                  : ""}`}
              />
            </div>

            <div className="hidden min-[500px]:flex mt-8 gap-3 md:gap-4 items-start">
              <button onClick={() => {
                setAgreed(prev => !prev);
                setShowError(false);
              }}>
                <CheckboxIcon checked={agreed} />
              </button>
              <span className="text-[14px] text-secondary4 font-poppins font-normal">
                I have read and agree to Inai&apos;s{" "}
                <button
                  type="button"
                  onClick={() => setOpenPrivacy(true)}
                  className="underline font-medium cursor-pointer"
                >
                  Privacy Policy
                </button>{" "}
                and understand how my information will be used to help me find a partner.
              </span>
            </div>

            {showError && (
              <p className="hidden min-[500px]:block mt-2 text-[12px] text-[#B31B38]">
                * Please agree to the terms and conditions
              </p>
            )}
          </>
        }
      >
        <div className="hidden min-[500px]:block">
          <StepProgress currentStep={3} />
        </div>

        <h1 className="max-[500px]:-mt-4 mt-6 md:mt-8 lg:mt-10 font-24 font-semibold text-dark leading-[150%] max-[500px]:text-left text-center">
          {t("Add_your_clear_photo")}
        </h1>

        {/* Desktop subtitle */}
        <p className="hidden min-[500px]:block mt-2 text-[14px] md:text-[16px] font-normal text-dark leading-[150%] text-center">
          {t("Photo_subtitle")}
        </p>

        {/* Photo circle — shared */}
        <div className="mt-6 sm:mt-8 flex flex-col min-[500px]:flex-row items-center justify-center gap-5 min-[500px]:gap-5">
          <div className="relative shrink-0 mx-auto min-[500px]:mx-0">
            <div
              className={`w-31 min-[500px]:w-41 pt-8 h-31 min-[500px]:h-41 overflow-hidden flex items-center justify-center ${hasPhoto ? "rounded-full" : "rounded-full bg-[#D9D9D9]"}`}
              style={!hasPhoto ? { border: "1.5px dashed #767676" } : {}}
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image
                  src={hasPhoto ? photoUrl! : placeholderSrc}
                  alt="Profile photo"
                  width={164}
                  height={164}
                  className="w-full h-full object-cover"
                  unoptimized
                  priority={!hasPhoto}
                />
              </button>
            </div>

            <div className="absolute bottom-1 right-1 px-2.5 py-2.5 rounded-full flex items-center justify-center transition-colors"
              style={{ background: hasPhoto ? "#B31B38" : "#767676" }}>
              <SecurityIcon />
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          {/* Desktop: bullets + button beside photo */}
          <div className="hidden min-[500px]:flex flex-col items-start">
            <div className="flex flex-col gap-2">
              {bullets.map((text) => (
                <div key={text} className="flex items-center gap-2">
                  <CheckmarkIcon stroke={hasPhoto ? "#B31B38" : "#222222"} />
                  <span className="text-[14px] md:text-[16px] font-normal text-dark leading-[150%]">{text}</span>
                </div>
              ))}
            </div>
            <div className="mt-[22px]">
              <Button
                text={hasPhoto ? t("Change_photo") : t("Add_photo")}
                iconLeft={<CameraIcon className={`w-4 h-4 ${hasPhoto ? "text-[#222222]" : "text-white"}`} />}
                onPress={() => fileInputRef.current?.click()}
                className={`!px-10 ${hasPhoto ? "!bg-white !text-[#222222] hover:!bg-gray-50" : ""}`}
              />
            </div>
          </div>
        </div>

        {/* Mobile: full-width Add photo button below circle */}
        <div className="min-[500px]:hidden mt-4">
          <Button
            text={hasPhoto ? t("Change_photo") : t("Add_photo")}
            iconLeft={<CameraIcon className={`w-4 h-4 ${hasPhoto ? "text-[#222222]" : "text-white"}`} />}
            onPress={() => fileInputRef.current?.click()}
            className={`!w-full ${hasPhoto ? "!bg-white !text-[#222222] hover:!bg-gray-50" : ""}`}
          />
        </div>

        {/* About me */}
        <div className="mt-8 sm:mt-12">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-medium text-dark">{t("About_me")}</p>
            <button
              type="button"
              onClick={() => {
                setIsSpinning(true);
                setTimeout(() => setIsSpinning(false), 600);
                const nextIndex = (templateIndex + 1) % ABOUT_ME_TEMPLATE_COUNT;
                setTemplateIndex(nextIndex);
                const suggestion = generateAboutMe({ ...buildAboutMeData(), templateIndex: nextIndex });
                handleAboutMeChange(suggestion);
              }}
              className="flex items-center gap-1 text-[13px] text-primary underline cursor-pointer hover:opacity-70 select-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-[15px] h-[15px] ${isSpinning ? "animate-spin" : ""}`}
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Try another
            </button>
          </div>
          <textarea
            value={aboutMe}
            onChange={(e) => handleAboutMeChange(e.target.value)}
            placeholder={t("About_me_placeholder")}
            className={`w-full mt-3 rounded-[12px] border text-[14px] md:text-[16px] font-normal text-dark placeholder:text-[#656565] resize-none outline-none focus:border-[#B31B38] transition-colors max-[500px]:h-[123px] h-[160px] md:h-[199px] p-3 sm:p-4 ${aboutMeError ? "border-[#B31B38]" : "border-[#767676]"}`}
          />
          <div className="flex text-[12px] md:text-[14px] justify-between mt-1 gap-2">
            <span className={aboutMeError ? "text-[#B31B38] font-medium flex-1" : "text-secondary4"}>
              {aboutMeError
                ? splitHighlight(aboutMeError.message, aboutMeError.offendingWord).map((seg, i) =>
                  seg.highlight
                    ? <span key={i} className="underline decoration-[0.5px] underline-offset-2">{seg.text}</span>
                    : <span key={i}>{seg.text}</span>
                )
                : t("Keep_it_genuine")}
            </span>
            <span className="text-secondary4 shrink-0">{wordCount} {t("Word_count")}</span>
          </div>
        </div>

        {/* Mobile: gray info box with subtitle + bullets + checkbox */}
        <div className="min-[500px]:hidden mt-6 p-4 rounded-[16px] bg-[#EAEAEA] flex flex-col gap-4">
          <p className="text-[14px] md:text-[16px] font-normal text-dark leading-[150%]">{t("Photo_subtitle")}</p>
          <div className="flex flex-col gap-3">
            {bullets.map((text) => (
              <div key={text} className="flex items-center gap-2">
                <CheckmarkIcon stroke={hasPhoto ? "#B31B38" : "#222222"} />
                <span className="text-[14px] md:text-[16px] font-normal text-dark leading-[150%]">{text}</span>
              </div>
            ))}
          </div>
          <div className="flex max-[500px]:gap-2 gap-3 items-start">
            <button onClick={() => { setAgreed(prev => !prev); setShowError(false); }}>
              <CheckboxIcon checked={agreed} />
            </button>
            <span className="text-[14px] text-secondary4 font-normal">
              I have read and agree to Inai&apos;s{" "}
              <button type="button" onClick={() => setOpenPrivacy(true)} className="underline font-medium cursor-pointer">
                Privacy Policy
              </button>{" "}
              and understand how my information will be used to help me find a partner.
            </span>
          </div>
          {showError && <p className="text-[14px] text-[#B31B38]">* Please agree to the terms and conditions</p>}
        </div>

        <PrivacyPopup
          isOpen={openPrivacy}
          onClose={() => setOpenPrivacy(false)}
        />

        {cropSrc && (
          <PhotoCropModal
            imageSrc={cropSrc}
            onConfirm={handleCropConfirm}
            onClose={() => setCropSrc(null)}
          />
        )}
      </FormCardLayout>

      {/* Mobile fixed bottom buttons (<500px) */}
      <div
        className="min-[500px]:hidden fixed bottom-0 left-0 right-0 px-4 py-2 flex flex-col gap-2"
        style={{ background: "rgba(255, 255, 255, 0.60)", backdropFilter: "blur(11px)" }}
      >
        <Button
          text={t("Save")}
          onPress={() => submitSetup(false)}
          className={`!w-full ${!agreed || !hasPhoto ? "!bg-[#525252] hover:!bg-[#BBBBBB] active:!bg-[#BBBBBB]" : ""}`}
        />
        <Button
          text={t("Skip")}
          onPress={() => submitSetup(true)}
          className={`!w-full ${!agreed ? "!bg-[#FFF] !text-[#999]" : "!bg-[#FFF] !text-[#767676] hover:!bg-gray-50 active:!bg-gray-100"}`}
        />
      </div>
    </>
  );
}

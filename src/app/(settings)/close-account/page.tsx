"use client";

import Link from "next/link";
import { useState } from "react";
import {
  EliteIcon,
  MatchHeartIcon,
  ProfileIcon,
  EyeOnIcon, EyeOffIcon,
  MessageIcon, RadioCircleIcon, PartnerPreferencesIcon
} from "@/src/assets/Icons";
import Button from "@/src/components/common-layout/Button";
import FormCardLayout from "@/src/components/common-layout/FormCardLayout";
import StepProgress from "@/src/components/more/StepProgress";
import InputBox from "@/src/components/common-layout/InputBox";

export default function CloseAccountPage() {
  const OPTIONS = [
    "❤️ Found my match through Inai Tamil",
    "💍 Found my match elsewhere",
    "🔒 Privacy or safety concerns",
    "😕 Not finding suitable matches",
    "⏸ Taking a long break from search",
    "✏️ Other reason",
  ];

  const LOSS_ITEMS = [
    {
      icon: ProfileIcon,
      title: "Profile & photos",
      subtitle: "Your complete profile and all uploaded images",
    },
    {
      icon: MessageIcon,
      title: "All conversations",
      subtitle: "Every message and chat history",
    },
    {
      icon: MatchHeartIcon,
      title: "Matches & interests",
      subtitle: "All received and sent interests",
    },
    {
      icon: EliteIcon,
      title: "Subscription & credits",
      subtitle: "Any remaining plan days or coins",
    },
    {
      icon: PartnerPreferencesIcon,
      title: "Partner preferences",
      subtitle: "All saved search filters and settings",
    },
  ];

  const HARD_PASSWORD = "Pass@1234";

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selected, setSelected] = useState<number>(0);
  const [otherText, setOtherText] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const canContinue = selected !== 5 || otherText.trim().length > 0;

  function handleContinue() {
    if (step === 1) {
      if (canContinue) setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
    }
  }

  function handleDelete() {
    if (password !== HARD_PASSWORD) {
      setPasswordError("*Incorrect Password");
      return;
    }

    setPasswordError("");
    // delete account action here
    console.log("Delete account confirmed");
  }

  return (
    <main className="select-none font-poppins min-h-screen bg-[#F8F5F2] pb-10">
      <div className="sticky top-[74px] z-10 w-full bg-white border-t border-[#EEEEEE]">
        <div className="flex justify-center items-center py-3 px-4">
          <div className="w-full max-w-[945px] px-0 md:px-8 lg:px-0">
            <StepProgress
              currentStep={step}
              text={["Reason", "Review", "Confirm"]}
            />
          </div>
        </div>
      </div>

      <FormCardLayout
        title={
          step === 1
            ? "Why are you leaving?"
            : step === 2
              ? "Your account will be permanently deleted in 30 days"
              : "Confirm your password to continue"
        }
        childrenTopMargin="mt-1"
        maxwidth="max-w-[945px]"
        paddingBottom="pb-4 sm:pb-5 md:pb-6"
      >
        <>
          <span className="select-none font-16 leading-[150%] text-dark">
            {step === 1
              ? "Help us improve for others. This only takes a moment."
              : step === 2
                ? "Once the 30-day grace period ends, this action cannot be undone. Here is exactly what you will lose:"
                : ""}
          </span>

          {step === 1 ? (
            <>
              <div className="mt-6 sm:mt-7 md:mt-8 flex flex-col gap-2">
                {OPTIONS.map((text, index) => (
                  <div
                    key={index}
                    onClick={() => setSelected(index)}
                    className="w-full bg-cartbox2 rounded-[20px] p-4 flex items-center gap-2 md:gap-3 cursor-pointer"
                  >
                    <RadioCircleIcon checked={selected === index} />
                    <span className="select-none font-16 leading-[150%] text-dark">
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              <textarea
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                disabled={selected !== 5}
                placeholder={
                  selected === 5
                    ? "Tell us more"
                    : "Please let us know what happened so we can keep our community safe."
                }
                className={`
                  w-full h-20 p-4 mt-4 sm:mt-5 md:mt-6 rounded-[20px]
                  border font-16 leading-[150%] resize-none outline-none
                  ${selected === 5
                    ? "border-[#767676] bg-[#F2F2F2] text-[#656565]"
                    : "border-[#767676] bg-[#F2F2F2] text-[#656565]"}
                  focus:border-[#B31B38]
                `}
              />
            </>
          ) : step === 2 ? (
            <div className="mt-4 sm:mt-5 md:mt-6 flex flex-col">
              {LOSS_ITEMS.map(({ icon: Icon, title, subtitle }) => (
                <div key={title} className="flex items-center gap-3 md:gap-4 py-3">
                  <Icon className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 shrink-0 text-dark" />
                  <div>
                    <div className="font-poppins font-18 font-medium leading-[150%] text-dark">
                      {title}
                    </div>
                    <div className="font-poppins font-16 font-normal leading-[150%] text-secondary4">
                      {subtitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 sm:mt-7 md:mt-8">
              <InputBox
                value={password}
                onChange={(val) => {
                  setPassword(val);
                  setPasswordError("");
                }}
                label="Password"
                type={showPassword ? "text" : "password"}
                className="bg-[#F2F2F2] border-[#F2F2F2]"
                error={passwordError}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="cursor-pointer"
                  >
                    {showPassword ? <EyeOnIcon /> : <EyeOffIcon />}
                  </button>
                }
              />
            </div>
          )}
        </>
      </FormCardLayout>

      <div className="px-4 md:px-10">
        <div className="w-full max-w-[945px] py-6 px-6 rounded-[20px] bg-light mx-auto">
          <>
            {step === 1 ? (
              <div className="mt-0">
                <span className="font-18 font-medium leading-[150%] text-dark">
                  You can hide your profile for a while instead. Your data stays safe and you can return any time.
                </span>
              </div>
            ) : step === 2 ? (
              <div>
                <span className="font-16 font-semibold leading-[150%] text-dark">
                  Data retention policy
                </span>
                <p className="mt-2 md:mt-4 font-16 font-normal leading-[150%] text-dark">
                  In compliance with data protection regulations, your data will be permanently erased 30 days after your closure request. You will receive a final confirmation email once the deletion is complete.
                </p>
              </div>
            ) : (
              <div>
                <span className="font-16 font-semibold leading-[150%] text-dark">
                  What happens next
                </span>
                <div className="mt-2 md:mt-4 flex flex-col gap-2 font-16 font-normal leading-[150%] text-dark">
                  <div>1. Your profile is hidden immediately from other members.</div>
                  <div>2. You will receive a confirmation email shortly.</div>
                  <div>3. Your data will be permanently deleted in 30 days.</div>
                  <div>4. To reactivate your account, simply log back in within the 30-day grace period.</div>
                </div>
              </div>
            )}

            <div className="mt-4 sm:mt-5 md:mt-6 flex max-[544px]:flex-col gap-4">
              {step === 1 ? (
                <Link href="/take-a-break" className="flex-1">
                  <Button
                    text="Pause my profile instead"
                    className="flex-1 w-full"
                  />
                </Link>
              ) : step === 2 ? (
                <Button
                  text="Go back"
                  onPress={() => setStep(1)}
                  className="flex-1 w-full !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]"
                />
              ) : (
                <Button
                  text="Cancel"
                  onPress={() => setStep(2)}
                  className="flex-1 w-full !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]"
                />
              )}

              {step === 1 ? (
                <Button
                  text="Continue"
                  onPress={handleContinue}
                  className="flex-1 !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]"
                />
              ) : step === 2 ? (
                <Button
                  text="Proceed to delete"
                  onPress={handleContinue}
                  className="flex-1"
                />
              ) : (
                <Button
                  text="Delete my account"
                  onPress={handleDelete}
                  className="flex-1"
                />
              )}
            </div>
          </>
        </div>
      </div>
    </main>
  );
}
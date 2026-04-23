"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, ChevronIcon } from "../../assets/Icons";
import Button from "../common/Button";
import CartBox from "../common/CartBox";
import NewToInaiCart from "../more/NewToInaiCart";
import { useLang } from "../../context/LangContext";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

type OtpFormProps = {
  variant?: "register" | "reset";
  searchParams?: {
    phone?: string;
    countryCode?: string;
    email?: string;
  };
};

export default function OtpForm({ variant = "register", searchParams }: OtpFormProps) {
  const router = useRouter();
  const { t } = useLang();

  const phone = searchParams?.phone ?? "";
  const countryCode = searchParams?.countryCode ?? "";
  const email = searchParams?.email ?? "";

  const [method, setMethod] = useState<"sms" | "email">(phone ? "sms" : "email");
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [countdown, setCountdown] = useState(() => {
    if (typeof window === "undefined") return RESEND_SECONDS;

    const sentAt = Number(sessionStorage.getItem("otp_sent_at") ?? 0);
    if (!sentAt) return RESEND_SECONDS;

    const elapsed = Math.floor((Date.now() - sentAt) / 1000);
    return Math.max(0, RESEND_SECONDS - elapsed);
  });

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError("");
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleVerify = () => {
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      setError(t("Please_enter_the_complete_OTP"));
      triggerShake();
      return;
    }
    if (otp === "123456") {
      setSuccess(true);
      setTimeout(() => router.push(variant === "reset" ? "/reset-password" : "/dashboard"), 1000);
    } else {
      setError(t("Invalid_OTP_Please_try_again"));
      triggerShake();
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    sessionStorage.setItem("otp_sent_at", String(Date.now()));
    setCountdown(RESEND_SECONDS);
    setDigits(Array(OTP_LENGTH).fill(""));
    setError("");
    inputRefs.current[0]?.focus();
  };

  const formattedTimer = `${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(countdown % 60).padStart(2, "0")}`;
  const fullPhone = countryCode && phone ? `${countryCode.replace(/[()]/g, "")} ${phone}` : "";

  const benefits = [
    t("Benefit_1"),
    t("Benefit_2"),
    t("Benefit_3"),
  ];

  return (
    <div className="w-full flex items-left justify-center px-4 py-8 bg-[#F8F5F2] font-poppins">
      <div className="w-full max-w-[784px] flex flex-col items-left">

        {/* ── Card 1: Verify ── */}
        <div className="w-full rounded-[20px] bg-white pt-6 md:pt-8 px-4 md:px-6 pb-4 md:pb-6">

          {/* Title */}
          <h1 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-semibold text-[#222] leading-[150%]">
            {variant === "reset" ? t("Enter_your_reset_code") : t("Verify_your_phone")}
          </h1>

          {/* Description */}
          <p className="mt-6 md:mt-10 text-[14px] sm:text-[16px] md:text-[18px] font-normal text-[#222] leading-[150%]">
            {method === "sms" ? (
              <>
                {t("We_sent_code_to")}{" "}
                <span className="font-semibold select-none">{fullPhone}</span>{" "}
                {t("via_SMS_verify_below")}
              </>
            ) : (
              <>
                {t("We_sent_code_to")}{" "}
                <span className="font-semibold select-none">{email || "your email"}</span>.{" "}
                {t("email_verify_below")}
              </>
            )}
          </p>

          {/* OTP Boxes */}
          <div
            className={`select-none mt-8 md:mt-12 flex gap-2 sm:gap-3 md:gap-3 ${shake ? "animate-shake" : ""}`}
            onPaste={handlePaste}
          >
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`flex-1 max-w-[42px] sm:max-w-[50px] md:max-w-[56px] text-center py-3 md:py-4 rounded-[10px] sm:rounded-[11px] md:rounded-[12px] border text-[16px] md:text-[18px] font-medium text-[#242424] outline-none transition-colors duration-150
                  ${error
                    ? "border-[#B31B38] bg-[#fff5f7]"
                    : digit
                      ? "border-[#B31B38] bg-[#F0F0F0]"
                      : "border-white bg-[#F0F0F0] focus:border-[#B31B38]"
                  }
                  ${success ? "!border-[#16a34a] !bg-[#f0fdf4]" : ""}
                `}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <p className="mt-3 text-[12px] text-[#B31B38]">{error}</p>
          )}

          {/* Success */}
          {success && (
            <p className="mt-3 text-[13px] text-[#16a34a] font-medium">
              {t("Verified_Redirecting")}
            </p>
          )}

          {/* Timer + Resend */}
          <div className="mt-3 flex">
            <span className="text-[12px] sm:text-[14px] md:text-[16px] font-normal text-[#222] leading-[150%]">
              {t("Code_expires_in")}{" "}
              <span className="font-medium">{formattedTimer}</span>
            </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0}
              className={`ml-3 text-[12px] sm:text-[14px] md:text-[16px] font-medium leading-[150%] underline transition-colors select-none
                ${countdown > 0
                  ? "text-[#B31B38] opacity-40 cursor-default"
                  : "text-[#B31B38] cursor-pointer hover:text-[#8E162D]"
                }`}
            >
              {t("Resend_code")}
            </button>
          </div>

          {/* Buttons */}
          <div className="mt-10 md:mt-12 flex gap-3 md:gap-5 w-full">
            <Button
              text={t("Back")}
              onPress={() => router.back()}
              className={`flex-1 ${variant === "reset"
                ? "!bg-white !text-[#222222] hover:!bg-[#F8F8F8]"
                : "!bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]"
                }`}
            />
            <Button
              text={t("Next")}
              onPress={handleVerify}
              icon={<ArrowRightIcon />}
              className="flex-1"
            />
          </div>

          {variant === "register" && (
            <div className="mt-4 flex">
              <span className="text-[12px] sm:text-[14px] md:text-[16px] font-normal text-[#222] leading-[150%]">
                {method === "sms" ? t("Dont_receive_OTP_via_SMS") : t("Dont_receive_OTP_via_Email")}
              </span>
              <button
                type="button"
                onClick={() => {
                  setMethod(method === "sms" ? "email" : "sms");
                  setDigits(Array(OTP_LENGTH).fill(""));
                  setError("");
                }}
                className="ml-2 flex items-center text-[12px] sm:text-[14px] md:text-[16px] font-medium text-[#222] underline leading-[150%] cursor-pointer hover:opacity-70 select-none"
              >
                {method === "sms" ? t("Verify_via_Email") : t("Verify_via_SMS")}
                <ChevronIcon open={false} className="ml-1 w-3 h-3 md:w-4 md:h-4 rotate-270" />
              </button>
            </div>
          )}
        </div>

        {variant === "register" ? (
          <CartBox className="mt-8 text-[12px] sm:text-[14px] md:text-[16px]">
            <p className="font-semibold text-[#222] leading-[150%]">
              {t("Benefits_of_verification")}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[#222] mt-[3px] shrink-0">•</span>
                  <span className="font-normal text-[#222] leading-[150%]">{benefit}</span>
                </div>
              ))}
            </div>
          </CartBox>
        ) : (
          <NewToInaiCart className="mt-8" />
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, ChevronIcon } from "../../assets/Icons";
import Button from "../common-layout/Button";
import NewToInaiCart from "./NewToInaiCart";
import { useLang } from "../../context/LangContext";
import { verifyOtp, resendOtp, forgotPassword } from "../../lib/api/auth";
import { ApiError } from "../../lib/api/client";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 300;

type OtpFormProps = {
  variant?: "register" | "reset";
  searchParams?: {
    phone?: string;
    countryCode?: string;
    email?: string;
  };
};

function getSecondsRemaining(storageKey: string): number {
  if (typeof window === "undefined") return 0;
  const sentAt = Number(sessionStorage.getItem(storageKey) ?? 0);
  if (!sentAt) return 0;
  return Math.max(0, RESEND_SECONDS - Math.floor((Date.now() - sentAt) / 1000));
}

export default function OtpForm({ variant = "register", searchParams }: OtpFormProps) {
  const router = useRouter();
  const { t } = useLang();

  const phone = searchParams?.phone ?? "";
  const countryCode = searchParams?.countryCode ?? "";
  const email = searchParams?.email ?? "";

  const [method, setMethod] = useState<"sms" | "email">(
    variant === "register" ? "email" : (phone ? "sms" : "email")
  );
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Independent countdown per channel — each tracks its own sent_at timestamp
  const [emailCountdown, setEmailCountdown] = useState(() => getSecondsRemaining("otp_email_sent_at"));
  const [smsCountdown, setSmsCountdown] = useState(() => getSecondsRemaining("otp_sms_sent_at"));

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Email countdown tick
  useEffect(() => {
    if (emailCountdown <= 0) return;
    const id = window.setTimeout(() => setEmailCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [emailCountdown]);

  // SMS countdown tick
  useEffect(() => {
    if (smsCountdown <= 0) return;
    const id = window.setTimeout(() => setSmsCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [smsCountdown]);

  const countdown = method === "email" ? emailCountdown : smsCountdown;

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

  const handleVerify = async () => {
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      setError(t("Please_enter_the_complete_OTP"));
      triggerShake();
      return;
    }
    setLoading(true);
    try {
      if (variant === "register") {
        const registrationKey = sessionStorage.getItem("inai_reg_key") ?? undefined;
        const res = await verifyOtp({ otp, registrationKey });
        sessionStorage.setItem("inai_temp_token", res.tempToken);
        sessionStorage.removeItem("inai_reg_key");
        setSuccess(true);
        router.replace("/create-password");
      } else {
        const identifier = sessionStorage.getItem("inai_reset_identifier") ?? undefined;
        const res = await verifyOtp({ otp, identifier });
        sessionStorage.setItem("inai_temp_token", res.tempToken);
        setSuccess(true);
        router.replace("/reset-password");
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : t("Invalid_OTP_Please_try_again");
      setError(message);
      triggerShake();
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Switching to SMS sends OTP immediately (first time only — no waiting)
  const handleSwitchToSms = async () => {
    setMethod("sms");
    setDigits(Array(OTP_LENGTH).fill(""));
    setError("");
    // If SMS already sent, don't re-send — just switch view
    if (smsCountdown > 0) return;
    try {
      const registrationKey = sessionStorage.getItem("inai_reg_key") ?? "";
      await resendOtp(registrationKey, "sms");
    } catch { /* silently ignore */ }
    sessionStorage.setItem("otp_sms_sent_at", String(Date.now()));
    setSmsCountdown(RESEND_SECONDS);
  };

  const handleSwitchToEmail = () => {
    setMethod("email");
    setDigits(Array(OTP_LENGTH).fill(""));
    setError("");
    // No re-send on switching back — email is already running
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      if (variant === "register") {
        const registrationKey = sessionStorage.getItem("inai_reg_key") ?? "";
        await resendOtp(registrationKey, method);
      } else {
        const identifier = sessionStorage.getItem("inai_reset_identifier") ?? "";
        await forgotPassword({ identifier, method: "email" });
      }
    } catch { /* silently ignore */ }

    const now = String(Date.now());
    if (method === "email") {
      sessionStorage.setItem("otp_email_sent_at", now);
      setEmailCountdown(RESEND_SECONDS);
    } else {
      sessionStorage.setItem("otp_sms_sent_at", now);
      setSmsCountdown(RESEND_SECONDS);
    }
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
    <div className="w-full flex items-left justify-center px-4 py-8 bg-mvp font-poppins">
      <div className="w-full max-w-[784px] flex flex-col items-left">

        {/* ── Card 1: Verify ── */}
        <div className="w-full rounded-[20px] bg-light pt-6 md:pt-8 px-4 md:px-6 pb-4 md:pb-6">

          {/* Title */}
          <h1 className="font-24 font-semibold text-dark leading-[150%]">
            {variant === "reset"
              ? t("Enter_your_reset_code")
              : method === "email"
              ? t("Verify_your_email")
              : t("Verify_your_phone")}
          </h1>

          {/* Description */}
          <p className="mt-5 sm:mt-6 md:mt-8 lg:mt-10 font-18 font-normal text-dark leading-[150%]">
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
                className={`flex-1 max-w-[42px] sm:max-w-[50px] md:max-w-[56px] text-center py-3 md:py-4 rounded-[10px] sm:rounded-[11px] md:rounded-[12px] border text-[16px] md:text-[18px] font-medium text-dark2 outline-none transition-colors duration-150
                  ${error
                    ? "border-[#B31B38] bg-[#fff5f7]"
                    : digit
                      ? "border-[#F0F0F0] bg-[#F0F0F0]"
                      : "border-white bg-[#F0F0F0] focus:border-[#B31B38]"
                  }
                  ${success ? "!border-[#16a34a] !bg-[#f0fdf4]" : ""}
                `}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <p className="mt-3 text-[12px] text-primary">{error}</p>
          )}

          {/* Success */}
          {success && (
            <p className="mt-3 text-[12px] text-[#16a34a] font-medium">
              {t("Verified_Redirecting")}
            </p>
          )}

          {/* Timer + Resend */}
          <div className="mt-3 flex">
            <span className="font-16 font-normal text-dark leading-[150%]">
              {t("Code_expires_in")}{" "}
              <span className="font-medium">{formattedTimer}</span>
            </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0}
              className={`ml-3 font-16 font-medium leading-[150%] underline transition-colors select-none
                ${countdown > 0
                  ? "text-[#B31B38] opacity-40 cursor-default"
                  : "text-[#B31B38] cursor-pointer hover:text-[#8E162D] active:text-[#6F1023]"
                }`}
            >
              {t("Resend_code")}
            </button>
          </div>

          {/* Buttons */}
          <div className="mt-10 md:mt-12 flex gap-3 md:gap-5 w-full">
            {variant === "reset" && (
              <Button
                text={t("Back")}
                onPress={() => router.back()}
                className="flex-1 !bg-white !text-[#222222] hover:!bg-[#F8F8F8]"
              />
            )}
            <Button
              text={loading ? "Verifying..." : t("Next")}
              onPress={handleVerify}
              icon={loading ? undefined : <ArrowRightIcon />}
              className="flex-1"
            />
          </div>

          {variant === "register" && (
            <div className="mt-4 flex">
              <span className="font-16 font-normal text-dark leading-[150%]">
                {method === "sms" ? t("Dont_receive_OTP_via_SMS") : t("Dont_receive_OTP_via_Email")}
              </span>
              <button
                type="button"
                onClick={method === "sms" ? handleSwitchToEmail : handleSwitchToSms}
                className="ml-2 flex items-center font-16 font-medium text-dark underline leading-[150%] cursor-pointer hover:opacity-70 select-none"
              >
                {method === "sms" ? t("Verify_via_Email") : t("Verify_via_SMS")}
                <ChevronIcon open={false} className="ml-1 w-3 h-3 md:w-4 md:h-4 rotate-270" />
              </button>
            </div>
          )}
        </div>

        {variant === "register" ? (
          <div className="w-full rounded-[18px] md:rounded-[20px] bg-[#EAEAEA] p-4 md:p-6 mt-8 font-16">
            <p className="font-semibold text-dark leading-[150%]">
              {t("Benefits_of_verification")}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-dark mt-[3px] shrink-0">•</span>
                  <span className="font-normal text-dark leading-[150%]">{benefit}</span>
                </div>
              ))}
            </div>
           </div>
        ) : (
          <NewToInaiCart className="mt-8" />
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "../../assets/Icons";
import Button from "../common-layout/Button";
import { sendIdentityVerifyOtp, confirmIdentityVerifyOtp } from "../../lib/api/user";
import { invalidateMeCache } from "../AppHeader";
import { ApiError } from "../../lib/api/client";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 300;

function getSecondsRemaining(key: string): number {
  if (typeof window === "undefined") return 0;
  const sentAt = Number(sessionStorage.getItem(key) ?? 0);
  if (!sentAt) return 0;
  return Math.max(0, RESEND_SECONDS - Math.floor((Date.now() - sentAt) / 1000));
}

type Props = {
  method: "phone" | "email";
  maskedIdentifier: string;
};

export default function VerifyIdentityOtp({ method, maskedIdentifier }: Props) {
  const router = useRouter();
  const storageKey = method === "phone" ? "otp_verify_phone_sent_at" : "otp_verify_email_sent_at";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown tick
  useEffect(() => {
    if (countdown <= 0) return;
    const id = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  // Auto-send OTP on mount.
  // Write timestamp BEFORE the API call so that React Strict Mode's double-effect
  // and any rapid remounts see the timer and skip the second send.
  useEffect(() => {
    const remaining = getSecondsRemaining(storageKey);
    if (remaining > 0) {
      setCountdown(remaining);
      inputRefs.current[0]?.focus();
      return;
    }
    const sentAt = String(Date.now());
    sessionStorage.setItem(storageKey, sentAt);
    setCountdown(RESEND_SECONDS);

    sendIdentityVerifyOtp(method)
      .then(() => {
        inputRefs.current[0]?.focus();
      })
      .catch((err) => {
        sessionStorage.removeItem(storageKey);
        setCountdown(0);
        const msg = err instanceof ApiError ? err.message : "Failed to send OTP. Please go back and try again.";
        setError(msg);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    setError("");
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      await sendIdentityVerifyOtp(method);
      sessionStorage.setItem(storageKey, String(Date.now()));
      setCountdown(RESEND_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(""));
      setError("");
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to resend OTP.");
    }
  };

  const handleVerify = async () => {
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      setError("Please enter the complete OTP.");
      triggerShake();
      return;
    }
    setLoading(true);
    try {
      await confirmIdentityVerifyOtp(method, otp);
      invalidateMeCache();
      sessionStorage.removeItem(storageKey);
      setSuccess(true);
      router.replace("/trust-badge");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid OTP. Please try again.");
      triggerShake();
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const formattedTimer = `${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(countdown % 60).padStart(2, "0")}`;

  const benefits = [
    "Verified members get 3× more profile views",
    "Your profile is shown in trusted member searches",
    "Build trust with potential matches",
  ];

  return (
    <div className="w-full flex items-left justify-center px-4 py-8 bg-mvp font-poppins">
      <div className="w-full max-w-[784px] flex flex-col items-left">

        {/* Card: Verify */}
        <div className="w-full rounded-[20px] bg-light pt-6 md:pt-8 px-4 md:px-6 pb-4 md:pb-6">
          <h1 className="font-24 font-semibold text-dark leading-[150%]">
            {method === "phone" ? "Verify your phone" : "Verify your email"}
          </h1>

          <p className="mt-5 sm:mt-6 md:mt-8 lg:mt-10 font-18 font-normal text-dark leading-[150%]">
            {method === "phone" ? "We sent a WhatsApp code to" : "We sent a code to"}{" "}
            <span className="font-semibold select-none">{maskedIdentifier}</span>.{" "}
            Enter it below to verify.
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

          {error && <p className="mt-3 text-[12px] text-primary">{error}</p>}
          {success && <p className="mt-3 text-[12px] text-[#16a34a] font-medium">Verified! Redirecting…</p>}

          {/* Timer + Resend */}
          <div className="mt-3 flex">
            <span className="font-16 font-normal text-dark leading-[150%]">
              Code expires in <span className="font-medium">{formattedTimer}</span>
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
              Resend code
            </button>
          </div>

          {/* Buttons */}
          <div className="mt-10 md:mt-12 flex gap-3 md:gap-5 w-full">
            <Button
              text="Back"
              onPress={() => router.back()}
              className="flex-1 !bg-white !text-[#222222] hover:!bg-[#F8F8F8]"
            />
            <Button
              text={loading ? "Verifying..." : "Done"}
              onPress={handleVerify}
              // icon={loading ? undefined : <ArrowRightIcon />}
              className="flex-1"
            />
          </div>
        </div>

        {/* Benefits card */}
        <div className="w-full rounded-[18px] md:rounded-[20px] bg-[#EAEAEA] p-4 md:p-6 mt-8 font-16">
          <p className="font-semibold text-dark leading-[150%]">Benefits of verification</p>
          <div className="mt-4 flex flex-col gap-2">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-dark mt-[3px] shrink-0">•</span>
                <span className="font-normal text-dark leading-[150%]">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

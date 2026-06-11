"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRightIcon } from "@/src/assets/Icons";
import Footer from "@/src/components/Footer";
import Button from "@/src/components/common-layout/Button";
import InputBox from "@/src/components/common-layout/InputBox";
import CountryCodeSelect from "@/src/components/more/CountryCodeSelect";
import FormCardLayout from "@/src/components/common-layout/FormCardLayout";
import { readMeCache, writeMeCache, invalidateMeCache } from "@/src/components/AppHeader";
import { COUNTRIES } from "@/src/constants/countries";
import { sanitizePhoneInput, validatePhone, validateEmail } from "@/src/utils/validation";
import { ApiError } from "@/src/lib/api/client";
import {
  requestEmailChange, confirmEmailChange,
  requestPhoneChange, confirmPhoneChange,
  getMe,
} from "@/src/lib/api/user";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 300;

function formatTimer(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

type Step = "request" | "otp";

function ChangeContactContent() {
  const router = useRouter();
  const params = useSearchParams();
  const type = params.get("type") === "email" ? "email" : "phone";

  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  const me = readMeCache();
  const currentValue = type === "email" ? (me?.email ?? "") : (me?.phone ?? "");
  const currentDisplay = mounted ? currentValue : "";

  // Step 1 — request
  const [step, setStep] = useState<Step>("request");
  const [value, setValue] = useState("");
  const [countryCode, setCountryCode] = useState(() => {
    const current = me?.countryCode;
    if (!current) return COUNTRIES[0];
    return COUNTRIES.find((c) => c.includes(`(${current})`)) ?? COUNTRIES[0];
  });
  const [countryOpen, setCountryOpen] = useState(false);
  const [inputError, setInputError] = useState("");
  const [requesting, setRequesting] = useState(false);

  // Step 2 — OTP
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  // Anchor countdown to absolute end timestamp — no drift
  const [countdownEnd, setCountdownEnd] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Tick every 500ms — Date.now() lives inside effect, not render body
  useEffect(() => {
    if (countdownEnd === 0) return;
    function tick() { setCountdown(Math.max(0, Math.round((countdownEnd - Date.now()) / 1000))); }
    tick();
    const id = window.setInterval(tick, 500);
    return () => clearInterval(id);
  }, [countdownEnd]);

  function extractCode(raw: string) {
    return raw.match(/\+\d+/)?.[0] ?? raw;
  }

  async function handleRequest() {
    const trimmed = value.trim();
    if (!trimmed) { setInputError("Please enter a value."); return; }

    if (type === "email") {
      const { error: emailErr, warning: emailWarn } = validateEmail(trimmed);
      if (emailErr) { setInputError(emailErr); return; }
      if (emailWarn) { setInputError(emailWarn); return; }
      if (trimmed.toLowerCase() === currentValue.toLowerCase()) {
        setInputError("This is already your current email address.");
        return;
      }
    } else {
      const phoneErr = validatePhone(trimmed, countryCode);
      if (phoneErr) { setInputError(phoneErr); return; }
      const code = extractCode(countryCode);
      if (trimmed === currentValue && code === (me?.countryCode ?? "")) {
        setInputError("This is already your current phone number.");
        return;
      }
    }

    setRequesting(true);
    setInputError("");
    try {
      if (type === "email") {
        await requestEmailChange(trimmed);
      } else {
        await requestPhoneChange(trimmed, extractCode(countryCode));
      }
      setStep("otp");
      setCountdownEnd(Date.now() + RESEND_SECONDS * 1000);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      setInputError(err instanceof ApiError ? err.message : "Failed to send OTP. Please try again.");
    } finally {
      setRequesting(false);
    }
  }

  async function handleResend() {
    if (Date.now() < countdownEnd) return;
    try {
      if (type === "email") {
        await requestEmailChange(value.trim());
      } else {
        await requestPhoneChange(value.trim(), extractCode(countryCode));
      }
      setCountdownEnd(Date.now() + RESEND_SECONDS * 1000);
      setDigits(Array(OTP_LENGTH).fill(""));
      setOtpError("");
      inputRefs.current[0]?.focus();
    } catch (err) {
      setOtpError(err instanceof ApiError ? err.message : "Failed to resend OTP.");
    }
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  function handleDigitChange(index: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[index] = val;
    setDigits(next);
    setOtpError("");
    if (val && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) inputRefs.current[index - 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  async function handleVerify() {
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) { setOtpError("Please enter the complete OTP."); triggerShake(); return; }
    setVerifying(true);
    try {
      if (type === "email") {
        await confirmEmailChange(value.trim(), otp);
      } else {
        await confirmPhoneChange(value.trim(), extractCode(countryCode), otp);
      }
      setSuccess(true);
      invalidateMeCache();
      const fresh = await getMe();
      writeMeCache(fresh);
      router.replace("/my-profile");
    } catch (err) {
      setOtpError(err instanceof ApiError ? err.message : "Invalid OTP. Please try again.");
      triggerShake();
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  }

  const label = type === "email" ? "Email" : "Phone number";

  const newValueDisplay = type === "email" ? value.trim() : `${extractCode(countryCode)} ${value.trim()}`.trim();

  // ── Step 1: Request ────────────────────────────────────────────────────────
  if (step === "request") {
    return (
      <>
      <FormCardLayout
        title={`Change your ${label}`}
        subtitle={currentDisplay ? `Are you sure you want to change from ${currentDisplay}?` : `Enter your new ${label.toLowerCase()}`}
        footer={
          <div className="flex max-[355px]:flex-col-reverse gap-3">
            <Button
              text="Go back"
              onPress={() => router.back()}
              className="flex-1 !bg-white !text-[#222222] hover:!bg-[#F8F8F8]"
            />
            <Button
              text={requesting ? "Sending…" : "Next"}
              icon={requesting ? undefined : <ArrowRightIcon />}
              onPress={handleRequest}
              disabled={requesting}
              className="flex-1"
            />
          </div>
        }
      >
        {type === "phone" ? (
          <div className="flex flex-col gap-5">
            <CountryCodeSelect
              value={countryCode}
              onChange={setCountryCode}
              open={countryOpen}
              setOpen={setCountryOpen}
              label="Country code"
            />
            <InputBox
              value={value}
              onChange={(v) => { setValue(sanitizePhoneInput(v, countryCode)); setInputError(""); }}
              label={`New ${label}`}
              type="tel"
              className="bg-cartbox2 border-gray1"
              error={inputError}
            />
          </div>
        ) : (
          <InputBox
            value={value}
            onChange={(v) => { setValue(v); setInputError(""); }}
            label={`New ${label}`}
            type="email"
            className="bg-cartbox2 border-gray1"
            error={inputError}
          />
        )}
      </FormCardLayout>
      <Footer variant="app" />
    </>
    );
  }

  // ── Step 2: OTP ────────────────────────────────────────────────────────────
  return (
    <>
    <FormCardLayout

      title={`Verify your new ${label}`}
      subtitle={`We sent a verification code to ${newValueDisplay}. Enter it below to confirm the change.`}
      footer={
        <div className="flex gap-3">
          <Button
            text="Go back"
            onPress={() => { setStep("request"); setDigits(Array(OTP_LENGTH).fill("")); setOtpError(""); }}
            className="flex-1 !bg-white !text-[#222222] hover:!bg-[#F8F8F8]"
          />
          <Button
            text={verifying ? "Verifying…" : "Confirm change"}
            icon={verifying ? undefined : <ArrowRightIcon />}
            onPress={handleVerify}
            className="flex-1"
          />
        </div>
      }
    >

      {/* OTP boxes */}
      <div
        className={`flex gap-2 sm:gap-3 ${shake ? "animate-shake" : ""}`}
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
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleDigitKeyDown(i, e)}
            className={`flex-1 max-w-[42px] sm:max-w-[50px] md:max-w-[56px] text-center py-3 md:py-4 rounded-[10px] sm:rounded-[11px] md:rounded-[12px] border text-[16px] md:text-[18px] font-medium text-dark2 outline-none transition-colors duration-150
              ${otpError
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

      {otpError && <p className="mt-3 text-[12px] text-primary">{otpError}</p>}
      {success && <p className="mt-3 text-[12px] text-[#16a34a] font-medium">Verified! Redirecting…</p>}

      <div className="mt-3 flex items-center gap-3">
        <span className="font-poppins font-16 font-normal text-dark leading-[150%]">
          Code expires in <span className="font-medium">{formatTimer(countdown)}</span>
        </span>
        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0}
          className={`font-poppins font-16 font-medium leading-[150%] underline transition-colors select-none
            ${countdown > 0 ? "text-[#B31B38] opacity-40 cursor-default" : "text-[#B31B38] cursor-pointer hover:text-[#8E162D]"}`}
        >
          Resend
        </button>
      </div>
    </FormCardLayout>
    <Footer variant="app" />
    </>
  );
}

export default function ChangeContactPage() {
  return (
    <Suspense>
      <ChangeContactContent />
    </Suspense>
  );
}

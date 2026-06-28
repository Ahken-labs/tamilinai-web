"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "../../hooks/useScrollLock";

import { CloseCircleIcon, EyeOffIcon, EyeOnIcon } from "../../assets/Icons";
import InputBox from "../common-layout/InputBox";
import Button from "../common-layout/Button";
import { http } from "../../lib/api/client";
import { useLoadingText } from "@/src/hooks/useLoadingText";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ChangePasswordPopup({ isOpen, onClose }: Props) {
  useScrollLock(isOpen);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const loadingText = useLoadingText(submitting, "save");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const currentPasswordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const passwordRules = useMemo(
    () => [
      {
        key: "length",
        label: "8+ characters",
        met: newPassword.length >= 8,
      },
      {
        key: "uppercase",
        label: "One uppercase letter",
        met: /[A-Z]/.test(newPassword),
      },
      {
        key: "number",
        label: "One number",
        met: /\d/.test(newPassword),
      },
      {
        key: "symbol",
        label: "One symbol",
        met: /[^A-Za-z0-9]/.test(newPassword),
      },
    ],
    [newPassword]
  );

  const allRulesMet = passwordRules.every((rule) => rule.met);
  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const showPasswordRules =
    newPasswordFocused ||
    confirmFocused ||
    newPassword.length > 0 ||
    confirmPassword.length > 0 ||
    submitted;

  const showMatchLine =
    confirmFocused ||
    confirmPassword.length > 0 ||
    newPassword.length > 0 ||
    submitted;

  useEffect(() => {
    return () => {
      if (currentPasswordTimer.current) clearTimeout(currentPasswordTimer.current);
    };
  }, []);

  if (!isOpen) return null;

  function handleCurrentPasswordBlur() {
    if (currentPasswordTimer.current) clearTimeout(currentPasswordTimer.current);
    currentPasswordTimer.current = setTimeout(() => {
      if (!currentPassword.trim()) setCurrentPasswordError("*Current password is required");
    }, 300);
  }

  function handleNewPasswordBlur() {
    setNewPasswordFocused(false);
    if (newPassword.length > 0 && !allRulesMet) {
      setSubmitted(true);
    }
  }

  function handleConfirmBlur() {
    setConfirmFocused(false);
  }

  async function handleUpdatePassword() {
    setSubmitted(true);

    let hasError = false;

    if (!currentPassword.trim()) {
      setCurrentPasswordError("*Current password is required");
      hasError = true;
    } else {
      setCurrentPasswordError("");
    }

    if (!newPassword.trim()) {
      setNewPasswordError("*Password is required");
      hasError = true;
    } else if (!allRulesMet) {
      setNewPasswordError("*Password does not meet requirements");
      hasError = true;
    } else if (newPassword === currentPassword) {
      setNewPasswordError("*New password must be different from current password");
      hasError = true;
    } else {
      setNewPasswordError("");
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("*Please confirm your new password");
      hasError = true;
    } else if (confirmPassword !== newPassword) {
      setConfirmPasswordError("*Passwords do not match");
      hasError = true;
    } else {
      setConfirmPasswordError("");
    }

    if (hasError) return;

    setSubmitting(true);
    try {
      await http("/api/user/profile/password", {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setCurrentPasswordError(msg.toLowerCase().includes("incorrect") || msg.toLowerCase().includes("current")
        ? `*${msg}`
        : "");
      if (!msg.toLowerCase().includes("incorrect") && !msg.toLowerCase().includes("current")) {
        setNewPasswordError(`*${msg}`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-[784px] flex-col overflow-hidden rounded-[20px] bg-light shadow-2xl">
        <div className="flex items-center justify-between self-stretch border-b border-[#EAEAEA] px-4 pb-2 pt-4 md:pb-4 md:pt-6">
          <div className="flex items-center justify-center">
            <span className="font-poppins font-24 font-semibold leading-[150%] text-dark">
              Change password
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 cursor-pointer"
            aria-label="Close"
          >
            <CloseCircleIcon className="h-8 w-8 transition-transform duration-200 hover:scale-110 active:scale-95" />
          </button>
        </div>

        <div className="px-4 pb-4 pt-4 md:px-6 md:pb-6">
          <InputBox
            value={currentPassword}
            onChange={(val) => {
              setCurrentPassword(val);
              setCurrentPasswordError("");
              if (currentPasswordTimer.current) {
                clearTimeout(currentPasswordTimer.current);
              }
            }}
            onBlur={handleCurrentPasswordBlur}
            label="Current password"
            type={showCurrentPassword ? "text" : "password"}
            className="border-[#F2F2F2] bg-[#F2F2F2]"
            error={currentPasswordError}
            suffix={
              <button
                type="button"
                onClick={() => setShowCurrentPassword((v) => !v)}
                className="cursor-pointer"
              >
                {showCurrentPassword ? <EyeOnIcon /> : <EyeOffIcon />}
              </button>
            }
          />

          <div className="my-6 border-b border-[#EAEAEA]" />

          <InputBox
            value={newPassword}
            onChange={(val) => {
              setNewPassword(val);
              setNewPasswordError("");
            }}
            onFocus={() => setNewPasswordFocused(true)}
            onBlur={handleNewPasswordBlur}
            label="Create new password"
            type={showNewPassword ? "text" : "password"}
            className="border-[#F2F2F2] bg-[#F2F2F2]"
            error={newPasswordError}
            suffix={
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                className="cursor-pointer"
              >
                {showNewPassword ? <EyeOnIcon /> : <EyeOffIcon />}
              </button>
            }
          />

          {showPasswordRules && (
            <div className="mt-3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {passwordRules.map((rule) => {
                  const textClass = rule.met
                    ? "text-green"
                    : submitted || (!newPasswordFocused && newPassword.length > 0)
                      ? "text-primary"
                      : "text-secondary4";

                  return (
                    <div
                      key={rule.key}
                      className={`text-[14px] font-normal leading-[125%] ${textClass}`}
                    >
                      • {rule.label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-4 md:mt-6">
            <InputBox
              value={confirmPassword}
              onChange={(val) => {
                setConfirmPassword(val);
                setConfirmPasswordError("");
              }}
              onFocus={() => setConfirmFocused(true)}
              onBlur={handleConfirmBlur}
              label="Re-enter new password"
              type={showConfirmPassword ? "text" : "password"}
              className="border-[#F2F2F2] bg-[#F2F2F2]"
              error={confirmPasswordError}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOnIcon /> : <EyeOffIcon />}
                </button>
              }
            />

            {showMatchLine && confirmPassword.length > 0 && newPassword.length > 0 && (
              <div
                className={`mt-3 text-[14px] font-normal leading-[125%] ${
                  passwordsMatch ? "text-green" : "text-primary"
                }`}
              >
                • Passwords match
              </div>
            )}
          </div>

          <div className="mt-8 flex w-full min-[500px]:gap-4 sm:mt-10 md:mt-12">
            <div className="min-[500px]:flex-1" />
            <Button
              text={submitting ? loadingText : "Update password"}
              onPress={handleUpdatePassword}
              disabled={submitting}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
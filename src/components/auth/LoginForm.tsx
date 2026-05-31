"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, EyeOffIcon, EyeOnIcon } from "../../assets/Icons";
import Button from "../common-layout/Button";
import InputBox from "../common-layout/InputBox";
import NewToInaiCart from "./NewToInaiCart";
import { useLang } from "../../context/LangContext";
import Link from "next/link";
import FormCardLayout from "../common-layout/FormCardLayout";
import { login } from "../../lib/api/auth";
import { useAuth } from "../../hooks/useAuth";
import { ApiError } from "../../lib/api/client";

export default function LoginForm() {
  const { t } = useLang();
  const router = useRouter();
  const { saveSession } = useAuth();

  useEffect(() => {
    if (localStorage.getItem("tamilinai_access_token")) {
      router.replace("/matches");
    }
  }, [router]);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async () => {
    // Frontend empty check
    let hasError = false;
    if (!identifier.trim()) {
      setIdentifierError(t("Fill_all_the_Input_fields"));
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError(t("Password_is_required"));
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    setIdentifierError("");
    setPasswordError("");

    try {
      const res = await login({ identifier: identifier.trim(), password });
      saveSession(res);
      router.replace("/matches");
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.code) {
          case "USER_NOT_FOUND":
            setIdentifierError("*Account not found. Create a new account instead.");
            break;
          case "WRONG_PASSWORD":
            setPasswordError("*Incorrect password.");
            break;
          case "SUSPENDED":
          case "CLOSED":
            setPasswordError(err.message);
            break;
          default:
            if (err.status === 0 || err.message.toLowerCase().includes("network") || err.message.toLowerCase().includes("fetch")) {
              setPasswordError(" Network error. Please try again shortly.");
            } else {
              setPasswordError("*Something went wrong. Please try again.");
            }
        }
      } else {
        setPasswordError(" Network error. Please try again shortly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCardLayout
      title={t("Welcome_back")}
      subtitle={t("Keep_your_Inai_account_secure")}
      footer={
        <>
          <Button
            text={loading ? "Please wait..." : t("Log_In")}
            icon={loading ? undefined : <ArrowRightIcon />}
            onPress={handleLogin}
            className="w-full"
          />
          <div className="max-[500px]:mt-3 mt-6 md:mt-8 flex justify-center">
            <Link
              href="/forgot-password"
              prefetch
              className="text-primary fonts-18 font-normal leading-[150%] cursor-pointer hover:opacity-70 select-none"
            >
              {t("Forgotten_password")}
            </Link>
          </div>
        </>
      }
      bottom={<NewToInaiCart />}
    >
      <div>
        <InputBox
          value={identifier}
          onChange={(val) => {
            setIdentifier(val);
            setIdentifierError("");
          }}
          label={t("Mobile_or_email")}
          className="bg-[#F2F2F2] border-[#F2F2F2]"

          error={identifierError}
        />
      </div>

      <div className="max-[500px]:mt-4 mt-6 md:mt-8">
        <InputBox
          value={password}
          onChange={(val) => {
            setPassword(val);
            setPasswordError("");
          }}
          label={t("Password")}
          type={showPassword ? "text" : "password"}
          className="bg-[#F2F2F2] border-[#F2F2F2]"

          error={passwordError}
          suffix={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="cursor-pointer"
            >
              {showPassword ? <EyeOnIcon /> : <EyeOffIcon />}
            </button>
          }
        />
      </div>
    </FormCardLayout>
  );
}


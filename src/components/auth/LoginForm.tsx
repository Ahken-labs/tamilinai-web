"use client";

import { useState } from "react";
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
import { ApiRequestError } from "../../lib/api/client";

export default function LoginForm() {
  const { t } = useLang();
  const router = useRouter();
  const { saveSession } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; submit?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const nextErrors: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) nextErrors.identifier = t("Fill_all_the_Input_fields");
    if (!password.trim()) nextErrors.password = t("Password_is_required");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setErrors({});
    try {
      const res = await login({ identifier: identifier.trim(), password });
      saveSession(res);
      router.replace("/matches");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        const msg = err.message.toLowerCase();
        if (msg.includes('invalid credentials') || msg.includes('invalid value')) {
          setErrors({ submit: "Incorrect email/phone or password. Please try again." });
        } else if (msg.includes('suspended') || msg.includes('blocked')) {
          setErrors({ submit: "Your account has been suspended. Please contact support." });
        } else if (msg.includes('closed')) {
          setErrors({ submit: "This account has been permanently closed." });
        } else {
          setErrors({ submit: err.message });
        }
      } else {
        setErrors({ submit: "Login failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormCardLayout
        title={t("Welcome_back")}
        subtitle={t("Keep_your_Inai_account_secure")}
        footer={
          <>
            {errors.submit && (
              <p className="mb-3 text-[12px] text-[#B31B38]">{errors.submit}</p>
            )}
            <Button
              text={loading ? "Please wait..." : t("Log_In")}
              icon={loading ? undefined : <ArrowRightIcon />}
              onPress={handleLogin}
              className="w-full"
            />

            <div className="mt-6 md:mt-8 flex justify-center">
              <Link
                href="/forgot-password"
                prefetch
                className="text-primary font-18 font-normal leading-[150%] cursor-pointer hover:opacity-70 select-none"
              >
                {t("Forgotten_password")}
              </Link>
            </div>
          </>
        }
        bottom={<NewToInaiCart />} 
      >
           <div className="mt-7 sm:mt-10 md:mt-12">
             <InputBox
              value={identifier}
              onChange={(val) => {
                setIdentifier(val);
                setErrors((prev) => ({ ...prev, identifier: undefined, submit: undefined }));
              }}
              label={t("Mobile_or_email")}
              className="bg-[#F2F2F2] border-[#F2F2F2]"
              error={errors.identifier}
            />
          </div>

          <div className="mt-6 md:mt-8">
            <InputBox
              value={password}
              onChange={(val) => {
                setPassword(val);
                setErrors((prev) => ({ ...prev, password: undefined, submit: undefined }));
              }}
              label={t("Password")}
              type={showPassword ? "text" : "password"}
              className="bg-[#F2F2F2] border-[#F2F2F2]"
              error={errors.password}
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
    </>
  );
}
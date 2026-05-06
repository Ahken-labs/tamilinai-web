"use client";

import { useState } from "react";
import { ArrowRightIcon, EyeOffIcon, EyeOnIcon } from "../../assets/Icons";
import Button from "../common-layout/Button";
import InputBox from "../common-layout/InputBox";
import NewToInaiCart from "../more/NewToInaiCart";
import { useLang } from "../../context/LangContext";
import Link from "next/link";
import FormCardLayout from "../common-layout/FormCardLayout";

export default function LoginForm() {
  const { t } = useLang();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const handleLogin = () => {
    const nextErrors: typeof errors = {};
    if (!identifier.trim()) nextErrors.identifier = t("Fill_all_the_Input_fields");
    if (!password.trim()) nextErrors.password = t("Password_is_required");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    // TODO: connect backend
  };

  return (
    <>
      <FormCardLayout
        title={t("Welcome_back")}
        subtitle={t("Keep_your_Inai_account_secure")}
        footer={
          <>
            <Button
              text={t("Log_In")}
              icon={<ArrowRightIcon />}
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
                setErrors((prev) => ({ ...prev, identifier: undefined }));
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
                setErrors((prev) => ({ ...prev, password: undefined }));
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
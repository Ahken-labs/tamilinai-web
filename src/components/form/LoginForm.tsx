"use client";

import { useState } from "react";
import { ArrowRightIcon, EyeOffIcon, EyeOnIcon } from "../../assets/Icons";
import Button from "../common/Button";
import InputBox from "../common/InputBox";
import NewToInaiCart from "../more/NewToInaiCart";
import { useLang } from "../../context/LangContext";
import Link from "next/link";

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
    <div className="w-full flex justify-center px-4 py-8 bg-[#F8F5F2] font-poppins">
      <div className="w-full max-w-[784px] flex flex-col">

        {/* Box 1 */}
        <div className="w-full rounded-[20px] bg-white pt-6 md:pt-8 px-4 md:px-6 pb-8 md:pb-10">
          <h1 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-semibold text-[#222] leading-[150%]">
            {t("Welcome_back")}
          </h1>

          <p className="mt-6 md:mt-10 text-[14px] sm:text-[16px] md:text-[18px] font-normal text-[#222] leading-[150%]">
            {t("Keep_your_Inai_account_secure")}
          </p>

          <div className="mt-10 md:mt-12">
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

          <div className="mt-10 md:mt-12">
            <Button
              text={t("Log_In")}
              icon={<ArrowRightIcon />}
              onPress={handleLogin}
              className="w-full"
            />
          </div>

          <div className="mt-6 md:mt-8 flex justify-center">
            <Link
              href="/forgot-password"
              prefetch
              className="text-[#B31B38] text-center text-[14px] sm:text-[16px] md:text-[18px] font-normal leading-[150%] cursor-pointer hover:opacity-70 select-none"
            >
              {t("Forgotten_password")}
            </Link>
          </div>
        </div>

        <NewToInaiCart className="mt-8" />
      </div>
    </div>
  );
}

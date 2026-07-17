"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRightIcon, EyeOffIcon, EyeOnIcon } from "../../assets/Icons";
import Button from "../common-layout/Button";
import InputBox from "../common-layout/InputBox";
import CountryCodeSelect from "../more/CountryCodeSelect";
import { useLang } from "../../context/LangContext";
import { useLoadingText } from "../../hooks/useLoadingText";
import Link from "next/link";
import Image from "next/image";
import { login } from "../../lib/api/auth";
import { useAuth } from "../../hooks/useAuth";
import { ApiError } from "../../lib/api/client";
import RegisterForm from "./RegisterForm";

function extractDialCode(country: string): string {
  const match = country.match(/\(\+(\d+)\)/);
  return match ? "+" + match[1] : "";
}

export default function LoginForm() {
  const { t } = useLang();
  const router = useRouter();
  const { saveSession } = useAuth();
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"phone" | "email">("phone");

  useEffect(() => {
    if (localStorage.getItem("tamilinai_access_token")) {
      router.replace("/matches");
    }
  }, [router]);

  const [country, setCountry] = useState("Sri Lanka (+94)");
  const [countryOpen, setCountryOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadingText = useLoadingText(loading, "auth");

  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async () => {
    let hasError = false;
    const fieldEmpty = mode === "phone" ? !phone.trim() : !identifier.trim();
    if (fieldEmpty) {
      setIdentifierError(t("Fill_all_the_Input_fields"));
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError(t("Password_is_required"));
      hasError = true;
    }
    if (hasError) return;

    const builtIdentifier =
      mode === "phone"
        ? extractDialCode(country) + phone.trim().replace(/^0+/, "")
        : identifier.trim();

    setLoading(true);
    setIdentifierError("");
    setPasswordError("");

    try {
      const res = await login({ identifier: builtIdentifier, password });
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

    <div className={`w-full flex justify-center max-[340px]:px-2 px-4 md:px-10 max-[500px]:py-4 py-6 bg-mvp font-poppins min-h-[calc(100vh-80px)]`}>
      <div className={`w-full max-w-[640px] flex flex-col`}>

        <div className="w-full rounded-[16px] sm:rounded-[20px] max-[500px]:pt-6 pt-7 sm:pt-8 px-4 sm:px-6 bg-light max-[500px]:pb-5 pb-6">

          {/* Title */}
          <h1 className="text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-semibold text-center text-dark leading-[120%]">
            {t("Welcome_back")}
          </h1>

          {/* Subtitle */}
          <p className="text-center leading-[150%] mt-2 max-[500px]:text-[16px] text-[17px] sm:text-[18px] md:text-[19px] lg:text-[20px] text-[#525252] leading-[150%]">
            {t("login_subtext")}
          </p>

          {/* Content */}
          <div className="mt-6 sm:mt-7 md:mt-8">
            {mode === "phone" ? (
              <div>
                <div className="flex gap-2 sm:gap-3">
                  <CountryCodeSelect
                    value={country}
                    onChange={(val) => { setCountry(val); setIdentifierError(""); }}
                    open={countryOpen}
                    setOpen={setCountryOpen}
                    className="w-[96px] sm:w-[116px] shrink-0"
                    buttonClassName="bg-[#F2F2F2] border-[#F2F2F2]"
                  />
                  <div className="flex-1">
                    <InputBox
                      value={phone}
                      onChange={(val) => { setPhone(val.replace(/\D/g, "")); setIdentifierError(""); }}
                      label={t("WhatsApp_number")}
                      className="bg-[#F2F2F2] border-[#F2F2F2]"
                      type="tel"
                      error={identifierError}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <InputBox
                  value={identifier}
                  onChange={(val) => { setIdentifier(val.replace(/ /g, "")); setIdentifierError(""); }}
                  label={t("Email")}
                  className="bg-[#F2F2F2] border-[#F2F2F2]"
                  error={identifierError}
                />
              </div>
            )}
            <div className="max-[500px]:mt-3 mt-4 sm:mt-5">
              <InputBox
                value={password}
                onChange={(val) => {
                  setPassword(val.replace(/ /g, ""));
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
          </div>

          {/* Footer*/}
          <div className="mt-6 sm:mt-7 md:mt-8">
            <Button
              text={loading ? loadingText : t("Log_In")}
              onPress={handleLogin}
              className="w-full"
            />

            <Button
              text={t("Create_new_account")}
              onPress={() => setOpenForm(true)}
              className="w-full border-[1.2px] w-full !bg-[#FFF] hover:!bg-[#FFF0F3] !text-[#B31B38] active:!bg-[#FFE4E9] active:!bg-[#FFD6DE] max-[500px]:mt-4 mt-5"
            />
            <Link
              href="/forgot-password"
              prefetch
              className="max-[500px]:mt-4 mt-5 flex justify-center h-8 py-[5.5px] text-[#525252] font-16 font-normal leading-[150%] cursor-pointer hover:underline hover:text-[#B31B38] select-none"
            >
              {t("Forgotten_password")}
            </Link>

            <button
              type="button"
              onClick={() => { setMode(mode === "phone" ? "email" : "phone"); setIdentifierError(""); setPhone(""); setIdentifier(""); }}
              className="w-full h-8 py-1 mt-2 flex items-center justify-center py-[5.5px] text-[#525252] font-16 font-normal leading-[150%] cursor-pointer hover:underline hover:text-[#B31B38] select-none"
            >
              {mode === "phone" ? t("Login_with_email") : (t("Login_with_phone"))}
              <ChevronRightIcon className="w-4 h-4 -ml-[2px]" />
            </button>

          </div>
        </div>

        <div className="max-[500px]:mt-4 mt-5 sm:mt-6 bg-light py-4 px-5 rounded-[20px]">
          <div className="flex justify-center items-center gap-2 sm:gap-4">
            <Image src="/images/business_shop.webp" alt="" width={56} height={56} className="shrink-0" style={{ width: "clamp(49.047px, 5vw, 55.735px)", height: "clamp(49.047px, 5vw, 55.735px)" }} />
            <div className="flex flex-col">
              <span className="font-poppins font-16 font-normal leading-[150%] text-[#222]">Are you a wedding vendor?</span>
              <Link
                href="https://business.inai.lk/login"
                className="hover:underline mt-[2px] font-poppins font-16 font-medium leading-[150%] text-primary"
              >
                Go to Inai Business Login
              </Link>
            </div>
          </div>
        </div>

      </div>
      <RegisterForm
        variant="modal"
        open={openForm}
        onClose={() => setOpenForm(false)}
      />
    </div>
  );
}


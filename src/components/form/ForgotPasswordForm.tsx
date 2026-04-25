"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, MailIcon, SmsIcon } from "../../assets/Icons";
import Button from "../common/Button";
import CountryCodeSelect from "../more/CountryCodeSelect";
import InputBox from "../common/InputBox";
import NewToInaiCart from "../more/NewToInaiCart";
import { useLang } from "../../context/LangContext";
import { COUNTRIES } from "../../constants/countries";

type Method = "sms" | "email";

export default function ForgotPasswordForm() {
  const { t } = useLang();
  const router = useRouter();
  const [method, setMethod] = useState<Method>("sms");
  const [value, setValue] = useState("");
  const [countryCode, setCountryCode] = useState(COUNTRIES[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleMethod = (m: Method) => {
    setMethod(m);
    setValue("");
    setError(undefined);
    setCountryOpen(false);
  };

  const handleSend = () => {
    if (!value.trim()) {
      setError(t("Fill_all_the_Input_fields"));
      return;
    }
    sessionStorage.setItem("otp_sent_at", String(Date.now()));
    if (method === "sms") {
      const code = countryCode.match(/\(\+\d+\)/)?.[0] ?? countryCode;
      router.push(`/reset-verify?phone=${encodeURIComponent(value)}&countryCode=${encodeURIComponent(code)}`);
    } else {
      router.push(`/reset-verify?email=${encodeURIComponent(value)}`);
    }
  };

  return (
    <div className="w-full flex justify-center px-4 py-8 bg-[#F8F5F2] font-poppins">
      <div className="w-full max-w-[784px] flex flex-col">

        {/* Box 1 */}
        <div className="w-full rounded-[20px] bg-white pt-6 md:pt-8 px-4 md:px-6 pb-8 md:pb-10">
          <h1 className="font-24 font-semibold text-dark leading-[150%]">
            {t("Reset_your_password")}
          </h1>

          <p className="mt-5 sm:mt-7 md:mt-10 font-18 font-normal text-dark leading-[150%]">
            {t("Choose_reset_method")}
          </p>

          {/* Method selector */}
          <div className="mt-6 flex gap-3 md:gap-4">
            <button
              type="button"
              onClick={() => handleMethod("sms")}
              className={`select-none cursor-pointer flex-1 flex flex-col items-center justify-center gap-0.5 py-3 md:py-4 rounded-[12px] transition-colors duration-150
                ${method === "sms" ? "bg-cartbox3 text-primary" : "bg-cartbox2 text-dark"}`}
            >
              <SmsIcon />
              <span className="font-16 font-normal leading-[150%]">{t("Mobile")}</span>
            </button>

            <button
              type="button"
              onClick={() => handleMethod("email")}
              className={`select-none cursor-pointer flex-1 flex flex-col items-center justify-center gap-0.5 py-3 md:py-4 rounded-[12px] transition-colors duration-150
                ${method === "email" ? "bg-cartbox3 text-primary" : "bg-cartbox2 text-dark"}`}
            >
              <MailIcon />
              <span className="font-16 font-normal leading-[150%]">{t("Email")}</span>
            </button>
          </div>

          {/* Input */}
          <div className="mt-8 md:mt-10">
            {method === "sms" ? (
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
                  onChange={(val) => {
                    setValue(val);
                    setError(undefined);
                  }}
                  label={t("Your_mobile_number")}
                  type="tel"
                  className="bg-cartbox2 border-gray1"
                  error={error}
                />
              </div>
            ) : (
              <InputBox
                value={value}
                onChange={(val) => {
                  setValue(val);
                  setError(undefined);
                }}
                label={t("Your_email_address")}
                type="email"
                className="bg-cartbox2 border-gray1"
                error={error}
              />
            )}
          </div>

          {/* Send button */}
          <div className="mt-8 md:mt-10">
            <Button
              text={t("Send_reset_code")}
              icon={<ArrowRightIcon />}
              onPress={handleSend}
              className="w-full"
            />
          </div>
        </div>

        <NewToInaiCart className="mt-8" />
      </div>
    </div>
  );
}

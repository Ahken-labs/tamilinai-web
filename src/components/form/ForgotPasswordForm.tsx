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
import FormCardLayout from "../common/FormCardLayout";

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
      router.push(`/reset-otp?phone=${encodeURIComponent(value)}&countryCode=${encodeURIComponent(code)}`);
    } else {
      router.push(`/reset-otp?email=${encodeURIComponent(value)}`);
    }
  };
  
  return (
  <FormCardLayout
    title={t("Reset_your_password")}
    subtitle={t("Choose_reset_method")}
    bottom={<NewToInaiCart />}
    childrenTopMargin="mt-6"
  >
    {/* Method selector */}
    <div className="flex gap-3 md:gap-4">
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
  </FormCardLayout>
);
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, MailIcon,  WhatsAppIcon } from "../../assets/Icons";
import Button from "../common-layout/Button";
import CountryCodeSelect from "../more/CountryCodeSelect";
import InputBox from "../common-layout/InputBox";
import NewToInaiCart from "./NewToInaiCart";
import { useLang } from "../../context/LangContext";
import { COUNTRIES } from "../../constants/countries";
import FormCardLayout from "../common-layout/FormCardLayout";
import { forgotPassword } from "../../lib/api/auth";
import { ApiError } from "../../lib/api/client";
import { sanitizePhoneInput, validatePhone, validateEmail } from "../../utils/validation";
import { useLoadingText } from "../../hooks/useLoadingText";

type Method = "sms" | "email";

export default function ForgotPasswordForm() {
  const { t } = useLang();
  const router = useRouter();
  const [method, setMethod] = useState<Method>("sms");
  const [value, setValue] = useState("");
  const [countryCode, setCountryCode] = useState(COUNTRIES[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [emailWarning, setEmailWarning] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const loadingText = useLoadingText(loading, "send");

  const handleMethod = (m: Method) => {
    setMethod(m);
    setValue("");
    setError(undefined);
    setEmailWarning(undefined);
    setCountryOpen(false);
  };

  const handleSend = async () => {
    if (method === "sms") {
      const err = validatePhone(value, countryCode);
      if (err) { setError(err); return; }
    } else {
      const { error: err, warning } = validateEmail(value);
      if (err) { setError(err); return; }
      if (warning) { setEmailWarning(warning); return; }
    }
    setLoading(true);
    try {
      if (method === "sms") {
        const code = countryCode.match(/\+\d+/)?.[0] ?? countryCode;
        const smsRes = await forgotPassword({ channel: "sms", phone: value, countryCode: code });
        sessionStorage.setItem("otp_sms_sent_at", String(Date.now()));
        sessionStorage.setItem("otp_sms_cd", String(smsRes.cooldownSeconds ?? 60));
        sessionStorage.setItem("inai_reset_identifier", value);
        router.push(`/reset-otp?phone=${encodeURIComponent(value)}&countryCode=${encodeURIComponent(code)}`);
      } else {
        const emailRes = await forgotPassword({ channel: "email", email: value });
        sessionStorage.setItem("otp_email_sent_at", String(Date.now()));
        sessionStorage.setItem("otp_email_cd", String(emailRes.cooldownSeconds ?? 60));
        sessionStorage.setItem("inai_reset_identifier", value);
        router.push(`/reset-otp?email=${encodeURIComponent(value)}`);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("Fill_all_the_Input_fields"));
    } finally {
      setLoading(false);
    }
  };
  
  return (
  <FormCardLayout
    title={t("Reset_your_password")}
    subtitle={t("Choose_reset_method")}
    bottom={<NewToInaiCart />}
    childrenTopMargin="max-[500px]:mt-4 mt-6"
  >
    {/* Method selector */}
    <div className="flex gap-3 md:gap-4">
      <button
        type="button"
        onClick={() => handleMethod("sms")}
        className={`select-none cursor-pointer flex-1 flex flex-col items-center justify-center gap-0.5 py-3 md:py-4 rounded-[12px] transition-colors duration-150
          ${method === "sms" ? "bg-cartbox3 text-primary" : "bg-cartbox2 text-dark"}`}
      >
        <WhatsAppIcon stroke={method === "sms" ? "#B31B38" : "#222222"} fill={method === "sms" ? "#B31B38" : "#222222"} />
        <span className="text-[14px] md:text-[16px] font-normal leading-[150%]">{t("WhatsApp")}</span>
      </button>

      <button
        type="button"
        onClick={() => handleMethod("email")}
        className={`select-none cursor-pointer flex-1 flex flex-col items-center justify-center gap-0.5 py-3 md:py-4 rounded-[12px] transition-colors duration-150
          ${method === "email" ? "bg-cartbox3 text-primary" : "bg-cartbox2 text-dark"}`}
      >
        <MailIcon className="w-5 h-5"/>
        <span className="text-[14px] md:text-[16px] font-normal leading-[150%]">{t("Email")}</span>
      </button>
    </div>

    {/* Input */}
    <div className="max-[500px]:mt-4 mt-6 md:mt-8">
      {method === "sms" ? (
        <div className="flex flex-col max-[500px]:gap-4 gap-6 md:gap-8">
          <CountryCodeSelect
            value={countryCode}
            onChange={(val) => { setCountryCode(val); setValue(""); setError(undefined); }}
            open={countryOpen}
            setOpen={setCountryOpen}
            label="Country code"
          />
          <InputBox
            value={value}
            onChange={(val) => {
              setValue(sanitizePhoneInput(val, countryCode));
              setError(undefined);
            }}
            label={t("Your_mobile_number")}
            type="tel"
            className="bg-cartbox2 border-gray1"
            error={error}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <InputBox
            value={value}
            onChange={(val) => {
              setValue(val);
              setError(undefined);
              setEmailWarning(undefined);
            }}
            label={t("Your_email_address")}
            type="email"
            className="bg-cartbox2 border-gray1"
            error={error}
          />
          {emailWarning && (
            <p className="text-[13px] text-primary">*{emailWarning}</p>
          )}
        </div>
      )}
    </div>

    {/* Send button */}
    <div className="max-[500px]:mt-4 mt-8 md:mt-10">
      <Button
        text={loading ? loadingText : t("Send_reset_code")}
        icon={loading ? undefined : <ArrowRightIcon />}
        onPress={handleSend}
        className="w-full"
      />
    </div>
  </FormCardLayout>
);
}

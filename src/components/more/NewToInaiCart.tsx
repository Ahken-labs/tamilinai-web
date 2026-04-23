"use client";

import { useState } from "react";
import CartBox from "../common/CartBox";
import Button from "../common/Button";
import { ArrowRightIcon } from "../../assets/Icons";
import { useLang } from "../../context/LangContext";
import dynamic from "next/dynamic";

const RegisterForm = dynamic(() => import("../form/RegisterForm"), {
  ssr: false,
});

interface NewToInaiCartProps {
  className?: string;
}

export default function NewToInaiCart({ className }: NewToInaiCartProps) {
  const { t } = useLang();
  const [openForm, setOpenForm] = useState(false);

  return (
    <>
      <CartBox className={className}>
        <p className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-semibold text-[#222] leading-[150%]">
          {t("New_to_Inai")}
        </p>

        <div className="mt-5">
          <Button
            text={t("Create_my_free_profile")}
            onPress={() => setOpenForm(true)}
            icon={<ArrowRightIcon />}
            className="w-full !bg-[#FFF0F3] !text-[#B31B38] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]"
          />
        </div>

        <p className="mt-5 text-[14px] sm:text-[16px] md:text-[18px] font-normal text-[#222] leading-[150%] text-center">
          {t("We_keep_your_information_safe_and_secure")}
        </p>
      </CartBox>

      <RegisterForm
        variant="modal"
        open={openForm}
        onClose={() => setOpenForm(false)}
      />
    </>
  );
}

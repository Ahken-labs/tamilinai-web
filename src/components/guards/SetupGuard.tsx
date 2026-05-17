"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type SetupStep = "basic-details" | "personal-details" | "photo-upload";

// Each step requires the previous step's data to exist in sessionStorage.
// If missing → user navigated directly via URL → send to landing.
const STEP_REQUIREMENTS: Record<SetupStep, string | null> = {
  "basic-details": null,                // only requires a valid login token
  "personal-details": "inai_setup_basic",
  "photo-upload": "inai_setup_personal",
};

interface Props {
  step: SetupStep;
  children: React.ReactNode;
}

export default function SetupGuard({ step, children }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (step === "basic-details") {
      // Only reachable from create-password, which sets inai_setup_start before navigating.
      // sessionStorage survives page refreshes (unlike closing the browser), so old/slow
      // users can refresh without being kicked out. If browser is closed and real token
      // exists, login redirects them to matches where they can edit their profile.
      if (!sessionStorage.getItem("inai_setup_start")) {
        router.replace("/");
      }
      return;
    }

    // personal-details and photo-upload require the real access token
    // (background createPassword API is done well before user reaches these steps)
    if (!localStorage.getItem("tamilinai_access_token")) {
      router.replace("/");
      return;
    }
    const required = STEP_REQUIREMENTS[step];
    if (required && !sessionStorage.getItem(required)) {
      router.replace("/");
    }
  }, [router, step]);

  return <>{children}</>;
}

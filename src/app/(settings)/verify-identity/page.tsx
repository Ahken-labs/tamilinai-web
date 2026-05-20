"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VerifyIdentityOtp from "../../../components/app/VerifyIdentityOtp";
import Footer from "../../../components/Footer";
import { getMe } from "../../../lib/api/user";
import type { Me } from "../../../types/user";

function maskPhone(me: Me): string {
  const raw = me.phone ?? "";
  const digits = raw.replace(/\D/g, "");
  const cc = me.countryCode ?? "";
  return `${cc} *** **** ${digits.slice(-4)}`;
}

function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at < 0) return email;
  return `${email.slice(0, Math.min(3, at))}***${email.slice(at)}`;
}

function VerifyIdentityContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const method = (searchParams.get("method") === "phone" ? "phone" : "email") as "phone" | "email";

  const [me, setMe] = useState<Me | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    getMe()
      .then(setMe)
      .catch(() => setLoadError(true));
  }, []);

  if (loadError) {
    router.replace("/trust-badge");
    return null;
  }

  if (!me) {
    return (
      <div className="w-full flex items-center justify-center px-4 py-16 bg-mvp font-poppins min-h-[400px]">
        <span className="text-dark font-16">Loading…</span>
      </div>
    );
  }

  const maskedIdentifier =
    method === "phone" ? maskPhone(me) : maskEmail(me.email ?? "");

  return <VerifyIdentityOtp method={method} maskedIdentifier={maskedIdentifier} />;
}

export default function VerifyIdentityPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="w-full flex items-center justify-center px-4 py-16 bg-mvp font-poppins min-h-[400px]">
            <span className="text-dark font-16">Loading…</span>
          </div>
        }
      >
        <VerifyIdentityContent />
      </Suspense>
      <Footer variant="app" />
    </>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  requiredKey: string;
  children: React.ReactNode;
}

// Guards auth-flow pages (verify-otp, create-password) so they can only be
// reached via the proper preceding step, not by typing the URL directly.
export default function FlowGuard({ requiredKey, children }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!sessionStorage.getItem(requiredKey)) {
      router.replace("/");
    }
  }, [router, requiredKey]);

  return <>{children}</>;
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("tamilinai_access_token");
    if (!token) router.replace("/");
  }, [router]);

  return <>{children}</>;
}

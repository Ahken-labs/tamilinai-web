"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tryRefresh } from "../../lib/api/refresh";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mountKey, setMountKey] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("tamilinai_access_token")) return;
    // No stored token can still mean a valid login cookie (e.g. a newly added iPhone home-screen app), so try renewing first
    let cancelled = false;
    tryRefresh().then((ok) => {
      if (cancelled) return;
      if (!ok) { router.replace("/"); return; }
      // Header and live notifications only read the token when they first appear, so start the page again now it exists
      setMountKey((k) => k + 1);
    });
    return () => { cancelled = true; };
  }, [router]);

  return <Fragment key={mountKey}>{children}</Fragment>;
}

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ScrollToSection({ id }: { id: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/#${id}`);
  }, [router, id]);
  return null;
}

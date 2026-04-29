// Auth state + logout
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "../types/auth";

interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  logout: () => void;
}

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("tamilinai_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    localStorage.removeItem("tamilinai_user");
    return null;
  }
}

// TODO: replace localStorage approach with httpOnly cookie + server session when backend is ready
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem("tamilinai_access_token");
    localStorage.removeItem("tamilinai_refresh_token");
    localStorage.removeItem("tamilinai_user");
    setUser(null);
    router.push("/login");
  }, [router]);

  return {
    user,
    isAuthenticated: !!user,
    logout,
  };
}

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthUser, AuthResponse } from '../types/auth';

function readStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('tamilinai_user');
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    localStorage.removeItem('tamilinai_user');
    return null;
  }
}

interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  saveSession: (response: AuthResponse) => void;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const router = useRouter();

  const saveSession = useCallback((response: AuthResponse) => {
    localStorage.setItem('tamilinai_access_token', response.accessToken);
    localStorage.setItem('tamilinai_user', JSON.stringify(response.user));
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});
    localStorage.removeItem('tamilinai_access_token');
    localStorage.removeItem('tamilinai_user');
    sessionStorage.clear();
    setUser(null);
    router.push('/');
  }, [router]);

  return { user, isAuthenticated: !!user, saveSession, logout };
}

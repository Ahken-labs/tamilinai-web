"use client";

import { useState, useEffect } from "react";
import type { UserProfile } from "../types/user";
import { getMe } from "../lib/api/user";

interface UseProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // pure fetch (no state here)
  const fetchProfile = async (): Promise<UserProfile> => {
    return await getMe();
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchProfile();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  // refetch with state handling
  const refetch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  return { profile, isLoading, error, refetch };
}
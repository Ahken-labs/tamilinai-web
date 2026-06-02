"use client";

import { useEffect, useState } from "react";

// ── Presets ────────────────────────────────────────────────────────────────────

export const LOADING_MESSAGES = {
  default: [
    "Please wait",
    "Loading",
    "Working on it",
    "Just a moment",
    "Almost there",
    "Hang tight",
  ],
  auth: [
    "Signing in",
    "Checking credentials",
    "Verifying",
    "Almost there",
    "Hang tight",
  ],
  save: [
    "Saving",
    "Updating",
    "Almost done",
    "Hang tight",
  ],
  upload: [
    "Uploading",
    "Processing",
    "Optimising image",
    "Almost there",
    "Hang tight",
  ],
  search: [
    "Searching",
    "Finding matches",
    "Almost there",
  ],
  send: [
    "Sending",
    "Connecting",
    "Almost there",
  ],
} as const;

export type LoadingPreset = keyof typeof LOADING_MESSAGES;

// ── Hook ───────────────────────────────────────────────────────────────────────

/**
 * Returns a cycling loading label with animated dots while `isLoading` is true.
 *
 * @param isLoading    - Controlled by the caller's pending/loading state
 * @param preset       - One of the built-in message presets (default: "default")
 * @param customMessages - Override with your own messages (skips preset)
 * @param msgIntervalMs  - How often the message text rotates (default 2200ms)
 * @param dotIntervalMs  - How fast the dots animate (default 420ms)
 *
 * @example
 * const loadingText = useLoadingText(loading, "auth");
 * <Button text={loading ? loadingText : "Log in"} />
 */
export function useLoadingText(
  isLoading: boolean,
  preset: LoadingPreset | string[] = "default",
  msgIntervalMs = 2200,
  dotIntervalMs = 420,
): string {
  const messages: readonly string[] = Array.isArray(preset)
    ? preset
    : LOADING_MESSAGES[preset as LoadingPreset] ?? LOADING_MESSAGES.default;

  const [msgIndex, setMsgIndex] = useState(0);
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    if (!isLoading) return;

    const msgTimer = setInterval(
      () => setMsgIndex((i) => (i + 1) % messages.length),
      msgIntervalMs,
    );
    const dotTimer = setInterval(
      () => setDotCount((d) => (d % 3) + 1),
      dotIntervalMs,
    );

    return () => {
      clearInterval(msgTimer);
      clearInterval(dotTimer);
      setMsgIndex(0);
      setDotCount(1);
    };
  }, [isLoading, messages.length, msgIntervalMs, dotIntervalMs]);

  if (!isLoading) return "";
  return `${messages[msgIndex]}${".".repeat(dotCount)}`;
}

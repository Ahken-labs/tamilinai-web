// Applies a change event from one OTP box. Mobile keyboards (SMS/WhatsApp code
// suggestion, long-press paste) insert the whole code into the focused box as a
// normal input event rather than a paste event, so a full-length value is spread
// across all boxes. Returns null when the input should be ignored.
export function applyOtpInput(
  digits: string[],
  index: number,
  value: string
): { digits: string[]; focusIndex: number } | null {
  const length = digits.length;
  const clean = value.replace(/\D/g, "");

  if (clean.length >= length) {
    return { digits: clean.slice(0, length).split(""), focusIndex: length - 1 };
  }

  if (value && !clean) return null;

  // Typing into a box that already holds a digit gives two chars; keep the new one
  const single = clean.length > 1 && digits[index]
    ? clean.replace(digits[index], "").slice(-1)
    : clean.slice(-1);

  const next = [...digits];
  next[index] = single;
  const focusIndex = single && index < length - 1 ? index + 1 : index;
  return { digits: next, focusIndex };
}

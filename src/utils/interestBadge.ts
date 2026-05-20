const KEY = "inai_has_unread_interests";

export function setUnreadInterestBadge(): void {
  try { sessionStorage.setItem(KEY, "1"); } catch { /* unavailable */ }
  window.dispatchEvent(new Event("interest-badge-update"));
}

export function clearUnreadInterestBadge(): void {
  try { sessionStorage.removeItem(KEY); } catch { /* unavailable */ }
  window.dispatchEvent(new Event("interest-badge-update"));
}

export function hasUnreadInterestBadge(): boolean {
  try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; }
}

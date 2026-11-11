import API_BASE_URL from './config';

type RefreshPayload = {
  accessToken: string;
  user: { id: string; displayId: string; name: string; isElite: boolean; isProfileComplete: boolean };
};

let refreshing: Promise<boolean> | null = null;

// The server accepts each refresh key only once, so every caller must share this single in-flight request
export async function tryRefresh(): Promise<boolean> {
  if (refreshing) return refreshing;
  const tokenBefore = typeof window !== 'undefined' ? localStorage.getItem('tamilinai_access_token') : null;
  refreshing = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        // Another tab may have already refreshed — if localStorage was updated, use that token
        const tokenNow = typeof window !== 'undefined' ? localStorage.getItem('tamilinai_access_token') : null;
        if (tokenNow && tokenNow !== tokenBefore) return true;
        return false;
      }
      const data = await res.json() as RefreshPayload;
      if (!data?.accessToken || !data?.user?.id) return false;
      localStorage.setItem('tamilinai_access_token', data.accessToken);
      localStorage.setItem('tamilinai_user', JSON.stringify(data.user));
      return true;
    } catch {
      return false;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

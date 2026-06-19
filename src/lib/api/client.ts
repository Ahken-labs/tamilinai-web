import API_BASE_URL from './config';
import { clearBlobCache } from '@/src/components/common-layout/ProtectedPhoto';

const BASE_URL = API_BASE_URL;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
    public readonly retryAfter?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('tamilinai_access_token');
}

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function parseError(res: Response): Promise<ApiError> {
  try {
    const body = await res.json() as { error?: string; message?: string; code?: string; retryAfter?: number };
    const message = body.error ?? body.message ?? 'Something went wrong';
    const code = body.code ?? 'UNKNOWN';
    return new ApiError(message, code, res.status, body.retryAfter);
  } catch {
    return new ApiError('Something went wrong', 'UNKNOWN', res.status);
  }
}

type RefreshPayload = {
  accessToken: string;
  user: { id: string; displayId: string; name: string; isElite: boolean; isProfileComplete: boolean };
};

let refreshing: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (refreshing) return refreshing;
  const tokenBefore = typeof window !== 'undefined' ? localStorage.getItem('tamilinai_access_token') : null;
  refreshing = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
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

export async function http<T>(
  path: string,
  options: RequestInit = {},
  _retry = true,
): Promise<T> {
  const isAuthRoute = path.startsWith('/api/auth/');
  // These endpoints use 401 to signal wrong credentials, not session expiry — don't redirect.
  const isCredentialCheck = path === '/api/user/close' || path === '/api/user/profile/password';

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: authHeaders(options.headers as Record<string, string>),
    credentials: 'include',
  });

  if (res.status === 401 && _retry && !isAuthRoute && !isCredentialCheck) {
    const ok = await tryRefresh();
    if (ok) return http<T>(path, options, false);
    if (typeof window !== 'undefined') {
      clearBlobCache();
      localStorage.removeItem('tamilinai_access_token');
      localStorage.removeItem('tamilinai_user');
      window.location.href = '/';
    }
    throw new ApiError('Session expired. Please log in again.', 'SESSION_EXPIRED', 401);
  }

  if (!res.ok) throw await parseError(res);

  return res.json() as Promise<T>;
}

export async function httpUpload<T>(
  path: string,
  formData: FormData,
  method: 'POST' | 'PATCH' = 'POST',
  _retry = true,
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    body: formData,
    headers,
    credentials: 'include',
  });

  if (res.status === 401 && _retry) {
    const ok = await tryRefresh();
    if (ok) return httpUpload<T>(path, formData, method, false);
    if (typeof window !== 'undefined') {
      clearBlobCache();
      localStorage.removeItem('tamilinai_access_token');
      localStorage.removeItem('tamilinai_user');
      window.location.href = '/';
    }
    throw new ApiError('Session expired. Please log in again.', 'SESSION_EXPIRED', 401);
  }

  if (!res.ok) throw await parseError(res);

  return res.json() as Promise<T>;
}

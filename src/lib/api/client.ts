import type { ApiError } from '../../types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export class ApiRequestError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('tamilinai_access_token');
}

function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  };
  const token = getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

let isRefreshing = false;

async function tryRefresh(): Promise<boolean> {
  if (isRefreshing) return false;
  isRefreshing = true;
  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return false;
    const data = await res.json() as { accessToken: string; user: unknown };
    localStorage.setItem('tamilinai_access_token', data.accessToken);
    localStorage.setItem('tamilinai_user', JSON.stringify(data.user));
    return true;
  } catch {
    return false;
  } finally {
    isRefreshing = false;
  }
}

export async function apiCall<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const headers = buildHeaders(options.headers as Record<string, string>);
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Only attempt token refresh for authenticated app routes, not for auth endpoints.
  // Auth endpoints (login, register, etc.) return 401 for bad credentials — we must
  // not treat that as a session expiry and redirect the user away.
  const isAuthRoute = path.startsWith('/api/auth/');
  if (res.status === 401 && retry && !isAuthRoute) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return apiCall<T>(path, options, false);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tamilinai_access_token');
      localStorage.removeItem('tamilinai_user');
      window.location.href = '/';
    }
    throw new ApiRequestError('Session expired. Please log in again.', 'UNAUTHORIZED');
  }

  const json = await res.json();

  if (!res.ok) {
    const err = json as ApiError;
    // Backend uses `error` field; fall back to `message` for future-proofing
    throw new ApiRequestError(err.error ?? err.message ?? 'Something went wrong', err.code);
  }

  return json as T;
}

export async function apiUpload<T>(
  path: string,
  formData: FormData,
  method: 'POST' | 'PATCH' = 'POST',
  retry = true
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    body: formData,
    headers,
    credentials: 'include',
  });

  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return apiUpload<T>(path, formData, method, false);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tamilinai_access_token');
      localStorage.removeItem('tamilinai_user');
      window.location.href = '/login';
    }
    throw new ApiRequestError('Session expired. Please log in again.', 'UNAUTHORIZED');
  }

  const json = await res.json();

  if (!res.ok) {
    const err = json as ApiError;
    throw new ApiRequestError(err.error ?? err.message ?? 'Upload failed', err.code);
  }

  return json as T;
}

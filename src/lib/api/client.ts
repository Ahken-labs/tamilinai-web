//Base fetch wrapper (auth header, 401 redirect, error handling)

import type { ApiError } from "../../types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiRequestError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

export async function apiCall<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken = typeof window !== "undefined"
    ? localStorage.getItem("tamilinai_access_token")
    : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    // TODO: attempt token refresh before redirecting
    if (typeof window !== "undefined") {
      localStorage.removeItem("tamilinai_access_token");
      window.location.href = "/login";
    }
    throw new ApiRequestError("Session expired. Please log in again.", "UNAUTHORIZED");
  }

  const json = await res.json();

  if (!res.ok) {
    const err = json as ApiError;
    throw new ApiRequestError(err.message ?? "Something went wrong", err.code);
  }

  return json.data as T;
}

export async function apiUpload<T>(
  path: string,
  formData: FormData
): Promise<T> {
  const accessToken = typeof window !== "undefined"
    ? localStorage.getItem("tamilinai_access_token")
    : null;

  const headers: Record<string, string> = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    body: formData,
    headers,
  });

  const json = await res.json();

  if (!res.ok) {
    const err = json as ApiError;
    throw new ApiRequestError(err.message ?? "Upload failed", err.code);
  }

  return json.data as T;
}

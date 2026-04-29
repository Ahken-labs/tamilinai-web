// All auth API calls
import { apiCall } from "./client";
import type {
  RegisterPayload,
  VerifyOtpPayload,
  CreatePasswordPayload,
  LoginPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  AuthTokens,
  AuthUser,
} from "../../types/auth";

export function register(payload: RegisterPayload): Promise<{ message: string }> {
  return apiCall("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function verifyOtp(payload: VerifyOtpPayload): Promise<{ token: string }> {
  return apiCall("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function resendOtp(identifier: string, method: "sms" | "email"): Promise<{ message: string }> {
  return apiCall("/api/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({ identifier, method }),
  });
}

export function createPassword(payload: CreatePasswordPayload): Promise<AuthTokens> {
  return apiCall("/api/auth/create-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload): Promise<AuthTokens & { user: AuthUser }> {
  return apiCall("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
  return apiCall("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
  return apiCall("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function refreshToken(token: string): Promise<AuthTokens> {
  return apiCall("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken: token }),
  });
}

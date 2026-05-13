import { apiCall } from './client';
import type {
  RegisterPayload,
  VerifyOtpPayload,
  CreatePasswordPayload,
  LoginPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  AuthResponse,
} from '../../types/auth';

export function register(payload: RegisterPayload): Promise<{ message: string; registrationKey: string }> {
  return apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function verifyOtp(payload: VerifyOtpPayload): Promise<{ tempToken: string }> {
  return apiCall('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function resendOtp(identifier: string, method: 'sms' | 'email'): Promise<{ message: string }> {
  return apiCall('/api/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ identifier, method }),
  });
}

export function createPassword(payload: CreatePasswordPayload): Promise<AuthResponse> {
  return apiCall('/api/auth/create-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
  return apiCall('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
  return apiCall('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function refreshAccessToken(): Promise<AuthResponse> {
  return apiCall('/api/auth/refresh', { method: 'POST' });
}

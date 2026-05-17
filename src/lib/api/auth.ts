import { http } from './client';
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
  return http('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}

export function verifyOtp(payload: VerifyOtpPayload): Promise<{ tempToken: string }> {
  return http('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify(payload) });
}

export function resendOtp(registrationKey: string, channel: 'sms' | 'email'): Promise<{ message: string }> {
  return http('/api/auth/resend-otp', { method: 'POST', body: JSON.stringify({ registrationKey, channel }) });
}

export function createPassword(payload: CreatePasswordPayload): Promise<AuthResponse> {
  return http('/api/auth/create-password', { method: 'POST', body: JSON.stringify(payload) });
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return http('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) });
}

export function forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
  return http('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify(payload) });
}

export function resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
  return http('/api/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) });
}

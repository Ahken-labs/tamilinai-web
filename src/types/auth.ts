export interface RegisterPayload {
  profileType: string;
  gender: string;
  name: string;
  phone: string;
  countryCode: string;
  email: string;
  channel?: 'sms' | 'email';
}

export interface VerifyOtpPayload {
  otp: string;
  registrationKey?: string;
  identifier?: string;
}

export interface CreatePasswordPayload {
  tempToken: string;
  password: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface ForgotPasswordPayload {
  identifier: string;
  method: 'sms' | 'email';
}

export interface ResetPasswordPayload {
  tempToken: string;
  password: string;
}

export interface AuthUser {
  id: string;
  displayId: string;
  name: string;
  isElite: boolean;
  isProfileComplete: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

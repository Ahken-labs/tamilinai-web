// Meta pixel/Conversions API dedup context — same eventId on browser and server.
export interface MetaEventContext {
  eventId: string;
  fbp?: string;
  fbc?: string;
}

export interface RegisterPayload {
  profileType: string;
  gender: string;
  name: string;
  phone: string;
  countryCode: string;
  email: string;
  channel?: 'sms' | 'email';
  meta?: MetaEventContext;
}

export interface VerifyOtpPayload {
  otp: string;
  registrationKey?: string;
  identifier?: string;
}

export interface CreatePasswordPayload {
  tempToken: string;
  password: string;
  meta?: MetaEventContext;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface ForgotPasswordPayload {
  channel: 'sms' | 'email';
  email?: string;
  phone?: string;
  countryCode?: string;
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

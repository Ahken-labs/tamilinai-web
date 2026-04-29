export interface RegisterPayload {
  profileType: string;
  gender: string;
  name: string;
  phone: string;
  countryCode: string;
  email: string;
}

export interface VerifyOtpPayload {
  identifier: string;
  otp: string;
  method: "sms" | "email";
}

export interface CreatePasswordPayload {
  token: string;
  password: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface ForgotPasswordPayload {
  identifier: string;
  method: "sms" | "email";
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileComplete: boolean;
}

import { http, httpUpload } from './client';
import type { Me, BasicDetailsPayload, PersonalDetailsPayload, PartnerPreferences, CareerDetailsPayload, FamilyDetailsPayload, LifestyleDetailsPayload } from '../../types/user';

export function getMe(): Promise<Me> {
  return http('/api/user/me');
}

export function updateMe(payload: { name?: string }): Promise<{ message: string }> {
  return http('/api/user/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function updatePhotoVisibility(visibility: 'public' | 'locked'): Promise<{ message: string }> {
  return http('/api/user/profile/photo-visibility', {
    method: 'PATCH',
    body: JSON.stringify({ visibility }),
  });
}

export function saveBasicDetails(payload: BasicDetailsPayload): Promise<{ message: string }> {
  return http('/api/user/profile/basic', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function savePersonalDetails(payload: PersonalDetailsPayload): Promise<{ message: string }> {
  return http('/api/user/profile/personal', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function uploadPhoto(photo: File): Promise<{ message: string; photoStatus?: string }> {
  const formData = new FormData();
  formData.append('photo', photo);
  return httpUpload('/api/user/profile/photo', formData);
}

export function submitProfileSetup(formData: FormData): Promise<{ message: string; photoStatus?: string }> {
  return httpUpload('/api/user/profile/setup', formData);
}

export function getPartnerPreferences(): Promise<PartnerPreferences> {
  return http('/api/user/settings/partner-preferences');
}

export function savePartnerPreferences(payload: PartnerPreferences): Promise<{ message: string }> {
  return http('/api/user/settings/partner-preferences', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function getProfileViews(): Promise<{ totalViewers: number; viewers?: { id: string; name: string; photoUrl?: string; viewedAt: string }[] }> {
  return http('/api/user/profile-views');
}

export function sendIdentityVerifyOtp(method: 'phone' | 'email'): Promise<{ message: string }> {
  return http('/api/user/verify/send', { method: 'POST', body: JSON.stringify({ method }) });
}

export function confirmIdentityVerifyOtp(method: 'phone' | 'email', otp: string): Promise<{ message: string }> {
  return http('/api/user/verify/confirm', { method: 'POST', body: JSON.stringify({ method, otp }) });
}

export function claimTrustBadge(): Promise<{ message: string }> {
  return http('/api/user/claim-trust-badge', { method: 'POST' });
}

export function saveCareerDetails(payload: CareerDetailsPayload): Promise<{ message: string }> {
  return http('/api/user/profile/career', { method: 'PATCH', body: JSON.stringify(payload) });
}

export function saveFamilyDetails(payload: FamilyDetailsPayload): Promise<{ message: string }> {
  return http('/api/user/profile/family', { method: 'PATCH', body: JSON.stringify(payload) });
}

export function saveLifestyleDetails(payload: LifestyleDetailsPayload): Promise<{ message: string }> {
  return http('/api/user/profile/lifestyle', { method: 'PATCH', body: JSON.stringify(payload) });
}

export function requestEmailChange(email: string): Promise<{ message: string }> {
  return http('/api/user/profile/email/request', { method: 'POST', body: JSON.stringify({ email }) });
}

export function confirmEmailChange(email: string, otp: string): Promise<{ message: string }> {
  return http('/api/user/profile/email/confirm', { method: 'POST', body: JSON.stringify({ email, otp }) });
}

export function requestPhoneChange(phone: string, countryCode: string): Promise<{ message: string }> {
  return http('/api/user/profile/phone/request', { method: 'POST', body: JSON.stringify({ phone, countryCode }) });
}

export function confirmPhoneChange(phone: string, countryCode: string, otp: string): Promise<{ message: string }> {
  return http('/api/user/profile/phone/confirm', { method: 'POST', body: JSON.stringify({ phone, countryCode, otp }) });
}

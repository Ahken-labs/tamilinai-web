import { http, httpUpload } from './client';
import type { Me, BasicDetailsPayload, PersonalDetailsPayload, PartnerPreferences } from '../../types/user';

export function getMe(): Promise<Me> {
  return http('/api/user/me');
}

export function updateMe(payload: { name?: string }): Promise<Me> {
  return http('/api/user/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
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

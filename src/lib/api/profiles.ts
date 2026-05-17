import { http } from './client';
import type { BrowseProfile, ProfileDetail } from '../../types/user';

export interface ProfileFilters {
  minAge?: number;
  maxAge?: number;
  religion?: string;
  caste?: string;
  country?: string;
  city?: string;
  education?: string;
  maritalStatus?: string;
  page?: number;
  limit?: number;
}

export interface ProfilesResponse {
  profiles: BrowseProfile[];
  page: number;
  hasMore: boolean;
}

export function getProfiles(filters?: ProfileFilters): Promise<ProfilesResponse> {
  const params = new URLSearchParams();
  if (filters) {
    (Object.entries(filters) as [string, string | number | undefined][]).forEach(([key, val]) => {
      if (val !== undefined) params.set(key, String(val));
    });
  }
  const query = params.toString();
  return http(`/api/profiles${query ? `?${query}` : ''}`);
}

export function getProfile(userId: string): Promise<ProfileDetail> {
  return http(`/api/profiles/${userId}`);
}

export function getShortlisted(page?: number): Promise<ProfilesResponse> {
  const query = page ? `?page=${page}` : '';
  return http(`/api/profiles/shortlisted${query}`);
}

export function shortlistProfile(userId: string): Promise<{ message: string }> {
  return http(`/api/profiles/${userId}/shortlist`, { method: 'POST' });
}

export function unshortlistProfile(userId: string): Promise<{ message: string }> {
  return http(`/api/profiles/${userId}/shortlist`, { method: 'DELETE' });
}

export function requestPhotoAccess(userId: string): Promise<{ message: string }> {
  return http(`/api/profiles/${userId}/request-photo`, { method: 'POST' });
}

export function revealContact(userId: string): Promise<{ phone?: string; countryCode?: string; email?: string }> {
  return http(`/api/profiles/${userId}/contact`, { method: 'POST' });
}

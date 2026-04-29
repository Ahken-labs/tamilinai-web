// Profile API calls
import { apiCall, apiUpload } from "./client";
import type { UserProfile, BasicDetailsPayload, PersonalDetailsPayload } from "../../types/user";

export function getMe(): Promise<UserProfile> {
  return apiCall("/api/user/me");
}

export function updateProfile(payload: Partial<UserProfile>): Promise<UserProfile> {
  return apiCall("/api/user/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function saveBasicDetails(payload: BasicDetailsPayload): Promise<{ message: string }> {
  return apiCall("/api/user/profile/basic", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function savePersonalDetails(payload: PersonalDetailsPayload): Promise<{ message: string }> {
  return apiCall("/api/user/profile/personal", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function uploadPhoto(photo: File, about: string): Promise<{ photoUrl: string }> {
  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("about", about);
  return apiUpload("/api/user/profile/photo", formData);
}

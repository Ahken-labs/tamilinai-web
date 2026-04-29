// Browse, interest, requests API calls
import { apiCall } from "./client";
import type { UserProfile } from "../../types/user";
import type { PaginatedResponse } from "../../types/api";

export interface MatchFilters {
  minAge?: number;
  maxAge?: number;
  religion?: string;
  caste?: string;
  country?: string;
  page?: number;
  limit?: number;
}

export function getProfiles(filters?: MatchFilters): Promise<PaginatedResponse<UserProfile>> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined) params.set(key, String(val));
    });
  }
  const query = params.toString();
  return apiCall(`/api/matches${query ? `?${query}` : ""}`);
}

export function sendInterest(profileId: string): Promise<{ message: string }> {
  return apiCall(`/api/matches/interest/${profileId}`, { method: "POST" });
}

export function withdrawInterest(profileId: string): Promise<{ message: string }> {
  return apiCall(`/api/matches/interest/${profileId}`, { method: "DELETE" });
}

export function getRequests(): Promise<{ sent: UserProfile[]; received: UserProfile[] }> {
  return apiCall("/api/matches/requests");
}

export function getMutualMatches(): Promise<UserProfile[]> {
  return apiCall("/api/matches/mutual");
}

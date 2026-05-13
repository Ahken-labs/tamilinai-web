// Profile section (nested inside Me response)
export interface UserProfileSection {
  dateOfBirth?: string;
  maritalStatus?: string;
  heightCm?: number;
  weightKg?: number;
  hasPhysicalChallenge?: boolean;
  disabilityType?: string;
  education?: string;
  educationDetail?: string;
  occupation?: string;
  sector?: string;
  monthlyIncome?: number;
  incomeCurrency?: string;
  religion?: string;
  caste?: string;
  country?: string;
  city?: string;
  citizenship?: string;
  aboutMe?: string;
  photoUrl?: string;
  photoStatus?: string;
  physicalBuild?: string;
  languagesSpoken?: string[];
  dietHabit?: string;
  smokingHabit?: string;
  drinkingHabit?: string;
  hobbies?: string[];
  residentStatus?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  brotherCount?: number;
  brothersMarried?: number;
  sisterCount?: number;
  sistersMarried?: number;
}

// Full me response (GET /api/user/me)
export interface Me {
  id: string;
  displayId: string;
  name: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  gender?: string;
  profileType?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isProfileComplete: boolean;
  isElite: boolean;
  eliteExpiresAt?: string;
  isOnBreak: boolean;
  breakEndsAt?: string;
  isClosed: boolean;
  trustBadge: boolean;
  profileCompletionScore: number;
  profile: UserProfileSection;
}

// Profile card shown in browse/search (GET /api/profiles)
export interface BrowseProfile {
  id: string;
  displayId: string;
  name: string;
  isElite: boolean;
  trustBadge: boolean;
  gender?: string;
  dateOfBirth?: string;
  heightCm?: number;
  education?: string;
  occupation?: string;
  religion?: string;
  caste?: string;
  city?: string;
  country?: string;
  photoUrl?: string;
  photoAccess?: string;
  isViewed?: boolean;
  isShortlisted?: boolean;
}

// Full profile detail (GET /api/profiles/:id)
export interface ProfileDetail {
  id: string;
  displayId: string;
  name: string;
  gender?: string;
  isElite: boolean;
  trustBadge: boolean;
  profileCompletionScore: number;
  isShortlisted: boolean;
  phone?: string;
  countryCode?: string;
  email?: string;
  profile: UserProfileSection & {
    photoAccess?: string;
  };
}

// Setup payload (POST /api/user/profile/setup — multipart)
export interface SetupPayload {
  dateOfBirth?: string;
  maritalStatus?: string;
  heightCm?: number;
  weightKg?: number;
  hasPhysicalChallenge?: boolean;
  disabilityType?: string;
  education?: string;
  occupation?: string;
  religion?: string;
  caste?: string;
  country?: string;
  city?: string;
  citizenship?: string;
  aboutMe?: string;
}

export interface BasicDetailsPayload {
  dateOfBirth: string;
  maritalStatus: string;
  heightCm?: number;
  weightKg?: number;
  hasPhysicalChallenge?: boolean;
  disabilityType?: string;
}

export interface PersonalDetailsPayload {
  education?: string;
  occupation?: string;
  religion?: string;
  caste?: string;
  country?: string;
  city?: string;
  citizenship?: string;
  aboutMe?: string;
}

export interface PartnerPreferences {
  minAgeYears?: number;
  maxAgeYears?: number;
  minHeightCm?: number;
  maxHeightCm?: number;
  maritalStatuses?: string[];
  religions?: string[];
  castes?: string[];
  countries?: string[];
  educationLevels?: string[];
  dietHabits?: string[];
  smokingHabits?: string[];
  drinkingHabits?: string[];
  physicalBuilds?: string[];
  residentStatuses?: string[];
}

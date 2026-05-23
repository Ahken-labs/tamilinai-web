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
  photoVisibility?: 'public' | 'locked';
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
  createdAt: string;
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
  createdAt?: string;
  interestStatus?: 'none' | 'sent' | 'received' | 'accepted' | 'declined';
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
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  phone?: string;
  countryCode?: string;
  email?: string;
  // Interest status between current user and this profile
  interestStatus?: 'none' | 'sent' | 'received' | 'declined';
  interestIsAccepted?: boolean;
  interestSendCount?: number;
  interestReceiveCount?: number;
  interestLastSentAt?: string | null;
  isReminderDue?: boolean;
  // Photo request state
  incomingPhotoRequest?: { type: 'access' | 'upload' } | null;
  myPhotoUploadRequestPending?: boolean;
  photoAccessRetryAfter?: string | null;
  photoAccessMaxed?: boolean;
  contactBlurred?: boolean;
  viewerIsElite?: boolean;
  partnerPreferences?: PartnerPreferences | null;
  profile: UserProfileSection & {
    photoAccess?: 'locked' | 'pending' | 'accepted' | 'declined' | null;
    familyOrigin?: string;
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

export interface CareerDetailsPayload {
  education?: string;
  educationDetail?: string;
  occupation?: string;
  sector?: string;
  monthlyIncome?: number;
  incomeCurrency?: string;
}

export interface FamilyDetailsPayload {
  fatherOccupation?: string;
  motherOccupation?: string;
  brotherCount?: number;
  brothersMarried?: number;
  sisterCount?: number;
  sistersMarried?: number;
}

export interface LifestyleDetailsPayload {
  physicalBuild?: string;
  languagesSpoken?: string[];
  dietHabit?: string;
  smokingHabit?: string;
  drinkingHabit?: string;
  hobbies?: string[];
  residentStatus?: string;
}

export interface PartnerPreferences {
  ageMin?: number | null;
  ageMax?: number | null;
  heightMinCm?: number | null;
  heightMaxCm?: number | null;
  maritalStatuses?: string[] | null;
  religions?: string[] | null;
  castes?: string[] | null;
  countries?: string[] | null;
  educationLevels?: string[] | null;
  aboutPartner?: string | null;
  physicalStatuses?: string[] | null;
  foodHabits?: string[] | null;
  smokingHabits?: string[] | null;
  drinkingHabits?: string[] | null;
}

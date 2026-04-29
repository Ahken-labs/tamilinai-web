export interface UserProfile {
  id: string;
  name: string;
  gender: string;
  profileType: string;
  dateOfBirth?: string;
  age?: number;
  maritalStatus?: string;
  height?: string;
  weight?: string;
  education?: string;
  occupation?: string;
  religion?: string;
  caste?: string;
  country?: string;
  city?: string;
  citizenship?: string;
  photoUrl?: string;
  about?: string;
  physicalChallenge?: string;
  disability?: string;
  createdAt: string;
}

export interface BasicDetailsPayload {
  dateOfBirth: string;
  maritalStatus: string;
  height: string;
  weight: string;
  physicalChallenge: string;
  disability?: string;
}

export interface PersonalDetailsPayload {
  education: string;
  occupation: string;
  religion: string;
  caste: string;
  country: string;
  city: string;
  citizenship: string;
}

export interface PhotoPayload {
  photo: File;
  about: string;
}

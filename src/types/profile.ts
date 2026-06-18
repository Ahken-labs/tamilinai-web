export interface Profile {
  id: string;
  displayId: string;
  name: string;
  age: number;
  location: string;
  education: string;
  country: string;
  work: string;
  religion: string;
  height: string;
  caste: string;
  isVerified: boolean;
  isElite: boolean;
  elitePlanKey?: string | null;
  isNew: boolean;
  isViewed: boolean;
  photo?: string;
  isPrivate?: boolean;
  isShortlisted?: boolean;
  gender?: string;
  interestStatus?: 'none' | 'sent' | 'received' | 'accepted' | 'declined';
}

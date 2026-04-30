export interface Profile {
  id: string;
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
  isNew: boolean;
  isViewed: boolean;
  photo?: string;
  isPrivate?: boolean;
}

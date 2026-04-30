export type InterestStatus =
  | "sent_interest"
  | "sent_reminder"
  | "received_interest"
  | "received_reminder"
  | "accepted_by_me"
  | "accepted_by_them"
  | "declined_by_me"
  | "skipped_by_them";

export interface Interest {
  id: string;
  profileName: string;
  profilePhoto?: string;
  myPhoto?: string;
  date: string;
  status: InterestStatus;
  isNew?: boolean;
  isReminderDue?: boolean;
}

// Backend API types
export type InterestStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn';

export interface SentInterest {
  receiverId: string;
  name: string;
  photoUrl?: string;
  status: InterestStatus;
  viewStatus?: string;
  sendCount: number;
  lastSentAt: string;
  respondedAt?: string;
  receiverUnblocked: boolean;
  isNew: boolean;
  isReminderDue: boolean;
}

export interface ReceivedInterest {
  senderId: string;
  name: string;
  photoUrl?: string;
  status: InterestStatus;
  viewStatus?: string;
  sendCount: number;
  lastSentAt: string;
  respondedAt?: string;
  receiverUnblocked: boolean;
  isNew: boolean;
}

// UI display type used by InterestCard component
export type InterestCardStatus =
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
  date: string;
  status: InterestCardStatus;
  isNew?: boolean;
  isReminderDue?: boolean;
}

function formatDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString("en-GB", {
      day: "2-digit", month: "long", year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

export function sentInterestToCard(s: SentInterest): Interest {
  let cardStatus: InterestCardStatus;
  if (s.status === "accepted") cardStatus = "accepted_by_them";
  else if (s.status === "declined") cardStatus = "skipped_by_them";
  else if (s.isReminderDue) cardStatus = "sent_reminder";
  else cardStatus = "sent_interest";

  return {
    id: s.receiverId,
    profileName: s.name,
    profilePhoto: s.photoUrl,
    date: formatDate(s.lastSentAt),
    status: cardStatus,
    isNew: s.isNew,
    isReminderDue: s.isReminderDue,
  };
}

export function receivedInterestToCard(r: ReceivedInterest): Interest {
  let cardStatus: InterestCardStatus;
  if (r.status === "accepted") cardStatus = "accepted_by_me";
  else if (r.status === "declined") cardStatus = "declined_by_me";
  else if (r.isNew) cardStatus = "received_reminder";
  else cardStatus = "received_interest";

  return {
    id: r.senderId,
    profileName: r.name,
    profilePhoto: r.photoUrl,
    date: formatDate(r.lastSentAt),
    status: cardStatus,
    isNew: r.isNew,
  };
}

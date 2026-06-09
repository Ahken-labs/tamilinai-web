// Backend API types
export type InterestStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn';

export interface SentInterest {
  receiverId: string;
  displayId?: string;
  name: string;
  gender?: string;
  photoUrl?: string;
  photoAccess?: string;
  status: InterestStatus;
  viewStatus?: string;
  cardType?: 'interest' | 'reminder';
  sendCount: number;
  lastSentAt: string;
  respondedAt?: string;
  receiverUnblocked: boolean;
  isNew: boolean;
  isReminderDue: boolean;
}

export interface ReceivedInterest {
  senderId: string;
  displayId?: string;
  name: string;
  gender?: string;
  photoUrl?: string;
  photoAccess?: string;
  status: InterestStatus;
  viewStatus?: string;
  cardType?: 'interest' | 'reminder';
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
  cardKey?: string;
  displayId?: string;
  profileName: string;
  profilePhoto?: string;
  gender?: string;
  isPhotoPrivate?: boolean;
  myPhoto?: string;
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

export function sentInterestToCard(s: SentInterest, myPhoto?: string): Interest {
  let cardStatus: InterestCardStatus;
  if (s.status === "accepted") cardStatus = "accepted_by_them";
  else if (s.status === "declined") cardStatus = "skipped_by_them";
  else if (s.viewStatus === "sent_reminder") cardStatus = "sent_reminder";
  else cardStatus = "sent_interest";

  return {
    id: s.receiverId,
    cardKey: s.cardType === 'reminder' ? `${s.receiverId}-reminder` : s.receiverId,
    displayId: s.displayId,
    profileName: s.name,
    gender: s.gender,
    profilePhoto: s.photoUrl,
    isPhotoPrivate: s.photoAccess === "locked",
    myPhoto,
    date: formatDate(s.lastSentAt),
    status: cardStatus,
    isNew: s.isNew,
    isReminderDue: s.isReminderDue,
  };
}

export function receivedInterestToCard(r: ReceivedInterest, myPhoto?: string): Interest {
  let cardStatus: InterestCardStatus;
  if (r.status === "accepted") cardStatus = "accepted_by_me";
  else if (r.status === "declined") cardStatus = "declined_by_me";
  else if (r.viewStatus === "received_reminder") cardStatus = "received_reminder";
  else cardStatus = "received_interest";

  return {
    id: r.senderId,
    cardKey: r.cardType === 'reminder' ? `${r.senderId}-reminder` : r.senderId,
    displayId: r.displayId,
    profileName: r.name,
    gender: r.gender,
    profilePhoto: r.photoUrl,
    isPhotoPrivate: r.photoAccess === "locked",
    myPhoto,
    date: formatDate(r.lastSentAt),
    status: cardStatus,
    isNew: r.isNew,
  };
}

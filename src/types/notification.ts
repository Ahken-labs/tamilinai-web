export type NotificationCategory = 'interest' | 'match' | 'account' | 'system' | 'promo';

export interface NotificationFromUser {
  id: string;
  name: string;
  photoUrl?: string;
}

export interface AppNotification {
  id: string;
  type: string;
  category: NotificationCategory;
  title: string;
  subtitle?: string;
  fromUser?: NotificationFromUser;
  isRead: boolean;
  createdAt: string;
}

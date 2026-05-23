import { http } from './client';
import type { AppNotification } from '../../types/notification';

export function getNotifications(): Promise<AppNotification[]> {
  return http('/api/interests/notifications');
}

export function markNotificationRead(notifId: string): Promise<void> {
  return http(`/api/interests/notifications/${notifId}/read`, { method: 'PATCH' });
}

export function markAllNotificationsRead(category?: 'interest'): Promise<void> {
  const url = category
    ? `/api/interests/notifications/read-all?category=${category}`
    : '/api/interests/notifications/read-all';
  return http(url, { method: 'PATCH' });
}

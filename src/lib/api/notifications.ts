import { http } from './client';
import type { AppNotification } from '../../types/notification';

export function getNotifications(): Promise<AppNotification[]> {
  return http('/api/interests/notifications');
}

export function markNotificationRead(notifId: string): Promise<void> {
  return http(`/api/interests/notifications/${notifId}/read`, { method: 'PATCH' });
}

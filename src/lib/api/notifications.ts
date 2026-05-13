import { apiCall } from './client';
import type { AppNotification } from '../../types/notification';

export interface NotificationsResponse {
  notifications: AppNotification[];
  page: number;
  hasMore: boolean;
}

export function getNotifications(page = 1): Promise<NotificationsResponse> {
  return apiCall(`/api/user/notifications?page=${page}`);
}

export function markNotificationRead(notifId: string): Promise<void> {
  return apiCall(`/api/user/notifications/${notifId}/read`, { method: 'PATCH' });
}

export function markAllNotificationsRead(): Promise<void> {
  return apiCall('/api/user/notifications/read-all', { method: 'PATCH' });
}

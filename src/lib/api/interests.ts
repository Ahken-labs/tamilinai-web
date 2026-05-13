import { apiCall } from './client';
import type { SentInterest, ReceivedInterest } from '../../types/interest';

export function sendInterest(receiverId: string): Promise<{ message: string }> {
  return apiCall(`/api/interests/${receiverId}`, { method: 'POST' });
}

export function withdrawInterest(receiverId: string): Promise<{ message: string }> {
  return apiCall(`/api/interests/${receiverId}`, { method: 'DELETE' });
}

export function respondToInterest(
  senderId: string,
  action: 'accepted' | 'declined'
): Promise<{ message: string }> {
  return apiCall(`/api/interests/${senderId}/respond`, {
    method: 'PATCH',
    body: JSON.stringify({ action }),
  });
}

export function getSentInterests(): Promise<SentInterest[]> {
  return apiCall('/api/interests/sent');
}

export function getReceivedInterests(): Promise<ReceivedInterest[]> {
  return apiCall('/api/interests/received');
}

export function unblockSender(senderId: string): Promise<{ message: string }> {
  return apiCall(`/api/interests/${senderId}/unblock`, { method: 'POST' });
}

export function markInterestSeen(userId: string): Promise<void> {
  return apiCall(`/api/interests/${userId}/seen`, { method: 'PATCH' });
}

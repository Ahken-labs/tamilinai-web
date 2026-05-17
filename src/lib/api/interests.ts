import { http } from './client';
import type { SentInterest, ReceivedInterest } from '../../types/interest';

export function sendInterest(receiverId: string): Promise<{ message: string }> {
  return http(`/api/interests/${receiverId}`, { method: 'POST' });
}

export function withdrawInterest(receiverId: string): Promise<{ message: string }> {
  return http(`/api/interests/${receiverId}`, { method: 'DELETE' });
}

export function respondToInterest(
  senderId: string,
  action: 'accepted' | 'declined'
): Promise<{ message: string }> {
  return http(`/api/interests/${senderId}/respond`, {
    method: 'PATCH',
    body: JSON.stringify({ action }),
  });
}

export function getSentInterests(): Promise<SentInterest[]> {
  return http('/api/interests/sent');
}

export function getReceivedInterests(): Promise<ReceivedInterest[]> {
  return http('/api/interests/received');
}

export function unblockSender(senderId: string): Promise<{ message: string }> {
  return http(`/api/interests/${senderId}/unblock`, { method: 'POST' });
}

export function markInterestSeen(userId: string): Promise<void> {
  return http(`/api/interests/${userId}/seen`, { method: 'PATCH' });
}

'use client';

import { useEffect } from 'react';
import API_BASE_URL from '../lib/api/config';

export default function SessionRestorer() {
  useEffect(() => {
    const token = localStorage.getItem('tamilinai_access_token');
    const user = localStorage.getItem('tamilinai_user');
    if (!token || !user) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = payload.exp * 1000;
      if (Date.now() < expiresAt - 60_000) return; // still valid
    } catch {
      return;
    }

    fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: { accessToken: string; user: unknown }) => {
        localStorage.setItem('tamilinai_access_token', data.accessToken);
        localStorage.setItem('tamilinai_user', JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem('tamilinai_access_token');
        localStorage.removeItem('tamilinai_user');
      });
  }, []);

  return null;
}

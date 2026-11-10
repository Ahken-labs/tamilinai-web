'use client';

import { useEffect } from 'react';
import { tryRefresh } from '../lib/api/refresh';

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

    // Shares the in-flight renewal with API calls; two parallel renewals would make the server reject one and log the user out
    tryRefresh().then((ok) => {
      if (ok) return;
      localStorage.removeItem('tamilinai_access_token');
      localStorage.removeItem('tamilinai_user');
    });
  }, []);

  return null;
}

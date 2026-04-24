'use client';

import { useEffect } from 'react';

/**
 * This page is used as a callbackUrl for OAuth popups.
 * It communicates with the parent window and closes itself.
 */
export default function AuthSuccessPage() {
  useEffect(() => {
    if (window.opener) {
      // Send message to the parent window
      window.opener.postMessage('auth-success', window.location.origin);
      // Close the popup
      window.close();
    } else {
      // If accessed directly, redirect to home
      window.location.href = '/';
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mb-4" />
      <h1 className="text-xl font-semibold text-slate-800">Authenticating...</h1>
      <p className="text-sm text-slate-500 mt-2">Connecting to your account and syncing data.</p>
    </div>
  );
}

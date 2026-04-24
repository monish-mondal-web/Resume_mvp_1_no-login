'use client';

import { useEffect } from 'react';
import { signIn } from 'next-auth/react';

/**
 * Trigger page for OAuth popups.
 * This page initiates the sign-in flow immediately.
 */
export default function PopupSigninPage() {
  useEffect(() => {
    // Initiate the Google sign-in redirect within the popup
    signIn('google', { callbackUrl: '/auth/success' });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      <p className="mt-4 text-sm font-medium text-slate-500">Redirecting to Google...</p>
    </div>
  );
}

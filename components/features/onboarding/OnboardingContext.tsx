'use client';

import React, { createContext, useContext } from 'react';
import type { Session } from 'next-auth';

interface OnboardingContextValue {
  session: Session | null;
  selectedMoreIds: string[];
  toggleMoreSection: (id: string) => void;
  showPhoto: boolean;
  onTogglePhoto: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue>({
  session: null,
  selectedMoreIds: [],
  toggleMoreSection: () => {},
  showPhoto: true,
  onTogglePhoto: () => {},
});

export function OnboardingContextProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: OnboardingContextValue;
}) {
  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingContext() {
  return useContext(OnboardingContext);
}

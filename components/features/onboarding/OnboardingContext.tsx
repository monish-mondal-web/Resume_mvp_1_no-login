'use client';

import React, { createContext, useContext } from 'react';

interface OnboardingContextValue {
  selectedMoreIds: string[];
  toggleMoreSection: (id: string) => void;
  showPhoto: boolean;
  onTogglePhoto: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue>({
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

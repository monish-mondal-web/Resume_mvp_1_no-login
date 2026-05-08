'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';

interface PricingModalContextValue {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const PricingModalContext = createContext<PricingModalContextValue | null>(null);

export function PricingModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal  = useCallback(() => setIsOpen(true),  []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <PricingModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </PricingModalContext.Provider>
  );
}

export function usePricingModal(): PricingModalContextValue {
  const ctx = useContext(PricingModalContext);
  if (!ctx) throw new Error('usePricingModal must be used within PricingModalProvider');
  return ctx;
}

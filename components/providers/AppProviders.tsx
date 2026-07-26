'use client';

import React from 'react';
import { PricingModalProvider } from '@/hooks/usePricingModal';
import { PricingModal } from '@/components/pricing/pricing-modal';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <PricingModalProvider>
      {children}
      <PricingModal />
    </PricingModalProvider>
  );
};

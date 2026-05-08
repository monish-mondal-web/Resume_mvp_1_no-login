'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';
import { PricingModalProvider } from '@/hooks/usePricingModal';
import { PricingModal } from '@/components/pricing/pricing-modal';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <PricingModalProvider>
        {children}
        <PricingModal />
      </PricingModalProvider>
    </SessionProvider>
  );
};

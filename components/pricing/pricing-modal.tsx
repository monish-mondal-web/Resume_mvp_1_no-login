'use client';

import React, { useRef, useState } from 'react';
import type { BillingCycle, PricingPlan } from '@/types/pricing';
import { Modal } from '@/components/ui/modal';
import { PricingHeader } from './pricing-header';
import { PricingCard } from './pricing-card';
import { PRICING_PLANS } from '@/lib/pricing-config';
import { usePricingModal } from '@/hooks/usePricingModal';

// Desktop: Pro card lifted via sm:-my-3
const ORDER_CLASSES: Record<string, string> = {
  basic:   'sm:order-1',
  pro:     'sm:order-2 sm:-my-3',
  premium: 'sm:order-3',
};

// Mobile: Pro first, then Basic, then Premium
const MOBILE_ORDER: PricingPlan[] = [
  PRICING_PLANS[1],
  PRICING_PLANS[0],
  PRICING_PLANS[2],
];

function ChevronIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {dir === 'left' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

// ── Mobile slider ─────────────────────────────────────────────────────────────
function MobileSlider({ billing }: { billing: BillingCycle }) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(0);

  const prev = () => setActive(a => Math.max(0, a - 1));
  const next = () => setActive(a => Math.min(MOBILE_ORDER.length - 1, a + 1));

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -40) next();
    if (dx > 40)  prev();
  };

  const canPrev = active > 0;
  const canNext = active < MOBILE_ORDER.length - 1;

  return (
    <div className="relative py-6 px-2">
      {/* Slider track — overflow-hidden is fine because badge is now inline on mobile */}
      <div className="overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(calc(-${active * 100}%))` }}
        >
          {MOBILE_ORDER.map((plan) => (
            <div key={plan.id} className="w-full flex-shrink-0 px-5">
              <PricingCard plan={plan} billing={billing} />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={prev}
        disabled={!canPrev}
        aria-label="Previous plan"
        className={['absolute left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all', canPrev ? 'cursor-pointer text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600' : 'cursor-default text-slate-300 opacity-50'].join(' ')}
      >
        <ChevronIcon dir="left" />
      </button>
      <button
        type="button"
        onClick={next}
        disabled={!canNext}
        aria-label="Next plan"
        className={['absolute right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all', canNext ? 'cursor-pointer text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600' : 'cursor-default text-slate-300 opacity-50'].join(' ')}
      >
        <ChevronIcon dir="right" />
      </button>

      {/* Dot indicators */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {MOBILE_ORDER.map((plan, i) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View ${plan.name} plan`}
            className={['h-1.5 cursor-pointer rounded-full transition-all duration-200', i === active ? 'w-6 bg-indigo-600' : 'w-1.5 bg-slate-200 hover:bg-slate-300'].join(' ')}
          />
        ))}
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function PricingModal() {
  const { isOpen, closeModal } = usePricingModal();
  const [billing, setBilling] = useState<BillingCycle>('yearly');

  return (
    <Modal isOpen={isOpen} onClose={closeModal} maxWidth="1020px" aria-label="Choose your plan">
      <div
        className="flex flex-col"
        style={{ maxHeight: 'min(92svh, 92dvh, calc(100vh - 32px))' }}
      >
        <div className="flex-shrink-0">
          <PricingHeader onClose={closeModal} billing={billing} onBillingChange={setBilling} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Mobile: one card at a time slider */}
          <div className="sm:hidden">
            <MobileSlider billing={billing} />
          </div>

          {/* Desktop: 3-column grid */}
          <div className="hidden sm:grid sm:grid-cols-3 sm:items-start sm:gap-5 sm:px-8 sm:py-8">
            {PRICING_PLANS.map((plan) => (
              <PricingCard key={plan.id} plan={plan} billing={billing} orderClass={ORDER_CLASSES[plan.id]} />
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-5 py-4 sm:px-8">
            <p className="text-center text-[11px] text-gray-400">
              7-day free trial · No credit card required · Credits reset every billing cycle
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

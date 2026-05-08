'use client';

import React, { useRef, useState } from 'react';
import type { BillingCycle } from '@/types/pricing';

interface PricingHeaderProps {
  onClose: () => void;
  billing: BillingCycle;
  onBillingChange: (b: BillingCycle) => void;
}

// ── "How credits work?" — hover + click ───────────────────────────────────────
function CreditsTooltip() {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const hide = () => { timer.current = setTimeout(() => setOpen(false), 150); };

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={show}
        onMouseLeave={hide}
        onClick={() => setOpen(o => !o)}
        className="flex cursor-pointer items-center gap-1 text-[11.5px] text-slate-400 transition-colors hover:text-indigo-500"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
        </svg>
        How credits work?
      </button>

      {open && (
        <div
          onMouseEnter={show}
          onMouseLeave={hide}
          className="absolute left-0 top-full z-50 mt-2.5 w-60 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
        >
          <div className="absolute -top-[5px] left-4 h-2.5 w-2.5 rotate-45 border-l border-t border-slate-200 bg-white" />
          <p className="mb-1.5 text-[12px] font-semibold text-slate-800">Credits are your AI fuel</p>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Every AI action — ATS checks, job tailoring, headshots — spends credits from your monthly balance. Credits refill each billing cycle.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Billing toggle — smooth sliding pill ──────────────────────────────────────
function BillingToggle({ billing, onChange }: { billing: BillingCycle; onChange: (b: BillingCycle) => void }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center rounded-full border border-slate-200 bg-slate-50 p-[3px]">
        {/* Sliding pill */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[3px] rounded-full bg-white shadow-sm transition-all duration-200 ease-out"
          style={{ height: 'calc(100% - 6px)', width: 'calc(50% - 1.5px)', left: billing === 'monthly' ? 3 : 'calc(50% + 1.5px)' }}
        />
        <button
          type="button"
          onClick={() => onChange('monthly')}
          className={['relative z-10 w-[4.5rem] cursor-pointer rounded-full py-[5px] text-center text-[12px] font-medium transition-colors duration-150', billing === 'monthly' ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'].join(' ')}
        >Monthly</button>
        <button
          type="button"
          onClick={() => onChange('yearly')}
          className={['relative z-10 w-[4.5rem] cursor-pointer rounded-full py-[5px] text-center text-[12px] font-medium transition-colors duration-150', billing === 'yearly' ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'].join(' ')}
        >Yearly</button>
      </div>

      {/* Save badge — fades in when yearly active */}
      <span
        className={[
          'rounded-full bg-emerald-100 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-emerald-700 transition-all duration-200',
          billing === 'yearly' ? 'scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-0',
        ].join(' ')}
      >
        Save 13%
      </span>
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
export function PricingHeader({ onClose, billing, onBillingChange }: PricingHeaderProps) {
  return (
    <div className="relative border-b border-gray-100 px-5 py-4 sm:px-8">
      {/* Close — always absolute at top-right, never in flow */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close pricing modal"
        className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-700 active:scale-95"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Title + toggle — flex-col on mobile, flex-row on desktop */}
      <div className="flex flex-col gap-3 pr-10 sm:flex-row sm:items-center sm:justify-between sm:pr-12">
        {/* Left: title + subtitle + tooltip */}
        <div>
          <h2 className="text-[18px] font-bold text-gray-900">Choose Your Plan</h2>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-[12.5px] text-gray-500">Credits power every AI feature · Reset monthly</p>
            <CreditsTooltip />
          </div>
        </div>

        {/* Right: billing toggle */}
        <div className="flex-shrink-0">
          <BillingToggle billing={billing} onChange={onBillingChange} />
        </div>
      </div>
    </div>
  );
}

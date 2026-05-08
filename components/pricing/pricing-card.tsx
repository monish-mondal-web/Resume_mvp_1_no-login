'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { PricingPlan, BillingCycle, FeatureItem } from '@/types/pricing';
import { PLAN_FEATURES } from '@/lib/pricing-config';

interface PricingCardProps {
  plan: PricingPlan;
  billing: BillingCycle;
  orderClass?: string;
}

const PRICE_ANIM = `
  @keyframes priceFadeIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .price-fade-in { animation: priceFadeIn 180ms ease-out forwards; }
`;

// ── AI sparkle icon (filled, matches reference) ───────────────────────────────
function AISparkleIcon({ className }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M9.5 2 L11.2 7.8 L17 9.5 L11.2 11.2 L9.5 17 L7.8 11.2 L2 9.5 L7.8 7.8 Z" />
      <path d="M19 14.5 L20.1 17.9 L23.5 19 L20.1 20.1 L19 23.5 L17.9 20.1 L14.5 19 L17.9 17.9 Z" />
      <path d="M19.5 1 L20.4 3.6 L23 4.5 L20.4 5.4 L19.5 8 L18.6 5.4 L16 4.5 L18.6 3.6 Z" />
    </svg>
  );
}

function CheckIcon({ highlight }: { highlight: boolean }) {
  return (
    <div className={['mt-0.5 flex h-[15px] w-[15px] flex-shrink-0 items-center justify-center rounded-full', highlight ? 'bg-indigo-100' : 'bg-slate-100'].join(' ')}>
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className={highlight ? 'text-indigo-600' : 'text-slate-500'} aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}

function ProGradientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative p-[1.5px] rounded-[22px] bg-gradient-to-b from-indigo-400 via-violet-500 to-purple-600 shadow-[0_20px_60px_-15px_rgba(99,102,241,0.35)]">
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ── Plan badge — reused in both inline (mobile) and absolute (desktop) ────────
function PlanBadge({ plan }: { plan: PricingPlan }) {
  if (!plan.badge) return null;
  return (
    <span className={[
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest',
      plan.badgeVariant === 'popular'
        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
        : 'border border-violet-200 bg-violet-100 text-violet-700',
    ].join(' ')}>
      {plan.badge}
    </span>
  );
}

// ── Portal tooltip — position fixed, never clipped by scroll containers ───────
interface TipState { text: string; x: number; y: number }

function FeatureTip({ tip }: { tip: TipState }) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{ left: tip.x, top: tip.y, transform: 'translate(-50%, calc(-100% - 10px))' }}
    >
      <div className="relative max-w-[210px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.13)]">
        <p className="text-[11px] leading-relaxed text-slate-600">{tip.text}</p>
        <div className="absolute -bottom-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-slate-200 bg-white" />
      </div>
    </div>,
    document.body
  );
}

// ── Feature row ───────────────────────────────────────────────────────────────
function FeatureRow({
  feature, highlight, onShowTip, onHideTip,
}: {
  feature: FeatureItem;
  highlight: boolean;
  onShowTip: (btn: HTMLButtonElement, text: string) => void;
  onHideTip: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    if (btnRef.current) onShowTip(btnRef.current, feature.hint);
  };
  const scheduleHide = () => { leaveTimer.current = setTimeout(onHideTip, 120); };

  return (
    <div className="flex items-center gap-2">
      <CheckIcon highlight={highlight} />
      <span className="flex-1 text-[12px] font-medium text-slate-700 sm:text-[12.5px]">{feature.label}</span>
      {feature.unlimited && (
        <span className="flex-shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[9.5px] font-semibold text-emerald-600 ring-1 ring-emerald-100">
          Unlimited
        </span>
      )}
      <button
        ref={btnRef}
        type="button"
        data-info-btn="true"
        aria-label={`About ${feature.label}`}
        onMouseEnter={show}
        onMouseLeave={scheduleHide}
        onClick={show}
        style={{ cursor: 'help' }}
        className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-500"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
        </svg>
      </button>
    </div>
  );
}

// ── Card inner ────────────────────────────────────────────────────────────────
function CardInner({ plan, billing }: { plan: PricingPlan; billing: BillingCycle }) {
  const [loading, setLoading] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [tip, setTip] = useState<TipState | null>(null);
  const { highlight } = plan;
  const price = billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

  useEffect(() => { setAnimKey(k => k + 1); }, [billing]);

  // Click outside to close tooltip — skip clicks on any info button
  useEffect(() => {
    if (!tip) return;
    const handler = (e: MouseEvent) => {
      if ((e.target as Element).closest('[data-info-btn]')) return;
      setTip(null);
    };
    const t = setTimeout(() => document.addEventListener('click', handler), 0);
    return () => { clearTimeout(t); document.removeEventListener('click', handler); };
  }, [tip?.text]);

  const showTip = (btn: HTMLButtonElement, text: string) => {
    const rect = btn.getBoundingClientRect();
    setTip({ text, x: rect.left + rect.width / 2, y: rect.top });
  };

  return (
    <>
      <style>{PRICE_ANIM}</style>
      {tip && <FeatureTip tip={tip} />}

      <div className={[
        'relative flex flex-col rounded-[20px] bg-white p-4 sm:p-6',
        !highlight && 'border border-gray-200 hover:border-gray-300 transition-colors duration-150',
      ].filter(Boolean).join(' ')}>

        {/* Badge — DESKTOP ONLY: floats above the gradient border */}
        {plan.badge && (
          <div className="absolute -top-[13px] left-5 hidden sm:block">
            <PlanBadge plan={plan} />
          </div>
        )}

        {/* Badge — MOBILE ONLY: inline at top of card, inside padding */}
        {plan.badge && (
          <div className="mb-3 sm:hidden">
            <PlanBadge plan={plan} />
          </div>
        )}

        {/* Plan name + subtitle */}
        <div className="mb-3 sm:mb-4">
          <p className={['text-[10px] font-bold uppercase tracking-[0.18em] sm:text-[10.5px]', highlight ? 'text-indigo-600' : 'text-slate-400'].join(' ')}>
            {plan.name}
          </p>
          <p className="mt-1 text-[12px] leading-snug text-slate-500 sm:text-[12.5px]">{plan.subtitle}</p>
        </div>

        {/* Price + strikethrough */}
        <div className="mb-1 flex items-end gap-2">
          <div className="flex items-end gap-1">
            <span className="mb-1.5 text-[13px] font-medium text-slate-400">₹</span>
            <span key={animKey} className={['price-fade-in font-bold leading-none tracking-tight', highlight ? 'text-[40px] text-indigo-600 sm:text-[46px]' : 'text-[36px] text-slate-900 sm:text-[42px]'].join(' ')}>
              {price}
            </span>
            <span className="mb-1.5 text-[12px] text-slate-400">/ mo</span>
          </div>
          {billing === 'yearly' && (
            <span key={`orig-${animKey}`} className="price-fade-in mb-1.5 text-[15px] font-medium text-slate-300 line-through">
              ₹{plan.monthlyPrice}
            </span>
          )}
        </div>

        {/* Billing note */}
        <div className="mb-4 min-h-[16px] sm:mb-5">
          <p key={`note-${animKey}`} className="price-fade-in text-[11px] text-slate-400">
            {billing === 'yearly'
              ? <span>₹{plan.yearlyTotal}/yr billed annually · <span className="font-semibold text-emerald-600">save ₹{plan.yearlySaving}</span></span>
              : 'Billed monthly · Cancel anytime'}
          </p>
        </div>

        {/* CTA */}
        {highlight ? (
          <button type="button" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1800); }} disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-[13px] font-semibold text-white transition-all duration-150 hover:from-indigo-700 hover:to-violet-700 hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)] active:scale-[0.98] disabled:opacity-60 sm:text-[13.5px]">
            {loading ? <><Spinner />Processing…</> : plan.ctaLabel}
          </button>
        ) : (
          <button type="button" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1800); }} disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-[13px] font-semibold text-slate-700 transition-all duration-150 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-[0.98] disabled:opacity-60 sm:text-[13.5px]">
            {loading ? <><Spinner />Processing…</> : plan.ctaLabel}
          </button>
        )}

        {/* Credits section */}
        <div className={['mt-3 rounded-2xl px-3 py-3 sm:mt-4 sm:px-4 sm:py-3.5', highlight ? 'bg-gradient-to-br from-indigo-50 to-violet-50 ring-1 ring-indigo-100' : 'bg-slate-50 ring-1 ring-slate-100'].join(' ')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AISparkleIcon className={highlight ? 'text-indigo-500' : 'text-slate-400'} />
              <span className={['font-semibold leading-none tabular-nums tracking-tight', highlight ? 'text-[22px] text-indigo-700 sm:text-[24px]' : 'text-[22px] text-slate-800 sm:text-[24px]'].join(' ')}>
                {plan.credits.toLocaleString()}
              </span>
            </div>
            <span className={['text-[9.5px] font-semibold uppercase tracking-wider sm:text-[10px]', highlight ? 'text-indigo-400' : 'text-slate-400'].join(' ')}>
              credits / mo
            </span>
          </div>
          <p className={['mt-1.5 text-[11px] font-medium sm:text-[11.5px]', highlight ? 'text-indigo-600' : 'text-slate-600'].join(' ')}>{plan.creditHint}</p>
          <p className="mt-0.5 text-[10px] text-slate-400 sm:text-[10.5px]">Use credits for any AI feature</p>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-slate-100 sm:my-5" />

        {/* Features */}
        <ul className="flex flex-col gap-2.5 sm:gap-3">
          {PLAN_FEATURES.map((f) => (
            <li key={f.label}>
              <FeatureRow feature={f} highlight={highlight} onShowTip={showTip} onHideTip={() => setTip(null)} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export function PricingCard({ plan, billing, orderClass = '' }: PricingCardProps) {
  if (plan.highlight) {
    return (
      <div className={orderClass}>
        <ProGradientWrapper>
          <CardInner plan={plan} billing={billing} />
        </ProGradientWrapper>
      </div>
    );
  }
  return (
    <div className={orderClass}>
      <CardInner plan={plan} billing={billing} />
    </div>
  );
}

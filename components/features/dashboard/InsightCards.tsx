'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePricingModal } from '@/hooks/usePricingModal';
import type { ATSResult } from '@/lib/resume-builder';

interface Props { atsResult: ATSResult | null; }

// ── Helpers ───────────────────────────────────────────────────────────────────

function scorePal(score: number) {
  if (score >= 80) return { color: '#10b981', bg: '#f0fdf4', label: 'Excellent' };
  if (score >= 60) return { color: '#f59e0b', bg: '#fffbeb', label: 'Good' };
  if (score >= 40) return { color: '#f97316', bg: '#fff7ed', label: 'Fair' };
  return               { color: '#ef4444', bg: '#fff1f2', label: 'Needs Work' };
}

function strengthLabel(score?: number) {
  if (!score || score < 40) return { label: 'Weak',    color: '#ef4444', pct: score ?? 0 };
  if (score < 60)           return { label: 'Average', color: '#f59e0b', pct: score };
  if (score < 80)           return { label: 'Good',    color: '#6366f1', pct: score };
  return                           { label: 'Strong',  color: '#10b981', pct: score };
}

function readiness(result: ATSResult | null) {
  if (!result) return { pct: 0, missing: ['Professional summary', 'Quantified achievements', 'Relevant keywords'] };
  const ready = result.categories.filter(c => (c.score / c.maxScore) >= 0.65).length;
  const pct   = Math.round((ready / result.categories.length) * 100);
  const missing = result.categories
    .filter(c => (c.score / c.maxScore) < 0.65)
    .flatMap(c => c.tips)
    .slice(0, 3);
  return { pct, missing: missing.length ? missing : ['Quantified achievements', 'Keywords'] };
}

// ── Score ring ────────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnim(score), 80); return () => clearTimeout(t); }, [score]);
  const R = 36, C = 2 * Math.PI * R;
  const p = scorePal(score);
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" fill="none" aria-label={`ATS Score ${score}`}>
      <circle cx="44" cy="44" r={R} stroke="#f1f5f9" strokeWidth="7" fill="none" />
      <circle cx="44" cy="44" r={R} stroke={p.color} strokeWidth="7" fill="none"
        strokeLinecap="round" strokeDasharray={`${(anim / 100) * C} ${C}`}
        transform="rotate(-90 44 44)"
        style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <text x="44" y="40" textAnchor="middle" fontSize="18" fontWeight="700" fill={p.color}>{score}</text>
      <text x="44" y="54" textAnchor="middle" fontSize="9" fill="#94a3b8">/ 100</text>
    </svg>
  );
}

// ── Card shell ────────────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">{children}</p>;
}

// ── ATS Score card ────────────────────────────────────────────────────────────

function ATSScoreCard({ result }: { result: ATSResult | null }) {
  const score = result?.score ?? 0;
  const p     = scorePal(score);

  return (
    <Card>
      <SectionLabel>ATS Score</SectionLabel>
      <div className="flex items-center gap-4">
        {result ? <ScoreRing score={score} /> : (
          <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border-[7px] border-slate-100">
            <span className="text-[11px] text-gray-300">—</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: p.bg, color: p.color }}>
            {result ? p.label : 'No data'}
          </span>
          {result && (
            <div className="mt-2 space-y-1.5">
              {result.categories.slice(0, 3).map(c => {
                const pct = Math.round((c.score / c.maxScore) * 100);
                const cp  = scorePal(pct);
                return (
                  <div key={c.id} className="flex items-center gap-2">
                    <span className="w-[68px] truncate text-[10px] text-gray-400">{c.name}</span>
                    <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: cp.color }} />
                    </div>
                    <span className="w-6 text-right text-[10px] font-medium" style={{ color: cp.color }}>{pct}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Link
        href="/resume/builder?tab=ats-score"
        className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-indigo-100 bg-indigo-50 py-2 text-[12px] font-semibold text-indigo-600 transition hover:bg-indigo-100"
      >
        Improve Now
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </Link>
    </Card>
  );
}

// ── Resume Strength card ──────────────────────────────────────────────────────

function ResumeStrengthCard({ result }: { result: ATSResult | null }) {
  const [animPct, setAnimPct] = useState(0);
  const str = strengthLabel(result?.score);
  useEffect(() => { const t = setTimeout(() => setAnimPct(str.pct), 120); return () => clearTimeout(t); }, [str.pct]);

  const levels = [
    { label: 'Weak',    threshold: 0  },
    { label: 'Average', threshold: 40 },
    { label: 'Good',    threshold: 60 },
    { label: 'Strong',  threshold: 80 },
  ];

  return (
    <Card>
      <SectionLabel>Resume Strength</SectionLabel>
      <div className="mb-4 flex items-end justify-between">
        <p className="text-[28px] font-bold leading-none" style={{ color: str.color }}>{str.label}</p>
        <span className="text-[13px] font-medium text-gray-400">{str.pct}%</span>
      </div>

      {/* Segmented progress */}
      <div className="flex gap-1">
        {levels.map((lv, i) => {
          const filled = animPct >= lv.threshold + (i === 0 ? 1 : 0);
          return (
            <div key={lv.label} className="flex-1 overflow-hidden rounded-full">
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{
                  background: filled ? str.color : '#f1f5f9',
                  transitionDelay: `${i * 120}ms`,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between">
        {levels.map(lv => (
          <span key={lv.label} className="text-[9px] font-medium text-gray-300">{lv.label}</span>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-gray-100 bg-slate-50 px-3.5 py-3">
        <p className="text-[11px] text-gray-500">
          {str.pct >= 80
            ? 'Your resume is strong. Consider job-specific optimizations.'
            : str.pct >= 60
            ? 'Good foundation. Adding achievements will push you higher.'
            : str.pct >= 40
            ? 'Add a summary and quantify your work experience.'
            : 'Start by filling in all sections and adding a professional summary.'
          }
        </p>
      </div>
    </Card>
  );
}

// ── Job Readiness card ────────────────────────────────────────────────────────

function JobReadinessCard({ result }: { result: ATSResult | null }) {
  const { pct, missing } = readiness(result);
  const [anim, setAnim] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnim(pct), 150); return () => clearTimeout(t); }, [pct]);

  const R = 28, C = 2 * Math.PI * R;
  const color = pct >= 75 ? '#10b981' : pct >= 50 ? '#6366f1' : '#f59e0b';

  return (
    <Card>
      <SectionLabel>Job Readiness</SectionLabel>
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <circle cx="36" cy="36" r={R} stroke="#f1f5f9" strokeWidth="6" fill="none" />
            <circle cx="36" cy="36" r={R} stroke={color} strokeWidth="6" fill="none"
              strokeLinecap="round" strokeDasharray={`${(anim / 100) * C} ${C}`}
              transform="rotate(-90 36 36)"
              style={{ transition: 'stroke-dasharray 0.9s ease' }}
            />
            <text x="36" y="33" textAnchor="middle" fontSize="14" fontWeight="700" fill={color}>{pct}%</text>
            <text x="36" y="45" textAnchor="middle" fontSize="8" fill="#94a3b8">Ready</text>
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-1.5 text-[11px] font-semibold text-gray-500">Missing elements</p>
          <ul className="space-y-1">
            {missing.slice(0, 3).map((m, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span className="text-[11px] leading-snug text-gray-500">{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

// ── Plan Status card ──────────────────────────────────────────────────────────

function PlanStatusCard() {
  const { openModal } = usePricingModal();
  const perks = ['AI profile headshots', 'Resume conversions', 'ATS fixes', 'Job optimization'];
  return (
    <Card>
      <SectionLabel>Current Plan</SectionLabel>
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[12px] font-semibold text-gray-600">Free Plan</span>
        <span className="text-[11px] text-gray-400">1 / 2 resumes</span>
      </div>
      <ul className="mb-4 space-y-1.5">
        {perks.map(p => (
          <li key={p} className="flex items-center gap-2 text-[11px] text-gray-400">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            {p}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={openModal}
        className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-[12px] font-bold text-white transition hover:opacity-90 active:scale-[0.98]"
      >
        Upgrade to Pro
      </button>
      <p className="mt-1.5 text-center text-[10px] text-gray-400">From ₹99/month · Cancel anytime</p>
    </Card>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export function InsightCards({ atsResult }: Props) {
  return (
    <div>
      <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Resume Intelligence</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ATSScoreCard    result={atsResult} />
        <ResumeStrengthCard result={atsResult} />
        <JobReadinessCard   result={atsResult} />
        <PlanStatusCard />
      </div>
    </div>
  );
}

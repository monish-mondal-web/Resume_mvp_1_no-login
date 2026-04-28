'use client';

import React, { useMemo, useState } from 'react';
import { computeATSScore } from '@/lib/resume-builder';
import type { ATSCategory } from '@/lib/resume-builder';
import type { ResumeData } from '@/types/resume.types';

// ── palette ───────────────────────────────────────────────────────────────────

function pal(score: number, max = 100) {
  const p = (score / max) * 100;
  if (p >= 80) return { bar: '#10b981', text: '#065f46', bg: '#f0fdf4', border: '#bbf7d0', chip: '#dcfce7', label: 'Excellent'  };
  if (p >= 60) return { bar: '#f59e0b', text: '#92400e', bg: '#fffbeb', border: '#fde68a', chip: '#fef3c7', label: 'Good'       };
  if (p >= 40) return { bar: '#f97316', text: '#7c2d12', bg: '#fff7ed', border: '#fed7aa', chip: '#ffedd5', label: 'Fair'       };
  return            { bar: '#f43f5e', text: '#881337', bg: '#fff1f2', border: '#fecdd3', chip: '#ffe4e6', label: 'Needs Work'};
}

// ── category icons (SVG inline) ───────────────────────────────────────────────

function CategoryIcon({ id }: { id: string }) {
  const cls = 'flex-shrink-0';
  if (id === 'contact') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
  if (id === 'summary') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  );
  if (id === 'experience') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    </svg>
  );
  if (id === 'education') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
    </svg>
  );
  if (id === 'skills') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
  // presence / default
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PassIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-emerald-500">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function FailIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-slate-300">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ── Score ring ────────────────────────────────────────────────────────────────

const RING_R = 44;
const RING_C = 2 * Math.PI * RING_R;

function ScoreRing({ score }: { score: number }) {
  const p = pal(score);
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="112" height="112" viewBox="0 0 112 112" fill="none" aria-label={`ATS Score ${score}`}>
        <circle cx="56" cy="56" r={RING_R} stroke="#e2e8f0" strokeWidth="8" fill="none" />
        <circle
          cx="56" cy="56" r={RING_R}
          stroke={p.bar} strokeWidth="8" fill="none" strokeLinecap="round"
          strokeDasharray={`${(score / 100) * RING_C} ${RING_C}`}
          transform="rotate(-90 56 56)"
          style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
        />
        <text x="56" y="50" textAnchor="middle" fontSize="22" fontWeight="700" fill={p.text}>{score}</text>
        <text x="56" y="66" textAnchor="middle" fontSize="10" fill="#94a3b8">/ 100</text>
      </svg>
      <span
        className="rounded-full px-3 py-0.5 text-[11px] font-medium"
        style={{ background: p.chip, color: p.text }}
      >
        {p.label}
      </span>
    </div>
  );
}

// ── Category row (expandable) ─────────────────────────────────────────────────

function CategoryRow({ cat, isOpen, onToggle }: {
  cat: ATSCategory;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const pct = Math.round((cat.score / cat.maxScore) * 100);
  const p   = pal(cat.score, cat.maxScore);

  return (
    <div className="border-b border-slate-100 last:border-0">
      {/* Header row — click to expand */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-slate-50/70"
      >
        {/* Category icon */}
        <span
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
          style={{ background: p.chip, color: p.text }}
        >
          <CategoryIcon id={cat.id} />
        </span>

        {/* Name */}
        <span className="flex-1 text-[13px] font-medium text-slate-800">{cat.name}</span>

        {/* Progress bar */}
        <div className="hidden w-20 sm:block">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, backgroundColor: p.bar }}
            />
          </div>
        </div>

        {/* Score chip */}
        <span
          className="w-[52px] flex-shrink-0 rounded-full px-2 py-0.5 text-center text-[11px] font-medium"
          style={{ background: p.chip, color: p.text }}
        >
          {cat.score}/{cat.maxScore}
        </span>

        {/* Chevron */}
        <span className="flex-shrink-0 text-slate-400">
          <ChevronIcon open={isOpen} />
        </span>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="px-5 pb-4 pt-1">
          {/* Checks */}
          <ul className="mb-3 space-y-1.5">
            {cat.checks.map((ch) => (
              <li key={ch.label} className="flex items-center gap-2.5">
                {ch.passed ? <PassIcon /> : <FailIcon />}
                <span className={`text-[12px] ${
                  ch.passed ? 'text-slate-700' : 'text-slate-400'
                }`}>
                  {ch.label}
                </span>
              </li>
            ))}
          </ul>

          {/* Improvement tips */}
          {cat.tips.length > 0 && (
            <div
              className="rounded-xl border px-3.5 py-3"
              style={{ background: p.bg, borderColor: p.border }}
            >
              <p
                className="mb-1.5 text-[10px] font-medium uppercase tracking-widest"
                style={{ color: p.text }}
              >
                How to improve
              </p>
              <ul className="space-y-1">
                {cat.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-slate-600">
                    <svg
                      width="10" height="10" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                      className="mt-0.5 flex-shrink-0" style={{ color: p.bar }}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cat.tips.length === 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-[12px] font-medium text-emerald-700">All checks passed</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

interface Props {
  data: ResumeData;
}

export function ATSPanel({ data }: Props) {
  const result  = useMemo(() => computeATSScore(data), [data]);
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (id: string) => setOpen((prev) => (prev === id ? null : id));

  const overall = pal(result.score);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-white">

      {/* ── Score hero ── */}
      <div
        className="flex flex-shrink-0 flex-col items-center gap-5 border-b border-slate-100 px-6 py-8 sm:flex-row sm:gap-8 sm:px-10"
        style={{ background: overall.bg }}
      >
        <ScoreRing score={result.score} />

        {/* Mini bars */}
        <div className="w-full max-w-xs space-y-2.5 sm:flex-1">
          {result.categories.map((cat) => {
            const pct = Math.round((cat.score / cat.maxScore) * 100);
            const cp  = pal(cat.score, cat.maxScore);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setOpen(cat.id);
                  /* scroll to the category — handled by simple anchor */
                }}
                className="flex w-full cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-80"
              >
                <span className="w-[130px] flex-shrink-0 text-left text-[11px] text-slate-600 truncate">{cat.name}</span>
                <div className="flex-1">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/70">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: cp.bar }}
                    />
                  </div>
                </div>
                <span className="w-8 flex-shrink-0 text-right text-[10px] font-medium" style={{ color: cp.text }}>
                  {pct}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Category accordion ── */}
      <div className="flex-1">
        <div className="border-b border-slate-100 px-5 py-3 sm:px-10">
          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
            Category Breakdown — click to expand
          </p>
        </div>
        <div>
          {result.categories.map((cat) => (
            <CategoryRow
              key={cat.id}
              cat={cat}
              isOpen={open === cat.id}
              onToggle={() => toggle(cat.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Footer note ── */}
      <div className="flex-shrink-0 border-t border-slate-100 px-5 py-3 sm:px-10">
        <p className="text-[11px] text-slate-400">
          Score updates live as you fill in your resume. Aim for 80+ for best results.
        </p>
      </div>
    </div>
  );
}

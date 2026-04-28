'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { computeATSScore } from '@/lib/resume-builder';
import type { ResumeData } from '@/types/resume.types';

const R = 13;
const C = 2 * Math.PI * R;

function palette(score: number) {
  if (score >= 80) return { bar: '#10b981', text: '#065f46', bg: '#f0fdf4', border: '#bbf7d0', chip: '#dcfce7', label: 'Excellent' };
  if (score >= 60) return { bar: '#f59e0b', text: '#92400e', bg: '#fffbeb', border: '#fde68a', chip: '#fef3c7', label: 'Good'      };
  if (score >= 40) return { bar: '#f97316', text: '#7c2d12', bg: '#fff7ed', border: '#fed7aa', chip: '#ffedd5', label: 'Fair'      };
  return              { bar: '#f43f5e', text: '#881337', bg: '#fff1f2', border: '#fecdd3', chip: '#ffe4e6', label: 'Needs Work' };
}

interface Props {
  data: ResumeData;
}

export function ATSScoreCard({ data }: Props) {
  const router = useRouter();
  const result = useMemo(() => computeATSScore(data), [data]);
  const { score, tips } = result;
  const p = palette(score);
  const filled = (score / 100) * C;

  const handleViewFull = () => {
    if (typeof window !== 'undefined') {
      try { sessionStorage.setItem('fr-ats-data', JSON.stringify(data)); } catch {}
    }
    router.push('/resume/resume-score');
  };

  return (
    <div
      className="flex flex-shrink-0 items-center gap-3 border-b px-5 py-2.5 sm:px-8 md:px-10"
      style={{ background: p.bg, borderColor: p.border }}
    >
      {/* Score ring */}
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" className="flex-shrink-0" aria-label={`ATS score: ${score}`}>
        <circle cx="17" cy="17" r={R} stroke="#e2e8f0" strokeWidth="3" fill="none" />
        <circle
          cx="17" cy="17" r={R}
          stroke={p.bar} strokeWidth="3" fill="none" strokeLinecap="round"
          strokeDasharray={`${filled} ${C}`}
          transform="rotate(-90 17 17)"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        <text x="17" y="21" textAnchor="middle" fontSize="8.5" fontWeight="700" fill={p.text}>{score}</text>
      </svg>

      {/* Label + tip */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: p.text }}>
            {p.label}
          </span>
          <span
            className="hidden items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold sm:flex"
            style={{ background: p.chip, color: p.text }}
          >
            {score}/100
          </span>
        </div>
        {tips[0] && (
          <p className="truncate text-[11px] text-slate-500">{tips[0]}</p>
        )}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={handleViewFull}
        className="flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-all hover:brightness-95 active:scale-95"
        style={{ borderColor: p.border, color: p.text, background: 'white' }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span className="hidden sm:inline">Full Analysis</span>
        <span className="sm:hidden">ATS</span>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  );
}

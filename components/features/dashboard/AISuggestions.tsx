'use client';

import React from 'react';
import Link from 'next/link';
import type { ATSResult } from '@/lib/resume-builder';

interface Props { atsResult: ATSResult | null; }

interface Suggestion {
  id: string;
  title: string;
  hint: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
}

// ── Derive suggestions from ATS result ───────────────────────────────────────

const DEFAULT_SUGGESTIONS: Suggestion[] = [
  { id: 'd1', title: 'Add a professional summary', hint: 'A 3–4 line summary at the top boosts ATS score significantly.', category: 'Summary', impact: 'high' },
  { id: 'd2', title: 'Include measurable achievements', hint: 'Quantify your impact with numbers, percentages, or timeframes.', category: 'Experience', impact: 'high' },
  { id: 'd3', title: 'Add relevant keywords', hint: 'Match keywords from the job description to pass ATS filters.', category: 'Keywords', impact: 'medium' },
  { id: 'd4', title: 'Add your LinkedIn profile', hint: 'Recruiters verify candidates online — make it easy for them.', category: 'Contact', impact: 'low' },
];

function deriveSuggestions(result: ATSResult): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const sorted = [...result.categories].sort((a, b) => (a.score / a.maxScore) - (b.score / b.maxScore));

  for (const cat of sorted) {
    for (const tip of cat.tips.slice(0, 1)) {
      const impact: Suggestion['impact'] = (cat.score / cat.maxScore) < 0.4 ? 'high' : (cat.score / cat.maxScore) < 0.7 ? 'medium' : 'low';
      suggestions.push({ id: `${cat.id}-${tip.slice(0, 10)}`, title: tip, hint: `Fixes the "${cat.name}" category`, category: cat.name, impact });
      if (suggestions.length === 4) break;
    }
    if (suggestions.length === 4) break;
  }

  return suggestions.length ? suggestions : DEFAULT_SUGGESTIONS.slice(0, 3);
}

// ── Impact badge ──────────────────────────────────────────────────────────────

function ImpactBadge({ impact }: { impact: Suggestion['impact'] }) {
  const styles = {
    high:   'bg-red-50 text-red-600 border-red-100',
    medium: 'bg-amber-50 text-amber-600 border-amber-100',
    low:    'bg-blue-50 text-blue-600 border-blue-100',
  };
  const labels = { high: 'High impact', medium: 'Medium impact', low: 'Low impact' };
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${styles[impact]}`}>
      {labels[impact]}
    </span>
  );
}

// ── Suggestion card ───────────────────────────────────────────────────────────

function SuggestionCard({ s, index }: { s: Suggestion; index: number }) {
  const gradients = [
    'from-indigo-50 to-violet-50 border-indigo-100',
    'from-violet-50 to-purple-50 border-violet-100',
    'from-blue-50   to-indigo-50 border-blue-100',
    'from-purple-50 to-pink-50   border-purple-100',
  ];
  const iconColors = ['#6366f1', '#7c3aed', '#3b82f6', '#a855f7'];

  return (
    <div className={`group relative flex flex-col gap-3 overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(99,102,241,0.10)] ${gradients[index % gradients.length]}`}>
      {/* Decorative dot */}
      <div className="pointer-events-none absolute right-4 top-4 h-16 w-16 rounded-full opacity-20" style={{ background: `radial-gradient(circle,${iconColors[index % iconColors.length]},transparent 70%)` }} />

      <div className="flex items-start justify-between gap-2">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl" style={{ background: `${iconColors[index % iconColors.length]}18` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={iconColors[index % iconColors.length]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <ImpactBadge impact={s.impact} />
      </div>

      <div>
        <p className="text-[13px] font-semibold leading-snug text-gray-800">{s.title}</p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-gray-500">{s.hint}</p>
        <span className="mt-1.5 inline-block text-[10px] font-medium text-gray-400">{s.category}</span>
      </div>

      <Link
        href="/resume/builder"
        className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-all group-hover:gap-2"
        style={{
          borderColor: `${iconColors[index % iconColors.length]}30`,
          color: iconColors[index % iconColors.length],
          background: `${iconColors[index % iconColors.length]}0c`,
        }}
      >
        Fix with AI
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </Link>
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export function AISuggestions({ atsResult }: Props) {
  const suggestions = atsResult ? deriveSuggestions(atsResult) : DEFAULT_SUGGESTIONS;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">AI Suggestions</p>
          <p className="mt-0.5 text-[14px] font-semibold text-gray-800">Improve Your Resume</p>
        </div>
        <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-600">
          {suggestions.length} suggestions
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {suggestions.map((s, i) => <SuggestionCard key={s.id} s={s} index={i} />)}
      </div>
    </div>
  );
}

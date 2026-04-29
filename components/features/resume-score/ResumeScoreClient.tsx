'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { computeATSScore } from '@/lib/resume-builder';
import type { ATSResult, ATSCategory } from '@/lib/resume-builder';
import type { ResumeData } from '@/types/resume.types';
import { Navbar } from '@/components/features/home/Navbar';

// ── helpers ──────────────────────────────────────────────────────────────────

function palette(score: number, max = 100) {
  const pct = (score / max) * 100;
  if (pct >= 80) return { bar: '#10b981', text: '#065f46', bg: '#f0fdf4', border: '#bbf7d0', light: '#dcfce7', label: 'Excellent' };
  if (pct >= 60) return { bar: '#f59e0b', text: '#92400e', bg: '#fffbeb', border: '#fde68a', light: '#fef3c7', label: 'Good'      };
  if (pct >= 40) return { bar: '#f97316', text: '#7c2d12', bg: '#fff7ed', border: '#fed7aa', light: '#ffedd5', label: 'Fair'      };
  return              { bar: '#f43f5e', text: '#881337', bg: '#fff1f2', border: '#fecdd3', light: '#ffe4e6', label: 'Needs Work' };
}

const CATEGORY_ICONS: Record<string, string> = {
  contact:    '👤',
  summary:    '📝',
  experience: '💼',
  education:  '🎓',
  skills:     '⚡',
  presence:   '🔗',
};

// ── Big score ring ────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const R = 60;
  const C = 2 * Math.PI * R;
  const p = palette(score);
  const [anim, setAnim] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setAnim(score), 100);
    return () => clearTimeout(id);
  }, [score]);

  return (
    <div className="relative flex flex-col items-center">
      <svg width="160" height="160" viewBox="0 0 160 160" fill="none" aria-label={`ATS Score: ${score}`}>
        {/* track */}
        <circle cx="80" cy="80" r={R} stroke="#e2e8f0" strokeWidth="10" fill="none" />
        {/* fill */}
        <circle
          cx="80" cy="80" r={R}
          stroke={p.bar} strokeWidth="10" fill="none" strokeLinecap="round"
          strokeDasharray={`${(anim / 100) * C} ${C}`}
          transform="rotate(-90 80 80)"
          style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)' }}
        />
        {/* score text */}
        <text x="80" y="72" textAnchor="middle" fontSize="32" fontWeight="800" fill={p.text}>{score}</text>
        <text x="80" y="90" textAnchor="middle" fontSize="11" fontWeight="500" fill="#94a3b8">out of 100</text>
      </svg>
      <span
        className="mt-1 rounded-full px-4 py-1 text-sm font-bold"
        style={{ background: p.light, color: p.text }}
      >
        {p.label}
      </span>
    </div>
  );
}

// ── Category card ─────────────────────────────────────────────────────────────

function CategoryCard({ cat }: { cat: ATSCategory }) {
  const pct = Math.round((cat.score / cat.maxScore) * 100);
  const p   = palette(cat.score, cat.maxScore);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-lg"
          style={{ background: p.light }}>
          {CATEGORY_ICONS[cat.id] ?? '📋'}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-slate-800">{cat.name}</p>
          <p className="text-[11px] text-slate-400">{cat.score}/{cat.maxScore} pts</p>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{ background: p.light, color: p.text }}
        >
          {pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-3.5 pb-1">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-all duration-[1s] ease-out"
            style={{ width: `${pct}%`, backgroundColor: p.bar }}
          />
        </div>
      </div>

      {/* Checks */}
      <ul className="space-y-1 px-5 pb-3 pt-2.5">
        {cat.checks.map(ch => (
          <li key={ch.label} className="flex items-center gap-2.5">
            <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[9px] ${
              ch.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
            }`}>
              {ch.passed ? '✓' : '·'}
            </span>
            <span className={`text-[12px] ${ch.passed ? 'text-slate-700' : 'text-slate-400 line-through decoration-slate-300'}`}>
              {ch.label}
            </span>
          </li>
        ))}
      </ul>

      {/* Tips */}
      {cat.tips.length > 0 && (
        <div className="mx-4 mb-4 rounded-xl px-3.5 py-3" style={{ background: p.bg, borderColor: p.border }}>
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: p.text }}>Fix</p>
          <ul className="space-y-1">
            {cat.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px] text-slate-600">
                <span className="mt-0.5 text-[9px]" style={{ color: p.bar }}>▸</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Overall tips sidebar ──────────────────────────────────────────────────────

function TipsPriority({ result }: { result: ATSResult }) {
  const all = result.categories.flatMap(c =>
    c.tips.map(t => ({ tip: t, cat: c.name, catId: c.id, pct: Math.round((c.score / c.maxScore) * 100) }))
  ).sort((a, b) => a.pct - b.pct).slice(0, 6);

  if (all.length === 0) return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
      <span className="text-3xl">🎉</span>
      <p className="font-bold text-emerald-700">Your resume looks great!</p>
      <p className="text-sm text-emerald-600">All key ATS criteria are met.</p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <p className="text-[13px] font-bold text-slate-800">Priority Improvements</p>
        <p className="text-[11px] text-slate-400">Biggest impact fixes first</p>
      </div>
      <ul className="divide-y divide-slate-50 px-1 py-1">
        {all.map((item, i) => {
          const p = palette(item.pct);
          return (
            <li key={i} className="flex items-start gap-3 px-4 py-3">
              <span
                className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                style={{ background: p.light, color: p.text }}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] leading-relaxed text-slate-700">{item.tip}</p>
                <span className="mt-0.5 inline-block text-[10px] font-medium text-slate-400">
                  {CATEGORY_ICONS[item.catId]} {item.cat}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function ResumeScoreClient() {
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let data: ResumeData | null = null;
    try {
      const raw = sessionStorage.getItem('fr-ats-data') ?? localStorage.getItem('fr-resume-built');
      if (raw) data = JSON.parse(raw);
    } catch {}

    const timeout = window.setTimeout(() => {
      if (data) {
        setResult(computeATSScore(data));
      }
      setLoading(false);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const overall = result ? palette(result.score) : null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16 pt-[72px] sm:px-6 md:px-8">

        {/* Back + title */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/resume/builder"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Builder
          </Link>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Resume Analysis</p>
            <p className="text-lg font-bold text-slate-800">ATS Score</p>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-32">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <p className="text-sm font-medium text-slate-500">Analysing your resume…</p>
          </div>
        )}

        {!loading && !result && (
          <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
            <span className="text-5xl">📋</span>
            <h2 className="text-xl font-bold text-slate-800">No resume data found</h2>
            <p className="max-w-sm text-sm text-slate-500">
              Please start building your resume first, then come back to check your ATS score.
            </p>
            <Link
              href="/resume/builder"
              className="mt-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Build My Resume
            </Link>
          </div>
        )}

        {!loading && result && overall && (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

            {/* ── Left: Score + summary ─────────────────────── */}
            <div className="flex flex-col gap-5">
              {/* Hero score card */}
              <div
                className="flex flex-col items-center rounded-2xl border px-6 py-8 shadow-sm"
                style={{ background: overall.bg, borderColor: overall.border }}
              >
                <ScoreRing score={result.score} />
                <p className="mt-5 text-center text-sm text-slate-500">
                  Your resume scores <strong className="text-slate-800" style={{ color: overall.text }}>{result.score}/100</strong> for
                  ATS compatibility.
                </p>

                {/* Mini category overview */}
                <div className="mt-5 w-full space-y-2">
                  {result.categories.map(cat => {
                    const pct = (cat.score / cat.maxScore) * 100;
                    const cp  = palette(cat.score, cat.maxScore);
                    return (
                      <div key={cat.id} className="flex items-center gap-2.5">
                        <span className="w-[16px] text-center text-[13px]">{CATEGORY_ICONS[cat.id]}</span>
                        <div className="flex-1">
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/70">
                            <div
                              className="h-full rounded-full transition-all duration-[1.2s] ease-out"
                              style={{ width: `${pct}%`, backgroundColor: cp.bar }}
                            />
                          </div>
                        </div>
                        <span className="w-[30px] text-right text-[10px] font-semibold" style={{ color: cp.text }}>{Math.round(pct)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Priority improvements */}
              <TipsPriority result={result} />

              {/* Back to builder CTA */}
              <Link
                href="/resume/builder"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Fix Issues in Builder
              </Link>
            </div>

            {/* ── Right: Category breakdown ──────────────────── */}
            <div className="grid gap-4 sm:grid-cols-2">
              {result.categories.map(cat => (
                <CategoryCard key={cat.id} cat={cat} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

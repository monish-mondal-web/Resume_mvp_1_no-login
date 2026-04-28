'use client';

import React from 'react';

const METRICS = [
  { label: 'ATS Compatibility', pct: 82, color: 'from-violet-500 to-indigo-500' },
  { label: 'Keyword Match',     pct: 67, color: 'from-indigo-400 to-blue-500'   },
  { label: 'Relevance Score',   pct: 74, color: 'from-fuchsia-500 to-violet-500' },
];

const PERKS = [
  { icon: '🎯', text: 'Tailored bullet points for the exact role' },
  { icon: '🤖', text: 'ATS score + missing keyword analysis'       },
  { icon: '⚡', text: 'One-click resume rewrite in seconds'        },
  { icon: '📊', text: 'Side-by-side job match breakdown'           },
];

export function OptimizeForJobPanel() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Gradient hero band */}
      <div className="relative flex flex-col items-center overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-700 px-6 pb-12 pt-10 text-center">

        {/* Background orbs */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-fuchsia-400/20 blur-2xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-violet-300/10 blur-2xl" />

        {/* Icon */}
        <div className="relative z-10 mb-5">
          <div className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-200" aria-hidden="true">
              <path d="M12 1l2.4 7.6H22l-6.3 4.6 2.4 7.6L12 16.2 5.9 20.8l2.4-7.6L2 8.6h7.6L12 1z"/>
              <path d="M20 2l.5 1.6h1.7l-1.3.9.5 1.6-1.4-.9-1.4.9.5-1.6-1.4-.9h1.7z" opacity="0.65"/>
              <path d="M4.5 3l.4 1.2H6l-1 .7.4 1.2L4.5 5.3l-1 .8.4-1.2-1-.7h1.2z" opacity="0.5"/>
            </svg>
          </div>
          {/* Star sparkles */}
          <span className="absolute -right-1 -top-1 text-[10px] animate-bounce [animation-duration:1.8s]">✨</span>
          <span className="absolute -left-2 bottom-0 text-[8px] animate-bounce [animation-duration:2.3s] [animation-delay:0.4s]">⭐</span>
        </div>

        {/* Badge */}
        <span className="relative z-10 mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white/90 ring-1 ring-white/20">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-300 [animation-duration:1.4s]" />
          Coming Soon · Free Early Access
        </span>

        <h2 className="relative z-10 text-[22px] font-bold tracking-tight text-white">
          Optimize for Job
        </h2>
        <p className="relative z-10 mt-2 max-w-[360px] text-sm leading-relaxed text-white/75">
          Paste any job description and our AI instantly tailors your resume
          to maximise ATS score, keyword match, and recruiter relevance.
        </p>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col items-center bg-slate-50/60 px-6 pb-10 pt-8">
        <div className="w-full max-w-lg">

          {/* Mock ATS preview card */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-3.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Job Match Analysis</p>
                <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-bold text-violet-600">Preview</span>
              </div>
            </div>
            <div className="space-y-4 px-5 py-4">
              {METRICS.map((m) => (
                <div key={m.label}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[12px] font-medium text-slate-600">{m.label}</span>
                    <span className="text-[12px] font-bold text-slate-700">{m.pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${m.color} opacity-50`}
                      style={{ width: `${m.pct}%` }}
                    />
                  </div>
                </div>
              ))}
              {/* Blurred overlay on metrics */}
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
            </div>
            {/* Locked overlay */}
            <div className="flex items-center justify-center gap-2 border-t border-dashed border-slate-200 bg-slate-50/80 px-5 py-3">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <span className="text-[11px] font-medium text-slate-400">Full analysis unlocked on launch</span>
            </div>
          </div>

          {/* Perks list */}
          <ul className="mb-7 space-y-2.5">
            {PERKS.map((p) => (
              <li key={p.text} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-600">
                <span className="text-base leading-none">{p.icon}</span>
                {p.text}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button
            type="button"
            className="group flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-[15px] font-medium text-white transition-all duration-200 hover:brightness-105 active:scale-[0.98]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-200 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true">
              <path d="M12 1l2.4 7.6H22l-6.3 4.6 2.4 7.6L12 16.2 5.9 20.8l2.4-7.6L2 8.6h7.6L12 1z"/>
            </svg>
            Join Waitlist — It's Free
          </button>
          <p className="mt-3 text-center text-[11px] text-slate-400">
            Be the first to access when we launch. Zero spam.
          </p>
        </div>
      </div>
    </div>
  );
}

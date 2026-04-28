'use client';

import React from 'react';

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: 'AI Bullet Writer',
    desc: 'Transform weak bullets into punchy, impact-driven statements.',
    color: 'bg-indigo-50 text-indigo-500',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Impact Score',
    desc: 'See how compelling your resume is vs. industry benchmarks.',
    color: 'bg-emerald-50 text-emerald-500',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
    title: 'Keyword Finder',
    desc: 'Discover missing industry keywords to pass ATS filters.',
    color: 'bg-amber-50 text-amber-500',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/>
        <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
      </svg>
    ),
    title: 'Grammar & Tone',
    desc: 'Fix grammar, tighten language, and match professional tone.',
    color: 'bg-rose-50 text-rose-500',
  },
];

export function SmartAssistPanel() {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-50/60">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-12 text-center">

        {/* Icon */}
        <div className="relative mb-6">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-slate-100 bg-white">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-indigo-500" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8.5 13.5S9.8 15.5 12 15.5s3.5-2 3.5-2"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9" cy="10" r="1.2" fill="currentColor"/>
              <circle cx="15" cy="10" r="1.2" fill="currentColor"/>
              <path d="M12 2v1.5M12 20.5V22M2 12h1.5M20.5 12H22"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.35"/>
              <circle cx="5.5" cy="5.5" r="0.8" fill="currentColor" opacity="0.3"/>
              <circle cx="18.5" cy="5.5" r="0.8" fill="currentColor" opacity="0.3"/>
            </svg>
          </div>
          {/* Pulsing ring */}
          <span className="absolute -inset-1 animate-ping rounded-[18px] bg-indigo-400/15 [animation-duration:2.4s]" />
        </div>

        {/* Badge */}
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50 px-3.5 py-1 text-xs font-medium text-indigo-600">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500 [animation-duration:1.6s]" />
          Coming Soon
        </span>

        <h2 className="text-[22px] font-bold tracking-tight text-slate-900">Smart Assist</h2>
        <p className="mt-2.5 max-w-[380px] text-sm leading-relaxed text-slate-500">
          AI-powered tools that analyse your resume in real-time and surface
          targeted suggestions to maximise recruiter impact.
        </p>

        {/* Feature grid */}
        <div className="mt-10 grid w-full grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 text-left transition-colors hover:border-slate-200 hover:bg-slate-50/40"
            >
              {/* Lock overlay */}
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/70 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                <span className="flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-white">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  Releasing soon
                </span>
              </div>

              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${f.color}`}>
                {f.icon}
              </div>
              <div>
                <p className="text-[13px] font-medium text-slate-800">{f.title}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          type="button"
          className="mt-8 flex cursor-pointer items-center gap-2 rounded-xl border border-indigo-200 bg-white px-6 py-2.5 text-sm font-medium text-indigo-600 transition hover:border-indigo-300 hover:bg-indigo-50 active:scale-[0.98]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          Notify Me When Ready
        </button>

        <p className="mt-3 text-[11px] text-slate-400">No spam. One email when it launches.</p>
      </div>
    </div>
  );
}

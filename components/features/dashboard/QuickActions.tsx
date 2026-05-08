'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

interface Action {
  id: string;
  label: string;
  hint: string;
  href: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  accentColor: string;
}

const ACTIONS: Action[] = [
  {
    id: 'create',
    label: 'New Resume',
    hint: 'Start from scratch or use a template',
    href: '/resume/builder',
    iconBg: '#eef2ff',
    iconColor: '#4f46e5',
    accentColor: 'hover:border-indigo-200',
    icon: (
      <>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </>
    ),
  },
  {
    id: 'optimize',
    label: 'Optimize for Job',
    hint: 'Tailor your resume to any job description',
    href: '/resume/builder?tab=optimize',
    iconBg: '#f5f3ff',
    iconColor: '#7c3aed',
    accentColor: 'hover:border-violet-200',
    icon: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  },
  {
    id: 'ats',
    label: 'Check ATS Score',
    hint: 'See how recruiters and systems read you',
    href: '/resume/builder?tab=ats',
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
    accentColor: 'hover:border-emerald-200',
    icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  },
];

export function QuickActions() {
  return (
    <div>
      <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
        Quick Actions
      </p>

      {/* Desktop: 3-column card grid */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-3">
        {ACTIONS.map(a => (
          <Link
            key={a.id}
            href={a.href}
            className={`group flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 transition-all duration-150 hover:bg-slate-50/60 ${a.accentColor}`}
          >
            <div className="flex items-start justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-150 group-hover:scale-105"
                style={{ background: a.iconBg }}
              >
                <svg
                  width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke={a.iconColor}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  {a.icon}
                </svg>
              </div>
              <svg
                width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                className="mt-0.5 text-slate-200 transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-400"
              >
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-800 group-hover:text-slate-900 leading-tight">
                {a.label}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-400">
                {a.hint}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile: stacked rows */}
      <div className="flex flex-col sm:hidden overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
        {ACTIONS.map(a => (
          <Link
            key={a.id}
            href={a.href}
            className="flex items-center gap-3.5 px-4 py-3.5 transition-colors active:bg-slate-50"
          >
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
              style={{ background: a.iconBg }}
            >
              <svg
                width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke={a.iconColor}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                {a.icon}
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-slate-800">{a.label}</p>
              <p className="text-[11px] text-slate-400 truncate">{a.hint}</p>
            </div>
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              className="flex-shrink-0 text-slate-300"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}

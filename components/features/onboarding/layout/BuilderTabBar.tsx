'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';

export type BuilderTab = 'edit' | 'ats-score' | 'optimize';

interface Props {
  activeTab: BuilderTab;
  onTabChange: (tab: BuilderTab) => void;
  atsScore?: number;
}

function ScoreBadge({ score }: { score?: number }) {
  if (score === undefined) return null;
  let bg = '#ffe4e6', color = '#be123c';
  if (score >= 80) { bg = '#dcfce7'; color = '#15803d'; }
  else if (score >= 60) { bg = '#fef9c3'; color = '#a16207'; }
  else if (score >= 40) { bg = '#ffedd5'; color = '#c2410c'; }
  return (
    <span
      className="rounded-full px-1.5 py-[2px] text-[10px] font-bold leading-none tabular-nums"
      style={{ background: bg, color }}
    >
      {score}
    </span>
  );
}

const TABS: { id: BuilderTab; label: string; short: string }[] = [
  { id: 'edit',         label: 'Edit',             short: 'Edit'     },
  { id: 'ats-score',    label: 'ATS Score',         short: 'ATS'      },
  { id: 'optimize',     label: 'Optimize for Job',  short: 'Optimize' },
];

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function ATSIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function BuilderTabBar({ activeTab, onTabChange, atsScore }: Props) {
  const tabRefs  = useRef<(HTMLButtonElement | null)[]>([]);
  const [bar, setBar] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const idx = TABS.findIndex((t) => t.id === activeTab);
    const el  = tabRefs.current[idx];
    if (el) setBar({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeTab]);

  return (
    <div className="relative flex h-11 flex-shrink-0 items-end border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">

      {/* Sliding bottom indicator */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 h-[2px] rounded-t-sm transition-all duration-[300ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          left:  bar.left,
          width: bar.width,
          background: activeTab === 'optimize'
            ? 'linear-gradient(90deg,#7c3aed,#6366f1)'
            : '#6366f1',
        }}
      />

      {TABS.map((tab, i) => {
        const isActive   = activeTab === tab.id;
        const isOptimize = tab.id === 'optimize';

        return (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[i] = el; }}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className="relative flex cursor-pointer select-none items-center gap-1.5 whitespace-nowrap px-3 pb-2.5 pt-2 text-[13px] transition-colors duration-150"
          >
            {/* Icon */}
            <span className={`flex-shrink-0 transition-colors duration-150 ${
              isActive
                ? isOptimize ? 'text-violet-600' : 'text-indigo-500'
                : isOptimize ? 'text-violet-400' : 'text-slate-400'
            }`}>
              {tab.id === 'edit'      && <EditIcon />}
              {tab.id === 'ats-score' && <ATSIcon />}
              {tab.id === 'optimize'  && <SparkleIcon />}
            </span>

            {/* Label */}
            <span className={`transition-colors duration-150 ${
              isActive
                ? isOptimize
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text font-medium text-transparent'
                  : 'font-medium text-slate-900'
                : isOptimize
                  ? 'bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent'
                  : 'text-slate-500 hover:text-slate-700'
            }`}>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.short}</span>
            </span>

            {/* Score badge — ATS tab only, after label */}
            {tab.id === 'ats-score' && <ScoreBadge score={atsScore} />}

            {/* NEW badge — Optimize only when inactive */}
            {isOptimize && !isActive && (
              <span className="hidden rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-1.5 py-0.5 text-[9px] font-medium leading-none text-white sm:block">
                NEW
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

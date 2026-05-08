import React from 'react';

interface Props { hasResume: boolean; }

interface ActivityItem {
  id: string;
  text: string;
  subtext: string;
  time: string;
  type: 'edit' | 'score' | 'download' | 'create' | 'hint';
}

// ── Icon per type ─────────────────────────────────────────────────────────────

function ActivityIcon({ type }: { type: ActivityItem['type'] }) {
  const configs: Record<ActivityItem['type'], { bg: string; stroke: string; path: React.ReactNode }> = {
    edit: {
      bg: '#eef2ff', stroke: '#4f46e5',
      path: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    },
    score: {
      bg: '#f0fdf4', stroke: '#16a34a',
      path: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    },
    download: {
      bg: '#f5f3ff', stroke: '#7c3aed',
      path: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    },
    create: {
      bg: '#fefce8', stroke: '#ca8a04',
      path: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    },
    hint: {
      bg: '#fff1f2', stroke: '#e11d48',
      path: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    },
  };
  const c = configs[type];
  return (
    <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full" style={{ background: c.bg }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {c.path}
      </svg>
    </div>
  );
}

// ── Build activity list ───────────────────────────────────────────────────────

function buildActivity(hasResume: boolean): ActivityItem[] {
  if (hasResume) {
    return [
      { id: '1', text: 'Resume saved',             subtext: 'All changes auto-saved',         time: 'Just now',    type: 'edit'     },
      { id: '2', text: 'ATS score computed',        subtext: 'Score updated in real-time',     time: '2 min ago',   type: 'score'    },
      { id: '3', text: 'Resume builder opened',     subtext: 'Editing personal info section',  time: '5 min ago',   type: 'edit'     },
      { id: '4', text: 'Draft resumed',             subtext: 'Continuing from last session',   time: 'Earlier',     type: 'create'   },
    ];
  }
  return [
    { id: '1', text: 'Account created',             subtext: 'Welcome to FreshResume',         time: 'Today',       type: 'create'   },
    { id: '2', text: 'Get started',                 subtext: 'Create your first resume',       time: '',            type: 'hint'     },
    { id: '3', text: 'Add your experience',         subtext: 'Fill in roles & achievements',   time: '',            type: 'hint'     },
    { id: '4', text: 'Check your ATS score',        subtext: 'Get an AI-powered breakdown',    time: '',            type: 'score'    },
  ];
}

// ── Export ────────────────────────────────────────────────────────────────────

export function ActivityFeed({ hasResume }: Props) {
  const items = buildActivity(hasResume);

  return (
    <div>
      <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {hasResume ? 'Recent Activity' : 'Getting Started'}
      </p>
      <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        <ul className="space-y-0">
          {items.map((item, i) => (
            <li key={item.id} className="relative flex gap-3">
              {/* Connector line */}
              {i < items.length - 1 && (
                <div className="absolute left-4 top-8 h-[calc(100%-8px)] w-px bg-gray-100" />
              )}
              <ActivityIcon type={item.type} />
              <div className="flex-1 pb-4 pt-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[12.5px] font-semibold leading-snug text-gray-700">{item.text}</p>
                  {item.time && <span className="flex-shrink-0 text-[10px] text-gray-400">{item.time}</span>}
                </div>
                <p className="mt-0.5 text-[11px] text-gray-400">{item.subtext}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

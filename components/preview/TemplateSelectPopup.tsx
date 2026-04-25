'use client';

import { useEffect } from 'react';
import type { TemplateId, AccentColor } from '@/types/resume.types';
import { ACCENT_COLORS } from '@/types/resume.types';

interface Props {
  current: TemplateId;
  accentColor: AccentColor;
  onSelect: (id: TemplateId) => void;
  onClose: () => void;
}

export function MiniTemplate1({ hex }: { hex: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="120" height="160" rx="4" fill="#fff" />
      {/* Header */}
      <rect x="10" y="10" width="60" height="6" rx="2" fill={hex} />
      <rect x="10" y="19" width="40" height="3" rx="1" fill="#94a3b8" />
      <rect x="10" y="25" width="80" height="2" rx="1" fill="#e2e8f0" />
      <rect x="10" y="29" width="65" height="2" rx="1" fill="#e2e8f0" />
      {/* Divider */}
      <rect x="10" y="34" width="100" height="0.5" fill={hex} opacity="0.3" />
      {/* Section 1 */}
      <rect x="10" y="39" width="35" height="3" rx="1" fill={hex} />
      <rect x="10" y="45" width="100" height="2" rx="1" fill="#e2e8f0" />
      <rect x="10" y="50" width="85" height="2" rx="1" fill="#e2e8f0" />
      <rect x="10" y="55" width="90" height="2" rx="1" fill="#e2e8f0" />
      {/* Section 2 */}
      <rect x="10" y="63" width="30" height="3" rx="1" fill={hex} />
      <rect x="10" y="69" width="100" height="2" rx="1" fill="#e2e8f0" />
      <rect x="10" y="74" width="70" height="2" rx="1" fill="#e2e8f0" />
      {/* Section 3 */}
      <rect x="10" y="82" width="28" height="3" rx="1" fill={hex} />
      <rect x="10" y="88" width="95" height="2" rx="1" fill="#e2e8f0" />
      <rect x="10" y="93" width="80" height="2" rx="1" fill="#e2e8f0" />
      <rect x="10" y="98" width="88" height="2" rx="1" fill="#e2e8f0" />
      {/* Skills chips */}
      <rect x="10" y="106" width="22" height="3" rx="1" fill={hex} />
      <rect x="10" y="112" width="18" height="5" rx="2.5" fill={hex} opacity="0.15" />
      <rect x="31" y="112" width="22" height="5" rx="2.5" fill={hex} opacity="0.15" />
      <rect x="56" y="112" width="16" height="5" rx="2.5" fill={hex} opacity="0.15" />
      <rect x="75" y="112" width="20" height="5" rx="2.5" fill={hex} opacity="0.15" />
    </svg>
  );
}

export function MiniTemplate2({ hex }: { hex: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="120" height="160" rx="4" fill="#fff" />
      {/* Sidebar */}
      <rect width="38" height="160" rx="4" fill={hex} opacity="0.08" />
      {/* Sidebar content */}
      <rect x="5" y="10" width="28" height="14" rx="7" fill={hex} opacity="0.2" />
      <rect x="5" y="28" width="28" height="3" rx="1" fill={hex} opacity="0.4" />
      <rect x="5" y="33" width="20" height="2" rx="1" fill="#94a3b8" opacity="0.6" />
      <rect x="5" y="40" width="28" height="0.5" fill={hex} opacity="0.3" />
      <rect x="5" y="44" width="22" height="2.5" rx="1" fill={hex} opacity="0.5" />
      <rect x="5" y="49" width="28" height="2" rx="1" fill="#e2e8f0" />
      <rect x="5" y="53" width="24" height="2" rx="1" fill="#e2e8f0" />
      <rect x="5" y="57" width="26" height="2" rx="1" fill="#e2e8f0" />
      <rect x="5" y="63" width="22" height="2.5" rx="1" fill={hex} opacity="0.5" />
      <rect x="5" y="68" width="18" height="4" rx="2" fill={hex} opacity="0.15" />
      <rect x="5" y="74" width="22" height="4" rx="2" fill={hex} opacity="0.15" />
      <rect x="5" y="80" width="14" height="4" rx="2" fill={hex} opacity="0.15" />
      {/* Main column */}
      <rect x="44" y="10" width="50" height="5" rx="1" fill={hex} />
      <rect x="44" y="18" width="35" height="3" rx="1" fill="#94a3b8" />
      <rect x="44" y="24" width="70" height="0.5" fill={hex} opacity="0.3" />
      <rect x="44" y="28" width="30" height="3" rx="1" fill={hex} />
      <rect x="44" y="34" width="70" height="2" rx="1" fill="#e2e8f0" />
      <rect x="44" y="39" width="60" height="2" rx="1" fill="#e2e8f0" />
      <rect x="44" y="44" width="65" height="2" rx="1" fill="#e2e8f0" />
      <rect x="44" y="52" width="28" height="3" rx="1" fill={hex} />
      <rect x="44" y="58" width="70" height="2" rx="1" fill="#e2e8f0" />
      <rect x="44" y="63" width="55" height="2" rx="1" fill="#e2e8f0" />
      <rect x="44" y="71" width="25" height="3" rx="1" fill={hex} />
      <rect x="44" y="77" width="70" height="2" rx="1" fill="#e2e8f0" />
      <rect x="44" y="82" width="50" height="2" rx="1" fill="#e2e8f0" />
    </svg>
  );
}

export const TEMPLATES: { id: TemplateId; name: string; desc: string }[] = [
  { id: 'template1', name: 'ATS Clean',    desc: 'Single column, recruiter-friendly' },
  { id: 'template2', name: 'Banking Pro',  desc: 'Two column, professional sidebar'  },
];

export function TemplateSelectPopup({ current, accentColor, onSelect, onClose }: Props) {
  const hex = ACCENT_COLORS[accentColor]?.hex ?? '#6366f1';

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_32px_80px_rgba(15,23,42,0.22)] ring-1 ring-slate-100"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        </button>

        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Choose Template</p>
        <h2 className="mb-5 text-lg font-bold text-slate-900">Resume Layout</h2>

        <div className="grid grid-cols-2 gap-3">
          {TEMPLATES.map(t => {
            const isActive = current === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { onSelect(t.id); onClose(); }}
                className={`cursor-pointer overflow-hidden rounded-xl border-2 text-left transition-all hover:shadow-md ${
                  isActive ? 'border-indigo-500 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 ${isActive ? 'bg-indigo-50' : 'bg-slate-50'}`}>
                  {t.id === 'template1'
                    ? <MiniTemplate1 hex={hex} />
                    : <MiniTemplate2 hex={hex} />
                  }
                </div>
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between">
                    <p className={`text-[12px] font-semibold ${isActive ? 'text-indigo-700' : 'text-slate-800'}`}>{t.name}</p>
                    {isActive && (
                      <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600">Active</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

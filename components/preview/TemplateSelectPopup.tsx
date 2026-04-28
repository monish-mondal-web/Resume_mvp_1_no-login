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

// Modern — centered header, dot contacts, label+right-rule sections
export function MiniTemplate1({ hex }: { hex: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="120" height="160" rx="3" fill="#fff" />
      {/* Large bold centered name */}
      <rect x="14" y="7" width="92" height="9" rx="2" fill="#0f172a" opacity="0.88" />
      {/* Centered italic title */}
      <rect x="32" y="18" width="56" height="2.5" rx="1" fill="#4b5563" opacity="0.55" />
      {/* Centered contact row — 3 items with dot (·) separators */}
      <rect x="22" y="23" width="17" height="2" rx="1" fill="#9ca3af" opacity="0.55" />
      <circle cx="42" cy="24" r="1.2" fill="#9ca3af" opacity="0.5" />
      <rect x="45" y="23" width="17" height="2" rx="1" fill="#9ca3af" opacity="0.55" />
      <circle cx="65" cy="24" r="1.2" fill="#9ca3af" opacity="0.5" />
      <rect x="68" y="23" width="17" height="2" rx="1" fill="#9ca3af" opacity="0.55" />
      {/* Link row below */}
      <rect x="38" y="27" width="18" height="1.5" rx="0.75" fill="#9ca3af" opacity="0.4" />
      <circle cx="59" cy="27.75" r="1" fill="#9ca3af" opacity="0.4" />
      <rect x="62" y="27" width="18" height="1.5" rx="0.75" fill="#9ca3af" opacity="0.4" />
      {/* Full-width accent bar */}
      <rect x="8" y="32" width="104" height="1.5" rx="0.75" fill={hex} />
      {/* Section 1: short label + accent line extending to full right */}
      <rect x="8" y="38" width="28" height="2.5" rx="1" fill="#111827" opacity="0.75" />
      <rect x="40" y="39.25" width="72" height="0.75" fill={hex} opacity="0.55" />
      {/* Entry: Bold Role, (italic accent Company)   date */}
      <rect x="8" y="44" width="36" height="2.5" rx="1" fill="#111827" opacity="0.72" />
      <rect x="47" y="44" width="24" height="2.5" rx="1" fill={hex} opacity="0.6" />
      <rect x="85" y="44" width="27" height="2" rx="1" fill="#9ca3af" opacity="0.42" />
      <rect x="12" y="49" width="86" height="1.5" rx="0.75" fill="#e5e7eb" />
      <rect x="12" y="52.5" width="74" height="1.5" rx="0.75" fill="#e5e7eb" />
      {/* Section 2 */}
      <rect x="8" y="59" width="22" height="2.5" rx="1" fill="#111827" opacity="0.75" />
      <rect x="34" y="60.25" width="78" height="0.75" fill={hex} opacity="0.55" />
      <rect x="8" y="66" width="36" height="2.5" rx="1" fill="#111827" opacity="0.72" />
      <rect x="47" y="66" width="24" height="2.5" rx="1" fill={hex} opacity="0.6" />
      <rect x="85" y="66" width="27" height="2" rx="1" fill="#9ca3af" opacity="0.42" />
      <rect x="12" y="71" width="82" height="1.5" rx="0.75" fill="#e5e7eb" />
      <rect x="12" y="74.5" width="70" height="1.5" rx="0.75" fill="#e5e7eb" />
      {/* Section 3 (Skills) */}
      <rect x="8" y="81" width="18" height="2.5" rx="1" fill="#111827" opacity="0.75" />
      <rect x="30" y="82.25" width="82" height="0.75" fill={hex} opacity="0.55" />
      <rect x="8" y="87" width="104" height="1.5" rx="0.75" fill="#e5e7eb" />
      <rect x="8" y="90.5" width="90" height="1.5" rx="0.75" fill="#e5e7eb" />
      <rect x="8" y="94" width="96" height="1.5" rx="0.75" fill="#e5e7eb" />
    </svg>
  );
}

// Classic — two-column header, black divider, CAPS + full-width accent rule sections
export function MiniTemplate2({ hex }: { hex: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="120" height="160" rx="3" fill="#fff" />
      {/* Left: bold name (font-size 18) */}
      <rect x="8" y="8" width="56" height="7" rx="1.5" fill="#111827" opacity="0.88" />
      {/* Left: degree italic below */}
      <rect x="8" y="17" width="40" height="2" rx="1" fill="#374151" opacity="0.55" />
      {/* Left: school below */}
      <rect x="8" y="21" width="30" height="1.5" rx="0.75" fill="#6b7280" opacity="0.5" />
      {/* Right: contacts right-aligned (phone, email, link, link) */}
      <rect x="72" y="8" width="40" height="1.5" rx="0.75" fill="#9ca3af" opacity="0.65" />
      <rect x="74" y="11.5" width="38" height="1.5" rx="0.75" fill="#9ca3af" opacity="0.65" />
      <rect x="70" y="15" width="42" height="1.5" rx="0.75" fill="#9ca3af" opacity="0.6" />
      <rect x="76" y="18.5" width="36" height="1.5" rx="0.75" fill="#9ca3af" opacity="0.55" />
      {/* Full-width BLACK divider (not accent!) */}
      <rect x="8" y="26" width="104" height="1" fill="#111827" opacity="0.75" />
      {/* Section 1: CAPS label */}
      <rect x="8" y="31" width="34" height="2.5" rx="1" fill="#111827" opacity="0.78" />
      {/* Full-width accent rule directly below label */}
      <rect x="8" y="35" width="104" height="0.75" fill={hex} opacity="0.82" />
      {/* Entry: • bold role + date right */}
      <rect x="8" y="39" width="48" height="2.5" rx="1" fill="#111827" opacity="0.75" />
      <rect x="84" y="39" width="28" height="2" rx="1" fill="#9ca3af" opacity="0.5" />
      {/* Company plain below */}
      <rect x="8" y="43" width="36" height="2" rx="1" fill="#6b7280" opacity="0.52" />
      {/* Em-dash bullets */}
      <rect x="13" y="47" width="85" height="1.5" rx="0.75" fill="#e5e7eb" />
      <rect x="13" y="50.5" width="72" height="1.5" rx="0.75" fill="#e5e7eb" />
      {/* Section 2 */}
      <rect x="8" y="57" width="28" height="2.5" rx="1" fill="#111827" opacity="0.78" />
      <rect x="8" y="61" width="104" height="0.75" fill={hex} opacity="0.82" />
      <rect x="8" y="65" width="48" height="2.5" rx="1" fill="#111827" opacity="0.75" />
      <rect x="84" y="65" width="28" height="2" rx="1" fill="#9ca3af" opacity="0.5" />
      <rect x="8" y="69" width="36" height="2" rx="1" fill="#6b7280" opacity="0.52" />
      <rect x="13" y="73" width="78" height="1.5" rx="0.75" fill="#e5e7eb" />
      <rect x="13" y="76.5" width="64" height="1.5" rx="0.75" fill="#e5e7eb" />
      {/* Section 3 (Education) */}
      <rect x="8" y="83" width="32" height="2.5" rx="1" fill="#111827" opacity="0.78" />
      <rect x="8" y="87" width="104" height="0.75" fill={hex} opacity="0.82" />
      <rect x="8" y="91" width="50" height="2.5" rx="1" fill="#111827" opacity="0.75" />
      <rect x="84" y="91" width="28" height="2" rx="1" fill="#9ca3af" opacity="0.5" />
      <rect x="8" y="95" width="36" height="2" rx="1" fill="#6b7280" opacity="0.52" />
    </svg>
  );
}

// Executive — very large centered name, accent title, dot contacts, gradient rule, gray-rule sections
export function MiniTemplate3({ hex }: { hex: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="120" height="160" rx="3" fill="#fff" />
      {/* Extra-large centered name (fontSize ~24, fontWeight 800) */}
      <rect x="8" y="6" width="104" height="11" rx="2" fill="#111827" opacity="0.92" />
      {/* Accent-colored professional title (centered, shorter) */}
      <rect x="24" y="20" width="72" height="4.5" rx="1.5" fill={hex} opacity="0.85" />
      {/* Dot (●) separated contacts — centered */}
      <rect x="14" y="28" width="18" height="2" rx="1" fill="#4b5563" opacity="0.55" />
      <circle cx="35" cy="29" r="1.5" fill="#9ca3af" opacity="0.65" />
      <rect x="38" y="28" width="18" height="2" rx="1" fill="#4b5563" opacity="0.55" />
      <circle cx="59" cy="29" r="1.5" fill="#9ca3af" opacity="0.65" />
      <rect x="62" y="28" width="18" height="2" rx="1" fill="#4b5563" opacity="0.55" />
      <circle cx="83" cy="29" r="1.5" fill="#9ca3af" opacity="0.65" />
      <rect x="86" y="28" width="18" height="2" rx="1" fill="#4b5563" opacity="0.55" />
      {/* Gradient line — simulated with 3 rects fading in/out */}
      <rect x="8" y="34" width="26" height="1.5" rx="0.75" fill={hex} opacity="0.12" />
      <rect x="34" y="34" width="52" height="1.5" rx="0.75" fill={hex} opacity="0.45" />
      <rect x="86" y="34" width="26" height="1.5" rx="0.75" fill={hex} opacity="0.12" />
      {/* Section 1: UPPERCASE label (bolder/larger) + thin GRAY rule */}
      <rect x="8" y="41" width="44" height="3.5" rx="1" fill="#111827" opacity="0.82" />
      <rect x="8" y="46.5" width="104" height="0.75" fill="#d1d5db" />
      {/* Entry: bold role + accent company inline + date right */}
      <rect x="8" y="50" width="36" height="2.5" rx="1" fill="#111827" opacity="0.72" />
      <rect x="47" y="50" width="28" height="2.5" rx="1" fill={hex} opacity="0.72" />
      <rect x="88" y="50" width="24" height="2" rx="1" fill="#9ca3af" opacity="0.42" />
      {/* Location italic */}
      <rect x="8" y="54.5" width="22" height="1.5" rx="0.75" fill="#6b7280" opacity="0.45" />
      <rect x="13" y="58" width="82" height="1.5" rx="0.75" fill="#e5e7eb" />
      <rect x="13" y="61.5" width="70" height="1.5" rx="0.75" fill="#e5e7eb" />
      {/* Section 2 */}
      <rect x="8" y="68" width="36" height="3.5" rx="1" fill="#111827" opacity="0.82" />
      <rect x="8" y="73.5" width="104" height="0.75" fill="#d1d5db" />
      <rect x="8" y="77" width="36" height="2.5" rx="1" fill="#111827" opacity="0.72" />
      <rect x="47" y="77" width="28" height="2.5" rx="1" fill={hex} opacity="0.72" />
      <rect x="88" y="77" width="24" height="2" rx="1" fill="#9ca3af" opacity="0.42" />
      <rect x="13" y="82" width="78" height="1.5" rx="0.75" fill="#e5e7eb" />
      <rect x="13" y="85.5" width="66" height="1.5" rx="0.75" fill="#e5e7eb" />
      {/* Section 3 */}
      <rect x="8" y="92" width="28" height="3.5" rx="1" fill="#111827" opacity="0.82" />
      <rect x="8" y="97.5" width="104" height="0.75" fill="#d1d5db" />
      <rect x="8" y="101" width="104" height="1.5" rx="0.75" fill="#e5e7eb" />
      <rect x="8" y="104.5" width="90" height="1.5" rx="0.75" fill="#e5e7eb" />
      <rect x="8" y="108" width="96" height="1.5" rx="0.75" fill="#e5e7eb" />
    </svg>
  );
}

export const TEMPLATES: { id: TemplateId; name: string; desc: string }[] = [
  { id: 'template1', name: 'Modern',       desc: 'Centered header, clean accent lines' },
  { id: 'template2', name: 'Classic',      desc: 'Left-aligned header, structured content flow'   },
  { id: 'template3', name: 'Executive',    desc: 'Bold centered name, accent title'    },
];

export function TemplateSelectPopup({ current, accentColor, onSelect, onClose }: Props) {
  const hex = ACCENT_COLORS[accentColor]?.hex ?? '#6366f1';

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function MiniPreview({ id }: { id: TemplateId }) {
    if (id === 'template2') return <MiniTemplate2 hex={hex} />;
    if (id === 'template3') return <MiniTemplate3 hex={hex} />;
    return <MiniTemplate1 hex={hex} />;
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_32px_80px_rgba(15,23,42,0.22)] ring-1 ring-slate-100"
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

        <div className="grid grid-cols-3 gap-3">
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
                  <MiniPreview id={t.id} />
                </div>
                <div className="px-2 py-2">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={`text-[11px] font-semibold ${isActive ? 'text-indigo-700' : 'text-slate-800'}`}>{t.name}</p>
                    {isActive && (
                      <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600">✓</span>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-400 leading-tight">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

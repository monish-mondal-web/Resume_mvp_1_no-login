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

// Classic — two-column header, section+rule
export function MiniTemplate1({ hex }: { hex: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="120" height="160" rx="3" fill="#fff" />
      {/* Header: name left, contacts right */}
      <rect x="8" y="9" width="52" height="6" rx="1.5" fill="#111827" opacity="0.85" />
      <rect x="8" y="17" width="32" height="2.5" rx="1" fill="#6b7280" opacity="0.6" />
      <rect x="76" y="9" width="36" height="2" rx="1" fill="#9ca3af" opacity="0.7" />
      <rect x="80" y="13" width="32" height="2" rx="1" fill="#9ca3af" opacity="0.7" />
      <rect x="78" y="17" width="34" height="2" rx="1" fill="#9ca3af" opacity="0.7" />
      {/* Accent divider */}
      <rect x="8" y="23" width="104" height="1.5" rx="0.75" fill={hex} />
      {/* Section 1: label + rule */}
      <rect x="8" y="29" width="28" height="2.5" rx="1" fill="#111827" opacity="0.7" />
      <rect x="40" y="30" width="72" height="0.75" fill={hex} opacity="0.6" />
      <rect x="8" y="35" width="55" height="2.5" rx="1" fill="#374151" opacity="0.6" />
      <rect x="8" y="40" width="38" height="2" rx="1" fill="#9ca3af" opacity="0.5" />
      <rect x="12" y="44" width="88" height="2" rx="1" fill="#e5e7eb" />
      <rect x="12" y="48" width="76" height="2" rx="1" fill="#e5e7eb" />
      {/* Section 2 */}
      <rect x="8" y="56" width="24" height="2.5" rx="1" fill="#111827" opacity="0.7" />
      <rect x="36" y="57" width="76" height="0.75" fill={hex} opacity="0.6" />
      <rect x="8" y="62" width="55" height="2.5" rx="1" fill="#374151" opacity="0.6" />
      <rect x="8" y="67" width="38" height="2" rx="1" fill="#9ca3af" opacity="0.5" />
      <rect x="12" y="71" width="84" height="2" rx="1" fill="#e5e7eb" />
      <rect x="12" y="75" width="72" height="2" rx="1" fill="#e5e7eb" />
      {/* Section 3 */}
      <rect x="8" y="83" width="32" height="2.5" rx="1" fill="#111827" opacity="0.7" />
      <rect x="44" y="84" width="68" height="0.75" fill={hex} opacity="0.6" />
      <rect x="8" y="89" width="104" height="2" rx="1" fill="#e5e7eb" />
      <rect x="8" y="93" width="90" height="2" rx="1" fill="#e5e7eb" />
      <rect x="8" y="97" width="96" height="2" rx="1" fill="#e5e7eb" />
    </svg>
  );
}

// Modern — centered header, pipe contacts, colored underline sections
export function MiniTemplate2({ hex }: { hex: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="120" height="160" rx="3" fill="#fff" />
      {/* Centered name */}
      <rect x="18" y="9" width="84" height="7" rx="2" fill="#111827" opacity="0.85" />
      {/* Centered title */}
      <rect x="32" y="18" width="56" height="3" rx="1" fill="#9ca3af" opacity="0.7" />
      {/* Contact row: items + pipes */}
      <rect x="10" y="24" width="20" height="2" rx="1" fill="#9ca3af" opacity="0.5" />
      <rect x="33" y="24" width="2" height="2" fill="#d1d5db" />
      <rect x="38" y="24" width="20" height="2" rx="1" fill="#9ca3af" opacity="0.5" />
      <rect x="61" y="24" width="2" height="2" fill="#d1d5db" />
      <rect x="66" y="24" width="20" height="2" rx="1" fill="#9ca3af" opacity="0.5" />
      <rect x="89" y="24" width="2" height="2" fill="#d1d5db" />
      <rect x="94" y="24" width="18" height="2" rx="1" fill="#9ca3af" opacity="0.5" />
      {/* Accent underline */}
      <rect x="8" y="29" width="104" height="2" rx="1" fill={hex} />
      {/* Section 1: label + underline */}
      <rect x="8" y="36" width="30" height="3" rx="1" fill="#111827" opacity="0.75" />
      <rect x="8" y="41" width="104" height="2" rx="1" fill={hex} opacity="0.9" />
      <rect x="8" y="46" width="55" height="2.5" rx="1" fill="#374151" opacity="0.6" />
      <rect x="8" y="51" width="38" height="2" rx="1" fill="#9ca3af" opacity="0.5" />
      <rect x="12" y="55" width="86" height="2" rx="1" fill="#e5e7eb" />
      <rect x="12" y="59" width="74" height="2" rx="1" fill="#e5e7eb" />
      {/* Section 2 */}
      <rect x="8" y="66" width="26" height="3" rx="1" fill="#111827" opacity="0.75" />
      <rect x="8" y="71" width="104" height="2" rx="1" fill={hex} opacity="0.9" />
      <rect x="8" y="76" width="55" height="2.5" rx="1" fill="#374151" opacity="0.6" />
      <rect x="8" y="81" width="38" height="2" rx="1" fill="#9ca3af" opacity="0.5" />
      <rect x="12" y="85" width="80" height="2" rx="1" fill="#e5e7eb" />
      {/* Section 3 */}
      <rect x="8" y="92" width="34" height="3" rx="1" fill="#111827" opacity="0.75" />
      <rect x="8" y="97" width="104" height="2" rx="1" fill={hex} opacity="0.9" />
      <rect x="8" y="102" width="104" height="2" rx="1" fill="#e5e7eb" />
      <rect x="8" y="106" width="90" height="2" rx="1" fill="#e5e7eb" />
    </svg>
  );
}

// Professional — centered name, accent title, dot contacts, gray-rule sections
export function MiniTemplate3({ hex }: { hex: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect width="120" height="160" rx="3" fill="#fff" />
      {/* Large centered name */}
      <rect x="12" y="8" width="96" height="9" rx="2" fill="#111827" />
      {/* Accent-colored title */}
      <rect x="28" y="20" width="64" height="4" rx="1.5" fill={hex} opacity="0.85" />
      {/* Dot-separated contacts */}
      <circle cx="22" cy="30" r="1.5" fill="#9ca3af" />
      <rect x="25" y="28.5" width="18" height="2.5" rx="1" fill="#9ca3af" opacity="0.5" />
      <circle cx="48" cy="30" r="1.5" fill="#9ca3af" />
      <rect x="51" y="28.5" width="18" height="2.5" rx="1" fill="#9ca3af" opacity="0.5" />
      <circle cx="74" cy="30" r="1.5" fill="#9ca3af" />
      <rect x="77" y="28.5" width="18" height="2.5" rx="1" fill="#9ca3af" opacity="0.5" />
      {/* Gradient rule */}
      <rect x="8" y="35" width="104" height="1.5" rx="0.75" fill={hex} opacity="0.4" />
      {/* Section 1: larger label + gray rule */}
      <rect x="8" y="42" width="36" height="3.5" rx="1" fill="#111827" opacity="0.8" />
      <rect x="8" y="48" width="104" height="0.75" fill="#d1d5db" />
      {/* Entry: role bold + company in accent */}
      <rect x="8" y="52" width="42" height="2.5" rx="1" fill="#374151" opacity="0.7" />
      <rect x="54" y="52" width="30" height="2.5" rx="1" fill={hex} opacity="0.7" />
      <rect x="8" y="57" width="28" height="2" rx="1" fill="#9ca3af" opacity="0.4" />
      <rect x="12" y="61" width="84" height="2" rx="1" fill="#e5e7eb" />
      <rect x="12" y="65" width="72" height="2" rx="1" fill="#e5e7eb" />
      {/* Section 2 */}
      <rect x="8" y="72" width="28" height="3.5" rx="1" fill="#111827" opacity="0.8" />
      <rect x="8" y="78" width="104" height="0.75" fill="#d1d5db" />
      <rect x="8" y="82" width="42" height="2.5" rx="1" fill="#374151" opacity="0.7" />
      <rect x="54" y="82" width="30" height="2.5" rx="1" fill={hex} opacity="0.7" />
      <rect x="12" y="87" width="80" height="2" rx="1" fill="#e5e7eb" />
      <rect x="12" y="91" width="68" height="2" rx="1" fill="#e5e7eb" />
      {/* Section 3 */}
      <rect x="8" y="98" width="34" height="3.5" rx="1" fill="#111827" opacity="0.8" />
      <rect x="8" y="104" width="104" height="0.75" fill="#d1d5db" />
      <rect x="8" y="108" width="104" height="2" rx="1" fill="#e5e7eb" />
      <rect x="8" y="112" width="88" height="2" rx="1" fill="#e5e7eb" />
    </svg>
  );
}

export const TEMPLATES: { id: TemplateId; name: string; desc: string }[] = [
  { id: 'template1', name: 'Classic',      desc: 'Two-column header, academic style'   },
  { id: 'template2', name: 'Modern',       desc: 'Centered header, clean underlines'   },
  { id: 'template3', name: 'Professional', desc: 'Executive style, accent highlights'  },
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

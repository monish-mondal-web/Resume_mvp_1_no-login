'use client';

import type { TemplateOptions, AccentColor, FontSize, SpacingOption, FontFamily } from '@/types/resume.types';
import { ACCENT_COLORS, FONT_FAMILY_MAP } from '@/types/resume.types';

interface Props {
  options: TemplateOptions;
  onChange: (opts: TemplateOptions) => void;
}

function set<K extends keyof TemplateOptions>(opts: TemplateOptions, key: K, val: TemplateOptions[K]): TemplateOptions {
  return { ...opts, [key]: val };
}

export function TemplateCustomizer({ options, onChange }: Props) {
  return (
    <div className="space-y-4 px-3 pb-4 pt-1">

      {/* Accent colour */}
      <div>
        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">Accent Colour</p>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(ACCENT_COLORS) as [AccentColor, typeof ACCENT_COLORS[AccentColor]][]).map(([key, c]) => (
            <button
              key={key}
              title={c.label}
              onClick={() => onChange(set(options, 'accentColor', key))}
              className="relative flex h-5 w-5 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95"
              style={{ backgroundColor: c.hex }}
            >
              {options.accentColor === key && (
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none" className="absolute">
                  <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Font family */}
      <div>
        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">Font</p>
        <div className="flex flex-wrap gap-1.5">
          {(Object.entries(FONT_FAMILY_MAP) as [FontFamily, string][]).map(([key, family]) => (
            <button
              key={key}
              onClick={() => onChange(set(options, 'fontFamily', key))}
              className={`cursor-pointer rounded-lg border px-2.5 py-1 text-[11px] transition-colors ${
                options.fontFamily === key
                  ? 'border-indigo-400 bg-indigo-50 font-semibold text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
              style={{ fontFamily: family }}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Font size */}
      <div>
        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">Text Size</p>
        <div className="flex gap-1.5">
          {(['sm', 'md', 'lg'] as FontSize[]).map(s => (
            <button
              key={s}
              onClick={() => onChange(set(options, 'fontSize', s))}
              className={`cursor-pointer rounded-lg border px-3 py-1 text-[11px] font-medium transition-colors ${
                options.fontSize === s
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              }`}
            >
              {s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'}
            </button>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div>
        <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">Spacing</p>
        <div className="flex gap-1.5">
          {(['compact', 'normal', 'relaxed'] as SpacingOption[]).map(s => (
            <button
              key={s}
              onClick={() => onChange(set(options, 'spacing', s))}
              className={`cursor-pointer rounded-lg border px-2.5 py-1 text-[11px] font-medium capitalize transition-colors ${
                options.spacing === s
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

'use client';

import { useState } from 'react';
import type { TemplateOptions, AccentColor, FontSize, SpacingOption, FontFamily, PagePadding } from '@/types/resume.types';
import { ACCENT_COLORS, FONT_FAMILY_MAP } from '@/types/resume.types';

interface Props {
  options: TemplateOptions;
  onChange: (opts: TemplateOptions) => void;
}

function set<K extends keyof TemplateOptions>(opts: TemplateOptions, key: K, val: TemplateOptions[K]): TemplateOptions {
  return { ...opts, [key]: val };
}

function isValidHex(s: string) { return /^#[0-9a-fA-F]{6}$/.test(s); }

export function TemplateCustomizer({ options, onChange }: Props) {
  const [hexInput, setHexInput] = useState(options.customAccentColor ?? '');

  const currentAccentHex = options.customAccentColor || ACCENT_COLORS[options.accentColor]?.hex || '#6366f1';

  const handleHexChange = (raw: string) => {
    const val = raw.startsWith('#') ? raw : `#${raw}`;
    setHexInput(raw);
    if (isValidHex(val)) {
      onChange({ ...options, customAccentColor: val });
    }
  };

  const handleColorPicker = (val: string) => {
    setHexInput(val.slice(1)); // strip # for the text field
    onChange({ ...options, customAccentColor: val });
  };

  const selectPreset = (key: AccentColor) => {
    setHexInput('');
    onChange({ ...options, accentColor: key, customAccentColor: undefined });
  };

  return (
    <div className="space-y-5 px-3 pb-4 pt-1">

      {/* Accent colour */}
      <div>
        <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">Accent Colour</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {(Object.entries(ACCENT_COLORS) as [AccentColor, typeof ACCENT_COLORS[AccentColor]][]).map(([key, c]) => {
            const isActive = !options.customAccentColor && options.accentColor === key;
            return (
              <button
                key={key}
                title={c.label}
                onClick={() => selectPreset(key)}
                className="relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
                style={{
                  backgroundColor: c.hex,
                  boxShadow: isActive ? `0 0 0 2px white, 0 0 0 4px ${c.hex}` : 'none',
                }}
              >
                {isActive && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="absolute">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom colour picker */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
          <label className="relative cursor-pointer">
            <span className="sr-only">Pick custom colour</span>
            <div
              className="h-7 w-7 rounded-lg border-2 border-white shadow-sm ring-1 ring-slate-200 overflow-hidden cursor-pointer"
              style={{ backgroundColor: currentAccentHex }}
            />
            <input
              type="color"
              value={currentAccentHex}
              onChange={e => handleColorPicker(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Custom</span>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-400 font-mono">#</span>
              <input
                type="text"
                value={hexInput}
                onChange={e => handleHexChange(e.target.value)}
                onBlur={() => {
                  if (!hexInput) return;
                  const val = hexInput.startsWith('#') ? hexInput : `#${hexInput}`;
                  if (!isValidHex(val)) setHexInput('');
                }}
                maxLength={7}
                placeholder="6366f1"
                className="flex-1 min-w-0 bg-transparent text-[11px] font-mono text-slate-700 outline-none placeholder:text-slate-300"
              />
              {options.customAccentColor && (
                <button
                  onClick={() => { setHexInput(''); onChange({ ...options, customAccentColor: undefined }); }}
                  className="text-[9px] text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                  title="Clear custom colour"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Font family */}
      <div>
        <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">Font</p>
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

      {/* Text size */}
      <div>
        <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">Text Size</p>
        <div className="flex gap-1.5">
          {(['sm', 'md', 'lg'] as FontSize[]).map(s => (
            <button
              key={s}
              onClick={() => onChange(set(options, 'fontSize', s))}
              className={`cursor-pointer flex-1 rounded-lg border py-1.5 text-[11px] font-medium transition-colors ${
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
        <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">Spacing</p>
        <div className="flex gap-1.5">
          {(['compact', 'normal', 'relaxed'] as SpacingOption[]).map(s => (
            <button
              key={s}
              onClick={() => onChange(set(options, 'spacing', s))}
              className={`cursor-pointer flex-1 rounded-lg border py-1.5 text-[11px] font-medium capitalize transition-colors ${
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

      {/* Page padding */}
      <div>
        <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">Page Margins</p>
        <div className="flex gap-1.5">
          {([
            { key: 'narrow', label: 'Narrow' },
            { key: 'normal', label: 'Normal' },
            { key: 'wide',   label: 'Wide'   },
          ] as { key: PagePadding; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onChange(set(options, 'pagePadding', key))}
              className={`cursor-pointer flex-1 rounded-lg border py-1.5 text-[11px] font-medium transition-colors ${
                (options.pagePadding ?? 'normal') === key
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

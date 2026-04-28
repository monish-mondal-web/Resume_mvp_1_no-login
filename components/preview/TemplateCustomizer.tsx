'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type {
  TemplateOptions, AccentColor, FontSize, SpacingOption,
  FontFamily, PagePadding, LineWeight, ImageShape, ImageSize,
} from '@/types/resume.types';
import { ACCENT_COLORS, FONT_FAMILY_MAP, DEFAULT_TEMPLATE_OPTIONS } from '@/types/resume.types';

interface Props {
  options: TemplateOptions;
  onChange: (opts: TemplateOptions) => void;
}

function isValidHex(s: string) { return /^#[0-9a-fA-F]{6}$/.test(s); }

// ── Animated segmented control ────────────────────────────────────────────────
// layout: 'row' = icon + label side-by-side | 'col' = icon stacked above label
function Segments<T extends string>({
  options: items, value, onChange, layout = 'row',
}: {
  options: { key: T; label: string; icon?: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  layout?: 'row' | 'col';
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs      = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const idx = items.findIndex(i => i.key === value);
    const el  = btnRefs.current[idx];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  }, [value, items]);

  return (
    <div ref={containerRef} className="relative flex rounded-xl border border-slate-200 bg-slate-50 p-[3px]">
      {pill.ready && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-[3px] rounded-[9px] border border-slate-200 bg-white transition-all duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ left: pill.left, width: pill.width }}
        />
      )}
      {items.map(({ key, label, icon }, i) => {
        const isActive = value === key;
        return (
          <button
            key={key}
            ref={el => { btnRefs.current[i] = el; }}
            type="button"
            onClick={() => onChange(key)}
            className={`relative z-10 flex flex-1 cursor-pointer select-none items-center justify-center rounded-[9px] py-[7px] px-0.5 text-[10px] font-medium transition-colors duration-150 active:opacity-70 ${
              layout === 'col' ? 'flex-col gap-[3px]' : 'flex-row gap-1'
            } ${isActive ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span className="leading-none">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({
  checked, onChange, label, hint, icon,
}: {
  checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string; icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left transition-colors duration-150 hover:bg-slate-50 active:opacity-80"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        {icon && (
          <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border transition-colors duration-200 ${
            checked ? 'border-indigo-200 bg-indigo-50 text-indigo-500' : 'border-slate-200 bg-slate-50 text-slate-400'
          }`}>
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-[12px] font-medium leading-tight text-slate-700">{label}</p>
          {hint && <p className="mt-0.5 truncate text-[10px] leading-tight text-slate-400">{hint}</p>}
        </div>
      </div>
      <span className={`relative ml-3 inline-flex h-5 w-9 flex-shrink-0 rounded-full border transition-colors duration-200 ${
        checked ? 'border-indigo-400 bg-indigo-500' : 'border-slate-300 bg-slate-200'
      }`}>
        <span className={`absolute top-[2px] inline-block h-[14px] w-[14px] rounded-full bg-white transition-all duration-200 ${
          checked ? 'left-[18px]' : 'left-[2px]'
        }`} />
      </span>
    </button>
  );
}

// ── Font picker ───────────────────────────────────────────────────────────────
const FONT_OPTIONS: { key: FontFamily; label: string; sample: string }[] = [
  { key: 'inter',   label: 'Inter',   sample: 'Aa' },
  { key: 'sans',    label: 'Sans',    sample: 'Aa' },
  { key: 'serif',   label: 'Serif',   sample: 'Aa' },
  { key: 'georgia', label: 'Georgia', sample: 'Ag' },
  { key: 'mono',    label: 'Mono',    sample: 'Aa' },
];

function FontPicker({
  value, onChange, showReset = false,
}: {
  value: FontFamily | undefined;
  onChange: (v: FontFamily | undefined) => void;
  showReset?: boolean;
}) {
  return (
    // Always 3 columns — fits comfortably in the ~224px content area
    <div className="grid grid-cols-3 gap-1.5">
      {showReset && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          title="Same as body font"
          className={`flex flex-col items-center justify-center gap-1 rounded-xl border py-2.5 cursor-pointer transition-colors duration-150 active:opacity-70 ${
            value === undefined
              ? 'border-indigo-300 bg-indigo-50'
              : 'border-dashed border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round"
            className={value === undefined ? 'text-indigo-400' : 'text-slate-300'}
          >
            <path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>
          </svg>
          <span className={`text-[9px] font-semibold leading-none ${value === undefined ? 'text-indigo-600' : 'text-slate-400'}`}>
            Auto
          </span>
        </button>
      )}
      {FONT_OPTIONS.map(({ key, label, sample }) => {
        const isActive = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl border py-2.5 cursor-pointer transition-colors duration-150 active:opacity-70 ${
              isActive
                ? 'border-indigo-300 bg-indigo-50'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span
              style={{ fontFamily: FONT_FAMILY_MAP[key], fontSize: 15, lineHeight: 1 }}
              className={isActive ? 'text-indigo-700' : 'text-slate-700'}
            >
              {sample}
            </span>
            <span className={`text-[9px] font-semibold leading-none ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Color picker row ──────────────────────────────────────────────────────────
function ColorPickerRow({
  hexValue, hexInput, onHexInput, onPicker, onClear, clearLabel = 'Reset',
}: {
  hexValue: string; hexInput: string;
  onHexInput: (raw: string) => void;
  onPicker: (hex: string) => void;
  onClear?: () => void;
  clearLabel?: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2">
      <label className="relative flex-shrink-0 cursor-pointer">
        <div
          className="h-7 w-7 rounded-lg border border-slate-200 transition-opacity hover:opacity-80"
          style={{ backgroundColor: hexValue }}
        />
        <input
          type="color" value={hexValue} onChange={e => onPicker(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </label>
      <div className="flex min-w-0 flex-1 items-center gap-1 rounded-lg border border-slate-100 bg-slate-50 px-2 py-[7px]">
        <span className="select-none font-mono text-[10px] text-slate-300">#</span>
        <input
          type="text" value={hexInput} onChange={e => onHexInput(e.target.value)}
          maxLength={7} placeholder="6366f1"
          className="min-w-0 flex-1 bg-transparent font-mono text-[10px] text-slate-700 outline-none placeholder:text-slate-300"
        />
      </div>
      {onClear && (
        <button
          type="button" onClick={onClear}
          className="flex-shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2 py-[7px] text-[9px] font-medium text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-600 active:opacity-70"
        >
          {clearLabel}
        </button>
      )}
    </div>
  );
}

// ── Accordion section ─────────────────────────────────────────────────────────
function AccordionSection({
  title, icon, accentColor = '#6366f1', defaultOpen = false, children,
}: {
  title: string; icon: React.ReactNode; accentColor?: string; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex w-full cursor-pointer items-center justify-between px-4 py-3.5 text-left transition-colors duration-150 hover:bg-slate-50 active:opacity-80"
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border transition-colors duration-200"
            style={{
              backgroundColor: open ? `${accentColor}12` : '#f8fafc',
              borderColor:     open ? `${accentColor}30` : '#e2e8f0',
              color:           open ? accentColor        : '#94a3b8',
            }}
          >
            {icon}
          </span>
          <span className="text-[12.5px] font-semibold tracking-tight text-slate-700">{title}</span>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{
            flexShrink: 0,
            color:     open ? accentColor : '#cbd5e1',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 250ms cubic-bezier(0.4,0,0.2,1), color 200ms',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* CSS grid height animation */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 260ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div className="overflow-hidden">
          {/* px-3 (not px-4) to preserve space in narrow containers */}
          <div className="space-y-3.5 border-t border-slate-100 px-3 pb-4 pt-3.5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">{children}</p>;
}

function Divider() { return <div className="h-px bg-slate-100" />; }

// ── Icons ─────────────────────────────────────────────────────────────────────
const TypographyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>
  </svg>
);
const ColorsIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    <circle cx="8.5" cy="11" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="11" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="7.5" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
);
const LayoutIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
  </svg>
);
const DisplayIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

// ── Main ──────────────────────────────────────────────────────────────────────
export function TemplateCustomizer({ options, onChange }: Props) {
  const [accentHex, setAccentHex] = useState(options.customAccentColor?.slice(1) ?? '');
  const [linkHex,   setLinkHex]   = useState(options.linkColor?.slice(1) ?? '');
  const [resetSpin, setResetSpin] = useState(false);

  const currentAccent = options.customAccentColor || ACCENT_COLORS[options.accentColor]?.hex || '#6366f1';

  const handleReset = () => {
    setAccentHex(''); setLinkHex('');
    setResetSpin(true);
    setTimeout(() => setResetSpin(false), 500);
    onChange(DEFAULT_TEMPLATE_OPTIONS);
  };

  const handleAccentHex = (raw: string) => {
    const val = raw.startsWith('#') ? raw : `#${raw}`;
    setAccentHex(raw.replace('#', ''));
    if (isValidHex(val)) onChange({ ...options, customAccentColor: val });
  };
  const clearAccent = () => { setAccentHex(''); onChange({ ...options, customAccentColor: undefined }); };

  const handleLinkHex = (raw: string) => {
    const val = raw.startsWith('#') ? raw : `#${raw}`;
    setLinkHex(raw.replace('#', ''));
    if (isValidHex(val)) onChange({ ...options, linkColor: val });
  };
  const clearLink = () => { setLinkHex(''); onChange({ ...options, linkColor: undefined }); };

  const showPhoto = options.showPhoto ?? true;

  return (
    <div className="flex flex-col gap-2 pb-6 pt-0.5">

      {/* Header row */}
      <div className="flex items-center justify-between pb-1">
        <p className="text-[11px] font-medium text-slate-400">Style settings</p>
        <button
          type="button" onClick={handleReset}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10.5px] font-medium text-slate-500 transition-colors duration-150 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 active:opacity-70"
        >
          <svg
            width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: resetSpin ? 'rotate(360deg)' : 'rotate(0deg)', transition: resetSpin ? 'transform 500ms cubic-bezier(0.4,0,0.2,1)' : 'none' }}
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
          </svg>
          Reset
        </button>
      </div>

      {/* ── TYPOGRAPHY ─────────────────────────────────────────────────── */}
      <AccordionSection title="Typography" icon={<TypographyIcon />} accentColor="#6366f1" defaultOpen>
        <div>
          <Label>Heading Font</Label>
          <FontPicker value={options.headingFont} onChange={v => onChange({ ...options, headingFont: v })} showReset />
        </div>
        <Divider />
        <div>
          <Label>Body Font</Label>
          <FontPicker value={options.fontFamily} onChange={v => onChange({ ...options, fontFamily: v ?? 'sans' })} showReset={false} />
        </div>
        <Divider />
        <div>
          <Label>Text Size</Label>
          <Segments
            options={[
              { key: 'sm' as FontSize, label: 'Small',  icon: <span className="text-[9px]  font-black leading-none">A</span> },
              { key: 'md' as FontSize, label: 'Medium', icon: <span className="text-[12px] font-black leading-none">A</span> },
              { key: 'lg' as FontSize, label: 'Large',  icon: <span className="text-[15px] font-black leading-none">A</span> },
            ] as { key: FontSize; label: string; icon: React.ReactNode }[]}
            value={options.fontSize}
            onChange={v => onChange({ ...options, fontSize: v })}
          />
        </div>
      </AccordionSection>

      {/* ── COLORS ─────────────────────────────────────────────────────── */}
      <AccordionSection title="Colors" icon={<ColorsIcon />} accentColor="#8b5cf6" defaultOpen>
        <div>
          <Label>Accent Color</Label>
          <div className="mb-3 flex flex-wrap gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2.5">
            {(Object.entries(ACCENT_COLORS) as [AccentColor, typeof ACCENT_COLORS[AccentColor]][]).map(([key, c]) => {
              const isActive = !options.customAccentColor && options.accentColor === key;
              return (
                <button
                  key={key} type="button" title={c.label}
                  onClick={() => { setAccentHex(''); onChange({ ...options, accentColor: key, customAccentColor: undefined }); }}
                  className="relative flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-150 hover:scale-110 active:scale-95"
                  style={{ backgroundColor: c.hex, outline: isActive ? `2px solid ${c.hex}` : 'none', outlineOffset: isActive ? '2.5px' : '0' }}
                >
                  {isActive && (
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          <Label>Custom Hex</Label>
          <ColorPickerRow
            hexValue={currentAccent} hexInput={accentHex}
            onHexInput={handleAccentHex}
            onPicker={v => { setAccentHex(v.slice(1)); onChange({ ...options, customAccentColor: v }); }}
            onClear={options.customAccentColor ? clearAccent : undefined}
            clearLabel="Clear"
          />
        </div>
        <Divider />
        <div>
          <Label>Link Color</Label>
          <ColorPickerRow
            hexValue={options.linkColor || currentAccent} hexInput={linkHex}
            onHexInput={handleLinkHex}
            onPicker={v => { setLinkHex(v.slice(1)); onChange({ ...options, linkColor: v }); }}
            onClear={options.linkColor ? clearLink : undefined}
            clearLabel="Use accent"
          />
        </div>
      </AccordionSection>

      {/* ── LAYOUT ─────────────────────────────────────────────────────── */}
      <AccordionSection title="Layout" icon={<LayoutIcon />} accentColor="#0ea5e9">
        <div>
          <Label>Line Spacing</Label>
          {/* Icon-only layout for spacing — icons are self-explanatory */}
          <Segments
            layout="col"
            options={[
              {
                key: 'compact' as SpacingOption, label: 'Compact',
                icon: (
                  <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <line x1="1" y1="1"  x2="21" y2="1" /><line x1="1" y1="4"  x2="21" y2="4" />
                    <line x1="1" y1="7"  x2="21" y2="7" /><line x1="1" y1="10" x2="21" y2="10"/>
                    <line x1="1" y1="13" x2="21" y2="13"/>
                  </svg>
                ),
              },
              {
                key: 'normal' as SpacingOption, label: 'Normal',
                icon: (
                  <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <line x1="1" y1="1" x2="21" y2="1"/><line x1="1" y1="7" x2="21" y2="7"/>
                    <line x1="1" y1="13" x2="21" y2="13"/>
                  </svg>
                ),
              },
              {
                key: 'relaxed' as SpacingOption, label: 'Relaxed',
                icon: (
                  <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <line x1="1" y1="1"  x2="21" y2="1" /><line x1="1" y1="13" x2="21" y2="13"/>
                  </svg>
                ),
              },
            ] as { key: SpacingOption; label: string; icon: React.ReactNode }[]}
            value={options.spacing}
            onChange={v => onChange({ ...options, spacing: v })}
          />
        </div>
        <Divider />
        <div>
          <Label>Page Margins</Label>
          <Segments
            layout="col"
            options={[
              {
                key: 'narrow' as PagePadding, label: 'Narrow',
                icon: (
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="1" width="16" height="12" rx="1.5"/>
                    <rect x="2.5" y="2.5" width="13" height="9" rx="0.5"/>
                  </svg>
                ),
              },
              {
                key: 'normal' as PagePadding, label: 'Normal',
                icon: (
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="1" width="16" height="12" rx="1.5"/>
                    <rect x="4" y="3" width="10" height="8" rx="0.5"/>
                  </svg>
                ),
              },
              {
                key: 'wide' as PagePadding, label: 'Wide',
                icon: (
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="1" width="16" height="12" rx="1.5"/>
                    <rect x="5.5" y="4" width="7" height="6" rx="0.5"/>
                  </svg>
                ),
              },
            ] as { key: PagePadding; label: string; icon: React.ReactNode }[]}
            value={options.pagePadding ?? 'normal'}
            onChange={v => onChange({ ...options, pagePadding: v })}
          />
        </div>
        <Divider />
        <div>
          <Label>Rule Weight</Label>
          {/* Icon-only for rule weight — the lines speak for themselves */}
          <Segments
            layout="col"
            options={[
              {
                key: 'thin' as LineWeight, label: 'Thin',
                icon: <svg width="32" height="8" viewBox="0 0 32 8"><line x1="2" y1="4" x2="30" y2="4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>,
              },
              {
                key: 'normal' as LineWeight, label: 'Normal',
                icon: <svg width="32" height="8" viewBox="0 0 32 8"><line x1="2" y1="4" x2="30" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
              },
              {
                key: 'thick' as LineWeight, label: 'Thick',
                icon: <svg width="32" height="8" viewBox="0 0 32 8"><line x1="2" y1="4" x2="30" y2="4" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/></svg>,
              },
            ] as { key: LineWeight; label: string; icon: React.ReactNode }[]}
            value={options.lineWeight ?? 'normal'}
            onChange={v => onChange({ ...options, lineWeight: v })}
          />
        </div>
      </AccordionSection>

      {/* ── DISPLAY ────────────────────────────────────────────────────── */}
      <AccordionSection title="Display" icon={<DisplayIcon />} accentColor="#10b981">
        <Toggle
          checked={showPhoto}
          onChange={v => onChange({ ...options, showPhoto: v })}
          label="Profile Photo"
          hint="Show photo in the header"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          }
        />

        {/* Photo options — animate open when photo is on */}
        <div style={{ display: 'grid', gridTemplateRows: showPhoto ? '1fr' : '0fr', transition: 'grid-template-rows 240ms cubic-bezier(0.4,0,0.2,1)' }}>
          <div className="overflow-hidden">
            <div className="mt-1 flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div>
                <Label>Shape</Label>
                <Segments
                  layout="col"
                  options={[
                    {
                      key: 'circle' as ImageShape, label: 'Circle',
                      icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10" cy="10" r="7"/></svg>,
                    },
                    {
                      key: 'rounded' as ImageShape, label: 'Rounded',
                      icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="14" height="14" rx="4"/></svg>,
                    },
                    {
                      key: 'square' as ImageShape, label: 'Square',
                      icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="14" height="14" rx="1.5"/></svg>,
                    },
                  ] as { key: ImageShape; label: string; icon: React.ReactNode }[]}
                  value={options.imageShape ?? 'circle'}
                  onChange={v => onChange({ ...options, imageShape: v })}
                />
              </div>
              <div>
                <Label>Size</Label>
                <Segments
                  options={[
                    { key: 'sm' as ImageSize, label: 'Small'  },
                    { key: 'md' as ImageSize, label: 'Medium' },
                    { key: 'lg' as ImageSize, label: 'Large'  },
                  ] as { key: ImageSize; label: string }[]}
                  value={options.imageSize ?? 'md'}
                  onChange={v => onChange({ ...options, imageSize: v })}
                />
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <Toggle
          checked={options.showContactIcons ?? true}
          onChange={v => onChange({ ...options, showContactIcons: v })}
          label="Contact Icons"
          hint="Icons next to phone, email & links"
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
          }
        />
      </AccordionSection>

    </div>
  );
}

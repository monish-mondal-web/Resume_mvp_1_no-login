'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SuggestionType } from '@/models/Suggestion';

interface Suggestion {
  value: string;
  usageCount: number;
}

interface AutocompleteProps {
  type: SuggestionType;
  value: string;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  onInputKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  id?: string;
  disabled?: boolean;
  trackOnBlur?: boolean;
}

const memCache = new Map<string, { data: Suggestion[]; ts: number }>();
const MEM_TTL = 2 * 60_000; // 2 min client-side

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-indigo-100 text-indigo-700 rounded-[2px] font-medium not-italic">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

async function apiFetch(type: SuggestionType, q: string): Promise<Suggestion[]> {
  const normalizedQ = (q || '').toLowerCase();
  const cacheKey = `${type}:${normalizedQ}`;
  const hit = memCache.get(cacheKey);
  if (hit && Date.now() - hit.ts < MEM_TTL) return hit.data;
  if (!normalizedQ) return [];

  const url = `/api/suggestions?type=${type}&q=${encodeURIComponent(normalizedQ)}&limit=8`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json() as { suggestions: Suggestion[] };
  memCache.set(cacheKey, { data: data.suggestions, ts: Date.now() });
  return data.suggestions;
}

function postUsage(type: SuggestionType, value: string) {
  fetch('/api/suggestions/use', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value, type }),
  }).catch(() => {});
  
  // Clear client cache only for this specific type to keep other fields fast
  for (const key of memCache.keys()) {
    if (key.startsWith(type + ':')) {
      memCache.delete(key);
    }
  }
}

export function Autocomplete({
  type,
  value,
  onChange,
  onSelect,
  onInputKeyDown,
  placeholder,
  className,
  inputClassName,
  id,
  disabled,
  trackOnBlur = true,
}: AutocompleteProps) {
  const [query, setQuery] = useState(value || '');
  const [prevValue, setPrevValue] = useState(value || '');

  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value);
  }

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const didBlurCommit = useRef(false);



  const fetchAndShow = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const data = await apiFetch(type, q);
      setSuggestions(data);
      setOpen(data.length > 0);
      setActiveIdx(-1);
    } finally {
      setLoading(false);
    }
  }, [type]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    onChange(v);
    didBlurCommit.current = false;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchAndShow(v), 200);
  };

  // Prefetch popular items on focus
  const handleFocus = () => {
    if (suggestions.length > 0) {
      setOpen(true);
      return;
    }
    fetchAndShow(query);
  };

  const commitValue = useCallback((val: string) => {
    didBlurCommit.current = true;
    onChange(val);
    onSelect?.(val);
    setOpen(false);
    setActiveIdx(-1);
    postUsage(type, val);
  }, [onChange, onSelect, type]);

  // Save custom-typed value on blur (only if user didn't already commit via dropdown)
  const handleBlur = () => {
    setOpen(false);
    const trimmed = (query || '').trim();
    if (trimmed && !didBlurCommit.current && trackOnBlur) {
      postUsage(type, trimmed);
    }
    didBlurCommit.current = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (open && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === 'Enter' && activeIdx >= 0) {
        e.preventDefault();
        commitValue(suggestions[activeIdx].value);
        return;
      }
      if (e.key === 'Escape') {
        setOpen(false);
        setActiveIdx(-1);
        return;
      }
    }
    onInputKeyDown?.(e);
  };

  // Close on outside pointer
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      <input
        id={id}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        spellCheck={false}
        className={inputClassName}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={open ? `${id || 'autocomplete'}-listbox` : undefined}
        aria-haspopup="listbox"
      />

      {loading && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg className="h-3.5 w-3.5 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </span>
      )}

      {open && suggestions.length > 0 && (
        <ul
          id={`${id || 'autocomplete'}-listbox`}
          role="listbox"
          className="absolute left-0 top-full z-[200] mt-1 max-h-56 min-w-[200px] w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s.value}-${i}`}
              role="option"
              aria-selected={i === activeIdx}
              onPointerDown={(e) => {
                e.preventDefault();
                commitValue(s.value);
              }}
              className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors ${
                i === activeIdx ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="min-w-0 truncate">{highlight(s.value, query)}</span>
              {s.usageCount > 0 && (
                <span className="ml-2 shrink-0 text-[10px] text-slate-400">
                  {s.usageCount > 999 ? `${Math.floor(s.usageCount / 1000)}k` : s.usageCount}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

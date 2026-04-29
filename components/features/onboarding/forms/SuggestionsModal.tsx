import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiMessageSquare, FiPlus, FiX } from 'react-icons/fi';
import { Autocomplete } from '@/components/ui/Autocomplete';

export interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (text: string) => void;
  title: string;
  subtitle: string;
  searchLabel: string;
  searchPlaceholder: string;
  defaultSearch: string;
  fetchSuggestions: (query: string) => string[];
}

export function SuggestionsModal({
  isOpen,
  onClose,
  onSelect,
  title,
  subtitle,
  searchLabel,
  searchPlaceholder,
  defaultSearch,
  fetchSuggestions
}: SuggestionsModalProps) {
  const [searchQuery, setSearchQuery] = useState(defaultSearch);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadingTimer = window.setTimeout(() => setLoading(true), 0);
    const suggestionsTimer = window.setTimeout(() => {
      setSuggestions(fetchSuggestions(searchQuery)); 
      setLoading(false); 
    }, 500);

    return () => {
      window.clearTimeout(loadingTimer);
      window.clearTimeout(suggestionsTimer);
    };
  }, [searchQuery, isOpen, fetchSuggestions]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
          <button onClick={onClose} className="cursor-pointer text-slate-400 transition hover:text-slate-600"><FiX className="text-xl" /></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">{searchLabel}</label>
            <Autocomplete type="role" value={searchQuery} onChange={setSearchQuery} trackOnBlur={false}
              placeholder={searchPlaceholder}
              inputClassName="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 shadow-sm" />
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20" />
                  <div className="relative h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                </div>
                <p className="mt-6 text-sm font-medium text-slate-500 animate-pulse">Generating AI suggestions...</p>
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((s, idx) => (
                <div key={idx} className="group relative rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-md">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <FiMessageSquare className="text-sm" />
                    </div>
                    <p className="flex-1 text-sm leading-relaxed text-slate-700">{s}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button onClick={() => onSelect(s)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-indigo-600 hover:text-white">
                      <FiPlus className="text-sm" /> Use this suggestion
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center"><p className="text-sm text-slate-500">Type a keyword to see suggestions.</p></div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

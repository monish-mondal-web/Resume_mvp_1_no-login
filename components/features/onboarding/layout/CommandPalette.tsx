'use client';

import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import type { BuilderTab } from './BuilderTabBar';

// ── command icons ─────────────────────────────────────────────────────────────

function IconATS() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  );
}
function IconAssist() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  );
}
function IconOptimize() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}
function IconPreview() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function IconExport() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}
function IconEdit() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    </svg>
  );
}
function IconChevron() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  );
}

// ── types ─────────────────────────────────────────────────────────────────────

interface Command {
  id: string;
  group: string;
  Icon: () => React.ReactElement;
  label: string;
  desc: string;
  action: () => void;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTabChange: (tab: BuilderTab) => void;
  onTogglePreview: () => void;
  onExportPdf: () => void;
}

// ── palette ───────────────────────────────────────────────────────────────────

export function CommandPalette({
  isOpen, onClose, onTabChange, onTogglePreview, onExportPdf,
}: Props) {
  const [query, setQuery]   = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef  = useRef<HTMLDivElement>(null);

  const commands = useCallback((): Command[] => [
    {
      id: 'ats', group: 'Analysis',
      Icon: IconATS,
      label: 'Check ATS Score',
      desc: 'See how well your resume performs with ATS systems',
      action: () => { onTabChange('ats-score'); onClose(); },
    },
    {
      id: 'smart-assist', group: 'AI Features',
      Icon: IconAssist,
      label: 'Smart Assist',
      desc: 'Get AI-powered suggestions to improve your resume',
      action: () => { onTabChange('smart-assist'); onClose(); },
    },
    {
      id: 'optimize', group: 'AI Features',
      Icon: IconOptimize,
      label: 'Optimize for Job',
      desc: 'Tailor your resume to a specific job description',
      action: () => { onTabChange('optimize'); onClose(); },
    },
    {
      id: 'preview', group: 'View',
      Icon: IconPreview,
      label: 'Toggle Preview',
      desc: 'Show or hide the live resume preview panel',
      action: () => { onTogglePreview(); onClose(); },
    },
    {
      id: 'edit', group: 'View',
      Icon: IconEdit,
      label: 'Back to Edit',
      desc: 'Return to the resume editing form',
      action: () => { onTabChange('edit'); onClose(); },
    },
    {
      id: 'export', group: 'Export',
      Icon: IconExport,
      label: 'Export as PDF',
      desc: 'Download your resume as a high-quality PDF',
      action: () => { onExportPdf(); onClose(); },
    },
  ], [onClose, onTabChange, onTogglePreview, onExportPdf]);

  const items = useCallback(() => {
    const cmds = commands();
    if (!query.trim()) return cmds;
    const q = query.toLowerCase();
    return cmds.filter(c =>
      c.label.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    );
  }, [query, commands]);

  const visibleItems = items();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  useEffect(() => {
    setCursor(v => Math.min(v, Math.max(0, visibleItems.length - 1)));
  }, [visibleItems.length]);

  const execute = useCallback((idx: number) => {
    visibleItems[idx]?.action();
  }, [visibleItems]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(v => Math.min(v + 1, visibleItems.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(v => Math.max(v - 1, 0)); }
    else if (e.key === 'Enter')   { e.preventDefault(); execute(cursor); }
    else if (e.key === 'Escape')  onClose();
  }, [cursor, visibleItems.length, execute, onClose]);

  if (!isOpen) return null;

  const grouped = visibleItems.reduce<Record<string, (Command & { idx: number })[]>>((acc, cmd, idx) => {
    (acc[cmd.group] ??= []).push({ ...cmd, idx });
    return acc;
  }, {});

  return (
    <div
      className="fixed inset-0 z-[500] flex items-start justify-center px-4 pt-[12vh]"
      style={{ background: 'rgba(15,23,42,0.35)' }}
      onClick={onClose}
    >
      <div className="absolute inset-0 backdrop-blur-[2px]" aria-hidden="true" />

      <div
        className="relative z-10 w-full max-w-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'cmdIn 160ms cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
          <span className="flex-shrink-0 text-slate-400"><IconSearch /></span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setCursor(0); }}
            onKeyDown={onKeyDown}
            placeholder="Search commands…"
            className="flex-1 bg-transparent text-[13px] text-slate-800 placeholder-slate-400 outline-none"
          />
          <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:block">
            ESC
          </kbd>
        </div>

        {/* List */}
        <div ref={listRef} className="max-h-[340px] overflow-y-auto py-1.5">
          {Object.entries(grouped).map(([group, cmds]) => (
            <div key={group} className="mb-0.5 px-1.5">
              <p className="px-2 pb-1 pt-2 text-[10px] font-medium uppercase tracking-widest text-slate-400">
                {group}
              </p>
              {cmds.map(cmd => {
                const isActive = cmd.idx === cursor;
                return (
                  <button
                    key={cmd.id}
                    type="button"
                    data-active={isActive}
                    onMouseEnter={() => setCursor(cmd.idx)}
                    onClick={() => execute(cmd.idx)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      isActive ? 'bg-indigo-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Icon */}
                    <span
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border transition-colors ${
                        isActive
                          ? 'border-indigo-200 bg-indigo-100 text-indigo-600'
                          : 'border-slate-200 bg-slate-50 text-slate-500'
                      }`}
                    >
                      <cmd.Icon />
                    </span>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <p className={`text-[13px] font-medium leading-tight ${
                        isActive ? 'text-indigo-700' : 'text-slate-800'
                      }`}>
                        {cmd.label}
                      </p>
                      <p className="truncate text-[11px] text-slate-400">{cmd.desc}</p>
                    </div>

                    {/* Arrow */}
                    <span className={`flex-shrink-0 transition-opacity ${
                      isActive ? 'text-indigo-400 opacity-100' : 'opacity-0'
                    }`}>
                      <IconChevron />
                    </span>
                  </button>
                );
              })}
            </div>
          ))}

          {visibleItems.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <p className="text-[13px] font-medium text-slate-500">No results for "{query}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-slate-100 bg-slate-50/50 px-4 py-2">
          {[
            { key: '↑↓', hint: 'navigate' },
            { key: '↵',  hint: 'run'      },
            { key: 'esc', hint: 'close'   },
          ].map(({ key, hint }) => (
            <span key={key} className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-500">
                {key}
              </kbd>
              {hint}
            </span>
          ))}
          <span className="ml-auto text-[10px] text-slate-400">Ctrl K</span>
        </div>
      </div>

      <style>{`
        @keyframes cmdIn {
          from { opacity: 0; transform: scale(0.96) translateY(-6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
}

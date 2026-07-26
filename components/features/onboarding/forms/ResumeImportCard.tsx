'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import {
  FiArrowRight,
  FiClipboard,
  FiEdit3,
  FiFileText,
  FiLock,
  FiUploadCloud,
  FiX,
} from 'react-icons/fi';

interface Props {
  onDismiss: () => void;
}

export function ResumeImportCard({ onDismiss }: Props) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onDismiss}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dismiss X button */}
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <FiX className="text-base" />
        </button>

        {/* Header */}
        <div className="mb-6 flex items-start gap-3.5 pr-8">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600">
            <FiFileText className="text-lg" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              How do you want to start?
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Choose the fastest way to begin building your resume.
            </p>
          </div>
        </div>

        {/* ── Free option: Start from scratch ── */}
        <button
          type="button"
          onClick={onDismiss}
          className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-left transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 active:scale-[0.99]"
        >
          <span className="flex items-center gap-3.5">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
              <FiEdit3 className="text-lg" />
            </span>
            <span>
              <span className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">Start from scratch</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                  Free
                </span>
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">
                Build step by step with full control.
              </span>
            </span>
          </span>
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-indigo-200 bg-white text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
            <FiArrowRight className="text-sm" />
          </span>
        </button>

        {/* ── Divider ── */}
        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Or import an existing resume
          </span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        {/* ── Pro options (Disabled / Highlighted Coming Soon) ── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

          {/* Paste resume (Disabled coming soon) */}
          <div className="relative flex flex-col items-start rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 text-left opacity-75 select-none">
            <div className="flex w-full items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-600">
                <FiClipboard className="text-lg" />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-800">
                <FiLock className="text-[10px]" />
                Coming Soon
              </span>
            </div>
            <span className="mt-3 text-xs font-bold text-slate-800">Paste resume</span>
            <span className="mt-0.5 text-[11px] text-slate-500">Paste your existing content.</span>
          </div>

          {/* Upload resume (Disabled coming soon) */}
          <div className="relative flex flex-col items-start rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 text-left opacity-75 select-none">
            <div className="flex w-full items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600">
                <FiUploadCloud className="text-lg" />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-800">
                <FiLock className="text-[10px]" />
                Coming Soon
              </span>
            </div>
            <span className="mt-3 text-xs font-bold text-slate-800">Upload resume</span>
            <span className="mt-0.5 text-[11px] text-slate-500">Import from PDF or DOCX.</span>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}

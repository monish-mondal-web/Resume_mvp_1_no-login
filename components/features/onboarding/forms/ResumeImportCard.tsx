'use client';

import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import type { OnboardingFormValues } from '../types';

// ── Text parser ───────────────────────────────────────────────────────────────

function parseResumeText(text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const email = (text.match(/[\w.+'-]+@[\w.-]+\.[a-z]{2,}/i) ?? [])[0] ?? '';
  const phone = (text.match(/(\+?[\d][\d\s()./-]{7,14}[\d])/) ?? [])[1]?.trim() ?? '';

  const liMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([\w-]+)/i);
  const ghMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([\w-]+)/i);
  const linkedin = liMatch ? `https://linkedin.com/in/${liMatch[1]}` : '';
  const github   = ghMatch ? `https://github.com/${ghMatch[1]}` : '';

  let firstName = '', lastName = '';
  for (const line of lines.slice(0, 6)) {
    if (/@/.test(line) || /\d{4}/.test(line)) continue;
    const words = line.split(/\s+/).filter(w => /^[A-Za-z'-]+$/.test(w));
    if (words.length >= 2 && /^[A-Z]/.test(words[0])) {
      firstName = words[0];
      lastName  = words.slice(1).join(' ');
      break;
    }
  }

  let professionalTitle = '';
  if (firstName) {
    const nameIdx = lines.findIndex(l => l.includes(firstName));
    if (nameIdx >= 0 && nameIdx + 1 < lines.length) {
      const next = lines[nameIdx + 1];
      if (!/@/.test(next) && !/\d{8,}/.test(next) && next.length < 80) {
        professionalTitle = next;
      }
    }
  }

  let summary = '';
  const sumIdx = lines.findIndex(l => /^(summary|profile|objective|about me)/i.test(l));
  if (sumIdx >= 0) {
    summary = lines.slice(sumIdx + 1, sumIdx + 6).join(' ').slice(0, 500);
  }

  let location = '';
  const locPatterns = [
    /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z]{2,})\b/,
    /\b([A-Z][a-z]+,\s+[A-Z][a-z]+)\b/,
  ];
  for (const pat of locPatterns) {
    const m = text.match(pat);
    if (m) { location = m[1]; break; }
  }

  return { firstName, lastName, email, phone, professionalTitle, summary, location, linkedin, github };
}

// ── Paste modal ───────────────────────────────────────────────────────────────

function PasteModal({ onApply, onClose }: { onApply: (text: string) => void; onClose: () => void }) {
  const [text, setText] = useState('');
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div className="flex w-full max-w-xl flex-col rounded-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Paste Your Resume</h2>
            <p className="mt-0.5 text-[12px] text-slate-400">We'll extract the key info and fill in your form</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <FiX />
          </button>
        </div>

        <div className="p-6">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste your resume text here…"
            autoFocus
            className="h-64 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
          />
          <p className="mt-2 text-[11px] text-slate-400">Tip: copy all text from your resume (Ctrl+A → Ctrl+C) and paste here</p>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} className="cursor-pointer text-sm text-slate-500 transition hover:text-slate-700">Cancel</button>
          <button
            onClick={() => { if (text.trim()) onApply(text); }}
            disabled={!text.trim()}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-40"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Apply & Fill Form
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Upload modal ──────────────────────────────────────────────────────────────

function UploadModal({ onApply, onClose }: { onApply: (text: string) => void; onClose: () => void }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile]         = useState<File | null>(null);
  const [reading, setReading]   = useState(false);
  const [error, setError]       = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => { setError(''); setFile(f); };

  const handleApply = () => {
    if (!file) return;
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      setReading(true);
      const reader = new FileReader();
      reader.onload  = e => { setReading(false); onApply(e.target?.result as string ?? ''); };
      reader.onerror = () => { setReading(false); setError('Failed to read file.'); };
      reader.readAsText(file);
    } else {
      setError('PDF/DOCX parsing is coming soon. Please use "Paste your resume" for now, or upload a .txt file.');
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div className="flex w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Upload Your Resume</h2>
            <p className="mt-0.5 text-[12px] text-slate-400">We'll extract key info and fill in your form</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <FiX />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 transition-colors ${
              dragging ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50/60'
            }`}
          >
            <input ref={inputRef} type="file" accept=".txt,.pdf,.doc,.docx" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${dragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600">Drag & drop or <span className="text-indigo-600 underline underline-offset-2">browse files</span></p>
              <p className="mt-1 text-[11px] text-slate-400">PDF, DOC, DOCX, TXT</p>
            </div>
          </div>

          {file && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              <div className="flex-1 min-w-0">
                <p className="truncate text-[13px] font-medium text-slate-700">{file.name}</p>
                <p className="text-[11px] text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button onClick={() => setFile(null)} className="cursor-pointer text-slate-400 transition hover:text-red-500">
                <FiX className="text-sm" />
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-[12px] text-amber-800">{error}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} className="cursor-pointer text-sm text-slate-500 transition hover:text-slate-700">Cancel</button>
          <button
            onClick={handleApply}
            disabled={!file || reading}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-40"
          >
            {reading
              ? <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg><span>Reading…</span></>
              : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>Extract & Fill</span></>
            }
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────

interface Props {
  onDismiss: () => void;
}

export function ResumeImportCard({ onDismiss }: Props) {
  const { setValue, getValues, control } = useFormContext<OnboardingFormValues>();
  useFieldArray({ control, name: 'personalInfo.links' });
  const [modal, setModal] = useState<'paste' | 'upload' | null>(null);
  const [applied, setApplied] = useState(false);

  const applyParsed = (text: string) => {
    const p = parseResumeText(text);
    if (p.firstName) setValue('personalInfo.firstName', p.firstName, { shouldDirty: true });
    if (p.lastName)  setValue('personalInfo.lastName',  p.lastName,  { shouldDirty: true });
    if (p.email)     setValue('personalInfo.email',     p.email,     { shouldDirty: true });
    if (p.phone)     setValue('personalInfo.phone',     p.phone,     { shouldDirty: true });
    if (p.location)  setValue('personalInfo.location',  p.location,  { shouldDirty: true });
    if (p.professionalTitle) setValue('personalInfo.professionalTitle', p.professionalTitle, { shouldDirty: true });
    if (p.summary)   setValue('personalInfo.summary',   p.summary,   { shouldDirty: true });
    const existingLinks: { type: string; url: string }[] = getValues('personalInfo.links') ?? [];
    const newLinks = [...existingLinks];
    if (p.linkedin && !newLinks.some(l => l.type === 'linkedin')) newLinks.push({ type: 'linkedin', url: p.linkedin });
    if (p.github   && !newLinks.some(l => l.type === 'github'))   newLinks.push({ type: 'github',   url: p.github   });
    if (newLinks.length !== existingLinks.length) setValue('personalInfo.links', newLinks, { shouldDirty: true });
    setModal(null);
    setApplied(true);
    setTimeout(() => onDismiss(), 1400);
  };

  if (applied) {
    return (
      <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50 px-5 py-3.5">
        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </span>
        <p className="text-[13px] font-medium text-emerald-700">Details extracted — review and edit below.</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Card ── */}
      <div
        className="relative overflow-hidden rounded-2xl p-[1px]"
        style={{ background: 'linear-gradient(135deg,#c7d2fe 0%,#ddd6fe 50%,#bfdbfe 100%)' }}
      >
        {/* Inner surface */}
        <div
          className="relative overflow-hidden rounded-[15px] px-5 pb-5 pt-4"
          style={{ background: 'linear-gradient(145deg,#f5f3ff 0%,#eff6ff 55%,#f0fdf4 100%)' }}
        >
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30" style={{ background: 'radial-gradient(circle,#a5b4fc,transparent 70%)' }} />
          <div className="pointer-events-none absolute -bottom-6 left-1/3 h-24 w-24 rounded-full opacity-20" style={{ background: 'radial-gradient(circle,#86efac,transparent 70%)' }} />

          {/* Dismiss */}
          <button
            type="button"
            onClick={onDismiss}
            className="absolute right-3 top-3 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-white/70 hover:text-slate-600"
          >
            <FiX className="text-sm" />
          </button>

          {/* Header */}
          <div className="mb-4 pr-8">
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/>
                </svg>
              </span>
              <p className="text-[13px] font-semibold text-slate-800">How do you want to start?</p>
            </div>
            <p className="pl-7 text-[11.5px] text-slate-500">Choose an option to build your resume faster</p>
          </div>

          {/* ── Free option ── */}
          <button
            type="button"
            onClick={onDismiss}
            className="group flex w-full cursor-pointer items-center gap-4 rounded-xl bg-white/80 px-4 py-3.5 text-left backdrop-blur-sm transition-all duration-200 hover:bg-white hover:translate-y-[-1px]"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-500 group-hover:text-white">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-semibold text-indigo-700">Start from scratch</p>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700">Free</span>
              </div>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-400">Fill in your details manually</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-slate-300 group-hover:text-indigo-400">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

          {/* ── Pro divider ── */}
          <div className="flex items-center gap-2.5 py-0.5">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="white" stroke="none" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span className="text-[9px] font-bold uppercase tracking-widest text-white">Pro Features</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>

          {/* ── Pro options ── */}
          <div className="grid grid-cols-2 gap-2.5">

            {/* Paste resume */}
            <div className="group relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-sm">
              {/* PRO badge */}
              <span className="absolute right-2.5 top-2.5 z-10 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>PRO</span>
              {/* Lock overlay */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 rounded-xl bg-white/40 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 group-hover:opacity-100">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <span className="text-[10px] font-semibold text-violet-700">Coming soon</span>
              </div>
              <div className="flex flex-col gap-3 px-4 py-4 opacity-60">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-500">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-violet-700">Paste resume</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-slate-400">Paste existing content</p>
                </div>
              </div>
            </div>

            {/* Upload resume */}
            <div className="group relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-sm">
              {/* PRO badge */}
              <span className="absolute right-2.5 top-2.5 z-10 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#6366f1)' }}>PRO</span>
              {/* Lock overlay */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 rounded-xl bg-white/40 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 group-hover:opacity-100">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <span className="text-[10px] font-semibold text-violet-700">Coming soon</span>
              </div>
              <div className="flex flex-col gap-3 px-4 py-4 opacity-60">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-500">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-emerald-700">Upload resume</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-slate-400">Upload PDF or DOCX</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {modal === 'paste'  && <PasteModal  onApply={applyParsed} onClose={() => setModal(null)} />}
      {modal === 'upload' && <UploadModal onApply={applyParsed} onClose={() => setModal(null)} />}
    </>
  );
}

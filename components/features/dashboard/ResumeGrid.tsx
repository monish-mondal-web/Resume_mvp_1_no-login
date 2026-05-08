'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { ATSResult } from '@/lib/resume-builder';
import type { ResumeData, TemplateId, TemplateOptions } from '@/types/resume.types';

interface StoredResume {
  data: ResumeData;
  templateId: TemplateId;
  options: TemplateOptions;
  name: string;
}

interface Props {
  resume: StoredResume | null;
  atsResult: ATSResult | null;
  onDownload: () => void;
  downloading: boolean;
}

const A4_W = 794;

const TEMPLATES = {
  template1: dynamic(() => import('@/components/preview/templates/Template1').then(m => ({ default: m.Template1 })), { ssr: false }),
  template2: dynamic(() => import('@/components/preview/templates/Template2').then(m => ({ default: m.Template2 })), { ssr: false }),
  template3: dynamic(() => import('@/components/preview/templates/Template3').then(m => ({ default: m.Template3 })), { ssr: false }),
};

// ── Responsive thumbnail ──────────────────────────────────────────────────────

interface ThumbnailProps {
  data: ResumeData;
  templateId: TemplateId;
  options: TemplateOptions;
}

function ResumeThumbnail({ data, templateId, options }: ThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const calc = () => setScale(el.offsetWidth / A4_W);
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const TemplateComponent = TEMPLATES[templateId];

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-white">
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: A4_W,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <TemplateComponent data={data} options={options} />
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 80) return 'text-emerald-600 bg-emerald-50';
  if (score >= 60) return 'text-amber-600 bg-amber-50';
  return 'text-red-500 bg-red-50';
}

const TEMPLATE_LABEL: Record<TemplateId, string> = {
  template1: 'Classic',
  template2: 'Modern',
  template3: 'Minimal',
};
const TEMPLATE_COLOR: Record<TemplateId, { text: string; bg: string }> = {
  template1: { text: '#4f46e5', bg: '#eef2ff' },
  template2: { text: '#7c3aed', bg: '#f5f3ff' },
  template3: { text: '#0284c7', bg: '#eff6ff' },
};

// ── 3-dot menu ────────────────────────────────────────────────────────────────

function KebabMenu({ onDownload, downloading }: { onDownload: () => void; downloading: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleDelete = () => {
    setOpen(false);
    if (!confirm('Delete this resume? This cannot be undone.')) return;
    localStorage.removeItem('fr-resume-built');
    localStorage.removeItem('resumeTemplateId');
    localStorage.removeItem('resumeTemplateOptions');
    window.location.reload();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm text-slate-500 transition active:scale-95 hover:bg-white hover:text-slate-800 sm:h-7 sm:w-7 sm:opacity-0 sm:group-hover:opacity-100"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5"  r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          <Link
            href="/resume/builder"
            onClick={() => setOpen(false)}
            className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-slate-700 hover:bg-slate-50"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </Link>
          <button
            type="button"
            onClick={() => { setOpen(false); onDownload(); }}
            disabled={downloading}
            className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {downloading ? 'Exporting…' : 'Download PDF'}
          </button>
          <div className="mx-3 my-1 border-t border-slate-100" />
          <button
            type="button"
            onClick={handleDelete}
            className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-red-500 hover:bg-red-50"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ── Resume card ───────────────────────────────────────────────────────────────

function ResumeCard({ resume, atsResult, onDownload, downloading }: Props & { resume: StoredResume }) {
  const score = atsResult?.score;
  const tc    = TEMPLATE_COLOR[resume.templateId];

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-slate-300"
      style={{ aspectRatio: '3/4' }}
    >
      {/* Preview with hover overlay + 3-dot menu */}
      <div className="relative flex-1 overflow-hidden border-b border-slate-100">
        {/* Mobile: whole preview is a tap target to edit */}
        <Link href="/resume/builder" className="block h-full w-full sm:hidden">
          <ResumeThumbnail data={resume.data} templateId={resume.templateId} options={resume.options} />
        </Link>

        {/* Desktop: thumbnail + hover overlay */}
        <div className="hidden h-full w-full sm:block">
          <ResumeThumbnail data={resume.data} templateId={resume.templateId} options={resume.options} />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-900/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Link
              href="/resume/builder"
              className="pointer-events-auto flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-[12px] font-semibold text-slate-800 transition hover:bg-indigo-50 hover:text-indigo-700"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Resume
            </Link>
          </div>
        </div>

        {/* 3-dot menu — always visible on mobile, hover-only on desktop */}
        <div className="absolute right-2 top-2 z-10">
          <KebabMenu onDownload={onDownload} downloading={downloading} />
        </div>
      </div>

      {/* Info strip */}
      <div className="flex-shrink-0 px-2.5 py-2 sm:px-3 sm:py-2.5">
        <p className="truncate text-[11px] font-semibold text-slate-900 sm:text-[12px]">{resume.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1">
          <span className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold sm:px-2 sm:text-[10px]" style={{ background: tc.bg, color: tc.text }}>
            {TEMPLATE_LABEL[resume.templateId]}
          </span>
          {score !== undefined && (
            <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold sm:px-2 sm:text-[10px] ${scoreColor(score)}`}>
              ATS {score}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Create card ───────────────────────────────────────────────────────────────

function CreateCard() {
  return (
    <Link
      href="/resume/builder"
      className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-white transition-colors hover:border-indigo-300 hover:bg-indigo-50/30"
      style={{ aspectRatio: '3/4' }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-200 bg-white transition group-hover:border-indigo-300">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-[11px] font-semibold text-slate-500 group-hover:text-indigo-700 sm:text-[12px]">New Resume</p>
        <p className="mt-0.5 hidden text-[11px] text-slate-400 sm:block">Tailor for a role</p>
      </div>
    </Link>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      </div>
      <p className="text-[14px] font-semibold text-slate-700">No resumes yet</p>
      <p className="mt-1 text-[12px] text-slate-400">Create your first resume to get started.</p>
      <Link href="/resume/builder" className="mt-5 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-[12px] font-semibold text-white hover:bg-indigo-700 transition-colors">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Create Resume
      </Link>
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export function ResumeGrid({ resume, atsResult, onDownload, downloading }: Props) {
  return (
    <div>
      <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">My Resumes</p>
      {resume ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          <CreateCard />
          <ResumeCard resume={resume} atsResult={atsResult} onDownload={onDownload} downloading={downloading} />
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

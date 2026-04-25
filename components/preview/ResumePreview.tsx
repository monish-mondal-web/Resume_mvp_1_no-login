'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ResumeData, TemplateId, TemplateOptions } from '@/types/resume.types';
import { Template1 } from './templates/Template1';
import { Template2 } from './templates/Template2';
import { ATSScore } from './ATSScore';
import { TemplateCustomizer } from './TemplateCustomizer';
import { TemplateSelectPopup } from './TemplateSelectPopup';
import { computeATSScore } from '@/lib/resume-builder';
import type { ATSResult } from '@/lib/resume-builder';

// A4 at 96 dpi: 210mm × 297mm → 794 × 1123 px
const A4_W     = 794;
const A4_H     = 1123;
const ZOOM_MIN = 0.3;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function round2(v: number) { return Math.round(v * 100) / 100; }

// ── SlidePanel ────────────────────────────────────────────────────────────────
function SlidePanel({
  open, label, onClose, children,
}: { open: boolean; label: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 220ms ease' }}
      className="border-b border-slate-100 bg-white"
    >
      <div style={{ overflow: 'hidden' }}>
        <div className="flex items-center justify-between px-3 pt-2.5 pb-0.5">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
          <button
            onClick={onClose}
            className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg width="8" height="8" viewBox="0 0 10 10">
              <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Toolbar icon button ───────────────────────────────────────────────────────
function TBtn({
  onClick, active, disabled, title, children, className = '',
}: {
  onClick?: () => void; active?: boolean; disabled?: boolean;
  title?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex cursor-pointer items-center justify-center rounded-md transition
        ${active
          ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
        }
        disabled:cursor-not-allowed disabled:opacity-30 ${className}`}
    >
      {children}
    </button>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  data: ResumeData;
  templateId: TemplateId;
  templateOptions: TemplateOptions;
  activeSection?: string;
  onTemplateChange: (id: TemplateId) => void;
  onOptionsChange: (opts: TemplateOptions) => void;
  onSectionClick?: (sectionId: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export function ResumePreview({
  data, templateId, templateOptions, activeSection,
  onTemplateChange, onOptionsChange, onSectionClick,
  onUndo, onRedo, canUndo = false, canRedo = false,
}: Props) {
  const containerRef     = useRef<HTMLDivElement>(null);
  const contentRef       = useRef<HTMLDivElement>(null);
  const [zoom, setZoom]  = useState(0.72);
  const [contentH, setContentH]       = useState(A4_H);
  const [showATS, setShowATS]         = useState(false);
  const [showStyle, setShowStyle]     = useState(false);
  const [showExport, setShowExport]   = useState(false);
  const [showTplPop, setShowTplPop]   = useState(false);
  const [atsResult, setAtsResult]     = useState<ATSResult | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const exportRef    = useRef<HTMLDivElement>(null);
  const isAutoFit    = useRef(true); // false once user manually adjusts zoom

  // ATS score
  useEffect(() => { setAtsResult(computeATSScore(data)); }, [data]);

  // Observe content height for multi-page indicator
  useEffect(() => {
    if (!contentRef.current) return;
    const ro = new ResizeObserver(entries => {
      const h = entries[0]?.contentRect?.height ?? A4_H;
      setContentH(h);
    });
    ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, []);

  const doFit = useCallback(() => {
    if (!containerRef.current) return;
    const pad = 10;
    const w = containerRef.current.clientWidth  - pad;
    const h = containerRef.current.clientHeight - pad;
    if (w > 0) setZoom(clamp(round2(Math.min(w / A4_W, h / A4_H)), ZOOM_MIN, ZOOM_MAX));
  }, []);

  // Auto-fit on mount + re-fit whenever the container resizes (e.g. panel toggle/drag)
  useEffect(() => {
    if (!containerRef.current) return;
    doFit();
    const ro = new ResizeObserver(() => { if (isAutoFit.current) doFit(); });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [doFit]);

  const manualZoom = useCallback((newZoom: number) => {
    isAutoFit.current = false;
    setZoom(newZoom);
  }, []);

  // Ctrl+scroll → smooth zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      isAutoFit.current = false;
      setZoom(prev => clamp(round2(prev - e.deltaY * 0.0015), ZOOM_MIN, ZOOM_MAX));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Ctrl+=/-/0 keyboard zoom
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const cmd = e.ctrlKey || e.metaKey;
      if (!cmd) return;
      if (e.key === '=' || e.key === '+') { e.preventDefault(); manualZoom(clamp(round2(zoom + ZOOM_STEP), ZOOM_MIN, ZOOM_MAX)); }
      if (e.key === '-')                  { e.preventDefault(); manualZoom(clamp(round2(zoom - ZOOM_STEP), ZOOM_MIN, ZOOM_MAX)); }
      if (e.key === '0')                  { e.preventDefault(); fitZoom(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoom]); // eslint-disable-line react-hooks/exhaustive-deps

  // Click-outside to close export menu
  useEffect(() => {
    if (!showExport) return;
    const onDown = (e: MouseEvent) => {
      if (!exportRef.current?.contains(e.target as Node)) setShowExport(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [showExport]);

  const fitZoom = useCallback(() => {
    isAutoFit.current = true;
    doFit();
  }, [doFit]);

  const handleExport = async (type: 'pdf' | 'png' | 'jpg') => {
    setShowExport(false);
    setIsExporting(true);
    try {
      const elemId = templateId === 'template1' ? 'resume-template1' : 'resume-template2';
      const name   = `${data.personal.firstName || 'resume'}-${data.personal.lastName || ''}`.toLowerCase().replace(/\s+/g, '-').replace(/-+$/, '');
      if (type === 'pdf') {
        const { downloadAsPDF } = await import('@/lib/exportResume');
        await downloadAsPDF(elemId, `${name}.pdf`);
      } else {
        const { downloadAsImage } = await import('@/lib/exportResume');
        await downloadAsImage(elemId, type, `${name}.${type}`);
      }
    } catch (err) { console.error('Export failed:', err); }
    finally { setIsExporting(false); }
  };

  const zoomPct   = Math.round(zoom * 100);
  const scaledW   = A4_W * zoom;
  const scaledH   = contentH * zoom;
  const pageCount = Math.max(1, Math.ceil(contentH / A4_H));

  return (
    <div className="flex h-full w-full flex-col overflow-hidden" style={{ background: '#e8eaed' }}>

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div className="flex h-10 flex-shrink-0 items-center gap-0.5 border-b border-slate-200 bg-white px-2 shadow-sm">

        {/* Template picker */}
        <button
          onClick={() => setShowTplPop(true)}
          className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
          title="Change template"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
            <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
          <span>{templateId === 'template1' ? 'ATS Classic' : 'Banking Pro'}</span>
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 4l3 3 3-3" />
          </svg>
        </button>

        <div className="mx-1 h-4 w-px bg-slate-200" />

        {/* Style */}
        <TBtn onClick={() => { setShowStyle(s => !s); setShowATS(false); }} active={showStyle} title="Style" className="h-7 gap-1 px-2 text-[11px] font-medium">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          Style
        </TBtn>

        {/* ATS */}
        <TBtn onClick={() => { setShowATS(s => !s); setShowStyle(false); }} active={showATS} title="ATS Score" className="h-7 gap-1 px-2 text-[11px] font-medium">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
          </svg>
          ATS{atsResult ? ` · ${atsResult.score}` : ''}
        </TBtn>

        <div className="flex-1" />

        {/* Undo / Redo */}
        <TBtn onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)" className="h-7 w-7">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7v6h6" /><path d="M3 13A9 9 0 1 0 6 6.5" />
          </svg>
        </TBtn>
        <TBtn onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Y)" className="h-7 w-7">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 7v6h-6" /><path d="M21 13A9 9 0 1 1 18 6.5" />
          </svg>
        </TBtn>

        <div className="mx-1 h-4 w-px bg-slate-200" />

        {/* Zoom controls */}
        <TBtn onClick={() => manualZoom(clamp(round2(zoom - ZOOM_STEP), ZOOM_MIN, ZOOM_MAX))} disabled={zoom <= ZOOM_MIN} title="Zoom out" className="h-7 w-7">
          <svg width="11" height="11" viewBox="0 0 10 10"><path d="M2 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </TBtn>
        <button
          onClick={fitZoom}
          title="Fit to window (Ctrl+0)"
          className="min-w-[38px] cursor-pointer rounded px-1 py-0.5 text-center text-[10px] font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
        >
          {zoomPct}%
        </button>
        <TBtn onClick={() => manualZoom(clamp(round2(zoom + ZOOM_STEP), ZOOM_MIN, ZOOM_MAX))} disabled={zoom >= ZOOM_MAX} title="Zoom in" className="h-7 w-7">
          <svg width="11" height="11" viewBox="0 0 10 10"><path d="M5 2v6M2 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </TBtn>

        <div className="mx-1 h-4 w-px bg-slate-200" />

        {/* Export */}
        <div ref={exportRef} className="relative">
          <button
            onClick={() => setShowExport(s => !s)}
            disabled={isExporting}
            className="flex cursor-pointer items-center gap-1.5 rounded-md bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {isExporting ? (
              <svg width="10" height="10" viewBox="0 0 10 10" className="animate-spin">
                <circle cx="5" cy="5" r="3.5" stroke="white" strokeWidth="1.5" strokeDasharray="14" strokeDashoffset="4" fill="none" />
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7,10 12,15 17,10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
            Export
          </button>
          {showExport && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <div className="border-b border-slate-100 px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Download As</p>
              </div>
              {([
                { fmt: 'pdf' as const, label: 'PDF Document',  icon: '📄' },
                { fmt: 'png' as const, label: 'PNG Image',     icon: '🖼️' },
                { fmt: 'jpg' as const, label: 'JPG Image',     icon: '📷' },
              ]).map(({ fmt, label, icon }) => (
                <button
                  key={fmt}
                  onClick={() => handleExport(fmt)}
                  className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-[11px] text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <span>{icon}</span>
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Slide panels ──────────────────────────────────────────────────── */}
      <SlidePanel open={showATS} label="ATS Score" onClose={() => setShowATS(false)}>
        {atsResult && <ATSScore result={atsResult} />}
      </SlidePanel>
      <SlidePanel open={showStyle} label="Style" onClose={() => setShowStyle(false)}>
        <TemplateCustomizer options={templateOptions} onChange={onOptionsChange} />
      </SlidePanel>

      {/* ── Canvas — Google Docs style ────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto"
        style={{ background: '#e8eaed' }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100%',
            padding: '5px 5px 16px',
            boxSizing: 'border-box',
          }}
        >
          {/* Iterate over pages so gaps between pages render like Google Docs */}
          {Array.from({ length: pageCount }).map((_, pageIdx) => {
            const pageOffsetPx   = pageIdx * A4_H;
            const pageContentH   = Math.min(A4_H, contentH - pageOffsetPx);
            const scaledPageH    = pageContentH * zoom;

            return (
              <div key={pageIdx} style={{ marginBottom: pageIdx < pageCount - 1 ? 16 : 0 }}>
                {/* Page label */}
                {pageCount > 1 && (
                  <div style={{ marginBottom: 6, textAlign: 'center', fontSize: 10, color: '#9ca3af', fontWeight: 500 }}>
                    Page {pageIdx + 1} of {pageCount}
                  </div>
                )}

                {/* White page shadow — position:relative clips the content to this page */}
                <div
                  style={{
                    position: 'relative',
                    width: scaledW,
                    height: scaledPageH,
                    flexShrink: 0,
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    borderRadius: 1,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.10)',
                  }}
                >
                  {/* Resume content — only rendered on page 0; other pages scroll via translateY */}
                  {pageIdx === 0 && (
                    <div
                      id={templateId === 'template1' ? 'resume-template1' : 'resume-template2'}
                      ref={contentRef}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: A4_W,
                        transformOrigin: 'top left',
                        transform: `scale(${zoom})`,
                      }}
                    >
                      {templateId === 'template1' ? (
                        <Template1 data={data} options={templateOptions} activeSection={activeSection} onSectionClick={onSectionClick} />
                      ) : (
                        <Template2 data={data} options={templateOptions} activeSection={activeSection} onSectionClick={onSectionClick} />
                      )}
                    </div>
                  )}

                  {/* Subsequent pages: same content shifted up by pageIdx * A4_H * zoom */}
                  {pageIdx > 0 && (
                    <div
                      aria-hidden
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: A4_W,
                        transformOrigin: 'top left',
                        transform: `scale(${zoom}) translateY(-${pageIdx * A4_H}px)`,
                        pointerEvents: 'none',
                      }}
                    >
                      {templateId === 'template1' ? (
                        <Template1 data={data} options={templateOptions} activeSection={activeSection} onSectionClick={undefined} />
                      ) : (
                        <Template2 data={data} options={templateOptions} activeSection={activeSection} onSectionClick={undefined} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Template popup ────────────────────────────────────────────────── */}
      {showTplPop && (
        <TemplateSelectPopup
          current={templateId}
          accentColor={templateOptions.accentColor}
          onSelect={onTemplateChange}
          onClose={() => setShowTplPop(false)}
        />
      )}
    </div>
  );
}

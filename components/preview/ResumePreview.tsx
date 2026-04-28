'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { ResumeData, TemplateId, TemplateOptions } from '@/types/resume.types';
import { Template1 } from './templates/Template1';
import { Template2 } from './templates/Template2';
import { Template3 } from './templates/Template3';
import { TemplateCustomizer } from './TemplateCustomizer';
import { MiniTemplate1, MiniTemplate2, MiniTemplate3, TEMPLATES } from './TemplateSelectPopup';
import { ACCENT_COLORS } from '@/types/resume.types';
import {
  FiLayout, FiSliders, FiRotateCcw, FiRotateCw,
  FiPlus, FiMinus, FiDownload, FiMaximize, FiX,
  FiMaximize2, FiMinimize2,
  FiCornerUpLeft, FiCornerUpRight,
  FiEdit2, FiMaximize as FiMaximizeIcon,
} from 'react-icons/fi';

// A4 at 96 dpi: 210mm × 297mm → 794 × 1123 px
const A4_W     = 794;
const A4_H     = 1123;
const ZOOM_MIN = 0.3;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function round2(v: number) { return Math.round(v * 100) / 100; }

// ── SideDrawer (Modern Unified Panel) ────────────────────────────────────────
function SideDrawer({
  open, label, onClose, children, activeTab, onTabSwitch,
}: {
  open: boolean; label: string; onClose: () => void; children: React.ReactNode;
  activeTab: 'tpl' | 'stl';
  onTabSwitch: (tab: 'tpl' | 'stl') => void;
}) {
  return (
    <div
      className={`absolute inset-y-0 right-0 z-[120] w-[360px] flex border-l border-slate-200 bg-white transition-transform duration-300 ease-in-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Content Area (Left) */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex h-11 items-center border-b border-slate-200 px-5 bg-white">
          <span className="text-[12px] font-semibold tracking-[0.12em] text-slate-800 uppercase leading-none">{label}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-white">
          {children}
        </div>
      </div>

      {/* Control Rail (Right) */}
      <div className="w-[56px] flex-shrink-0 flex flex-col bg-white border-l border-slate-200">

        {/* Close button — aligned to h-11 header */}
        <button
          onClick={onClose}
          title="Close"
          className="flex h-11 w-full flex-shrink-0 cursor-pointer items-center justify-center border-b border-slate-200 text-slate-400 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-600 active:opacity-70"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/>
          </svg>
        </button>

        {/* Tab buttons */}
        {([
          {
            id: 'tpl',
            label: 'Layout',
            icon: (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="7" height="7" rx="1.5"/>
                <rect x="11" y="2" width="7" height="7" rx="1.5"/>
                <rect x="2" y="11" width="7" height="7" rx="1.5"/>
                <rect x="11" y="11" width="7" height="7" rx="1.5"/>
              </svg>
            ),
          },
          {
            id: 'stl',
            label: 'Style',
            icon: (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <line x1="2" y1="6"  x2="18" y2="6" />
                <circle cx="7"  cy="6"  r="2.5" fill="white" stroke="currentColor" strokeWidth="1.7"/>
                <line x1="2" y1="14" x2="18" y2="14"/>
                <circle cx="13" cy="14" r="2.5" fill="white" stroke="currentColor" strokeWidth="1.7"/>
              </svg>
            ),
          },
        ] as { id: string; label: string; icon: React.ReactNode }[]).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabSwitch(tab.id as 'tpl' | 'stl')}
              className={`group relative flex w-full cursor-pointer flex-col items-center justify-center gap-1.5 border-b border-slate-200 py-4 transition-colors duration-150 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              {/* Left accent line for active */}
              {isActive && (
                <span className="absolute inset-y-0 left-0 w-[2.5px] rounded-r-full bg-indigo-500" />
              )}
              {tab.icon}
              <span className={`text-[9px] font-semibold uppercase tracking-widest leading-none ${
                isActive ? 'text-indigo-500' : 'text-slate-400 group-hover:text-slate-500'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
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
  const exportRef        = useRef<HTMLDivElement>(null);
  const nameMeasureRef   = useRef<HTMLSpanElement>(null);
  const zoomAnchorRef    = useRef<{ mx: number, my: number, oldZoom: number, clientX: number, clientY: number } | null>(null);
  const [zoom, setZoom]  = useState(0.65);
  const [contentH, setContentH]       = useState(A4_H);
  const [nameWidth, setNameWidth]     = useState(80);
  const [activePanel, setActivePanel] = useState<'tpl' | 'stl' | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [fileName, setFileName]       = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (!fileName && data.personal?.firstName) {
      setFileName(`${data.personal.firstName}_resume`.toLowerCase());
    }
  }, [data.personal?.firstName]);

  // Update input width based on text length
  useEffect(() => {
    if (nameMeasureRef.current) {
      setNameWidth(Math.max(60, nameMeasureRef.current.offsetWidth + 8));
    }
  }, [fileName, data.personal?.firstName]);
  
  const isAutoFit    = useRef(true); 
  const zoomPct      = Math.round(zoom * 100);
  const scaledW      = A4_W * zoom;
  const pageCount    = Math.max(1, Math.ceil(contentH / A4_H));

  // Measure the hidden export container (no CSS transforms) to get the true content height.
  // The old approach watched contentRef which had height driven by contentH — a circular no-op.
  useEffect(() => {
    const el = exportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const h = entries[0]?.contentRect?.height ?? A4_H;
      setContentH(h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const doFit = useCallback((scrollToTop = false) => {
    if (!containerRef.current) return;
    const w = containerRef.current.clientWidth - 64; // 32px padding each side (md:px-8)
    if (w > 0) {
      setZoom(clamp(round2(w / A4_W), ZOOM_MIN, ZOOM_MAX));
    }
    if (scrollToTop) {
      containerRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    } else {
      containerRef.current.scrollTo({ left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    doFit(true); // fit + scroll to top on mount
    const ro = new ResizeObserver(() => { if (isAutoFit.current) doFit(); });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [doFit]);

  const manualZoom = useCallback((newZoom: number) => {
    isAutoFit.current = false;
    if (newZoom !== zoom && containerRef.current) {
      const el = containerRef.current;
      const contentEl = el.firstElementChild as HTMLElement;
      if (contentEl) {
        const containerRect = el.getBoundingClientRect();
        const contentRect = contentEl.getBoundingClientRect();
        const clientX = containerRect.left + containerRect.width / 2;
        const clientY = containerRect.top + containerRect.height / 2;
        zoomAnchorRef.current = {
          mx: clientX - contentRect.left,
          my: clientY - contentRect.top,
          oldZoom: zoom,
          clientX,
          clientY
        };
      }
    }
    setZoom(newZoom);
  }, [zoom]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      isAutoFit.current = false;
      setZoom(prev => {
        const newZoom = clamp(round2(prev - e.deltaY * 0.002), ZOOM_MIN, ZOOM_MAX);
        if (newZoom !== prev) {
          const contentEl = el.firstElementChild as HTMLElement;
          if (contentEl) {
            const contentRect = contentEl.getBoundingClientRect();
            zoomAnchorRef.current = {
              mx: e.clientX - contentRect.left,
              my: e.clientY - contentRect.top,
              oldZoom: prev,
              clientX: e.clientX,
              clientY: e.clientY
            };
          }
        }
        return newZoom;
      });
    };
    const onScroll = () => {
      if (!el) return;
      const top = el.scrollTop;
      const ph  = (A4_H * zoom) + 28; // 28px = separator label height between pages
      const idx = Math.floor((top + ph / 3) / ph);
      setCurrentPage(Math.min(pageCount, idx + 1));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('scroll', onScroll);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('scroll', onScroll);
    };
  }, [zoom, pageCount]);

  // Adjust scroll position after zoom to keep the mouse anchored
  useLayoutEffect(() => {
    if (zoomAnchorRef.current && containerRef.current) {
      const el = containerRef.current;
      const { mx, my, oldZoom, clientX, clientY } = zoomAnchorRef.current;
      const ratio = zoom / oldZoom;
      
      const newMx = mx * ratio;
      const newMy = my * ratio;
      
      const containerRect = el.getBoundingClientRect();
      el.scrollLeft = newMx - clientX + containerRect.left;
      el.scrollTop = newMy - clientY + containerRect.top;
      
      zoomAnchorRef.current = null;
    }
  }, [zoom]);

  const fitZoom = useCallback(() => {
    if (!containerRef.current) return;
    isAutoFit.current = false;
    const padH = 120; // Vertical padding for top/bottom spacing
    const padW = 64;
    const zoomH = (containerRef.current.clientHeight - padH) / A4_H;
    const zoomW = (containerRef.current.clientWidth - padW) / A4_W;
    setZoom(clamp(round2(Math.min(zoomH, zoomW)), ZOOM_MIN, ZOOM_MAX));
    containerRef.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  const fitWidth = useCallback(() => {
    if (!containerRef.current) return;
    isAutoFit.current = true;
    const pad = 64; // match padding in doFit
    const w = containerRef.current.clientWidth - pad;
    setZoom(clamp(round2(w / A4_W), ZOOM_MIN, ZOOM_MAX));
    containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
  }, []);

  const goToNextPage = () => {
    if (!containerRef.current) return;
    const nextIdx = currentPage >= pageCount ? 0 : currentPage;
    const ph = (A4_H * zoom) + 28;
    containerRef.current.scrollTo({ top: nextIdx * ph, behavior: 'smooth' });
  };

  const handleExport = async (type: 'pdf' | 'png' | 'jpg') => {
    if (!session) { setShowLoginModal(true); return; }
    setIsExporting(true);
    try {
      // Always capture the hidden export container — it renders at full 794px width
      // with no CSS transforms, giving true 288 DPI output regardless of preview zoom.
      const name = (fileName.trim() || (data.personal?.firstName ? `${data.personal.firstName}_resume` : 'resume')).toLowerCase().replace(/\s+/g, '-');
      if (type === 'pdf') {
        const { downloadAsPDF } = await import('@/lib/exportResume');
        await downloadAsPDF(data, templateId, templateOptions, `${name}.pdf`);
      }
    } catch (err) { console.error('Export failed:', err); }
    finally { setIsExporting(false); }
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-slate-50">

      {/* ── Hidden measurement container: full 794px, no transforms, drives pageCount ── */}
      <div
        aria-hidden="true"
        style={{ position: 'fixed', top: 0, left: -9999, width: A4_W, zIndex: -1, pointerEvents: 'none' }}
      >
        <div ref={exportRef}>
          {templateId === 'template3'
            ? <Template3 data={data} options={templateOptions} />
            : templateId === 'template2'
              ? <Template2 data={data} options={templateOptions} />
              : <Template1 data={data} options={templateOptions} />}
        </div>
      </div>

      {/* ── Login modal ─────────────────────────────────────────────────────── */}
      {showLoginModal && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="mx-4 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="mb-1 text-xl font-semibold text-slate-900">Sign in required</h2>
            <p className="mb-6 text-sm text-slate-500">Please sign in to download your resume.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <a
                href="/"
                className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-center text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* ── Floating Shortcut Tabs (Layout + Style only) ─────────────── */}
      {!activePanel && (
        <div className="absolute right-0 top-1/2 z-[160] -translate-y-1/2 flex flex-col overflow-hidden rounded-l-xl border border-slate-200 bg-white shadow-lg">
          {[
            { id: 'tpl', icon: FiLayout,  label: 'Layout' },
            { id: 'stl', icon: FiSliders, label: 'Style'  },
          ].map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id as any)}
              className={`group relative flex flex-col items-center justify-center gap-1 w-11 h-[52px] cursor-pointer text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 ${i < 1 ? 'border-b border-slate-100' : ''}`}
            >
              <tab.icon className="text-[15px]" />
              <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-400 group-hover:text-indigo-500">{tab.label}</span>
              <div className="absolute right-full mr-2 hidden group-hover:block pointer-events-none whitespace-nowrap">
                <div className="rounded-md bg-slate-800 px-2 py-1 text-[10px] font-semibold text-white shadow-xl">{tab.label}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Main Pane ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        <div className="relative z-40 flex h-11 items-center justify-between flex-shrink-0 border-b border-slate-200 bg-white/90 backdrop-blur-md pr-6 px-3">
          <div className="flex items-center">
            <div className="flex items-center group relative">
              <span ref={nameMeasureRef} className="absolute opacity-0 pointer-events-none text-[11px] font-semibold px-1">
                {fileName || (data.personal?.firstName ? `${data.personal.firstName}_resume` : "Untitled Resume")}
              </span>
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                style={{ width: `${nameWidth}px` }}
                className="bg-transparent text-[11px] font-semibold text-slate-700 outline-none border-b border-dotted border-slate-300 hover:border-slate-400 focus:border-indigo-400 transition-colors py-0.5"
                placeholder={data.personal?.firstName ? `${data.personal.firstName}_resume` : "Untitled Resume"}
              />
              <FiEdit2 className="text-[10px] text-slate-300 group-hover:text-slate-400 transition-colors shrink-0" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <TBtn onClick={onUndo} disabled={!canUndo} title="Undo" className="h-8 w-8 rounded-lg border border-slate-200/60 bg-white"><FiCornerUpLeft className="text-xs" /></TBtn>
            <TBtn onClick={onRedo} disabled={!canRedo} title="Redo" className="h-8 w-8 rounded-lg border border-slate-200/60 bg-white"><FiCornerUpRight className="text-xs" /></TBtn>
            <div className="mx-1 h-4 w-px bg-slate-200" />
            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-[10px] font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50 shadow-sm cursor-pointer"
            >
              {isExporting ? <svg width="10" height="10" viewBox="0 0 10 10" className="animate-spin"><circle cx="5" cy="5" r="3.5" stroke="white" strokeWidth="1.5" strokeDasharray="14" strokeDashoffset="4" fill="none" /></svg> : <FiDownload className="text-xs" />}
              Download PDF
            </button>
          </div>
        </div>

        <div ref={containerRef} className="flex-1 overflow-auto bg-[#e2e5e9] no-scrollbar">
          <div className="flex flex-col items-center py-5 pb-24 px-4 md:px-8" style={{ minWidth: 'max-content', width: '100%' }}>
            {Array.from({ length: pageCount }).map((_, pageIdx) => (
              <div key={pageIdx} className="flex flex-col items-center" style={{ width: '100%' }}>
                {/* Page separator label above page 2+ */}
                {pageIdx > 0 && (
                  <div className="flex items-center w-full px-4 py-2" style={{ maxWidth: A4_W * zoom + 48 }}>
                    <div className="flex-1 h-px bg-slate-300/60" />
                    <span className="mx-3 text-[9px] font-semibold uppercase tracking-widest text-slate-400/80">
                      Page {pageIdx + 1}
                    </span>
                    <div className="flex-1 h-px bg-slate-300/60" />
                  </div>
                )}
                {pageIdx === 0 && <div style={{ height: 0 }} />}
                {/* Page card */}
                <div
                  className="relative bg-white flex-shrink-0 overflow-hidden"
                  style={{
                    width: A4_W * zoom,
                    height: A4_H * zoom,
                    marginBottom: pageIdx < pageCount - 1 ? 0 : 0,
                    boxShadow: '0 2px 16px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.07)',
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, width: A4_W, transformOrigin: 'top left', transform: `scale(${zoom}) translateY(-${pageIdx * A4_H}px)` }}>
                    {templateId === 'template3'
                      ? <Template3 data={data} options={templateOptions} activeSection={activeSection} onSectionClick={onSectionClick} />
                      : templateId === 'template2'
                        ? <Template2 data={data} options={templateOptions} activeSection={activeSection} onSectionClick={onSectionClick} />
                        : <Template1 data={data} options={templateOptions} activeSection={activeSection} onSectionClick={onSectionClick} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 rounded-2xl bg-slate-900/90 p-1.5 text-white shadow-2xl backdrop-blur-md ring-1 ring-white/10">
          <div className="flex items-center bg-white/10 rounded-xl p-0.5">
            <button onClick={() => manualZoom(clamp(round2(zoom - ZOOM_STEP), ZOOM_MIN, ZOOM_MAX))} className="group relative cursor-pointer p-2 hover:bg-white/10 rounded-lg transition-colors">
              <FiMinus className="text-sm" />
              <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden group-hover:block pointer-events-none whitespace-nowrap">
                <div className="rounded-md bg-slate-800 px-2 py-1 text-[10px] font-semibold text-white shadow-xl ring-1 ring-white/10">Zoom Out</div>
              </div>
            </button>
            <span className="min-w-[45px] text-center text-[11px] font-medium">{zoomPct}%</span>
            <button onClick={() => manualZoom(clamp(round2(zoom + ZOOM_STEP), ZOOM_MIN, ZOOM_MAX))} className="group relative cursor-pointer p-2 hover:bg-white/10 rounded-lg transition-colors">
              <FiPlus className="text-sm" />
              <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden group-hover:block pointer-events-none whitespace-nowrap">
                <div className="rounded-md bg-slate-800 px-2 py-1 text-[10px] font-semibold text-white shadow-xl ring-1 ring-white/10">Zoom In</div>
              </div>
            </button>
          </div>
          <div className="w-px h-4 bg-white/20 mx-0.5" />
          <button onClick={fitZoom} className="group relative cursor-pointer p-2 hover:bg-white/10 rounded-lg transition-all">
            <FiMaximizeIcon className="text-sm" />
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden group-hover:block pointer-events-none whitespace-nowrap">
              <div className="rounded-md bg-slate-800 px-2 py-1 text-[10px] font-semibold text-white shadow-xl ring-1 ring-white/10">Fit Page</div>
            </div>
          </button>
          <button onClick={fitWidth} className="group relative cursor-pointer p-2 hover:bg-white/10 rounded-lg transition-all">
            <FiMaximize2 className="text-sm" />
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden group-hover:block pointer-events-none whitespace-nowrap">
              <div className="rounded-md bg-slate-800 px-2 py-1 text-[10px] font-semibold text-white shadow-xl ring-1 ring-white/10">Fit Width</div>
            </div>
          </button>
        </div>

        <div className="absolute bottom-6 right-8 z-50">
          <button onClick={goToNextPage} className="cursor-pointer rounded-full bg-white/90 px-4 py-2 text-[10px] font-semibold text-slate-600 shadow-2xl border border-slate-200/60 backdrop-blur-xl transition-all hover:border-indigo-200 hover:text-indigo-600 hover:bg-white active:scale-95 uppercase tracking-widest">
            Page {currentPage} of {pageCount}
          </button>
        </div>

        {/* ── Unified Side Drawer (Instant Swapping) ───────────────────────── */}
        <SideDrawer
          open={!!activePanel}
          label={activePanel === 'stl' ? 'Theme Settings' : 'Select Layout'}
          activeTab={activePanel || 'tpl'}
          onTabSwitch={(tab) => setActivePanel(tab)}
          onClose={() => setActivePanel(null)}
        >
          {activePanel === 'stl' && (
            <TemplateCustomizer options={templateOptions} onChange={onOptionsChange} />
          )}

          {activePanel === 'tpl' && (
            <div className="space-y-4">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Available Templates</p>
              <div className="grid grid-cols-1 gap-4">
                {TEMPLATES.map(t => {
                  const isActive = templateId === t.id;
                  const hex = ACCENT_COLORS[templateOptions.accentColor]?.hex ?? '#6366f1';
                  return (
                    <button key={t.id} onClick={() => { onTemplateChange(t.id); }} className={`cursor-pointer group relative flex flex-col overflow-hidden rounded-xl border-2 text-left transition-all hover:shadow-md ${isActive ? 'border-indigo-500 bg-indigo-50/10' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                      <div className={`p-3 transition-colors ${isActive ? 'bg-indigo-50/50' : 'bg-slate-50 group-hover:bg-slate-100/50'}`}>
                        <div className="mx-auto max-w-[140px] shadow-sm ring-1 ring-slate-900/5">
                        {t.id === 'template3' ? <MiniTemplate3 hex={hex} /> : t.id === 'template2' ? <MiniTemplate2 hex={hex} /> : <MiniTemplate1 hex={hex} />}
                      </div>
                      </div>
                      <div className="p-3 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-[12px] font-semibold ${isActive ? 'text-indigo-700' : 'text-slate-800'}`}>{t.name}</p>
                          {isActive && <div className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm"><svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">{t.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </SideDrawer>
      </div>
    </div>
  );
}

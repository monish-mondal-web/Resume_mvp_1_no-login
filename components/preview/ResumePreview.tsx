'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ResumeData, TemplateId, TemplateOptions } from '@/types/resume.types';
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  getResumePageMetrics,
  type ResumePageRenderLayout,
} from '@/lib/resumePageLayout';
import { Template1 } from './templates/Template1';
import { Template2 } from './templates/Template2';
import { Template3 } from './templates/Template3';
import { TemplateCustomizer } from './TemplateCustomizer';
import { MiniTemplate1, MiniTemplate2, MiniTemplate3, TEMPLATES } from './TemplateSelectPopup';
import { ACCENT_COLORS } from '@/types/resume.types';
import {
  FiLayout, FiSliders,
  FiPlus, FiMinus, FiDownload,
  FiMaximize2,
  FiCornerUpLeft, FiCornerUpRight,
  FiEdit2, FiMaximize as FiMaximizeIcon,
} from 'react-icons/fi';

// A4 at 96 dpi: 210mm × 297mm → 794 × 1123 px
const A4_W     = A4_WIDTH_PX;
const A4_H     = A4_HEIGHT_PX;
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
          title="Close Panel"
          className="flex h-11 w-full flex-shrink-0 cursor-pointer items-center justify-center border-b border-slate-200 text-slate-400 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-600 active:opacity-70"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
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
  onRequireAuth?: () => void;
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
  const [pageCount, setPageCount]     = useState(1);
  const pageBreaksRef = useRef<number[]>([]);
  const [nameWidth, setNameWidth]     = useState(80);
  const [activePanel, setActivePanel] = useState<'tpl' | 'stl' | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [fileName, setFileName]       = useState(() => (
    data.personal?.firstName ? `${data.personal.firstName}_resume`.toLowerCase() : ''
  ));
  const fileNameEditedRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(1);
  const touchState = useRef<{ initialDist: number; initialZoom: number } | null>(null);
  const pageMetrics = useMemo(
    () => getResumePageMetrics(templateId, templateOptions),
    [templateId, templateOptions],
  );
  const columnLayout = useMemo<ResumePageRenderLayout>(() => ({
    mode: 'columns',
    contentWidth: pageMetrics.contentWidth,
    contentHeight: pageMetrics.contentHeight,
  }), [pageMetrics.contentHeight, pageMetrics.contentWidth]);

  useEffect(() => {
    if (fileNameEditedRef.current || !data.personal?.firstName) return;

    const timeout = window.setTimeout(() => {
      setFileName(`${data.personal.firstName}_resume`.toLowerCase());
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [data.personal?.firstName]);

  // Update input width based on text length
  useEffect(() => {
    if (nameMeasureRef.current) {
      setNameWidth(Math.max(60, nameMeasureRef.current.offsetWidth + 8));
    }
  }, [fileName, data.personal?.firstName]);
  
  const isAutoFit    = useRef(true); 
  const zoomPct      = Math.round(zoom * 100);
  const measurePages = useCallback(() => {
    const flow = exportRef.current?.firstElementChild as HTMLElement | null;
    if (!flow) return pageBreaksRef.current;

    const flowRect = flow.getBoundingClientRect();
    const nextBreaks: number[] = [];
    let highestPage = 0;
    const getPageAtLeft = (left: number) => Math.max(
      0,
      Math.floor((left - flowRect.left + 0.01) / pageMetrics.contentWidth),
    );

    Array.from(flow.querySelectorAll('*')).forEach((element) => {
      Array.from(element.getClientRects()).forEach((rect) => {
        if (rect.width <= 0 || rect.height <= 0) return;
        const fragmentPage = getPageAtLeft(rect.left);
        highestPage = Math.max(highestPage, fragmentPage);
      });
    });

    let highestBlockPage = 0;
    Array.from(flow.children).forEach((child, childIndex) => {
      const rects = Array.from(child.getClientRects())
        .filter((rect) => rect.width > 0 && rect.height > 0);
      if (!rects.length) return;

      const firstRect = rects.reduce((earliest, rect) => (
        rect.left < earliest.left
        || (rect.left === earliest.left && rect.top < earliest.top)
          ? rect
          : earliest
      ));
      const childPage = getPageAtLeft(firstRect.left);
      const startsAtColumnTop = Math.abs(firstRect.top - flowRect.top) <= 2;

      if (childPage > highestBlockPage && startsAtColumnTop) {
        nextBreaks.push(childIndex);
      }
      highestBlockPage = Math.max(highestBlockPage, childPage);
    });

    const nextPageCount = highestPage + 1;
    setPageCount((current) => current === nextPageCount ? current : nextPageCount);
    pageBreaksRef.current = nextBreaks;
    return nextBreaks;
  }, [pageMetrics.contentWidth]);

  // The hidden column flow is the source of truth for page count and PDF breaks.
  useLayoutEffect(() => {
    const flow = exportRef.current?.firstElementChild as HTMLElement | null;
    if (!flow) return;

    let active = true;
    const measure = () => {
      if (active) measurePages();
    };
    const frame = window.requestAnimationFrame(measure);
    const observer = new MutationObserver(measure);
    observer.observe(flow, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });
    measure();
    void document.fonts?.ready.then(measure);
    document.fonts?.addEventListener('loadingdone', measure);

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      document.fonts?.removeEventListener('loadingdone', measure);
    };
  }, [activeSection, columnLayout, data, measurePages, templateId, templateOptions]);

  const doFit = useCallback((scrollToTop = false) => {
    if (!containerRef.current) return;
    const pad = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 64 : 32;
    const w = containerRef.current.clientWidth - pad;
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

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        touchState.current = { initialDist: dist, initialZoom: zoom };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchState.current) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        
        const scale = dist / touchState.current.initialDist;
        const newZoom = clamp(round2(touchState.current.initialZoom * scale), ZOOM_MIN, ZOOM_MAX);
        
        if (newZoom !== zoom) {
          isAutoFit.current = false;
          const centerX = (t1.clientX + t2.clientX) / 2;
          const centerY = (t1.clientY + t2.clientY) / 2;
          
          const contentEl = el.firstElementChild as HTMLElement;
          if (contentEl) {
            const contentRect = contentEl.getBoundingClientRect();
            zoomAnchorRef.current = {
              mx: centerX - contentRect.left,
              my: centerY - contentRect.top,
              oldZoom: zoom,
              clientX: centerX,
              clientY: centerY
            };
          }
          setZoom(newZoom);
        }
      }
    };

    const onTouchEnd = () => {
      touchState.current = null;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('scroll', onScroll);
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
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
    const padW = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 64 : 32;
    const zoomH = (containerRef.current.clientHeight - padH) / A4_H;
    const zoomW = (containerRef.current.clientWidth - padW) / A4_W;
    setZoom(clamp(round2(Math.min(zoomH, zoomW)), ZOOM_MIN, ZOOM_MAX));
    containerRef.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  const fitWidth = useCallback(() => {
    if (!containerRef.current) return;
    isAutoFit.current = true;
    const pad = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 64 : 32;
    const w = containerRef.current.clientWidth - pad;
    setZoom(clamp(round2(w / A4_W), ZOOM_MIN, ZOOM_MAX));
    containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
  }, []);

  const goToNextPage = () => {
    if (!containerRef.current) return;
    const visibleCurrentPage = Math.min(currentPage, pageCount);
    const nextIdx = visibleCurrentPage >= pageCount ? 0 : visibleCurrentPage;
    const ph = (A4_H * zoom) + 28;
    containerRef.current.scrollTo({ top: nextIdx * ph, behavior: 'smooth' });
  };

  const handleExport = async (type: 'pdf' | 'png' | 'jpg') => {
    setIsExporting(true);
    try {
      const name = (fileName.trim() || (data.personal?.firstName ? `${data.personal.firstName}_resume` : 'resume')).toLowerCase().replace(/\s+/g, '-');
      if (type === 'pdf') {
        await document.fonts.ready;
        const pageBreaks = measurePages();
        const { downloadAsPDF } = await import('@/lib/exportResume');
        await downloadAsPDF(data, templateId, templateOptions, `${name}.pdf`, pageBreaks);
      }
    } catch (err) { console.error('Export failed:', err); }
    finally { setIsExporting(false); }
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-slate-50">

      {/* Hidden, unscaled column flow used to measure real page fragments. */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: -9999,
          width: pageMetrics.contentWidth,
          height: pageMetrics.contentHeight,
          visibility: 'hidden',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      >
        <div ref={exportRef}>
          {templateId === 'template3'
            ? <Template3 data={data} options={templateOptions} pageLayout={columnLayout} />
            : templateId === 'template2'
              ? <Template2 data={data} options={templateOptions} pageLayout={columnLayout} />
              : <Template1 data={data} options={templateOptions} pageLayout={columnLayout} />}
        </div>
      </div>

      {/* ── Login modal removed in favor of main AuthModal ── */}
      
      {/* ── Floating Shortcut Tabs (Layout + Style only) ─────────────── */}
      {!activePanel && (
        <div className="absolute right-0 top-1/2 z-[160] -translate-y-1/2 flex flex-col overflow-hidden rounded-l-xl border border-slate-200 bg-white shadow-lg">
          {[
            { id: 'tpl', icon: FiLayout,  label: 'Layout' },
            { id: 'stl', icon: FiSliders, label: 'Style'  },
          ].map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id as 'tpl' | 'stl')}
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
        <div className="relative z-40 flex h-14 items-center justify-between flex-shrink-0 border-b border-slate-200 bg-white/90 backdrop-blur-md pr-6 px-3">
          <div className="flex items-center">
            <div className="flex items-center group relative">
              <span ref={nameMeasureRef} className="absolute opacity-0 pointer-events-none text-[11px] font-semibold px-1">
                {fileName || (data.personal?.firstName ? `${data.personal.firstName}_resume` : "Untitled Resume")}
              </span>
              <input
                value={fileName}
                onChange={(e) => {
                  fileNameEditedRef.current = true;
                  setFileName(e.target.value);
                }}
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
              className="flex cursor-pointer items-center gap-2 rounded-sm bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
            >
              {isExporting ? (
                <svg width="14" height="14" viewBox="0 0 12 12" className="animate-spin text-white">
                  <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="2" strokeDasharray="16" strokeDashoffset="4" fill="none" />
                </svg>
              ) : (
                <FiDownload className="text-sm transition-transform duration-200 group-hover:scale-110" />
              )}
              <span>{isExporting ? 'Exporting...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        <div ref={containerRef} className="flex-1 overflow-auto bg-[#e2e5e9] no-scrollbar">
          <div className="flex flex-col items-center pt-2.5 pb-24 px-4 lg:px-8" style={{ minWidth: 'max-content', width: '100%' }}>
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
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: A4_W,
                      height: A4_H,
                      transformOrigin: 'top left',
                      transform: `scale(${zoom})`,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: pageMetrics.padding.top,
                        left: pageMetrics.padding.left,
                        width: pageMetrics.contentWidth,
                        height: pageMetrics.contentHeight,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: pageMetrics.contentWidth,
                          height: pageMetrics.contentHeight,
                          transform: `translateX(-${pageIdx * pageMetrics.contentWidth}px)`,
                        }}
                      >
                        {templateId === 'template3'
                          ? <Template3 data={data} options={templateOptions} activeSection={activeSection} onSectionClick={onSectionClick} pageLayout={columnLayout} />
                          : templateId === 'template2'
                            ? <Template2 data={data} options={templateOptions} activeSection={activeSection} onSectionClick={onSectionClick} pageLayout={columnLayout} />
                            : <Template1 data={data} options={templateOptions} activeSection={activeSection} onSectionClick={onSectionClick} pageLayout={columnLayout} />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 rounded-2xl bg-slate-900/90 p-1.5 text-white shadow-2xl backdrop-blur-md ring-1 ring-white/10 max-[430px]:bottom-5 max-[430px]:-translate-x-[58%]">
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

        <div className="absolute bottom-20 right-5 z-50 sm:bottom-6 sm:right-8">
          <button onClick={goToNextPage} className="cursor-pointer rounded-full bg-white/90 px-4 py-2 text-[10px] font-semibold text-slate-600 shadow-2xl border border-slate-200/60 backdrop-blur-xl transition-all hover:border-indigo-200 hover:text-indigo-600 hover:bg-white active:scale-95 uppercase tracking-widest">
            Page {Math.min(currentPage, pageCount)} of {pageCount}
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
          {/* Both panels stay mounted so internal state (accordion open/close) is preserved */}
          <div style={{ display: activePanel === 'stl' ? 'block' : 'none' }}>
            <TemplateCustomizer options={templateOptions} onChange={onOptionsChange} />
          </div>

          <div style={{ display: activePanel === 'tpl' ? 'block' : 'none' }}>
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
          </div>
        </SideDrawer>
      </div>
    </div>
  );
}

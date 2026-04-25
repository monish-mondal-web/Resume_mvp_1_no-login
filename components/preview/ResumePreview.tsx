'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ResumeData, TemplateId, TemplateOptions } from '@/types/resume.types';
import { Template1 } from './templates/Template1';
import { Template2 } from './templates/Template2';
import { ATSScore } from './ATSScore';
import { TemplateCustomizer } from './TemplateCustomizer';
import { MiniTemplate1, MiniTemplate2, TEMPLATES } from './TemplateSelectPopup';
import { ACCENT_COLORS } from '@/types/resume.types';
import { computeATSScore } from '@/lib/resume-builder';
import type { ATSResult } from '@/lib/resume-builder';
import { 
  FiLayout, FiSliders, FiActivity, FiRotateCcw, FiRotateCw, 
  FiPlus, FiMinus, FiDownload, FiChevronDown, FiMaximize, FiX,
  FiZap, FiMaximize2, FiMinimize2, FiMonitor,
  FiCornerUpLeft, FiCornerUpRight, FiTarget, FiFileText, FiImage,
  FiEdit2, FiMaximize as FiMaximizeIcon
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
  activeTab: 'tpl' | 'stl' | 'ats';
  onTabSwitch: (tab: 'tpl' | 'stl' | 'ats') => void;
}) {
  return (
    <div
      className={`absolute inset-y-0 right-0 z-[120] w-[360px] flex border-l border-slate-200 bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-in-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Content Area (Left) */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex h-14 items-center border-b border-slate-100 px-5 bg-white">
          <span className="text-[12px] font-bold tracking-[0.12em] text-slate-800 uppercase leading-none">{label}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-white">
          {children}
        </div>
      </div>

      {/* Control Rail (Right) */}
      <div className="w-[64px] flex-shrink-0 flex flex-col items-center bg-slate-50/80 border-l border-slate-100">
        {/* Close Button Area - Height matched to Header for perfect line alignment */}
        <div className="h-14 w-full flex items-center justify-center border-b border-slate-100 bg-white">
          <button 
            onClick={onClose} 
            className="flex h-full w-full items-center justify-center text-slate-400 transition hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
            title="Close Panel"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Tabs Column - Stacked Cells */}
        <div className="flex flex-col w-full">
          {[
            { id: 'tpl', icon: FiLayout,  label: 'Layout' },
            { id: 'stl', icon: FiSliders, label: 'Style'  },
            { id: 'ats', icon: FiTarget,  label: 'ATS'    },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabSwitch(tab.id as any)}
                className={`group flex flex-col items-center justify-center gap-1.5 w-full h-[72px] border-b border-slate-100 transition-all duration-200 cursor-pointer rounded-none
                  ${isActive 
                    ? 'bg-white text-indigo-600 border-l-4 border-l-indigo-600' 
                    : 'text-slate-400 bg-transparent hover:bg-white/50 hover:text-slate-600'}`}
              >
                <tab.icon className={`text-xl transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-600'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
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
  const nameMeasureRef   = useRef<HTMLSpanElement>(null);
  const [zoom, setZoom]  = useState(0.65);
  const [contentH, setContentH]       = useState(A4_H);
  const [nameWidth, setNameWidth]     = useState(80);
  const [activePanel, setActivePanel] = useState<'tpl' | 'stl' | 'ats' | null>(null);
  const [atsResult, setAtsResult]     = useState<ATSResult | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [fileName, setFileName]       = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!fileName && data.personal.firstName) {
      setFileName(`${data.personal.firstName}_resume`.toLowerCase());
    }
  }, [data.personal.firstName]);

  // Update input width based on text length
  useEffect(() => {
    if (nameMeasureRef.current) {
      setNameWidth(Math.max(60, nameMeasureRef.current.offsetWidth + 8));
    }
  }, [fileName, data.personal.firstName]);
  
  const isAutoFit    = useRef(true); 
  const zoomPct      = Math.round(zoom * 100);
  const scaledW      = A4_W * zoom;
  const pageCount    = Math.max(1, Math.ceil(contentH / A4_H));

  useEffect(() => { setAtsResult(computeATSScore(data)); }, [data]);

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
    const pad = 12;
    const w = containerRef.current.clientWidth - pad;
    if (w > 0) {
      setZoom(clamp(round2(w / A4_W), ZOOM_MIN, ZOOM_MAX));
    }
  }, []);

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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      isAutoFit.current = false;
      setZoom(prev => clamp(round2(prev - e.deltaY * 0.002), ZOOM_MIN, ZOOM_MAX));
    };
    const onScroll = () => {
      if (!el) return;
      const top = el.scrollTop;
      const ph  = (A4_H * zoom) + 24;
      const idx = Math.floor((top + ph/3) / ph);
      setCurrentPage(Math.min(pageCount, idx + 1));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('scroll', onScroll);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('scroll', onScroll);
    };
  }, [zoom, pageCount]);

  const fitZoom = useCallback(() => {
    isAutoFit.current = true;
    doFit();
  }, [doFit]);

  const fitWidth = useCallback(() => {
    if (!containerRef.current) return;
    isAutoFit.current = false;
    const pad = 60;
    const w = containerRef.current.clientWidth - pad;
    setZoom(clamp(round2(w / A4_W), ZOOM_MIN, ZOOM_MAX));
  }, []);

  const goToNextPage = () => {
    if (!containerRef.current) return;
    const nextIdx = currentPage >= pageCount ? 0 : currentPage;
    const ph = (A4_H * zoom) + 24;
    containerRef.current.scrollTo({ top: nextIdx * ph, behavior: 'smooth' });
  };

  const handleExport = async (type: 'pdf' | 'png' | 'jpg') => {
    setIsExporting(true);
    try {
      const elemId = templateId === 'template1' ? 'resume-template1' : 'resume-template2';
      const name   = (fileName.trim() || (data.personal.firstName ? `${data.personal.firstName}_resume` : 'resume')).toLowerCase().replace(/\\s+/g, '-');
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

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-slate-50">
      
      {/* ── Floating Shortcut Tabs (Shown only when no panel is open) ───── */}
      {!activePanel && (
        <div className="absolute right-0 top-1/2 z-[160] -translate-y-1/2 flex flex-col gap-1.5 pr-2">
          {[
            { id: 'tpl', icon: FiLayout,  label: 'Layout' },
            { id: 'stl', icon: FiSliders, label: 'Style'  },
            { id: 'ats', icon: FiTarget,  label: 'ATS'    },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id as any)}
              className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white/90 backdrop-blur-sm text-slate-400 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:text-indigo-600 hover:scale-105"
            >
              <tab.icon className="text-[17px] transition-transform group-hover:scale-110" />
              <div className="absolute right-full mr-3 hidden group-hover:block pointer-events-none">
                <div className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-2xl tracking-wide uppercase">{tab.label}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ── Main Pane ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        <div className="relative z-40 flex h-11 items-center justify-between flex-shrink-0 border-b border-slate-200/60 bg-white/90 backdrop-blur-md shadow-sm pr-6 px-3">
          <div className="flex items-center">
            <div className="flex items-center group relative">
              <span ref={nameMeasureRef} className="absolute opacity-0 pointer-events-none text-[11px] font-semibold px-1">
                {fileName || (data.personal.firstName ? `${data.personal.firstName}_resume` : "Untitled Resume")}
              </span>
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                style={{ width: `${nameWidth}px` }}
                className="bg-transparent text-[11px] font-semibold text-slate-700 outline-none border-b border-dotted border-slate-300 hover:border-slate-400 focus:border-indigo-400 transition-colors py-0.5"
                placeholder={data.personal.firstName ? `${data.personal.firstName}_resume` : "Untitled Resume"}
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

        <div ref={containerRef} className="flex-1 overflow-auto bg-slate-100 p-2 scroll-smooth custom-scrollbar">
          <div className="flex flex-col items-center py-10" style={{ minWidth: A4_W * zoom }}>
            <div ref={contentRef} className="bg-white shadow-2xl relative" style={{ width: A4_W * zoom, height: contentH * zoom }}>
              {Array.from({ length: pageCount }).map((_, pageIdx) => {
                const isLast = pageIdx === pageCount - 1;
                return (
                  <div key={pageIdx} className="relative bg-white" style={{ width: A4_W * zoom, height: A4_H * zoom, marginBottom: isLast ? 0 : 24 * zoom }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: A4_W, transformOrigin: 'top left', transform: `scale(${zoom}) translateY(-${pageIdx * A4_H}px)` }}>
                      {templateId === 'template1' ? <Template1 data={data} options={templateOptions} activeSection={activeSection} onSectionClick={onSectionClick} /> : <Template2 data={data} options={templateOptions} activeSection={activeSection} onSectionClick={onSectionClick} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 rounded-2xl bg-slate-900/90 p-1.5 text-white shadow-2xl backdrop-blur-md ring-1 ring-white/10">
          <div className="flex items-center bg-white/10 rounded-xl p-0.5">
            <button onClick={() => manualZoom(clamp(round2(zoom - ZOOM_STEP), ZOOM_MIN, ZOOM_MAX))} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><FiMinus className="text-sm" /></button>
            <span className="min-w-[45px] text-center text-[11px] font-medium">{zoomPct}%</span>
            <button onClick={() => manualZoom(clamp(round2(zoom + ZOOM_STEP), ZOOM_MIN, ZOOM_MAX))} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><FiPlus className="text-sm" /></button>
          </div>
          <div className="w-px h-4 bg-white/20 mx-0.5" />
          <button onClick={fitZoom} className="p-2 hover:bg-white/10 rounded-lg transition-all"><FiMaximizeIcon className="text-sm" /></button>
          <button onClick={fitWidth} className="p-2 hover:bg-white/10 rounded-lg transition-all"><FiMaximize2 className="text-sm" /></button>
        </div>

        <div className="absolute bottom-6 right-8 z-50">
          <button onClick={goToNextPage} className="rounded-full bg-white/90 px-4 py-2 text-[10px] font-bold text-slate-600 shadow-2xl border border-slate-200/60 backdrop-blur-xl transition-all hover:border-indigo-200 hover:text-indigo-600 hover:bg-white active:scale-95 uppercase tracking-widest">
            Page {currentPage} of {pageCount}
          </button>
        </div>

        {/* ── Unified Side Drawer (Instant Swapping) ───────────────────────── */}
        <SideDrawer 
          open={!!activePanel} 
          label={
            activePanel === 'ats' ? 'ATS Analysis' : 
            activePanel === 'stl' ? 'Theme Settings' : 
            'Select Layout'
          } 
          activeTab={activePanel || 'tpl'}
          onTabSwitch={(tab) => setActivePanel(tab)}
          onClose={() => setActivePanel(null)}
        >
          {activePanel === 'ats' && atsResult && <ATSScore result={atsResult} />}
          
          {activePanel === 'stl' && (
            <TemplateCustomizer options={templateOptions} onChange={onOptionsChange} />
          )}

          {activePanel === 'tpl' && (
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Templates</p>
              <div className="grid grid-cols-1 gap-4">
                {TEMPLATES.map(t => {
                  const isActive = templateId === t.id;
                  const hex = ACCENT_COLORS[templateOptions.accentColor]?.hex ?? '#6366f1';
                  return (
                    <button key={t.id} onClick={() => { onTemplateChange(t.id); }} className={`group relative flex flex-col overflow-hidden rounded-xl border-2 text-left transition-all hover:shadow-md ${isActive ? 'border-indigo-500 bg-indigo-50/10' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                      <div className={`p-3 transition-colors ${isActive ? 'bg-indigo-50/50' : 'bg-slate-50 group-hover:bg-slate-100/50'}`}>
                        <div className="mx-auto max-w-[140px] shadow-sm ring-1 ring-slate-900/5">{t.id === 'template1' ? <MiniTemplate1 hex={hex} /> : <MiniTemplate2 hex={hex} />}</div>
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

'use client';

import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  DndContext, DragOverlay, closestCenter,
} from '@dnd-kit/core';
import { BuilderTabBar, type BuilderTab } from './BuilderTabBar';
import { SmartAssistPanel } from './SmartAssistPanel';
import { OptimizeForJobPanel } from './OptimizeForJobPanel';
import { ATSPanel } from './ATSPanel';
import { CommandPalette } from './CommandPalette';
import {
  SortableContext, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToFirstScrollableAncestor,
} from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import {
  FiArrowRight, FiCheck, FiX, FiCheckCircle, FiChevronUp,
  FiPlus, FiAlertTriangle, FiTrash2, FiLock, FiEye, FiEyeOff,
} from 'react-icons/fi';
import { MORE_SECTION_DEFS } from '../OnboardingConfig';
import type { StepConfig } from '../types';
import { Navbar } from '@/components/features/home/Navbar';

const AuthModal = dynamic(
  () => import('@/components/features/auth/AuthModal').then((m) => ({ default: m.AuthModal })),
  { loading: () => null }
);

function ResumePreviewSkeleton() {
  return (
    <div className="flex h-full w-full animate-pulse flex-col bg-slate-100">
      <div className="h-11 w-full flex-shrink-0 border-b border-slate-200 bg-white/90" />
      <div className="flex flex-1 items-start justify-center overflow-hidden p-4">
        <div className="w-full max-w-[500px] rounded-xl bg-white shadow-md">
          <div className="space-y-4 p-8">
            <div className="mx-auto h-5 w-2/5 rounded bg-slate-200" />
            <div className="mx-auto h-3 w-1/3 rounded bg-slate-200" />
            <div className="mx-auto h-3 w-1/2 rounded bg-slate-100" />
            <div className="my-4 h-px w-full bg-slate-100" />
            <div className="h-3 w-1/4 rounded bg-slate-300" />
            <div className="space-y-2 pt-1">
              <div className="h-2.5 w-full rounded bg-slate-200" />
              <div className="h-2.5 w-11/12 rounded bg-slate-200" />
              <div className="h-2.5 w-4/5 rounded bg-slate-200" />
            </div>
            <div className="h-3 w-1/4 rounded bg-slate-300 pt-2" />
            <div className="space-y-2 pt-1">
              <div className="h-2.5 w-full rounded bg-slate-200" />
              <div className="h-2.5 w-3/4 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ResumePreview = dynamic(
  () => import('@/components/preview/ResumePreview').then((m) => ({ default: m.ResumePreview })),
  { ssr: false, loading: () => <ResumePreviewSkeleton /> }
);

// ── Grip icon ─────────────────────────────────────────────────────────────────
function GripIcon() {
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" aria-hidden="true">
      <circle cx="3" cy="3"  r="1.5" /><circle cx="9" cy="3"  r="1.5" />
      <circle cx="3" cy="8"  r="1.5" /><circle cx="9" cy="8"  r="1.5" />
      <circle cx="3" cy="13" r="1.5" /><circle cx="9" cy="13" r="1.5" />
    </svg>
  );
}

// ── Sidebar breadcrumb ────────────────────────────────────────────────────────
function SidebarBreadcrumb() {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1">
        <li>
          <Link href="/" className="flex cursor-pointer items-center gap-1 rounded p-0.5 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M16 7.609c.352 0 .69.122.96.343l.111.1 6.25 6.25v.001a1.5 1.5 0 0 1 .445 1.071v7.5a.89.89 0 0 1-.891.891H9.125a.89.89 0 0 1-.89-.89v-7.5l.006-.149a1.5 1.5 0 0 1 .337-.813l.1-.11 6.25-6.25c.285-.285.67-.444 1.072-.444Zm5.984 7.876L16 9.5l-5.984 5.985v6.499h11.968z"
                fill="currentColor" stroke="currentColor" strokeWidth=".094" />
            </svg>
            Home
          </Link>
        </li>
        <li>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M6.784 15.68 11.46 4.13h1.75L8.534 15.68z" fill="#CBD5E1" />
          </svg>
        </li>
        <li>
          <span className="text-sm font-medium text-indigo-600" aria-current="page">Setup Resume</span>
        </li>
      </ol>
    </nav>
  );
}

// ── Sidebar step item (desktop) ───────────────────────────────────────────────
function SidebarStepItem({
  step, index, isActive, isDone, isMore, locked, showCheck, isLast, isDragging, onClick,
}: {
  step: StepConfig; index: number; isActive: boolean; isDone: boolean; isMore: boolean;
  locked: boolean; showCheck: boolean; isLast: boolean; isDragging: boolean; onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: step.id,
    disabled: locked,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 200ms ease',
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative" data-stepid={step.id}>
      {!isLast && (
        <div className="absolute left-[27px] top-[44px] bottom-[-16px] w-px bg-slate-200 z-0" />
      )}
      <div
        {...(!locked ? attributes : {})}
        onClick={onClick}
        className={`group relative z-10 flex w-full select-none items-center gap-2 rounded-xl px-2 py-3 transition-colors cursor-pointer ${
          isActive ? 'bg-indigo-50' : 'hover:bg-slate-50'
        }`}
      >
        <div className={`flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full text-sm transition-colors ${
          isActive ? 'bg-indigo-600 text-white' : showCheck ? 'bg-indigo-600 text-white' : 'border-2 border-slate-200 bg-white text-slate-500'
        }`}>
          {showCheck
            ? <FiCheck className="text-xs" />
            : isMore
              ? <FiPlus className="text-sm" />
              : isActive
                ? step.icon
                : <span className="text-[11px] font-semibold">{index + 1}</span>}
        </div>
        <div className="flex-1">
          <p className={`text-[13px] leading-tight ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>{step.title}</p>
          <p className={`text-[11px] ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>{step.subtitle}</p>
        </div>
        <span
          {...(!locked ? listeners : {})}
          className={`shrink-0 touch-none p-1 text-slate-300 transition-opacity ${
            locked ? 'invisible' : 'cursor-grab active:cursor-grabbing md:opacity-0 md:group-hover:opacity-100'
          }`}
        >
          <GripIcon />
        </span>
      </div>
    </div>
  );
}

// ── Drawer step item (mobile) ─────────────────────────────────────────────────
function DrawerStepItem({
  step, index, isActive, isMore, locked, showCheck, isDragging, onClick,
}: {
  step: StepConfig; index: number; isActive: boolean; isDone: boolean; isMore: boolean;
  locked: boolean; showCheck: boolean; isDragging: boolean; onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: step.id,
    disabled: locked,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : (transition ?? 'transform 200ms ease'),
    zIndex: isDragging ? 50 : undefined,
    boxShadow: isDragging ? '0 6px 20px rgba(99,102,241,0.22)' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!locked ? attributes : {})}
      onClick={onClick}
      className={`group flex select-none items-center gap-2 rounded-xl px-2 transition-colors cursor-pointer ${
        isDragging ? 'bg-white ring-2 ring-indigo-400/50' : isActive ? 'bg-indigo-50' : 'hover:bg-slate-50'
      }`}
    >
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
        isActive ? 'bg-indigo-600 text-white' : showCheck ? 'bg-indigo-600 text-white' : 'border-2 border-slate-200 bg-white text-slate-400'
      }`}>
        {showCheck ? <FiCheck className="text-[10px]" /> : isMore ? <FiPlus className="text-xs" /> : index + 1}
      </div>
      <div className="flex-1 min-w-0 py-2.5">
        <p className={`text-[13px] font-medium leading-tight truncate ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>{step.title}</p>
        <p className="text-[11px] text-slate-400 truncate">{step.subtitle}</p>
      </div>
      {isActive && <div className="h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />}
      <span
        {...(!locked ? listeners : {})}
        className={`shrink-0 touch-none py-3 pr-1 text-slate-300 transition-opacity ${
          locked ? 'invisible' : 'cursor-grab active:cursor-grabbing md:opacity-0 md:group-hover:opacity-100'
        }`}
      >
        <GripIcon />
      </span>
    </div>
  );
}

// ── Confirm modal ─────────────────────────────────────────────────────────────
export function ConfirmModal({
  title, message, confirmLabel = 'Yes, confirm', onConfirm, onClose,
}: {
  title: string; message: string; confirmLabel?: string; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div className="w-full max-w-[420px]" onClick={(e) => e.stopPropagation()}>
        <div className="relative rounded-2xl bg-white p-8 shadow-[0_32px_80px_rgba(15,23,42,0.22)] ring-1 ring-slate-100">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <FiX className="text-base" />
          </button>
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <FiAlertTriangle className="text-2xl text-red-500" />
          </div>
          <div className="mb-7 text-center">
            <h3 className="mb-2.5 text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-sm leading-relaxed text-slate-500">{message}</p>
          </div>
          <div className="mb-5 border-t border-slate-100" />
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 active:scale-[0.98]"
            >
              <FiTrash2 className="text-sm" />
              {confirmLabel}
            </button>
          </div>
        </div>
        <p className="mt-3.5 flex items-center justify-center gap-1.5 text-[12px] text-slate-200">
          <FiLock className="text-[11px]" />
          This action cannot be undone.
        </p>
      </div>
    </div>
  );
}

// ── Main layout ───────────────────────────────────────────────────────────────
export interface OnboardingLayoutProps {
  children: React.ReactNode;
  session: any;
  isMounted: boolean;
  allSteps: StepConfig[];
  activeStep: string;
  currentIndex: number;
  currentStep: StepConfig;
  completedCount: number;
  totalCount: number;
  progressPct: number;
  isLastStep: boolean;
  isLoading: boolean;
  stepsDrawerOpen: boolean;
  setStepsDrawerOpen: (v: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (v: boolean) => void;
  handleReset: () => void;
  handleComplete: () => void;
  handleContinue: () => void;
  showPreview: boolean;
  setShowPreview: (fn: ((p: boolean) => boolean) | boolean) => void;
  activeDragId: string | null;
  handleDragStart: (e: any) => void;
  handleDragEnd: (e: any) => void;
  sensors: any;
  visitedSteps: Set<string>;
  isStepComplete: (id: string) => boolean;
  selectedMoreIds: string[];
  toggleMoreSection: (id: string) => void;
  stepNavRef: React.RefObject<HTMLDivElement | null>;
  debouncedResumeData: any;
  previewTemplate: any;
  setPreviewTemplate: (t: any) => void;
  templateOptions: any;
  setTemplateOptions: (opts: any) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  setActiveStep: (id: string) => void;
  confirmModal: { open: boolean; title: string; message: string; confirmLabel?: string; onConfirm: () => void } | null;
  setConfirmModal: (v: any) => void;
}

export function OnboardingLayout({
  children,
  session,
  isMounted,
  allSteps,
  activeStep,
  currentIndex,
  currentStep,
  completedCount,
  totalCount,
  progressPct,
  isLastStep,
  isLoading,
  stepsDrawerOpen,
  setStepsDrawerOpen,
  isAuthModalOpen,
  setIsAuthModalOpen,
  handleReset,
  handleComplete,
  handleContinue,
  showPreview,
  setShowPreview,
  activeDragId,
  handleDragStart,
  handleDragEnd,
  sensors,
  visitedSteps,
  isStepComplete,
  selectedMoreIds,
  toggleMoreSection,
  stepNavRef,
  debouncedResumeData,
  previewTemplate,
  setPreviewTemplate,
  templateOptions,
  setTemplateOptions,
  canUndo,
  canRedo,
  undo,
  redo,
  setActiveStep,
  confirmModal,
  setConfirmModal,
}: OnboardingLayoutProps) {
  const [activeTab, setActiveTab] = useState<BuilderTab>('edit');
  const [cmdOpen, setCmdOpen]     = useState(false);

  // Save latest resume snapshot so /resume/resume-score can read it
  useEffect(() => {
    if (!debouncedResumeData) return;
    try { localStorage.setItem('fr-resume-built', JSON.stringify(debouncedResumeData)); } catch {}
  }, [debouncedResumeData]);

  // Global Ctrl+K shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(v => !v);
      }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const sortableStepIds = allSteps.filter((s) => s.id !== 'more').map((s) => s.id);
  const sidebarNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sidebarNavRef.current) return;
    const el = sidebarNavRef.current.querySelector<HTMLElement>(`[data-stepid="${activeStep}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeStep]);

  return (
    <section className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <Navbar onLoginClick={() => setIsAuthModalOpen(true)} authButtonText="Login / Sign up" />

      <div className="flex flex-1 overflow-hidden pt-[56px]">
        {!isMounted ? (
          <div className="flex w-full h-full items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              <p className="text-sm font-medium text-slate-500 animate-pulse">Loading draft...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile steps drawer backdrop */}
            {stepsDrawerOpen && (
              <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setStepsDrawerOpen(false)} />
            )}

            {/* Mobile steps drawer */}
            <div
              className={`fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-2xl bg-white shadow-2xl md:hidden transition-transform duration-300 ${
                stepsDrawerOpen ? 'translate-y-0' : 'translate-y-full'
              }`}
              style={{ maxHeight: '80dvh' }}
            >
              <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">Navigation</p>
                  <p className="text-sm font-medium text-slate-800">Build Steps</p>
                </div>
                <button
                  onClick={() => setStepsDrawerOpen(false)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                >
                  <FiX className="text-sm" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-3">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">Steps</p>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
                >
                  <SortableContext items={sortableStepIds} strategy={verticalListSortingStrategy}>
                    <nav className="space-y-1 mb-5">
                      {allSteps.map((step, index) => {
                        const isActive = activeStep === step.id;
                        const isDone   = isStepComplete(step.id) && visitedSteps.has(step.id);
                        const isMore   = step.id === 'more';
                        const locked   = step.id === 'personal' || isMore;
                        return (
                          <DrawerStepItem
                            key={step.id}
                            step={step}
                            index={index}
                            isActive={isActive}
                            isDone={isDone}
                            isMore={isMore}
                            locked={locked}
                            showCheck={isDone && !isActive && !isMore}
                            isDragging={activeDragId === step.id}
                            onClick={() => { setActiveStep(step.id); setStepsDrawerOpen(false); }}
                          />
                        );
                      })}
                    </nav>
                  </SortableContext>
                </DndContext>

                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">Add Sections</p>
                {(['EXPERIENCE', 'SKILLS', 'ACADEMIC', 'OTHERS'] as const).map((group) => {
                  const items = MORE_SECTION_DEFS.filter((s) => s.group === group);
                  return (
                    <div key={group} className="mb-4">
                      <p className="mb-1.5 px-1 text-[9px] font-medium uppercase tracking-widest text-slate-300">{group}</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {items.map((item) => {
                          const sel = selectedMoreIds.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleMoreSection(item.id)}
                              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
                                sel ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                              }`}
                            >
                              <span className={`flex-shrink-0 text-sm ${sel ? 'text-indigo-500' : 'text-slate-400'}`}>{item.icon}</span>
                              <div className="min-w-0 flex-1">
                                <p className={`truncate text-[11px] font-medium leading-tight ${sel ? 'text-indigo-700' : 'text-slate-700'}`}>{item.title}</p>
                              </div>
                              <div className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                                sel ? 'border-indigo-500 bg-indigo-600' : 'border-slate-300 bg-white'
                              }`}>
                                {sel && <FiCheck className="text-[8px] text-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile unified bottom bar */}
            <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white md:hidden">
              <div className="px-4 pt-3 pb-2">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-semibold text-white">
                      {currentStep.id === 'more' ? '+' : currentIndex + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-tight text-slate-900">{currentStep.title}</p>
                      <p className="text-[11px] text-slate-400">Step {currentIndex + 1} of {allSteps.length}</p>
                    </div>
                    <button
                      onClick={() => setStepsDrawerOpen(true)}
                      className="flex h-7 w-7 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 active:bg-indigo-100"
                    >
                      <FiChevronUp className="text-sm" />
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400">{completedCount}/{totalCount} done</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-indigo-600 transition-all duration-500" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between px-4 pb-4 pt-2">
                <button onClick={handleReset} className="cursor-pointer text-xs text-slate-400 underline underline-offset-2 transition hover:text-slate-600">Reset</button>
                {isLastStep ? (
                  <button
                    onClick={handleComplete}
                    disabled={isLoading}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Complete'} {!isLoading && <FiCheckCircle className="text-sm" />}
                  </button>
                ) : (
                  <button
                    onClick={handleContinue}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Continue <FiArrowRight className="text-xs" />
                  </button>
                )}
              </div>
            </div>

            {/* Main layout wrapper */}
            <div className="flex flex-1 overflow-hidden relative">

              {/* Desktop sidebar */}
              <aside className="hidden md:flex w-[20%] min-w-[260px] max-w-[300px] flex-shrink-0 flex-col border-r border-slate-200 bg-white">
                <div className="flex h-11 flex-shrink-0 items-center border-b border-slate-200 px-5">
                  <SidebarBreadcrumb />
                </div>
                <div ref={sidebarNavRef} className="flex-1 overflow-y-auto px-4 py-5">
                  <p className="mb-4 px-2 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">Build Steps</p>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
                  >
                    <SortableContext items={sortableStepIds} strategy={verticalListSortingStrategy}>
                      <nav>
                        {allSteps.map((step, index) => {
                          const isActive   = activeStep === step.id;
                          const isDone     = isStepComplete(step.id);
                          const isMore     = step.id === 'more';
                          const locked     = step.id === 'personal' || isMore;
                          const showCheck  = isDone && visitedSteps.has(step.id) && !isActive && !isMore;
                          return (
                            <SidebarStepItem
                              key={step.id}
                              step={step}
                              index={index}
                              isActive={isActive}
                              isDone={isDone}
                              isMore={isMore}
                              locked={locked}
                              showCheck={showCheck}
                              isLast={index === allSteps.length - 1}
                              isDragging={activeDragId === step.id}
                              onClick={() => setActiveStep(step.id)}
                            />
                          );
                        })}
                      </nav>
                    </SortableContext>
                    <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
                      {activeDragId ? (() => {
                        const step = allSteps.find((s) => s.id === activeDragId);
                        if (!step) return null;
                        const isDone = isStepComplete(step.id);
                        const showCheck = isDone && visitedSteps.has(step.id);
                        return (
                          <div className="flex items-center gap-2 rounded-xl bg-white px-2 py-3 shadow-[0_8px_32px_rgba(99,102,241,0.18)] ring-2 ring-indigo-400/40">
                            <div className={`flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full text-sm ${
                              showCheck ? 'bg-indigo-600 text-white' : 'border-2 border-indigo-300 bg-indigo-50 text-indigo-600'
                            }`}>
                              {showCheck ? <FiCheck className="text-xs" /> : step.icon}
                            </div>
                            <div className="flex-1">
                              <p className="text-[13px] font-semibold text-slate-900">{step.title}</p>
                              <p className="text-[11px] text-slate-400">{step.subtitle}</p>
                            </div>
                            <span className="cursor-grabbing p-1 text-slate-400"><GripIcon /></span>
                          </div>
                        );
                      })() : null}
                    </DragOverlay>
                  </DndContext>
                </div>
                <div className="flex h-[72px] flex-col justify-center border-t border-slate-200 px-5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-500">Progress</span>
                    <span className="text-[10px] font-bold text-slate-600">{completedCount}/{totalCount}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-indigo-600 transition-all duration-500" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>
              </aside>

              {/* Form section */}
              <main className="flex flex-1 flex-col overflow-hidden bg-slate-50 transition-all duration-500 ease-in-out">

                {/* ── Builder tab bar ────────────────────────────────────── */}
                <BuilderTabBar activeTab={activeTab} onTabChange={setActiveTab} />

                {/* ── Tab panels (all rendered, only active is visible) ── */}
                <div className="relative flex-1 overflow-hidden">

                  {/* ── EDIT tab ──────────────────────────────────────── */}
                  <div
                    className="absolute inset-0 flex flex-col"
                    style={{
                      opacity:        activeTab === 'edit' ? 1 : 0,
                      transform:      activeTab === 'edit' ? 'translateY(0)' : 'translateY(10px)',
                      pointerEvents:  activeTab === 'edit' ? 'auto' : 'none',
                      transition:     'opacity 260ms ease, transform 260ms ease',
                      zIndex:         activeTab === 'edit' ? 10 : 0,
                    }}
                  >
                    {/* Mobile horizontal step navigator */}
                    <div ref={stepNavRef} className="md:hidden overflow-x-auto border-b border-slate-100 bg-white scrollbar-none flex-shrink-0">
                      <div className="flex items-center gap-0.5 px-3 py-2 min-w-max">
                        {allSteps.map((step, index) => {
                          const isActive = activeStep === step.id;
                          const isDone   = isStepComplete(step.id) && visitedSteps.has(step.id) && !isActive;
                          const isMore   = step.id === 'more';
                          return (
                            <button
                              key={step.id}
                              type="button"
                              data-step={step.id}
                              onClick={() => setActiveStep(step.id)}
                              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors whitespace-nowrap ${
                                isActive ? 'bg-indigo-50' : 'hover:bg-slate-50'
                              }`}
                            >
                              <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-colors ${
                                isActive ? 'bg-indigo-600 text-white' : isDone ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-400'
                              }`}>
                                {isDone ? <FiCheck className="text-[8px]" /> : isMore ? <FiPlus className="text-[9px]" /> : index + 1}
                              </span>
                              <span className={`text-[11px] font-medium ${isActive ? 'text-indigo-700' : 'text-slate-500'}`}>{step.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Scrollable form content */}
                    <div className="flex-1 overflow-y-auto pb-[8.5rem] md:pb-0">
                      <div className="px-5 pb-8 pt-8 sm:px-8 md:px-10 md:pb-10 md:pt-12">
                        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-indigo-600">
                          Step {currentIndex + 1} / {allSteps.length}
                        </p>
                        <h1 className="text-2xl font-bold text-slate-900 sm:text-[26px]">{currentStep.title}</h1>
                        <p className="mt-1 text-sm text-slate-500">{currentStep.subtitle}</p>
                        <div className="mt-7">
                          {children}
                        </div>
                      </div>
                    </div>

                    {/* Desktop action bar */}
                    <div className="hidden h-[72px] border-t border-slate-200 bg-white px-5 md:flex md:items-center sm:px-8 md:px-10">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button onClick={handleReset} className="cursor-pointer text-sm text-slate-400 transition hover:text-slate-600 px-1">Reset</button>
                          <div className="h-4 w-px bg-slate-200" />
                          <button
                            onClick={() => setShowPreview((p: boolean) => !p)}
                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            {showPreview ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                            <span className="font-medium">{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
                          </button>
                          <button
                            onClick={() => setCmdOpen(true)}
                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                            title="Open command palette (Ctrl+K)"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                            <span className="font-medium">Commands</span>
                            <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">⌃K</kbd>
                          </button>
                        </div>
                        {isLastStep ? (
                          <button
                            onClick={handleComplete}
                            disabled={isLoading}
                            className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-7 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
                          >
                            {isLoading ? 'Saving...' : 'Complete Setup'} {!isLoading && <FiCheckCircle className="text-sm" />}
                          </button>
                        ) : (
                          <button
                            onClick={handleContinue}
                            className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-7 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                          >
                            Continue <FiArrowRight className="text-xs" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── ATS SCORE tab ────────────────────────────────── */}
                  <div
                    className="absolute inset-0"
                    style={{
                      opacity:       activeTab === 'ats-score' ? 1 : 0,
                      transform:     activeTab === 'ats-score' ? 'translateY(0)' : 'translateY(10px)',
                      pointerEvents: activeTab === 'ats-score' ? 'auto' : 'none',
                      transition:    'opacity 260ms ease, transform 260ms ease',
                      zIndex:        activeTab === 'ats-score' ? 10 : 0,
                    }}
                  >
                    {debouncedResumeData
                      ? <ATSPanel data={debouncedResumeData} />
                      : (
                        <div className="flex h-full items-center justify-center">
                          <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                        </div>
                      )
                    }
                  </div>

                  {/* ── SMART ASSIST tab ─────────────────────────────── */}
                  <div
                    className="absolute inset-0"
                    style={{
                      opacity:        activeTab === 'smart-assist' ? 1 : 0,
                      transform:      activeTab === 'smart-assist' ? 'translateY(0)' : 'translateY(10px)',
                      pointerEvents:  activeTab === 'smart-assist' ? 'auto' : 'none',
                      transition:     'opacity 260ms ease, transform 260ms ease',
                      zIndex:         activeTab === 'smart-assist' ? 10 : 0,
                    }}
                  >
                    <SmartAssistPanel />
                  </div>

                  {/* ── OPTIMIZE FOR JOB tab ─────────────────────────── */}
                  <div
                    className="absolute inset-0"
                    style={{
                      opacity:        activeTab === 'optimize' ? 1 : 0,
                      transform:      activeTab === 'optimize' ? 'translateY(0)' : 'translateY(10px)',
                      pointerEvents:  activeTab === 'optimize' ? 'auto' : 'none',
                      transition:     'opacity 260ms ease, transform 260ms ease',
                      zIndex:         activeTab === 'optimize' ? 10 : 0,
                    }}
                  >
                    <OptimizeForJobPanel />
                  </div>

                </div>
              </main>

              {/* Resume preview panel */}
              <div
                className="hidden md:block overflow-hidden flex-shrink-0 border-l border-slate-200 bg-[#e8eaed] transition-all duration-500 ease-in-out"
                style={{
                  width: showPreview ? '35%' : '0%',
                  opacity: showPreview ? 1 : 0,
                  visibility: showPreview ? 'visible' : 'hidden',
                }}
              >
                <div
                  className="h-full transition-transform duration-500 ease-in-out"
                  style={{
                    transform: showPreview ? 'translateX(0)' : 'translateX(100%)',
                    width: '100%',
                    minWidth: '500px',
                  }}
                >
                  <ResumePreview
                    data={debouncedResumeData}
                    templateId={previewTemplate}
                    templateOptions={templateOptions}
                    onTemplateChange={setPreviewTemplate}
                    onOptionsChange={(opts: any) => {
                      setTemplateOptions(opts);
                      localStorage.setItem('resumeTemplateOptions', JSON.stringify(opts));
                    }}
                    activeSection={activeStep}
                    onSectionClick={(id: string) => setActiveStep(id)}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    onUndo={undo}
                    onRedo={redo}
                  />
                </div>
              </div>

            </div>
          </>
        )}
      </div>

      {/* Confirm modal */}
      {confirmModal?.open && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel={confirmModal.confirmLabel}
          onConfirm={confirmModal.onConfirm}
          onClose={() => setConfirmModal(null)}
        />
      )}

      {/* Auth modal */}
      {isAuthModalOpen && (
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      )}

      {/* Command palette */}
      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onTabChange={setActiveTab}
        onTogglePreview={() => setShowPreview((p: boolean) => !p)}
        onExportPdf={() => {}}
      />
    </section>
  );
}

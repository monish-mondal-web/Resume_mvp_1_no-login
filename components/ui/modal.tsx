'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  'aria-label'?: string;
}

const ANIMATION_STYLES = `
  @keyframes fr-modal-in {
    from { opacity: 0; transform: scale(0.97) translateY(6px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);   }
  }
  @keyframes fr-backdrop-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .fr-modal-animate   { animation: fr-modal-in    220ms cubic-bezier(0.16,1,0.3,1) forwards; }
  .fr-backdrop-animate { animation: fr-backdrop-in 180ms ease forwards; }
`;

export function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = '1000px',
  'aria-label': ariaLabel = 'Dialog',
}: ModalProps) {
  const overlayRef  = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;
    const el = contentRef.current;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    first?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus(); }
      }
    };
    el.addEventListener('keydown', trap);
    return () => el.removeEventListener('keydown', trap);
  }, [isOpen]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  }, [onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <>
      <style>{ANIMATION_STYLES}</style>
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className="fr-backdrop-animate fixed inset-0 z-[9990] flex items-center justify-center bg-slate-950/40 p-4 sm:p-6"
        aria-modal="true"
        role="dialog"
        aria-label={ariaLabel}
      >
        <div
          ref={contentRef}
          className="fr-modal-animate w-full overflow-hidden rounded-2xl border border-gray-200 bg-white"
          style={{ maxWidth }}
        >
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}

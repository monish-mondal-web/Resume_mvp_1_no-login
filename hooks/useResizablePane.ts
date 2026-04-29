'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY  = 'resume-pane-width';
const MIN_LEFT     = 560;
const MIN_RIGHT    = 380;
const SNAP_POINTS  = [580, 620, 680, 740];
const SNAP_THRESH  = 18; // px within which we snap

function snapToNearest(value: number): number | null {
  for (const pt of SNAP_POINTS) {
    if (Math.abs(value - pt) <= SNAP_THRESH) return pt;
  }
  return null;
}

export function useResizablePane(totalWidth: number) {
  const defaultWidth = Math.min(660, Math.max(MIN_LEFT, totalWidth * 0.52));

  const [leftWidth, setLeftWidth] = useState<number>(() => {
    if (typeof window === 'undefined') return 660;
    const saved = localStorage.getItem(STORAGE_KEY);
    const n = saved ? Number(saved) : defaultWidth;
    return isNaN(n) ? defaultWidth : Math.max(MIN_LEFT, n);
  });

  const dragging  = useRef(false);
  const startX    = useRef(0);
  const startW    = useRef(0);
  const rafId     = useRef<number>(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    startX.current   = e.clientX;
    startW.current   = leftWidth;
    document.body.style.userSelect  = 'none';
    document.body.style.cursor      = 'col-resize';
  }, [leftWidth]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const delta = e.clientX - startX.current;
        const raw   = startW.current + delta;
        const clamped = Math.max(MIN_LEFT, Math.min(totalWidth - MIN_RIGHT, raw));
        setLeftWidth(clamped);
      });
    };

    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.userSelect = '';
      document.body.style.cursor     = '';
      cancelAnimationFrame(rafId.current);

      setLeftWidth(prev => {
        // Magnetic snap on release
        const snapped = snapToNearest(prev) ?? prev;
        const final   = Math.max(MIN_LEFT, Math.min(totalWidth - MIN_RIGHT, snapped));
        localStorage.setItem(STORAGE_KEY, String(final));
        return final;
      });
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(rafId.current);
    };
  }, [totalWidth]);

  // Clamp when window resizes
  useEffect(() => {
    const maxW = totalWidth - MIN_RIGHT;
    if (leftWidth <= maxW) return;

    const timeout = window.setTimeout(() => {
      setLeftWidth(Math.max(MIN_LEFT, maxW));
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [totalWidth, leftWidth]);

  return { leftWidth, onDividerMouseDown: onMouseDown };
}

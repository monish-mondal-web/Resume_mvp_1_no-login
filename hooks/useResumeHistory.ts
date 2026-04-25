'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const DEBOUNCE_MS = 600;
const MAX_HISTORY = 60;

export function useResumeHistory<T>(current: T, onRestore: (snapshot: T) => void) {
  const [history, setHistory]   = useState<T[]>([]);
  const [future, setFuture]     = useState<T[]>([]);
  const isRestoringRef          = useRef(false);
  const debounceRef             = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSnapshotRef         = useRef<string>('');

  useEffect(() => {
    if (isRestoringRef.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const serialized = JSON.stringify(current);
      if (serialized === lastSnapshotRef.current) return;
      lastSnapshotRef.current = serialized;

      setHistory(prev => {
        const next = [...prev, current];
        return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next;
      });
      setFuture([]);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [current]);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.length < 2) return prev;
      const next    = prev.slice(0, -1);
      const snapshot = next[next.length - 1];
      isRestoringRef.current = true;
      setFuture(f => [current, ...f]);
      onRestore(snapshot);
      setTimeout(() => { isRestoringRef.current = false; }, 50);
      return next;
    });
  }, [current, onRestore]);

  const redo = useCallback(() => {
    setFuture(prev => {
      if (!prev.length) return prev;
      const [snapshot, ...rest] = prev;
      isRestoringRef.current = true;
      setHistory(h => [...h, snapshot]);
      onRestore(snapshot);
      setTimeout(() => { isRestoringRef.current = false; }, 50);
      return rest;
    });
  }, [onRestore]);

  return {
    canUndo: history.length >= 2,
    canRedo: future.length > 0,
    undo,
    redo,
  };
}

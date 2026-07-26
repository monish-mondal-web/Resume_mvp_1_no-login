'use client';

import React, { useState } from 'react';
import { FiLink, FiLock, FiAlertCircle } from 'react-icons/fi';

export function OptimizeForJobPanel() {
  const [url, setUrl] = useState('');

  return (
    <div className="flex h-full flex-col items-center justify-center p-6 bg-slate-50/50">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <FiLink className="text-lg" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Optimize Resume for Job</h3>
            <p className="text-xs text-slate-500">Paste job post link to analyze ATS keywords</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Job Post Link / URL
            </label>
            <div className="relative flex items-center">
              <FiLink className="absolute left-3.5 text-slate-400 text-sm" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onPaste={(e) => e.preventDefault()}
                placeholder="Paste job post link here..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 py-2.5 text-xs text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400 flex items-center gap-1">
              <FiAlertCircle className="text-xs" /> Pasting is disabled during pre-release
            </p>
          </div>

          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-400 shadow-sm border border-slate-200/80"
          >
            <FiLock className="text-xs" />
            <span>Coming Soon</span>
          </button>
        </div>
      </div>
    </div>
  );
}

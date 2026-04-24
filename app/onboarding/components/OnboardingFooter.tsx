'use client';

import React from 'react';

export function OnboardingFooter() {
  return (
    <footer className="mt-12 border-t border-slate-100 py-6 text-center">
      <p className="text-xs text-slate-400">
        All information is secured with industry-standard encryption. 
        You can update these details later in your settings.
      </p>
      <div className="mt-4 flex items-center justify-center gap-6 text-[10px] font-medium tracking-wide text-slate-400 uppercase">
        <span>Privacy Policy</span>
        <span className="h-3 w-[1px] bg-slate-200"></span>
        <span>Terms of Service</span>
        <span className="h-3 w-[1px] bg-slate-200"></span>
        <span>Support Center</span>
      </div>
    </footer>
  );
}

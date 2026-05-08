'use client';

import { signOut } from 'next-auth/react';
import { FaCrown, FaDiscord } from 'react-icons/fa';
import { FiLogOut, FiSettings, FiUser } from 'react-icons/fi';
import { usePricingModal } from '@/hooks/usePricingModal';
import { FREE_QUOTAS } from '@/lib/quota-config';
import type { QuotaItem } from '@/lib/quota-config';

type AccountMenuProps = {
  userInitial: string;
  userName: string;
  onClose: () => void;
};

export function AccountMenu({
  userInitial,
  userName,
  onClose,
}: AccountMenuProps) {
  const { openModal } = usePricingModal();

  return (
    <div
      role="menu"
      className="absolute right-0 mt-3 w-64 origin-top-right overflow-hidden rounded-2xl border border-gray-200 bg-white py-1 text-gray-800 shadow-[0_10px_50px_-12px_rgba(0,0,0,0.25)]"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-base font-semibold uppercase text-indigo-600">
          {userInitial}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-wide text-gray-900">
            {userName}
          </span>
          <span className="mt-0.5 text-xs font-medium text-gray-500">
            Resume Builder
          </span>
        </div>
      </div>

      {/* Per-feature quota */}
      <div className="px-4 pt-1 pb-2">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">Credits · Free Plan</p>
        <div className="space-y-2">
          {FREE_QUOTAS.map((q: QuotaItem) => {
            const isUnlimited = q.limit === null;
            const pct = isUnlimited ? 100 : q.limit! > 0 ? Math.round((q.used / q.limit!) * 100) : 0;
            const exhausted = !isUnlimited && q.used >= (q.limit ?? 0);
            return (
              <div key={q.id}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] text-gray-600">{q.label}</span>
                  <span className={`text-[10px] font-semibold tabular-nums ${
                    exhausted ? 'text-red-400' : isUnlimited ? 'text-emerald-500' : 'text-gray-400'
                  }`}>
                    {isUnlimited ? '∞' : `${q.used}/${q.limit}`}
                  </span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${
                      exhausted ? 'bg-red-400' : isUnlimited ? 'bg-emerald-400' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-3 py-2">
        <button
          type="button"
          onClick={() => { onClose(); openModal(); }}
          className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-indigo-600 p-2.5 transition-opacity hover:bg-indigo-700 active:scale-[0.98]"
        >
          <div className="flex items-center gap-2 text-white">
            <FaCrown className="text-sm text-indigo-100" />
            <span className="text-xs font-semibold tracking-wide">Pro Resume</span>
          </div>
          <span className="rounded-md bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-700">
            Upgrade
          </span>
        </button>
      </div>

      <AccountMenuItems onClose={onClose} />
    </div>
  );
}

export function AccountMenuItems({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="flex flex-col gap-0.5 px-2 py-1.5">
        <button
          type="button"
          role="menuitem"
          onClick={onClose}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium tracking-wide text-gray-700 transition-colors hover:bg-gray-50"
        >
          <FiUser className="text-[1.1rem] text-gray-400" />
          My resumes
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={onClose}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium tracking-wide text-gray-700 transition-colors hover:bg-gray-50"
        >
          <FiSettings className="text-[1.1rem] text-gray-400" />
          Account settings
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={onClose}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium tracking-wide text-gray-700 transition-colors hover:bg-gray-50"
        >
          <FaDiscord className="text-[1.1rem] text-gray-400" />
          Resume community
        </button>
      </div>

      <div className="mx-4 my-1 border-t border-gray-100" />

      <div className="px-2 pb-2">
        <button
          type="button"
          role="menuitem"
          onClick={async () => {
            onClose();
            await signOut({ redirect: false });
            window.location.reload();
          }}
          className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium tracking-wide text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <FiLogOut className="text-[1.1rem] text-gray-400 group-hover:text-red-500" />
          Sign out
        </button>
      </div>
    </>
  );
}

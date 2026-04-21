'use client';

import { signOut } from 'next-auth/react';
import { FaCrown, FaDiscord } from 'react-icons/fa';
import { FiLogOut, FiSettings, FiUser } from 'react-icons/fi';

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

      <div className="px-4 py-1.5">
        <div className="mb-1.5 flex cursor-pointer items-center justify-between transition-opacity hover:opacity-80">
          <span className="text-xs font-medium text-gray-700">
            Resume credits
          </span>
          <span className="text-xs text-gray-400">8/10 left</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full w-[80%] bg-indigo-600" />
        </div>
      </div>

      <div className="px-3 py-2">
        <div className="flex cursor-pointer items-center justify-between rounded-xl bg-indigo-600 p-2.5 shadow-sm transition-opacity hover:bg-indigo-700">
          <div className="flex items-center gap-2 text-white">
            <FaCrown className="text-sm text-indigo-100" />
            <span className="text-xs font-semibold tracking-wide">Pro Resume</span>
          </div>
          <span className="rounded-md bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-700">
            Upgrade
          </span>
        </div>
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

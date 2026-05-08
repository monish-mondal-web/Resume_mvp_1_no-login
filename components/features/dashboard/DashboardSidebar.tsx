'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePricingModal } from '@/hooks/usePricingModal';
import { FREE_QUOTAS } from '@/lib/quota-config';
import type { QuotaItem } from '@/lib/quota-config';

interface Props {
  userName: string;
  userEmail?: string;
}

const NAV = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
  },
  {
    id: 'builder',
    label: 'Resume Builder',
    href: '/resume/builder',
    icon: (
      <>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </>
    ),
  },
  {
    id: 'templates',
    label: 'Templates',
    href: '/resume/templates',
    icon: (
      <>
        <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
        <path d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
        <path d="M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </>
    ),
  },
  {
    id: 'ats',
    label: 'ATS Score',
    href: '/resume/builder?tab=ats',
    icon: (
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    ),
  },
];

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1">
        <li>
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-1 rounded p-0.5 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path
                d="M16 7.609c.352 0 .69.122.96.343l.111.1 6.25 6.25v.001a1.5 1.5 0 0 1 .445 1.071v7.5a.89.89 0 0 1-.891.891H9.125a.89.89 0 0 1-.89-.89v-7.5l.006-.149a1.5 1.5 0 0 1 .337-.813l.1-.11 6.25-6.25c.285-.285.67-.444 1.072-.444Zm5.984 7.876L16 9.5l-5.984 5.985v6.499h11.968z"
                fill="currentColor" stroke="currentColor" strokeWidth=".094"
              />
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
          <span className="text-sm font-medium text-indigo-600" aria-current="page">Dashboard</span>
        </li>
      </ol>
    </nav>
  );
}

function QuotaBar({ item }: { item: QuotaItem }) {
  const isUnlimited = item.limit === null;
  const pct = isUnlimited ? 100 : item.limit! > 0 ? Math.round((item.used / item.limit!) * 100) : 0;
  const exhausted = !isUnlimited && item.limit !== null && item.used >= item.limit!;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-slate-500 truncate">{item.label}</span>
        <span className={`ml-2 flex-shrink-0 text-[10px] font-semibold tabular-nums ${
          exhausted ? 'text-red-400' : isUnlimited ? 'text-emerald-500' : 'text-slate-400'
        }`}>
          {isUnlimited ? 'Unlimited' : `${item.used} / ${item.limit}`}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all ${
            exhausted ? 'bg-red-400' : isUnlimited ? 'bg-emerald-400' : 'bg-indigo-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function DashboardSidebar({ userName: _userName, userEmail: _userEmail }: Props) {
  const pathname = usePathname();
  const { openModal } = usePricingModal();

  return (
    <aside className="hidden lg:flex w-[20%] min-w-[260px] max-w-[300px] flex-shrink-0 flex-col border-r border-slate-200 bg-white">

      {/* Breadcrumb header */}
      <div className="flex h-11 flex-shrink-0 items-center border-b border-slate-200 px-5">
        <Breadcrumb />
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-4 px-2 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
          Navigation
        </p>
        <nav className="space-y-0.5">
          {NAV.map(item => {
            const active = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href.split('?')[0]));
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group flex w-full cursor-pointer select-none items-center gap-3 rounded-xl px-2 py-2.5 transition-colors ${
                  active ? 'bg-indigo-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                  active
                    ? 'bg-indigo-600 text-white'
                    : 'border-2 border-slate-200 bg-white text-slate-400'
                }`}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {item.icon}
                  </svg>
                </div>
                <span className={`text-[13px] leading-tight ${
                  active ? 'font-semibold text-slate-900' : 'text-slate-600'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Quota + Upgrade — fixed bottom */}
      <div className="flex-shrink-0 border-t border-slate-200">
        {/* Plan header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Free Plan
          </span>
        </div>

        {/* Quota bars */}
        <div className="space-y-2.5 px-5 pb-3">
          {FREE_QUOTAS.map(q => <QuotaBar key={q.id} item={q} />)}
        </div>

        {/* Upgrade button */}
        <div className="px-4 pb-4 pt-1">
          <button
            type="button"
            onClick={openModal}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.98]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Upgrade to Pro
          </button>
        </div>
      </div>
    </aside>
  );
}

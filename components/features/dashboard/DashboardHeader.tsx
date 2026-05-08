'use client';

import Link from 'next/link';
import { usePricingModal } from '@/hooks/usePricingModal';

interface Props {
  userName: string;
  atsScore?: number;
  hasResume: boolean;
}

function getInsight(score?: number, hasResume?: boolean): string {
  if (!hasResume) return 'Build your first resume and get AI-powered insights instantly.';
  if (!score)    return 'Your resume is ready — run an ATS check to get personalized insights.';
  if (score >= 80) return `Your resume outperforms 85% of applicants — you're almost perfect.`;
  if (score >= 70) return `Your resume is better than 72% of applicants. A few fixes can push you higher.`;
  if (score >= 60) return `Your resume ranks above 58% of applicants. Let's get it into the top 25%.`;
  if (score >= 40) return `Your resume needs attention. AI can help you fix it in minutes.`;
  return 'Your resume needs significant improvements. Start with the AI suggestions below.';
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

export function DashboardHeader({ userName, atsScore, hasResume }: Props) {
  const { openModal } = usePricingModal();
  const firstName = userName.split(' ')[0] || 'there';
  const insight   = getInsight(atsScore, hasResume);

  return (
    <div className="relative overflow-hidden rounded-3xl p-[1px]" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)' }}>
      <div className="relative overflow-hidden rounded-[23px] bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 px-7 py-8 sm:px-10 sm:py-10">

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20" style={{ background: 'radial-gradient(circle,#fff,transparent 70%)' }} />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 h-40 w-40 rounded-full opacity-10" style={{ background: 'radial-gradient(circle,#c4b5fd,transparent 70%)' }} />
        <div className="pointer-events-none absolute right-1/4 top-1/2 h-24 w-24 rounded-full opacity-15" style={{ background: 'radial-gradient(circle,#818cf8,transparent 70%)' }} />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-indigo-200">Dashboard</p>
            <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-indigo-100">{insight}</p>

            {/* ATS score pill */}
            {atsScore !== undefined && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full" style={{ background: atsScore >= 80 ? '#4ade80' : atsScore >= 60 ? '#fbbf24' : '#f87171' }} />
                <span className="text-[12px] font-semibold text-white">ATS Score: {atsScore}/100</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/resume/builder"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-[13px] font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-[0.97]"
            >
              <ArrowRightIcon /> Improve Resume
            </Link>
            <Link
              href="/resume/builder"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13px] font-semibold text-indigo-600 transition-all hover:bg-indigo-50 active:scale-[0.97]"
            >
              <PlusIcon /> New Resume
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

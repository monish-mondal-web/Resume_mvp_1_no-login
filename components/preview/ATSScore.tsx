'use client';

import type { ATSResult } from '@/lib/resume-builder';

const RADIUS  = 22;
const CIRCUM  = 2 * Math.PI * RADIUS;

function scoreColor(score: number) {
  if (score >= 80) return { bar: '#10b981', text: '#065f46', bg: '#ecfdf5', border: '#a7f3d0', label: 'Excellent' };
  if (score >= 60) return { bar: '#f59e0b', text: '#78350f', bg: '#fffbeb', border: '#fde68a', label: 'Good'      };
  if (score >= 40) return { bar: '#f97316', text: '#7c2d12', bg: '#fff7ed', border: '#fed7aa', label: 'Fair'      };
  return              { bar: '#f43f5e', text: '#881337', bg: '#fff1f2', border: '#fecdd3', label: 'Needs Work' };
}

interface Props {
  result: ATSResult;
}

export function ATSScore({ result }: Props) {
  const { score, tips } = result;
  const c = scoreColor(score);
  const filled = (score / 100) * CIRCUM;

  return (
    <div className="px-3 pb-3 pt-1">
      {/* Score ring + label */}
      <div className="mb-3 flex items-center gap-3">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true" className="flex-shrink-0">
          <circle cx="28" cy="28" r={RADIUS} stroke="#e2e8f0" strokeWidth="4" fill="none" />
          <circle
            cx="28" cy="28" r={RADIUS}
            stroke={c.bar}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${CIRCUM}`}
            transform="rotate(-90 28 28)"
          />
          <text x="28" y="33" textAnchor="middle" fontSize="13" fontWeight="700" fill={c.text}>{score}</text>
        </svg>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: c.text }}>{c.label}</p>
          <p className="text-[10px] text-slate-400">ATS Compatibility Score</p>
        </div>
      </div>

      {/* Horizontal bar */}
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: c.bar }} />
      </div>

      {/* Tips */}
      {tips.length > 0 && (
        <div
          className="rounded-xl border p-2.5"
          style={{ background: c.bg, borderColor: c.border }}
        >
          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest" style={{ color: c.text }}>Suggestions</p>
          <ul className="space-y-1">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <svg width="10" height="10" viewBox="0 0 10 10" className="mt-0.5 flex-shrink-0" fill="none">
                  <path d="M5 1v4M5 7.5v.5" stroke={c.bar} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-[10px] leading-tight text-slate-600">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tips.length === 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-2">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px] font-medium text-emerald-700">Your resume looks great!</span>
        </div>
      )}
    </div>
  );
}

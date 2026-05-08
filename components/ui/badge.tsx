import React from 'react';

type BadgeVariant = 'popular' | 'value' | 'free' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  popular: 'bg-indigo-600 text-white',
  value:   'bg-violet-100 text-violet-700 border border-violet-200',
  free:    'bg-emerald-100 text-emerald-700 border border-emerald-200',
  neutral: 'bg-gray-100 text-gray-600 border border-gray-200',
};

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}

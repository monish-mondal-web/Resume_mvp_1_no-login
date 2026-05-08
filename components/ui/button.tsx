'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-indigo-600 text-white border border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700',
  secondary: 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200',
  outline:   'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-[12px]',
  md: 'px-4    py-2   text-[13px]',
  lg: 'px-5    py-2.5 text-[14px]',
};

function Spinner() {
  return (
    <svg
      className="h-3.5 w-3.5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150',
        'active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

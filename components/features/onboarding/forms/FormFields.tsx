import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import type { Path } from 'react-hook-form';
import { Autocomplete } from '@/components/ui/Autocomplete';
import type { SuggestionType } from '@/models/Suggestion';
import type { OnboardingFormValues } from '../types';

export function AiSparkleIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2l1.8 5.4L19.2 9l-5.4 1.8L12 16.2l-1.8-5.4L4.8 9l5.4-1.8L12 2z" fill="currentColor" />
      <path d="M19 14l.9 2.6L22.5 17.5l-2.6.9L19 21l-.9-2.6L15.5 17.5l2.6-.9L19 14z" fill="currentColor" opacity=".7" />
      <path d="M5.5 16l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6.6-1.9z" fill="currentColor" opacity=".5" />
    </svg>
  );
}

export function AiSuggestionsButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="group flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
      <AiSparkleIcon className="text-slate-400 transition-colors group-hover:text-indigo-500" /> Smart Suggestions
    </button>
  );
}

type CommonFieldProps = {
  label: string;
  hint?: string;
  required?: boolean;
};

type TextFieldProps = CommonFieldProps & React.InputHTMLAttributes<HTMLInputElement>;

type AutocompleteFieldProps = CommonFieldProps & {
  type: SuggestionType;
  name: Path<OnboardingFormValues>;
  placeholder?: string;
};

type TextAreaFieldProps = CommonFieldProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    action?: React.ReactNode;
  };

export function CF({ label, placeholder, required, type = 'text', hint, disabled, ...rest }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-slate-600">
        {label}
        {required && <span className="ml-0.5 text-slate-400">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 disabled:bg-slate-50 disabled:text-slate-400"
        {...rest}
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function ACA({ label, type, name, placeholder, required, hint }: AutocompleteFieldProps) {
  const { control } = useFormContext<OnboardingFormValues>();
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-slate-600">
        {label}
        {required && <span className="ml-0.5 text-slate-400">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Autocomplete
            type={type}
            value={typeof field.value === 'string' ? field.value : ''}
            onChange={field.onChange}
            placeholder={placeholder}
            inputClassName="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
          />
        )}
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function TA({ label, placeholder, hint, rows = 3, action, ...rest }: TextAreaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm text-slate-600">{label}</label>
        {action && <div>{action}</div>}
      </div>
      <textarea
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
        {...rest}
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

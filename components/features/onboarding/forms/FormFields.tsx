import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Autocomplete } from '@/components/ui/Autocomplete';

export function CF({ label, placeholder, required, type = 'text', hint, disabled, ...rest }: any) {
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

export function ACA({ label, type, name, placeholder, required, hint }: any) {
  const { control } = useFormContext();
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
            value={field.value || ''}
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

export function TA({ label, placeholder, hint, rows = 3, action, ...rest }: any) {
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

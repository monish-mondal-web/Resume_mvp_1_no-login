'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import { Autocomplete } from '@/components/ui/Autocomplete';
import { SUGG_SKILLS } from '../defaults';
import { OnboardingFormValues } from '../types';

export function SkillsForm() {
  const { watch, setValue } = useFormContext<OnboardingFormValues>();
  const skills = watch('skills') || [];
  const [input, setInput] = useState('');

  const addSkill = (raw: string) => {
    const t = raw.trim().replace(/,$/, '');
    if (t && !skills.includes(t)) setValue('skills', [...skills, t], { shouldDirty: true });
    setInput('');
  };

  const removeSkill = (s: string) =>
    setValue('skills', skills.filter((x) => x !== s), { shouldDirty: true });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(input);
    } else if (e.key === 'Backspace' && !input && skills.length > 0) {
      setValue('skills', skills.slice(0, -1), { shouldDirty: true });
    }
  };

  const suggestions = SUGG_SKILLS.filter((s) => !skills.includes(s));

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="mb-3 text-sm text-slate-600">Add a skill</p>
        <div className="flex min-h-[44px] flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-2.5 transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/10">
          {skills.map((s) => (
            <span key={s} className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
              {s}
              <button
                type="button"
                onClick={() => removeSkill(s)}
                className="cursor-pointer text-slate-400 transition hover:text-slate-700"
              >
                <FiX className="text-[10px]" />
              </button>
            </span>
          ))}
          <Autocomplete
            type="skill"
            value={input}
            onChange={setInput}
            onSelect={(val) => addSkill(val)}
            onInputKeyDown={onKeyDown}
            placeholder={skills.length === 0 ? 'Type a skill...' : ''}
            className="min-w-[100px] flex-1"
            inputClassName="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-300"
            trackOnBlur={false}
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">Press Enter or comma to add. Backspace on empty removes the last.</p>
      </div>

      {suggestions.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Suggested</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setValue('skills', [...skills, s], { shouldDirty: true })}
                className="flex cursor-pointer items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <span className="text-slate-400">+</span> {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

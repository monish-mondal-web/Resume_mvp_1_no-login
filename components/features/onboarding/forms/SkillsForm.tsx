'use client';

import { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import { Autocomplete } from '@/components/ui/Autocomplete';
import type { OnboardingFormValues } from '../types';
import { SUGG_SKILLS } from '../defaults';
import { SortableList } from './SortableList';
import { EmptyState, AddButton } from './ExperienceForm';

// ── Tag-chip input for the skills/items field inside each group ──────────────

function ItemsChipInput({ groupIndex }: { groupIndex: number }) {
  const { watch, setValue } = useFormContext<OnboardingFormValues>();
  const raw: unknown = watch(`skills.${groupIndex}.items`);
  const items: string[] = Array.isArray(raw) ? (raw as string[]) : (typeof raw === 'string' && raw ? (raw as string).split(',').map((x: string) => x.trim()).filter(Boolean) : []);
  const [input, setInput] = useState('');

  const add = (raw: string) => {
    const t = raw.trim().replace(/,$/, '');
    if (t && !items.includes(t)) {
      setValue(`skills.${groupIndex}.items`, [...items, t], { shouldDirty: true });
    }
    setInput('');
  };

  const removeTag = (tag: string) =>
    setValue(`skills.${groupIndex}.items`, items.filter((x: string) => x !== tag), { shouldDirty: true });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input); }
    else if (e.key === 'Backspace' && !input && items.length > 0) {
      setValue(`skills.${groupIndex}.items`, items.slice(0, -1), { shouldDirty: true });
    }
  };

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">
        Skills / Technologies <span className="text-red-400">*</span>
      </label>
      <div className="flex min-h-[44px] flex-wrap gap-1.5 rounded-lg border border-slate-200 bg-white p-2 transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/10">
        {items.map(tag => (
          <span key={tag} className="flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-xs text-indigo-700 font-medium">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="cursor-pointer text-indigo-300 hover:text-indigo-600 transition ml-0.5">
              <FiX size={10} />
            </button>
          </span>
        ))}
        <Autocomplete
          type="skill"
          value={input}
          onChange={setInput}
          onSelect={(val) => add(val)}
          onInputKeyDown={onKeyDown}
          placeholder={items.length === 0 ? 'Type a skill, press Enter...' : ''}
          className="min-w-[110px] flex-1"
          inputClassName="w-full bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-300"
          trackOnBlur={false}
        />
      </div>
      <p className="mt-1 text-[10px] text-slate-400">Press Enter or comma to add each skill</p>
    </div>
  );
}

// ── Single skill group card ──────────────────────────────────────────────────

function SkillGroupItem({ index }: { index: number }) {
  const { register } = useFormContext<OnboardingFormValues>();
  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">
          Category <span className="text-slate-400 font-normal">(optional — rendered bold)</span>
        </label>
        <input
          {...register(`skills.${index}.category`)}
          placeholder="e.g. Frontend, Backend, Tools & DevOps"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-300"
        />
      </div>
      <ItemsChipInput groupIndex={index} />
    </div>
  );
}

// ── Main form ────────────────────────────────────────────────────────────────

export function SkillsForm() {
  const { control, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'skills' });
  const skills = watch('skills') ?? [];

  const usedCategories = new Set(skills.map(s => s.category?.trim()).filter(Boolean));
  const suggestions = SUGG_SKILLS.filter(s => !usedCategories.has(s.category));

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No skill groups added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="skills"
          itemTypeLabel="Skill Group"
          getItemTitle={(_: unknown, i: number) => {
            const s = skills[i];
            const label = s?.category?.trim() || 'Untitled';
            const count = (s?.items ?? []).length;
            return count > 0 ? `${label} (${count})` : label;
          }}
          onMove={move}
          onRemove={remove}
          renderItem={(i: number) => <SkillGroupItem index={i} />}
        />
      )}

      <AddButton
        label={fields.length === 0 ? 'Add skill group' : 'Add another skill group'}
        onClick={() => append({ id: Date.now().toString(), category: '', items: [], isHidden: false })}
      />

      {suggestions.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Suggested</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => append({ id: Date.now().toString(), category: s.category, items: [...(s.items ?? [])], isHidden: false })}
                className="flex cursor-pointer items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <span className="text-slate-400">+</span>
                {s.category
                  ? <><strong className="mr-0.5">{s.category}</strong> · {(s.items ?? []).slice(0, 3).join(', ')}{(s.items ?? []).length > 3 ? '…' : ''}</>
                  : (s.items ?? []).join(', ')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

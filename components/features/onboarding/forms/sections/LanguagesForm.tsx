import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { ACA } from '../FormFields';
import { SortableList } from '../SortableList';
import { EmptyState, AddButton } from '../ExperienceForm';
import type { OnboardingFormValues } from '../../types';
import { PROFICIENCY_LEVELS } from './shared';

export function LanguagesForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'languages' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No languages added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="languages"
          itemTypeLabel="Language"
          getItemTitle={(_, i) => watch(`languages.${i}.language`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ACA label="Language" type="language" name={`languages.${i}.language`} required placeholder="Hindi, English, etc." />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-slate-600">Proficiency</label>
                <select
                  {...register(`languages.${i}.proficiency`)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
                >
                  {PROFICIENCY_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add language' : 'Add another language'}
        onClick={() => append({ id: Date.now().toString(), language: '', proficiency: 'Full Professional', isHidden: false })}
      />
    </div>
  );
}

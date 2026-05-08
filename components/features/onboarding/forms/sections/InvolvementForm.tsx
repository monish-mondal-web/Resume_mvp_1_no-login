import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { ACA, CF, TA, AiSuggestionsButton } from '../FormFields';
import { SortableList } from '../SortableList';
import { SuggestionsModal } from '../SuggestionsModal';
import { getSectionSuggestions } from '@/lib/section-suggestions';
import { EmptyState, AddButton } from '../ExperienceForm';
import type { OnboardingFormValues } from '../../types';
import type { SuggestionTextField } from './shared';

export function InvolvementForm() {
  const { control, register, watch, getValues, setValue } = useFormContext<OnboardingFormValues>();
  const [suggestionField, setSuggestionField] = useState<SuggestionTextField | null>(null);

  const handleSelectSuggestion = (text: string) => {
    if (!suggestionField) return;
    const currentText = getValues(suggestionField) || '';
    const newText = currentText ? `${currentText}\n• ${text}` : `• ${text}`;
    setValue(suggestionField, newText);
    setSuggestionField(null);
  };
  const { fields, append, remove, move } = useFieldArray({ control, name: 'involvement' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No activities added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="involvement"
          itemTypeLabel="Activity"
          getItemTitle={(_, i) => {
            const role = watch(`involvement.${i}.role`);
            const org = watch(`involvement.${i}.organization`);
            if (role && org) return `${role} at ${org}`;
            return role || org || '';
          }}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => {
            const current = watch(`involvement.${i}.current`);
            return (
              <div className="space-y-4">
                <ACA label="Organization" type="company" name={`involvement.${i}.organization`} required placeholder="Design Club / Student Council" />
                <ACA label="Role / Position" type="role" name={`involvement.${i}.role`} required placeholder="Vice President" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <CF label="Start" {...register(`involvement.${i}.start`)} placeholder="YYYY-MM" />
                  <CF label="End" {...register(`involvement.${i}.end`)} placeholder={current ? 'Present' : 'YYYY-MM'} disabled={current} />
                  <div className="flex items-end pb-2">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input type="checkbox" {...register(`involvement.${i}.current`)} className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600" />
                      <span className="text-sm text-slate-600">Currently active</span>
                    </label>
                  </div>
                </div>
                <TA label="Description" {...register(`involvement.${i}.description`)} rows={3} placeholder="Describe your contributions and impact." action={<AiSuggestionsButton onClick={() => setSuggestionField(`involvement.${i}.description`)} />} />
              </div>
            );
          }}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add activity' : 'Add another activity'}
        onClick={() => append({ id: Date.now().toString(), organization: '', role: '', start: '', end: '', current: false, description: '', isHidden: false })}
      />
    
      <SuggestionsModal
        isOpen={!!suggestionField}
        onClose={() => setSuggestionField(null)}
        onSelect={handleSelectSuggestion}
        title="Involvement Suggestions"
        subtitle="Find ATS-friendly bullet points"
        searchLabel="Search by Activity"
        searchPlaceholder="e.g. Leadership"
        defaultSearch={watch('personalInfo.professionalTitle') || ''}
        fetchSuggestions={(q) => getSectionSuggestions('involvement', q)}
      />
    </div>
  );
}

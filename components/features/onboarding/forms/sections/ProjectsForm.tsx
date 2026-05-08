import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CF, TA, AiSuggestionsButton } from '../FormFields';
import { SortableList } from '../SortableList';
import { SuggestionsModal } from '../SuggestionsModal';
import { getSectionSuggestions } from '@/lib/section-suggestions';
import { EmptyState, AddButton } from '../ExperienceForm';
import type { OnboardingFormValues } from '../../types';
import type { SuggestionTextField } from './shared';

export function ProjectsForm() {
  const { control, register, watch, getValues, setValue } = useFormContext<OnboardingFormValues>();
  const [suggestionField, setSuggestionField] = useState<SuggestionTextField | null>(null);

  const handleSelectSuggestion = (text: string) => {
    if (!suggestionField) return;
    const currentText = getValues(suggestionField) || '';
    const newText = currentText ? `${currentText}\n${text}` : `${text}`;
    setValue(suggestionField, newText);
    setSuggestionField(null);
  };
  const { fields, append, remove, move } = useFieldArray({ control, name: 'projects' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No projects added" message="Personal or professional projects help showcase your practical skills." />
      ) : (
        <SortableList
          fields={fields}
          baseName="projects"
          itemTypeLabel="Project"
          getItemTitle={(_, i) => watch(`projects.${i}.title`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => {
            const ongoing = watch(`projects.${i}.ongoing`);
            return (
              <div className="space-y-4">
                <CF label="Project title" required {...register(`projects.${i}.title`)} placeholder="My Awesome Project" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <CF label="Start date" {...register(`projects.${i}.start`)} placeholder="YYYY-MM" />
                  <CF label="End date" {...register(`projects.${i}.end`)} placeholder={ongoing ? 'Ongoing' : 'YYYY-MM'} disabled={ongoing} />
                </div>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" {...register(`projects.${i}.ongoing`)} className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600" />
                  <span className="text-sm text-slate-600">Ongoing project</span>
                </label>
                <TA label="Description" {...register(`projects.${i}.description`)} rows={3} placeholder="What did you build? What problem did it solve? What was the impact?" action={<AiSuggestionsButton onClick={() => setSuggestionField(`projects.${i}.description`)} />} />
                <CF label="Project URL" {...register(`projects.${i}.url`)} placeholder="github.com/you/project" />
                <CF label="Technologies used" {...register(`projects.${i}.tech`)} placeholder="React, TypeScript, Node.js" hint="Comma-separated list of tools and technologies." />
              </div>
            );
          }}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add project' : 'Add another project'}
        onClick={() => append({ id: Date.now().toString(), title: '', description: '', url: '', start: '', end: '', ongoing: false, tech: '', isHidden: false })}
      />
    
      <SuggestionsModal
        isOpen={!!suggestionField}
        onClose={() => setSuggestionField(null)}
        onSelect={handleSelectSuggestion}
        title="Project Suggestions"
        subtitle="Find ATS-friendly bullet points for your projects"
        searchLabel="Search by Project Type"
        searchPlaceholder="e.g. Web Development"
        defaultSearch={watch('personalInfo.professionalTitle') || ''}
        fetchSuggestions={(q) => getSectionSuggestions('projects', q)}
      />
    </div>
  );
}

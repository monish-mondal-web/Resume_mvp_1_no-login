import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CF, ACA, TA } from '../FormFields';
import { SortableList } from '../SortableList';
import { EmptyState, AddButton } from '../ExperienceForm';
import type { OnboardingFormValues } from '../../types';

export function InternshipsForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'internships' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No internships added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="internships"
          itemTypeLabel="Internship"
          getItemTitle={(_, i) => watch(`internships.${i}.role`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ACA label="Job title" required type="role" name={`internships.${i}.role`} placeholder="UI/UX Intern" />
                <ACA label="Company / Organization" required type="company" name={`internships.${i}.company`} placeholder="Google / UNICEF" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CF label="Start date" required {...register(`internships.${i}.start`)} placeholder="2023-06" />
                <CF label="End date" {...register(`internships.${i}.end`)} placeholder="2023-08 (or Present)" />
              </div>
              <CF label="Location" {...register(`internships.${i}.location`)} placeholder="Remote / New York, NY" />
              <TA label="Responsibilities" {...register(`internships.${i}.description`)} rows={4} placeholder="Key tasks and accomplishments..." />
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add internship' : 'Add another internship'}
        onClick={() => append({ id: Date.now().toString(), role: '', company: '', start: '', end: '', location: '', description: '', isHidden: false })}
      />
    </div>
  );
}


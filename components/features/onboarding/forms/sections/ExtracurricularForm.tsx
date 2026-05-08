import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CF, TA } from '../FormFields';
import { SortableList } from '../SortableList';
import { EmptyState, AddButton } from '../ExperienceForm';
import type { OnboardingFormValues } from '../../types';

export function ExtracurricularForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'extracurricular' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No extracurricular activities added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="extracurricular"
          itemTypeLabel="Activity"
          getItemTitle={(_, i) => watch(`extracurricular.${i}.activity`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CF label="Activity" required {...register(`extracurricular.${i}.activity`)} placeholder="Debate Team / Soccer Club" />
                <CF label="Organization" required {...register(`extracurricular.${i}.organization`)} placeholder="University of X" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CF label="Start date" required {...register(`extracurricular.${i}.start`)} placeholder="2020-09" />
                <CF label="End date" {...register(`extracurricular.${i}.end`)} placeholder="2021-05" />
              </div>
              <TA label="Description" {...register(`extracurricular.${i}.description`)} rows={3} placeholder="Describe your involvement." />
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add activity' : 'Add another activity'}
        onClick={() => append({ id: Date.now().toString(), activity: '', organization: '', start: '', end: '', description: '', isHidden: false })}
      />
    </div>
  );
}

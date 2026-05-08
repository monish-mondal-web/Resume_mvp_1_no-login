import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CF, ACA, TA } from '../FormFields';
import { SortableList } from '../SortableList';
import { EmptyState, AddButton } from '../ExperienceForm';
import type { OnboardingFormValues } from '../../types';

export function AchievementsForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'achievements' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No achievements added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="achievements"
          itemTypeLabel="Achievement"
          getItemTitle={(_, i) => watch(`achievements.${i}.title`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-4">
              <CF label="Achievement title" required {...register(`achievements.${i}.title`)} placeholder="Employee of the Month" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ACA label="Issuer" type="company" name={`achievements.${i}.issuer`} placeholder="Company / Organization" />
                <CF label="Date" {...register(`achievements.${i}.date`)} placeholder="2023" />
              </div>
              <TA label="Description" {...register(`achievements.${i}.description`)} rows={3} placeholder="Describe what you achieved." />
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add achievement' : 'Add another achievement'}
        onClick={() => append({ id: Date.now().toString(), title: '', issuer: '', date: '', description: '', isHidden: false })}
      />
    </div>
  );
}

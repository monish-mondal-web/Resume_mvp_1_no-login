import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CF, TA } from '../FormFields';
import { SortableList } from '../SortableList';
import { EmptyState, AddButton } from '../ExperienceForm';
import type { OnboardingFormValues } from '../../types';

export function PatentsForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'patents' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No patents added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="patents"
          itemTypeLabel="Patent"
          getItemTitle={(_, i) => watch(`patents.${i}.title`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-4">
              <CF label="Patent title" required {...register(`patents.${i}.title`)} placeholder="Method and system for..." />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CF label="Patent number" {...register(`patents.${i}.number`)} placeholder="US1234567" />
                <CF label="Issue date" {...register(`patents.${i}.date`)} placeholder="2023" />
              </div>
              <CF label="URL" {...register(`patents.${i}.url`)} placeholder="patents.google.com/..." />
              <TA label="Description" {...register(`patents.${i}.description`)} rows={3} placeholder="Brief summary of the patent." />
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add patent' : 'Add another patent'}
        onClick={() => append({ id: Date.now().toString(), title: '', number: '', issuer: '', date: '', url: '', description: '', isHidden: false })}
      />
    </div>
  );
}


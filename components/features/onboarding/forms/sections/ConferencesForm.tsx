import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CF } from '../FormFields';
import { SortableList } from '../SortableList';
import { EmptyState, AddButton } from '../ExperienceForm';
import type { OnboardingFormValues } from '../../types';

export function ConferencesForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'conferences' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No conferences added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="conferences"
          itemTypeLabel="Conference"
          getItemTitle={(_, i) => watch(`conferences.${i}.title`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-4">
              <CF label="Conference title" required {...register(`conferences.${i}.title`)} placeholder="JSConf / AWS re:Invent" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CF label="Role" {...register(`conferences.${i}.role`)} placeholder="Speaker / Attendee" />
                <CF label="Date" {...register(`conferences.${i}.date`)} placeholder="2023" />
              </div>
              <CF label="Location" {...register(`conferences.${i}.location`)} placeholder="Las Vegas, NV" />
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add conference' : 'Add another conference'}
        onClick={() => append({ id: Date.now().toString(), title: '', role: '', date: '', location: '', isHidden: false })}
      />
    </div>
  );
}

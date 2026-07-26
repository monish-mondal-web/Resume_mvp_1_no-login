import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CF, ACA, TA } from '../FormFields';
import { SortableList } from '../SortableList';
import { EmptyState, AddButton } from '../ExperienceForm';
import type { OnboardingFormValues } from '../../types';

export function VolunteeringForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'volunteering' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No volunteering work added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="volunteering"
          itemTypeLabel="Experience"
          getItemTitle={(_, i) => watch(`volunteering.${i}.role`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ACA label="Role" required type="role" name={`volunteering.${i}.role`} placeholder="Volunteer Teacher" />
                <ACA label="Organization" required type="company" name={`volunteering.${i}.organization`} placeholder="Red Cross" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CF label="Start date" required {...register(`volunteering.${i}.start`)} placeholder="2021-05" />
                <CF label="End date" {...register(`volunteering.${i}.end`)} placeholder="Present" />
              </div>
              <TA label="Impact" {...register(`volunteering.${i}.description`)} rows={4} placeholder="Describe your volunteer contributions." />
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add volunteering work' : 'Add another experience'}
        onClick={() => append({ id: Date.now().toString(), role: '', organization: '', start: '', end: '', current: false, description: '', isHidden: false })}
      />
    </div>
  );
}

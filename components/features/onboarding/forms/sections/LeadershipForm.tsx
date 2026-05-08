import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CF, ACA, TA } from '../FormFields';
import { SortableList } from '../SortableList';
import { EmptyState, AddButton } from '../ExperienceForm';
import type { OnboardingFormValues } from '../../types';

export function LeadershipForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'leadership' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No leadership experience added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="leadership"
          itemTypeLabel="Position"
          getItemTitle={(_, i) => watch(`leadership.${i}.role`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ACA label="Role / Position" required type="role" name={`leadership.${i}.role`} placeholder="President / Team Lead" />
                <ACA label="Organization" required type="company" name={`leadership.${i}.organization`} placeholder="Student Council / NGO" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CF label="Start date" required {...register(`leadership.${i}.start`)} placeholder="2022-01" />
                <CF label="End date" {...register(`leadership.${i}.end`)} placeholder="2022-12" />
              </div>
              <TA label="Responsibilities" {...register(`leadership.${i}.description`)} rows={4} placeholder="What did you lead and achieve?" />
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add leadership position' : 'Add another position'}
        onClick={() => append({ id: Date.now().toString(), role: '', organization: '', start: '', end: '', description: '', isHidden: false })}
      />
    </div>
  );
}

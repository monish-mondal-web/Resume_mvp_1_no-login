import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CF, ACA } from '../FormFields';
import { SortableList } from '../SortableList';
import { EmptyState, AddButton } from '../ExperienceForm';
import type { OnboardingFormValues } from '../../types';

export function HobbiesForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'hobbies' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No hobbies added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="hobbies"
          itemTypeLabel="Hobby"
          getItemTitle={(_, i) => watch(`hobbies.${i}.name`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-4">
              <CF label="Hobby name" required {...register(`hobbies.${i}.name`)} placeholder="Photography / Hiking / Chess" />
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add hobby' : 'Add another hobby'}
        onClick={() => append({ id: Date.now().toString(), name: '', isHidden: false })}
      />
    </div>
  );
}


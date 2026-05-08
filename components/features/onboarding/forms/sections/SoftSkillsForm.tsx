import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CF } from '../FormFields';
import { SortableList } from '../SortableList';
import { EmptyState, AddButton } from '../ExperienceForm';
import type { OnboardingFormValues } from '../../types';

export function SoftSkillsForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'softskills' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No soft skills added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="softskills"
          itemTypeLabel="Skill"
          getItemTitle={(_, i) => watch(`softskills.${i}.skill`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-4">
              <CF label="Skill name" required {...register(`softskills.${i}.skill`)} placeholder="Communication / Leadership / Problem Solving" />
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add soft skill' : 'Add another soft skill'}
        onClick={() => append({ id: Date.now().toString(), skill: '', isHidden: false })}
      />
    </div>
  );
}

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CF, ACA, TA } from '../FormFields';
import { SortableList } from '../SortableList';
import { EmptyState, AddButton } from '../ExperienceForm';
import type { OnboardingFormValues } from '../../types';

export function FreelanceForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'freelance' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No freelance work added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="freelance"
          itemTypeLabel="Project"
          getItemTitle={(_, i) => watch(`freelance.${i}.role`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ACA label="Role / Title" required type="role" name={`freelance.${i}.role`} placeholder="Full Stack Developer" />
                <ACA label="Client / Platform" required type="company" name={`freelance.${i}.client`} placeholder="Upwork / Personal Client" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CF label="Start date" required {...register(`freelance.${i}.start`)} placeholder="2022-01" />
                <CF label="End date" {...register(`freelance.${i}.end`)} placeholder="2022-12" />
              </div>
              <TA label="Project Details" {...register(`freelance.${i}.description`)} rows={4} placeholder="Describe the scope and results..." />
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add freelance work' : 'Add another freelance work'}
        onClick={() => append({ id: Date.now().toString(), role: '', client: '', start: '', end: '', description: '', isHidden: false })}
      />
    </div>
  );
}

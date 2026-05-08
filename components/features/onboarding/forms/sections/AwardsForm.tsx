import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CF, ACA, TA } from '../FormFields';
import { SortableList } from '../SortableList';
import { EmptyState, AddButton } from '../ExperienceForm';
import type { OnboardingFormValues } from '../../types';

export function AwardsForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'awards' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No awards added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="awards"
          itemTypeLabel="Award"
          getItemTitle={(_, i) => watch(`awards.${i}.name`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-4">
              <CF label="Award name" required {...register(`awards.${i}.name`)} placeholder="Dean's List / Hackathon Winner" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ACA label="Issuing organization" type="company" name={`awards.${i}.issuer`} placeholder="Google / Flipkart" />
                <CF label="Date" {...register(`awards.${i}.date`)} placeholder="YYYY or YYYY-MM" />
              </div>
              <TA label="Description" {...register(`awards.${i}.description`)} rows={3} placeholder="Brief description of the award and why you received it." />
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add award' : 'Add another award'}
        onClick={() => append({ id: Date.now().toString(), name: '', issuer: '', date: '', description: '', isHidden: false })}
      />
    </div>
  );
}

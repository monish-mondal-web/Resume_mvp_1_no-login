import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CF, ACA } from '../FormFields';
import { SortableList } from '../SortableList';
import { EmptyState, AddButton } from '../ExperienceForm';
import type { OnboardingFormValues } from '../../types';

export function ReferencesForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'references' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No references added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="references"
          itemTypeLabel="Reference"
          getItemTitle={(_, i) => watch(`references.${i}.name`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CF label="Full name" required {...register(`references.${i}.name`)} placeholder="Jane Smith" />
                <ACA label="Job title" type="role" name={`references.${i}.title`} placeholder="Head of Design" />
              </div>
              <ACA label="Company" type="company" name={`references.${i}.company`} placeholder="Google / Flipkart" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CF label="Email" type="email" {...register(`references.${i}.email`)} placeholder="jane@company.com" />
                <CF label="Phone" {...register(`references.${i}.phone`)} placeholder="+1 (555) 000-0000" />
              </div>
              <CF label="Relationship" {...register(`references.${i}.relationship`)} placeholder="Direct manager / Colleague / Professor" />
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add reference' : 'Add another reference'}
        onClick={() => append({ id: Date.now().toString(), name: '', title: '', company: '', email: '', phone: '', relationship: '', isHidden: false })}
      />
    </div>
  );
}

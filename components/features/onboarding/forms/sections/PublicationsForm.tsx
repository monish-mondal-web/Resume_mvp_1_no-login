import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CF, ACA, TA } from '../FormFields';
import { SortableList } from '../SortableList';
import { EmptyState, AddButton } from '../ExperienceForm';
import type { OnboardingFormValues } from '../../types';

export function PublicationsForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'publications' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No publications added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="publications"
          itemTypeLabel="Publication"
          getItemTitle={(_, i) => watch(`publications.${i}.title`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-4">
              <CF label="Title" required {...register(`publications.${i}.title`)} placeholder="Article or paper title" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ACA label="Publisher / Journal" type="company" name={`publications.${i}.publisher`} placeholder="Nature / Medium / IEEE" />
                <CF label="Publication date" {...register(`publications.${i}.date`)} placeholder="YYYY-MM" />
              </div>
              <CF label="URL" {...register(`publications.${i}.url`)} placeholder="doi.org/... or medium.com/..." />
              <TA label="Abstract / Description" {...register(`publications.${i}.description`)} rows={3} placeholder="Brief summary of the publication." />
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add publication' : 'Add another publication'}
        onClick={() => append({ id: Date.now().toString(), title: '', publisher: '', date: '', url: '', description: '', isHidden: false })}
      />
    </div>
  );
}

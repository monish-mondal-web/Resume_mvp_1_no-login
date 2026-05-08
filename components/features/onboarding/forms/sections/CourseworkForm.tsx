import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CF, ACA } from '../FormFields';
import { SortableList } from '../SortableList';
import { EmptyState, AddButton } from '../ExperienceForm';
import type { OnboardingFormValues } from '../../types';

export function CourseworkForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'coursework' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No courses added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="coursework"
          itemTypeLabel="Course"
          getItemTitle={(_, i) => watch(`coursework.${i}.course`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-4">
              <CF label="Course name" required {...register(`coursework.${i}.course`)} placeholder="Machine Learning" />
              <ACA label="Institution" type="institute" name={`coursework.${i}.institution`} placeholder="IIT Madras / Coursera" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CF label="Grade / Score" {...register(`coursework.${i}.grade`)} placeholder="A / 95%" />
                <CF label="Year completed" {...register(`coursework.${i}.year`)} placeholder="2023" />
              </div>
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add course' : 'Add another course'}
        onClick={() => append({ id: Date.now().toString(), course: '', institution: '', grade: '', year: '', isHidden: false })}
      />
    </div>
  );
}

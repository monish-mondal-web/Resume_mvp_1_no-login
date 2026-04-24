import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { EntryHeader, EmptyState, AddButton } from './ExperienceForm';
import { CF, ACA } from './FormFields';
import { OnboardingFormValues } from '../types';

export function EducationForm() {
  const { control, register, watch, setValue } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No education added" />
      ) : (
        fields.map((field, i) => {
          const type = watch(`education.${i}.type`) || 'college';
          const isSchool = type === 'school';
          
          return (
            <div key={field.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <EntryHeader label="Education" index={i} showRemove={true} onRemove={() => remove(i)} />
              <div className="mb-4 flex items-center gap-3">
                <button type="button" onClick={() => setValue(`education.${i}.type`, 'college')}
                  className={`flex cursor-pointer items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    !isSchool ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}>University / College</button>
                <button type="button" onClick={() => setValue(`education.${i}.type`, 'school')}
                  className={`flex cursor-pointer items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    isSchool ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}>School</button>
              </div>
              <div className="space-y-4">
                <ACA label={isSchool ? "School Name" : "University Name"} type="institution" name={`education.${i}.school`} required placeholder={isSchool ? "Delhi Public School" : "National Institute of Technology"} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <CF label={isSchool ? "Board / Degree" : "Degree"} {...register(`education.${i}.degree`)} required placeholder={isSchool ? "Class XII (CBSE)" : "B.Tech"} />
                  <CF label={isSchool ? "Stream (Optional)" : "Field of Study"} {...register(`education.${i}.fieldOfStudy`)} placeholder={isSchool ? "Science (PCM)" : "Computer Science"} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <CF label="Start Year" {...register(`education.${i}.startYear`)} placeholder="2015" />
                  <CF label="End Year" {...register(`education.${i}.endYear`)} placeholder="2019" />
                  <CF label="Grade / CGPA" {...register(`education.${i}.gpa`)} placeholder="8.6" />
                </div>
              </div>
            </div>
          );
        })
      )}
      <AddButton label={fields.length === 0 ? "Add education" : "Add another institution"} onClick={() => append({ id: Date.now().toString(), type: 'college', school: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '', gpa: '' })} />
    </div>
  );
}

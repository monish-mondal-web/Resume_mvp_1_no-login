import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { FiAward, FiBookOpen } from 'react-icons/fi';
import { CF, ACA } from './FormFields';
import { SortableList } from './SortableList';
import { EmptyState, AddButton } from './ExperienceForm';
import { OnboardingFormValues } from '../types';

export function EducationForm() {
  const { control, register, watch, setValue } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'education' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No education added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="education"
          itemTypeLabel="Education"
          getItemTitle={(field, index) => {
            const degree = watch(`education.${index}.degree`);
            const school = watch(`education.${index}.school`);
            if (degree && school) return `${degree} at ${school}`;
            return degree || school || '';
          }}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => {
            const isSchool = watch(`education.${i}.type`) === 'school';
            return (
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-xs font-medium text-slate-500">Degree type:</span>
                  <div className="relative flex rounded-lg bg-slate-100 p-0.5 w-48">
                    <div
                      className={`absolute bottom-0.5 top-0.5 w-[calc(50%-2px)] rounded-md bg-white shadow-sm transition-all duration-300 ease-out ${
                        isSchool ? 'left-[calc(50%+1px)]' : 'left-0.5'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setValue(`education.${i}.type`, 'college', { shouldDirty: true })}
                      className={`relative z-10 flex w-1/2 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-1 text-[11px] font-semibold transition-colors duration-300 ${
                        !isSchool ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <FiAward className="text-[12px]" /> College
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue(`education.${i}.type`, 'school', { shouldDirty: true })}
                      className={`relative z-10 flex w-1/2 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-1 text-[11px] font-semibold transition-colors duration-300 ${
                        isSchool ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <FiBookOpen className="text-[12px]" /> School
                    </button>
                  </div>
                </div>

                <ACA
                  label={isSchool ? 'School / Board name' : 'School'}
                  type="institute"
                  name={`education.${i}.school`}
                  required
                  placeholder={isSchool ? 'Delhi Public School / CBSE' : 'University name'}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ACA
                    label={isSchool ? 'Standard / Board' : 'Degree'}
                    type="degree"
                    name={`education.${i}.degree`}
                    placeholder={isSchool ? 'Class XII (CBSE)' : 'B.Tech / M.A.'}
                  />
                  <ACA
                    label={isSchool ? 'Stream' : 'Field of study'}
                    type="field"
                    name={`education.${i}.fieldOfStudy`}
                    placeholder={isSchool ? 'Science / Commerce' : 'Computer Science'}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <CF label="Start year" {...register(`education.${i}.startYear`)} placeholder="2015" />
                  <CF label="End year" {...register(`education.${i}.endYear`)} placeholder="2019" />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-slate-600">
                      {isSchool ? 'Percentage / CGPA' : 'GPA'}{' '}
                      <span className="text-[10px] text-indigo-400">Optional</span>
                    </label>
                    <input
                      type="text"
                      {...register(`education.${i}.gpa`)}
                      placeholder={isSchool ? '95% / 9.8' : '3.8'}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>
              </div>
            );
          }}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add education' : 'Add another education'}
        onClick={() =>
          append({
            id: Date.now().toString(),
            type: 'college',
            school: '',
            degree: '',
            fieldOfStudy: '',
            startYear: '',
            endYear: '',
            gpa: '',
            isHidden: false,
          })
        }
      />
    </div>
  );
}

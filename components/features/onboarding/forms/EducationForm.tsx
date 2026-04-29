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
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2">
                  <span className="text-xs font-medium text-slate-500">Degree type:</span>
                  <div className="relative flex rounded-lg bg-slate-100 p-0.5 w-48 flex-shrink-0">
                    <div
                      className={`absolute bottom-0.5 top-0.5 w-[calc(50%-2px)] rounded-md bg-white shadow-sm transition-all duration-300 ease-out ${
                        isSchool ? 'left-[calc(50%+1px)]' : 'left-0.5'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setValue(`education.${i}.type`, 'college', { shouldDirty: true });
                        setValue(`education.${i}.gpaType`, 'cgpa', { shouldDirty: true });
                      }}
                      className={`relative z-10 flex w-1/2 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-1 text-[11px] font-semibold transition-colors duration-300 ${
                        !isSchool ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <FiAward className="text-[12px]" /> College
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setValue(`education.${i}.type`, 'school', { shouldDirty: true });
                        setValue(`education.${i}.gpaType`, 'percentage', { shouldDirty: true });
                      }}
                      className={`relative z-10 flex w-1/2 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-1 text-[11px] font-semibold transition-colors duration-300 ${
                        isSchool ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <FiBookOpen className="text-[12px]" /> School
                    </button>
                  </div>
                </div>

                <ACA
                  label={isSchool ? 'School / Board name' : 'University / College'}
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
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <CF label="Start year" {...register(`education.${i}.startYear`)} placeholder="2015" />
                  <CF label="End year" {...register(`education.${i}.endYear`)} placeholder="2019" />
                  <div className="col-span-2 flex flex-col gap-1.5 sm:col-span-1">
                    <label className="text-sm text-slate-600">
                      Grade <span className="text-[10px] text-indigo-400">Optional</span>
                    </label>
                    <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/10">
                      <input
                        type="text"
                        {...register(`education.${i}.gpa`)}
                        placeholder={(watch(`education.${i}.gpaType`) ?? (isSchool ? 'percentage' : 'cgpa')) === 'percentage' ? '85' : '8.5'}
                        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-300"
                      />
                      <div className="flex flex-shrink-0 border-l border-slate-200">
                        {(['cgpa', 'percentage'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setValue(`education.${i}.gpaType`, t, { shouldDirty: true })}
                            className={`cursor-pointer px-2 text-[10px] font-semibold transition-colors ${
                              (watch(`education.${i}.gpaType`) ?? (isSchool ? 'percentage' : 'cgpa')) === t
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                            }`}
                          >
                            {t === 'cgpa' ? 'CGPA' : '%'}
                          </button>
                        ))}
                      </div>
                    </div>
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
            gpaType: 'cgpa',
            isHidden: false,
          })
        }
      />
    </div>
  );
}

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { FiActivity, FiPlusCircle } from 'react-icons/fi';
import { CF, ACA, TA } from './FormFields';
import { SortableList } from './SortableList';
import { OnboardingFormValues } from '../types';

export function EmptyState({ title, message }: { title: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/30 py-10 px-4 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
        <FiActivity className="text-lg" />
      </div>
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className="mt-1 text-[11px] text-slate-400">{message || "This section will be omitted from your resume."}</p>
    </div>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-4 text-sm text-slate-400 transition hover:border-indigo-300 hover:bg-slate-50 hover:text-indigo-600">
      <FiPlusCircle className="text-base" /> {label}
    </button>
  );
}

export function ExperienceForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'experience',
  });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No experience added" message="If you are a student or fresher, you can leave this empty or add internships." />
      ) : (
        <SortableList
          fields={fields}
          baseName="experience"
          itemTypeLabel="Position"
          getItemTitle={(field, index) => {
            const role = watch(`experience.${index}.role`);
            const company = watch(`experience.${index}.company`);
            if (role && company) return `${role} at ${company}`;
            return role || company || '';
          }}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => {
            const currentlyWorking = watch(`experience.${i}.currentlyWorking`);
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ACA label="Role" type="role" name={`experience.${i}.role`} required placeholder="Senior Designer" />
                  <ACA label="Company" type="company" name={`experience.${i}.company`} required placeholder="Acme Inc." />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <CF label="Start" {...register(`experience.${i}.start`)} placeholder="YYYY-MM" />
                  <CF label="End" {...register(`experience.${i}.end`)} placeholder={currentlyWorking ? 'Present' : 'YYYY-MM'} disabled={currentlyWorking} />
                  <ACA label="Location" type="location" name={`experience.${i}.location`} placeholder="City, ST" />
                </div>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" {...register(`experience.${i}.currentlyWorking`)} className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600" />
                  <span className="text-sm text-slate-600">I currently work here</span>
                </label>
                <TA label="What you did" {...register(`experience.${i}.description`)} rows={4}
                  placeholder="Describe key achievements. Start with a strong verb. Quantify."
                  hint="One achievement per line. Start with a strong verb. Quantify." />
              </div>
            );
          }}
        />
      )}
      <AddButton label={fields.length === 0 ? "Add experience" : "Add another position"} onClick={() => append({ id: Date.now().toString(), role: '', company: '', start: '', end: '', location: '', currentlyWorking: false, description: '', isHidden: false })} />
    </div>
  );
}

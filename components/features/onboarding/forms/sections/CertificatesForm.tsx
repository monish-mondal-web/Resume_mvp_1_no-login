import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CF, ACA } from '../FormFields';
import { SortableList } from '../SortableList';
import { EmptyState, AddButton } from '../ExperienceForm';
import type { OnboardingFormValues } from '../../types';

export function CertificatesForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'certificates' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No certificates added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="certificates"
          itemTypeLabel="Certificate"
          getItemTitle={(_, i) => watch(`certificates.${i}.name`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => {
            const noExp = watch(`certificates.${i}.noExp`);
            return (
              <div className="space-y-4">
                <CF label="Certificate name" required {...register(`certificates.${i}.name`)} placeholder="AWS Certified Solutions Architect" />
                <ACA label="Issuing organization" type="company" name={`certificates.${i}.issuer`} required placeholder="Amazon Web Services" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <CF label="Issue date" {...register(`certificates.${i}.issueDate`)} placeholder="YYYY-MM" />
                  <CF label="Expiration date" {...register(`certificates.${i}.expDate`)} placeholder={noExp ? 'No expiration' : 'YYYY-MM'} disabled={noExp} />
                </div>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" {...register(`certificates.${i}.noExp`)} className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600" />
                  <span className="text-sm text-slate-600">No expiration date</span>
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <CF label="Credential ID" {...register(`certificates.${i}.credId`)} placeholder="ABC-123" />
                  <CF label="Credential URL" {...register(`certificates.${i}.credUrl`)} placeholder="verify.example.com/cert" />
                </div>
              </div>
            );
          }}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add certificate' : 'Add another certificate'}
        onClick={() => append({ id: Date.now().toString(), name: '', issuer: '', issueDate: '', expDate: '', noExp: false, credId: '', credUrl: '', isHidden: false })}
      />
    </div>
  );
}

import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { CF, ACA, TA } from './FormFields';
import { SortableList } from './SortableList';
import { EmptyState, AddButton } from './ExperienceForm';
import type { OnboardingFormValues } from '../types';

// ── Projects ────────────────────────────────────────────────────────────────
export function ProjectsForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'projects' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No projects added" message="Personal or professional projects help showcase your practical skills." />
      ) : (
        <SortableList
          fields={fields}
          baseName="projects"
          itemTypeLabel="Project"
          getItemTitle={(_, i) => watch(`projects.${i}.title`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => {
            const ongoing = watch(`projects.${i}.ongoing`);
            return (
              <div className="space-y-4">
                <CF label="Project title" required {...register(`projects.${i}.title`)} placeholder="My Awesome Project" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <CF label="Start date" {...register(`projects.${i}.start`)} placeholder="YYYY-MM" />
                  <CF label="End date" {...register(`projects.${i}.end`)} placeholder={ongoing ? 'Ongoing' : 'YYYY-MM'} disabled={ongoing} />
                </div>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" {...register(`projects.${i}.ongoing`)} className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600" />
                  <span className="text-sm text-slate-600">Ongoing project</span>
                </label>
                <TA label="Description" {...register(`projects.${i}.description`)} rows={3} placeholder="What did you build? What problem did it solve? What was the impact?" />
                <CF label="Project URL" {...register(`projects.${i}.url`)} placeholder="github.com/you/project" />
                <CF label="Technologies used" {...register(`projects.${i}.tech`)} placeholder="React, TypeScript, Node.js" hint="Comma-separated list of tools and technologies." />
              </div>
            );
          }}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add project' : 'Add another project'}
        onClick={() => append({ id: Date.now().toString(), title: '', description: '', url: '', start: '', end: '', ongoing: false, tech: '', isHidden: false })}
      />
    </div>
  );
}

// ── Certificates ─────────────────────────────────────────────────────────────
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

// ── Coursework ────────────────────────────────────────────────────────────────
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

// ── Involvement ───────────────────────────────────────────────────────────────
export function InvolvementForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'involvement' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No activities added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="involvement"
          itemTypeLabel="Activity"
          getItemTitle={(_, i) => {
            const role = watch(`involvement.${i}.role`);
            const org = watch(`involvement.${i}.organization`);
            if (role && org) return `${role} at ${org}`;
            return role || org || '';
          }}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => {
            const current = watch(`involvement.${i}.current`);
            return (
              <div className="space-y-4">
                <ACA label="Organization" type="company" name={`involvement.${i}.organization`} required placeholder="Design Club / Student Council" />
                <ACA label="Role / Position" type="role" name={`involvement.${i}.role`} required placeholder="Vice President" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <CF label="Start" {...register(`involvement.${i}.start`)} placeholder="YYYY-MM" />
                  <CF label="End" {...register(`involvement.${i}.end`)} placeholder={current ? 'Present' : 'YYYY-MM'} disabled={current} />
                  <div className="flex items-end pb-2">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input type="checkbox" {...register(`involvement.${i}.current`)} className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600" />
                      <span className="text-sm text-slate-600">Currently active</span>
                    </label>
                  </div>
                </div>
                <TA label="Description" {...register(`involvement.${i}.description`)} rows={3} placeholder="Describe your contributions and impact." />
              </div>
            );
          }}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add activity' : 'Add another activity'}
        onClick={() => append({ id: Date.now().toString(), organization: '', role: '', start: '', end: '', current: false, description: '', isHidden: false })}
      />
    </div>
  );
}

// ── Awards & Honors ───────────────────────────────────────────────────────────
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

// ── Publications ──────────────────────────────────────────────────────────────
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

// ── References ────────────────────────────────────────────────────────────────
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
              <CF label="Relationship" {...register(`references.${i}.relationship`)} placeholder="Direct manager / Colleague / Professor" hint="How do you know this person?" />
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

// ── Achievements ──────────────────────────────────────────────────────────────
export function AchievementsForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'achievements' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No achievements added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="achievements"
          itemTypeLabel="Achievement"
          getItemTitle={(_, i) => watch(`achievements.${i}.title`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-4">
              <CF label="Achievement title" required {...register(`achievements.${i}.title`)} placeholder="Employee of the Month" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ACA label="Issuer" type="company" name={`achievements.${i}.issuer`} placeholder="Company / Organization" />
                <CF label="Date" {...register(`achievements.${i}.date`)} placeholder="2023" />
              </div>
              <TA label="Description" {...register(`achievements.${i}.description`)} rows={3} placeholder="Describe what you achieved." />
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add achievement' : 'Add another achievement'}
        onClick={() => append({ id: Date.now().toString(), title: '', issuer: '', date: '', description: '', isHidden: false })}
      />
    </div>
  );
}

// ── Languages ─────────────────────────────────────────────────────────────────
const PROFICIENCY_LEVELS = ['Elementary', 'Limited Working', 'Professional Working', 'Full Professional', 'Native / Bilingual'];

export function LanguagesForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'languages' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No languages added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="languages"
          itemTypeLabel="Language"
          getItemTitle={(_, i) => watch(`languages.${i}.language`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ACA label="Language" type="language" name={`languages.${i}.language`} required placeholder="Hindi, English, etc." />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-slate-600">Proficiency</label>
                <select
                  {...register(`languages.${i}.proficiency`)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
                >
                  {PROFICIENCY_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add language' : 'Add another language'}
        onClick={() => append({ id: Date.now().toString(), language: '', proficiency: 'Full Professional', isHidden: false })}
      />
    </div>
  );
}

// ── Soft Skills ───────────────────────────────────────────────────────────────
export function SoftSkillsForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'softskills' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No soft skills added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="softskills"
          itemTypeLabel="Soft Skill"
          getItemTitle={(_, i) => watch(`softskills.${i}.skill`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-3">
              <ACA label="Skill / Domain" type="skill" name={`softskills.${i}.skill`} required placeholder="e.g. Problem Solving, Communication" />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-slate-600">Description <span className="text-xs text-slate-400">(optional)</span></label>
                <input
                  {...register(`softskills.${i}.description`)}
                  placeholder="e.g. Debugged complex UI issues across multiple React projects"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add soft skill' : 'Add another soft skill'}
        onClick={() => append({ id: Date.now().toString(), skill: '', description: '', isHidden: false })}
      />
    </div>
  );
}

// ── Internships ───────────────────────────────────────────────────────────────
export function InternshipsForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'internships' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No internships added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="internships"
          itemTypeLabel="Internship"
          getItemTitle={(_, i) => {
            const role = watch(`internships.${i}.role`);
            const company = watch(`internships.${i}.company`);
            if (role && company) return `${role} at ${company}`;
            return role || company || '';
          }}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => {
            const currentlyWorking = watch(`internships.${i}.currentlyWorking`);
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ACA label="Role" type="role" name={`internships.${i}.role`} required placeholder="Design Intern" />
                  <ACA label="Company" type="company" name={`internships.${i}.company`} required placeholder="Google" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <CF label="Start" {...register(`internships.${i}.start`)} placeholder="YYYY-MM" />
                  <CF label="End" {...register(`internships.${i}.end`)} placeholder={currentlyWorking ? 'Ongoing' : 'YYYY-MM'} disabled={currentlyWorking} />
                  <ACA label="Location" type="location" name={`internships.${i}.location`} placeholder="City, ST" />
                </div>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" {...register(`internships.${i}.currentlyWorking`)} className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600" />
                  <span className="text-sm text-slate-600">Currently active</span>
                </label>
                <TA label="Description" {...register(`internships.${i}.description`)} rows={3} placeholder="What did you learn and achieve?" />
              </div>
            );
          }}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add internship' : 'Add another internship'}
        onClick={() => append({ id: Date.now().toString(), role: '', company: '', start: '', end: '', location: '', currentlyWorking: false, description: '', isHidden: false })}
      />
    </div>
  );
}

// ── Freelance Work ────────────────────────────────────────────────────────────
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
          itemTypeLabel="Freelance Project"
          getItemTitle={(_, i) => {
            const role = watch(`freelance.${i}.role`);
            const client = watch(`freelance.${i}.client`);
            if (role && client) return `${role} for ${client}`;
            return role || client || '';
          }}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => {
            const currentlyWorking = watch(`freelance.${i}.currentlyWorking`);
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ACA label="Role" type="role" name={`freelance.${i}.role`} required placeholder="Independent Designer" />
                  <ACA label="Client / Platform" type="company" name={`freelance.${i}.client`} placeholder="Upwork / Private Client" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <CF label="Start" {...register(`freelance.${i}.start`)} placeholder="YYYY-MM" />
                  <CF label="End" {...register(`freelance.${i}.end`)} placeholder={currentlyWorking ? 'Ongoing' : 'YYYY-MM'} disabled={currentlyWorking} />
                </div>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" {...register(`freelance.${i}.currentlyWorking`)} className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600" />
                  <span className="text-sm text-slate-600">Currently active</span>
                </label>
                <TA label="Description" {...register(`freelance.${i}.description`)} rows={3} placeholder="Scope of work and results." />
              </div>
            );
          }}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add freelance role' : 'Add another freelance role'}
        onClick={() => append({ id: Date.now().toString(), role: '', client: '', start: '', end: '', currentlyWorking: false, description: '', isHidden: false })}
      />
    </div>
  );
}

// ── Leadership ────────────────────────────────────────────────────────────────
export function LeadershipForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'leadership' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No leadership roles added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="leadership"
          itemTypeLabel="Leadership"
          getItemTitle={(_, i) => {
            const role = watch(`leadership.${i}.role`);
            const org = watch(`leadership.${i}.organization`);
            if (role && org) return `${role} at ${org}`;
            return role || org || '';
          }}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => {
            const current = watch(`leadership.${i}.current`);
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ACA label="Role" type="role" name={`leadership.${i}.role`} required placeholder="Team Captain / Lead" />
                  <ACA label="Organization" type="company" name={`leadership.${i}.organization`} required placeholder="Designers Club" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <CF label="Start" {...register(`leadership.${i}.start`)} placeholder="YYYY-MM" />
                  <CF label="End" {...register(`leadership.${i}.end`)} placeholder={current ? 'Present' : 'YYYY-MM'} disabled={current} />
                </div>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" {...register(`leadership.${i}.current`)} className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600" />
                  <span className="text-sm text-slate-600">Currently active</span>
                </label>
                <TA label="Description" {...register(`leadership.${i}.description`)} rows={3} placeholder="Leadership impact and responsibilities." />
              </div>
            );
          }}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add leadership role' : 'Add another leadership role'}
        onClick={() => append({ id: Date.now().toString(), role: '', organization: '', start: '', end: '', current: false, description: '', isHidden: false })}
      />
    </div>
  );
}

// ── Volunteering ──────────────────────────────────────────────────────────────
export function VolunteeringForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'volunteering' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No volunteer roles added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="volunteering"
          itemTypeLabel="Volunteer Role"
          getItemTitle={(_, i) => {
            const role = watch(`volunteering.${i}.role`);
            const org = watch(`volunteering.${i}.organization`);
            if (role && org) return `${role} at ${org}`;
            return role || org || '';
          }}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => {
            const current = watch(`volunteering.${i}.current`);
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ACA label="Role" type="role" name={`volunteering.${i}.role`} required placeholder="Mentor / Volunteer" />
                  <ACA label="Organization" type="company" name={`volunteering.${i}.organization`} required placeholder="GirlScript / iVolunteer" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <CF label="Start" {...register(`volunteering.${i}.start`)} placeholder="YYYY-MM" />
                  <CF label="End" {...register(`volunteering.${i}.end`)} placeholder={current ? 'Present' : 'YYYY-MM'} disabled={current} />
                </div>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" {...register(`volunteering.${i}.current`)} className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600" />
                  <span className="text-sm text-slate-600">Currently active</span>
                </label>
                <TA label="Description" {...register(`volunteering.${i}.description`)} rows={3} placeholder="What you did and the value you provided." />
              </div>
            );
          }}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add volunteer role' : 'Add another volunteer role'}
        onClick={() => append({ id: Date.now().toString(), role: '', organization: '', start: '', end: '', current: false, description: '', isHidden: false })}
      />
    </div>
  );
}

// ── Hobbies / Interests ───────────────────────────────────────────────────────
export function HobbiesForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'hobbies' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No hobbies added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="hobbies"
          itemTypeLabel="Hobby / Interest"
          getItemTitle={(_, i) => watch(`hobbies.${i}.name`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <CF label="Name" required {...register(`hobbies.${i}.name`)} placeholder="Photography / Traveling / Coding" />
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add hobby' : 'Add another interest'}
        onClick={() => append({ id: Date.now().toString(), name: '', isHidden: false })}
      />
    </div>
  );
}

// ── Conferences ───────────────────────────────────────────────────────────────
export function ConferencesForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'conferences' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No conferences added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="conferences"
          itemTypeLabel="Event / Workshop"
          getItemTitle={(_, i) => watch(`conferences.${i}.title`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-4">
              <CF label="Event title" required {...register(`conferences.${i}.title`)} placeholder="UX Design Conference" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ACA label="Organizer" type="company" name={`conferences.${i}.organizer`} placeholder="Figma / Adobe" />
                <CF label="Date" {...register(`conferences.${i}.date`)} placeholder="YYYY-MM" />
              </div>
              <TA label="Key takeaways / Description" {...register(`conferences.${i}.description`)} rows={3} placeholder="What did you learn? Did you present?" />
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add event' : 'Add another event'}
        onClick={() => append({ id: Date.now().toString(), title: '', organizer: '', date: '', description: '', isHidden: false })}
      />
    </div>
  );
}

// ── Patents ───────────────────────────────────────────────────────────────────
export function PatentsForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'patents' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No patents added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="patents"
          itemTypeLabel="Patent"
          getItemTitle={(_, i) => watch(`patents.${i}.title`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-4">
              <CF label="Patent title" required {...register(`patents.${i}.title`)} placeholder="System for Dynamic Rendering" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ACA label="Issuing body" type="company" name={`patents.${i}.issuer`} placeholder="USPTO / EPO" />
                <CF label="Date issued" {...register(`patents.${i}.date`)} placeholder="YYYY-MM" />
              </div>
              <CF label="Patent URL" {...register(`patents.${i}.url`)} placeholder="google.com/patents/..." />
              <TA label="Description" {...register(`patents.${i}.description`)} rows={3} placeholder="Brief summary of the invention." />
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add patent' : 'Add another patent'}
        onClick={() => append({ id: Date.now().toString(), title: '', issuer: '', date: '', url: '', description: '', isHidden: false })}
      />
    </div>
  );
}

// ── Extracurricular ───────────────────────────────────────────────────────────
export function ExtracurricularForm() {
  const { control, register, watch } = useFormContext<OnboardingFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'extracurricular' });

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <EmptyState title="No extracurricular activities added" />
      ) : (
        <SortableList
          fields={fields}
          baseName="extracurricular"
          itemTypeLabel="Activity"
          getItemTitle={(_, i) => watch(`extracurricular.${i}.activity`) || ''}
          onMove={move}
          onRemove={remove}
          renderItem={(i) => (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CF label="Activity" required {...register(`extracurricular.${i}.activity`)} placeholder="Chess / Debate" />
                <ACA label="Organization" type="institute" name={`extracurricular.${i}.organization`} placeholder="NIT Trichy / University Club" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CF label="Start" {...register(`extracurricular.${i}.start`)} placeholder="YYYY-MM" />
                <CF label="End" {...register(`extracurricular.${i}.end`)} placeholder="YYYY-MM" />
              </div>
              <TA label="Description" {...register(`extracurricular.${i}.description`)} rows={3} placeholder="Describe your participation." />
            </div>
          )}
        />
      )}
      <AddButton
        label={fields.length === 0 ? 'Add activity' : 'Add another activity'}
        onClick={() => append({ id: Date.now().toString(), activity: '', organization: '', start: '', end: '', description: '', isHidden: false })}
      />
    </div>
  );
}

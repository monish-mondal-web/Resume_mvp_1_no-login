import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

const Spinner = () => (
  <div className="flex h-32 items-center justify-center">
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
  </div>
);

const PersonalForm    = dynamic(() => import('./PersonalForm').then((m) => ({ default: m.PersonalForm })), { loading: () => <Spinner /> });
const ExperienceForm  = dynamic(() => import('./ExperienceForm').then((m) => ({ default: m.ExperienceForm })), { loading: () => <Spinner /> });
const EducationForm   = dynamic(() => import('./EducationForm').then((m) => ({ default: m.EducationForm })), { loading: () => <Spinner /> });
const SkillsForm      = dynamic(() => import('./SkillsForm').then((m) => ({ default: m.SkillsForm })), { loading: () => <Spinner /> });
const MoreForm        = dynamic(() => import('./MoreForm').then((m) => ({ default: m.MoreForm })), { loading: () => <Spinner /> });

const ProjectsForm      = dynamic(() => import('./SectionForms').then((m) => ({ default: m.ProjectsForm })), { loading: () => <Spinner /> });
const CertificatesForm  = dynamic(() => import('./SectionForms').then((m) => ({ default: m.CertificatesForm })), { loading: () => <Spinner /> });
const CourseworkForm    = dynamic(() => import('./SectionForms').then((m) => ({ default: m.CourseworkForm })), { loading: () => <Spinner /> });
const InvolvementForm   = dynamic(() => import('./SectionForms').then((m) => ({ default: m.InvolvementForm })), { loading: () => <Spinner /> });
const AwardsForm        = dynamic(() => import('./SectionForms').then((m) => ({ default: m.AwardsForm })), { loading: () => <Spinner /> });
const PublicationsForm  = dynamic(() => import('./SectionForms').then((m) => ({ default: m.PublicationsForm })), { loading: () => <Spinner /> });
const ReferencesForm    = dynamic(() => import('./SectionForms').then((m) => ({ default: m.ReferencesForm })), { loading: () => <Spinner /> });
const AchievementsForm  = dynamic(() => import('./SectionForms').then((m) => ({ default: m.AchievementsForm })), { loading: () => <Spinner /> });
const LanguagesForm     = dynamic(() => import('./SectionForms').then((m) => ({ default: m.LanguagesForm })), { loading: () => <Spinner /> });
const SoftSkillsForm    = dynamic(() => import('./SectionForms').then((m) => ({ default: m.SoftSkillsForm })), { loading: () => <Spinner /> });
const InternshipsForm   = dynamic(() => import('./SectionForms').then((m) => ({ default: m.InternshipsForm })), { loading: () => <Spinner /> });
const FreelanceForm     = dynamic(() => import('./SectionForms').then((m) => ({ default: m.FreelanceForm })), { loading: () => <Spinner /> });
const LeadershipForm    = dynamic(() => import('./SectionForms').then((m) => ({ default: m.LeadershipForm })), { loading: () => <Spinner /> });
const VolunteeringForm  = dynamic(() => import('./SectionForms').then((m) => ({ default: m.VolunteeringForm })), { loading: () => <Spinner /> });
const HobbiesForm       = dynamic(() => import('./SectionForms').then((m) => ({ default: m.HobbiesForm })), { loading: () => <Spinner /> });
const ConferencesForm   = dynamic(() => import('./SectionForms').then((m) => ({ default: m.ConferencesForm })), { loading: () => <Spinner /> });
const PatentsForm       = dynamic(() => import('./SectionForms').then((m) => ({ default: m.PatentsForm })), { loading: () => <Spinner /> });
const ExtracurricularForm = dynamic(() => import('./SectionForms').then((m) => ({ default: m.ExtracurricularForm })), { loading: () => <Spinner /> });

export const formRegistry: Record<string, ComponentType> = {
  personal:        PersonalForm,
  experience:      ExperienceForm,
  education:       EducationForm,
  skills:          SkillsForm,
  more:            MoreForm,
  projects:        ProjectsForm,
  certificates:    CertificatesForm,
  coursework:      CourseworkForm,
  involvement:     InvolvementForm,
  awards:          AwardsForm,
  publications:    PublicationsForm,
  references:      ReferencesForm,
  achievements:    AchievementsForm,
  languages:       LanguagesForm,
  softskills:      SoftSkillsForm,
  internships:     InternshipsForm,
  freelance:       FreelanceForm,
  leadership:      LeadershipForm,
  volunteering:    VolunteeringForm,
  hobbies:         HobbiesForm,
  conferences:     ConferencesForm,
  patents:         PatentsForm,
  extracurricular: ExtracurricularForm,
};

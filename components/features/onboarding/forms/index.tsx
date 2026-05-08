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

const ProjectsForm      = dynamic(() => import('./sections/ProjectsForm').then((m) => ({ default: m.ProjectsForm })), { loading: () => <Spinner /> });
const CertificatesForm  = dynamic(() => import('./sections/CertificatesForm').then((m) => ({ default: m.CertificatesForm })), { loading: () => <Spinner /> });
const CourseworkForm    = dynamic(() => import('./sections/CourseworkForm').then((m) => ({ default: m.CourseworkForm })), { loading: () => <Spinner /> });
const InvolvementForm   = dynamic(() => import('./sections/InvolvementForm').then((m) => ({ default: m.InvolvementForm })), { loading: () => <Spinner /> });
const AwardsForm        = dynamic(() => import('./sections/AwardsForm').then((m) => ({ default: m.AwardsForm })), { loading: () => <Spinner /> });
const PublicationsForm  = dynamic(() => import('./sections/PublicationsForm').then((m) => ({ default: m.PublicationsForm })), { loading: () => <Spinner /> });
const ReferencesForm    = dynamic(() => import('./sections/ReferencesForm').then((m) => ({ default: m.ReferencesForm })), { loading: () => <Spinner /> });
const AchievementsForm  = dynamic(() => import('./sections/AchievementsForm').then((m) => ({ default: m.AchievementsForm })), { loading: () => <Spinner /> });
const LanguagesForm     = dynamic(() => import('./sections/LanguagesForm').then((m) => ({ default: m.LanguagesForm })), { loading: () => <Spinner /> });
const SoftSkillsForm    = dynamic(() => import('./sections/SoftSkillsForm').then((m) => ({ default: m.SoftSkillsForm })), { loading: () => <Spinner /> });
const InternshipsForm   = dynamic(() => import('./sections/InternshipsForm').then((m) => ({ default: m.InternshipsForm })), { loading: () => <Spinner /> });
const FreelanceForm     = dynamic(() => import('./sections/FreelanceForm').then((m) => ({ default: m.FreelanceForm })), { loading: () => <Spinner /> });
const LeadershipForm    = dynamic(() => import('./sections/LeadershipForm').then((m) => ({ default: m.LeadershipForm })), { loading: () => <Spinner /> });
const VolunteeringForm  = dynamic(() => import('./sections/VolunteeringForm').then((m) => ({ default: m.VolunteeringForm })), { loading: () => <Spinner /> });
const HobbiesForm       = dynamic(() => import('./sections/HobbiesForm').then((m) => ({ default: m.HobbiesForm })), { loading: () => <Spinner /> });
const ConferencesForm   = dynamic(() => import('./sections/ConferencesForm').then((m) => ({ default: m.ConferencesForm })), { loading: () => <Spinner /> });
const PatentsForm       = dynamic(() => import('./sections/PatentsForm').then((m) => ({ default: m.PatentsForm })), { loading: () => <Spinner /> });
const ExtracurricularForm = dynamic(() => import('./sections/ExtracurricularForm').then((m) => ({ default: m.ExtracurricularForm })), { loading: () => <Spinner /> });

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

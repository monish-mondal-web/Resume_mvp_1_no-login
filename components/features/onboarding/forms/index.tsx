import { PersonalForm } from './PersonalForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';

// Placeholder for unmigrated forms
const PlaceholderForm = ({ name }: { name: string }) => (
  <div className="p-8 text-center text-slate-500 border border-dashed rounded-xl">
    <p>{name} Form (Pending Migration to React Hook Form)</p>
  </div>
);

export const formRegistry: Record<string, React.ComponentType<any>> = {
  personal: PersonalForm,
  experience: ExperienceForm,
  education: EducationForm,
  skills: () => <PlaceholderForm name="Skills" />,
  projects: () => <PlaceholderForm name="Projects" />,
  certificates: () => <PlaceholderForm name="Certificates" />,
  coursework: () => <PlaceholderForm name="Coursework" />,
  involvement: () => <PlaceholderForm name="Involvement" />,
  awards: () => <PlaceholderForm name="Awards" />,
  publications: () => <PlaceholderForm name="Publications" />,
  references: () => <PlaceholderForm name="References" />,
  achievements: () => <PlaceholderForm name="Achievements" />,
  languages: () => <PlaceholderForm name="Languages" />,
  softskills: () => <PlaceholderForm name="Soft Skills" />,
  internships: () => <PlaceholderForm name="Internships" />,
  freelance: () => <PlaceholderForm name="Freelance" />,
  leadership: () => <PlaceholderForm name="Leadership" />,
  volunteering: () => <PlaceholderForm name="Volunteering" />,
  hobbies: () => <PlaceholderForm name="Hobbies" />,
  conferences: () => <PlaceholderForm name="Conferences" />,
  patents: () => <PlaceholderForm name="Patents" />,
  extracurricular: () => <PlaceholderForm name="Extracurricular" />,
  more: () => <PlaceholderForm name="Add More Sections" />,
};

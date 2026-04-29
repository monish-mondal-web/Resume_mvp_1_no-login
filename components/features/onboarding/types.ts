export interface PersonalInfo {
  firstName: string;
  lastName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  website: string;
  linkedIn: string;
  links: { type: string; url: string }[];
  image: { url: string; publicId: string } | null;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  start: string;
  end: string;
  location: string;
  currentlyWorking: boolean;
  description: string;
  isHidden?: boolean;
}

export interface EducationEntry {
  id: string;
  type?: 'college' | 'school';
  school: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  gpa: string;
  gpaType?: 'cgpa' | 'percentage';
  isHidden?: boolean;
}

export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  url: string;
  start: string;
  end: string;
  ongoing: boolean;
  tech: string;
  isHidden?: boolean;
}

export interface CertEntry {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expDate: string;
  noExp: boolean;
  credId: string;
  credUrl: string;
  isHidden?: boolean;
}

export interface CourseworkEntry {
  id: string;
  course: string;
  institution: string;
  grade: string;
  year: string;
  isHidden?: boolean;
}

export interface InvolvementEntry {
  id: string;
  organization: string;
  role: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
  isHidden?: boolean;
}

export interface AwardEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
  isHidden?: boolean;
}

export interface PublicationEntry {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url: string;
  description: string;
  isHidden?: boolean;
}

export interface ReferenceEntry {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
  isHidden?: boolean;
}

export interface AchievementEntry {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  isHidden?: boolean;
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: string;
  isHidden?: boolean;
}

export interface SoftSkillEntry {
  id: string;
  skill: string;
  description?: string;
  isHidden?: boolean;
}

export interface SkillGroupEntry {
  id?: string;
  category?: string;  // e.g. "Frontend" — rendered bold; leave empty for no label
  items?: string[];   // individual skill tags, e.g. ["HTML", "CSS", "React.js"]
  isHidden?: boolean;
}

export interface InternshipEntry {
  id: string;
  role: string;
  company: string;
  start: string;
  end: string;
  location: string;
  currentlyWorking: boolean;
  description: string;
  isHidden?: boolean;
}

export interface FreelanceEntry {
  id: string;
  role: string;
  client: string;
  start: string;
  end: string;
  currentlyWorking: boolean;
  description: string;
  isHidden?: boolean;
}

export interface LeadershipEntry {
  id: string;
  role: string;
  organization: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
  isHidden?: boolean;
}

export interface VolunteerEntry {
  id: string;
  role: string;
  organization: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
  isHidden?: boolean;
}

export interface InterestEntry {
  id: string;
  name: string;
  isHidden?: boolean;
}

export interface ConferenceEntry {
  id: string;
  title: string;
  organizer: string;
  date: string;
  description: string;
  isHidden?: boolean;
}

export interface PatentEntry {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url: string;
  description: string;
  isHidden?: boolean;
}

export interface ExtracurricularEntry {
  id: string;
  activity: string;
  organization: string;
  start: string;
  end: string;
  description: string;
  isHidden?: boolean;
}

export interface StepConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export interface OnboardingFormValues {
  personalInfo: PersonalInfo;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillGroupEntry[];
  projects: ProjectEntry[];
  certificates: CertEntry[];
  coursework: CourseworkEntry[];
  involvement: InvolvementEntry[];
  awards: AwardEntry[];
  publications: PublicationEntry[];
  references: ReferenceEntry[];
  achievements: AchievementEntry[];
  languages: LanguageEntry[];
  softskills: SoftSkillEntry[];
  internships: InternshipEntry[];
  freelance: FreelanceEntry[];
  leadership: LeadershipEntry[];
  volunteering: VolunteerEntry[];
  hobbies: InterestEntry[];
  conferences: ConferenceEntry[];
  patents: PatentEntry[];
  extracurricular: ExtracurricularEntry[];
}

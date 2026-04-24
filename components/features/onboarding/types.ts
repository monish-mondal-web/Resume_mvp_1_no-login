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
  // Other forms will be added here
}

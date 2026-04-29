// ── Section Data Types ───────────────────────────────────────────────────────

export interface ResumePersonal {
  firstName: string;
  lastName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  links: { type: string; url: string }[];
  image: { url: string; publicId: string } | null;
}

export interface ResumeExperience {
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

export interface ResumeEducation {
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

export interface ResumeProject {
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

export interface ResumeCert {
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

export interface ResumeCoursework {
  id: string;
  course: string;
  institution: string;
  grade: string;
  year: string;
  isHidden?: boolean;
}

export interface ResumeInvolvement {
  id: string;
  organization: string;
  role: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
  isHidden?: boolean;
}

export interface ResumeAward {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
  isHidden?: boolean;
}

export interface ResumePublication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url: string;
  description: string;
  isHidden?: boolean;
}

export interface ResumeReference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
  isHidden?: boolean;
}

export interface ResumeAchievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  isHidden?: boolean;
}

export interface ResumeLanguage {
  id: string;
  language: string;
  proficiency: string;
  isHidden?: boolean;
}

export interface ResumeSoftSkill {
  id: string;
  skill: string;
  description?: string;
  isHidden?: boolean;
}

export interface ResumeInternship {
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

export interface ResumeFreelance {
  id: string;
  role: string;
  client: string;
  start: string;
  end: string;
  currentlyWorking: boolean;
  description: string;
  isHidden?: boolean;
}

export interface ResumeLeadership {
  id: string;
  role: string;
  organization: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
  isHidden?: boolean;
}

export interface ResumeVolunteer {
  id: string;
  role: string;
  organization: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
  isHidden?: boolean;
}

export interface ResumeInterest {
  id: string;
  name: string;
  isHidden?: boolean;
}

export interface ResumeConference {
  id: string;
  title: string;
  organizer: string;
  date: string;
  description: string;
  isHidden?: boolean;
}

export interface ResumePatent {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url: string;
  description: string;
  isHidden?: boolean;
}

export interface ResumeExtracurricular {
  id: string;
  activity: string;
  organization: string;
  start: string;
  end: string;
  description: string;
  isHidden?: boolean;
}

// ── Template & Design Types ──────────────────────────────────────────────────

export type TemplateId = 'template1' | 'template2' | 'template3';

export type AccentColor =
  | 'indigo' | 'violet' | 'blue' | 'sky' | 'teal'
  | 'emerald' | 'rose' | 'orange' | 'amber' | 'slate';

export type FontSize = 'sm' | 'md' | 'lg';

export type SpacingOption = 'compact' | 'normal' | 'relaxed';

export type FontFamily = 'sans' | 'serif' | 'mono' | 'inter' | 'georgia';

export type PagePadding  = 'narrow' | 'normal' | 'wide';
export type LineWeight   = 'thin' | 'normal' | 'thick';
export type ImageShape   = 'circle' | 'rounded' | 'square';
export type ImageSize    = 'sm' | 'md' | 'lg';

export interface TemplateOptions {
  accentColor: AccentColor;
  fontSize: FontSize;
  spacing: SpacingOption;
  fontFamily: FontFamily;
  showPhoto: boolean;
  customAccentColor?: string;
  pagePadding?: PagePadding;
  linkColor?: string;
  lineWeight?: LineWeight;
  headingFont?: FontFamily;
  showContactIcons?: boolean;
  imageShape?: ImageShape;
  imageSize?: ImageSize;
  imageBorder?: boolean;
}

export const DEFAULT_TEMPLATE_OPTIONS: TemplateOptions = {
  accentColor: 'indigo',
  fontSize: 'md',
  spacing: 'normal',
  fontFamily: 'sans',
  showPhoto: true,
  pagePadding: 'normal',
};

export const ACCENT_COLORS: Record<AccentColor, { hex: string; label: string; tw: string }> = {
  indigo:  { hex: '#6366f1', label: 'Indigo',  tw: 'indigo'  },
  violet:  { hex: '#8b5cf6', label: 'Violet',  tw: 'violet'  },
  blue:    { hex: '#3b82f6', label: 'Blue',    tw: 'blue'    },
  sky:     { hex: '#0ea5e9', label: 'Sky',     tw: 'sky'     },
  teal:    { hex: '#14b8a6', label: 'Teal',    tw: 'teal'    },
  emerald: { hex: '#10b981', label: 'Emerald', tw: 'emerald' },
  rose:    { hex: '#f43f5e', label: 'Rose',    tw: 'rose'    },
  orange:  { hex: '#f97316', label: 'Orange',  tw: 'orange'  },
  amber:   { hex: '#f59e0b', label: 'Amber',   tw: 'amber'   },
  slate:   { hex: '#64748b', label: 'Slate',   tw: 'slate'   },
};

export const FONT_FAMILY_MAP: Record<FontFamily, string> = {
  sans:    'ui-sans-serif, system-ui, sans-serif',
  serif:   'var(--font-lora), Georgia, serif',
  mono:    'ui-monospace, "Courier New", monospace',
  inter:   'var(--font-inter), ui-sans-serif, sans-serif',
  georgia: 'Georgia, "Times New Roman", serif',
};

// ── ResumeData (full document) ───────────────────────────────────────────────

export interface ResumeData {
  personal: ResumePersonal;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: string[];
  projects: ResumeProject[];
  certificates: ResumeCert[];
  coursework: ResumeCoursework[];
  involvement: ResumeInvolvement[];
  awards: ResumeAward[];
  publications: ResumePublication[];
  references: ResumeReference[];
  achievements: ResumeAchievement[];
  languages: ResumeLanguage[];
  softskills: ResumeSoftSkill[];
  internships: ResumeInternship[];
  freelance: ResumeFreelance[];
  leadership: ResumeLeadership[];
  volunteering: ResumeVolunteer[];
  hobbies: ResumeInterest[];
  conferences: ResumeConference[];
  patents: ResumePatent[];
  extracurricular: ResumeExtracurricular[];
  sectionOrder: string[];
  enabledSections: string[];
}

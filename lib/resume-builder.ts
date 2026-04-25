import type {
  ResumeData,
  ResumePersonal,
  ResumeExperience,
  ResumeEducation,
  ResumeProject,
  ResumeCert,
  ResumeCoursework,
  ResumeInvolvement,
  ResumeAward,
  ResumePublication,
  ResumeReference,
  ResumeAchievement,
  ResumeLanguage,
  ResumeSoftSkill,
  ResumeInternship,
  ResumeFreelance,
  ResumeLeadership,
  ResumeVolunteer,
  ResumeInterest,
  ResumeConference,
  ResumePatent,
  ResumeExtracurricular,
} from '@/types/resume.types';

interface BuildResumeInput {
  personalInfo?: ResumePersonal;
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
  selectedMoreIds: string[];
  stepOrder: string[];
}

const EMPTY_PERSONAL: ResumePersonal = {
  firstName: '', lastName: '', professionalTitle: '',
  email: '', phone: '', location: '', summary: '', links: [], image: null,
};

export function buildResume(input: BuildResumeInput): ResumeData {
  const enabledSections = [
    'personal',
    'experience',
    'education',
    'skills',
    ...input.selectedMoreIds,
  ];

  return {
    personal: input.personalInfo ?? EMPTY_PERSONAL,
    experience: input.experience,
    education: input.education,
    skills: input.skills,
    projects: input.projects,
    certificates: input.certificates,
    coursework: input.coursework,
    involvement: input.involvement,
    awards: input.awards,
    publications: input.publications,
    references: input.references,
    achievements: input.achievements,
    languages: input.languages,
    softskills: input.softskills,
    internships: input.internships,
    freelance: input.freelance,
    leadership: input.leadership,
    volunteering: input.volunteering,
    hobbies: input.hobbies,
    conferences: input.conferences,
    patents: input.patents,
    extracurricular: input.extracurricular,
    sectionOrder: input.stepOrder,
    enabledSections,
  };
}

export interface ATSResult {
  score: number;
  tips: string[];
}

export function computeATSScore(data: ResumeData): ATSResult {
  let score = 0;
  const tips: string[] = [];

  const p = data.personal;

  // Contact info (20 pts)
  if (p.firstName && p.lastName) score += 5;
  else tips.push('Add your full name');

  if (p.email) score += 5;
  else tips.push('Add a professional email address');

  if (p.phone) score += 5;
  else tips.push('Add a phone number');

  if (p.location) score += 5;
  else tips.push('Add your location (City, State)');

  // Summary (10 pts)
  if (p.summary && p.summary.length > 80) score += 10;
  else if (p.summary) score += 5, tips.push('Expand your summary to 2-3 sentences');
  else tips.push('Add a professional summary');

  // Experience (25 pts)
  const visibleExp = data.experience.filter(e => !e.isHidden);
  if (visibleExp.length >= 2) score += 20;
  else if (visibleExp.length === 1) score += 12;
  else tips.push('Add work experience');

  const hasActionVerbs = visibleExp.some(e =>
    /\b(built|led|designed|developed|improved|increased|reduced|managed|created|launched)\b/i.test(e.description)
  );
  if (hasActionVerbs) score += 5;
  else tips.push('Use strong action verbs (Built, Led, Designed…)');

  // Education (10 pts)
  if (data.education.filter(e => !e.isHidden).length > 0) score += 10;
  else tips.push('Add your education');

  // Skills (15 pts)
  if (data.skills.length >= 8) score += 15;
  else if (data.skills.length >= 4) score += 8;
  else tips.push('Add at least 8 relevant skills');

  // Projects (10 pts)
  const visibleProj = data.projects.filter(p => !p.isHidden);
  if (visibleProj.length >= 2) score += 10;
  else if (visibleProj.length === 1) score += 5;

  // Links (5 pts)
  const hasLinkedIn = p.links.some(l => l.type === 'linkedin' && l.url);
  const hasGithub   = p.links.some(l => l.type === 'github'   && l.url);
  if (hasLinkedIn) score += 3;
  else tips.push('Add your LinkedIn profile URL');
  if (hasGithub) score += 2;

  // Certifications (5 pts)
  if (data.certificates.filter(c => !c.isHidden).length > 0) score += 5;

  return {
    score: Math.min(100, score),
    tips: tips.slice(0, 5),
  };
}

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

export interface ATSCategory {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  tips: string[];
  checks: { label: string; passed: boolean }[];
}

export interface ATSResult {
  score: number;
  tips: string[];
  categories: ATSCategory[];
}

export function computeATSScore(data: ResumeData): ATSResult {
  const p = data.personal;
  const categories: ATSCategory[] = [];
  let totalScore = 0;

  // ── Contact Info (20 pts) ────────────────────────────────
  {
    let s = 0; const tips: string[] = [];
    const checks = [
      { label: 'Full name',     passed: !!(p.firstName && p.lastName) },
      { label: 'Email address', passed: !!p.email                     },
      { label: 'Phone number',  passed: !!p.phone                     },
      { label: 'Location',      passed: !!p.location                  },
    ];
    if (checks[0].passed) s += 5; else tips.push('Add your full name');
    if (checks[1].passed) s += 5; else tips.push('Add a professional email address');
    if (checks[2].passed) s += 5; else tips.push('Add a phone number');
    if (checks[3].passed) s += 5; else tips.push('Add your location (City, State)');
    totalScore += s;
    categories.push({ id: 'contact', name: 'Contact Info', score: s, maxScore: 20, tips, checks });
  }

  // ── Professional Summary (10 pts) ────────────────────────
  {
    let s = 0; const tips: string[] = [];
    const hasShort  = !!(p.summary && p.summary.length > 0);
    const hasDetail = !!(p.summary && p.summary.length > 80);
    const checks = [
      { label: 'Summary present',      passed: hasShort  },
      { label: '2+ sentence summary',  passed: hasDetail },
    ];
    if (hasDetail) s += 10;
    else if (hasShort) { s += 5; tips.push('Expand your summary to at least 2 sentences'); }
    else tips.push('Add a professional summary to introduce yourself');
    totalScore += s;
    categories.push({ id: 'summary', name: 'Professional Summary', score: s, maxScore: 10, tips, checks });
  }

  // ── Work Experience (25 pts) ─────────────────────────────
  {
    let s = 0; const tips: string[] = [];
    const visibleExp = data.experience.filter(e => !e.isHidden);
    const hasActionVerbs = visibleExp.some(e =>
      /\b(built|led|designed|developed|improved|increased|reduced|managed|created|launched|delivered|architected|scaled|optimized)\b/i
        .test(e.description ?? '')
    );
    const hasQuantified = visibleExp.some(e =>
      /\d+[%x$kmK]|\d+\s*(users|clients|team|engineers|transactions|requests)/i.test(e.description ?? '')
    );
    const checks = [
      { label: '1+ job entries',         passed: visibleExp.length >= 1 },
      { label: '2+ job entries',         passed: visibleExp.length >= 2 },
      { label: 'Strong action verbs',    passed: hasActionVerbs          },
      { label: 'Quantified impact',      passed: hasQuantified           },
    ];
    if (visibleExp.length >= 2)     s += 15;
    else if (visibleExp.length === 1) s += 8;
    else tips.push('Add at least one work experience entry');
    if (hasActionVerbs) s += 5; else tips.push('Use action verbs: Built, Led, Designed, Improved…');
    if (hasQuantified)  s += 5; else tips.push('Quantify achievements (e.g., "improved speed by 40%")');
    totalScore += s;
    categories.push({ id: 'experience', name: 'Work Experience', score: s, maxScore: 25, tips, checks });
  }

  // ── Education (10 pts) ───────────────────────────────────
  {
    let s = 0; const tips: string[] = [];
    const visibleEdu = data.education.filter(e => !e.isHidden);
    const hasDegree  = visibleEdu.some(e => e.degree);
    const checks = [
      { label: 'Education entry',  passed: visibleEdu.length > 0 },
      { label: 'Degree specified', passed: hasDegree             },
    ];
    if (visibleEdu.length > 0) s += 10; else tips.push('Add your education background');
    totalScore += s;
    categories.push({ id: 'education', name: 'Education', score: s, maxScore: 10, tips, checks });
  }

  // ── Skills (15 pts) ─────────────────────────────────────
  {
    let s = 0; const tips: string[] = [];
    // count individual skill tokens across all skill strings
    const skillCount = data.skills.reduce((acc, raw) => {
      const items = raw.includes(':') ? raw.split(':')[1] : raw;
      return acc + items.split(',').filter(Boolean).length;
    }, 0);
    const hasCategories = data.skills.some(s => s.includes(':'));
    const checks = [
      { label: '4+ skills listed',       passed: skillCount >= 4  },
      { label: '8+ skills listed',       passed: skillCount >= 8  },
      { label: 'Skills categorised',     passed: hasCategories    },
    ];
    if (skillCount >= 8) s += 15;
    else if (skillCount >= 4) { s += 8; tips.push('Add more relevant skills (aim for 8+)'); }
    else tips.push('Add at least 8 relevant technical skills');
    if (!hasCategories && skillCount >= 4) tips.push('Group skills into categories (e.g., Backend, Frontend)');
    totalScore += s;
    categories.push({ id: 'skills', name: 'Skills', score: s, maxScore: 15, tips, checks });
  }

  // ── Projects & Presence (20 pts) ────────────────────────
  {
    let s = 0; const tips: string[] = [];
    const projEnabled = data.enabledSections.includes('projects');
    const certsEnabled = data.enabledSections.includes('certificates');
    const visibleProj = projEnabled ? data.projects.filter(pp => !pp.isHidden) : [];
    const hasLinkedIn = p.links.some(l => l.type === 'linkedin' && l.url);
    const hasGithub   = p.links.some(l => l.type === 'github'   && l.url);
    const hasCerts    = certsEnabled ? data.certificates.filter(c => !c.isHidden).length > 0 : false;
    const checks = [
      { label: '1+ project',        passed: visibleProj.length >= 1 },
      { label: '2+ projects',       passed: visibleProj.length >= 2 },
      { label: 'LinkedIn URL',      passed: hasLinkedIn              },
      { label: 'GitHub URL',        passed: hasGithub                },
      { label: 'Certifications',    passed: hasCerts                 },
    ];
    if (visibleProj.length >= 2) s += 10; else if (visibleProj.length === 1) s += 5;
    if (hasLinkedIn) s += 3; else tips.push('Add your LinkedIn profile URL');
    if (hasGithub)   s += 2; else tips.push('Add your GitHub profile URL');
    if (hasCerts)    s += 5;
    totalScore += s;
    categories.push({ id: 'presence', name: 'Projects & Presence', score: s, maxScore: 20, tips, checks });
  }

  const allTips = categories.flatMap(c => c.tips);
  return {
    score: Math.min(90, totalScore),
    tips: allTips.slice(0, 5),
    categories,
  };
}

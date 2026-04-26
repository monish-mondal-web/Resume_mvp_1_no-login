import { z } from 'zod';

// ── Shared schemas ──
const ImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().optional().or(z.literal('')),
}).nullable();

// ── Core section schemas ──
const ExperienceSchema = z.object({
  id: z.string(),
  role: z.string().min(1, 'Role is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  currentlyWorking: z.boolean().optional(),
  description: z.string().optional(),
  isHidden: z.boolean().optional(),
});

const EducationSchema = z.object({
  id: z.string(),
  type: z.enum(['school', 'college']).optional(),
  school: z.string().min(1, 'School is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().optional(),
  startYear: z.string().optional(),
  endYear: z.string().optional(),
  gpa: z.string().optional(),
  isHidden: z.boolean().optional(),
});

const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  url: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  ongoing: z.boolean().optional(),
  tech: z.string().optional(),
  isHidden: z.boolean().optional(),
});

// ── Additional section schemas ──
const CertificateSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  issuer: z.string().optional(),
  issueDate: z.string().optional(),
  expDate: z.string().optional(),
  noExp: z.boolean().optional(),
  credId: z.string().optional(),
  credUrl: z.string().optional(),
  isHidden: z.boolean().optional(),
});

const CourseworkSchema = z.object({
  id: z.string(),
  course: z.string().optional(),
  institution: z.string().optional(),
  grade: z.string().optional(),
  year: z.string().optional(),
  isHidden: z.boolean().optional(),
});

const InvolvementSchema = z.object({
  id: z.string(),
  organization: z.string().optional(),
  role: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  isHidden: z.boolean().optional(),
});

const AwardSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  issuer: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
  isHidden: z.boolean().optional(),
});

const PublicationSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  publisher: z.string().optional(),
  date: z.string().optional(),
  url: z.string().optional(),
  description: z.string().optional(),
  isHidden: z.boolean().optional(),
});

const ReferenceSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  title: z.string().optional(),
  company: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  relationship: z.string().optional(),
  isHidden: z.boolean().optional(),
});

const AchievementSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  issuer: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
  isHidden: z.boolean().optional(),
});

const LanguageSchema = z.object({
  id: z.string(),
  language: z.string().optional(),
  proficiency: z.string().optional(),
  isHidden: z.boolean().optional(),
});

const SoftSkillSchema = z.object({
  id: z.string(),
  skill: z.string().optional(),
  isHidden: z.boolean().optional(),
});

const InternshipSchema = z.object({
  id: z.string(),
  role: z.string().optional(),
  company: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  location: z.string().optional(),
  currentlyWorking: z.boolean().optional(),
  description: z.string().optional(),
  isHidden: z.boolean().optional(),
});

const FreelanceSchema = z.object({
  id: z.string(),
  role: z.string().optional(),
  client: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  currentlyWorking: z.boolean().optional(),
  description: z.string().optional(),
  isHidden: z.boolean().optional(),
});

const LeadershipSchema = z.object({
  id: z.string(),
  role: z.string().optional(),
  organization: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  isHidden: z.boolean().optional(),
});

const VolunteeringSchema = z.object({
  id: z.string(),
  role: z.string().optional(),
  organization: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  isHidden: z.boolean().optional(),
});

const HobbySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  isHidden: z.boolean().optional(),
});

const ConferenceSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  organizer: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
  isHidden: z.boolean().optional(),
});

const PatentSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  issuer: z.string().optional(),
  date: z.string().optional(),
  url: z.string().optional(),
  description: z.string().optional(),
  isHidden: z.boolean().optional(),
});

const ExtracurricularSchema = z.object({
  id: z.string(),
  activity: z.string().optional(),
  organization: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  description: z.string().optional(),
  isHidden: z.boolean().optional(),
});

// ── Main Onboarding Schema ──
export const OnboardingSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().optional(),
    professionalTitle: z.string().optional(),
    location: z.string().optional(),
    summary: z.string().optional(),
    website: z.string().optional(),
    linkedIn: z.string().optional(),
    links: z.array(z.object({
      type: z.string(),
      url: z.string(),
    })).optional(),
    image: ImageSchema,
  }),
  onboardingData: z.object({
    experience: z.array(ExperienceSchema),
    education: z.array(EducationSchema),
    skills: z.array(z.string()),
    projects: z.array(ProjectSchema),
    certificates: z.array(CertificateSchema).optional(),
    coursework: z.array(CourseworkSchema).optional(),
    involvement: z.array(InvolvementSchema).optional(),
    awards: z.array(AwardSchema).optional(),
    publications: z.array(PublicationSchema).optional(),
    references: z.array(ReferenceSchema).optional(),
    achievements: z.array(AchievementSchema).optional(),
    languages: z.array(LanguageSchema).optional(),
    softskills: z.array(SoftSkillSchema).optional(),
    internships: z.array(InternshipSchema).optional(),
    freelance: z.array(FreelanceSchema).optional(),
    leadership: z.array(LeadershipSchema).optional(),
    volunteering: z.array(VolunteeringSchema).optional(),
    hobbies: z.array(HobbySchema).optional(),
    conferences: z.array(ConferenceSchema).optional(),
    patents: z.array(PatentSchema).optional(),
    extracurricular: z.array(ExtracurricularSchema).optional(),
  }),
});

export type OnboardingInput = z.infer<typeof OnboardingSchema>;

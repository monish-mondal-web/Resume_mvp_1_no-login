import { z } from 'zod';

// ── Shared schemas ──
const ImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().optional().or(z.literal('')),
}).nullable();

// ── Section schemas ──
const ExperienceSchema = z.object({
  id: z.string(),
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
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
  school: z.string().min(1, "School is required"),
  degree: z.string().min(1, "Degree is required"),
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

// ── Main Onboarding Schema ──
export const OnboardingSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
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
    // Additional sections (flexible but typed)
    certificates: z.array(z.any()).optional(),
    coursework: z.array(z.any()).optional(),
    involvement: z.array(z.any()).optional(),
    awards: z.array(z.any()).optional(),
    publications: z.array(z.any()).optional(),
    references: z.array(z.any()).optional(),
    achievements: z.array(z.any()).optional(),
    languages: z.array(z.any()).optional(),
    softskills: z.array(z.any()).optional(),
    internships: z.array(z.any()).optional(),
    freelance: z.array(z.any()).optional(),
    leadership: z.array(z.any()).optional(),
    volunteering: z.array(z.any()).optional(),
    hobbies: z.array(z.any()).optional(),
    conferences: z.array(z.any()).optional(),
    patents: z.array(z.any()).optional(),
    extracurricular: z.array(z.any()).optional(),
  }),
});

export type OnboardingInput = z.infer<typeof OnboardingSchema>;

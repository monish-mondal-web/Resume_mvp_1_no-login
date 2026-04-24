'use client';

import dynamic from 'next/dynamic';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors,
  closestCenter, PointerSensor, KeyboardSensor, type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core';
import {
  restrictToVerticalAxis,
  restrictToFirstScrollableAncestor,
} from '@dnd-kit/modifiers';
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Autocomplete } from '@/components/ui/Autocomplete';
import Image from 'next/image';
import type { SuggestionType } from '@/models/Suggestion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/features/home/Navbar';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  FiUser, FiBriefcase, FiBookOpen, FiStar, FiPlusCircle, FiPlus,
  FiAward, FiFileText, FiLink, FiUsers, FiArrowRight, FiCheck, FiX,
  FiUpload, FiAlertTriangle, FiGlobe, FiHeart, FiSmile, FiActivity,
  FiMic, FiShield, FiCpu, FiCalendar, FiFlag, FiCheckCircle, FiChevronUp,
  FiTerminal, FiExternalLink, FiSearch, FiMessageSquare,
  FiTrash2, FiLock, FiChevronDown, FiEye, FiEyeOff,
} from 'react-icons/fi';
import { MdDragIndicator } from 'react-icons/md';
import { getSummariesForRole } from '@/lib/summary-templates';
import { 
  FaLinkedin, FaGithub, FaXTwitter, FaDiscord, FaFigma, FaDribbble, FaBehance, FaSketch 
} from 'react-icons/fa6';

const AuthModal = dynamic(
  () => import('@/components/features/auth/AuthModal').then((mod) => mod.AuthModal),
  { loading: () => null }
);

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface StepConfig   { id: string; title: string; subtitle: string; icon: React.ReactNode; }
interface ExperienceEntry  { id: string; role: string; company: string; start: string; end: string; location: string; currentlyWorking: boolean; description: string; isHidden?: boolean; }
interface EducationEntry   { id: string; type?: 'college' | 'school'; school: string; degree: string; fieldOfStudy: string; startYear: string; endYear: string; gpa: string; isHidden?: boolean; }
interface ProjectEntry     { id: string; title: string; description: string; url: string; start: string; end: string; ongoing: boolean; tech: string; isHidden?: boolean; }
interface CertEntry        { id: string; name: string; issuer: string; issueDate: string; expDate: string; noExp: boolean; credId: string; credUrl: string; isHidden?: boolean; }
interface CourseworkEntry  { id: string; course: string; institution: string; grade: string; year: string; isHidden?: boolean; }
interface InvolvementEntry { id: string; organization: string; role: string; start: string; end: string; current: boolean; description: string; isHidden?: boolean; }
interface AwardEntry       { id: string; name: string; issuer: string; date: string; description: string; isHidden?: boolean; }
interface PublicationEntry { id: string; title: string; publisher: string; date: string; url: string; description: string; isHidden?: boolean; }
interface ReferenceEntry   { id: string; name: string; title: string; company: string; email: string; phone: string; relationship: string; isHidden?: boolean; }
interface AchievementEntry { id: string; title: string; issuer: string; date: string; description: string; isHidden?: boolean; }
interface LanguageEntry    { id: string; language: string; proficiency: string; isHidden?: boolean; }
interface SoftSkillEntry   { id: string; skill: string; isHidden?: boolean; }
interface InternshipEntry  { id: string; role: string; company: string; start: string; end: string; location: string; currentlyWorking: boolean; description: string; isHidden?: boolean; }
interface FreelanceEntry   { id: string; role: string; client: string; start: string; end: string; currentlyWorking: boolean; description: string; isHidden?: boolean; }
interface LeadershipEntry  { id: string; role: string; organization: string; start: string; end: string; current: boolean; description: string; isHidden?: boolean; }
interface VolunteerEntry   { id: string; role: string; organization: string; start: string; end: string; current: boolean; description: string; isHidden?: boolean; }
interface InterestEntry    { id: string; name: string; isHidden?: boolean; }
interface ConferenceEntry  { id: string; title: string; organizer: string; date: string; description: string; isHidden?: boolean; }
interface PatentEntry      { id: string; title: string; issuer: string; date: string; url: string; description: string; isHidden?: boolean; }
interface ExtracurricularEntry { id: string; activity: string; organization: string; start: string; end: string; description: string; isHidden?: boolean; }

// â”€â”€ Base steps â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BASE_STEPS: StepConfig[] = [
  { id: 'personal',   title: 'Personal Info', subtitle: 'Contact & basics',   icon: <FiUser /> },
  { id: 'experience', title: 'Experience',    subtitle: 'Roles & impact',      icon: <FiBriefcase /> },
  { id: 'education',  title: 'Education',     subtitle: 'Degrees & study',     icon: <FiBookOpen /> },
  { id: 'skills',     title: 'Skills',        subtitle: 'Tools & tech',        icon: <FiStar /> },
  { id: 'more',       title: 'More',          subtitle: 'Additional sections', icon: <FiPlusCircle /> },
];

const MORE_SECTION_DEFS: (StepConfig & { group: string })[] = [
  { id: 'projects',     title: 'Projects',        subtitle: 'Work & side projects',  icon: <FiFileText />, group: 'EXPERIENCE' },
  { id: 'internships',  title: 'Internships',     subtitle: 'Learning & growth',     icon: <FiBriefcase />,group: 'EXPERIENCE' },
  { id: 'freelance',    title: 'Freelance Work',  subtitle: 'Independent projects',  icon: <FiCpu />,      group: 'EXPERIENCE' },
  { id: 'certificates', title: 'Certificates',    subtitle: 'Credentials & courses', icon: <FiAward />,    group: 'OTHERS' },
  { id: 'coursework',   title: 'Coursework',      subtitle: 'Relevant courses',      icon: <FiBookOpen />, group: 'ACADEMIC' },
  { id: 'involvement',  title: 'Involvement',     subtitle: 'Activities & clubs',    icon: <FiUsers />,    group: 'OTHERS' },
  { id: 'awards',       title: 'Awards & Honors', subtitle: 'Academic achievements', icon: <FiAward />,    group: 'ACADEMIC' },
  { id: 'achievements', title: 'Achievements',    subtitle: 'Key milestones',        icon: <FiFlag />,     group: 'OTHERS' },
  { id: 'publications', title: 'Publications',    subtitle: 'Papers & articles',     icon: <FiFileText />, group: 'ACADEMIC' },
  { id: 'patents',      title: 'Patents',         subtitle: 'Intellectual property', icon: <FiShield />,   group: 'ACADEMIC' },
  { id: 'languages',    title: 'Languages',       subtitle: 'Global communication',  icon: <FiGlobe />,    group: 'SKILLS' },
  { id: 'softskills',   title: 'Soft Skills',     subtitle: 'Human & interpersonal', icon: <FiHeart />,    group: 'SKILLS' },
  { id: 'leadership',   title: 'Leadership',      subtitle: 'Teams & direction',     icon: <FiStar />,     group: 'OTHERS' },
  { id: 'volunteering', title: 'Volunteering',    subtitle: 'Giving back',           icon: <FiHeart />,    group: 'OTHERS' },
  { id: 'hobbies',      title: 'Hobbies',         subtitle: 'Personal interests',    icon: <FiSmile />,    group: 'OTHERS' },
  { id: 'conferences',  title: 'Conferences',     subtitle: 'Events & workshops',    icon: <FiMic />,      group: 'ACADEMIC' },
  { id: 'extracurricular', title: 'Extracurricular',subtitle: 'Student life',        icon: <FiActivity />, group: 'ACADEMIC' },
  { id: 'references',   title: 'References',      subtitle: 'Professional contacts', icon: <FiLink />,     group: 'OTHERS' },
];

const SOCIAL_PLATFORMS = [
  { id: 'website',  label: 'Website',  icon: <FiGlobe />,   placeholder: 'https://{username}.dev' },
  { id: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin />, placeholder: 'https://linkedin.com/in/{username}' },
  { id: 'github',   label: 'GitHub',   icon: <FaGithub />,   placeholder: 'https://github.com/{username}' },
  { id: 'twitter',  label: 'X (Twitter)', icon: <FaXTwitter />, placeholder: 'https://x.com/{username}' },
  { id: 'discord',  label: 'Discord',  icon: <FaDiscord />,  placeholder: 'Discord Invite/User' },
  { id: 'figma',    label: 'Figma',    icon: <FaFigma />,    placeholder: 'https://figma.com/@{username}' },
  { id: 'dribbble', label: 'Dribbble', icon: <FaDribbble />, placeholder: 'https://dribbble.com/{username}' },
  { id: 'behance',  label: 'Behance',  icon: <FaBehance />,  placeholder: 'https://behance.net/{username}' },
  { id: 'sketch',   label: 'Sketch',   icon: <FaSketch />,   placeholder: 'https://sketch.com/@{username}' },
  { id: 'custom',   label: 'Custom',   icon: <FiExternalLink />, placeholder: 'https://example.com' },
];

// â”€â”€ Dummy data (India-focused) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const DEF_EXP: ExperienceEntry[] = [
  { id: '1', role: 'Software Development Engineer II', company: 'Flipkart', start: '2022-03', end: '', location: 'Bengaluru, Karnataka', currentlyWorking: true,  description: 'Built and scaled payments infrastructure handling 2M+ daily transactions with 99.9% uptime.\nLed a team of 4 engineers to deliver the UPI AutoPay feature, onboarding 500k+ users in Q1 2024.\nOptimised API response times by 35% through Redis caching and query refactoring.' },
  { id: '2', role: 'Software Engineer',                company: 'Infosys',   start: '2019-07', end: '2022-02', location: 'Pune, Maharashtra',       currentlyWorking: false, description: 'Developed RESTful microservices for a Fortune 500 banking client using Spring Boot and Kafka.\nImproved CI/CD pipeline efficiency by 40% by integrating automated testing with Jenkins and Docker.' },
];
const DEF_EDU: EducationEntry[] = [
  { id: '1', type: 'college', school: 'National Institute of Technology, Trichy', degree: 'B.Tech', fieldOfStudy: 'Computer Science & Engineering', startYear: '2015', endYear: '2019', gpa: '8.6' },
  { id: '2', type: 'school', school: 'Delhi Public School (DPS)', degree: 'Class XII (CBSE)', fieldOfStudy: 'Science (PCM)', startYear: '2013', endYear: '2015', gpa: '95%' },
  { id: '3', type: 'school', school: 'Kendriya Vidyalaya (KV)', degree: 'Class X (CBSE)', fieldOfStudy: 'General', startYear: '2011', endYear: '2013', gpa: '9.8' },
];
const DEF_SKILLS   = ['Java', 'Spring Boot', 'React', 'Node.js', 'MySQL', 'Redis', 'Docker', 'AWS', 'System Design', 'Kafka'];
const SUGG_SKILLS  = ['TypeScript', 'Go', 'PostgreSQL', 'Kubernetes', 'GraphQL', 'Python'];
const DEF_PROJ: ProjectEntry[]  = [{ id: '1', title: 'Smart Expense Tracker', description: 'Built a full-stack expense tracking app with real-time analytics, UPI transaction sync, and AI-powered category suggestions. Deployed on AWS with 1,200+ active users.', url: 'github.com/rahulsharma/expense-tracker', start: '2023-06', end: '', ongoing: true, tech: 'React, Node.js, MongoDB, AWS, Razorpay API' }];
const DEF_CERT: CertEntry[]     = [{ id: '1', name: 'AWS Certified Solutions Architect â€” Associate', issuer: 'Amazon Web Services', issueDate: '2023-08', expDate: '', noExp: true, credId: 'AWS-SAA-2023-RS', credUrl: 'verify.aws.amazon.com/cert/RS2023' }];
const DEF_COURSE: CourseworkEntry[] = [{ id: '1', course: 'Data Structures & Algorithms', institution: 'NPTEL (IIT Madras)', grade: 'A', year: '2023' }, { id: '2', course: 'System Design for Engineers', institution: 'Scaler Academy', grade: 'A+', year: '2022' }];
const DEF_INV: InvolvementEntry[] = [{ id: '1', organization: 'CSI â€” Computer Society of India, NIT Trichy', role: 'Technical Secretary', start: '2017-07', end: '2019-05', current: false, description: 'Organised CodeSprint, a 24-hour hackathon with 300+ participants across South India.\nMentored 40+ juniors for competitive programming and placement preparation.' }];
const DEF_AWD: AwardEntry[]     = [{ id: '1', name: 'Best Performer â€” Q3 2023', issuer: 'Flipkart', date: '2023', description: 'Recognised for delivering the UPI AutoPay feature ahead of schedule, directly contributing to a 12% increase in payment success rate.' }];
const DEF_PUB: PublicationEntry[] = [{ id: '1', title: 'Scaling Microservices with Event-Driven Architecture on AWS', publisher: 'Medium / Better Programming', date: '2023-09', url: 'medium.com/@rahulsharma/scaling-microservices-aws', description: 'A deep-dive into building resilient, event-driven systems using Kafka, SQS, and Lambda â€” learnings from production at scale.' }];
const DEF_REF: ReferenceEntry[] = [{ id: '1', name: 'Priya Nair', title: 'Engineering Manager', company: 'Flipkart', email: 'priya.nair@flipkart.com', phone: '+91 98400 12345', relationship: 'Direct manager (2 years)' }];
const DEF_ACHIEVE: AchievementEntry[] = [{ id: '1', title: 'Reduced API p99 latency by 45%', issuer: 'Flipkart', date: '2023', description: 'Identified N+1 query bottlenecks and introduced a caching layer that slashed p99 API latency from 900ms to 500ms under peak load.' }];
const DEF_LANG: LanguageEntry[] = [{ id: '1', language: 'Hindi', proficiency: 'Native' }, { id: '2', language: 'English', proficiency: 'Professional Working' }, { id: '3', language: 'Tamil', proficiency: 'Elementary' }];
const DEF_SOFT: SoftSkillEntry[] = [{ id: '1', skill: 'Problem Solving' }, { id: '2', skill: 'Team Collaboration' }, { id: '3', skill: 'Mentoring' }];
const DEF_INTERN: InternshipEntry[] = [{ id: '1', role: 'Backend Developer Intern', company: 'Razorpay', start: '2018-05', end: '2018-07', location: 'Bengaluru, Karnataka', currentlyWorking: false, description: 'Worked on payment gateway reliability improvements; wrote integration tests that caught 3 critical pre-production bugs.' }];
const DEF_FREE: FreelanceEntry[] = [{ id: '1', role: 'Full Stack Developer', client: 'Startups & SMEs (India)', start: '2021-01', end: '', currentlyWorking: true, description: 'Delivered 8+ web applications for D2C brands and SaaS startups using React, Node.js and Firebase. Integrated Razorpay and Shiprocket APIs for e-commerce clients.' }];
const DEF_LEAD: LeadershipEntry[] = [{ id: '1', role: 'Tech Lead', organization: 'Flipkart â€” Payments Team', start: '2023-01', end: '', current: true, description: 'Leading a 5-member cross-functional team to architect and ship the next-gen checkout experience for 100M+ Flipkart users.' }];
const DEF_VOL: VolunteerEntry[] = [{ id: '1', role: 'Coding Mentor', organization: 'GirlScript Foundation', start: '2022-03', end: '', current: true, description: 'Mentoring 20+ students from Tier-2 & 3 colleges in DSA and open-source contributions; helped 6 mentees land their first tech job.' }];
const DEF_HOBBY: InterestEntry[] = [{ id: '1', name: 'Competitive Programming' }, { id: '2', name: 'Badminton' }, { id: '3', name: 'Tech Blogging' }];
const DEF_CONF: ConferenceEntry[] = [{ id: '1', title: 'Great India Developer Summit (GIDS) 2023', organizer: 'Saltmarch Media', date: '2023-04', description: 'Attended sessions on distributed systems, cloud-native architecture, and DevOps best practices. Networked with 500+ engineering professionals.' }];
const DEF_PATENT: PatentEntry[] = [{ id: '1', title: 'Adaptive UPI Payment Retry Mechanism', issuer: 'Indian Patent Office', date: '2023-11', url: 'ipindia.gov.in/patent/12345', description: 'A system that intelligently retries failed UPI transactions by analysing failure patterns, reducing transaction drop rate by 18%.' }];
const DEF_EXTRA: ExtracurricularEntry[] = [{ id: '1', activity: 'ACM-ICPC Regional', organization: 'NIT Trichy', start: '2016-08', end: '2018-11', description: 'Represented NIT Trichy at ACM-ICPC Amritapuri Regionals; ranked in the top 50 teams across South India.' }];

// â”€â”€ Setup Storage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STORAGE_KEY = 'fresh-resume-onboarding-draft';
const getInitialValue = <T,>(key: string, def: T): T => {
  if (typeof window === 'undefined') return def;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return def;
  try {
    const parsed = JSON.parse(saved);
    return parsed[key] !== undefined ? parsed[key] : def;
  } catch { return def; }
};

// â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function OnboardingClient() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const stepNavRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [stepsDrawerOpen, setStepsDrawerOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; title: string; message: string; confirmLabel?: string; onConfirm: () => void } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // â”€â”€ States (with localStorage initialization) â”€â”€
  const [activeStep, setActiveStep] = useState(() => getInitialValue('activeStep', 'personal'));
  const [visitedSteps, setVisitedSteps] = useState<Set<string>>(() => {
    const arr = getInitialValue<string[]>('visitedSteps', ['personal']);
    return new Set(arr);
  });
  const [selectedMoreIds, setSelectedMoreIds] = useState<string[]>(() => getInitialValue('selectedMoreIds', []));
  const [stepOrder, setStepOrder] = useState<string[]>(() =>
    getInitialValue('stepOrder', ['personal', 'experience', 'education', 'skills'])
  );
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const [personalInfo, setPersonalInfo] = useState(() => getInitialValue('personalInfo', {
    firstName: (session?.user?.name ?? '').split(' ')[0] || 'Rahul',
    lastName: (session?.user?.name ?? '').split(' ').slice(1).join(' ') || 'Sharma',
    professionalTitle: 'Software Engineer',
    email: session?.user?.email ?? 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, Karnataka',
    summary: 'Creative and detail-oriented Software Engineer with a passion for building beautiful, user-centric applications. Experienced in modern web technologies and agile methodologies.',
    website: '',
    linkedIn: '',
    links: [
      { type: 'website',  url: `https://${(session?.user?.name ?? '').split(' ')[0]?.toLowerCase() || 'rahul'}.dev` },
      { type: 'linkedin', url: `https://www.linkedin.com/in/${(session?.user?.name ?? '').split(' ')[0]?.toLowerCase() || 'rahul'}` },
      { type: 'github',   url: `https://github.com/${(session?.user?.name ?? '').split(' ')[0]?.toLowerCase() || 'rahul'}` }
    ] as { type: string; url: string }[],
    image: session?.user?.image ? { url: session?.user?.image, publicId: '' } : (null as { url: string; publicId: string } | null)
  }));

  const [experience, setExperience]     = useState<ExperienceEntry[]>(() => getInitialValue('experience', DEF_EXP));
  const [education, setEducation]       = useState<EducationEntry[]>(() => getInitialValue('education', DEF_EDU));
  const [skills, setSkills]             = useState<string[]>(() => getInitialValue('skills', DEF_SKILLS));
  const [projects, setProjects]         = useState<ProjectEntry[]>(() => getInitialValue('projects', DEF_PROJ));
  const [certificates, setCertificates] = useState<CertEntry[]>(() => getInitialValue('certificates', DEF_CERT));
  const [coursework, setCoursework]     = useState<CourseworkEntry[]>(() => getInitialValue('coursework', DEF_COURSE));
  const [involvement, setInvolvement]   = useState<InvolvementEntry[]>(() => getInitialValue('involvement', DEF_INV));
  const [awards, setAwards]             = useState<AwardEntry[]>(() => getInitialValue('awards', DEF_AWD));
  const [publications, setPublications] = useState<PublicationEntry[]>(() => getInitialValue('publications', DEF_PUB));
  const [references, setReferences]     = useState<ReferenceEntry[]>(() => getInitialValue('references', DEF_REF));
  const [achievements, setAchievements] = useState<AchievementEntry[]>(() => getInitialValue('achievements', DEF_ACHIEVE));
  const [languages, setLanguages]       = useState<LanguageEntry[]>(() => getInitialValue('languages', DEF_LANG));
  const [softskills, setSoftskills]     = useState<SoftSkillEntry[]>(() => getInitialValue('softskills', DEF_SOFT));
  const [internships, setInternships]   = useState<InternshipEntry[]>(() => getInitialValue('internships', DEF_INTERN));
  const [freelance, setFreelance]       = useState<FreelanceEntry[]>(() => getInitialValue('freelance', DEF_FREE));
  const [leadership, setLeadership]     = useState<LeadershipEntry[]>(() => getInitialValue('leadership', DEF_LEAD));
  const [volunteering, setVolunteering] = useState<VolunteerEntry[]>(() => getInitialValue('volunteering', DEF_VOL));
  const [hobbies, setHobbies]           = useState<InterestEntry[]>(() => getInitialValue('hobbies', DEF_HOBBY));
  const [conferences, setConferences]   = useState<ConferenceEntry[]>(() => getInitialValue('conferences', DEF_CONF));
  const [patents, setPatents]           = useState<PatentEntry[]>(() => getInitialValue('patents', DEF_PATENT));
  const [extracurricular, setExtracurricular] = useState<ExtracurricularEntry[]>(() => getInitialValue('extracurricular', DEF_EXTRA));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = useCallback((e: DragStartEvent) => {
    setActiveDragId(e.active.id as string);
  }, []);

  const handleDragEnd = useCallback((e: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setStepOrder(prev => {
      const oldIdx = prev.indexOf(active.id as string);
      let   newIdx = prev.indexOf(over.id as string);
      if (oldIdx === -1 || newIdx === -1) return prev;
      // personal always stays at position 0
      if (newIdx === 0) newIdx = 1;
      const result = arrayMove(prev, oldIdx, newIdx);
      const pIdx = result.indexOf('personal');
      if (pIdx > 0) { result.splice(pIdx, 1); result.unshift('personal'); }
      return result;
    });
  }, []);

  // â”€â”€ Progress Logic â”€â”€
  const allSteps = useMemo<StepConfig[]>(() => {
    const stepMap = new Map<string, StepConfig>([
      ...BASE_STEPS.map(s => [s.id, s] as [string, StepConfig]),
      ...MORE_SECTION_DEFS.map(s => [s.id, s] as [string, StepConfig]),
    ]);
    const validIds = new Set([
      ...BASE_STEPS.filter(s => s.id !== 'more').map(s => s.id),
      ...selectedMoreIds,
    ]);
    const ordered = stepOrder.filter(id => validIds.has(id));
    for (const id of validIds) {
      if (!ordered.includes(id)) ordered.push(id);
    }
    return [
      ...ordered.map(id => stepMap.get(id)!).filter(Boolean),
      BASE_STEPS[4], // 'more' always last
    ];
  }, [stepOrder, selectedMoreIds]);

  const progressSteps = useMemo(() => allSteps.filter(s => s.id !== 'more'), [allSteps]);

  const isStepComplete = (id: string): boolean => {
    switch (id) {
      case 'personal': return !!(personalInfo.firstName && personalInfo.lastName && personalInfo.email);
      case 'experience': return experience.some(e => e.role && e.company && e.start);
      case 'education': return education.some(e => e.school && e.degree);
      case 'skills': return skills.length >= 3;
      case 'projects': return projects.some(p => p.title && p.description);
      case 'certificates': return certificates.some(c => c.name && c.issuer);
      case 'coursework': return coursework.some(c => c.course);
      case 'involvement': return involvement.some(i => i.organization && i.role);
      case 'awards': return awards.some(a => a.name);
      case 'publications': return publications.some(p => p.title);
      case 'references': return references.some(r => r.name && (r.email || r.phone));
      case 'achievements': return achievements.some(a => a.title);
      case 'languages': return languages.some(l => l.language);
      case 'softskills': return softskills.some(s => s.skill);
      case 'internships': return internships.some(i => i.role && i.company);
      case 'freelance': return freelance.some(f => f.role && f.client);
      case 'leadership': return leadership.some(l => l.role && l.organization);
      case 'volunteering': return volunteering.some(v => v.role && v.organization);
      case 'hobbies': return hobbies.some(h => h.name);
      case 'conferences': return conferences.some(c => c.title);
      case 'patents': return patents.some(p => p.title);
      case 'extracurricular': return extracurricular.some(e => e.activity && e.organization);
      default: return false;
    }
  };

  const completedCount = useMemo(() => 
    progressSteps.filter(s => isStepComplete(s.id) && visitedSteps.has(s.id)).length, 
    [progressSteps, visitedSteps, personalInfo, experience, education, skills, projects, certificates, coursework, involvement, awards, publications, references, achievements, languages, softskills, internships, freelance, leadership, volunteering, hobbies, conferences, patents, extracurricular]
  );
  const totalCount = progressSteps.length;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const currentIndex = allSteps.findIndex(s => s.id === activeStep);
  const currentStep  = allSteps[currentIndex] ?? allSteps[0];
  const isLastStep   = currentIndex === allSteps.length - 1;

  const handleContinue = () => {
    if (currentIndex < allSteps.length - 1) {
      setActiveStep(allSteps[currentIndex + 1].id);
    }
  };

  useEffect(() => {
    setVisitedSteps(prev => {
      if (prev.has(activeStep)) return prev;
      const next = new Set(prev);
      next.add(activeStep);
      return next;
    });
    // scroll active step button into view in mobile horizontal nav
    if (stepNavRef.current) {
      const btn = stepNavRef.current.querySelector<HTMLButtonElement>(`[data-step="${activeStep}"]`);
      btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeStep]);

  // â”€â”€ Session Sync â”€â”€
  useEffect(() => {
    if (session?.user) {
      setPersonalInfo(prev => {
        const fname = session.user?.name?.split(' ')[0] || 'Rahul';
        const lname = session.user?.name?.split(' ').slice(1).join(' ') || 'Sharma';
        const username = `${fname}${lname}`.toLowerCase().replace(/\s+/g, '');
        const slug = [fname, lname].filter(Boolean).map(s => s.toLowerCase().replace(/\s+/g, '-')).join('-');

        return {
          ...prev,
          firstName: prev.firstName === 'Rahul' ? fname : prev.firstName,
          lastName: prev.lastName === 'Sharma' ? lname : prev.lastName,
          email: prev.email === 'rahul.sharma@example.com' ? (session.user?.email || 'rahul.sharma@example.com') : prev.email,
          phone: prev.phone === '+91 98765 43210' ? (prev.phone) : prev.phone,
          location: prev.location === 'Bengaluru, Karnataka' ? 'Bengaluru, Karnataka' : prev.location,
          summary: prev.summary || 'Creative and detail-oriented Software Engineer with a passion for building beautiful, user-centric applications. Experienced in modern web technologies and agile methodologies.',
          website: '',
          linkedIn: '',
          links: prev.links?.length ? prev.links : [
            { type: 'website',  url: `https://${username}.dev` },
            { type: 'linkedin', url: `https://www.linkedin.com/in/${slug}` },
            { type: 'github',   url: `https://github.com/${username}` }
          ],
          image: prev.image === null && session.user?.image ? { url: session.user.image, publicId: '' } : prev.image
        };
      });
    }
  }, [session]);

  const syncingRef = useRef(false);

  // â”€â”€ Auto-sync local image to Cloudinary after login â”€â”€
  useEffect(() => {
    if (session && personalInfo.image?.url && !personalInfo.image.publicId && personalInfo.image.url.startsWith('data:') && !syncingRef.current) {
      const syncImage = async () => {
        syncingRef.current = true;
        try {
          const res = await fetch(personalInfo.image!.url);
          const blob = await res.blob();
          const fd = new FormData();
          fd.append('file', blob);

          const upRes = await fetch('/api/upload/image', {
            method: 'POST',
            body: fd
          });
          const data = await upRes.json();
          if (data.url) {
            setPersonalInfo(prev => ({ ...prev, image: { url: data.url, publicId: data.publicId } }));
          }
        } catch (err) { 
          console.error('Failed to sync local image:', err); 
          syncingRef.current = false;
        }
      };
      syncImage();
    }
  }, [session, personalInfo.image]);

  // â”€â”€ Auto-save Persistence â”€â”€
  useEffect(() => {
    try {
      const draft = {
        activeStep,
        visitedSteps: Array.from(visitedSteps),
        selectedMoreIds,
        stepOrder,
        personalInfo, experience, education, skills, projects, certificates,
        coursework, involvement, awards, publications, references,
        achievements, languages, softskills, internships, freelance,
        leadership, volunteering, hobbies, conferences, patents, extracurricular
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [activeStep, visitedSteps, selectedMoreIds, stepOrder, personalInfo, experience, education, skills, projects, certificates, coursework, involvement, awards, publications, references, achievements, languages, softskills, internships, freelance, leadership, volunteering, hobbies, conferences, patents, extracurricular]);

  const handleComplete = async () => {
    if (!session) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        personalInfo,
        onboardingData: {
          experience, education, skills, projects, certificates,
          coursework, involvement, awards, publications, references,
          achievements, languages, softskills, internships, freelance,
          leadership, volunteering, hobbies, conferences, patents, extracurricular,
        }
      };
      const res = await fetch('/api/user/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        localStorage.removeItem(STORAGE_KEY);
        toast.success('Profile saved!');
        await update({ isProfileCompleted: true });
        router.push('/dashboard');
      }
    } catch { toast.error('Failed to save'); }
    finally { setIsLoading(false); }
  };

  const handleReset = () => {
    setConfirmModal({
      open: true,
      title: 'Reset Onboarding?',
      message: 'Are you sure you want to reset everything? All your progress and entered info will be lost permanently.',
      confirmLabel: 'Yes, reset everything',
      onConfirm: () => {
        // â”€â”€ Background Server Cleanup (Fire & Forget) â”€â”€
        if (personalInfo.image?.publicId) {
          fetch(`/api/upload/image/delete?publicId=${encodeURIComponent(personalInfo.image.publicId)}`, {
            method: 'DELETE',
          }).catch(err => console.error('Reset cleanup failed:', err));
        }

        // â”€â”€ Immediate UI Reset â”€â”€
        const rFname = (session?.user?.name ?? '').split(' ')[0] || 'Rahul';
        const rLname = (session?.user?.name ?? '').split(' ').slice(1).join(' ') || 'Sharma';
        const rUsername = `${rFname}${rLname}`.toLowerCase().replace(/\s+/g, '');
        const rSlug = [rFname, rLname].filter(Boolean).map(s => s.toLowerCase().replace(/\s+/g, '-')).join('-');
        setPersonalInfo({
          firstName: rFname,
          lastName: rLname,
          professionalTitle: 'Software Engineer',
          email: session?.user?.email ?? 'rahul.sharma@example.com',
          phone: '+91 98765 43210',
          location: 'Bengaluru, Karnataka',
          summary: 'Creative and detail-oriented Software Engineer with a passion for building beautiful, user-centric applications. Experienced in modern web technologies and agile methodologies.',
          website: '',
          linkedIn: '',
          links: [
            { type: 'website',  url: `https://${rUsername}.dev` },
            { type: 'linkedin', url: `https://www.linkedin.com/in/${rSlug}` },
            { type: 'github',   url: `https://github.com/${rUsername}` }
          ],
          image: session?.user?.image ? { url: session?.user?.image, publicId: '' } : null
        });
        setExperience(DEF_EXP);
        setEducation(DEF_EDU);
        setSkills(DEF_SKILLS);
        setProjects(DEF_PROJ);
        setCertificates(DEF_CERT);
        setCoursework(DEF_COURSE);
        setInvolvement(DEF_INV);
        setAwards(DEF_AWD);
        setPublications(DEF_PUB);
        setReferences(DEF_REF);
        setAchievements(DEF_ACHIEVE);
        setLanguages(DEF_LANG);
        setSoftskills(DEF_SOFT);
        setInternships(DEF_INTERN);
        setFreelance(DEF_FREE);
        setLeadership(DEF_LEAD);
        setVolunteering(DEF_VOL);
        setHobbies(DEF_HOBBY);
        setConferences(DEF_CONF);
        setPatents(DEF_PATENT);
        setExtracurricular(DEF_EXTRA);
        setSelectedMoreIds([]);
        setStepOrder(['personal', 'experience', 'education', 'skills']);
        localStorage.removeItem(STORAGE_KEY);
        setVisitedSteps(new Set(['personal']));
        setActiveStep('personal');
        setConfirmModal(null);
        toast.success('Onboarding reset');
      }
    });
  };

  const toggleMoreSection = (id: string) => {
    if (selectedMoreIds.includes(id)) {
      setConfirmModal({
        open: true,
        title: 'Remove Section?',
        message: `Are you sure you want to remove the ${id} section? This will clear all data in this section.`,
        onConfirm: () => {
          setSelectedMoreIds(prev => prev.filter(x => x !== id));
          if (activeStep === id) setActiveStep('more');
          setConfirmModal(null);
        }
      });
      return;
    }
    setSelectedMoreIds(prev => [...prev, id]);
    setStepOrder(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  return (
    <section className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <Navbar 
        onLoginClick={() => setIsAuthModalOpen(true)} 
        authButtonText="Login / Sign up"
      />
      
      <div className="flex flex-1 overflow-hidden pt-[56px]" suppressHydrationWarning>
        {!isMounted ? (
          <div className="flex w-full h-full items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              <p className="text-sm font-medium text-slate-500 animate-pulse">Loading draft...</p>
            </div>
          </div>
        ) : (
          <>

      {/* â”€â”€ Mobile steps drawer backdrop â”€â”€ */}
      {stepsDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setStepsDrawerOpen(false)}
        />
      )}

      {/* â”€â”€ Mobile steps drawer â”€â”€ */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-2xl bg-white shadow-2xl md:hidden transition-transform duration-300 ${stepsDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: '80dvh' }}>
        {/* Drawer header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Navigation</p>
            <p className="text-sm font-semibold text-slate-800">Build Steps</p>
          </div>
          <button onClick={() => setStepsDrawerOpen(false)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200">
            <FiX className="text-sm" />
          </button>
        </div>

        {/* Drawer body â€” scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {/* Current steps */}
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Steps</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
            <SortableContext items={allSteps.filter(s => s.id !== 'more').map(s => s.id)} strategy={verticalListSortingStrategy}>
              <nav className="space-y-1 mb-5">
                {allSteps.map((step, index) => {
                  const isActive = activeStep === step.id;
                  const isDone   = isStepComplete(step.id) && visitedSteps.has(step.id);
                  const isMore   = step.id === 'more';
                  const locked   = step.id === 'personal' || isMore;
                  const showCheck = isDone && !isActive && !isMore;
                  return (
                    <DrawerStepItem
                      key={step.id}
                      step={step}
                      index={index}
                      isActive={isActive}
                      isDone={isDone}
                      isMore={isMore}
                      locked={locked}
                      showCheck={showCheck}
                      isDragging={activeDragId === step.id}
                      onClick={() => { setActiveStep(step.id); setStepsDrawerOpen(false); }}
                    />
                  );
                })}
              </nav>
            </SortableContext>

          </DndContext>

          {/* Add more sections */}
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Add Sections</p>
          {(['EXPERIENCE', 'SKILLS', 'ACADEMIC', 'OTHERS'] as const).map(group => {
            const items = MORE_SECTION_DEFS.filter(s => s.group === group);
            return (
              <div key={group} className="mb-4">
                <p className="mb-1.5 px-1 text-[9px] font-semibold uppercase tracking-widest text-slate-300">{group}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {items.map(item => {
                    const sel = selectedMoreIds.includes(item.id);
                    return (
                      <button key={item.id} onClick={() => toggleMoreSection(item.id)}
                        className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
                          sel ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}>
                        <span className={`flex-shrink-0 text-sm ${sel ? 'text-indigo-500' : 'text-slate-400'}`}>{item.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-[11px] font-medium leading-tight ${sel ? 'text-indigo-700' : 'text-slate-700'}`}>{item.title}</p>
                        </div>
                        <div className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                          sel ? 'border-indigo-500 bg-indigo-600' : 'border-slate-300 bg-white'
                        }`}>
                          {sel && <FiCheck className="text-[8px] text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* â”€â”€ Mobile unified bottom bar (step info + progress + actions) â”€â”€ */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white md:hidden">
        {/* Step info + progress */}
        <div className="px-4 pt-3 pb-2">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-semibold text-white">
                {currentStep.id === 'more' ? '+' : currentIndex + 1}
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight text-slate-900">{currentStep.title}</p>
                <p className="text-[11px] text-slate-400">Step {currentIndex + 1} of {allSteps.length}</p>
              </div>
              <button onClick={() => setStepsDrawerOpen(true)}
                className="flex h-7 w-7 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 active:bg-indigo-100">
                <FiChevronUp className="text-sm" />
              </button>
            </div>
            <span className="text-[11px] text-slate-400">{completedCount}/{totalCount} done</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-indigo-600 transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex items-center justify-between px-4 pb-4 pt-2">
          <button onClick={handleReset} className="cursor-pointer text-xs text-slate-400 underline underline-offset-2 transition hover:text-slate-600">Reset</button>
          {isLastStep ? (
            <button onClick={handleComplete} disabled={isLoading}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50">
              {isLoading ? 'Saving...' : 'Complete'} {!isLoading && <FiCheckCircle className="text-sm" />}
            </button>
          ) : (
            <button onClick={handleContinue}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
              Continue <FiArrowRight className="text-xs" />
            </button>
          )}
        </div>
      </div>

      {/* â”€â”€ Sidebar â”€â”€ */}
      <aside className="hidden w-[280px] flex-shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex-shrink-0 border-b border-slate-50 px-5 py-2 pt-4">
          <SidebarBreadcrumb />
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-4 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Build Steps</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
            <SortableContext items={allSteps.filter(s => s.id !== 'more').map(s => s.id)} strategy={verticalListSortingStrategy}>
              <nav>
                {allSteps.map((step, index) => {
                  const isActive = activeStep === step.id;
                  const isDone = isStepComplete(step.id);
                  const isMore = step.id === 'more';
                  const locked = step.id === 'personal' || isMore;
                  const showCheck = isDone && visitedSteps.has(step.id) && !isActive && !isMore;
                  return (
                    <SidebarStepItem
                      key={step.id}
                      step={step}
                      index={index}
                      isActive={isActive}
                      isDone={isDone}
                      isMore={isMore}
                      locked={locked}
                      showCheck={showCheck}
                      isLast={index === allSteps.length - 1}
                      isDragging={activeDragId === step.id}
                      onClick={() => setActiveStep(step.id)}
                    />
                  );
                })}
              </nav>
            </SortableContext>
            <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
              {activeDragId ? (() => {
                const step = allSteps.find(s => s.id === activeDragId);
                if (!step) return null;
                const isDone = isStepComplete(step.id);
                const showCheck = isDone && visitedSteps.has(step.id);
                return (
                  <div className="flex items-center gap-2 rounded-xl bg-white px-2 py-3 shadow-[0_8px_32px_rgba(99,102,241,0.18)] ring-2 ring-indigo-400/40">
                    <div className={`flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full text-sm ${
                      showCheck ? 'bg-indigo-600 text-white' : 'border-2 border-indigo-300 bg-indigo-50 text-indigo-600'
                    }`}>
                      {showCheck ? <FiCheck className="text-xs" /> : step.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-slate-900">{step.title}</p>
                      <p className="text-[11px] text-slate-400">{step.subtitle}</p>
                    </div>
                    <span className="cursor-grabbing p-1 text-slate-400"><GripIcon /></span>
                  </div>
                );
              })() : null}
            </DragOverlay>
          </DndContext>
        </div>
        <div className="flex h-[72px] flex-col justify-center border-t border-slate-200 px-5">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-medium text-slate-500">Progress</span>
            <span className="text-[10px] font-bold text-slate-600">{completedCount}/{totalCount}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-indigo-600 transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </aside>

      {/* â”€â”€ Main Content â”€â”€ */}
      <main className="flex flex-1 flex-col overflow-hidden bg-slate-50">
        {/* Mobile horizontal step navigator */}
        <div ref={stepNavRef} className="md:hidden overflow-x-auto border-b border-slate-100 bg-white scrollbar-none flex-shrink-0">
          <div className="flex items-center gap-0.5 px-3 py-2 min-w-max">
            {allSteps.map((step, index) => {
              const isActive = activeStep === step.id;
              const isDone = isStepComplete(step.id) && visitedSteps.has(step.id) && !isActive;
              const isMore = step.id === 'more';
              return (
                <button
                  key={step.id}
                  data-step={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors whitespace-nowrap ${
                    isActive ? 'bg-indigo-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-colors ${
                    isActive ? 'bg-indigo-600 text-white' : isDone ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-400'
                  }`}>
                    {isDone ? <FiCheck className="text-[8px]" /> : isMore ? <FiPlus className="text-[9px]" /> : index + 1}
                  </span>
                  <span className={`text-[11px] font-medium ${isActive ? 'text-indigo-700' : 'text-slate-500'}`}>{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-[8.5rem] md:pb-0">
          <div className="px-5 pb-8 pt-8 sm:px-8 md:px-10 md:pb-10 md:pt-12">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Step {currentIndex + 1} / {allSteps.length}
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-[26px]">{currentStep.title}</h1>
            <p className="mt-1 text-sm text-slate-500">{currentStep.subtitle}</p>
            <div className="mt-7">
              {activeStep === 'personal'     && <PersonalForm data={personalInfo} onChange={setPersonalInfo} session={session} />}
              {activeStep === 'experience'   && <ExperienceForm entries={experience} onChange={setExperience} />}
              {activeStep === 'education'    && <EducationForm entries={education} onChange={setEducation} />}
              {activeStep === 'skills'       && <SkillsForm skills={skills} onChange={setSkills} />}
              {activeStep === 'more'         && <MoreForm selectedIds={selectedMoreIds} onToggle={toggleMoreSection} />}
              {activeStep === 'projects'     && <ProjectsForm entries={projects} onChange={setProjects} />}
              {activeStep === 'certificates' && <CertificatesForm entries={certificates} onChange={setCertificates} />}
              {activeStep === 'coursework'   && <CourseworkForm entries={coursework} onChange={setCoursework} />}
              {activeStep === 'involvement'  && <InvolvementForm entries={involvement} onChange={setInvolvement} />}
              {activeStep === 'awards'       && <AwardsForm entries={awards} onChange={setAwards} />}
              {activeStep === 'publications' && <PublicationsForm entries={publications} onChange={setPublications} />}
              {activeStep === 'references'   && <ReferencesForm entries={references} onChange={setReferences} />}
              {activeStep === 'achievements' && <AchievementsForm entries={achievements} onChange={setAchievements} />}
              {activeStep === 'languages'    && <LanguagesForm entries={languages} onChange={setLanguages} />}
              {activeStep === 'softskills'   && <SoftSkillsForm entries={softskills} onChange={setSoftskills} />}
              {activeStep === 'internships'  && <InternshipsForm entries={internships} onChange={setInternships} />}
              {activeStep === 'freelance'    && <FreelanceForm entries={freelance} onChange={setFreelance} />}
              {activeStep === 'leadership'   && <LeadershipForm entries={leadership} onChange={setLeadership} />}
              {activeStep === 'volunteering' && <VolunteeringForm entries={volunteering} onChange={setVolunteering} />}
              {activeStep === 'hobbies'      && <HobbiesForm entries={hobbies} onChange={setHobbies} />}
              {activeStep === 'conferences'  && <ConferencesForm entries={conferences} onChange={setConferences} />}
              {activeStep === 'patents'      && <PatentsForm entries={patents} onChange={setPatents} />}
              {activeStep === 'extracurricular' && <ExtracurricularForm entries={extracurricular} onChange={setExtracurricular} />}
            </div>
          </div>
        </div>

        {/* Desktop action bar */}
        <div className="hidden h-[72px] border-t border-slate-200 bg-white px-5 md:flex md:items-center sm:px-8 md:px-10">
          <div className="flex w-full items-center justify-between">
            <button onClick={handleReset} className="cursor-pointer text-sm text-slate-400 transition hover:text-slate-600">Reset</button>
            {isLastStep ? (
              <button onClick={handleComplete} disabled={isLoading}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50">
                {isLoading ? 'Saving...' : 'Complete Setup'} {!isLoading && <FiCheckCircle className="text-sm" />}
              </button>
            ) : (
              <button onClick={handleContinue}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
                Continue <FiArrowRight className="text-xs" />
              </button>
            )}
          </div>
        </div>

      </main>
          </>
        )}
      </div>

      {confirmModal && confirmModal.open && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel={confirmModal.confirmLabel}
          onConfirm={confirmModal.onConfirm}
          onClose={() => setConfirmModal(null)}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </section>
  );
}

// â”€â”€ Shared field components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Field({ label, placeholder, defaultValue, hint, required, type = 'text' }: {
  label: string; placeholder?: string; defaultValue?: string; hint?: string; required?: boolean; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-slate-600">{label}{required && <span className="ml-0.5 text-slate-400">*</span>}</label>
      <input type={type} defaultValue={defaultValue} placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10" />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function CF({ label, value, onChange, placeholder, required, type = 'text', hint, disabled }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; type?: string; hint?: string; disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-slate-600">{label}{required && <span className="ml-0.5 text-slate-400">*</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 disabled:bg-slate-50 disabled:text-slate-400" />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

// â”€â”€ Drag & Drop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function GripIcon() {
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" aria-hidden="true">
      <circle cx="3" cy="3"  r="1.5" /><circle cx="9" cy="3"  r="1.5" />
      <circle cx="3" cy="8"  r="1.5" /><circle cx="9" cy="8"  r="1.5" />
      <circle cx="3" cy="13" r="1.5" /><circle cx="9" cy="13" r="1.5" />
    </svg>
  );
}

function SidebarStepItem({ step, index, isActive, isDone, isMore, locked, showCheck, isLast, isDragging, onClick }: {
  step: StepConfig; index: number; isActive: boolean; isDone: boolean; isMore: boolean;
  locked: boolean; showCheck: boolean; isLast: boolean; isDragging: boolean; onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: step.id,
    disabled: locked,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 200ms ease',
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {!isLast && (
        <div className="absolute left-[27px] top-[44px] bottom-[-16px] w-px bg-slate-200 z-0" />
      )}
      <div
        {...(!locked ? attributes : {})}
        onClick={onClick}
        className={`group relative z-10 flex w-full select-none items-center gap-2 rounded-xl px-2 py-3 transition-colors cursor-pointer ${
          isActive ? 'bg-indigo-50' : 'hover:bg-slate-50'
        }`}
      >
        <div className={`flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full text-sm transition-colors ${
          isActive ? 'bg-indigo-600 text-white' : showCheck ? 'bg-indigo-600 text-white' : 'border-2 border-slate-200 bg-white text-slate-500'
        }`}>
          {showCheck ? <FiCheck className="text-xs" />
            : isMore ? <FiPlus className="text-sm" />
            : isActive ? step.icon
            : <span className="text-[11px] font-semibold">{index + 1}</span>}
        </div>
        <div className="flex-1">
          <p className={`text-[13px] leading-tight ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>{step.title}</p>
          <p className={`text-[11px] ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>{step.subtitle}</p>
        </div>
        <span
          {...(!locked ? listeners : {})}
          className={`shrink-0 touch-none p-1 text-slate-300 transition-opacity ${
            locked ? 'invisible' : 'cursor-grab active:cursor-grabbing md:opacity-0 md:group-hover:opacity-100'
          }`}
        >
          <GripIcon />
        </span>
      </div>
    </div>
  );
}

function DrawerStepItem({ step, index, isActive, isMore, locked, showCheck, isDragging, onClick }: {
  step: StepConfig; index: number; isActive: boolean; isDone: boolean; isMore: boolean;
  locked: boolean; showCheck: boolean; isDragging: boolean; onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: step.id,
    disabled: locked,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : (transition ?? 'transform 200ms ease'),
    zIndex: isDragging ? 50 : undefined,
    boxShadow: isDragging ? '0 6px 20px rgba(99,102,241,0.22)' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!locked ? attributes : {})}
      onClick={onClick}
      className={`group flex select-none items-center gap-2 rounded-xl px-2 transition-colors cursor-pointer ${
        isDragging ? 'bg-white ring-2 ring-indigo-400/50 rounded-xl' : isActive ? 'bg-indigo-50' : 'hover:bg-slate-50'
      }`}
    >
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
        isActive ? 'bg-indigo-600 text-white' : showCheck ? 'bg-indigo-600 text-white' : 'border-2 border-slate-200 bg-white text-slate-400'
      }`}>
        {showCheck ? <FiCheck className="text-[10px]" /> : isMore ? <FiPlus className="text-xs" /> : index + 1}
      </div>
      <div className="flex-1 min-w-0 py-2.5">
        <p className={`text-[13px] font-medium leading-tight truncate ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>{step.title}</p>
        <p className="text-[11px] text-slate-400 truncate">{step.subtitle}</p>
      </div>
      {isActive && <div className="h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />}
      <span
        {...(!locked ? listeners : {})}
        className={`shrink-0 touch-none py-3 pr-1 text-slate-300 transition-opacity ${
          locked ? 'invisible' : 'cursor-grab active:cursor-grabbing md:opacity-0 md:group-hover:opacity-100'
        }`}
      >
        <GripIcon />
      </span>
    </div>
  );
}

function ACA({ label, type, value, onChange, placeholder, required, hint }: {
  label: string; type: SuggestionType; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-slate-600">{label}{required && <span className="ml-0.5 text-slate-400">*</span>}</label>
      <Autocomplete
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputClassName="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function TA({ label, value, onChange, placeholder, hint, rows = 3, action }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string; rows?: number; action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm text-slate-600">{label}</label>
        {action && <div>{action}</div>}
      </div>
      <textarea value={value} rows={rows} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10" />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function EntryHeader({ label, index, showRemove, onRemove }: {
  label: string; index: number; showRemove: boolean; onRemove: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label} {String(index + 1).padStart(2, '0')}
      </p>
      {showRemove && (
        <button onClick={onRemove} className="flex cursor-pointer items-center gap-1 text-xs text-slate-400 transition hover:text-red-500">
          <FiX className="text-xs" /> Remove
        </button>
      )}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-4 text-sm text-slate-400 transition hover:border-indigo-300 hover:bg-white hover:text-indigo-600">
      <FiPlusCircle className="text-base" /> {label}
    </button>
  );
}

// â”€â”€ AI Sparkle icon â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AiSparkleIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2l1.8 5.4L19.2 9l-5.4 1.8L12 16.2l-1.8-5.4L4.8 9l5.4-1.8L12 2z" fill="currentColor" />
      <path d="M19 14l.9 2.6L22.5 17.5l-2.6.9L19 21l-.9-2.6L15.5 17.5l2.6-.9L19 14z" fill="currentColor" opacity=".7" />
      <path d="M5.5 16l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6.6-1.9z" fill="currentColor" opacity=".5" />
    </svg>
  );
}

// â”€â”€ Personal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 function PersonalForm({ data, onChange, session }: {
  data: any;
  onChange: (d: any) => void;
  session: any;
}) {
  const userInitial = data.firstName[0]?.toUpperCase() ?? 'A';
  const [modalOpen, setModalOpen]     = useState(false);
  const [imgLoading, setImgLoading]   = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const up = (f: string, v: any) => onChange({ ...data, [f]: v });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleDeleteImage = async () => {
    if (!data.image) return;
    const prevImage = data.image;
    up('image', null);
    if (prevImage.publicId) {
      try {
        await fetch(`/api/upload/image/delete?publicId=${encodeURIComponent(prevImage.publicId)}`, { method: 'DELETE' });
      } catch (err) { console.error('Failed to delete image:', err); }
    }
  };

  const links = data.links || [];
  const availablePlatforms = SOCIAL_PLATFORMS.filter(p => !links.some((l: any) => l.type === p.id));

  return (
    <div className="space-y-5">
      {/* â”€â”€ Profile photo â”€â”€ */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="mb-4 text-sm text-slate-600">Profile photo</p>
        <div className="flex items-center gap-5">
          <div className="group relative h-20 w-20 flex-shrink-0">
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-indigo-50 ring-2 ring-indigo-100">
              {imgLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center animate-pulse bg-indigo-50">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-500" />
                </div>
              )}
              {data.image ? (
                <Image src={data.image.url} alt="Profile" width={80} height={80} className={`h-full w-full object-cover transition-opacity duration-500 ${imgLoading ? 'opacity-0' : 'opacity-100'}`} onLoad={() => setImgLoading(false)} onError={() => setImgLoading(false)} />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-indigo-500">{userInitial}</div>
              )}
            </div>
            {data.image && !imgLoading && (
              <button onClick={handleDeleteImage} className="absolute -right-0.5 -top-0.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow transition group-hover:opacity-100">
                <FiX className="text-[9px]" />
              </button>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => setModalOpen(true)} className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
                <FiUpload className="text-sm" /> {data.image ? 'Change photo' : 'Upload photo'}
              </button>
              <a href="/ai-headshot" target="_blank" rel="noopener noreferrer" className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:from-indigo-700 hover:to-violet-700">
                <AiSparkleIcon /> Create AI Headshot
              </a>
            </div>
            <p className="text-[11px] text-slate-400">JPG, PNG or WebP Â· max 5 MB</p>
          </div>
        </div>
      </div>

      {/* â”€â”€ Basic Info â”€â”€ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CF label="First name" value={data.firstName} onChange={v => up('firstName', v)} required />
        <CF label="Last name"  value={data.lastName} onChange={v => up('lastName', v)} required />
      </div>
      <ACA label="Professional title" type="role" value={data.professionalTitle} onChange={v => up('professionalTitle', v)} hint="Role you're targeting â€” shown large on the resume." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CF label="Email" value={data.email} onChange={v => up('email', v)} type="email" required />
        <CF label="Phone" value={data.phone} onChange={v => up('phone', v)} />
      </div>
      <ACA label="Location" type="location" value={data.location} onChange={v => up('location', v)} />
      <TA 
        label="Profile Summary" 
        value={data.summary || ''} 
        onChange={v => up('summary', v)} 
        placeholder="Briefly describe your background, key skills, and what you're looking for..." 
        hint="A strong summary captures a recruiter's attention in seconds."
        action={
          <button 
            type="button" 
            onClick={() => setSuggestionsOpen(true)}
            className="group flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <AiSparkleIcon className="text-slate-400 transition-colors group-hover:text-indigo-500" /> 
            AI Suggestions
          </button>
        }
      />

      {/* â”€â”€ Social & Portfolio Links â”€â”€ */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800">Social & Portfolio Links</p>
          {availablePlatforms.length > 0 && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <FiPlus className={`text-sm transition-transform duration-300 ${menuOpen ? 'rotate-45' : ''}`} /> 
                Add link
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 w-[280px] sm:w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="grid grid-cols-2 gap-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {availablePlatforms.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          const username = (data.firstName + data.lastName).toLowerCase() || 'username';
                          const dummyUrl = p.placeholder.replace('{username}', username);
                          up('links', [...links, { type: p.id, url: dummyUrl }]);
                          setMenuOpen(false);
                        }}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-[11px] text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <span className="flex-shrink-0 text-slate-400 group-hover:text-indigo-500">{p.icon}</span>
                        <span className="truncate font-medium">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {links.map((link: any, i: number) => {
            const p = SOCIAL_PLATFORMS.find(x => x.id === link.type) || SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1];
            return (
              <div key={link.type} className="group relative flex animate-in fade-in zoom-in-95 duration-300 items-center rounded-xl border border-slate-200 bg-white p-1 pr-1.5 transition-all hover:border-indigo-200 hover:shadow-sm">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-500">
                  {p.icon}
                </div>
                <input
                  type="text"
                  value={link.url}
                  onChange={ev => {
                    const newLinks = [...links];
                    newLinks[i].url = ev.target.value;
                    up('links', newLinks);
                  }}
                  placeholder={p.placeholder.replace('{username}', (data.firstName + data.lastName).toLowerCase() || 'username')}
                  className="w-full bg-transparent px-2.5 py-2 text-[13px] text-slate-900 outline-none transition-all placeholder:text-slate-300"
                />
                <button
                  onClick={() => up('links', links.filter((_: any, idx: number) => idx !== i))}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  title={`Remove ${p.label}`}
                >
                  <FiX className="text-xs" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {modalOpen && (
        <ImageUploadModal
          currentPublicId={data.image?.publicId}
          session={session}
          onUploaded={(url, publicId) => { setImgLoading(true); up('image', { url, publicId }); setModalOpen(false); }}
          onClose={() => setModalOpen(false)}
        />
      )}

      {suggestionsOpen && (
        <SummarySuggestionsModal
          currentTitle={data.professionalTitle || ''}
          onSelect={(selectedSummary) => {
            up('summary', selectedSummary);
            setSuggestionsOpen(false);
          }}
          onClose={() => setSuggestionsOpen(false)}
        />
      )}
    </div>
  );
}

// â”€â”€ Summary Suggestions Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SummarySuggestionsModal({ currentTitle, onSelect, onClose }: {
  currentTitle: string;
  onSelect: (summary: string) => void;
  onClose: () => void;
}) {
  const [searchRole, setSearchRole] = useState(currentTitle);
  const [summaries, setSummaries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Debounce generation to avoid lag while typing
    const timer = setTimeout(() => {
      setSummaries(getSummariesForRole(searchRole));
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchRole]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Summary Suggestions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Find ATS-friendly phrases tailored to your role</p>
          </div>
          <button onClick={onClose} className="cursor-pointer text-slate-400 transition hover:text-slate-600">
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Search by Job Title</label>
            <Autocomplete
              type="role"
              value={searchRole}
              onChange={setSearchRole}
              trackOnBlur={false}
              placeholder="e.g. Frontend Developer"
              inputClassName="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 shadow-sm"
            />
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20" />
                  <div className="relative h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                </div>
                <p className="mt-6 text-sm font-medium text-slate-500 animate-pulse">Generating AI suggestions...</p>
              </div>
            ) : summaries.length > 0 ? (
              summaries.map((summary, idx) => (
                <div key={idx} className="group relative rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-md">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <FiMessageSquare className="text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed text-slate-700">{summary}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => onSelect(summary)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-indigo-600 hover:text-white"
                    >
                      <FiPlus className="text-sm" /> Use this summary
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-slate-500">Type a job title to see suggestions.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// â”€â”€ Image Upload Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ImageUploadModal({ currentPublicId, session, onUploaded, onClose }: {
  currentPublicId?: string;
  session: import('next-auth').Session | null;
  onUploaded: (url: string, publicId: string) => void;
  onClose: () => void;
}) {
  const [staged, setStaged]       = useState<{ file: File; preview: string } | null>(null);
  const [dragging, setDragging]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [visibleProg, setVisibleProg] = useState(0);
  const [error, setError]         = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Only image files are allowed.'); return; }
    if (file.size > 5 * 1024 * 1024)    { setError('File must be under 5 MB.');       return; }
    setError('');
    if (staged) URL.revokeObjectURL(staged.preview);
    setStaged({ file, preview: URL.createObjectURL(file) });
  };

  useEffect(() => {
    if (!uploading) return;

    const timer = setInterval(() => {
      setVisibleProg(prev => {
        // While still uploading/processing, cap it at 99
        if (prev >= 99) return 99;
        
        // Target is the actual transfer progress (capped at 98 to allow slow crawl to 99)
        const target = Math.min(progress, 98);
        
        if (prev < target) return Math.min(prev + 5, target);
        return prev + 1; // Slow crawl towards 99
      });
    }, 120);

    return () => clearInterval(timer);
  }, [uploading, progress]);

  const addFiles = (files: FileList | null) => { if (files?.[0]) pickFile(files[0]); };

    const upload = () => {
    if (!staged) return;
    setUploading(true);
    setProgress(0);
    setError('');

    if (!session) {
      // â”€â”€ Local Upload for Anonymous users â”€â”€
      const reader = new FileReader();
      reader.onprogress = (e) => { if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100)); };
      reader.onload = () => {
        setUploading(false);
        onUploaded(reader.result as string, '');
      };
      reader.onerror = () => { setError('Failed to read file locally.'); setUploading(false); };
      reader.readAsDataURL(staged.file);
      return;
    }

    const fd = new FormData();
    fd.append('file', staged.file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload/image');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setProgress(pct);
      }
    };

    xhr.onload = async () => {
      setUploading(false);
      const resp = JSON.parse(xhr.responseText);
      if (xhr.status === 200 && resp.url) {
        onUploaded(resp.url, resp.publicId);
        // Cleanup old image if it exists
        if (currentPublicId) {
          fetch(`/api/upload/image/delete?publicId=${encodeURIComponent(currentPublicId)}`, { method: 'DELETE' }).catch(console.error);
        }
      } else {
        setError(resp.message ?? 'Upload failed');
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setError('Network error occurred.');
    };

    xhr.send(fd);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">Upload Profile Photo</h2>
          <button onClick={onClose} className="cursor-pointer text-slate-400 transition hover:text-slate-600"><FiX /></button>
        </div>

        <div className="space-y-4 p-6">
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition-colors ${
              dragging ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50/60'
            }`}
          >
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={e => addFiles(e.target.files)} />
            <FiUpload className="text-2xl text-slate-400" />
            <p className="text-sm text-slate-600">Drag & drop or <span className="text-indigo-600 underline underline-offset-2">browse files</span></p>
            <p className="text-xs text-slate-400">JPG, PNG, WebP Â· max 5 MB each</p>
          </div>

          {/* Staged preview */}
          {staged && (
            <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="relative h-16 w-16 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={staged.preview} alt="" className="h-full w-full rounded-xl object-cover ring-1 ring-slate-200" />
                {uploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/70 backdrop-blur-[2px]">
                    <svg className="h-10 w-10 -rotate-90" viewBox="0 0 32 32">
                      {/* Background circle */}
                      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="3" fill="none" className="text-slate-200" />
                      {/* Progress circle */}
                      <circle
                        cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="3" fill="none"
                        className="text-indigo-600 transition-all duration-300 ease-out"
                        strokeDasharray={75.4}
                        strokeDashoffset={75.4 - (visibleProg / 100) * 75.4}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-bold text-indigo-700">{visibleProg}%</span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-slate-700">{staged.file.name}</p>
                <p className="text-xs text-slate-400">{(staged.file.size / 1024).toFixed(0)} KB</p>
              </div>
              {!uploading && (
                <button onClick={() => { URL.revokeObjectURL(staged.preview); setStaged(null); }}
                  className="cursor-pointer text-slate-400 transition hover:text-red-500">
                  <FiX />
                </button>
              )}
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}

          {/* AI Headshot CTA */}
          <a href="/ai-headshot" target="_blank" rel="noopener noreferrer"
            className={`flex cursor-pointer items-center gap-3 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 px-4 py-3.5 transition hover:from-indigo-100 hover:to-violet-100 ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600">
              <AiSparkleIcon className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-indigo-700">Create Professional AI Headshot</p>
              <p className="text-xs text-slate-500">Generate a studio-quality photo with AI</p>
            </div>
            <FiArrowRight className="flex-shrink-0 text-indigo-400" />
          </a>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} disabled={uploading} className="cursor-pointer text-sm text-slate-500 transition hover:text-slate-700 disabled:opacity-50">Cancel</button>
          <button onClick={upload} disabled={!staged || uploading}
            className="flex min-w-[120px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-40">
            {uploading ? (
              <>
                <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Uploadingâ€¦</span>
              </>
            ) : (
              'Upload photo'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, message }: { title: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/30 py-10 px-4 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
        <FiActivity className="text-lg" />
      </div>
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className="mt-1 text-[11px] text-slate-400">{message || "This section will be omitted from your resume."}</p>
    </div>
  );
}

// â”€â”€ Experience â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€ Experience â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ExperienceForm({ entries, onChange }: { entries: ExperienceEntry[]; onChange: (v: ExperienceEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, role: '', company: '', start: '', end: '', location: '', currentlyWorking: false, description: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof ExperienceEntry, v: any) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      {entries.length === 0 ? (
        <EmptyState title="No experience added" message="If you are a student or fresher, you can leave this empty or add internships." />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
          <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {entries.map((e, i) => (
                <SortableEntry
                  key={e.id}
                  id={e.id}
                  index={i}
                  entry={e}
                  isExpanded={expandedId === e.id}
                  onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                  onRemove={() => rm(e.id)}
                  onUpdate={(f, v) => up(e.id, f, v)}
                  label="Position"
                  title={e.role && e.company ? `${e.role} at ${e.company}` : e.role || e.company || '(Not specified)'}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <ACA label="Role" type="role" required value={e.role} onChange={v => up(e.id, 'role', v)} placeholder="Senior Designer" />
                      <ACA label="Company" type="company" required value={e.company} onChange={v => up(e.id, 'company', v)} placeholder="Acme Inc." />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <CF label="Start" value={e.start} onChange={v => up(e.id, 'start', v)} placeholder="YYYY-MM" />
                      <CF label="End" value={e.currentlyWorking ? '' : e.end} onChange={v => up(e.id, 'end', v)} placeholder={e.currentlyWorking ? 'Present' : 'YYYY-MM'} disabled={e.currentlyWorking} />
                      <ACA label="Location" type="location" value={e.location} onChange={v => up(e.id, 'location', v)} placeholder="City, ST" />
                    </div>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input type="checkbox" checked={e.currentlyWorking} onChange={ev => up(e.id, 'currentlyWorking', ev.target.checked)} className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600" />
                      <span className="text-sm text-slate-600">I currently work here</span>
                    </label>
                    <TA label="What you did" value={e.description} onChange={v => up(e.id, 'description', v)} rows={4}
                      placeholder="Describe key achievements. Start with a strong verb. Quantify."
                      hint="One achievement per line. Start with a strong verb. Quantify." />
                  </div>
                </SortableEntry>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      <AddButton label={entries.length === 0 ? "Add experience" : "Add another position"} onClick={add} />
    </div>
  );
}

function SortableEntry({ id, index, entry, isExpanded, onToggleExpand, onRemove, onUpdate, label, title, children }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const isHidden = entry.isHidden;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    zIndex: isDragging ? 10 : 1,
    boxShadow: isDragging ? '0 8px 28px rgba(99,102,241,0.2)' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-xl border bg-white transition-shadow duration-200 ${
        isDragging ? 'border-indigo-300 ring-2 ring-indigo-400/40' : isExpanded ? 'border-indigo-300 shadow-sm ring-1 ring-indigo-50' : 'border-slate-200 hover:border-indigo-200'
      } ${isHidden ? 'opacity-60 bg-slate-50 grayscale-[0.2]' : ''}`}
    >
      {/* Header */}
      <div 
        onClick={onToggleExpand}
        className={`flex cursor-pointer items-center justify-between p-4 transition-colors ${
          isExpanded ? 'border-b border-slate-100 bg-slate-50/50 rounded-t-xl' : 'rounded-xl hover:bg-slate-50/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div 
            {...attributes} 
            {...listeners} 
            onClick={(e) => e.stopPropagation()}
            className="cursor-grab touch-none text-slate-300 transition-colors hover:text-indigo-500 active:cursor-grabbing p-1 -ml-1 rounded"
          >
            <MdDragIndicator className="text-xl" />
          </div>
          
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {label} {String(index + 1).padStart(2, '0')}
            </span>
            <span className={`text-sm font-semibold transition-all ${isHidden ? 'line-through text-slate-400' : 'text-slate-800'}`}>
              {title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUpdate('isHidden', !isHidden);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              isHidden ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            {isHidden ? <><FiEyeOff /> <span className="hidden sm:inline">Excluded</span></> : <><FiEye /> <span className="hidden sm:inline">Included</span></>}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <FiTrash2 />
          </button>

          <div className="rounded-lg p-1 text-slate-400 ml-1">
            <FiChevronDown className={`transition-transform duration-300 text-lg ${isExpanded ? 'rotate-180 text-indigo-500' : ''}`} />
          </div>
        </div>
      </div>

      {/* Expandable Body */}
      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-5 pt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€ Education â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€ Education â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function EducationForm({ entries, onChange }: { entries: EducationEntry[]; onChange: (v: EducationEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, type: 'college', school: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '', gpa: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof EducationEntry, v: any) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      {entries.length === 0 ? (
        <EmptyState title="No education added" />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
          <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {entries.map((e, i) => {
                const isSchool = e.type === 'school';
                return (
                  <SortableEntry
                    key={e.id}
                    id={e.id}
                    index={i}
                    entry={e}
                    isExpanded={expandedId === e.id}
                    onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                    onRemove={() => rm(e.id)}
                    onUpdate={(f, v) => up(e.id, f, v)}
                    label="Education"
                    title={e.degree && e.school ? `${e.degree} at ${e.school}` : e.degree || e.school || '(Not specified)'}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-xs font-medium text-slate-500">Degree type:</span>
                        <div className="relative flex rounded-lg bg-slate-100 p-0.5 w-48">
                          <div 
                            className={`absolute bottom-0.5 top-0.5 w-[calc(50%-2px)] rounded-md bg-white shadow-sm transition-all duration-300 ease-out ${
                              isSchool ? 'left-[calc(50%+1px)]' : 'left-0.5'
                            }`}
                          />
                          <button type="button" onClick={() => up(e.id, 'type', 'college')}
                            className={`relative z-10 flex w-1/2 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-1 text-[11px] font-semibold transition-colors duration-300 ${!isSchool ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
                            <FiAward className="text-[12px]" /> College
                          </button>
                          <button type="button" onClick={() => up(e.id, 'type', 'school')}
                            className={`relative z-10 flex w-1/2 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-1 text-[11px] font-semibold transition-colors duration-300 ${isSchool ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
                            <FiBookOpen className="text-[12px]" /> School
                          </button>
                        </div>
                      </div>
                      
                      <ACA label={isSchool ? "School / Board name" : "School"} type="institute" required value={e.school} onChange={v => up(e.id, 'school', v)} placeholder={isSchool ? "Delhi Public School / CBSE" : "University name"} />
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <ACA label={isSchool ? "Standard / Board" : "Degree"} type="degree" value={e.degree} onChange={v => up(e.id, 'degree', v)} placeholder={isSchool ? "Class XII (CBSE)" : "B.Tech / M.A."} />
                        <ACA label={isSchool ? "Stream" : "Field of study"} type="field" value={e.fieldOfStudy} onChange={v => up(e.id, 'fieldOfStudy', v)} placeholder={isSchool ? "Science / Commerce" : "Computer Science"} />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <CF label="Start year" value={e.startYear} onChange={v => up(e.id, 'startYear', v)} placeholder="2015" />
                        <CF label="End year" value={e.endYear} onChange={v => up(e.id, 'endYear', v)} placeholder="2019" />
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm text-slate-600">{isSchool ? "Percentage / CGPA" : "GPA"} <span className="text-[10px] text-indigo-400">Optional</span></label>
                          <input type="text" value={e.gpa} onChange={ev => up(e.id, 'gpa', ev.target.value)} placeholder={isSchool ? "95% / 9.8" : "3.8"}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10" />
                        </div>
                      </div>
                    </div>
                  </SortableEntry>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}
      <AddButton label={entries.length === 0 ? "Add education" : "Add another education"} onClick={add} />
    </div>
  );
}

// â”€â”€ Skills â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SkillsForm({ skills, onChange }: { skills: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput]   = useState('');
  const addSkill = (raw: string) => {
    const t = raw.trim().replace(/,$/, '');
    if (t && !skills.includes(t)) onChange([...skills, t]);
    setInput('');
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(input); }
    else if (e.key === 'Backspace' && !input) onChange(skills.slice(0, -1));
  };
  const suggestions = SUGG_SKILLS.filter(s => !skills.includes(s));
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="mb-3 text-sm text-slate-600">Add a skill</p>
        <div className="flex min-h-[44px] flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-2.5 transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/10">
          {skills.map(s => (
            <span key={s} className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
              {s}
              <button onClick={() => onChange(skills.filter(x => x !== s))} className="cursor-pointer text-slate-400 transition hover:text-slate-700"><FiX className="text-[10px]" /></button>
            </span>
          ))}
          <Autocomplete
            type="skill"
            value={input}
            onChange={setInput}
            onSelect={(val) => addSkill(val)}
            onInputKeyDown={onKeyDown}
            placeholder={skills.length === 0 ? 'Type a skill...' : ''}
            className="min-w-[100px] flex-1"
            inputClassName="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-300"
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">Press Enter or comma to add. Backspace on empty removes the last.</p>
      </div>
      {suggestions.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Suggested</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button key={s} onClick={() => onChange([...skills, s])}
                className="flex cursor-pointer items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600">
                <span className="text-slate-400">+</span> {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// â”€â”€ More â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function MoreForm({ selectedIds, onToggle }: { selectedIds: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">Select sections to add to your resume. They&apos;ll appear in Build Steps for you to fill in.</p>
      {(['EXPERIENCE', 'SKILLS', 'ACADEMIC', 'OTHERS'] as const).map(group => {
        const items = MORE_SECTION_DEFS.filter(s => s.group === group);
        return (
          <div key={group || '__base__'}>
            {group && <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{group}</p>}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {items.map(item => {
                const sel = selectedIds.includes(item.id);
                return (
                  <button key={item.id} onClick={() => onToggle(item.id)}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${sel ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`}>
                    <span className={`text-base ${sel ? 'text-indigo-500' : 'text-slate-400'}`}>{item.icon}</span>
                    <div className="flex-1">
                      <p className={`text-sm ${sel ? 'text-indigo-700' : 'text-slate-700'}`}>{item.title}</p>
                      <p className="text-xs text-slate-400">{item.subtitle}</p>
                    </div>
                    <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-colors ${sel ? 'border-indigo-500 bg-indigo-600' : 'border-slate-300 bg-white'}`}>
                      {sel && <FiCheck className="text-[10px] text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      {selectedIds.length > 0 && (
        <p className="text-xs text-indigo-600">{selectedIds.length} section{selectedIds.length > 1 ? 's' : ''} added â€” navigate from the sidebar to fill them in.</p>
      )}
    </div>
  );
}

// â”€â”€ Projects â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ProjectsForm({ entries, onChange }: { entries: ProjectEntry[]; onChange: (v: ProjectEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, title: '', company: '', start: '', end: '', ongoing: false, description: '', tech: '', url: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof ProjectEntry, v: any) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      {entries.length === 0 ? (
        <EmptyState title="No projects added" message="Personal or professional projects help showcase your practical skills." />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {entries.map((e, i) => (
                <SortableEntry
                  key={e.id}
                  id={e.id}
                  index={i}
                  entry={e}
                  isExpanded={expandedId === e.id}
                  onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                  onRemove={() => rm(e.id)}
                  onUpdate={(f, v) => up(e.id, f, v)}
                  label="Project"
                  title={e.title || '(Not specified)'}
                >
                  <div className="space-y-4">
                    <CF label="Project title" required value={e.title} onChange={v => up(e.id, 'title', v)} placeholder="My Awesome Project" />
                    <ACA label="Company / Organization" type="company" value={e.company} onChange={v => up(e.id, 'company', v)} placeholder="University / Freelance" />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <CF label="Start date" value={e.start} onChange={v => up(e.id, 'start', v)} placeholder="YYYY-MM" />
                      <CF label="End date" value={e.ongoing ? '' : e.end} onChange={v => up(e.id, 'end', v)} placeholder={e.ongoing ? 'Ongoing' : 'YYYY-MM'} disabled={e.ongoing} />
                    </div>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input type="checkbox" checked={e.ongoing} onChange={ev => up(e.id, 'ongoing', ev.target.checked)} className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600" />
                      <span className="text-sm text-slate-600">Ongoing project</span>
                    </label>
                    <TA label="Description" value={e.description} onChange={v => up(e.id, 'description', v)} placeholder="What did you build? What problem did it solve? What was the impact?" />
                    <CF label="Project URL" value={e.url} onChange={v => up(e.id, 'url', v)} placeholder="github.com/you/project" />
                    <CF label="Technologies used" value={e.tech} onChange={v => up(e.id, 'tech', v)} placeholder="React, TypeScript, Node.js" hint="Comma-separated list of tools and technologies." />
                  </div>
                </SortableEntry>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      <AddButton label={entries.length === 0 ? "Add project" : "Add another project"} onClick={add} />
    </div>
  );
}

// â”€â”€ Certificates â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€ Certificates â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CertificatesForm({ entries, onChange }: { entries: CertEntry[]; onChange: (v: CertEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, name: '', issuer: '', issueDate: '', expDate: '', noExp: false, credId: '', credUrl: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof CertEntry, v: any) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      {entries.length === 0 ? (
        <EmptyState title="No certificates added" />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
          <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {entries.map((e, i) => (
                <SortableEntry
                  key={e.id}
                  id={e.id}
                  index={i}
                  entry={e}
                  isExpanded={expandedId === e.id}
                  onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                  onRemove={() => rm(e.id)}
                  onUpdate={(f, v) => up(e.id, f, v)}
                  label="Certificate"
                  title={e.name || '(Not specified)'}
                >
                  <div className="space-y-4">
                    <CF label="Certificate name" required value={e.name} onChange={v => up(e.id, 'name', v)} placeholder="AWS Certified Solutions Architect" />
                    <ACA label="Issuing organization" type="company" required value={e.issuer} onChange={v => up(e.id, 'issuer', v)} placeholder="Amazon Web Services" />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <CF label="Issue date" value={e.issueDate} onChange={v => up(e.id, 'issueDate', v)} placeholder="YYYY-MM" />
                      <CF label="Expiration date" value={e.noExp ? '' : e.expDate} onChange={v => up(e.id, 'expDate', v)} placeholder={e.noExp ? 'No expiration' : 'YYYY-MM'} disabled={e.noExp} />
                    </div>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input type="checkbox" checked={e.noExp} onChange={ev => up(e.id, 'noExp', ev.target.checked)} className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600" />
                      <span className="text-sm text-slate-600">No expiration date</span>
                    </label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <CF label="Credential ID" value={e.credId} onChange={v => up(e.id, 'credId', v)} placeholder="ABC-123" />
                      <CF label="Credential URL" value={e.credUrl} onChange={v => up(e.id, 'credUrl', v)} placeholder="verify.example.com/cert" />
                    </div>
                  </div>
                </SortableEntry>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      <AddButton label={entries.length === 0 ? "Add certificate" : "Add another certificate"} onClick={add} />
    </div>
  );
}

// â”€â”€ Coursework â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€ Coursework â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CourseworkForm({ entries, onChange }: { entries: CourseworkEntry[]; onChange: (v: CourseworkEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, course: '', institution: '', grade: '', year: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof CourseworkEntry, v: string) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      {entries.length === 0 ? (
        <EmptyState title="No courses added" />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
          <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {entries.map((e, i) => (
                <SortableEntry
                  key={e.id}
                  id={e.id}
                  index={i}
                  entry={e}
                  isExpanded={expandedId === e.id}
                  onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                  onRemove={() => rm(e.id)}
                  onUpdate={(f, v) => up(e.id, f, v)}
                  label="Course"
                  title={e.course || '(Not specified)'}
                >
                  <div className="space-y-4">
                    <CF label="Course name" required value={e.course} onChange={v => up(e.id, 'course', v)} placeholder="Machine Learning" />
                    <ACA label="Institution" type="institute" value={e.institution} onChange={v => up(e.id, 'institution', v)} placeholder="IIT Madras / Coursera" />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <CF label="Grade / Score" value={e.grade} onChange={v => up(e.id, 'grade', v)} placeholder="A / 95%" />
                      <CF label="Year completed" value={e.year} onChange={v => up(e.id, 'year', v)} placeholder="2023" />
                    </div>
                  </div>
                </SortableEntry>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      <AddButton label={entries.length === 0 ? "Add course" : "Add another course"} onClick={add} />
    </div>
  );
}

// â”€â”€ Involvement â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€ Involvement â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function InvolvementForm({ entries, onChange }: { entries: InvolvementEntry[]; onChange: (v: InvolvementEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, organization: '', role: '', start: '', end: '', current: false, description: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof InvolvementEntry, v: any) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
        <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <SortableEntry
                key={e.id}
                id={e.id}
                index={i}
                entry={e}
                isExpanded={expandedId === e.id}
                onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                onRemove={() => rm(e.id)}
                onUpdate={(f, v) => up(e.id, f, v)}
                label="Activity"
                title={e.role && e.organization ? `${e.role} at ${e.organization}` : e.role || e.organization || '(Not specified)'}
              >
                <div className="space-y-4">
                  <ACA label="Organization" type="company" required value={e.organization} onChange={v => up(e.id, 'organization', v)} placeholder="Design Club / Student Council" />
                  <ACA label="Role / Position" type="role" required value={e.role} onChange={v => up(e.id, 'role', v)} placeholder="Vice President" />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <CF label="Start" value={e.start} onChange={v => up(e.id, 'start', v)} placeholder="YYYY-MM" />
                    <CF label="End" value={e.current ? '' : e.end} onChange={v => up(e.id, 'end', v)} placeholder={e.current ? 'Present' : 'YYYY-MM'} disabled={e.current} />
                    <div className="flex items-end pb-2">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" checked={e.current} onChange={ev => up(e.id, 'current', ev.target.checked)} className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600" />
                        <span className="text-sm text-slate-600">Currently active</span>
                      </label>
                    </div>
                  </div>
                  <TA label="Description" value={e.description} onChange={v => up(e.id, 'description', v)} placeholder="Describe your contributions and impact." />
                </div>
              </SortableEntry>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <AddButton label="Add another activity" onClick={add} />
    </div>
  );
}

// â”€â”€ Awards & Honors â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AwardsForm({ entries, onChange }: { entries: AwardEntry[]; onChange: (v: AwardEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, name: '', issuer: '', date: '', description: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof AwardEntry, v: string) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
        <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <SortableEntry
                key={e.id}
                id={e.id}
                index={i}
                entry={e}
                isExpanded={expandedId === e.id}
                onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                onRemove={() => rm(e.id)}
                onUpdate={(f, v) => up(e.id, f, v)}
                label="Award"
                title={e.name || '(Not specified)'}
              >
                <div className="space-y-4">
                  <CF label="Award name" required value={e.name} onChange={v => up(e.id, 'name', v)} placeholder="Dean's List / Hackathon Winner" />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ACA label="Issuing organization" type="company" value={e.issuer} onChange={v => up(e.id, 'issuer', v)} placeholder="Google / Flipkart" />
                    <CF label="Date" value={e.date} onChange={v => up(e.id, 'date', v)} placeholder="YYYY or YYYY-MM" />
                  </div>
                  <TA label="Description" value={e.description} onChange={v => up(e.id, 'description', v)} placeholder="Brief description of the award and why you received it." />
                </div>
              </SortableEntry>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <AddButton label="Add another award" onClick={add} />
    </div>
  );
}

// â”€â”€ Publications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€ Publications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PublicationsForm({ entries, onChange }: { entries: PublicationEntry[]; onChange: (v: PublicationEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, title: '', publisher: '', date: '', url: '', description: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof PublicationEntry, v: string) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
        <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <SortableEntry
                key={e.id}
                id={e.id}
                index={i}
                entry={e}
                isExpanded={expandedId === e.id}
                onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                onRemove={() => rm(e.id)}
                onUpdate={(f, v) => up(e.id, f, v)}
                label="Publication"
                title={e.title || '(Not specified)'}
              >
                <div className="space-y-4">
                  <CF label="Title" required value={e.title} onChange={v => up(e.id, 'title', v)} placeholder="Article or paper title" />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ACA label="Publisher / Journal" type="company" value={e.publisher} onChange={v => up(e.id, 'publisher', v)} placeholder="Nature / Medium / IEEE" />
                    <CF label="Publication date" value={e.date} onChange={v => up(e.id, 'date', v)} placeholder="YYYY-MM" />
                  </div>
                  <CF label="URL" value={e.url} onChange={v => up(e.id, 'url', v)} placeholder="doi.org/... or medium.com/..." />
                  <TA label="Abstract / Description" value={e.description} onChange={v => up(e.id, 'description', v)} placeholder="Brief summary of the publication." />
                </div>
              </SortableEntry>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <AddButton label="Add another publication" onClick={add} />
    </div>
  );
}

// â”€â”€ References â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€ References â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ReferencesForm({ entries, onChange }: { entries: ReferenceEntry[]; onChange: (v: ReferenceEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, name: '', title: '', company: '', email: '', phone: '', relationship: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof ReferenceEntry, v: any) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <SortableEntry
                key={e.id}
                id={e.id}
                index={i}
                entry={e}
                isExpanded={expandedId === e.id}
                onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                onRemove={() => rm(e.id)}
                onUpdate={(f, v) => up(e.id, f, v)}
                label="Reference"
                title={e.name || '(Not specified)'}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CF label="Full name" required value={e.name} onChange={v => up(e.id, 'name', v)} placeholder="Jane Smith" />
                    <ACA label="Job title" type="role" value={e.title} onChange={v => up(e.id, 'title', v)} placeholder="Head of Design" />
                  </div>
                  <ACA label="Company" type="company" value={e.company} onChange={v => up(e.id, 'company', v)} placeholder="Google / Flipkart" />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CF label="Email" value={e.email} onChange={v => up(e.id, 'email', v)} type="email" placeholder="jane@company.com" />
                    <CF label="Phone" value={e.phone} onChange={v => up(e.id, 'phone', v)} placeholder="+1 (555) 000-0000" />
                  </div>
                  <CF label="Relationship" value={e.relationship} onChange={v => up(e.id, 'relationship', v)} placeholder="Direct manager / Colleague / Professor" hint="How do you know this person?" />
                </div>
              </SortableEntry>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <AddButton label="Add another reference" onClick={add} />
    </div>
  );
}

// â”€â”€ Achievements â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€ Achievements â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AchievementsForm({ entries, onChange }: { entries: AchievementEntry[]; onChange: (v: AchievementEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, title: '', issuer: '', date: '', description: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof AchievementEntry, v: string) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
        <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <SortableEntry
                key={e.id}
                id={e.id}
                index={i}
                entry={e}
                isExpanded={expandedId === e.id}
                onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                onRemove={() => rm(e.id)}
                onUpdate={(f, v) => up(e.id, f, v)}
                label="Achievement"
                title={e.title || '(Not specified)'}
              >
                <div className="space-y-4">
                  <CF label="Achievement title" required value={e.title} onChange={v => up(e.id, 'title', v)} placeholder="Employee of the Month" />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ACA label="Issuer" type="company" value={e.issuer} onChange={v => up(e.id, 'issuer', v)} placeholder="Company / Organization" />
                    <CF label="Date" value={e.date} onChange={v => up(e.id, 'date', v)} placeholder="2023" />
                  </div>
                  <TA label="Description" value={e.description} onChange={v => up(e.id, 'description', v)} placeholder="Describe what you achieved." />
                </div>
              </SortableEntry>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <AddButton label="Add another achievement" onClick={add} />
    </div>
  );
}

// â”€â”€ Languages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€ Languages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function LanguagesForm({ entries, onChange }: { entries: LanguageEntry[]; onChange: (v: LanguageEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, language: '', proficiency: 'Full Professional', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof LanguageEntry, v: string) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));
  const levels = ['Elementary', 'Limited Working', 'Professional Working', 'Full Professional', 'Native / Bilingual'];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
        <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <SortableEntry
                key={e.id}
                id={e.id}
                index={i}
                entry={e}
                isExpanded={expandedId === e.id}
                onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                onRemove={() => rm(e.id)}
                onUpdate={(f, v) => up(e.id, f, v)}
                label="Language"
                title={e.language || '(Not specified)'}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ACA label="Language" type="language" required value={e.language} onChange={v => up(e.id, 'language', v)} placeholder="Hindi, English, etc." />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-slate-600">Proficiency</label>
                    <select value={e.proficiency} onChange={ev => up(e.id, 'proficiency', ev.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10">
                      {levels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
              </SortableEntry>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <AddButton label="Add another language" onClick={add} />
    </div>
  );
}

// â”€â”€ Soft Skills â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€ Soft Skills â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SoftSkillsForm({ entries, onChange }: { entries: SoftSkillEntry[]; onChange: (v: SoftSkillEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, skill: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof SoftSkillEntry, v: string) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
        <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <SortableEntry
                key={e.id}
                id={e.id}
                index={i}
                entry={e}
                isExpanded={expandedId === e.id}
                onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                onRemove={() => rm(e.id)}
                onUpdate={(f, v) => up(e.id, f, v)}
                label="Soft Skill"
                title={e.skill || '(Not specified)'}
              >
                <div className="space-y-4">
                  <ACA label="Skill name" type="skill" required value={e.skill} onChange={v => up(e.id, 'skill', v)} placeholder="Public Speaking / Teamwork" />
                </div>
              </SortableEntry>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <AddButton label="Add another soft skill" onClick={add} />
    </div>
  );
}

// â”€â”€ Internships â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€ Internships â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function InternshipsForm({ entries, onChange }: { entries: InternshipEntry[]; onChange: (v: InternshipEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, role: '', company: '', start: '', end: '', location: '', currentlyWorking: false, description: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof InternshipEntry, v: any) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
        <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <SortableEntry
                key={e.id}
                id={e.id}
                index={i}
                entry={e}
                isExpanded={expandedId === e.id}
                onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                onRemove={() => rm(e.id)}
                onUpdate={(f, v) => up(e.id, f, v)}
                label="Internship"
                title={e.role && e.company ? `${e.role} at ${e.company}` : e.role || e.company || '(Not specified)'}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ACA label="Role" type="role" required value={e.role} onChange={v => up(e.id, 'role', v)} placeholder="Design Intern" />
                    <ACA label="Company" type="company" required value={e.company} onChange={v => up(e.id, 'company', v)} placeholder="Google" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <CF label="Start" value={e.start} onChange={v => up(e.id, 'start', v)} placeholder="YYYY-MM" />
                    <CF label="End" value={e.currentlyWorking ? '' : e.end} onChange={v => up(e.id, 'end', v)} placeholder={e.currentlyWorking ? 'Ongoing' : 'YYYY-MM'} disabled={e.currentlyWorking} />
                    <ACA label="Location" type="location" value={e.location} onChange={v => up(e.id, 'location', v)} placeholder="City, ST" />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={e.currentlyWorking} onChange={ev => up(e.id, 'currentlyWorking', ev.target.checked)} className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600" />
                    <span className="text-sm text-slate-600">Currently active</span>
                  </label>
                  <TA label="Description" value={e.description} onChange={v => up(e.id, 'description', v)} placeholder="What did you learn and achieve?" />
                </div>
              </SortableEntry>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <AddButton label="Add another internship" onClick={add} />
    </div>
  );
}

// â”€â”€ Freelance Work â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€ Freelance Work â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FreelanceForm({ entries, onChange }: { entries: FreelanceEntry[]; onChange: (v: FreelanceEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, role: '', client: '', start: '', end: '', currentlyWorking: false, description: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof FreelanceEntry, v: any) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
        <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <SortableEntry
                key={e.id}
                id={e.id}
                index={i}
                entry={e}
                isExpanded={expandedId === e.id}
                onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                onRemove={() => rm(e.id)}
                onUpdate={(f, v) => up(e.id, f, v)}
                label="Freelance Project"
                title={e.role && e.client ? `${e.role} for ${e.client}` : e.role || e.client || '(Not specified)'}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ACA label="Role" type="role" required value={e.role} onChange={v => up(e.id, 'role', v)} placeholder="Independent Designer" />
                    <ACA label="Client / Platform" type="company" value={e.client} onChange={v => up(e.id, 'client', v)} placeholder="Upwork / Private Client" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CF label="Start" value={e.start} onChange={v => up(e.id, 'start', v)} placeholder="YYYY-MM" />
                    <CF label="End" value={e.currentlyWorking ? '' : e.end} onChange={v => up(e.id, 'end', v)} placeholder={e.currentlyWorking ? 'Ongoing' : 'YYYY-MM'} disabled={e.currentlyWorking} />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={e.currentlyWorking} onChange={ev => up(e.id, 'currentlyWorking', ev.target.checked)} className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600" />
                    <span className="text-sm text-slate-600">Currently active</span>
                  </label>
                  <TA label="Description" value={e.description} onChange={v => up(e.id, 'description', v)} placeholder="Scope of work and results." />
                </div>
              </SortableEntry>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <AddButton label="Add another freelance role" onClick={add} />
    </div>
  );
}

// ── Leadership ────────────────────────────────────────────────────────────────
function LeadershipForm({ entries, onChange }: { entries: LeadershipEntry[]; onChange: (v: LeadershipEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, role: '', organization: '', start: '', end: '', current: false, description: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof LeadershipEntry, v: any) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
        <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <SortableEntry
                key={e.id}
                id={e.id}
                index={i}
                entry={e}
                isExpanded={expandedId === e.id}
                onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                onRemove={() => rm(e.id)}
                onUpdate={(f, v) => up(e.id, f, v)}
                label="Leadership"
                title={e.role && e.organization ? `${e.role} at ${e.organization}` : e.role || e.organization || '(Not specified)'}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ACA label="Role" type="role" required value={e.role} onChange={v => up(e.id, 'role', v)} placeholder="Team Captain / Lead" />
                    <ACA label="Organization" type="company" required value={e.organization} onChange={v => up(e.id, 'organization', v)} placeholder="Designers Club" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CF label="Start" value={e.start} onChange={v => up(e.id, 'start', v)} placeholder="YYYY-MM" />
                    <CF label="End" value={e.current ? '' : e.end} onChange={v => up(e.id, 'end', v)} placeholder={e.current ? 'Present' : 'YYYY-MM'} disabled={e.current} />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={e.current} onChange={ev => up(e.id, 'current', ev.target.checked)} className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600" />
                    <span className="text-sm text-slate-600">Currently active</span>
                  </label>
                  <TA label="Description" value={e.description} onChange={v => up(e.id, 'description', v)} placeholder="Leadership impact and responsibilities." />
                </div>
              </SortableEntry>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <AddButton label="Add another leadership role" onClick={add} />
    </div>
  );
}

// â”€â”€ Volunteering â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function VolunteeringForm({ entries, onChange }: { entries: VolunteerEntry[]; onChange: (v: VolunteerEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, role: '', organization: '', start: '', end: '', current: false, description: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof VolunteerEntry, v: any) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
        <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <SortableEntry
                key={e.id}
                id={e.id}
                index={i}
                entry={e}
                isExpanded={expandedId === e.id}
                onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                onRemove={() => rm(e.id)}
                onUpdate={(f, v) => up(e.id, f, v)}
                label="Volunteer Role"
                title={e.role && e.organization ? `${e.role} at ${e.organization}` : e.role || e.organization || '(Not specified)'}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ACA label="Role" type="role" required value={e.role} onChange={v => up(e.id, 'role', v)} placeholder="Mentor / Volunteer" />
                    <ACA label="Organization" type="company" required value={e.organization} onChange={v => up(e.id, 'organization', v)} placeholder="GirlScript / iVolunteer" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CF label="Start" value={e.start} onChange={v => up(e.id, 'start', v)} placeholder="YYYY-MM" />
                    <CF label="End" value={e.current ? '' : e.end} onChange={v => up(e.id, 'end', v)} placeholder={e.current ? 'Present' : 'YYYY-MM'} disabled={e.current} />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={e.current} onChange={ev => up(e.id, 'current', ev.target.checked)} className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600" />
                    <span className="text-sm text-slate-600">Currently active</span>
                  </label>
                  <TA label="Description" value={e.description} onChange={v => up(e.id, 'description', v)} placeholder="What you did and the value you provided." />
                </div>
              </SortableEntry>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <AddButton label="Add another volunteer role" onClick={add} />
    </div>
  );
}

// â”€â”€ Hobbies â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function HobbiesForm({ entries, onChange }: { entries: InterestEntry[]; onChange: (v: InterestEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, name: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof InterestEntry, v: string) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
        <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <SortableEntry
                key={e.id}
                id={e.id}
                index={i}
                entry={e}
                isExpanded={expandedId === e.id}
                onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                onRemove={() => rm(e.id)}
                onUpdate={(f, v) => up(e.id, f, v)}
                label="Hobby / Interest"
                title={e.name || '(Not specified)'}
              >
                <CF label="Name" required value={e.name} onChange={v => up(e.id, 'name', v)} placeholder="Photography / Traveling / Coding" />
              </SortableEntry>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <AddButton label="Add another interest" onClick={add} />
    </div>
  );
}

// â”€â”€ Conferences â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€ Conferences â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ConferencesForm({ entries, onChange }: { entries: ConferenceEntry[]; onChange: (v: ConferenceEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, title: '', organizer: '', date: '', description: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof ConferenceEntry, v: string) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
        <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <SortableEntry
                key={e.id}
                id={e.id}
                index={i}
                entry={e}
                isExpanded={expandedId === e.id}
                onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                onRemove={() => rm(e.id)}
                onUpdate={(f, v) => up(e.id, f, v)}
                label="Event / Workshop"
                title={e.title || '(Not specified)'}
              >
                <div className="space-y-4">
                  <CF label="Event title" required value={e.title} onChange={v => up(e.id, 'title', v)} placeholder="UX Design Conference" />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ACA label="Organizer" type="company" value={e.organizer} onChange={v => up(e.id, 'organizer', v)} placeholder="Figma / Adobe" />
                    <CF label="Date" value={e.date} onChange={v => up(e.id, 'date', v)} placeholder="YYYY-MM" />
                  </div>
                  <TA label="Key takeaways / Description" value={e.description} onChange={v => up(e.id, 'description', v)} placeholder="What did you learn? Did you present?" />
                </div>
              </SortableEntry>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <AddButton label="Add another event" onClick={add} />
    </div>
  );
}

// â”€â”€ Patents â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€ Patents â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PatentsForm({ entries, onChange }: { entries: PatentEntry[]; onChange: (v: PatentEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, title: '', issuer: '', date: '', url: '', description: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof PatentEntry, v: string) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
        <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <SortableEntry
                key={e.id}
                id={e.id}
                index={i}
                entry={e}
                isExpanded={expandedId === e.id}
                onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                onRemove={() => rm(e.id)}
                onUpdate={(f, v) => up(e.id, f, v)}
                label="Patent"
                title={e.title || '(Not specified)'}
              >
                <div className="space-y-4">
                  <CF label="Patent title" required value={e.title} onChange={v => up(e.id, 'title', v)} placeholder="System for Dynamic Rendering" />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <ACA label="Issuing body" type="company" value={e.issuer} onChange={v => up(e.id, 'issuer', v)} placeholder="USPTO / EPO" />
                    <CF label="Date issued" value={e.date} onChange={v => up(e.id, 'date', v)} placeholder="YYYY-MM" />
                  </div>
                  <CF label="Patent URL" value={e.url} onChange={v => up(e.id, 'url', v)} placeholder="google.com/patents/..." />
                  <TA label="Description" value={e.description} onChange={v => up(e.id, 'description', v)} placeholder="Brief summary of the invention." />
                </div>
              </SortableEntry>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <AddButton label="Add another patent" onClick={add} />
    </div>
  );
}

// â”€â”€ Extracurricular â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€ Extracurricular â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ExtracurricularForm({ entries, onChange }: { entries: ExtracurricularEntry[]; onChange: (v: ExtracurricularEntry[]) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(entries[0]?.id || null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const add = () => {
    const id = Date.now().toString();
    onChange([...entries, { id, activity: '', organization: '', start: '', end: '', description: '', isHidden: false }]);
    setExpandedId(id);
  };
  const rm  = (id: string) => onChange(entries.filter(e => e.id !== id));
  const up  = (id: string, f: keyof ExtracurricularEntry, v: string) => onChange(entries.map(e => e.id === id ? { ...e, [f]: v } : e));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = entries.findIndex((e) => e.id === active.id);
      const newIndex = entries.findIndex((e) => e.id === over.id);
      onChange(arrayMove(entries, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
        <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <SortableEntry
                key={e.id}
                id={e.id}
                index={i}
                entry={e}
                isExpanded={expandedId === e.id}
                onToggleExpand={() => setExpandedId(expandedId === e.id ? null : e.id)}
                onRemove={() => rm(e.id)}
                onUpdate={(f, v) => up(e.id, f, v)}
                label="Activity"
                title={e.activity || '(Not specified)'}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CF label="Activity" required value={e.activity} onChange={v => up(e.id, 'activity', v)} placeholder="Chess / Debate" />
                    <ACA label="Organization" type="institute" value={e.organization} onChange={v => up(e.id, 'organization', v)} placeholder="NIT Trichy / University Club" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CF label="Start" value={e.start} onChange={v => up(e.id, 'start', v)} placeholder="YYYY-MM" />
                    <CF label="End" value={e.end} onChange={v => up(e.id, 'end', v)} placeholder="YYYY-MM" />
                  </div>
                  <TA label="Description" value={e.description} onChange={v => up(e.id, 'description', v)} placeholder="Describe your participation." />
                </div>
              </SortableEntry>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <AddButton label="Add another activity" onClick={add} />
    </div>
  );
}

// â”€â”€ Sidebar breadcrumb â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SidebarBreadcrumb() {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1">
        <li>
          <Link href="/" className="flex cursor-pointer items-center gap-1 rounded p-0.5 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M16 7.609c.352 0 .69.122.96.343l.111.1 6.25 6.25v.001a1.5 1.5 0 0 1 .445 1.071v7.5a.89.89 0 0 1-.891.891H9.125a.89.89 0 0 1-.89-.89v-7.5l.006-.149a1.5 1.5 0 0 1 .337-.813l.1-.11 6.25-6.25c.285-.285.67-.444 1.072-.444Zm5.984 7.876L16 9.5l-5.984 5.985v6.499h11.968z"
                fill="currentColor" stroke="currentColor" strokeWidth=".094" />
            </svg>
            Home
          </Link>
        </li>
        <li>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M6.784 15.68 11.46 4.13h1.75L8.534 15.68z" fill="#CBD5E1" />
          </svg>
        </li>
        <li>
          <span className="text-sm font-semibold text-indigo-600" aria-current="page">Setup Resume</span>
        </li>
      </ol>
    </nav>
  );
}

function ConfirmModal({ title, message, confirmLabel = 'Yes, confirm', onConfirm, onClose }: {
  title: string; message: string; confirmLabel?: string; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div className="w-full max-w-[420px]" onClick={e => e.stopPropagation()}>
      <div
        className="relative rounded-2xl bg-white p-8 shadow-[0_32px_80px_rgba(15,23,42,0.22)] ring-1 ring-slate-100"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <FiX className="text-base" />
        </button>

        {/* Icon */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <FiAlertTriangle className="text-2xl text-red-500" />
        </div>

        {/* Text */}
        <div className="mb-7 text-center">
          <h3 className="mb-2.5 text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-sm leading-relaxed text-slate-500">{message}</p>
        </div>

        {/* Divider */}
        <div className="mb-5 border-t border-slate-100" />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 active:scale-[0.98]"
          >
            <FiTrash2 className="text-sm" />
            {confirmLabel}
          </button>
        </div>

      </div>

        {/* Footer note â€” outside the card */}
        <p className="mt-3.5 flex items-center justify-center gap-1.5 text-[12px] text-slate-200">
          <FiLock className="text-[11px]" />
          This action cannot be undone.
        </p>
      </div>
    </div>
  );
}

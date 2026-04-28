import type {
  ExperienceEntry, EducationEntry, ProjectEntry, CertEntry, CourseworkEntry,
  InvolvementEntry, AwardEntry, PublicationEntry, ReferenceEntry, AchievementEntry,
  LanguageEntry, SoftSkillEntry, SkillGroupEntry, InternshipEntry, FreelanceEntry, LeadershipEntry,
  VolunteerEntry, InterestEntry, ConferenceEntry, PatentEntry, ExtracurricularEntry,
} from './types';

export const DEF_EXP: ExperienceEntry[] = [
  { id: '1', role: 'Software Development Engineer II', company: 'Flipkart', start: '2022-03', end: '', location: 'Bengaluru, Karnataka', currentlyWorking: true, description: 'Built and scaled payments infrastructure handling 2M+ daily transactions with 99.9% uptime.\nLed a team of 4 engineers to deliver the UPI AutoPay feature, onboarding 500k+ users in Q1 2024.\nOptimised API response times by 35% through Redis caching and query refactoring.' },
  { id: '2', role: 'Software Engineer', company: 'Infosys', start: '2019-07', end: '2022-02', location: 'Pune, Maharashtra', currentlyWorking: false, description: 'Developed RESTful microservices for a Fortune 500 banking client using Spring Boot and Kafka.\nImproved CI/CD pipeline efficiency by 40% by integrating automated testing with Jenkins and Docker.' },
];

export const DEF_EDU: EducationEntry[] = [
  { id: '1', type: 'college', school: 'National Institute of Technology, Trichy', degree: 'B.Tech', fieldOfStudy: 'Computer Science & Engineering', startYear: '2015', endYear: '2019', gpa: '8.6' },
  { id: '2', type: 'school', school: 'Delhi Public School (DPS)', degree: 'Class XII (CBSE)', fieldOfStudy: 'Science (PCM)', startYear: '2013', endYear: '2015', gpa: '95%' },
  { id: '3', type: 'school', school: 'Kendriya Vidyalaya (KV)', degree: 'Class X (CBSE)', fieldOfStudy: 'General', startYear: '2011', endYear: '2013', gpa: '9.8' },
];

export const DEF_SKILLS: SkillGroupEntry[] = [
  { id: '1', category: 'Backend',        items: ['Java', 'Spring Boot', 'Node.js', 'Express.js', 'Kafka'] },
  { id: '2', category: 'Frontend',       items: ['React', 'Next.js', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS'] },
  { id: '3', category: 'Database',       items: ['MySQL', 'MongoDB', 'Redis', 'PostgreSQL'] },
  { id: '4', category: 'DevOps & Cloud', items: ['Docker', 'AWS', 'Git', 'GitHub', 'CI/CD'] },
  { id: '5', category: 'Other',          items: ['System Design', 'REST APIs', 'Microservices'] },
];
export const SUGG_SKILLS: SkillGroupEntry[] = [
  { id: 's1', category: 'Frontend',  items: ['Vue.js', 'Nuxt', 'Tailwind CSS', 'Vite'] },
  { id: 's2', category: 'Backend',   items: ['Go', 'Python', 'FastAPI', 'Django', 'Flask'] },
  { id: 's3', category: 'Database',  items: ['PostgreSQL', 'Elasticsearch', 'Firebase'] },
  { id: 's4', category: 'DevOps',    items: ['Kubernetes', 'Terraform', 'GCP', 'Azure'] },
  { id: 's5', category: 'Mobile',    items: ['React Native', 'Flutter', 'Expo'] },
  { id: 's6', category: 'Other',     items: ['GraphQL', 'WebSockets', 'gRPC', 'tRPC'] },
];

export const DEF_PROJ: ProjectEntry[] = [
  { id: '1', title: 'Smart Expense Tracker', description: 'Built a full-stack expense tracking app with real-time analytics, UPI transaction sync, and AI-powered category suggestions. Deployed on AWS with 1,200+ active users.', url: 'github.com/rahulsharma/expense-tracker', start: '2023-06', end: '', ongoing: true, tech: 'React, Node.js, MongoDB, AWS, Razorpay API' },
];

export const DEF_CERT: CertEntry[] = [
  { id: '1', name: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', issueDate: '2023-08', expDate: '', noExp: true, credId: 'AWS-SAA-2023-RS', credUrl: 'verify.aws.amazon.com/cert/RS2023' },
];

export const DEF_COURSE: CourseworkEntry[] = [
  { id: '1', course: 'Data Structures & Algorithms', institution: 'NPTEL (IIT Madras)', grade: 'A', year: '2023' },
  { id: '2', course: 'System Design for Engineers', institution: 'Scaler Academy', grade: 'A+', year: '2022' },
];

export const DEF_INV: InvolvementEntry[] = [
  { id: '1', organization: 'CSI – Computer Society of India, NIT Trichy', role: 'Technical Secretary', start: '2017-07', end: '2019-05', current: false, description: 'Organised CodeSprint, a 24-hour hackathon with 300+ participants across South India.\nMentored 40+ juniors for competitive programming and placement preparation.' },
];

export const DEF_AWD: AwardEntry[] = [
  { id: '1', name: 'Best Performer – Q3 2023', issuer: 'Flipkart', date: '2023', description: 'Recognised for delivering the UPI AutoPay feature ahead of schedule, directly contributing to a 12% increase in payment success rate.' },
];

export const DEF_PUB: PublicationEntry[] = [
  { id: '1', title: 'Scaling Microservices with Event-Driven Architecture on AWS', publisher: 'Medium / Better Programming', date: '2023-09', url: 'medium.com/@rahulsharma/scaling-microservices-aws', description: 'A deep-dive into building resilient, event-driven systems using Kafka, SQS, and Lambda – learnings from production at scale.' },
];

export const DEF_REF: ReferenceEntry[] = [
  { id: '1', name: 'Priya Nair', title: 'Engineering Manager', company: 'Flipkart', email: 'priya.nair@flipkart.com', phone: '+91 98400 12345', relationship: 'Direct manager (2 years)' },
];

export const DEF_ACHIEVE: AchievementEntry[] = [
  { id: '1', title: 'Reduced API p99 latency by 45%', issuer: 'Flipkart', date: '2023', description: 'Identified N+1 query bottlenecks and introduced a caching layer that slashed p99 API latency from 900ms to 500ms under peak load.' },
];

export const DEF_LANG: LanguageEntry[] = [
  { id: '1', language: 'Hindi',   proficiency: 'Native / Bilingual' },
  { id: '2', language: 'English', proficiency: 'Full Professional' },
  { id: '3', language: 'Tamil',   proficiency: 'Elementary' },
];

export const DEF_SOFT: SoftSkillEntry[] = [
  { id: '1', skill: 'Problem Solving',     description: 'Debugged complex production issues and delivered reliable solutions under pressure' },
  { id: '2', skill: 'Team Collaboration',  description: 'Worked closely with cross-functional teams across design, QA, and product' },
  { id: '3', skill: 'Mentoring',           description: 'Guided junior engineers through code reviews and technical onboarding' },
];

export const DEF_INTERN: InternshipEntry[] = [
  { id: '1', role: 'Backend Developer Intern', company: 'Razorpay', start: '2018-05', end: '2018-07', location: 'Bengaluru, Karnataka', currentlyWorking: false, description: 'Worked on payment gateway reliability improvements; wrote integration tests that caught 3 critical pre-production bugs.' },
];

export const DEF_FREE: FreelanceEntry[] = [
  { id: '1', role: 'Full Stack Developer', client: 'Startups & SMEs (India)', start: '2021-01', end: '', currentlyWorking: true, description: 'Delivered 8+ web applications for D2C brands and SaaS startups using React, Node.js and Firebase. Integrated Razorpay and Shiprocket APIs for e-commerce clients.' },
];

export const DEF_LEAD: LeadershipEntry[] = [
  { id: '1', role: 'Tech Lead', organization: 'Flipkart – Payments Team', start: '2023-01', end: '', current: true, description: 'Leading a 5-member cross-functional team to architect and ship the next-gen checkout experience for 100M+ Flipkart users.' },
];

export const DEF_VOL: VolunteerEntry[] = [
  { id: '1', role: 'Coding Mentor', organization: 'GirlScript Foundation', start: '2022-03', end: '', current: true, description: 'Mentoring 20+ students from Tier-2 & 3 colleges in DSA and open-source contributions; helped 6 mentees land their first tech job.' },
];

export const DEF_HOBBY: InterestEntry[] = [
  { id: '1', name: 'Competitive Programming' },
  { id: '2', name: 'Badminton' },
  { id: '3', name: 'Tech Blogging' },
];

export const DEF_CONF: ConferenceEntry[] = [
  { id: '1', title: 'Great India Developer Summit (GIDS) 2023', organizer: 'Saltmarch Media', date: '2023-04', description: 'Attended sessions on distributed systems, cloud-native architecture, and DevOps best practices. Networked with 500+ engineering professionals.' },
];

export const DEF_PATENT: PatentEntry[] = [
  { id: '1', title: 'Adaptive UPI Payment Retry Mechanism', issuer: 'Indian Patent Office', date: '2023-11', url: 'ipindia.gov.in/patent/12345', description: 'A system that intelligently retries failed UPI transactions by analysing failure patterns, reducing transaction drop rate by 18%.' },
];

export const DEF_EXTRA: ExtracurricularEntry[] = [
  { id: '1', activity: 'ACM-ICPC Regional', organization: 'NIT Trichy', start: '2016-08', end: '2018-11', description: 'Represented NIT Trichy at ACM-ICPC Amritapuri Regionals; ranked in the top 50 teams across South India.' },
];

import mongoose from 'mongoose';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error('MONGODB_URI not set in .env.local');

// ── Schema (inline so script is standalone) ──────────────────────────────────
const SuggestionSchema = new mongoose.Schema({
  value:           { type: String, required: true, trim: true, maxlength: 200 },
  normalizedValue: { type: String, required: true, lowercase: true, trim: true, maxlength: 200 },
  type:            { type: String, required: true, enum: ['skill', 'role', 'company', 'institute', 'language', 'location'] },
  usageCount:      { type: Number, default: 0, min: 0 },
}, { timestamps: { createdAt: true, updatedAt: false } });
SuggestionSchema.index({ normalizedValue: 1, type: 1 }, { unique: true });
const Suggestion = mongoose.models.Suggestion || mongoose.model('Suggestion', SuggestionSchema);

// ── Data ─────────────────────────────────────────────────────────────────────

const skills = [
  // Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#', 'Go', 'Rust', 'Kotlin',
  'Swift', 'PHP', 'Ruby', 'Scala', 'R', 'MATLAB', 'Dart', 'Elixir', 'Haskell', 'Perl',
  // Frontend
  'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'HTML', 'CSS', 'Tailwind CSS',
  'Sass', 'Bootstrap', 'Material UI', 'Chakra UI', 'Radix UI', 'shadcn/ui', 'Framer Motion',
  'Redux', 'Zustand', 'React Query', 'SWR', 'Webpack', 'Vite', 'Parcel', 'Babel',
  'Jest', 'Vitest', 'Cypress', 'Playwright', 'Storybook',
  // Backend
  'Node.js', 'Express.js', 'Fastify', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
  'Laravel', 'Ruby on Rails', 'ASP.NET Core', 'GraphQL', 'REST API', 'gRPC', 'WebSockets',
  'tRPC', 'Prisma', 'Drizzle ORM', 'Sequelize', 'TypeORM', 'Mongoose',
  // Databases
  'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Elasticsearch', 'Cassandra',
  'DynamoDB', 'Firestore', 'Supabase', 'PlanetScale', 'CockroachDB', 'Neo4j',
  // Cloud & DevOps
  'AWS', 'Google Cloud Platform', 'Microsoft Azure', 'Vercel', 'Netlify', 'Railway',
  'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'GitLab CI',
  'CircleCI', 'ArgoCD', 'Helm', 'Nginx', 'Apache', 'Linux', 'Bash', 'PowerShell',
  // Data & AI/ML
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn',
  'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'OpenCV', 'Hugging Face', 'LangChain',
  'LLM Fine-tuning', 'RAG', 'NLP', 'Computer Vision', 'Data Analysis', 'Data Visualization',
  'Power BI', 'Tableau', 'Apache Spark', 'Hadoop', 'Kafka', 'Airflow', 'dbt',
  // Mobile
  'React Native', 'Flutter', 'Android Development', 'iOS Development', 'Expo',
  // Tools & Others
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence', 'Notion', 'Figma',
  'Adobe XD', 'Postman', 'Swagger', 'OpenAPI', 'Stripe', 'Razorpay', 'Firebase',
  'Cloudinary', 'Twilio', 'SendGrid', 'Sentry', 'DataDog', 'New Relic',
  // Security
  'OAuth 2.0', 'JWT', 'NextAuth.js', 'Passport.js', 'OWASP', 'Penetration Testing',
  'Cryptography', 'SSL/TLS',
  // Soft / domain
  'Agile', 'Scrum', 'Kanban', 'System Design', 'Microservices', 'Monorepo',
  'Test-Driven Development', 'CI/CD', 'DevOps', 'Site Reliability Engineering',
  'Object-Oriented Programming', 'Functional Programming', 'Design Patterns',
  'Data Structures', 'Algorithms', 'Competitive Programming',
  'UI/UX Design', 'Responsive Design', 'Accessibility (WCAG)', 'SEO',
  'Technical Writing', 'Code Review', 'Mentoring',
];

const roles = [
  'Software Engineer', 'Senior Software Engineer', 'Staff Software Engineer',
  'Principal Software Engineer', 'Lead Software Engineer', 'Software Developer',
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Mobile Developer', 'Android Developer', 'iOS Developer', 'Flutter Developer',
  'React Native Developer', 'Web Developer', 'UI Developer', 'UI/UX Designer',
  'Product Designer', 'Graphic Designer', 'Design Lead',
  'DevOps Engineer', 'Site Reliability Engineer', 'Platform Engineer',
  'Cloud Engineer', 'Infrastructure Engineer', 'Security Engineer',
  'Cybersecurity Analyst', 'Penetration Tester',
  'Data Scientist', 'Data Engineer', 'Data Analyst', 'ML Engineer',
  'AI Engineer', 'Research Engineer', 'NLP Engineer', 'Computer Vision Engineer',
  'Business Intelligence Analyst', 'Analytics Engineer',
  'Product Manager', 'Senior Product Manager', 'Group Product Manager',
  'Technical Product Manager', 'Associate Product Manager',
  'Engineering Manager', 'Director of Engineering', 'VP of Engineering',
  'CTO', 'Chief Architect', 'Solution Architect', 'Enterprise Architect',
  'Technical Lead', 'Tech Lead', 'Team Lead',
  'QA Engineer', 'SDET', 'Automation Test Engineer', 'QA Analyst',
  'Scrum Master', 'Agile Coach', 'Project Manager',
  'Technical Program Manager', 'Program Manager',
  'Database Administrator', 'Database Engineer', 'DBA',
  'Network Engineer', 'Systems Administrator', 'IT Engineer',
  'Embedded Systems Engineer', 'Firmware Engineer', 'IoT Engineer',
  'Blockchain Developer', 'Smart Contract Developer', 'Web3 Developer',
  'Game Developer', 'Unity Developer', 'Unreal Engine Developer',
  'AR/VR Developer', 'XR Engineer',
  'Technical Writer', 'Developer Advocate', 'Developer Relations Engineer',
  'Intern', 'Software Engineering Intern', 'Research Intern',
  'Fresher', 'Trainee Software Engineer', 'Junior Software Engineer',
  'Consultant', 'Senior Consultant', 'Principal Consultant',
  'Freelancer', 'Contractor',
];

const companies = [
  // Big Tech / MNC
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Salesforce',
  'Oracle', 'SAP', 'IBM', 'Accenture', 'Deloitte', 'McKinsey & Company',
  'Capgemini', 'Cognizant', 'Wipro', 'Infosys', 'HCL Technologies',
  'Tech Mahindra', 'TCS', 'LTIMindtree', 'Mphasis', 'Hexaware', 'NIIT Technologies',
  // Indian Unicorns & Tech
  'Flipkart', 'Meesho', 'Ola', 'Zomato', 'Swiggy', 'CRED', 'Paytm', 'PhonePe',
  'Razorpay', 'BrowserStack', 'Freshworks', 'Zoho', 'InMobi', 'ShareChat',
  'Dream11', 'MPL', 'Unacademy', 'BYJU\'S', 'upGrad', 'Vedantu',
  'Cure.fit', 'Nykaa', 'Myntra', 'Urban Company', 'Lenskart', 'Boat',
  'Delhivery', 'Shiprocket', 'Shadowfax', 'Porter',
  'Groww', 'Zerodha', 'Angel One', 'Upstox', 'CoinDCX', 'CoinSwitch',
  'PolicyBazaar', 'Acko', 'Digit Insurance',
  'OYO', 'MakeMyTrip', 'Ixigo', 'RedBus', 'Rapido',
  'Dunzo', 'Blinkit', 'BigBasket', 'Juspay', 'PayU',
  'Postman', 'Setu', 'Hasura', 'Sprinklr', 'Agora',
  'Chargebee', 'CleverTap', 'MoEngage', 'WebEngage', 'Exotel',
  'Darwinbox', 'Keka', 'greytHR', 'Zimyo',
  'Ather Energy', 'Ola Electric', 'Bounce',
  // Startups / Mid-size
  'Simpl', 'LazyPay', 'ZestMoney', 'slice', 'Fi Money', 'Jupiter',
  'smallcase', 'INDmoney', 'Scripbox', 'Niyo',
  'IndiaMart', 'TradeIndia', 'Udaan', 'Moglix', 'OfBusiness',
  'Ninjacart', 'WayCool', 'DeHaat', 'AgriBazaar',
  'Healthify', 'mFine', 'Pristyn Care', 'Practo', '1mg',
  'Plum', 'Nova Benefits', 'Pazcare',
  // Global with India presence
  'Adobe', 'Intuit', 'Cisco', 'Qualcomm', 'Intel', 'NVIDIA', 'AMD',
  'Uber', 'Lyft', 'Airbnb', 'Stripe', 'Twilio', 'Atlassian',
  'ThoughtWorks', 'GlobalLogic', 'Nagarro', 'EPAM Systems',
  'Publicis Sapient', 'NTT Data', 'DXC Technology',
];

const institutes = [
  // IITs
  'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kharagpur', 'IIT Kanpur',
  'IIT Roorkee', 'IIT Hyderabad', 'IIT Guwahati', 'IIT BHU', 'IIT Dhanbad (ISM)',
  'IIT Indore', 'IIT Jodhpur', 'IIT Patna', 'IIT Ropar', 'IIT Bhubaneswar',
  'IIT Mandi', 'IIT Gandhinagar', 'IIT Tirupati', 'IIT Palakkad', 'IIT Dharwad',
  'IIT Bhilai', 'IIT Jammu', 'IIT Goa',
  // NITs
  'NIT Trichy', 'NIT Warangal', 'NIT Surathkal', 'NIT Calicut', 'NIT Rourkela',
  'NIT Allahabad', 'NIT Bhopal', 'NIT Jaipur', 'NIT Kurukshetra', 'NIT Nagpur',
  'NIT Hamirpur', 'NIT Silchar', 'NIT Srinagar', 'NIT Durgapur', 'NIT Surat',
  'NIT Patna', 'NIT Agartala', 'NIT Jalandhar', 'NIT Raipur',
  // IIITs
  'IIIT Hyderabad', 'IIIT Bangalore', 'IIIT Allahabad', 'IIIT Delhi',
  'IIIT Pune', 'IIIT Kottayam', 'IIIT Gwalior', 'IIIT Vadodara',
  // IIMs
  'IIM Ahmedabad', 'IIM Bangalore', 'IIM Calcutta', 'IIM Lucknow',
  'IIM Kozhikode', 'IIM Indore', 'IIM Shillong', 'IIM Rohtak',
  'IIM Ranchi', 'IIM Raipur', 'IIM Tiruchirappalli', 'IIM Udaipur',
  // Central Universities
  'Delhi University', 'JNU', 'Hyderabad Central University', 'BHU',
  'Jadavpur University', 'Jamia Millia Islamia', 'AMU', 'Pondicherry University',
  // Top Private
  'Bits Pilani', 'Bits Goa', 'Bits Hyderabad', 'VIT Vellore', 'VIT Chennai',
  'Manipal Institute of Technology', 'SRM University', 'Amity University',
  'Thapar University', 'PSG College of Technology', 'SSN College of Engineering',
  'RV College of Engineering', 'PES University', 'Christ University',
  'Symbiosis Institute of Technology', 'LPU', 'Chandigarh University',
  'Anna University', 'Osmania University', 'Mumbai University',
  'Pune University (SPPU)', 'Bangalore University',
  'Cochin University of Science and Technology (CUSAT)',
  'Visvesvaraya Technological University (VTU)',
  'APJ Abdul Kalam Technological University (KTU)',
  // IISc / Research
  'IISc Bangalore', 'TIFR', 'ISI Kolkata', 'CMI', 'IMSc',
  // Others
  'College of Engineering Pune (COEP)', 'DAIICT', 'DTU', 'NSUT', 'IGDTUW',
  'Netaji Subhas University of Technology', 'IIIT Lucknow',
  // Schools and Boards
  'Central Board of Secondary Education (CBSE)',
  'Council for the Indian School Certificate Examinations (CISCE)',
  'State Board',
  'Delhi Public School (DPS)',
  'Kendriya Vidyalaya (KV)',
  'Jawahar Navodaya Vidyalaya (JNV)'
];

const degrees = [
  'B.Tech', 'B.E.', 'B.Sc', 'B.Com', 'B.A.', 'BBA', 'BCA', 'MBBS', 'B.Arch',
  'M.Tech', 'M.E.', 'M.Sc', 'M.Com', 'M.A.', 'MBA', 'MCA', 'Ph.D',
  'Class XII (HSC)', 'Class X (SSC)', 'Class XII', 'Class X', 'Intermediate', 'Matriculation'
];

const fields = [
  'Computer Science & Engineering', 'Mechanical Engineering', 'Electrical Engineering',
  'Electronics & Communication Engineering', 'Civil Engineering', 'Information Technology',
  'Science (PCM)', 'Science (PCB)', 'Science', 'Commerce', 'Arts', 'Humanities',
  'Business Administration', 'Physics', 'Mathematics', 'Chemistry', 'Biology'
];

const languages = [
  'Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati',
  'Kannada', 'Malayalam', 'Odia', 'Punjabi', 'Urdu', 'Assamese', 'Maithili',
  'Santali', 'Kashmiri', 'Nepali', 'Sindhi', 'Konkani', 'Dogri', 'Manipuri',
  'Bodo', 'Sanskrit', 'French', 'German', 'Spanish', 'Japanese', 'Mandarin',
  'Korean', 'Arabic', 'Russian', 'Portuguese', 'Italian',
];

const locations = [
  // Metros
  'Bengaluru, Karnataka', 'Mumbai, Maharashtra', 'Delhi, NCR', 'Hyderabad, Telangana',
  'Chennai, Tamil Nadu', 'Pune, Maharashtra', 'Kolkata, West Bengal', 'Ahmedabad, Gujarat',
  // Tier 2 Cities
  'Jaipur, Rajasthan', 'Lucknow, Uttar Pradesh', 'Chandigarh', 'Indore, Madhya Pradesh',
  'Bhopal, Madhya Pradesh', 'Nagpur, Maharashtra', 'Surat, Gujarat', 'Vadodara, Gujarat',
  'Kochi, Kerala', 'Thiruvananthapuram, Kerala', 'Coimbatore, Tamil Nadu',
  'Madurai, Tamil Nadu', 'Visakhapatnam, Andhra Pradesh', 'Vijayawada, Andhra Pradesh',
  'Bhubaneswar, Odisha', 'Guwahati, Assam', 'Dehradun, Uttarakhand',
  'Noida, Uttar Pradesh', 'Gurgaon, Haryana', 'Faridabad, Haryana',
  'Navi Mumbai, Maharashtra', 'Thane, Maharashtra',
  'Mysuru, Karnataka', 'Hubballi, Karnataka', 'Mangaluru, Karnataka',
  'Patna, Bihar', 'Ranchi, Jharkhand', 'Raipur, Chhattisgarh',
  'Amritsar, Punjab', 'Ludhiana, Punjab', 'Jalandhar, Punjab',
  'Agra, Uttar Pradesh', 'Varanasi, Uttar Pradesh', 'Kanpur, Uttar Pradesh',
  'Jodhpur, Rajasthan', 'Udaipur, Rajasthan', 'Kota, Rajasthan',
  'Srinagar, Jammu & Kashmir', 'Jammu, Jammu & Kashmir',
  'Goa', 'Pondicherry',
  // Remote
  'Remote', 'Remote (India)', 'Work from Home',
];

// ── Seed ─────────────────────────────────────────────────────────────────────

type SeedItem = { value: string; normalizedValue: string; type: string; usageCount: number };

function buildDocs(): SeedItem[] {
  const docs: SeedItem[] = [];

  const add = (arr: string[], type: string) => {
    arr.forEach((value, i) => {
      docs.push({ 
        value, 
        normalizedValue: value.toLowerCase(),
        type, 
        usageCount: Math.max(0, arr.length - i) * 10 
      });
    });
  };

  add(skills,    'skill');
  add(roles,     'role');
  add(companies, 'company');
  add(institutes,'institute');
  add(languages, 'language');
  add(locations, 'location');
  add(degrees,   'degree');
  add(fields,    'field');

  return docs;
}

async function seed() {
  console.log('Connecting to MongoDB…');
  mongoose.set('autoIndex', false); // Prevent auto-indexing before we drop the old collection
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.');

  console.log('Dropping old suggestions to rebuild indexes...');
  try { await Suggestion.collection.drop(); } catch { /* ignore */ }
  
  await Suggestion.syncIndexes(); // Ensure indexes match schema
  await Suggestion.init();

  const docs = buildDocs();
  console.log(`Seeding ${docs.length} suggestions…`);

  let inserted = 0;
  let skipped  = 0;

  for (const doc of docs) {
    try {
      await Suggestion.updateOne(
        { normalizedValue: doc.normalizedValue, type: doc.type },
        { $setOnInsert: doc },
        { upsert: true }
      );
      inserted++;
    } catch {
      skipped++;
    }
  }

  console.log(`Done. Inserted/updated: ${inserted}, skipped: ${skipped}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

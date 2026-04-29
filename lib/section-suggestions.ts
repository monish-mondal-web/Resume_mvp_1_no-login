export function getSectionSuggestions(section: string, query: string): string[] {
  const normalizedQuery = (query || 'Professional').trim().toLowerCase();
  const isMatch = (keywords: string[]) => keywords.some(kw => normalizedQuery.includes(kw));

  switch (section.toLowerCase()) {
    case 'experience':
    case 'internships':
    case 'freelance': {
      // 1. Frontend / Web Development
      if (isMatch(['frontend', 'front-end', 'ui developer', 'web', 'react', 'angular', 'vue', 'nextjs', 'javascript', 'html', 'css', 'typescript'])) {
        return [
          "Developed and optimized 15+ responsive web applications using React.js and Next.js, improving load speeds by 40% through code-splitting and image optimization.",
          "Collaborated with cross-functional teams to implement pixel-perfect UIs from Figma designs, ensuring 100% WCAG 2.1 accessibility compliance.",
          "Architected reusable UI component libraries using Tailwind CSS and TypeScript, reducing development time for subsequent projects by 30%.",
          "Improved Core Web Vitals (LCP, CLS, FID) across multiple high-traffic platforms, resulting in a 15% increase in user retention.",
          "Integrated complex RESTful and GraphQL APIs to handle dynamic data flows, ensuring seamless user experiences and robust state management.",
          "Reduced bundle size by 25% through meticulous dependency auditing and tree-shaking, significantly enhancing mobile performance.",
          "Mentored junior developers on best practices in modern JavaScript and CSS architecture, fostering a culture of high-quality code delivery."
        ];
      }
      // 2. Backend / Server / API
      if (isMatch(['backend', 'back-end', 'node', 'java', 'python', 'api', 'server', 'database', 'c#', 'php', 'golang', 'rust', 'ruby', 'django', 'express'])) {
        return [
          "Architected and deployed 20+ scalable REST and gRPC microservices using Node.js and Go, handling over 50,000 concurrent requests per second.",
          "Optimized PostgreSQL and MongoDB query performance by 50% through strategic indexing and database sharding techniques.",
          "Implemented robust authentication and authorization systems using OAuth 2.0, JWT, and OpenID Connect, enhancing system security.",
          "Designed and maintained complex CI/CD pipelines using GitHub Actions and Jenkins, reducing deployment cycle time from days to minutes.",
          "Leveraged Redis for distributed caching, decreasing server response times by 65% for frequently accessed data endpoints.",
          "Automated infrastructure provisioning using Terraform and AWS CloudFormation, ensuring 99.99% uptime across production environments.",
          "Developed comprehensive unit and integration testing suites, achieving 90%+ code coverage and significantly reducing production defects."
        ];
      }
      // 3. Mobile Development
      if (isMatch(['mobile', 'android', 'ios', 'flutter', 'react native', 'swift', 'kotlin', 'dart'])) {
        return [
          "Developed and launched 5+ high-rated mobile applications on App Store and Google Play using React Native and Flutter.",
          "Optimized mobile app performance, reducing battery consumption by 20% and memory usage by 35% through efficient resource management.",
          "Integrated native device capabilities such as Biometrics, Push Notifications, and Real-time Geolocation tracking for enhanced UX.",
          "Implemented offline-first data synchronization logic using SQLite and Firebase, ensuring seamless app usage in low-connectivity areas.",
          "Collaborated with UI/UX designers to implement complex 60fps animations and transitions, achieving a premium look and feel.",
          "Managed end-to-end app release cycles, including beta testing via TestFlight and Google Play Console deployment.",
          "Refactored legacy Objective-C/Java codebases to Swift/Kotlin, improving code maintainability and reducing technical debt by 40%."
        ];
      }
      // 4. Data Science / AI / ML / Analytics
      if (isMatch(['data', 'machine learning', 'ml ', 'ai ', 'analytics', 'scientist', 'deep learning', 'nlp', 'computer vision', 'big data', 'tensorflow', 'pytorch', 'sql', 'tableau', 'power bi'])) {
        return [
          "Developed and deployed predictive machine learning models using Scikit-Learn and TensorFlow, resulting in a 25% increase in customer conversion rates.",
          "Architected large-scale data pipelines using Apache Spark and Airflow to process 5TB+ of daily log data for real-time analytics.",
          "Conducted exploratory data analysis (EDA) on complex datasets, uncovering insights that drove a $500k increase in annual revenue.",
          "Built interactive business intelligence dashboards using Tableau and Power BI, enabling executive stakeholders to make data-driven decisions.",
          "Implemented Natural Language Processing (NLP) models for automated sentiment analysis, achieving a 92% accuracy rate on customer feedback.",
          "Optimized A/B testing frameworks, leading to a 10% improvement in product feature adoption through statistical significance testing.",
          "Designed and implemented recommendation engines using collaborative filtering, increasing average order value (AOV) by 15%."
        ];
      }
      // 5. DevOps / Cloud / SRE
      if (isMatch(['devops', 'cloud', 'sre', 'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'infrastructure', 'site reliability', 'linux'])) {
        return [
          "Managed and scaled multi-region Kubernetes clusters on AWS EKS, ensuring 99.95% availability for mission-critical applications.",
          "Implemented Infrastructure as Code (IaC) using Terraform, reducing environment setup time from 4 hours to 10 minutes.",
          "Reduced cloud infrastructure costs by 30% through strategic right-sizing of instances and implementation of Spot Instances.",
          "Developed automated monitoring and alerting systems using Prometheus and Grafana, reducing Mean Time to Resolution (MTTR) by 45%.",
          "Orchestrated containerized microservices using Docker and Helm, streamlining the development-to-production workflow.",
          "Implemented zero-downtime deployment strategies (Blue-Green / Canary), ensuring seamless updates for 1M+ active users.",
          "Hardened cloud security posture by implementing VPC peering, security groups, and IAM least-privilege policies."
        ];
      }
      // 6. QA / Testing / Automation
      if (isMatch(['qa', 'quality', 'test', 'automation', 'sdet', 'selenium', 'cypress', 'playwright', 'jest'])) {
        return [
          "Designed and implemented end-to-end (E2E) automation frameworks using Cypress and Playwright, reducing manual testing effort by 70%.",
          "Developed comprehensive API testing suites using Postman and Supertest, ensuring 100% endpoint reliability across all releases.",
          "Integrated automated testing into CI/CD pipelines, catching over 200+ critical regressions before reaching production.",
          "Lead performance and load testing initiatives using JMeter, identifying and resolving bottlenecks that improved system capacity by 3x.",
          "Managed a team of 4 QA engineers, defining quality metrics and standardizing bug reporting processes across the organization.",
          "Reduced defect leakage into production by 40% through the implementation of shift-left testing methodologies.",
          "Authored over 500+ detailed test cases and scripts, ensuring full functional coverage for complex enterprise software."
        ];
      }
      // 7. Product / Project Management
      if (isMatch(['product manager', 'project manager', 'pmp', 'scrum master', 'agile', 'product owner'])) {
        return [
          "Led cross-functional teams of engineers and designers to launch 3 successful products, generating $2M in new business revenue within year one.",
          "Defined and executed product roadmaps based on extensive market research and user feedback, increasing NPS score from 45 to 70.",
          "Facilitated Agile ceremonies (Sprint Planning, Daily Stand-ups, Retrospectives) for multiple squads, improving team velocity by 25%.",
          "Managed $500k+ project budgets, ensuring all deliverables were met on time and 10% under budget.",
          "Translated complex business requirements into detailed user stories and technical specifications for the engineering team.",
          "Analyzed product metrics using Mixpanel and Google Analytics, identifying and resolving friction points in the user journey.",
          "Stakeholder management across marketing, sales, and executive teams to ensure alignment on product vision and go-to-market strategies."
        ];
      }
      // 8. Cybersecurity / Security
      if (isMatch(['security', 'cybersecurity', 'penetration', 'soc', 'infosec', 'firewall', 'network security'])) {
        return [
          "Conducted regular penetration testing and vulnerability assessments, remediating over 50+ critical security risks.",
          "Implemented SIEM solutions using ELK Stack and Splunk, improving threat detection and incident response time by 50%.",
          "Designed and enforced organizational security policies, ensuring compliance with SOC2, GDPR, and ISO 27001 standards.",
          "Managed enterprise-grade firewalls and intrusion detection systems (IDS/IPS), mitigating several large-scale DDoS attacks.",
          "Conducted security awareness training for 200+ employees, reducing phishing-related incidents by 60%.",
          "Led incident response efforts for high-profile security breaches, ensuring rapid containment and data recovery.",
          "Integrated SAST and DAST tools into the DevSecOps pipeline to identify vulnerabilities early in the development lifecycle."
        ];
      }
      // 9. Marketing / Sales / SEO
      if (isMatch(['marketing', 'sales', 'seo', 'growth', 'brand', 'content', 'digital marketing', 'business development'])) {
        return [
          "Developed and executed multi-channel digital marketing campaigns that increased organic traffic by 150% and MQLs by 40%.",
          "Optimized website SEO through technical audits and content strategy, achieving top 3 rankings for 50+ high-volume keywords.",
          "Managed a $100k/month ad spend across Meta and Google Ads, maintaining an average ROAS of 4.5x.",
          "Led business development initiatives that secured 10+ enterprise partnerships, adding $1.2M to the sales pipeline.",
          "Spearheaded a rebranding initiative that improved brand recognition by 30% and increased social media engagement by 50%.",
          "Utilized HubSpot CRM to automate lead nurturing workflows, improving sales team efficiency and conversion rates by 20%.",
          "Analyzed market trends and competitor activity to identify new growth opportunities, resulting in the successful entry into 2 new markets."
        ];
      }
      // Default / Generic
      return [
        "Consistently exceeded individual and team performance targets through proactive problem-solving and strategic planning.",
        "Collaborated with cross-functional stakeholders to deliver complex projects under tight deadlines and changing requirements.",
        "Streamlined internal processes and workflows, resulting in a 20% increase in overall department productivity.",
        "Mentored and trained new hires, ensuring a seamless onboarding process and rapid contribution to team goals.",
        "Identified and implemented cost-saving measures that reduced operational overhead by 15% annually.",
        "Demonstrated strong leadership and communication skills while managing diverse teams in high-pressure environments.",
        "Maintained a high standard of quality and professionalism, consistently receiving top-tier performance reviews."
      ];
    }

    case 'projects': {
      // 1. Full Stack / Web
      if (isMatch(['web', 'website', 'app', 'ecommerce', 'dashboard', 'react', 'next', 'node', 'full stack'])) {
        return [
          "Architected and developed a full-stack E-commerce platform with React, Node.js, and Stripe, supporting 1,000+ daily active users.",
          "Implemented a real-time collaborative dashboard using WebSockets and Redis, reducing data latency to under 100ms.",
          "Developed a secure SaaS platform with multi-tenant architecture and subscription management using PostgreSQL and Clerk Auth.",
          "Built a responsive portfolio website using Next.js and Framer Motion, achieving a perfect 100 Lighthouse score for performance and SEO.",
          "Engineered a dynamic content management system (CMS) tailored for high-volume publishing, improving content delivery speed by 40%.",
          "Integrated third-party APIs (Twilio, SendGrid, AWS S3) to provide robust communication and storage solutions for the application.",
          "Deployed the application using Vercel and AWS, implementing a custom CI/CD pipeline and automated monitoring."
        ];
      }
      // 2. Data / AI / ML
      if (isMatch(['data', 'ai', 'machine learning', 'analytics', 'prediction', 'model'])) {
        return [
          "Developed a predictive analytics tool using Python and Scikit-Learn to forecast stock market trends with 75% accuracy.",
          "Built an AI-powered image recognition system using PyTorch and OpenCV, capable of identifying 100+ object categories in real-time.",
          "Engineered a large-scale web scraper and data processing pipeline that aggregates 1M+ daily records into a structured SQL database.",
          "Created a Natural Language Processing (NLP) chatbot using OpenAI's API to automate 60% of customer support inquiries.",
          "Developed a data visualization platform using D3.js and Flask to present complex healthcare datasets in an intuitive manner.",
          "Implemented a recommendation engine for a streaming platform using collaborative filtering and matrix factorization.",
          "Conducted deep learning research on convolutional neural networks (CNNs) for medical image classification, achieving state-of-the-art results."
        ];
      }
      // 3. Automation / Tools
      if (isMatch(['automation', 'tool', 'script', 'cli', 'bot'])) {
        return [
          "Developed a CLI tool in Go to automate the deployment and scaling of cloud-native applications across multiple environments.",
          "Created a custom web automation framework using Playwright that reduced manual regression testing time by 15 hours per week.",
          "Built a serverless automated reporting system on AWS Lambda that aggregates and emails weekly performance metrics to stakeholders.",
          "Developed a suite of Python scripts to automate complex data migrations, ensuring 100% data integrity and zero downtime.",
          "Engineered a Discord/Slack bot using Node.js to manage community interactions and automate administrative tasks for 5,000+ users."
        ];
      }
      // Default / Generic Project
      return [
        "Successfully designed and implemented a complex software solution from ideation to deployment, following industry best practices.",
        "Demonstrated proficiency in modern technologies and frameworks to build a scalable and maintainable application.",
        "Collaborated with open-source contributors to resolve critical issues and implement new features for a widely used library.",
        "Applied rigorous testing and debugging techniques to ensure a stable and bug-free user experience.",
        "Drafted comprehensive technical documentation and READMEs to facilitate easy setup and future development.",
        "Optimized application performance and security through meticulous code reviews and architectural refinements.",
        "Presented the project at a local tech meetup, receiving positive feedback on design, implementation, and usability."
      ];
    }

    case 'leadership':
    case 'involvement': {
      return [
        "Led a team of 15+ members to successfully organize and execute a regional tech hackathon with 500+ participants.",
        "Fostered a collaborative and inclusive environment, increasing active member participation and engagement by 40%.",
        "Managed an annual budget of $10,000, ensuring strategic allocation of resources across multiple high-impact projects.",
        "Facilitated bi-weekly workshops on emerging technologies, upskilling 50+ members on industry-standard tools and practices.",
        "Acted as the primary point of contact for corporate sponsors, successfully securing $5,000 in funding for club initiatives.",
        "Spearheaded a recruitment drive that increased organizational membership by 25% within a single semester.",
        "Represented the organization at university-wide leadership summits, advocating for student-led innovation and collaboration."
      ];
    }

    case 'volunteering':
    case 'extracurricular': {
      return [
        "Dedicated 200+ hours to community service initiatives, actively supporting local non-profits in educational outreach programs.",
        "Organized and led multiple successful fundraising campaigns, exceeding the annual contribution target by $5,000.",
        "Mentored underprivileged students in STEM subjects, resulting in a measurable improvement in their academic performance.",
        "Demonstrated exceptional communication and teamwork skills while collaborating with diverse groups to achieve community goals.",
        "Took initiative in leading sustainability workshops and environmental clean-up drives, engaging 100+ local volunteers.",
        "Assisted in the technical setup and management of community events, ensuring seamless execution and positive attendee feedback.",
        "Developed and maintained a website for a local non-profit organization, improving their online presence and donation tracking."
      ];
    }

    default:
      return [
        "Consistently demonstrated a strong commitment to professional growth and continuous learning in fast-paced environments.",
        "Collaborated effectively with diverse teams to achieve shared organizational objectives and deliver high-quality results.",
        "Leveraged strong analytical and problem-solving skills to identify and overcome complex technical and operational challenges.",
        "Maintained a high standard of meticulous attention to detail and quality across all assigned tasks and projects.",
        "Effectively communicated complex technical concepts to non-technical stakeholders, ensuring project alignment and success.",
        "Proactively identified areas for process improvement and implemented scalable solutions to enhance overall efficiency.",
        "Adaptable team player with a proven track record of mastering new technologies and methodologies quickly."
      ];
  }
}

export function getSummariesForRole(role: string): string[] {
  const normalizedRole = (role || 'Professional').trim();
  const lowerRole = normalizedRole.toLowerCase();

  // Helper to check if role matches keywords
  const isMatch = (keywords: string[]) => keywords.some(kw => lowerRole.includes(kw));

  // 1. Frontend / Web Development
  if (isMatch(['frontend', 'front-end', 'ui developer', 'web', 'react', 'angular', 'vue', 'nextjs', 'javascript', 'html'])) {
    return [
      `Detail-oriented ${normalizedRole} with a strong focus on building responsive, accessible, and highly performant user interfaces. Adept at translating complex design requirements into clean, maintainable code using modern web technologies. Passionate about delivering seamless user experiences and driving front-end architecture.`,
      `Results-driven ${normalizedRole} with proven expertise in modern JavaScript frameworks and scalable UI component design. Collaborative team player skilled at bridging the gap between design and engineering. Dedicated to optimizing web performance, ensuring cross-browser compatibility, and maintaining high code quality.`,
      `Innovative ${normalizedRole} dedicated to crafting pixel-perfect, interactive web applications. Experienced in agile environments, working closely with UX/UI designers to elevate product aesthetics and usability. Committed to continuous learning and leveraging the latest front-end tools to solve complex challenges.`,
      `User-focused ${normalizedRole} specializing in building dynamic, high-traffic web applications. Proven track record of improving web core vitals and implementing robust state management. Passionate about writing semantic HTML, modern CSS, and clean TypeScript to deliver top-tier digital experiences.`
    ];
  }

  // 2. Backend / Server / API
  if (isMatch(['backend', 'back-end', 'node', 'java', 'python', 'api', 'server', 'database', 'c#', 'php', 'golang', 'rust', 'ruby'])) {
    return [
      `Robust ${normalizedRole} specializing in designing, building, and maintaining scalable server-side applications and APIs. Highly skilled in database architecture, performance tuning, and cloud deployments. Passionate about writing secure, efficient code that powers seamless client-side experiences.`,
      `Analytical ${normalizedRole} with a track record of optimizing backend infrastructure and implementing microservices architectures. Adept at solving complex data problems and ensuring high system availability. Strong collaborator focused on delivering reliable, test-driven solutions in fast-paced environments.`,
      `Dedicated ${normalizedRole} with extensive experience in system design, API integration, and backend security. Proven ability to streamline data flow and reduce latency in high-traffic applications. Committed to engineering excellence and continuous improvement through rigorous code reviews and modern DevOps practices.`,
      `Performance-driven ${normalizedRole} with expertise in distributed systems and relational/NoSQL databases. Proven success in architecting secure, scalable backend solutions that support millions of users. Passionate about scalable architecture, algorithmic efficiency, and building resilient APIs.`
    ];
  }

  // 3. Mobile Development
  if (isMatch(['mobile', 'android', 'ios', 'flutter', 'react native', 'swift', 'kotlin', 'dart'])) {
    return [
      `Passionate ${normalizedRole} with expertise in building high-performance, visually appealing mobile applications for diverse platforms. Adept at leveraging modern mobile frameworks to deliver seamless user experiences. Strong focus on mobile architecture, state management, and optimizing app performance.`,
      `Detail-oriented ${normalizedRole} dedicated to crafting intuitive mobile interfaces and robust integrations with backend services. Proven track record of publishing successful apps and maintaining high crash-free session rates. Collaborative problem solver committed to writing clean, scalable mobile code.`,
      `Innovative ${normalizedRole} focused on pushing the boundaries of mobile technology to create engaging user experiences. Experienced in agile environments, working closely with designers to implement pixel-perfect UIs. Skilled in continuous integration and automated testing for mobile applications.`,
      `Driven ${normalizedRole} with deep knowledge of mobile ecosystem guidelines and app store optimization. Experienced in migrating legacy apps to modern frameworks and optimizing battery/memory usage. Dedicated to delivering top-tier mobile solutions that drive user retention and business growth.`
    ];
  }

  // 4. Data Science / AI / ML / Analytics
  if (isMatch(['data', 'machine learning', 'ml ', 'ai ', 'analytics', 'scientist', 'deep learning', 'nlp', 'vision', 'bi ', 'artificial intelligence'])) {
    return [
      `Analytical ${normalizedRole} with a strong foundation in statistical modeling, machine learning algorithms, and data visualization. Proven ability to extract actionable insights from complex datasets to drive strategic business decisions. Adept at deploying scalable ML pipelines and optimizing model performance.`,
      `Results-driven ${normalizedRole} specializing in predictive analytics and data-driven problem solving. Highly skilled in Python, SQL, and modern big data technologies. Passionate about transforming raw data into meaningful narratives and building intelligent systems that enhance operational efficiency.`,
      `Innovative ${normalizedRole} dedicated to advancing AI capabilities and developing cutting-edge machine learning solutions. Experienced in full-lifecycle model development, from data wrangling to production deployment. Collaborative team member committed to continuous learning and leveraging data for impactful results.`,
      `Strategic ${normalizedRole} with expertise in Natural Language Processing and generative AI solutions. Proven track record of building models that automate complex workflows and uncover deep business insights. Adept at translating abstract mathematical concepts into scalable, production-ready code.`
    ];
  }

  // 5. Design / UI / UX / Creative
  if (isMatch(['design', 'ui/ux', 'graphic', 'product designer', 'creative', 'art director', 'illustrator'])) {
    return [
      `Creative ${normalizedRole} with a passion for crafting intuitive, user-centric digital experiences. Highly skilled in user research, wireframing, prototyping, and visual design. Dedicated to bridging the gap between user needs and business goals through thoughtful, accessible design solutions.`,
      `Detail-oriented ${normalizedRole} specializing in creating visually stunning and highly functional interfaces. Proven track record of elevating brand aesthetics and improving user engagement. Collaborative team player adept at working closely with engineering teams to ensure pixel-perfect implementation.`,
      `Strategic ${normalizedRole} with a focus on problem-solving through empathetic design methodologies. Experienced in end-to-end product design, from conceptualization to final delivery. Committed to continuous iteration, usability testing, and advocating for the best possible user experience.`,
      `Innovative ${normalizedRole} with a strong background in design systems and multi-platform digital branding. Adept at turning complex workflows into simple, elegant user journeys. Passionate about inclusive design, micro-interactions, and building cohesive visual languages.`
    ];
  }

  // 6. DevOps / Cloud / SRE / Infrastructure
  if (isMatch(['devops', 'cloud', 'sre', 'site reliability', 'platform', 'infrastructure', 'aws', 'azure', 'system admin'])) {
    return [
      `Strategic ${normalizedRole} with extensive experience in cloud architecture, CI/CD pipelines, and infrastructure as code. Proven ability to enhance system reliability, automate deployments, and optimize cloud costs. Passionate about fostering a DevOps culture and ensuring seamless, secure software delivery.`,
      `Results-oriented ${normalizedRole} dedicated to building highly available and scalable infrastructure. Highly skilled in containerization, orchestration, and monitoring tools. Strong problem solver committed to minimizing downtime, streamlining operations, and empowering development teams to ship faster.`,
      `Proactive ${normalizedRole} specializing in system performance, security, and automated provisioning. Experienced in managing complex cloud environments and implementing robust disaster recovery plans. Collaborative engineer focused on operational excellence and continuous infrastructure improvement.`,
      `Visionary ${normalizedRole} focused on bridging the gap between development and operations. Proven track record of migrating legacy systems to cloud-native architectures and reducing time-to-market. Adept at implementing zero-downtime deployments and advanced observability strategies.`
    ];
  }

  // 7. QA / Testing / SDET
  if (isMatch(['qa', 'quality', 'test', 'sdet', 'automation'])) {
    return [
      `Meticulous ${normalizedRole} with expertise in designing and implementing comprehensive automated testing frameworks. Proven ability to identify defects early in the software development lifecycle, reducing post-release bugs. Passionate about ensuring product reliability and maintaining high quality standards.`,
      `Detail-oriented ${normalizedRole} specializing in both manual and automated testing across web and mobile platforms. Adept at writing robust test scripts, executing performance tests, and analyzing system bottlenecks. Collaborative team player dedicated to fostering a culture of quality engineering.`,
      `Proactive ${normalizedRole} with a strong background in continuous testing within CI/CD pipelines. Experienced in API testing, UI automation, and creating detailed bug reports. Committed to working closely with developers to deliver seamless, error-free applications to end-users.`,
      `Results-driven ${normalizedRole} focused on test-driven development and shift-left testing strategies. Proven success in reducing regression testing time through intelligent automation. Dedicated to writing clean test code and advocating for the user's flawless digital experience.`
    ];
  }

  // 8. Security / Cybersecurity
  if (isMatch(['security', 'cybersecurity', 'penetration', 'soc', 'infosec', 'hacker'])) {
    return [
      `Vigilant ${normalizedRole} with extensive experience in identifying vulnerabilities and safeguarding enterprise networks. Proven ability to conduct comprehensive risk assessments, penetration testing, and incident response. Passionate about building secure architectures and defending against evolving cyber threats.`,
      `Strategic ${normalizedRole} specializing in application security and secure coding practices. Adept at integrating security protocols into the CI/CD pipeline and conducting thorough code reviews. Collaborative professional committed to fostering a security-first mindset across development teams.`,
      `Analytical ${normalizedRole} dedicated to threat hunting, vulnerability management, and compliance auditing. Experienced in deploying advanced security controls and monitoring systems for early detection. Driven by a commitment to protecting sensitive data and ensuring regulatory compliance.`,
      `Proactive ${normalizedRole} with a strong foundation in cloud security and zero-trust architectures. Proven track record of mitigating complex cyber attacks and strengthening overall organizational security posture. Passionate about continuous monitoring and rapid incident remediation.`
    ];
  }

  // 9. Product / Program / Project Management
  if (isMatch(['product manager', 'program manager', 'project manager', 'pmp', 'scrum master', 'agile coach'])) {
    return [
      `Strategic ${normalizedRole} with a proven track record of driving cross-functional teams to deliver impactful products on time and within budget. Adept at translating user needs and market research into actionable product roadmaps. Passionate about agile methodologies and optimizing the product lifecycle.`,
      `Results-driven ${normalizedRole} specializing in bridging the gap between technical teams and business stakeholders. Highly skilled in requirement gathering, sprint planning, and mitigating project risks. Dedicated to maximizing ROI and ensuring alignment with overarching company goals.`,
      `Visionary ${normalizedRole} committed to building user-centric solutions and managing complex project portfolios. Experienced in navigating fast-paced environments, prioritizing backlogs, and fostering a collaborative team culture. Strong advocate for continuous improvement and data-driven decision making.`,
      `Empathetic ${normalizedRole} with a focus on product discovery and iterative development. Proven success in launching high-adoption features by leveraging user feedback and A/B testing. Dedicated to empowering engineering teams while delivering maximum value to the end-user.`
    ];
  }

  // 10. Marketing / SEO / Growth
  if (isMatch(['marketing', 'seo', 'growth', 'content', 'social media', 'brand', 'digital marketer'])) {
    return [
      `Creative ${normalizedRole} with a proven track record of executing data-driven marketing campaigns that drive user acquisition and brand awareness. Adept at leveraging analytics, SEO, and content strategy to maximize ROI. Passionate about crafting compelling narratives that resonate with target audiences.`,
      `Results-oriented ${normalizedRole} specializing in digital growth strategies and conversion rate optimization. Highly skilled in managing cross-channel campaigns, paid advertising, and email marketing. Dedicated to analyzing market trends and implementing innovative solutions to accelerate business growth.`,
      `Strategic ${normalizedRole} committed to building strong brand identities and engaging online communities. Experienced in leading marketing teams, managing budgets, and executing high-impact product launches. Strong advocate for aligning marketing initiatives with overarching sales and business goals.`,
      `Analytical ${normalizedRole} focused on performance marketing and lifecycle engagement. Proven success in scaling organic traffic and lowering customer acquisition costs. Passionate about testing, iterating, and scaling marketing strategies that deliver measurable impact.`
    ];
  }

  // 11. Full Stack / Software Engineering (Broad)
  if (isMatch(['full stack', 'software engineer', 'software developer', 'engineer', 'programmer', 'coder'])) {
    return [
      `Versatile ${normalizedRole} with end-to-end expertise in both front-end and back-end development. Proven ability to design scalable architectures, develop robust APIs, and build intuitive user interfaces. Adept at leading technical initiatives and mentoring junior engineers to drive product success.`,
      `Results-oriented ${normalizedRole} with a passion for building comprehensive software solutions from conception to deployment. Highly skilled in modern web frameworks, cloud infrastructure, and agile methodologies. Dedicated to writing clean, testable code and solving complex business problems efficiently.`,
      `Strategic ${normalizedRole} combining strong technical acumen with a product-focused mindset. Experienced in cross-functional collaboration to deliver high-quality, scalable applications. Committed to continuous learning, optimizing system performance, and fostering a culture of engineering excellence.`,
      `Adaptable ${normalizedRole} with a broad skill set across the modern tech stack. Proven track record of quickly mastering new technologies and delivering impactful features in fast-paced startup environments. Passionate about elegant code architecture and continuous delivery.`
    ];
  }

  // 12. Executive / C-Suite / Leadership
  if (isMatch(['director', 'vp', 'cto', 'ceo', 'cmo', 'chief', 'head of', 'founder'])) {
    return [
      `Visionary ${normalizedRole} with a proven track record of leading high-performing teams, defining corporate strategy, and driving organizational growth. Adept at translating complex market challenges into actionable business initiatives. Passionate about fostering a culture of innovation, operational excellence, and long-term profitability.`,
      `Strategic ${normalizedRole} specializing in scaling operations, securing investments, and navigating highly competitive markets. Highly skilled in executive leadership, cross-functional alignment, and stakeholder management. Dedicated to building resilient business models and mentoring the next generation of leaders.`,
      `Transformational ${normalizedRole} committed to driving digital transformation and maximizing shareholder value. Experienced in managing large-scale budgets, mitigating enterprise risks, and leading global expansions. Strong advocate for data-driven decision-making and sustainable business practices.`,
      `Dynamic ${normalizedRole} with a history of turning ambitious visions into measurable market success. Proven ability to build strategic partnerships, optimize organizational structures, and lead companies through rapid growth phases. Passionate about leading with empathy and clarity.`
    ];
  }

  // ── Default / Fallback Generic Summaries ──
  return [
    `Results-driven ${normalizedRole} with a proven track record of delivering high-quality solutions and driving project success. Adept at leveraging modern methodologies to solve complex problems and optimize workflows. Collaborative team player dedicated to continuous improvement and achieving impactful business outcomes.`,
    `Detail-oriented ${normalizedRole} with expertise in executing strategic initiatives and maintaining high standards of quality. Passionate about clear communication, cross-functional collaboration, and overcoming challenges in fast-paced environments. Strong analytical skills combined with a commitment to professional growth.`,
    `Innovative ${normalizedRole} bringing strong problem-solving capabilities and a passion for excellence. Experienced in adapting to new tools quickly and contributing effectively to dynamic teams. Committed to delivering exceptional results, meeting tight deadlines, and fostering a positive, productive work environment.`,
    `Motivated ${normalizedRole} dedicated to exceeding expectations and bringing a proactive approach to team objectives. Proven ability to manage multiple priorities in fast-paced settings while maintaining meticulous attention to detail. Passionate about continuous learning and contributing to long-term organizational goals.`
  ];
}

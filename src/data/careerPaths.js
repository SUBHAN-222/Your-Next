/**
 * Career Paths Database
 * Each career path contains detailed information for generating personalized roadmaps
 * This structure allows easy addition of new career tracks without rewriting logic
 *
 * IMPORTANT: Every roadmap step must have BOTH:
 *   - resource:  Display title of the resource (e.g. "MDN HTML Basics")
 *   - resourceUrl:  Real working HTTPS URL (e.g. "https://developer.mozilla.org/...")
 */

export const CAREER_PATHS = {
  web: {
    id: "web",
    name: "Web Development",
    icon: "🌐",
    description: "Build websites and web applications that people use every day",
    categories: {
      frontend: {
        name: "Frontend Development",
        description: "Create beautiful, interactive user interfaces",
        skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Next.js"],
        tools: ["VS Code", "Git", "Figma", "Chrome DevTools", "npm/yarn"],
        earningMethods: [
          { type: "freelance", title: "Website Development", platforms: ["Upwork", "Fiverr"], avgRate: "$25-75/hr" },
          { type: "job", title: "Frontend Developer", companies: ["Startups", "Agencies", "Tech Companies"], avgSalary: "$60k-120k" },
          { type: "product", title: "SaaS Products", examples: ["UI Kits", "Templates", "Plugins"] }
        ]
      },
      backend: {
        name: "Backend Development",
        description: "Build the server-side logic and databases that power applications",
        skills: ["Node.js", "Python", "SQL", "MongoDB", "REST APIs", "GraphQL"],
        tools: ["Postman", "Docker", "AWS", "Git", "Linux"],
        earningMethods: [
          { type: "freelance", title: "API Development", platforms: ["Toptal", "Upwork"], avgRate: "$40-100/hr" },
          { type: "job", title: "Backend Engineer", companies: ["Tech Giants", "Startups"], avgSalary: "$80k-150k" },
          { type: "product", title: "Micro-SaaS", examples: ["APIs as Service", "Backend Templates"] }
        ]
      },
      fullstack: {
        name: "Full-Stack Development",
        description: "Master both frontend and backend to build complete applications",
        skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"],
        tools: ["VS Code", "Git", "Docker", "Vercel", "Supabase"],
        earningMethods: [
          { type: "freelance", title: "Full Project Development", platforms: ["Upwork", "Toptal"], avgRate: "$50-150/hr" },
          { type: "job", title: "Full-Stack Engineer", companies: ["Startups", "Enterprise"], avgSalary: "$90k-160k" },
          { type: "product", title: "Complete SaaS", examples: ["Web Apps", "Marketplaces"] }
        ]
      }
    },
    roadmaps: {
      beginner: [
        { name: "HTML Foundations", why: "The skeleton of every website", time: "2-3 hours", resource: "MDN HTML Basics", resourceUrl: "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML", task: "Create a personal page with headings, paragraphs, and links" },
        { name: "CSS Styling", why: "Make your websites visually appealing", time: "4-6 hours", resource: "CSS Tricks Guide", resourceUrl: "https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps", task: "Style your page with colors, fonts, and layouts" },
        { name: "JavaScript Basics", why: "Add interactivity to your pages", time: "8-10 hours", resource: "JavaScript.info", resourceUrl: "https://javascript.info/", task: "Build a button that changes the page color" },
        { name: "Git & GitHub", why: "Version control is essential for collaboration", time: "3-4 hours", resource: "GitHub Learning Lab", resourceUrl: "https://learngitbranching.js.org/", task: "Push your project to GitHub" },
        { name: "React Fundamentals", why: "The most popular frontend framework", time: "15-20 hours", resource: "React Official Docs", resourceUrl: "https://react.dev/learn", task: "Convert your page to React components" }
      ],
      intermediate: [
        { name: "Advanced React Patterns", why: "Write cleaner, more maintainable code", time: "10-15 hours", resource: "Epic React", resourceUrl: "https://react.dev/reference/react/hooks", task: "Refactor with custom hooks" },
        { name: "TypeScript", why: "Catch errors before they happen", time: "8-12 hours", resource: "TypeScript Handbook", resourceUrl: "https://www.typescriptlang.org/docs/handbook/intro.html", task: "Add types to your React project" },
        { name: "Backend with Node.js", why: "Build your own APIs", time: "15-20 hours", resource: "Node.js Docs", resourceUrl: "https://nodejs.org/en/learn/", task: "Create a REST API with Express" },
        { name: "Database Fundamentals", why: "Store and retrieve data efficiently", time: "10-15 hours", resource: "SQLBolt", resourceUrl: "https://sqlbolt.com/", task: "Design and query a database" },
        { name: "Deployment & DevOps", why: "Ship your applications to the world", time: "5-8 hours", resource: "Vercel/Netlify Docs", resourceUrl: "https://vercel.com/docs", task: "Deploy a full-stack app" }
      ],
      advanced: [
        { name: "System Design", why: "Architect scalable applications", time: "20-30 hours", resource: "System Design Primer", resourceUrl: "https://github.com/donnemartin/system-design-primer", task: "Design a Twitter clone" },
        { name: "Performance Optimization", why: "Make your apps lightning fast", time: "10-15 hours", resource: "Web.dev", resourceUrl: "https://web.dev/learn/", task: "Achieve 90+ Lighthouse score" },
        { name: "Testing Strategies", why: "Ship with confidence", time: "10-15 hours", resource: "Testing Library", resourceUrl: "https://testing-library.com/docs/", task: "Write tests for your app" },
        { name: "Cloud Architecture", why: "Scale to millions of users", time: "20-30 hours", resource: "AWS Certified Developer", resourceUrl: "https://aws.amazon.com/getting-started/hands-on/", task: "Deploy with CI/CD pipeline" }
      ]
    }
  },

  ai: {
    id: "ai",
    name: "AI & Machine Learning",
    icon: "🤖",
    description: "Build intelligent systems that learn and adapt",
    categories: {
      ml_engineer: {
        name: "ML Engineer",
        description: "Build and deploy machine learning models at scale",
        skills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "MLOps", "Cloud AI"],
        tools: ["Jupyter", "Colab", "Kaggle", "Weights & Biases", "Docker"],
        earningMethods: [
          { type: "freelance", title: "ML Consulting", platforms: ["Toptal", "Upwork"], avgRate: "$75-200/hr" },
          { type: "job", title: "ML Engineer", companies: ["Tech Giants", "AI Startups"], avgSalary: "$120k-250k" },
          { type: "product", title: "AI Tools", examples: ["Chatbots", "Automation Tools"] }
        ]
      },
      ai_researcher: {
        name: "AI Researcher",
        description: "Push the boundaries of what AI can do",
        skills: ["Deep Learning", "NLP", "Computer Vision", "Reinforcement Learning", "Mathematics"],
        tools: ["PyTorch", "TensorFlow", "LaTeX", "Papers With Code"],
        earningMethods: [
          { type: "job", title: "Research Scientist", companies: ["OpenAI", "DeepMind", "Universities"], avgSalary: "$150k-300k" },
          { type: "product", title: "Research Tools", examples: ["Libraries", "Frameworks"] }
        ]
      },
      ai_applications: {
        name: "AI Applications Developer",
        description: "Apply AI to solve real-world problems",
        skills: ["Prompt Engineering", "API Integration", "RAG", "Fine-tuning", "LangChain"],
        tools: ["OpenAI API", "Hugging Face", "LangChain", "Streamlit"],
        earningMethods: [
          { type: "freelance", title: "AI Integration", platforms: ["Upwork", "Fiverr"], avgRate: "$50-150/hr" },
          { type: "job", title: "AI Developer", companies: ["Startups", "Enterprises"], avgSalary: "$100k-200k" },
          { type: "product", title: "AI SaaS", examples: ["Content Tools", "Automation"] }
        ]
      }
    },
    roadmaps: {
      beginner: [
        { name: "Python Programming", why: "The language of AI", time: "10-15 hours", resource: "Python.org", resourceUrl: "https://www.learnpython.org/", task: "Write a program that processes data" },
        { name: "Mathematics Basics", why: "AI is built on math", time: "15-20 hours", resource: "Khan Academy", resourceUrl: "https://www.khanacademy.org/math", task: "Understand linear algebra basics" },
        { name: "Data Analysis with Pandas", why: "Work with real-world data", time: "8-12 hours", resource: "Pandas Documentation", resourceUrl: "https://pandas.pydata.org/docs/getting_started/index.html", task: "Analyze a dataset" },
        { name: "Machine Learning Concepts", why: "Understand how ML works", time: "15-20 hours", resource: "Coursera ML Course", resourceUrl: "https://www.coursera.org/learn/machine-learning", task: "Build your first ML model" },
        { name: "Neural Networks Intro", why: "The foundation of deep learning", time: "10-15 hours", resource: "3Blue1Brown", resourceUrl: "https://www.youtube.com/@3blue1brown", task: "Create a simple neural network" }
      ],
      intermediate: [
        { name: "Deep Learning Specialization", why: "Master neural networks", time: "40-60 hours", resource: "DeepLearning.AI", resourceUrl: "https://course.fast.ai/", task: "Build image classifier" },
        { name: "NLP Fundamentals", why: "Work with text and language", time: "20-30 hours", resource: "Hugging Face Course", resourceUrl: "https://huggingface.co/learn/nlp-course/chapter1/1", task: "Build a sentiment analyzer" },
        { name: "Computer Vision", why: "Teach machines to see", time: "20-30 hours", resource: "OpenCV Docs", resourceUrl: "https://www.youtube.com/watch?v=OXN3wuHUBP0", task: "Face detection project" },
        { name: "MLOps Basics", why: "Deploy models to production", time: "15-20 hours", resource: "Made With ML", resourceUrl: "https://madewithml.com/", task: "Deploy a model with FastAPI" }
      ],
      advanced: [
        { name: "Transformer Architecture", why: "The backbone of modern AI", time: "30-40 hours", resource: "Attention Is All You Need", resourceUrl: "https://arxiv.org/abs/1706.03762", task: "Implement a transformer" },
        { name: "Large Language Models", why: "Work with state-of-the-art AI", time: "20-30 hours", resource: "LLM Course", resourceUrl: "https://learnprompting.org/docs/intro", task: "Fine-tune a language model" },
        { name: "Reinforcement Learning", why: "AI that learns from experience", time: "30-40 hours", resource: "Spinning Up", resourceUrl: "https://spinningup.openai.com/en/latest/", task: "Train an RL agent" },
        { name: "AI Research Methods", why: "Contribute to the field", time: "Ongoing", resource: "Papers With Code", resourceUrl: "https://paperswithcode.com/", task: "Reproduce a research paper" }
      ]
    }
  },

  data: {
    id: "data",
    name: "Data Science",
    icon: "📊",
    description: "Extract insights from data to drive decisions",
    categories: {
      data_analyst: {
        name: "Data Analyst",
        description: "Turn data into actionable insights",
        skills: ["SQL", "Excel", "Tableau", "Python", "Statistics", "Data Visualization"],
        tools: ["Tableau", "Power BI", "SQL", "Excel", "Jupyter"],
        earningMethods: [
          { type: "freelance", title: "Data Analysis", platforms: ["Upwork", "Fiverr"], avgRate: "$30-80/hr" },
          { type: "job", title: "Data Analyst", companies: ["All Industries"], avgSalary: "$60k-100k" },
          { type: "product", title: "Dashboards & Reports", examples: ["Templates", "Consulting"] }
        ]
      },
      data_scientist: {
        name: "Data Scientist",
        description: "Build predictive models and solve complex problems",
        skills: ["Python", "R", "Machine Learning", "Statistics", "Deep Learning", "Big Data"],
        tools: ["Jupyter", "Scikit-learn", "TensorFlow", "Spark", "AWS"],
        earningMethods: [
          { type: "freelance", title: "ML Consulting", platforms: ["Toptal", "Upwork"], avgRate: "$75-150/hr" },
          { type: "job", title: "Data Scientist", companies: ["Tech", "Finance", "Healthcare"], avgSalary: "$100k-180k" },
          { type: "product", title: "Data Products", examples: ["Prediction APIs", "Analytics Tools"] }
        ]
      },
      data_engineer: {
        name: "Data Engineer",
        description: "Build the infrastructure that powers data science",
        skills: ["SQL", "Python", "Spark", "Airflow", "Cloud Platforms", "ETL"],
        tools: ["AWS", "GCP", "Azure", "Snowflake", "dbt"],
        earningMethods: [
          { type: "freelance", title: "Data Pipeline Development", platforms: ["Toptal"], avgRate: "$80-180/hr" },
          { type: "job", title: "Data Engineer", companies: ["Tech Giants", "Enterprises"], avgSalary: "$110k-200k" },
          { type: "product", title: "Data Tools", examples: ["ETL Frameworks", "Connectors"] }
        ]
      }
    },
    roadmaps: {
      beginner: [
        { name: "Excel Mastery", why: "The most accessible data tool", time: "8-12 hours", resource: "Excel Easy", resourceUrl: "https://www.kaggle.com/learn", task: "Create pivot tables and charts" },
        { name: "SQL Fundamentals", why: "Query any database", time: "10-15 hours", resource: "SQLZoo", resourceUrl: "https://www.w3schools.com/sql/", task: "Query a sample database" },
        { name: "Statistics Basics", why: "Understand data distributions", time: "15-20 hours", resource: "Khan Academy Stats", resourceUrl: "https://www.khanacademy.org/math/statistics-probability", task: "Analyze a dataset statistically" },
        { name: "Python for Data Science", why: "Automate your analysis", time: "15-20 hours", resource: "DataCamp", resourceUrl: "https://www.learnpython.org/", task: "Analyze data with Pandas" },
        { name: "Data Visualization", why: "Tell stories with data", time: "10-15 hours", resource: "Tableau Public", resourceUrl: "https://www.kaggle.com/learn/data-visualization", task: "Create an interactive dashboard" }
      ],
      intermediate: [
        { name: "Advanced SQL", why: "Handle complex queries", time: "15-20 hours", resource: "LeetCode SQL", resourceUrl: "https://www.w3schools.com/sql/", task: "Solve 50 SQL challenges" },
        { name: "Machine Learning", why: "Predict future outcomes", time: "30-40 hours", resource: "Coursera ML", resourceUrl: "https://www.coursera.org/learn/machine-learning", task: "Build a prediction model" },
        { name: "Big Data Basics", why: "Work with massive datasets", time: "15-20 hours", resource: "Spark Docs", resourceUrl: "https://spark.apache.org/docs/latest/", task: "Process data with PySpark" },
        { name: "A/B Testing", why: "Make data-driven decisions", time: "10-15 hours", resource: "Udacity A/B Testing", resourceUrl: "https://www.kaggle.com/learn", task: "Design and analyze an experiment" }
      ],
      advanced: [
        { name: "Deep Learning for Data", why: "Handle unstructured data", time: "30-40 hours", resource: "Fast.ai", resourceUrl: "https://course.fast.ai/", task: "Build an image classifier" },
        { name: "MLOps", why: "Deploy models at scale", time: "20-30 hours", resource: "MLOps Zoomcamp", resourceUrl: "https://madewithml.com/", task: "Deploy a model pipeline" },
        { name: "Cloud Data Platforms", why: "Enterprise-grade solutions", time: "20-30 hours", resource: "AWS Data Analytics", resourceUrl: "https://aws.amazon.com/getting-started/hands-on/", task: "Build a data lake" },
        { name: "Advanced Analytics", why: "Solve complex business problems", time: "Ongoing", resource: "Towards Data Science", resourceUrl: "https://www.kaggle.com/learn", task: "End-to-end analytics project" }
      ]
    }
  },

  cyber: {
    id: "cyber",
    name: "Cyber Security",
    icon: "🔒",
    description: "Protect systems and data from digital attacks",
    categories: {
      security_analyst: {
        name: "Security Analyst",
        description: "Monitor and respond to security threats",
        skills: ["Network Security", "SIEM", "Incident Response", "Risk Assessment", "Compliance"],
        tools: ["Splunk", "Wireshark", "Metasploit", "Nmap", "Burp Suite"],
        earningMethods: [
          { type: "job", title: "SOC Analyst", companies: ["Enterprises", "MSSPs"], avgSalary: "$70k-120k" },
          { type: "freelance", title: "Security Consulting", platforms: ["Upwork"], avgRate: "$50-120/hr" }
        ]
      },
      ethical_hacker: {
        name: "Ethical Hacker / Penetration Tester",
        description: "Find vulnerabilities before attackers do",
        skills: ["Penetration Testing", "Web Security", "Network Exploitation", "Social Engineering", "Report Writing"],
        tools: ["Kali Linux", "Burp Suite", "Metasploit", "OWASP ZAP", "Cobalt Strike"],
        earningMethods: [
          { type: "freelance", title: "Bug Bounty", platforms: ["HackerOne", "Bugcrowd"], avgRate: "$500-50k/bug" },
          { type: "job", title: "Penetration Tester", companies: ["Security Firms", "Enterprises"], avgSalary: "$90k-160k" },
          { type: "freelance", title: "Security Audits", platforms: ["Toptal"], avgRate: "$100-250/hr" }
        ]
      },
      security_engineer: {
        name: "Security Engineer",
        description: "Build secure systems and infrastructure",
        skills: ["Cloud Security", "DevSecOps", "Identity Management", "Cryptography", "Security Architecture"],
        tools: ["AWS Security", "Terraform", "Vault", "Kubernetes", "SIEM"],
        earningMethods: [
          { type: "job", title: "Security Engineer", companies: ["Tech Companies", "Banks"], avgSalary: "$120k-220k" },
          { type: "freelance", title: "Security Architecture", platforms: ["Toptal"], avgRate: "$120-250/hr" }
        ]
      }
    },
    roadmaps: {
      beginner: [
        { name: "Networking Fundamentals", why: "Understand how data moves", time: "15-20 hours", resource: "NetworkChuck", resourceUrl: "https://tryhackme.com/path/outline/presecurity", task: "Set up a home lab network" },
        { name: "Linux Basics", why: "Most security tools run on Linux", time: "10-15 hours", resource: "Linux Journey", resourceUrl: "https://linuxjourney.com/", task: "Navigate and manage files via terminal" },
        { name: "Security Fundamentals", why: "Learn the core concepts", time: "15-20 hours", resource: "CompTIA Security+", resourceUrl: "https://tryhackme.com/room/startingoutincybersec", task: "Document common threats" },
        { name: "Web Technologies", why: "Understand what you're protecting", time: "10-15 hours", resource: "OWASP Top 10", resourceUrl: "https://owasp.org/www-project-top-ten/", task: "Identify vulnerabilities in a demo app" },
        { name: "Python for Security", why: "Automate security tasks", time: "10-15 hours", resource: "Black Hat Python", resourceUrl: "https://www.learnpython.org/", task: "Write a port scanner" }
      ],
      intermediate: [
        { name: "Penetration Testing", why: "Learn to think like an attacker", time: "30-40 hours", resource: "eJPT Course", resourceUrl: "https://tryhackme.com/room/startingoutincybersec", task: "Complete a pentest lab" },
        { name: "Web Application Security", why: "Protect the most common attack surface", time: "20-30 hours", resource: "OWASP Web Security", resourceUrl: "https://owasp.org/www-project-top-ten/", task: "Exploit and fix OWASP Top 10" },
        { name: "Network Security", why: "Secure the infrastructure", time: "20-30 hours", resource: "Network Security Courses", resourceUrl: "https://tryhackme.com/path/outline/presecurity", task: "Configure firewalls and IDS" },
        { name: "Incident Response", why: "Handle security breaches", time: "15-20 hours", resource: "SANS Incident Response", resourceUrl: "https://www.sans.org/cyber-security-courses/", task: "Simulate an incident response" }
      ],
      advanced: [
        { name: "Advanced Exploitation", why: "Master complex attacks", time: "40-60 hours", resource: "OSEP Course", resourceUrl: "https://www.offsec.com/courses/pen-300/", task: "Bypass modern defenses" },
        { name: "Cloud Security", why: "Secure cloud infrastructure", time: "20-30 hours", resource: "CCSP Certification", resourceUrl: "https://aws.amazon.com/training/", task: "Secure a cloud environment" },
        { name: "Reverse Engineering", why: "Understand malware and exploits", time: "30-40 hours", resource: "Malware Analysis", resourceUrl: "https://tryhackme.com/room/startingoutincybersec", task: "Analyze a malware sample" },
        { name: "Security Architecture", why: "Design secure systems", time: "Ongoing", resource: "CISSP", resourceUrl: "https://www.sans.org/cyber-security-courses/", task: "Design enterprise security" }
      ]
    }
  },

  mobile: {
    id: "mobile",
    name: "Mobile App Development",
    icon: "📱",
    description: "Create apps for smartphones and tablets",
    categories: {
      react_native: {
        name: "React Native Developer",
        description: "Build cross-platform apps with JavaScript",
        skills: ["React Native", "JavaScript", "TypeScript", "Redux", "Native Modules"],
        tools: ["Expo", "VS Code", "Android Studio", "Xcode", "Firebase"],
        earningMethods: [
          { type: "freelance", title: "App Development", platforms: ["Upwork", "Toptal"], avgRate: "$40-100/hr" },
          { type: "job", title: "Mobile Developer", companies: ["Startups", "Agencies"], avgSalary: "$80k-140k" },
          { type: "product", title: "Own Apps", examples: ["App Store", "Play Store"] }
        ]
      },
      ios_developer: {
        name: "iOS Developer",
        description: "Build native apps for Apple devices",
        skills: ["Swift", "SwiftUI", "UIKit", "Core Data", "Combine"],
        tools: ["Xcode", "Instruments", "TestFlight", "App Store Connect"],
        earningMethods: [
          { type: "freelance", title: "iOS Development", platforms: ["Upwork", "Toptal"], avgRate: "$50-120/hr" },
          { type: "job", title: "iOS Engineer", companies: ["Tech Companies", "Startups"], avgSalary: "$100k-180k" },
          { type: "product", title: "App Store Apps", examples: ["Paid Apps", "In-App Purchases"] }
        ]
      },
      android_developer: {
        name: "Android Developer",
        description: "Build native apps for Android devices",
        skills: ["Kotlin", "Java", "Android SDK", "Jetpack Compose", "Room"],
        tools: ["Android Studio", "Firebase", "Git", "Gradle"],
        earningMethods: [
          { type: "freelance", title: "Android Development", platforms: ["Upwork", "Fiverr"], avgRate: "$40-100/hr" },
          { type: "job", title: "Android Engineer", companies: ["Tech Companies", "Startups"], avgSalary: "$90k-160k" },
          { type: "product", title: "Play Store Apps", examples: ["Paid Apps", "Ad-Supported"] }
        ]
      }
    },
    roadmaps: {
      beginner: [
        { name: "Programming Fundamentals", why: "Foundation for all development", time: "15-20 hours", resource: "freeCodeCamp", resourceUrl: "https://www.freecodecamp.org/", task: "Build a calculator app" },
        { name: "UI/UX Basics", why: "Create user-friendly interfaces", time: "8-12 hours", resource: "Material Design", resourceUrl: "https://www.figma.com/resource-library/design-basics/", task: "Design app screens in Figma" },
        { name: "React Native Basics", why: "Cross-platform development", time: "20-30 hours", resource: "React Native Docs", resourceUrl: "https://reactnative.dev/docs/getting-started", task: "Build a todo app" },
        { name: "State Management", why: "Handle app data efficiently", time: "10-15 hours", resource: "Redux Toolkit", resourceUrl: "https://redux-toolkit.js.org/", task: "Add state management to your app" },
        { name: "Publishing", why: "Get your app to users", time: "5-8 hours", resource: "App Store Guidelines", resourceUrl: "https://reactnative.dev/docs/publishing-to-app-store", task: "Publish to TestFlight or Play Console" }
      ],
      intermediate: [
        { name: "Native Modules", why: "Access device features", time: "15-20 hours", resource: "React Native Native", resourceUrl: "https://reactnative.dev/docs/native-modules-setup", task: "Integrate camera and location" },
        { name: "Performance Optimization", why: "Make apps smooth and fast", time: "10-15 hours", resource: "React Native Performance", resourceUrl: "https://reactnative.dev/docs/performance", task: "Optimize app startup time" },
        { name: "Testing", why: "Ensure app quality", time: "10-15 hours", resource: "React Native Testing", resourceUrl: "https://reactnative.dev/docs/testing-overview", task: "Write unit and integration tests" },
        { name: "Backend Integration", why: "Connect to servers and APIs", time: "15-20 hours", resource: "Firebase Docs", resourceUrl: "https://firebase.google.com/docs", task: "Add authentication and database" }
      ],
      advanced: [
        { name: "Advanced Animations", why: "Create polished experiences", time: "15-20 hours", resource: "Reanimated", resourceUrl: "https://docs.swmansion.com/react-native-reanimated/", task: "Build complex animations" },
        { name: "Offline-First Architecture", why: "Apps that work without internet", time: "15-20 hours", resource: "WatermelonDB", resourceUrl: "https://watermelondb.dev/", task: "Implement offline sync" },
        { name: "CI/CD for Mobile", why: "Automate builds and releases", time: "10-15 hours", resource: "Fastlane", resourceUrl: "https://fastlane.tools/", task: "Set up automated deployments" },
        { name: "Monetization", why: "Earn from your apps", time: "Ongoing", resource: "RevenueCat", resourceUrl: "https://www.revenuecat.com/docs/", task: "Implement in-app purchases" }
      ]
    }
  },

  design: {
    id: "design",
    name: "Product Design (UI/UX)",
    icon: "🎨",
    description: "Design digital products that users love",
    categories: {
      ui_designer: {
        name: "UI Designer",
        description: "Create beautiful and functional interfaces",
        skills: ["Figma", "Visual Design", "Design Systems", "Prototyping", "Typography"],
        tools: ["Figma", "Sketch", "Adobe Creative Suite", "Principle", "Framer"],
        earningMethods: [
          { type: "freelance", title: "UI Design", platforms: ["Dribbble", "Upwork"], avgRate: "$40-100/hr" },
          { type: "job", title: "UI Designer", companies: ["Tech Companies", "Agencies"], avgSalary: "$70k-130k" },
          { type: "product", title: "Design Assets", examples: ["UI Kits", "Icons", "Templates"] }
        ]
      },
      ux_designer: {
        name: "UX Designer",
        description: "Design user experiences that solve real problems",
        skills: ["User Research", "Wireframing", "Prototyping", "Usability Testing", "Information Architecture"],
        tools: ["Figma", "Miro", "UserTesting", "Hotjar", "Notion"],
        earningMethods: [
          { type: "freelance", title: "UX Consulting", platforms: ["Upwork", "Toptal"], avgRate: "$50-120/hr" },
          { type: "job", title: "UX Designer", companies: ["Tech Companies", "Startups"], avgSalary: "$80k-150k" },
          { type: "product", title: "UX Resources", examples: ["Templates", "Courses"] }
        ]
      },
      product_designer: {
        name: "Product Designer",
        description: "Own the entire product design process",
        skills: ["UI/UX", "Product Strategy", "User Research", "Design Systems", "Data Analysis"],
        tools: ["Figma", "Amplitude", "Mixpanel", "Notion", "Linear"],
        earningMethods: [
          { type: "freelance", title: "Product Design", platforms: ["Toptal", "Gun.io"], avgRate: "$75-180/hr" },
          { type: "job", title: "Product Designer", companies: ["Tech Giants", "Startups"], avgSalary: "$100k-200k" },
          { type: "product", title: "Own Products", examples: ["SaaS Products", "Apps"] }
        ]
      }
    },
    roadmaps: {
      beginner: [
        { name: "Design Fundamentals", why: "Understand the basics of visual design", time: "10-15 hours", resource: "Refactoring UI", resourceUrl: "https://www.interaction-design.org/literature/topics/ui-design", task: "Redesign a bad interface" },
        { name: "Figma Mastery", why: "The industry standard tool", time: "15-20 hours", resource: "Figma Tutorial", resourceUrl: "https://www.figma.com/resource-library/design-basics/", task: "Design a mobile app screen" },
        { name: "UX Principles", why: "Design for users, not yourself", time: "15-20 hours", resource: "Don't Make Me Think", resourceUrl: "https://www.interaction-design.org/literature/topics/ui-design", task: "Conduct a usability review" },
        { name: "Design Systems", why: "Create consistent experiences", time: "10-15 hours", resource: "Material Design", resourceUrl: "https://www.figma.com/resource-library/design-basics/", task: "Build a component library" },
        { name: "Portfolio Building", why: "Showcase your work", time: "20-30 hours", resource: "Design Buddies", resourceUrl: "https://www.figma.com/resource-library/design-basics/", task: "Create 3 case studies" }
      ],
      intermediate: [
        { name: "Advanced Prototyping", why: "Bring designs to life", time: "15-20 hours", resource: "ProtoPie", resourceUrl: "https://www.figma.com/resource-library/design-basics/", task: "Create an interactive prototype" },
        { name: "User Research", why: "Base decisions on data", time: "15-20 hours", resource: "User Research Guide", resourceUrl: "https://www.interaction-design.org/literature/topics/ui-design", task: "Conduct user interviews" },
        { name: "Accessibility", why: "Design for everyone", time: "10-15 hours", resource: "WCAG Guidelines", resourceUrl: "https://www.w3.org/WAI/standards-guidelines/wcag/", task: "Audit a design for accessibility" },
        { name: "Design to Development", why: "Bridge the gap", time: "10-15 hours", resource: "Handoff Guide", resourceUrl: "https://www.figma.com/resource-library/design-basics/", task: "Create developer-ready specs" }
      ],
      advanced: [
        { name: "Product Strategy", why: "Think beyond pixels", time: "20-30 hours", resource: "Inspired by Marty Cagan", resourceUrl: "https://www.interaction-design.org/literature/topics/ui-design", task: "Define a product roadmap" },
        { name: "Design Leadership", why: "Lead design teams", time: "Ongoing", resource: "Design Leadership Forum", resourceUrl: "https://www.interaction-design.org/literature/topics/ui-design", task: "Mentor junior designers" },
        { name: "Data-Driven Design", why: "Measure design impact", time: "15-20 hours", resource: "Lean UX", resourceUrl: "https://www.interaction-design.org/literature/topics/ui-design", task: "Run A/B tests on designs" },
        { name: "Specialization", why: "Become an expert", time: "Ongoing", resource: "Industry Conferences", resourceUrl: "https://www.interaction-design.org/literature/topics/ui-design", task: "Speak at a design event" }
      ]
    }
  },

  freelance: {
    id: "freelance",
    name: "Freelancing & Online Earning",
    icon: "💼",
    description: "Build a location-independent career",
    categories: {
      tech_freelancer: {
        name: "Tech Freelancer",
        description: "Offer technical services to clients",
        skills: ["Web Development", "Communication", "Project Management", "Sales", "Time Management"],
        tools: ["Upwork", "Fiverr", "Stripe", "Notion", "Calendly"],
        earningMethods: [
          { type: "freelance", title: "Development Services", platforms: ["Upwork", "Toptal"], avgRate: "$30-150/hr" },
          { type: "retainer", title: "Monthly Retainers", clients: ["Small Businesses", "Startups"], avgRate: "$1k-5k/month" }
        ]
      },
      content_creator: {
        name: "Content Creator",
        description: "Monetize your knowledge through content",
        skills: ["Writing", "Video Production", "SEO", "Social Media", "Community Building"],
        tools: ["YouTube", "Substack", "Twitter", "Gumroad", "Patreon"],
        earningMethods: [
          { type: "ad_revenue", title: "Ad Revenue", platforms: ["YouTube", "Medium"], avgRate: "$1-10 per 1k views" },
          { type: "sponsorships", title: "Sponsorships", platforms: ["Brands", "Affiliates"], avgRate: "$500-10k per post" },
          { type: "products", title: "Digital Products", examples: ["Courses", "Ebooks", "Templates"] }
        ]
      },
      agency_owner: {
        name: "Agency Owner",
        description: "Scale beyond solo freelancing",
        skills: ["Business Development", "Team Management", "Operations", "Sales", "Marketing"],
        tools: ["Slack", "Asana", "HubSpot", "QuickBooks", "Zoom"],
        earningMethods: [
          { type: "agency", title: "Service Agency", clients: ["Businesses", "Enterprises"], avgRate: "$5k-50k/project" },
          { type: "productized", title: "Productized Service", examples: ["Website Packages", "SEO Services"] }
        ]
      }
    },
    roadmaps: {
      beginner: [
        { name: "Choose Your Niche", why: "Specialization leads to higher rates", time: "5-8 hours", resource: "Niche Selection Guide", resourceUrl: "https://www.upwork.com/resources/how-to-find-your-niche", task: "Define your service offering" },
        { name: "Build a Portfolio", why: "Show, don't tell", time: "15-20 hours", resource: "Portfolio Guide", resourceUrl: "https://www.upwork.com/resources/how-to-create-a-profile-that-stands-out", task: "Create 3 portfolio pieces" },
        { name: "Set Up Profiles", why: "Get visible to clients", time: "5-8 hours", resource: "Upwork Guide", resourceUrl: "https://www.upwork.com/resources/how-to-create-a-profile-that-stands-out", task: "Complete Upwork and LinkedIn profiles" },
        { name: "Learn to Pitch", why: "Win your first clients", time: "8-12 hours", resource: "Proposal Writing", resourceUrl: "https://www.upwork.com/resources/how-to-write-a-cover-letter", task: "Write 10 practice proposals" },
        { name: "Deliver Excellence", why: "Build your reputation", time: "Ongoing", resource: "Client Management", resourceUrl: "https://www.upwork.com/resources/how-to-write-a-cover-letter", task: "Complete your first project" }
      ],
      intermediate: [
        { name: "Raise Your Rates", why: "Earn what you're worth", time: "5-8 hours", resource: "Pricing Strategy", resourceUrl: "https://www.upwork.com/resources/how-to-find-your-niche", task: "Increase rates by 25%" },
        { name: "Build Systems", why: "Work more efficiently", time: "10-15 hours", resource: "Freelance Systems", resourceUrl: "https://www.upwork.com/resources/how-to-create-a-profile-that-stands-out", task: "Create templates and workflows" },
        { name: "Passive Income", why: "Earn while you sleep", time: "20-30 hours", resource: "Digital Products", resourceUrl: "https://www.upwork.com/resources/how-to-find-your-niche", task: "Launch a digital product" },
        { name: "Network Building", why: "Get referrals and opportunities", time: "Ongoing", resource: "Networking Guide", resourceUrl: "https://www.upwork.com/resources/how-to-find-your-niche", task: "Attend 3 industry events" }
      ],
      advanced: [
        { name: "Scale with Team", why: "Take on bigger projects", time: "20-30 hours", resource: "Hiring Guide", resourceUrl: "https://www.upwork.com/resources/how-to-find-your-niche", task: "Hire your first contractor" },
        { name: "Productize Services", why: "Predictable revenue", time: "15-20 hours", resource: "Productized Service", resourceUrl: "https://www.upwork.com/resources/how-to-find-your-niche", task: "Create a service package" },
        { name: "Personal Brand", why: "Attract inbound leads", time: "Ongoing", resource: "Personal Branding", resourceUrl: "https://www.upwork.com/resources/how-to-create-a-profile-that-stands-out", task: "Publish weekly content" },
        { name: "Exit Strategy", why: "Build something sellable", time: "Ongoing", resource: "Business Exit", resourceUrl: "https://www.upwork.com/resources/how-to-find-your-niche", task: "Document all processes" }
      ]
    }
  },

  uni: {
    id: "uni",
    name: "University CS Support",
    icon: "🏫",
    description: "Excel in your computer science degree",
    categories: {
      cs_student: {
        name: "CS Student",
        description: "Master computer science fundamentals",
        skills: ["Programming", "Data Structures", "Algorithms", "Mathematics", "Problem Solving"],
        tools: ["LeetCode", "GitHub", "Overleaf", "Anki", "Discord"],
        earningMethods: [
          { type: "internship", title: "Tech Internships", companies: ["FAANG", "Startups"], avgSalary: "$5k-10k/month" },
          { type: "freelance", title: "Part-time Freelancing", platforms: ["Upwork", "Campus"], avgRate: "$20-50/hr" },
          { type: "research", title: "Research Assistant", universities: ["Your University"], avgRate: "$15-30/hr" }
        ]
      },
      career_starter: {
        name: "Career Starter",
        description: "Transition from student to professional",
        skills: ["Resume Writing", "Interviewing", "Networking", "Personal Branding", "Job Search"],
        tools: ["LinkedIn", "Levels.fyi", "Pramp", "Glassdoor", "AngelList"],
        earningMethods: [
          { type: "job", title: "New Grad Roles", companies: ["Tech Companies"], avgSalary: "$70k-150k" },
          { type: "startup", title: "Join a Startup", companies: ["Early-stage"], avgSalary: "$60k-120k + equity" }
        ]
      }
    },
    roadmaps: {
      beginner: [
        { name: "Programming Fundamentals", why: "The foundation of everything", time: "20-30 hours", resource: "CS50", resourceUrl: "https://cs50.harvard.edu/x/", task: "Complete all problem sets" },
        { name: "Data Structures", why: "Write efficient code", time: "30-40 hours", resource: "Visualgo", resourceUrl: "https://visualgo.net/en", task: "Implement all basic data structures" },
        { name: "Algorithms", why: "Solve problems efficiently", time: "40-50 hours", resource: "Algorithms Specialization", resourceUrl: "https://visualgo.net/en", task: "Solve 100 LeetCode problems" },
        { name: "Version Control", why: "Collaborate like a pro", time: "5-8 hours", resource: "GitHub Learning", resourceUrl: "https://learngitbranching.js.org/", task: "Contribute to open source" },
        { name: "Build Projects", why: "Apply what you learn", time: "Ongoing", resource: "Build Your Own X", resourceUrl: "https://www.freecodecamp.org/", task: "Create a portfolio project" }
      ],
      intermediate: [
        { name: "System Design", why: "Design scalable systems", time: "30-40 hours", resource: "System Design Primer", resourceUrl: "https://github.com/donnemartin/system-design-primer", task: "Design Twitter" },
        { name: "Advanced Algorithms", why: "Ace technical interviews", time: "40-60 hours", resource: "CLRS", resourceUrl: "https://visualgo.net/en", task: "Solve 200+ LeetCode problems" },
        { name: "Open Source", why: "Learn from real codebases", time: "Ongoing", resource: "First Timers Only", resourceUrl: "https://learngitbranching.js.org/", task: "Make 5 open source contributions" },
        { name: "Internship Hunt", why: "Get real-world experience", time: "20-30 hours", resource: "Internship Guide", resourceUrl: "https://www.freecodecamp.org/", task: "Apply to 50+ internships" }
      ],
      advanced: [
        { name: "Specialization", why: "Become an expert", time: "Ongoing", resource: "Advanced Courses", resourceUrl: "https://www.freecodecamp.org/", task: "Complete a capstone project" },
        { name: "Interview Prep", why: "Land your dream job", time: "60-80 hours", resource: "Cracking the Coding Interview", resourceUrl: "https://visualgo.net/en", task: "Mock interviews weekly" },
        { name: "Networking", why: "Opportunities come from people", time: "Ongoing", resource: "Networking Guide", resourceUrl: "https://www.freecodecamp.org/", task: "Connect with 100+ professionals" },
        { name: "Job Search Strategy", why: "Maximize your options", time: "20-30 hours", resource: "Job Search Guide", resourceUrl: "https://www.freecodecamp.org/", task: "Apply to 100+ positions" }
      ]
    }
  }
};

/**
 * Get all career path IDs
 */
export function getCareerPathIds() {
  return Object.keys(CAREER_PATHS);
}

/**
 * Get a career path by ID
 */
export function getCareerPath(id) {
  return CAREER_PATHS[id] || null;
}

/**
 * Get all career paths
 */
export function getAllCareerPaths() {
  return Object.values(CAREER_PATHS).map(path => ({
    id: path.id,
    name: path.name,
    icon: path.icon,
    description: path.description
  }));
}

/**
 * Get categories for a career path
 */
export function getCategories(careerId) {
  const path = CAREER_PATHS[careerId];
  if (!path || !path.categories) return [];
  return Object.entries(path.categories).map(([key, value]) => ({
    id: key,
    ...value
  }));
}

/**
 * Get a specific category
 */
export function getCategory(careerId, categoryId) {
  const path = CAREER_PATHS[careerId];
  if (!path || !path.categories) return null;
  return path.categories[categoryId] || null;
}

/**
 * Get roadmap for a career path
 */
export function getRoadmap(careerId, level = "beginner") {
  const path = CAREER_PATHS[careerId];
  if (!path || !path.roadmaps) return [];
  return path.roadmaps[level] || path.roadmaps.beginner || [];
}

/**
 * Get earning methods for a category
 */
export function getEarningMethods(careerId, categoryId) {
  const category = getCategory(careerId, categoryId);
  if (!category || !category.earningMethods) return [];
  return category.earningMethods;
}

export default CAREER_PATHS;
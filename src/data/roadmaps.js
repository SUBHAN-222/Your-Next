/**
 * Roadmap data for different career paths
 * Each path contains exactly 9 steps total (3 days of 3 steps each)
 * with complete fields: name, why, whyMatters, time, resourceTitle, resourceUrl, task
 */

import { getAnswerByQuestionId } from './questions'

export function generateRoadmapData(answers) {
  const interest = getAnswerByQuestionId(answers, 'q_direction') || 'web'

  if (interest === 'ai') {
    return {
      field: 'AI & Machine Learning',
      futurePath: [
        'Computer Basics',
        'Python Basics',
        'Mini Projects',
        'AI Concepts',
        'Prompting',
        'API Connect',
        'AI Builder'
      ],
      steps: [
        // DAY 1 — Foundation
        {
          name: 'Get comfortable with how computers think.',
          why: 'Before writing AI code, you need to understand the simple logic computers use to solve problems.',
          whyMatters:
            "Most people skip this and feel lost later. Understanding files, the terminal, and logic gates makes you a 'natural' at everything else.",
          time: '⏱️ 30 mins',
          resourceTitle: 'Harvard CS50 - Week 0',
          resourceUrl: 'https://cs50.harvard.edu/x/2024/weeks/0/',
          task:
            'Watch the first 20 minutes of CS50. Just notice how complex problems are broken into small, simple steps.'
        },
        {
          name: 'Start with Python — the native language of AI.',
          why: 'Python is readable, friendly, and used by every major AI company in the world.',
          whyMatters:
            "You don't need to be a math genius. Python reads almost like English. Once you can write 5 lines of code, you're officially a programmer.",
          time: '⏱️ 45 mins',
          resourceTitle: 'Kaggle Python for Beginners',
          resourceUrl: 'https://www.learnpython.org',
          task:
            "Create a variable with your name and print it. If it shows up on the screen, you've just successfully communicated with a machine."
        },
        {
          name: 'Master Python data structures — lists, dictionaries, and loops.',
          why: 'AI models process collections of numbers and text stored in data structures.',
          whyMatters:
            'Without solid data handling, you cannot clean inputs or interpret AI predictions.',
          time: '⏱️ 45 mins',
          resourceTitle: 'Python Data Structures',
          resourceUrl: 'https://docs.python.org/3/tutorial/datastructures.html',
          task:
            'Create a list of 5 items and use a loop to print each item with its index.'
        },

        // DAY 2 — Practice
        {
          name: 'Build a tiny project that actually works.',
          why: 'The best way to learn is by making something. A simple calculator or guessing game builds real confidence.',
          whyMatters:
            "Small wins create big momentum. When you build a tool that solves a problem (even a tiny one), you realize: 'I can actually do this.'",
          time: '⏱️ 1 hour',
          resourceTitle: 'Tiny Python Projects',
          resourceUrl: 'https://www.freecodecamp.org/news/python-projects-for-beginners/',
          task:
            "Build a 'Number Guessing Game' where the computer picks a number and you try to guess it. It's only 10 lines of code!"
        },
        {
          name: 'Demystify AI — Input, Output, and Patterns.',
          why: "AI isn't magic. It's a system that looks for patterns in data to predict the next best answer.",
          whyMatters:
            "Removing the 'mystery' makes AI less intimidating. When you understand that it's just advanced pattern matching, you can use it better.",
          time: '⏱️ 30 mins',
          resourceTitle: 'How AI Works (Simple Guide)',
          resourceUrl: 'https://www.youtube.com/watch?v=2ePf9rue1Ao',
          task:
            'Explain to a friend (or a rubber duck) what a model is in your own words. If you can explain it, you own it.'
        },
        {
          name: 'Send your first prompt to AI — an emotional milestone.',
          why: "Before building AI apps, you need to master the art of 'Prompt Engineering.'",
          whyMatters:
            'You are now talking to a digital brain. Learning how to ask the right questions is a superpower. You just made AI respond for the first time!',
          time: '⏱️ 45 mins',
          resourceTitle: 'OpenAI Prompting Guide',
          resourceUrl: 'https://learnprompting.org/docs/intro',
          task:
            'Ask ChatGPT to explain a complex topic using only emojis. Notice how changing your prompt changes the AI personality.'
        },

        // DAY 3 — Portfolio / Project
        {
          name: 'Link your code to a real brain (AI API).',
          why: 'This is where you move from using a website to building your own custom AI tools.',
          whyMatters:
            'Connecting an API is the bridge to the professional world. Most beginners never reach this stage — you are now building real AI software.',
          time: '⏱️ 1.5 hours',
          resourceTitle: 'OpenAI API Quickstart',
          resourceUrl: 'https://platform.openai.com/docs/quickstart',
          task:
            "Get an API key and send a simple 'Hello' request from your Python script. When the AI replies to your code, you've arrived."
        },
        {
          name: 'Create your first AI-powered tool.',
          why: 'Combine your Python skills with the AI\'s brain to build something unique.',
          whyMatters:
            "You aren't just learning anymore — you are a creator. Whether it's a personalized study assistant or a joke generator, you've built something real.",
          time: '⏱️ 2 hours',
          resourceTitle: 'Build a Simple AI Chatbot',
          resourceUrl: 'https://realpython.com/build-a-chatbot-python-openai/',
          task:
            "Build a 'Mentor Bot' that takes any problem you have and gives you one encouraging step to solve it. You are now an AI Builder."
        },
        {
          name: 'Deploy your AI assistant with a simple Streamlit interface.',
          why: 'Streamlit lets you turn Python AI scripts into interactive web apps in minutes.',
          whyMatters:
            'Giving your AI script a visual web interface makes it usable by non-technical people.',
          time: '⏱️ 1.5 hours',
          resourceTitle: 'Streamlit Quickstart',
          resourceUrl: 'https://docs.streamlit.io/get-started',
          task:
            'Wrap your AI script in a Streamlit app with an input text box and a Submit button.'
        }
      ]
    }
  }

  if (interest === 'web') {
    return {
      field: 'Web Development',
      futurePath: [
        'Beginner',
        'HTML/CSS',
        'JavaScript',
        'React Developer',
        'Freelance/Remote Opportunities'
      ],
      steps: [
        // DAY 1 — Foundation
        {
          name: 'Start with HTML today — structure first, perfection later.',
          why: 'HTML is the foundation. Everything you build will sit on top of this.',
          whyMatters:
            'You cannot skip this. Every website ever made uses HTML. The good news: it takes one day to understand the basics.',
          time: '⏱️ 30 mins',
          resourceTitle: 'The Odin Project — HTML Foundations',
          resourceUrl: 'https://www.theodinproject.com/paths/foundations/courses/foundations',
          task:
            'Build a simple personal page with your name, a short bio, and one link. No styling yet — just structure.'
        },
        {
          name: 'Make it look good with CSS — one property at a time.',
          why: 'This is where your page transforms from plain text into something visual.',
          whyMatters:
            'CSS confidence directly determines how professional your work looks. Employers and clients judge UI first. Build this skill early.',
          time: '⏱️ 45 mins',
          resourceTitle: 'W3Schools CSS Tutorial',
          resourceUrl: 'https://www.w3schools.com/css/',
          task:
            'Style your personal page: change fonts, colors, and add padding. Make it look like something you would show someone.'
        },
        {
          name: 'Add life with JavaScript — make things react to clicks.',
          why: 'Static pages are brochures. JavaScript turns them into experiences.',
          whyMatters:
            'JavaScript is the most in-demand skill in web development. Starting here puts you on the path to jobs, freelance, and your own products.',
          time: '⏱️ 1 hour',
          resourceTitle: 'MDN JavaScript Basics',
          resourceUrl:
            'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics',
          task:
            'Add a button to your page that changes the background color when clicked. That is real interactivity.'
        },

        // DAY 2 — Building on Basics
        {
          name: 'Master Flexbox and responsive layouts.',
          why: 'Modern websites must adapt seamlessly to screens from mobile phones to 4K monitors.',
          whyMatters:
            'Over 60% of web traffic is mobile. If your layout breaks on phone screens, users leave instantly.',
          time: '⏱️ 1 hour',
          resourceTitle: 'Flexbox Froggy',
          resourceUrl: 'https://flexboxfroggy.com/',
          task:
            'Complete all 24 levels of Flexbox Froggy to master CSS alignment.'
        },
        {
          name: 'Understand DOM manipulation and events in JavaScript.',
          why: 'The DOM is how JavaScript reads, updates, and creates HTML elements on the fly.',
          whyMatters:
            'Dynamic web apps rely on DOM manipulation to render data without refreshing the page.',
          time: '⏱️ 1.5 hours',
          resourceTitle: 'MDN Manipulating Documents',
          resourceUrl: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents',
          task:
            'Build a mini counter app with + and - buttons that update a number on screen.'
        },
        {
          name: 'Fetch real data from public APIs using JavaScript.',
          why: 'Real web apps display live information from servers rather than hardcoded text.',
          whyMatters:
            'Connecting frontend UI to backend APIs is the core job of a web developer.',
          time: '⏱️ 1.5 hours',
          resourceTitle: 'JavaScript Fetch API Guide',
          resourceUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch',
          task:
            'Fetch a random joke or quote from a free public API and render it on your webpage when a button is clicked.'
        },

        // DAY 3 — First Real Project
        {
          name: 'Introduction to Git and GitHub for version control.',
          why: 'Git saves snapshots of your code and lets you collaborate with developers worldwide.',
          whyMatters:
            'Every software team expects you to use Git. It protects your code from accidental loss.',
          time: '⏱️ 1 hour',
          resourceTitle: 'Learn Git Branching',
          resourceUrl: 'https://learngitbranching.js.org/',
          task:
            'Initialize a local git repository, commit your code, and push it to a new GitHub repo.'
        },
        {
          name: 'Build a complete interactive Todo Web App.',
          why: 'The Todo app is the classic benchmark project that combines layout, state, and user interaction.',
          whyMatters:
            'Building a functional CRUD app (Create, Read, Update, Delete) proves you can handle frontend application logic.',
          time: '⏱️ 2 hours',
          resourceTitle: 'Build a Vanilla JS Todo App',
          resourceUrl: 'https://www.freecodecamp.org/news/how-to-build-a-todo-list-app-with-javascript/',
          task:
            'Build an app where users can add tasks, mark them complete, and delete completed tasks.'
        },
        {
          name: 'Deploy your project live on Vercel or Netlify.',
          why: "A web app isn't finished until it has a live public URL anyone can visit.",
          whyMatters:
            'Sharing a live link in your portfolio or resume instantly proves your technical ability.',
          time: '⏱️ 45 mins',
          resourceTitle: 'Vercel Deployment Guide',
          resourceUrl: 'https://vercel.com/docs',
          task:
            'Deploy your Todo App onto Vercel or Netlify and share the live URL with a friend.'
        }
      ]
    }
  }

  if (interest === 'mobile') {
    return {
      field: 'Mobile App Development',
      futurePath: [
        'App Concept',
        'Framework Learner',
        'First App',
        'Play Store Publisher',
        'Senior App Dev'
      ],
      steps: [
        // DAY 1 — Foundation
        {
          name: 'Sketch your first app idea — on paper.',
          why: 'Before touching code, understand what you want to build and how screens connect.',
          whyMatters:
            'Most developers fail because they code before thinking. A 10-minute sketch saves 10 hours of confusion.',
          time: '⏱️ 20 mins',
          resourceTitle: 'UI/UX Design Basics',
          resourceUrl: 'https://www.interaction-design.org/literature/topics/ui-design',
          task:
            'Draw 3 app screens on paper: a home screen, a detail screen, and a profile screen.'
        },
        {
          name: 'Pick React Native — the fastest path to a real app.',
          why: 'One codebase for iOS and Android. Used by Facebook, Shopify, and thousands of startups.',
          whyMatters:
            "Choosing one framework and committing to it is more important than picking the 'best' one. React Native has the largest community and job market.",
          time: '⏱️ 30 mins',
          resourceTitle: 'React Native Getting Started',
          resourceUrl: 'https://reactnative.dev/docs/getting-started',
          task:
            'Set up your dev environment and get a blank app running on your phone or emulator.'
        },
        {
          name: 'Understand JSX and core UI layout in React Native.',
          why: 'React Native uses View, Text, and Image components to structure native mobile screens.',
          whyMatters:
            'Learning the core building blocks lets you layout any app screen effortlessly.',
          time: '⏱️ 45 mins',
          resourceTitle: 'React Native Core Components',
          resourceUrl: 'https://reactnative.dev/docs/components-and-apis',
          task:
            'Create a screen with a profile picture, name, bio, and 2 action buttons.'
        },

        // DAY 2 — Building on Basics
        {
          name: 'Build your first real screen — not just Hello World.',
          why: 'A working UI builds more confidence than any tutorial ever could.',
          whyMatters:
            'Publishing something real — even a simple screen — separates you from 90% of beginners who only watch videos.',
          time: '⏱️ 2 hours',
          resourceTitle: 'React Native Components Guide',
          resourceUrl: 'https://reactnative.dev/docs/components-and-apis',
          task:
            'Build a login screen with an email field, password field, and a styled login button.'
        },
        {
          name: 'Manage state with useState to handle user interaction.',
          why: 'Apps need to store and update dynamic data like form entries and button clicks.',
          whyMatters:
            'State management is what makes mobile screens interactive and responsive.',
          time: '⏱️ 1 hour',
          resourceTitle: 'React State Hook',
          resourceUrl: 'https://react.dev/reference/react/useState',
          task:
            'Add a Like counter button to your profile screen that increments when tapped.'
        },
        {
          name: 'Fetch and display external API data in a mobile list.',
          why: 'Mobile apps fetch news, feeds, and weather data from remote servers.',
          whyMatters:
            'FlatList rendering connected to API calls powers almost every app feed.',
          time: '⏱️ 1.5 hours',
          resourceTitle: 'React Native FlatList Guide',
          resourceUrl: 'https://reactnative.dev/docs/flatlist',
          task:
            'Fetch a list of 5 users or items from an API and display them inside a scrollable FlatList.'
        },

        // DAY 3 — First Real Project
        {
          name: 'Add navigation between multiple screens using React Navigation.',
          why: 'Real apps have multiple screens (Home, Details, Settings) linked together.',
          whyMatters:
            'Smooth screen transitions give your app a native feel.',
          time: '⏱️ 1.5 hours',
          resourceTitle: 'React Navigation Getting Started',
          resourceUrl: 'https://reactnavigation.org/docs/getting-started/',
          task:
            'Set up a Stack Navigator to move from a Feed screen to a Item Detail screen.'
        },
        {
          name: 'Build a complete Weather or Task Mobile App.',
          why: 'Combine UI layout, state, API data, and navigation into one complete application.',
          whyMatters:
            'Completing an end-to-end app gives you a portfolio project to showcase on GitHub.',
          time: '⏱️ 2 hours',
          resourceTitle: 'Build a React Native Weather App',
          resourceUrl: 'https://reactnative.dev/',
          task:
            'Build an app that lets users search a city name and view current weather details.'
        },
        {
          name: 'Test your app on a physical device with Expo Go.',
          why: 'Seeing your code run on your actual smartphone is an unforgettable feeling.',
          whyMatters:
            'Testing on real hardware reveals touch feel, screen sizes, and performance.',
          time: '⏱️ 45 mins',
          resourceTitle: 'Expo Go Quickstart',
          resourceUrl: 'https://docs.expo.dev/get-started/expo-go/',
          task:
            'Scan the Expo QR code on your terminal and run your app on your personal phone.'
        }
      ]
    }
  }

  if (interest === 'cyber') {
    return {
      field: 'Cyber Security',
      futurePath: [
        'Beginner',
        'Networking Basics',
        'Security Fundamentals',
        'Ethical Hacking',
        'Security Analyst'
      ],
      steps: [
        // DAY 1 — Foundation
        {
          name: 'Understand how networks actually work.',
          why: 'Hacking and defending systems both require understanding how computers talk to each other.',
          whyMatters:
            'Every security attack exploits a network weakness. You cannot protect or attack what you do not understand.',
          time: '⏱️ 1 hour',
          resourceTitle: 'TryHackMe Pre-Security Path',
          resourceUrl: 'https://tryhackme.com/path/outline/presecurity',
          task:
            'Learn what an IP address, a port, and a protocol are. Write a one-line definition of each.'
        },
        {
          name: "Get comfortable in Linux — the hacker's OS.",
          why: 'Almost every security tool runs on Linux. The terminal is your new home.',
          whyMatters:
            'Security professionals live in the terminal. The faster you get comfortable here, the faster everything else clicks.',
          time: '⏱️ 1 hour',
          resourceTitle: 'Linux Journey (free)',
          resourceUrl: 'https://linuxjourney.com/',
          task:
            'Navigate folders, create a file, and read it — all from the terminal. No clicking allowed.'
        },
        {
          name: 'Master essential Linux command line utilities.',
          why: 'Power utilities like grep, find, and permissions are essential for auditing Linux servers.',
          whyMatters:
            'Real security investigations happen inside server logs using CLI search tools.',
          time: '⏱️ 1 hour',
          resourceTitle: 'Linux Command Line Basics',
          resourceUrl: 'https://linuxjourney.com/',
          task:
            'Use grep to search for a keyword inside a 100-line text file in the terminal.'
        },

        // DAY 2 — Building on Basics
        {
          name: 'Learn web security fundamentals & OWASP Top 10.',
          why: 'Web applications are the #1 attack target for modern cyber breaches.',
          whyMatters:
            'Understanding vulnerabilities like SQL Injection and XSS is required for red/blue teaming.',
          time: '⏱️ 1.5 hours',
          resourceTitle: 'OWASP Top 10 Web Vulnerabilities',
          resourceUrl: 'https://owasp.org/www-project-top-ten/',
          task:
            'Read about SQL Injection and explain in one sentence how unsanitized input causes a breach.'
        },
        {
          name: 'Analyze network traffic with Wireshark.',
          why: 'Wireshark lets you inspect packets traveling across a network in real time.',
          whyMatters:
            'Packet analysis is how security analysts spot unauthorized data exfiltration.',
          time: '⏱️ 1.5 hours',
          resourceTitle: 'Wireshark Starter Guide',
          resourceUrl: 'https://www.wireshark.org/docs/',
          task:
            'Open a sample PCAP file in Wireshark and filter for HTTP traffic.'
        },
        {
          name: 'Write a basic network scanner in Python.',
          why: 'Scripting custom security tools gives you complete control during audits.',
          whyMatters:
            'Building your own port scanner teaches you how socket connections work at the TCP level.',
          time: '⏱️ 1.5 hours',
          resourceTitle: 'Python Socket Programming',
          resourceUrl: 'https://docs.python.org/3/library/socket.html',
          task:
            'Write a 15-line Python script that tests if port 80 is open on a target server.'
        },

        // DAY 3 — First Real Project
        {
          name: 'Complete your first hands-on security lab.',
          why: 'Reading about security does nothing. You learn by doing.',
          whyMatters:
            'CTF challenges and labs are how security professionals practice. Your first completed room is the start of a real portfolio.',
          time: '⏱️ 2 hours',
          resourceTitle: 'TryHackMe — Complete Beginner Room',
          resourceUrl: 'https://tryhackme.com/room/startingoutincybersec',
          task:
            "Complete the 'Starting Out in Cyber Sec' room on TryHackMe and earn your first badge."
        },
        {
          name: 'Perform an ethical vulnerability assessment on a CTF machine.',
          why: 'CTF (Capture The Flag) labs simulate real-world penetration testing scenarios safely.',
          whyMatters:
            'Solving CTF challenges proves you can discover and document security flaws.',
          time: '⏱️ 2 hours',
          resourceTitle: 'TryHackMe — Junior Penetration Tester',
          resourceUrl: 'https://tryhackme.com/',
          task:
            'Find and capture the flag hidden inside a vulnerable web server room on TryHackMe.'
        },
        {
          name: 'Write a professional security audit report.',
          why: 'Security professionals must communicate findings clearly to business stakeholders.',
          whyMatters:
            'A vulnerability is useless unless executives understand how to fix it.',
          time: '⏱️ 1 hour',
          resourceTitle: 'Cyber Security Reporting Best Practices',
          resourceUrl: 'https://tryhackme.com/',
          task:
            'Write a 1-page report detailing the vulnerability found in your CTF lab with remediation steps.'
        }
      ]
    }
  }

  if (interest === 'data') {
    return {
      field: 'Data Science',
      futurePath: [
        'Data Concepts',
        'Spreadsheets',
        'Organizing',
        'Python Script',
        'Python Basics',
        'Pandas',
        'Insights',
        'Data Builder'
      ],
      steps: [
        // DAY 1 — Foundation
        {
          name: 'Understand what data actually is — The Pattern Hunter.',
          why: "Data isn't just numbers; it's information about the world. Every pattern you find tells a story.",
          whyMatters:
            "Most people jump into tools. But the best data scientists are the ones who can see the 'why' behind the numbers. You're training your brain to spot patterns.",
          time: '⏱️ 30 mins',
          resourceTitle: 'What is Data Science? (Beginner Guide)',
          resourceUrl: 'https://www.youtube.com/watch?v=X3paOmcrTjQ',
          task:
            'Look at your last 5 bank transactions or your last 5 phone apps used. What story do those 5 data points tell about your day?'
        },
        {
          name: 'Explore data visually in spreadsheets.',
          why: 'Spreadsheets are the perfect starting point because you can actually SEE the data you are working with.',
          whyMatters:
            'Building visual intuition for tables, rows, and columns now makes coding much easier later. You will learn sorting and filtering in a way that just clicks.',
          time: '⏱️ 45 mins',
          resourceTitle: 'Google Sheets for Beginners',
          resourceUrl: 'https://workspace.google.com/products/sheets/',
          task:
            'Create a sheet with 5 of your favorite movies, their year, and their rating. Sort them by year. You have just performed data organization.'
        },
        {
          name: 'Organize simple datasets like a pro.',
          why: 'Clean data is the secret to great insights. Learn how to structure information so a computer can read it.',
          whyMatters:
            'If your data is messy, your results will be wrong. Learning how to organize information into clean rows and columns is 80% of the job.',
          time: '⏱️ 30 mins',
          resourceTitle: 'Data Cleaning Basics',
          resourceUrl: 'https://www.tableau.com/learn/articles/what-is-data-cleaning',
          task:
            'Take your movie list and make sure every Rating column has the same format (e.g., 8/10). No missing values allowed!'
        },

        // DAY 2 — Building on Basics
        {
          name: 'Write your first Python script — The Transition.',
          why: "Python helps you automate your analysis. It's like having a spreadsheet that can think for itself.",
          whyMatters:
            "Do not be intimidated by 'code.' It's just a way to talk to the computer. Python is the world's most popular language for data for a reason.",
          time: '⏱️ 45 mins',
          resourceTitle: 'Python for Data Science (Kaggle)',
          resourceUrl: 'https://www.learnpython.org',
          task:
            "Write a 1-line script: print('My first data script is running!'). If you see that text, you have just unlocked automation."
        },
        {
          name: 'Learn Python Basics for automation.',
          why: 'Master the simple tools that let you handle thousands of data points in seconds.',
          whyMatters:
            "Variables and loops are like the 'copy-paste' of the coding world, but much faster. You're building the foundation for real power.",
          time: '⏱️ 1 hour',
          resourceTitle: 'Variables and Lists in Python',
          resourceUrl: 'https://www.w3schools.com/python/python_variables.asp',
          task:
            'Create a list in Python of 5 numbers and find the average. You are doing math at the speed of light.'
        },
        {
          name: 'Use Pandas to explore and clean real datasets.',
          why: "Pandas gives you 'spreadsheet superpowers' inside your code. It's the #1 tool for data scientists.",
          whyMatters:
            'Handling 1,000,000 rows in a spreadsheet is impossible. Doing it in Pandas takes one second. This is where you become truly professional.',
          time: '⏱️ 1.5 hours',
          resourceTitle: 'Pandas Quickstart Guide',
          resourceUrl: 'https://pandas.pydata.org/docs/getting_started/index.html',
          task:
            'Load a small CSV file (like a list of cities) into Python using Pandas and print the first 5 rows.'
        },

        // DAY 3 — First Real Project
        {
          name: 'Create charts and find real insights with Seaborn.',
          why: "People don't want to see numbers; they want to see the story. Charts make your data come alive.",
          whyMatters:
            'A great chart can change a business decision. You are learning how to turn raw numbers into clear, visual proof.',
          time: '⏱️ 1 hour',
          resourceTitle: 'Data Visualization for Beginners',
          resourceUrl: 'https://www.kaggle.com/learn/data-visualization',
          task:
            'Create a simple bar chart of your movie ratings list. Seeing the highest bar is your first visual insight.'
        },
        {
          name: 'Build your first mini data project on Kaggle.',
          why: 'Put everything together. Take a raw dataset and tell its story from start to finish.',
          whyMatters:
            "Building a project from scratch proves you aren't just 'learning' — you're performing. You now have a real data skill you can show the world.",
          time: '⏱️ 2 hours',
          resourceTitle: 'Beginner Data Project Ideas',
          resourceUrl: 'https://www.freecodecamp.org/news/data-science-project-ideas/',
          task:
            'Find a dataset about something you love (sports, music, weather) and find the top 3 most common items in it.'
        },
        {
          name: 'Present your data story with a clean notebook dashboard.',
          why: 'Data storytelling turns technical analysis into clear business decisions.',
          whyMatters:
            'Stakeholders care about key takeaways and recommendations, not raw code.',
          time: '⏱️ 1.5 hours',
          resourceTitle: 'Jupyter Notebook Storytelling',
          resourceUrl: 'https://www.kaggle.com/learn',
          task:
            'Combine markdown text, key metrics, and 2 visual charts into a clean public Jupyter Notebook.'
        }
      ]
    }
  }

  if (interest === 'freelance') {
    return {
      field: 'Freelancing & Earning',
      futurePath: [
        'Service Unclear',
        'Niche Defined',
        'First Profile',
        'First Client',
        'Sustainable Freedom'
      ],
      steps: [
        // DAY 1 — Foundation
        {
          name: 'Get clear on exactly what you offer — one thing only.',
          why: 'Vague freelancers get no clients. Specific freelancers get hired immediately.',
          whyMatters:
            "Clients don't hire generalists. They hire the person who solves their exact problem. Your clarity is your competitive advantage.",
          time: '⏱️ 30 mins',
          resourceTitle: 'How to Find Your Niche — Upwork Guide',
          resourceUrl: 'https://www.upwork.com/resources/how-to-find-your-niche',
          task:
            "Write one sentence: 'I help [who] with [what] so they can [result].' Make it specific."
        },
        {
          name: 'Build a profile that makes clients say yes.',
          why: 'Your profile is your storefront. Most freelancers get rejected here before saying a word.',
          whyMatters:
            'A strong profile works for you 24/7. Spend time here. It is the highest-leverage activity in freelancing.',
          time: '⏱️ 1 hour',
          resourceTitle: 'Upwork Profile Optimization Guide',
          resourceUrl:
            'https://www.upwork.com/resources/how-to-create-a-profile-that-stands-out',
          task:
            'Write your Upwork bio. Include who you help, what you do, and one specific result you can deliver.'
        },
        {
          name: 'Create 3 sample work proof pieces for your portfolio.',
          why: 'Clients hire based on proof of work, not promises or certificates.',
          whyMatters:
            'Having 3 crisp portfolio samples immediately builds trust with potential clients.',
          time: '⏱️ 1.5 hours',
          resourceTitle: 'Building a Freelance Portfolio',
          resourceUrl: 'https://www.upwork.com/resources/how-to-create-a-profile-that-stands-out',
          task:
            'Create 3 sample work pieces relevant to your niche and save them as PDFs or live links.'
        },

        // DAY 2 — Building on Basics
        {
          name: 'Send your first proposal — even if it feels scary.',
          why: 'You will not get hired without applying. Imperfect action beats perfect inaction.',
          whyMatters:
            "Most beginners wait until they feel 'ready.' That day never comes. One proposal sent today is worth more than 100 planned for later.",
          time: '⏱️ 45 mins',
          resourceTitle: 'Writing Winning Proposals',
          resourceUrl: 'https://www.upwork.com/resources/how-to-write-a-cover-letter',
          task:
            'Find one job that matches your skill. Send a personalized proposal that references their specific problem.'
        },
        {
          name: 'Master the art of client discovery and communication.',
          why: 'Asking the right questions upfront prevents client misunderstandings and scope creep.',
          whyMatters:
            'Clear communication converts leads into high-paying long-term clients.',
          time: '⏱️ 1 hour',
          resourceTitle: 'Client Communication Essentials',
          resourceUrl: 'https://www.upwork.com/resources/how-to-write-a-cover-letter',
          task:
            'Draft a 5-question discovery checklist to send prospective clients before starting work.'
        },
        {
          name: 'Calculate your profitable freelance hourly and project rates.',
          why: 'Underpricing leads to burnout. You need a formula to price for profitability.',
          whyMatters:
            'Pricing strategically reflects quality and earns you a sustainable living.',
          time: '⏱️ 45 mins',
          resourceTitle: 'Freelance Rate Calculator Guide',
          resourceUrl: 'https://www.upwork.com/resources/how-to-find-your-niche',
          task:
            'Calculate your target monthly income, expenses, and set your minimum hourly rate.'
        },

        // DAY 3 — First Real Project
        {
          name: 'Land and onboard your first test or mini client.',
          why: 'Executing a real paid or test gig builds your confidence and generates your first review.',
          whyMatters:
            'A 5-star review on your profile makes landing future clients 5x easier.',
          time: '⏱️ 2 hours',
          resourceTitle: 'Onboarding Freelance Clients',
          resourceUrl: 'https://www.upwork.com/resources/how-to-create-a-profile-that-stands-out',
          task:
            'Complete a mini task for a client or friend, deliver on time, and ask for a 2-sentence testimonial.'
        },
        {
          name: 'Set up a professional invoice and payment system.',
          why: 'Getting paid smoothly requires clear contracts, invoicing, and payment methods.',
          whyMatters:
            'Professional billing ensures you get paid reliably without delays.',
          time: '⏱️ 45 mins',
          resourceTitle: 'Invoicing & Payment Tools for Freelancers',
          resourceUrl: 'https://www.upwork.com/resources/how-to-find-your-niche',
          task:
            'Create an invoice template on Wise, Payoneer, or Wave with terms and payment links.'
        },
        {
          name: 'Build a client referral engine for continuous work.',
          why: 'Repeat clients and referrals require 90% less effort than cold pitching.',
          whyMatters:
            'Turning satisfied clients into advocates creates a steady flow of income.',
          time: '⏱️ 45 mins',
          resourceTitle: 'How to Get Repeat Freelance Clients',
          resourceUrl: 'https://www.upwork.com/resources/how-to-find-your-niche',
          task:
            'Send a polite follow-up message to a past contact asking if they need support or know anyone who does.'
        }
      ]
    }
  }

  if (interest === 'design') {
    return {
      field: 'Product Design (UI/UX)',
      futurePath: [
        'Beginner',
        'UI Design',
        'Figma Projects',
        'UX Thinking',
        'Product Designer'
      ],
      steps: [
        // DAY 1 — Foundation
        {
          name: 'Master the fundamentals of UI design — space, color, and type.',
          why: "Design is not about 'making things pretty.' It is about clarity and usability.",
          whyMatters:
            'Great design is invisible. When you understand the rules of hierarchy and balance, your work immediately looks professional.',
          time: '⏱️ 45 mins',
          resourceTitle: 'UI Design Fundamentals',
          resourceUrl: 'https://www.interaction-design.org/literature/topics/ui-design',
          task:
            'Find 3 websites you like. List exactly why they feel good to use. Is it the spacing? The colors? The fonts?'
        },
        {
          name: 'Learn Figma — the industry standard for modern design.',
          why: 'Figma is where design happens today. It is powerful, collaborative, and free for individuals.',
          whyMatters:
            'Knowing the tool is just as important as knowing the theory. Figma proficiency is the first requirement for any design job.',
          time: '⏱️ 1 hour',
          resourceTitle: 'Figma for Beginners',
          resourceUrl: 'https://www.figma.com/resource-library/design-basics/',
          task:
            "Open Figma and create a simple 'Card' component with an image, a title, and a button."
        },
        {
          name: 'Think like a UX Designer — solve real problems.',
          why: 'A pretty UI is useless if the product is hard to use. UX is the bridge between art and utility.',
          whyMatters:
            'Companies hire Product Designers because they solve business problems. UX thinking makes you a strategic partner, not just a decorator.',
          time: '⏱️ 1.5 hours',
          resourceTitle: 'Google UX Design Course',
          resourceUrl: 'https://grow.google/certificates/ux-design/',
          task:
            'Pick a simple app you use. Sketch one way you would make the main task (like posting a photo) even easier.'
        },

        // DAY 2 — Practice
        {
          name: 'Redesign a real app screen you use daily.',
          why: 'Redesigning existing screens forces you to analyze why real products make specific layout decisions.',
          whyMatters:
            'Copying and improving real apps is the fastest way to build design muscle memory.',
          time: '⏱️ 1.5 hours',
          resourceTitle: 'Figma Mobile UI Kit',
          resourceUrl: 'https://www.figma.com/community',
          task:
            'Take a screenshot of Spotify or Instagram and recreate it pixel-for-pixel in Figma, then tweak 2 things to improve it.'
        },
        {
          name: 'Build a complete landing page in Figma.',
          why: 'Landing pages combine typography, hero sections, feature grids, and call-to-action buttons.',
          whyMatters:
            'Landing pages are the most common project clients ask freelancers to design.',
          time: '⏱️ 2 hours',
          resourceTitle: 'Landing Page Design Best Practices',
          resourceUrl: 'https://www.figma.com/resource-library/design-basics/',
          task:
            'Design a clean desktop landing page for an imaginary app with a header, hero section, 3 feature cards, and footer.'
        },
        {
          name: 'Learn design systems and reusable components.',
          why: "Professional designers don't draw every button from scratch; they build systems.",
          whyMatters:
            'Design systems allow teams to stay consistent and design 10x faster.',
          time: '⏱️ 1.5 hours',
          resourceTitle: 'Figma Components & Auto Layout',
          resourceUrl: 'https://www.figma.com/best-practices/guide-to-developer-handoff/',
          task:
            'Create a button component with primary, secondary, and hover states using Figma Auto Layout.'
        },

        // DAY 3 — Portfolio
        {
          name: 'Create your first UX case study.',
          why: 'Case studies tell the story of your design process from problem statement to final screens.',
          whyMatters:
            'Hiring managers look at case studies to see how you think, not just your final pretty pictures.',
          time: '⏱️ 2 hours',
          resourceTitle: 'How to Write a UX Case Study',
          resourceUrl: 'https://www.interaction-design.org/literature/topics/ui-design',
          task:
            'Document your process for the screen redesign: problem statement, user goal, wireframes, and final design.'
        },
        {
          name: 'Build a 3-project portfolio in Figma.',
          why: 'A structured portfolio showcases your range across landing pages, mobile apps, and design components.',
          whyMatters:
            'Your portfolio is your resume in the design world. Having 3 solid projects makes you client-ready.',
          time: '⏱️ 2.5 hours',
          resourceTitle: 'Design Portfolio Guide',
          resourceUrl: 'https://www.figma.com/resource-library/design-basics/',
          task:
            'Assemble your landing page, app redesign, and case study into a presentation board in Figma.'
        },
        {
          name: 'Share your work and get constructive feedback.',
          why: 'Design thrives on feedback. Learning to accept and apply critique is essential for growth.',
          whyMatters:
            'Putting your work out there overcomes fear of judgment and connects you with senior designers.',
          time: '⏱️ 1 hour',
          resourceTitle: 'Dribbble & Figma Community',
          resourceUrl: 'https://dribbble.com',
          task:
            'Export your portfolio frames as PNGs and post them on Twitter, LinkedIn, or Figma Community asking for feedback.'
        }
      ]
    }
  }

  if (interest === 'uni') {
    return {
      field: 'University CS Support',
      futurePath: [
        'Struggling Student',
        'Fundamentals Clear',
        'Confident Coder',
        'Project Builder',
        'Graduate Ready'
      ],
      steps: [
        // DAY 1 — Foundation
        {
          name: 'Watch CS50 Week 0 — it will change how you see everything.',
          why: 'CS50 explains computer science the way universities never do — with clarity and energy.',
          whyMatters:
            'Most university confusion comes from poor explanations, not your ability. CS50 fills those gaps in hours.',
          time: '⏱️ 1 hour',
          resourceTitle: 'CS50 by Harvard (free, world-class)',
          resourceUrl: 'https://cs50.harvard.edu/x/',
          task:
            'Watch the first lecture. Write down 3 things that confused you in class that now make sense.'
        },
        {
          name: 'Learn to read error messages — they are your teachers.',
          why: 'Every programmer debugs. The ones who improve fastest are the ones who stop fearing errors.',
          whyMatters:
            'Errors are not failures — they are instructions. Once you can read them, you become 10x faster at fixing your own code.',
          time: '⏱️ 30 mins',
          resourceTitle: 'How to Read and Fix Errors',
          resourceUrl:
            'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_went_wrong',
          task:
            'Break a simple working code on purpose, read the error, then fix it yourself without searching for the answer.'
        },
        {
          name: 'Visualize algorithms — see them move.',
          why: 'Sorting, searching, trees — these are impossible to understand just by reading.',
          whyMatters:
            'Visual understanding of algorithms makes your exams easier and your code better. This is the shortcut most students never find.',
          time: '⏱️ 1 hour',
          resourceTitle: 'VisuAlgo — Algorithm Visualizer',
          resourceUrl: 'https://visualgo.net/en',
          task:
            'Watch bubble sort and merge sort animate. Then explain the difference to yourself out loud.'
        },

        // DAY 2 — Building on Basics
        {
          name: 'Master Arrays, Linked Lists, and Memory Allocation.',
          why: 'Data structures are the foundational concepts behind memory and performance.',
          whyMatters:
            'Understanding memory layout helps you write bug-free code and pass core CS exams.',
          time: '⏱️ 1.5 hours',
          resourceTitle: 'VisuAlgo Data Structures',
          resourceUrl: 'https://visualgo.net/en',
          task:
            'Draw how a Linked List stores nodes in memory compared to a contiguous Array.'
        },
        {
          name: 'Solve your first 3 Easy LeetCode / HackerRank problems.',
          why: 'Problem solving under constraints is how tech companies evaluate CS students.',
          whyMatters:
            'Early practice with coding challenges builds confidence for technical interviews.',
          time: '⏱️ 1.5 hours',
          resourceTitle: 'LeetCode Beginner Collection',
          resourceUrl: 'https://leetcode.com/problemset/all/',
          task:
            "Solve the 'Two Sum' or 'Contains Duplicate' problem on LeetCode."
        },
        {
          name: 'Learn Git and GitHub for group assignments.',
          why: 'Group CS projects fail when team members email code back and forth.',
          whyMatters:
            'Using Git branches prevents code conflicts and prepares you for real software jobs.',
          time: '⏱️ 1 hour',
          resourceTitle: 'GitHub Student Developer Guide',
          resourceUrl: 'https://learngitbranching.js.org/',
          task:
            'Create a repository on GitHub, create a feature branch, and submit a pull request.'
        },

        // DAY 3 — First Real Project
        {
          name: 'Build a standalone C or Python semester project.',
          why: 'Building a complete software application connects theoretical lectures to practical reality.',
          whyMatters:
            'Class projects turn into portfolio highlights on your resume.',
          time: '⏱️ 2 hours',
          resourceTitle: 'CS Project Ideas for Beginners',
          resourceUrl: 'https://cs50.harvard.edu/x/',
          task:
            'Build a CLI Student Management System that adds, searches, and deletes student records.'
        },
        {
          name: 'Learn Object-Oriented Programming (OOP) principles.',
          why: 'Classes, Objects, Inheritance, and Encapsulation structure large software systems.',
          whyMatters:
            'OOP is heavily tested in university exams and used in industry codebases.',
          time: '⏱️ 1.5 hours',
          resourceTitle: 'OOP Fundamentals Guide',
          resourceUrl: 'https://www.freecodecamp.org/',
          task:
            'Create a BankAccount class with deposit, withdraw, and balance check methods.'
        },
        {
          name: 'Prepare your technical resume and GitHub showcase.',
          why: 'A strong resume highlighting projects opens doors to competitive tech internships.',
          whyMatters:
            'Recruiters look for clean GitHub links and clear project descriptions.',
          time: '⏱️ 1 hour',
          resourceTitle: 'Tech Resume Guide for CS Students',
          resourceUrl: 'https://cs50.harvard.edu/x/',
          task:
            'Format your resume with a Projects section detailing your semester project and GitHub link.'
        }
      ]
    }
  }

  // Default fallback
  return {
    field: 'Tech Journey',
    futurePath: ['Beginner', 'Learner', 'Builder', 'Developer'],
    steps: [
      {
        name: 'Start today — one step is all it takes.',
        why: 'The hardest part is starting. You have already done that.',
        whyMatters: 'Every expert was once a beginner who refused to quit.',
        time: '⏱️ 30 mins',
        resourceTitle: 'FreeCodeCamp',
        resourceUrl: 'https://www.freecodecamp.org/',
        task: 'Complete the first module. Just the first one.'
      }
    ]
  }
}
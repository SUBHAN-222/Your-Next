/**
 * Dynamic quiz questions with branching logic
 * Each question can branch based on previous answers
 */

export const TOTAL_STEPS = 7

export const QUESTION_IDS = [
  'q_stuck',
  'q_ai_help',
  'q_why_stuck',
  'q_direction',
  'q_path1',
  'q_path2',
  'q_guide_style'
]

export function getAnswerByQuestionId(answers, questionId) {
  const stepIndex = QUESTION_IDS.indexOf(questionId)
  return stepIndex >= 0 ? answers[stepIndex]?.val : undefined
}

/**
 * Get the next question based on current answers and step
 * @param {Object} answers - Object containing all previous answers
 * @param {number} currentStep - Current step index (0-5)
 * @returns {Object|null} Question object or null if quiz is complete
 */
export function getNextQuestion(answers, currentStep) {
  const stuckAnswer = getAnswerByQuestionId(answers, 'q_stuck')
  const whyStuckAnswer = getAnswerByQuestionId(answers, 'q_why_stuck')
  const directionAnswer = getAnswerByQuestionId(answers, 'q_direction')
  const path1Answer = getAnswerByQuestionId(answers, 'q_path1')

  // ── STEP 0: Always the same opening ──
  if (currentStep === 0) {
    return {
      id: "q_stuck",
      eye: "Let's understand you",
      title: "Let's figure out where you're stuck.",
      hint: "Be honest — there's no wrong answer here.",
      opts: [
        { e: "🤷", l: "I want to start but I'm not sure how", val: "no_start" },
        { e: "😵", l: "I tried learning but it feels too confusing", val: "lost" },
        { e: "📉", l: "I'm practicing but I don't feel like I'm getting better", val: "not_improving" },
        { e: "🎓", l: "I'm a university student but I don't have a clear path", val: "uni_confused" },
        { e: "💸", l: "I just want to learn a skill to make money", val: "earning" }
      ]
    }
  }

  // ── STEP 1: AI Help Question (Asked to all) ──
  if (currentStep === 1) {
    return {
      id: "q_ai_help",
      eye: "Using tools",
      title: "Tried ChatGPT or similar AI for this already?",
      hint: "This helps us understand how you currently solve problems.",
      opts: [
        { e: "🌊", l: "Yes, but it gave me too many options and I got overwhelmed", val: "ai_overwhelmed" },
        { e: "🤷", l: "Yes, but I still didn't know what to actually DO next", val: "ai_no_action" },
        { e: "👍", l: "Yes, it helped a little", val: "ai_helped_some" },
        { e: "❌", l: "No, haven't tried that yet", val: "ai_not_tried" }
      ]
    }
  }

  // ── STEP 2: Branches based on Q0 answer ──
  if (currentStep === 2) {
    if (stuckAnswer === "no_start")
      return {
        id: "q_tried",
        eye: "Starting fresh",
        title: "Have you tried anything before this?",
        hint: "Even YouTube or a free course counts.",
        opts: [
          { e: "❌", l: "No, I haven't tried anything yet", val: "never" },
          { e: "📺", l: "Yes, but I gave up quickly", val: "gave_up" },
          { e: "🔄", l: "Yes, but nothing clicked for me", val: "didnt_click" }
        ]
      }
    if (stuckAnswer === "lost")
      return {
        id: "q_lost_cause",
        eye: "Finding the block",
        title: "What's the exact moment things stopped making sense?",
        hint: "Pin down the exact moment things stopped making sense.",
        opts: [
          { e: "🌊", l: "Too much information at once", val: "overload" },
          { e: "🔗", l: "Concepts didn't connect to each other", val: "no_connection" },
          { e: "🎯", l: "I didn't know what to build or practice", val: "no_project" },
          { e: "💬", l: "The terms and jargon were confusing", val: "jargon" }
        ]
      }
    if (stuckAnswer === "not_improving")
      return {
        id: "q_how_long",
        eye: "Progress check",
        title: "How long have you been at this?",
        hint: "This helps us understand what is blocking you.",
        opts: [
          { e: "📅", l: "Less than 1 month", val: "fresh" },
          { e: "📆", l: "1 to 6 months", val: "mid" },
          { e: "🗓️", l: "More than 6 months", val: "long" }
        ]
      }
    if (stuckAnswer === "uni_confused")
      return {
        id: "q_uni_hard",
        eye: "University struggles",
        title: "What's confusing you most about university right now?",
        hint: "This will shape everything we suggest.",
        opts: [
          { e: "💻", l: "Programming — I can't write code", val: "code" },
          { e: "📐", l: "Math and theory subjects", val: "math" },
          { e: "🏗️", l: "Projects and assignments", val: "projects" },
          { e: "🗺️", l: "I don't see a career path", val: "career" }
        ]
      }
    if (stuckAnswer === "earning")
      return {
        id: "q_earn_tried",
        eye: "Earning ambition",
        title: "Have you tried making money online yet?",
        hint: "Knowing this helps us skip what does not work for you.",
        opts: [
          { e: "❌", l: "No, completely new to this", val: "never" },
          { e: "😔", l: "Yes, but got no clients or sales", val: "no_clients" },
          { e: "💰", l: "Yes, I made a little money", val: "some" }
        ]
      }
  }

  // ── STEP 3: Direction — eyebrow adapts to journey so far ──
  if (currentStep === 3) {
    let eye = "Your direction"
    let hint = "Pick the world that excites you most."
    if (stuckAnswer === "no_start" && whyStuckAnswer === "never") {
      eye = "A blank slate"
      hint = "Pick the world you want to enter."
    } else if (stuckAnswer === "lost") {
      eye = "Let's redirect you"
      hint = "Which direction do you want to go back to?"
    } else if (stuckAnswer === "not_improving") {
      eye = "Double down or pivot?"
      hint = "Pick the path you are most committed to."
    } else if (stuckAnswer === "uni_confused") {
      eye = "Beyond the classroom"
      hint = "Where do you see yourself after university?"
    } else if (stuckAnswer === "earning") {
      eye = "Pick your earning path"
      hint = "What skill do you want to monetize?"
    }
    return {
      id: "q_direction",
      eye,
      hint,
      title: "What pulls you in the most?",
      opts: [
        { e: "🌐", l: "Web & App Development", val: "web" },
        { e: "🤖", l: "AI & Machine Learning", val: "ai" },
        { e: "📊", l: "Data Science", val: "data" },
        { e: "🔒", l: "Cyber Security", val: "cyber" },
        { e: "📱", l: "Mobile App Development", val: "mobile" },
        { e: "🎨", l: "Product Design (UI/UX)", val: "design" },
        { e: "💼", l: "Freelancing & Online Earning", val: "freelance" },
        { e: "🏫", l: "University CS Subjects", val: "uni" }
      ]
    }
  }

  // ── STEP 4: First path question — branches on Q0 + Q2 ──
  if (currentStep === 4) {
    if (directionAnswer === "web" || directionAnswer === "mobile") {
      if (stuckAnswer === "not_improving")
        return {
          id: "web_stuck",
          eye: "Dev Path",
          title: "What's the part that keeps tripping you up?",
          hint: "Let's fix the exact blocker, not guess.",
          opts: [
            { e: "🎨", l: "CSS — making things look good", val: "css" },
            { e: "⚙️", l: "JavaScript logic and algorithms", val: "js" },
            { e: "🔗", l: "Connecting frontend to backend", val: "backend" },
            { e: "🤷", l: "I don't know what to build next", val: "no_project" }
          ]
        }
      if (stuckAnswer === "earning")
        return {
          id: "web_earn_goal",
          eye: "Dev Path",
          title: "How do you picture earning from this?",
          hint: "This decides your exact roadmap.",
          opts: [
            { e: "💸", l: "Freelance on Upwork/Fiverr", val: "freelance" },
            { e: "🏢", l: "Get a full-time job", val: "job" },
            { e: "🚀", l: "Build and sell my own product", val: "startup" }
          ]
        }
      return {
        id: "web_goal",
        eye: "Dev Path",
        title: "What are you really building toward?",
        hint: "Be specific — this decides your path.",
        opts: [
          { e: "💼", l: "Get a full-time job at a company", val: "job" },
          { e: "💸", l: "Work as a freelancer", val: "freelance" },
          { e: "🚀", l: "Build my own startup or product", val: "startup" }
        ]
      }
    }
    if (directionAnswer === "ai") {
      if (stuckAnswer === "earning")
        return {
          id: "ai_earn",
          eye: "AI Path",
          title: "How do you see yourself earning with AI?",
          hint: "Your answer completely changes the roadmap.",
          opts: [
            { e: "🛠️", l: "Build AI tools and sell them", val: "tools" },
            { e: "📊", l: "Automate tasks and offer services", val: "automate" },
            { e: "📚", l: "Teach or create AI content", val: "teach" }
          ]
        }
      return {
        id: "ai_why",
        eye: "AI Path",
        title: "What's pulling you toward AI?",
        hint: "Honest answer gives you the best path.",
        opts: [
          { e: "🚀", l: "I want to build the next generation of products", val: "future" },
          { e: "💼", l: "AI jobs pay very well", val: "salary" },
          { e: "🧠", l: "I find the concept genuinely fascinating", val: "fascinating" },
          { e: "💸", l: "I want to sell AI tools and earn online", val: "earn" }
        ]
      }
    }
    if (directionAnswer === "data")
      return {
        id: "data_goal",
        eye: "Data Science",
        title: "What's the pull toward data, for you?",
        hint: "Data has many career directions.",
        opts: [
          { e: "📊", l: "Finding insights and making decisions", val: "analytics" },
          { e: "🤖", l: "Building ML models and predictions", val: "ml" },
          { e: "📈", l: "Visualizing data beautifully", val: "viz" },
          { e: "💼", l: "Getting a data analyst job", val: "job" }
        ]
      }
    if (directionAnswer === "cyber")
      return {
        id: "cyber_side",
        eye: "Cyber Security",
        title: "Which side of security gets you excited?",
        hint: "Both are valid and well-paying.",
        opts: [
          { e: "🕵️", l: "Ethical hacking — finding vulnerabilities", val: "offense" },
          { e: "🛡️", l: "Defending systems and networks", val: "defense" },
          { e: "🔍", l: "Digital forensics and investigations", val: "forensics" },
          { e: "🤷", l: "I'm not sure yet", val: "curious" }
        ]
      }
    if (directionAnswer === "freelance")
      return {
        id: "free_urgency",
        eye: "Freelance Path",
        title: "How soon do you need this to pay off?",
        hint: "No judgement — this helps us prioritize correctly.",
        opts: [
          { e: "🔥", l: "I need income within weeks", val: "urgent" },
          { e: "🌱", l: "I'm building toward it steadily", val: "steady" },
          { e: "🎯", l: "I want to plan it carefully first", val: "planned" }
        ]
      }
    if (directionAnswer === 'design') return {
      id: 'design_exp', eye: "Design Path",
      title: "Where are you at with design right now?",
      hint: "This shapes your starting point completely.",
      opts: [
        { e: "🆕", l: "Complete beginner — never opened Figma", val: "zero" },
        { e: "👀", l: "I've watched tutorials but made nothing", val: "watched" },
        { e: "🖼️", l: "I've made a few designs but they look amateur", val: "some" },
        { e: "💼", l: "I have designs but no clients or portfolio", val: "no_clients" }
      ]
    }
    if (directionAnswer === "uni") {
      if (whyStuckAnswer === "code")
        return {
          id: "uni_code_level",
          eye: "University",
          title: "When you sit down to code, what usually happens?",
          hint: "Be honest — that's how we help.",
          opts: [
            { e: "💀", l: "I can't write basic code at all", val: "zero" },
            { e: "🤷", l: "I understand it but can't write it", val: "read_only" },
            { e: "💪", l: "I can code, just need direction", val: "decent" }
          ]
        }
      return {
        id: "uni_semester",
        eye: "University",
        title: "What's been the hardest part of this semester?",
        hint: "We've all been there.",
        opts: [
          { e: "🤯", l: "Too much theory delivered too fast", val: "theory" },
          { e: "💻", l: "Coding assignments I can't complete", val: "coding" },
          { e: "😴", l: "I've lost motivation completely", val: "motivation" },
          { e: "🗺️", l: "I don't know what career to aim for", val: "career" }
        ]
      }
    }
  }

  // ── STEP 5: Second path question — branches on Q3 answer ──
  if (currentStep === 5) {
    if (directionAnswer === "web" || directionAnswer === "mobile") {
      if (path1Answer === "css" || path1Answer === "no_project")
        return {
          id: "web_enjoy",
          eye: "Dev Path",
          title: "Which one actually feels more fun to you?",
          hint: "Go with your gut — both are valid.",
          opts: [
            { e: "🎨", l: "Designing beautiful user interfaces", val: "frontend" },
            { e: "⚙️", l: "Building the logic behind the scenes", val: "backend" },
            { e: "🤷", l: "I want to do both", val: "fullstack" }
          ]
        }
      return {
        id: "web_type",
        eye: "Dev Path",
        title: "Front, back, or a bit of both?",
        hint: "This shapes your entire learning stack.",
        opts: [
          { e: "🖥️", l: "Frontend — what users see and click", val: "frontend" },
          { e: "🏗️", l: "Backend — the engine underneath", val: "backend" },
          { e: "🌐", l: "Full-stack — I want to build complete apps", val: "fullstack" }
        ]
      }
    }
    if (directionAnswer === "ai")
      return {
        id: "ai_math",
        eye: "AI Path",
        title: "When you see math, what's your gut reaction?",
        hint: "This decides your starting point — be honest.",
        opts: [
          { e: "😰", l: "I really struggle with it", val: "hate" },
          { e: "😐", l: "I can manage basic math", val: "okay" },
          { e: "🤓", l: "I'm very comfortable with it", val: "love" }
        ]
      }
    if (directionAnswer === "data")
      return {
        id: "data_math",
        eye: "Data Science",
        title: "Numbers and spreadsheets — curious, or close the tab?",
        hint: "It determines where we start you.",
        opts: [
          { e: "🤓", l: "Strong — calculus and stats are fine", val: "strong" },
          { e: "😐", l: "Okay, but I need a refresher", val: "okay" },
          { e: "😰", l: "Very weak — numbers scare me", val: "weak" }
        ]
      }
    if (directionAnswer === "cyber")
      return {
        id: "cyber_net",
        eye: "Cyber Security",
        title: "What do you already know about how networks work?",
        hint: "Security is built on top of networks.",
        opts: [
          { e: "🌐", l: "I know IP, TCP/UDP, DNS", val: "good" },
          { e: "🔌", l: "I know what a router is", val: "basic" },
          { e: "🤷", l: "Completely new to me", val: "none" }
        ]
      }
    if (directionAnswer === "freelance")
      return {
        id: "free_skill",
        eye: "Freelance Path",
        title: "What's one skill you already bring to the table?",
        hint: "Don't worry if the answer is nothing.",
        opts: [
          { e: "🎨", l: "Design, video, or content creation", val: "design" },
          { e: "💻", l: "Coding or technical skills", val: "coding" },
          { e: "✍️", l: "Writing, marketing, or copywriting", val: "writing" },
          { e: "🤷", l: "Starting completely from zero", val: "nothing" }
        ]
      }
    if (directionAnswer === 'design') return {
      id: 'design_goal', eye: "Design Path",
      title: "What kind of thing do you want to design?",
      hint: "This decides which skills to focus on first.",
      opts: [
        { e: "📱", l: "Mobile apps — screens and flows", val: "mobile" },
        { e: "🌐", l: "Websites and landing pages", val: "web" },
        { e: "🏢", l: "SaaS products and dashboards", val: "saas" },
        { e: "💸", l: "Freelance — design for paying clients", val: "freelance" }
      ]
    }
    if (directionAnswer === "uni")
      return {
        id: "uni_coding",
        eye: "University",
        title: "When your code breaks, what do you do?",
        hint: "Loops, functions, data structures…",
        opts: [
          { e: "💪", l: "I can code, just need direction", val: "good" },
          { e: "🤷", l: "I understand theory but can't write it", val: "read_only" },
          { e: "💀", l: "I don't understand it at all", val: "bad" }
        ]
      }
  }

  // ── STEP 6: Final — style preference ──
  if (currentStep === 6) {
    return {
      id: "final_guide",
      eye: "Almost done",
      title: "Last thing — how should YourNext guide you?",
      hint: "This personalizes your roadmap style.",
      opts: [
        { e: "⚡", l: "Fast and practical — get results quick", val: "fast" },
        { e: "🛤️", l: "Step-by-step — no confusion, no skipping", val: "step" },
        { e: "🏢", l: "Job-focused — build for employment", val: "job" },
        { e: "💸", l: "Freelance-focused — build for clients", val: "freelance" }
      ]
    }
  }

  return null
}

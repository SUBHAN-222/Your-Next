/**
 * Dynamic quiz questions with branching logic
 * Each question can branch based on previous answers
 */

export const TOTAL_STEPS = 5

export const QUESTION_IDS = [
  'q_stuck',
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
 * @param {number} currentStep - Current step index (0-4)
 * @returns {Object|null} Question object or null if quiz is complete
 */
export function getNextQuestion(answers, currentStep) {
  const stuckAnswer = getAnswerByQuestionId(answers, 'q_stuck')
  const directionAnswer = getAnswerByQuestionId(answers, 'q_direction')
  const path1Answer = getAnswerByQuestionId(answers, 'q_path1')

  // ── STEP 0: Where are you stuck ──
  if (currentStep === 0) {
    return {
      id: "q_stuck",
      eye: "Let's find your path",
      title: "Where are you stuck?",
      opts: [
        { e: "🤷", l: "Not sure how to start", val: "no_start" },
        { e: "😵", l: "Tried, but got overwhelmed", val: "lost" },
        { e: "📉", l: "Practicing, not improving", val: "not_improving" },
        { e: "🎓", l: "Uni student, no clear path", val: "uni_confused" }
      ]
    }
  }

  // ── STEP 1: Direction — the strongest signal ──
  if (currentStep === 1) {
    return {
      id: "q_direction",
      eye: "Your direction",
      title: "What pulls you in the most?",
      opts: [
        { e: "🌐", l: "Web & App Development", val: "web" },
        { e: "🤖", l: "AI & Machine Learning", val: "ai" },
        { e: "📊", l: "Data Science", val: "data" },
        { e: "🔒", l: "Cyber Security", val: "cyber" },
        { e: "📱", l: "Mobile App Development", val: "mobile" },
        { e: "🎨", l: "Product Design (UI/UX)", val: "design" },
        { e: "💼", l: "Freelance & Online Earning", val: "freelance" },
        { e: "🏫", l: "University CS Subjects", val: "uni" }
      ]
    }
  }

  // ── STEP 2: First path question — what you're building toward ──
  if (currentStep === 2) {
    if (directionAnswer === "web" || directionAnswer === "mobile") {
      if (stuckAnswer === "not_improving")
        return {
          id: "web_stuck",
          eye: "Web Development",
          title: "What's tripping you up?",
          opts: [
            { e: "🎨", l: "Styling & CSS", val: "css" },
            { e: "⚙️", l: "JavaScript logic", val: "js" },
            { e: "🔗", l: "Connecting a backend", val: "backend" },
            { e: "🤷", l: "Don't know what to build", val: "no_project" }
          ]
        }
      return {
        id: "web_goal",
        eye: "Web Development",
        title: "What are you building toward?",
        opts: [
          { e: "💼", l: "Full-time job", val: "job" },
          { e: "💸", l: "Freelance work", val: "freelance" },
          { e: "🚀", l: "My own product", val: "startup" }
        ]
      }
    }
    if (directionAnswer === "ai")
      return {
        id: "ai_why",
        eye: "AI",
        title: "What pulls you to AI?",
        opts: [
          { e: "🚀", l: "Build future products", val: "future" },
          { e: "💰", l: "AI pays well", val: "salary" },
          { e: "🧠", l: "It fascinates me", val: "fascinating" },
          { e: "💸", l: "Sell AI tools", val: "earn" }
        ]
      }
    if (directionAnswer === "data")
      return {
        id: "data_goal",
        eye: "Data Science",
        title: "What pulls you to data?",
        opts: [
          { e: "📊", l: "Insights & decisions", val: "analytics" },
          { e: "🤖", l: "ML models", val: "ml" },
          { e: "📈", l: "Visualizations", val: "viz" },
          { e: "💼", l: "Analyst job", val: "job" }
        ]
      }
    if (directionAnswer === "cyber")
      return {
        id: "cyber_side",
        eye: "Cyber Security",
        title: "Which side of security?",
        opts: [
          { e: "🕵️", l: "Ethical hacking", val: "offense" },
          { e: "🛡️", l: "Defending systems", val: "defense" },
          { e: "🔍", l: "Digital forensics", val: "forensics" },
          { e: "🤷", l: "Not sure yet", val: "curious" }
        ]
      }
    if (directionAnswer === "freelance")
      return {
        id: "free_urgency",
        eye: "Freelancing",
        title: "How soon do you need income?",
        opts: [
          { e: "🔥", l: "Within weeks", val: "urgent" },
          { e: "🌱", l: "Steady build-up", val: "steady" },
          { e: "🎯", l: "Plan it first", val: "planned" }
        ]
      }
    if (directionAnswer === "design")
      return {
        id: "design_exp",
        eye: "Design",
        title: "Where are you with design?",
        opts: [
          { e: "🆕", l: "Complete beginner", val: "zero" },
          { e: "👀", l: "Tutorials only", val: "watched" },
          { e: "🎨", l: "Made some designs", val: "some" },
          { e: "💼", l: "No clients yet", val: "no_clients" }
        ]
      }
    if (directionAnswer === "uni")
      return {
        id: "uni_semester",
        eye: "University",
        title: "Hardest part of your semester?",
        opts: [
          { e: "📚", l: "Too much theory", val: "theory" },
          { e: "💻", l: "Can't finish assignments", val: "coding" },
          { e: "🔥", l: "Lost motivation", val: "motivation" },
          { e: "🗺️", l: "No career direction", val: "career" }
        ]
      }
  }

  // ── STEP 3: Second path question — skill level / focus ──
  if (currentStep === 3) {
    if (directionAnswer === "web" || directionAnswer === "mobile") {
      if (path1Answer === "css" || path1Answer === "no_project")
        return {
          id: "web_enjoy",
          eye: "Web Development",
          title: "Which feels more fun?",
          opts: [
            { e: "🎨", l: "Designing interfaces", val: "frontend" },
            { e: "⚙️", l: "Backend logic", val: "backend" },
            { e: "🤷", l: "Both", val: "fullstack" }
          ]
        }
      return {
        id: "web_type",
        eye: "Web Development",
        title: "Which type of web development?",
        opts: [
          { e: "🖥️", l: "Frontend", val: "frontend" },
          { e: "🏗️", l: "Backend", val: "backend" },
          { e: "🧩", l: "Full-stack", val: "fullstack" }
        ]
      }
    }
    if (directionAnswer === "ai")
      return {
        id: "ai_math",
        eye: "AI",
        title: "How do you feel about math?",
        opts: [
          { e: "😰", l: "I struggle with it", val: "hate" },
          { e: "😐", l: "Basics are fine", val: "okay" },
          { e: "🤓", l: "Very comfortable", val: "love" }
        ]
      }
    if (directionAnswer === "data")
      return {
        id: "data_math",
        eye: "Data Science",
        title: "Comfortable with numbers?",
        opts: [
          { e: "🤓", l: "Stats are fine", val: "strong" },
          { e: "😐", l: "Need a refresher", val: "okay" },
          { e: "😰", l: "Numbers scare me", val: "weak" }
        ]
      }
    if (directionAnswer === "cyber")
      return {
        id: "cyber_net",
        eye: "Cyber Security",
        title: "How well do you know networks?",
        opts: [
          { e: "🌐", l: "Know IP, TCP, DNS", val: "good" },
          { e: "🔌", l: "Know what a router is", val: "basic" },
          { e: "🤷", l: "Completely new", val: "none" }
        ]
      }
    if (directionAnswer === "freelance")
      return {
        id: "free_skill",
        eye: "Freelancing",
        title: "What skill do you bring?",
        opts: [
          { e: "🎨", l: "Design, video, content", val: "design" },
          { e: "💻", l: "Coding or technical", val: "coding" },
          { e: "✍️", l: "Writing or marketing", val: "writing" },
          { e: "🤷", l: "Starting from zero", val: "nothing" }
        ]
      }
    if (directionAnswer === "design")
      return {
        id: "design_goal",
        eye: "Design",
        title: "What do you want to design?",
        opts: [
          { e: "📱", l: "Mobile apps", val: "mobile" },
          { e: "🌐", l: "Websites", val: "web" },
          { e: "🏢", l: "SaaS dashboards", val: "saas" },
          { e: "💸", l: "For paying clients", val: "freelance" }
        ]
      }
    if (directionAnswer === "uni")
      return {
        id: "uni_coding",
        eye: "University",
        title: "When code breaks, what do you do?",
        opts: [
          { e: "💪", l: "Can code, need direction", val: "good" },
          { e: "🤷", l: "Know theory, can't code", val: "read_only" },
          { e: "💀", l: "Don't understand it", val: "bad" }
        ]
      }
  }

  // ── STEP 4: Final — guide style ──
  if (currentStep === 4) {
    return {
      id: "final_guide",
      eye: "Almost done",
      title: "How should we guide you?",
      opts: [
        { e: "⚡", l: "Fast & practical", val: "fast" },
        { e: "🛤️", l: "Step-by-step", val: "step" },
        { e: "🏢", l: "Job-focused", val: "job" },
        { e: "💸", l: "Freelance-focused", val: "freelance" }
      ]
    }
  }

  return null
}
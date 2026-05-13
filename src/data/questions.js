/**
 * Dynamic quiz questions with branching logic
 * Each question can branch based on previous answers
 */

export const TOTAL_STEPS = 6

/**
 * Get the next question based on current answers and step
 * @param {Object} answers - Object containing all previous answers
 * @param {number} currentStep - Current step index (0-5)
 * @returns {Object|null} Question object or null if quiz is complete
 */
export function getNextQuestion(answers, currentStep) {
  const q0 = answers[0]?.val // where stuck
  const q1 = answers[1]?.val // why stuck (branched on q0)
  const q2 = answers[2]?.val // direction
  const q3 = answers[3]?.val // path q1 (branched on q0+q2)
  const q4 = answers[4]?.val // path q2

  // ── STEP 0: Always the same opening ──
  if (currentStep === 0) {
    return {
      id: "q_stuck",
      eye: "Let's understand you",
      title: "Where are you stuck right now?",
      hint: "Be honest — there's no wrong answer here.",
      opts: [
        { e: "🤷", l: "I don't know where to start", val: "no_start" },
        { e: "😵", l: "I started but feel completely lost", val: "lost" },
        { e: "📉", l: "I'm learning but not improving", val: "not_improving" },
        { e: "🎓", l: "I'm in university but still confused", val: "uni_confused" },
        { e: "💸", l: "I want to start earning online", val: "earning" }
      ]
    }
  }

  // ── STEP 1: Branches based on Q0 answer ──
  if (currentStep === 1) {
    if (q0 === "no_start")
      return {
        id: "q_tried",
        eye: "Starting fresh",
        title: "Have you tried learning anything before?",
        hint: "Even YouTube or a free course counts.",
        opts: [
          { e: "❌", l: "No, I haven't tried anything yet", val: "never" },
          { e: "📺", l: "Yes, but I gave up quickly", val: "gave_up" },
          { e: "🔄", l: "Yes, but nothing clicked for me", val: "didnt_click" }
        ]
      }
    if (q0 === "lost")
      return {
        id: "q_lost_cause",
        eye: "Finding the block",
        title: "What made you feel lost?",
        hint: "Pin down the exact moment things stopped making sense.",
        opts: [
          { e: "🌊", l: "Too much information at once", val: "overload" },
          { e: "🔗", l: "Concepts didn't connect to each other", val: "no_connection" },
          { e: "🎯", l: "I didn't know what to build or practice", val: "no_project" },
          { e: "💬", l: "The terms and jargon were confusing", val: "jargon" }
        ]
      }
    if (q0 === "not_improving")
      return {
        id: "q_how_long",
        eye: "Progress check",
        title: "How long have you been learning?",
        hint: "This helps us understand what is blocking you.",
        opts: [
          { e: "📅", l: "Less than 1 month", val: "fresh" },
          { e: "📆", l: "1 to 6 months", val: "mid" },
          { e: "🗓️", l: "More than 6 months", val: "long" }
        ]
      }
    if (q0 === "uni_confused")
      return {
        id: "q_uni_hard",
        eye: "University struggles",
        title: "Which part of university confuses you most?",
        hint: "This will shape everything we suggest.",
        opts: [
          { e: "💻", l: "Programming — I can't write code", val: "code" },
          { e: "📐", l: "Math and theory subjects", val: "math" },
          { e: "🏗️", l: "Projects and assignments", val: "projects" },
          { e: "🗺️", l: "I don't see a career path", val: "career" }
        ]
      }
    if (q0 === "earning")
      return {
        id: "q_earn_tried",
        eye: "Earning ambition",
        title: "Have you tried earning online before?",
        hint: "Knowing this helps us skip what does not work for you.",
        opts: [
          { e: "❌", l: "No, completely new to this", val: "never" },
          { e: "😔", l: "Yes, but got no clients or sales", val: "no_clients" },
          { e: "💰", l: "Yes, I made a little money", val: "some" }
        ]
      }
  }

  // ── STEP 2: Direction — eyebrow adapts to journey so far ──
  if (currentStep === 2) {
    let eye = "Your direction"
    let hint = "Pick the world that excites you most."
    if (q0 === "no_start" && q1 === "never") {
      eye = "A blank slate"
      hint = "Pick the world you want to enter."
    } else if (q0 === "lost") {
      eye = "Let's redirect you"
      hint = "Which direction do you want to go back to?"
    } else if (q0 === "not_improving") {
      eye = "Double down or pivot?"
      hint = "Pick the path you are most committed to."
    } else if (q0 === "uni_confused") {
      eye = "Beyond the classroom"
      hint = "Where do you see yourself after university?"
    } else if (q0 === "earning") {
      eye = "Pick your earning path"
      hint = "What skill do you want to monetize?"
    }
    return {
      id: "q_direction",
      eye,
      hint,
      title: "What feels most interesting to you?",
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

  // ── STEP 3: First path question — branches on Q0 + Q2 ──
  if (currentStep === 3) {
    if (q2 === "web" || q2 === "mobile") {
      if (q0 === "not_improving")
        return {
          id: "web_stuck",
          eye: "Dev Path",
          title: "What part frustrates you most right now?",
          hint: "Let's fix the exact blocker, not guess.",
          opts: [
            { e: "🎨", l: "CSS — making things look good", val: "css" },
            { e: "⚙️", l: "JavaScript logic and algorithms", val: "js" },
            { e: "🔗", l: "Connecting frontend to backend", val: "backend" },
            { e: "🤷", l: "I don't know what to build next", val: "no_project" }
          ]
        }
      if (q0 === "earning")
        return {
          id: "web_earn_goal",
          eye: "Dev Path",
          title: "How do you plan to earn with development?",
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
        title: "What is your main goal with development?",
        hint: "Be specific — this decides your path.",
        opts: [
          { e: "💼", l: "Get a full-time job at a company", val: "job" },
          { e: "💸", l: "Work as a freelancer", val: "freelance" },
          { e: "🚀", l: "Build my own startup or product", val: "startup" }
        ]
      }
    }
    if (q2 === "ai") {
      if (q0 === "earning")
        return {
          id: "ai_earn",
          eye: "AI Path",
          title: "How do you want to earn with AI?",
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
        title: "Why are you drawn to AI?",
        hint: "Honest answer gives you the best path.",
        opts: [
          { e: "🚀", l: "I want to build the next generation of products", val: "future" },
          { e: "💼", l: "AI jobs pay very well", val: "salary" },
          { e: "🧠", l: "I find the concept genuinely fascinating", val: "fascinating" },
          { e: "💸", l: "I want to sell AI tools and earn online", val: "earn" }
        ]
      }
    }
    if (q2 === "data")
      return {
        id: "data_goal",
        eye: "Data Science",
        title: "What draws you to data?",
        hint: "Data has many career directions.",
        opts: [
          { e: "📊", l: "Finding insights and making decisions", val: "analytics" },
          { e: "🤖", l: "Building ML models and predictions", val: "ml" },
          { e: "📈", l: "Visualizing data beautifully", val: "viz" },
          { e: "💼", l: "Getting a data analyst job", val: "job" }
        ]
      }
    if (q2 === "cyber")
      return {
        id: "cyber_side",
        eye: "Cyber Security",
        title: "Which side of security excites you?",
        hint: "Both are valid and well-paying.",
        opts: [
          { e: "🕵️", l: "Ethical hacking — finding vulnerabilities", val: "offense" },
          { e: "🛡️", l: "Defending systems and networks", val: "defense" },
          { e: "🔍", l: "Digital forensics and investigations", val: "forensics" },
          { e: "🤷", l: "I'm not sure yet", val: "curious" }
        ]
      }
    if (q2 === "freelance")
      return {
        id: "free_urgency",
        eye: "Freelance Path",
        title: "How urgent is earning for you?",
        hint: "No judgement — this helps us prioritize correctly.",
        opts: [
          { e: "🔥", l: "I need income within weeks", val: "urgent" },
          { e: "🌱", l: "I'm building toward it steadily", val: "steady" },
          { e: "🎯", l: "I want to plan it carefully first", val: "planned" }
        ]
      }
    if (q2 === "uni") {
      if (q1 === "code")
        return {
          id: "uni_code_level",
          eye: "University",
          title: "How stuck are you with code specifically?",
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
        title: "What is your biggest semester struggle?",
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

  // ── STEP 4: Second path question — branches on Q3 answer ──
  if (currentStep === 4) {
    if (q2 === "web" || q2 === "mobile") {
      if (q3 === "css" || q3 === "no_project")
        return {
          id: "web_enjoy",
          eye: "Dev Path",
          title: "What do you enjoy more?",
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
        title: "Frontend, backend, or full-stack?",
        hint: "This shapes your entire learning stack.",
        opts: [
          { e: "🖥️", l: "Frontend — what users see and click", val: "frontend" },
          { e: "🏗️", l: "Backend — the engine underneath", val: "backend" },
          { e: "🌐", l: "Full-stack — I want to build complete apps", val: "fullstack" }
        ]
      }
    }
    if (q2 === "ai")
      return {
        id: "ai_math",
        eye: "AI Path",
        title: "How comfortable are you with Math?",
        hint: "This decides your starting point — be honest.",
        opts: [
          { e: "😰", l: "I really struggle with it", val: "hate" },
          { e: "😐", l: "I can manage basic math", val: "okay" },
          { e: "🤓", l: "I'm very comfortable with it", val: "love" }
        ]
      }
    if (q2 === "data")
      return {
        id: "data_math",
        eye: "Data Science",
        title: "How is your math and statistics?",
        hint: "It determines where we start you.",
        opts: [
          { e: "🤓", l: "Strong — calculus and stats are fine", val: "strong" },
          { e: "😐", l: "Okay, but I need a refresher", val: "okay" },
          { e: "😰", l: "Very weak — numbers scare me", val: "weak" }
        ]
      }
    if (q2 === "cyber")
      return {
        id: "cyber_net",
        eye: "Cyber Security",
        title: "How well do you understand networking?",
        hint: "Security is built on top of networks.",
        opts: [
          { e: "🌐", l: "I know IP, TCP/UDP, DNS", val: "good" },
          { e: "🔌", l: "I know what a router is", val: "basic" },
          { e: "🤷", l: "Completely new to me", val: "none" }
        ]
      }
    if (q2 === "freelance")
      return {
        id: "free_skill",
        eye: "Freelance Path",
        title: "What skill do you already have?",
        hint: "Don't worry if the answer is nothing.",
        opts: [
          { e: "🎨", l: "Design, video, or content creation", val: "design" },
          { e: "💻", l: "Coding or technical skills", val: "coding" },
          { e: "✍️", l: "Writing, marketing, or copywriting", val: "writing" },
          { e: "🤷", l: "Starting completely from zero", val: "nothing" }
        ]
      }
    if (q2 === "uni")
      return {
        id: "uni_coding",
        eye: "University",
        title: "How confident are you in programming?",
        hint: "Loops, functions, data structures…",
        opts: [
          { e: "💪", l: "I can code, just need direction", val: "good" },
          { e: "🤷", l: "I understand theory but can't write it", val: "read_only" },
          { e: "💀", l: "I don't understand it at all", val: "bad" }
        ]
      }
  }

  // ── STEP 5: Final — style preference ──
  if (currentStep === 5) {
    return {
      id: "final_guide",
      eye: "Almost done",
      title: "How do you want YourNext to guide you?",
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
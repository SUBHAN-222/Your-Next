/**
 * Recommendation Engine
 * Score-based matching system that analyzes user answers and generates
 * personalized career path recommendations with confidence scores
 */

import { CAREER_PATHS, getCareerPath, getCategories, getRoadmap } from "@data/careerPaths";

/**
 * Answer weight configurations for scoring
 * Each answer value maps to career path preferences with weights
 */
const ANSWER_WEIGHTS = {
  // Q0: Where are you stuck
  q0: {
    no_start: { web: 0.3, freelance: 0.3, design: 0.2, uni: 0.2 },
    lost: { web: 0.4, ai: 0.2, data: 0.2, design: 0.2 },
    not_improving: { web: 0.3, ai: 0.3, data: 0.2, cyber: 0.2 },
    uni_confused: { uni: 0.5, web: 0.2, ai: 0.2, data: 0.1 },
    earning: { freelance: 0.5, web: 0.3, ai: 0.1, design: 0.1 }
  },

  // Q2: Direction (strongest signal)
  q2: {
    web: { web: 0.8, mobile: 0.3, freelance: 0.2 },
    ai: { ai: 0.8, data: 0.3 },
    data: { data: 0.8, ai: 0.3 },
    cyber: { cyber: 0.8 },
    mobile: { mobile: 0.8, web: 0.3 },
    design: { design: 0.8 },
    freelance: { freelance: 0.8, web: 0.2 },
    uni: { uni: 0.8, web: 0.2, ai: 0.1, data: 0.1 }
  },

  // Q3: Path-specific questions
  q3: {
    // Web path preferences
    css: { web: 0.3 },
    js: { web: 0.3 },
    backend: { web: 0.3 },
    no_project: { web: 0.2, freelance: 0.2 },
    freelance: { freelance: 0.3, web: 0.2 },
    job: { web: 0.2 },
    startup: { web: 0.2, freelance: 0.2 },
    tools: { ai: 0.3 },
    automate: { ai: 0.3, freelance: 0.2 },
    teach: { ai: 0.2, freelance: 0.2 },
    future: { ai: 0.3 },
    salary: { ai: 0.2, web: 0.1, data: 0.1 },
    fascinating: { ai: 0.3 },
    earn: { ai: 0.2, freelance: 0.2 },
    analytics: { data: 0.3 },
    ml: { data: 0.3, ai: 0.2 },
    viz: { data: 0.3, design: 0.2 },
    offense: { cyber: 0.3 },
    defense: { cyber: 0.3 },
    forensics: { cyber: 0.3 },
    curious: { cyber: 0.2 },
    urgent: { freelance: 0.3 },
    steady: { freelance: 0.2 },
    planned: { freelance: 0.2 },
    zero: { uni: 0.2 },
    read_only: { uni: 0.2 },
    decent: { uni: 0.1 },
    theory: { uni: 0.2 },
    coding: { uni: 0.2, web: 0.1 },
    motivation: { uni: 0.2 },
    career: { uni: 0.2, freelance: 0.1 }
  },

  // Q4: Second path question
  q4: {
    frontend: { web: 0.3, design: 0.2 },
    backend: { web: 0.3 },
    fullstack: { web: 0.3, freelance: 0.2 },
    hate: { ai: -0.1, data: -0.1 },
    okay: { ai: 0.1, data: 0.1 },
    love: { ai: 0.2, data: 0.2 },
    strong: { ai: 0.2, data: 0.2 },
    weak: { ai: -0.1, data: -0.1 },
    good: { cyber: 0.2 },
    basic: { cyber: 0.1 },
    none: { cyber: -0.1 },
    design: { design: 0.2, freelance: 0.1 },
    coding: { web: 0.2, ai: 0.1 },
    writing: { freelance: 0.2, design: 0.1 },
    nothing: { freelance: 0.1, web: 0.1 },
    good: { uni: 0.1 },
    read_only: { uni: 0.2 },
    bad: { uni: 0.3 }
  },

  // Q5: Guide style preference
  q5: {
    fast: { freelance: 0.2, web: 0.1 },
    step: { web: 0.2, uni: 0.2, ai: 0.1, data: 0.1 },
    job: { web: 0.2, data: 0.2, cyber: 0.2, ai: 0.1 },
    freelance: { freelance: 0.3, web: 0.1 }
  }
};

/**
 * Experience level mapping based on answers
 */
const EXPERIENCE_INDICATORS = {
  beginner: ["no_start", "never", "fresh", "zero", "bad", "none"],
  intermediate: ["lost", "not_improving", "mid", "long", "read_only", "okay", "basic"],
  advanced: ["uni_confused", "earning", "decent", "good", "strong", "love"]
};

/**
 * Calculate experience level from answers
 */
function calculateExperienceLevel(answers) {
  let beginnerScore = 0;
  let intermediateScore = 0;
  let advancedScore = 0;

  Object.values(answers).forEach(answer => {
    const val = answer?.val;
    if (!val) return;

    if (EXPERIENCE_INDICATORS.beginner.includes(val)) beginnerScore++;
    if (EXPERIENCE_INDICATORS.intermediate.includes(val)) intermediateScore++;
    if (EXPERIENCE_INDICATORS.advanced.includes(val)) advancedScore++;
  });

  const maxScore = Math.max(beginnerScore, intermediateScore, advancedScore);

  if (maxScore === 0) return "beginner";
  if (maxScore === beginnerScore) return "beginner";
  if (maxScore === intermediateScore) return "intermediate";
  return "advanced";
}

/**
 * Calculate category preference within a career path
 */
function calculateCategoryPreference(careerId, answers) {
  const categories = getCategories(careerId);
  if (!categories || categories.length === 0) return null;

  // Default category scores
  const categoryScores = {};
  categories.forEach(cat => {
    categoryScores[cat.id] = 0;
  });

  // Analyze answers for category preferences
  Object.values(answers).forEach(answer => {
    const val = answer?.val;
    if (!val) return;

    // Web path category mapping
    if (careerId === "web") {
      if (["css", "frontend"].includes(val)) categoryScores.frontend += 2;
      if (["js", "backend", "backend"].includes(val)) categoryScores.backend += 2;
      if (["fullstack"].includes(val)) categoryScores.fullstack += 2;
    }

    // AI path category mapping
    if (careerId === "ai") {
      if (["tools", "automate", "earn"].includes(val)) categoryScores.ai_applications += 2;
      if (["future", "fascinating", "love"].includes(val)) categoryScores.ai_researcher += 1;
      if (["salary", "math", "strong"].includes(val)) categoryScores.ml_engineer += 1;
    }

    // Data path category mapping
    if (careerId === "data") {
      if (["analytics", "viz", "job"].includes(val)) categoryScores.data_analyst += 2;
      if (["ml", "strong"].includes(val)) categoryScores.data_scientist += 2;
      if (["good", "basic", "etl"].includes(val)) categoryScores.data_engineer += 1;
    }

    // Cyber path category mapping
    if (careerId === "cyber") {
      if (["offense"].includes(val)) categoryScores.ethical_hacker += 2;
      if (["defense", "good"].includes(val)) categoryScores.security_engineer += 1;
      if (["forensics", "curious"].includes(val)) categoryScores.security_analyst += 1;
    }

    // Mobile path category mapping
    if (careerId === "mobile") {
      if (["frontend", "design"].includes(val)) categoryScores.react_native += 1;
      if (["ios", "apple"].includes(val)) categoryScores.ios_developer += 2;
      if (["android", "kotlin"].includes(val)) categoryScores.android_developer += 2;
    }

    // Design path category mapping
    if (careerId === "design") {
      if (["css", "frontend", "ui"].includes(val)) categoryScores.ui_designer += 2;
      if (["ux", "research", "user"].includes(val)) categoryScores.ux_designer += 2;
      if (["fullstack", "strategy"].includes(val)) categoryScores.product_designer += 1;
    }

    // Freelance path category mapping
    if (careerId === "freelance") {
      if (["coding", "tech", "web"].includes(val)) categoryScores.tech_freelancer += 2;
      if (["writing", "content", "design"].includes(val)) categoryScores.content_creator += 2;
      if (["startup", "team", "scale"].includes(val)) categoryScores.agency_owner += 1;
    }

    // University path category mapping
    if (careerId === "uni") {
      if (["coding", "programming", "decent"].includes(val)) categoryScores.cs_student += 1;
      if (["career", "job", "internship"].includes(val)) categoryScores.career_starter += 2;
    }
  });

  // Find the best matching category
  let bestCategory = categories[0];
  let bestScore = categoryScores[categories[0].id];

  Object.entries(categoryScores).forEach(([catId, score]) => {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = categories.find(c => c.id === catId);
    }
  });

  return bestCategory || categories[0];
}

/**
 * Main recommendation function
 * Analyzes answers and returns personalized recommendations with confidence scores
 */
export function generateRecommendation(answers) {
  // Initialize scores for all career paths
  const careerScores = {};
  Object.keys(CAREER_PATHS).forEach(id => {
    careerScores[id] = { score: 0, factors: [] };
  });

  // Calculate scores based on answers
  Object.entries(answers).forEach(([stepIndex, answer]) => {
    const val = answer?.val;
    if (!val) return;

    const stepKey = `q${stepIndex}`;
    const weights = ANSWER_WEIGHTS[stepKey];

    if (weights && weights[val]) {
      Object.entries(weights[val]).forEach(([careerId, weight]) => {
        if (careerScores[careerId]) {
          careerScores[careerId].score += weight;
          careerScores[careerId].factors.push({
            question: stepKey,
            answer: val,
            weight: weight
          });
        }
      });
    }
  });

  // Sort careers by score
  const sortedCareers = Object.entries(careerScores)
    .map(([id, data]) => ({
      id,
      ...CAREER_PATHS[id],
      confidence: Math.min(100, Math.max(0, Math.round((data.score / 2) * 100))),
      factors: data.factors
    }))
    .sort((a, b) => b.confidence - a.confidence);

  // Get top recommendation
  const topCareer = sortedCareers[0];
  if (!topCareer) return null;

  // Calculate experience level
  const experienceLevel = calculateExperienceLevel(answers);

  // Get recommended category
  const recommendedCategory = calculateCategoryPreference(topCareer.id, answers);

  // Get roadmap based on experience level
  const roadmap = getRoadmap(topCareer.id, experienceLevel);

  // Build recommendation result
  const recommendation = {
    primaryCareer: {
      id: topCareer.id,
      name: topCareer.name,
      icon: topCareer.icon,
      description: topCareer.description,
      confidence: topCareer.confidence,
      category: recommendedCategory,
      experienceLevel,
      roadmap
    },
    alternativeCareers: sortedCareers
      .slice(1, 3)
      .filter(c => c.confidence > 30)
      .map(c => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        confidence: c.confidence
      })),
    personalizedSummary: generateSummary(topCareer, recommendedCategory, experienceLevel, answers),
    skills: recommendedCategory?.skills || [],
    tools: recommendedCategory?.tools || [],
    earningMethods: recommendedCategory?.earningMethods || [],
    nextSteps: generateNextSteps(topCareer, experienceLevel)
  };

  return recommendation;
}

/**
 * Generate a personalized summary based on the recommendation
 */
function generateSummary(career, category, experienceLevel, answers) {
  const careerName = career?.name || "your path";
  const categoryName = category?.name || "";
  const q0Answer = answers[0]?.val;

  const openingLines = {
    no_start: `Starting your journey in ${careerName} is an exciting decision.`,
    lost: `We understand you've been feeling lost, but ${careerName} offers a clear path forward.`,
    not_improving: `It's time to level up. ${careerName} will challenge you in the right ways.`,
    uni_confused: `Your university experience will make much more sense when applied to ${careerName}.`,
    earning: `${careerName} offers excellent opportunities for online earning and financial independence.`
  };

  const experienceContext = {
    beginner: "We'll start with the fundamentals and build up your skills step by step.",
    intermediate: "You have a solid foundation. It's time to deepen your expertise and tackle real-world projects.",
    advanced: "You're ready for advanced concepts. Let's focus on specialization and professional growth."
  };

  const categoryContext = categoryName
    ? `Our recommendation focuses on ${categoryName}, which aligns perfectly with your interests and goals.`
    : "";

  return {
    opening: openingLines[q0Answer] || `Based on your responses, ${careerName} is an excellent fit for you.`,
    experience: experienceContext[experienceLevel],
    category: categoryContext,
    closing: `Your personalized roadmap includes ${career?.roadmaps?.[experienceLevel]?.length || 5} focused steps to get you started.`
  };
}

/**
 * Generate immediate next steps for the user
 */
function generateNextSteps(career, experienceLevel) {
  const roadmap = getRoadmap(career?.id, experienceLevel);
  return roadmap.slice(0, 3).map(step => ({
    title: step.name,
    description: step.why,
    timeEstimate: step.time,
    resource: step.resource,
    action: step.task
  }));
}

/**
 * Get recommendations for a specific career path
 */
export function getCareerRecommendation(careerId, answers) {
  const career = getCareerPath(careerId);
  if (!career) return null;

  const experienceLevel = calculateExperienceLevel(answers);
  const category = calculateCategoryPreference(careerId, answers);
  const roadmap = getRoadmap(careerId, experienceLevel);

  return {
    career,
    category,
    experienceLevel,
    roadmap,
    skills: category?.skills || [],
    tools: category?.tools || [],
    earningMethods: category?.earningMethods || []
  };
}

export default {
  generateRecommendation,
  getCareerRecommendation
};
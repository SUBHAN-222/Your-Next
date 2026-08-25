/**
 * Decides when to fire a "surprise" level check (never a fixed pattern —
 * random every 5-8 completed tasks) and builds a quick question from what
 * the user just did, to gauge their current level rather than pass/fail
 * them.
 *
 * NOTE: without a wired AI call, the question is a simple recall check
 * ("which of these did you just do") built from recent task topics —
 * enough to exercise the full pipeline (trigger -> question -> answer ->
 * weakness update) end to end. Once Qwen is wired in aiRoadmap.js, this
 * is the function to upgrade to ask a real comprehension question about
 * the topic instead of a recall question.
 */

export function randomCheckThreshold() {
  return 5 + Math.floor(Math.random() * 4) // 5–8, inclusive
}

export function shouldTriggerCheck(tasksSinceCheck, threshold) {
  return tasksSinceCheck >= threshold
}

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * recentTasks: last ~6-8 completed task objects, each with { name, topic }.
 * Builds a 4-option multiple choice question testing recall of the most
 * recent topic, with distractors pulled from earlier topics.
 */
export function buildLevelCheckQuestion(recentTasks) {
  if (!recentTasks?.length) return null

  const target = recentTasks[recentTasks.length - 1]
  const targetTopic = target.topic || target.name

  const distractorPool = recentTasks
    .slice(0, -1)
    .map((t) => t.topic || t.name)
    .filter((topic, idx, arr) => topic !== targetTopic && arr.indexOf(topic) === idx)

  const distractors = shuffle(distractorPool).slice(0, 3)
  const options = shuffle([targetTopic, ...distractors])

  return {
    question: 'Quick check — which of these did you most recently work on?',
    options,
    correctAnswer: targetTopic,
    topic: targetTopic,
  }
}

/**
 * Returns the weak_score delta to apply after a level check.
 * Wrong answer -> topic gets weaker (higher score, revisited sooner).
 * Correct answer -> topic gets slightly stronger (won't be boosted again soon).
 */
export function weaknessDelta(wasCorrect) {
  return wasCorrect ? -0.5 : 1
}

/**
 * Decides when to fire a "surprise" level check (never a fixed pattern —
 * random every 5-8 completed tasks) and builds a real 10-question quiz
 * from what the user has actually covered, to gauge their current level
 * across topics rather than a single recall question.
 *
 * NOTE: without a wired AI call, questions are template-built from the
 * macro-step content (name/why/task) and recently completed task names —
 * enough to exercise the full pipeline (trigger -> 10 MCQs -> per-topic
 * scoring -> weakness update) end to end. Once Qwen is wired in
 * aiRoadmap.js, this is the function to upgrade to ask real comprehension
 * questions instead of recall/matching ones.
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

function uniqueBy(arr, key) {
  const seen = new Set()
  return arr.filter((item) => {
    const k = item[key]
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

/**
 * recentTasks: recently completed task objects { name, topic }.
 * macroSteps: the authored milestones { name, why, task }.
 * Builds up to `count` multiple-choice questions, mixing two types:
 *   A) "Which topic does this description belong to?" (why -> topic)
 *   B) "Which of these did you recently work on?" (task recall)
 */
export function buildLevelCheckQuiz(recentTasks, macroSteps, count = 10) {
  const questions = []
  const allTopics = macroSteps.map((s) => s.name)

  // Type A — one per covered macro step, matching its "why" to its name.
  const coveredSteps = macroSteps.filter((step) =>
    recentTasks.some((t) => (t.topic || t.name) === step.name)
  )
  coveredSteps.forEach((step) => {
    if (questions.length >= count || !step.why) return
    const distractors = shuffle(allTopics.filter((t) => t !== step.name)).slice(0, 2)
    if (distractors.length < 2) return
    questions.push({
      question: `Which topic does this describe: "${step.why}"?`,
      options: shuffle([step.name, ...distractors]),
      correctAnswer: step.name,
      topic: step.name,
    })
  })

  // Type B — recall of specific recently-completed daily tasks.
  const uniqueTasks = uniqueBy(recentTasks, 'name')
  for (let i = uniqueTasks.length - 1; i >= 0 && questions.length < count; i--) {
    const target = uniqueTasks[i]
    const pool = uniqueTasks.filter((t) => t.name !== target.name)
    if (pool.length < 2) continue
    const distractors = shuffle(pool).slice(0, 2).map((t) => t.name)
    questions.push({
      question: 'Which of these did you recently work on?',
      options: shuffle([target.name, ...distractors]),
      correctAnswer: target.name,
      topic: target.topic || target.name,
    })
  }

  // Type C — fill any remaining slots by cycling macro-step "task" recall.
  let idx = 0
  while (questions.length < count && macroSteps.length > 0 && idx < 20) {
    const step = macroSteps[idx % macroSteps.length]
    const distractors = shuffle(allTopics.filter((t) => t !== step.name)).slice(0, 2)
    if (distractors.length >= 2) {
      questions.push({
        question: `Which milestone covers: "${step.task || step.name}"?`,
        options: shuffle([step.name, ...distractors]),
        correctAnswer: step.name,
        topic: step.name,
      })
    }
    idx++
  }

  return uniqueBy(questions, 'question').slice(0, count)
}

/**
 * Scores an answered quiz. Returns per-topic correct/incorrect counts so
 * the caller can update weakness_profile once per distinct topic rather
 * than once per question.
 */
export function scoreQuiz(answeredQuestions) {
  const topicResults = {}
  answeredQuestions.forEach((q) => {
    if (!topicResults[q.topic]) topicResults[q.topic] = { correct: 0, wrong: 0 }
    if (q.wasCorrect) topicResults[q.topic].correct++
    else topicResults[q.topic].wrong++
  })

  const weakTopics = Object.entries(topicResults)
    .filter(([, r]) => r.wrong > r.correct)
    .map(([topic]) => topic)

  const scoreCount = answeredQuestions.filter((q) => q.wasCorrect).length

  return { topicResults, weakTopics, scoreCount, total: answeredQuestions.length }
}

/** Weak_score delta to apply per topic after scoring (net correct vs wrong). */
export function weaknessDeltaForTopic(topicResult) {
  return topicResult.wrong > topicResult.correct ? 1 : -0.5
}

/** Self-reported difficulty ("stuck"/"couldn't start") also nudges weakness. */
export function weaknessDeltaForFeedback(feedback) {
  if (feedback === 'not_started') return 1.5
  if (feedback === 'stuck') return 1
  return -0.3 // 'completed'
}

/**
 * Turns the 5 authored "macro" roadmap steps into a long stream of small
 * daily tasks (2-3 per day) that can stretch across a chosen duration
 * (6-12 months). Generated in weekly batches — never the whole duration
 * at once — so the user only ever sees a little at a time.
 *
 * NOTE: because the underlying content pool is currently the 5 static
 * macro steps (or whatever generateAIRoadmap returns), long durations
 * cycle back through that content with a different framing on each pass
 * ("Learn" -> "Review" -> "Level up"). Once the AI call in aiRoadmap.js
 * is wired to a real model, each pass can be freshly generated instead
 * of reusing the same 5 steps — this engine already calls out to that
 * same plan object, so no rework will be needed there.
 */

const TASKS_PER_WEEK_COUNT = 18 // ~2.6/day average across 7 days
export const TASKS_PER_WEEK = TASKS_PER_WEEK_COUNT
const DAY_TASK_PATTERN = [3, 3, 2, 3, 3, 2, 2] // sums to 18, alternates 2-3/day

const PASS_FRAMING = [
  { verb: 'Learn', reviewVerb: 'Practice', capVerb: 'Apply' },
  { verb: 'Review', reviewVerb: 'Practice again', capVerb: 'Level up' },
  { verb: 'Revisit', reviewVerb: 'Sharpen', capVerb: 'Master' },
]

function framingFor(passIndex) {
  return PASS_FRAMING[Math.min(passIndex, PASS_FRAMING.length - 1)]
}

/** Splits one macro step into its 3 daily sub-tasks for a given pass. */
function expandStep(step, passIndex) {
  const framing = framingFor(passIndex)
  return [
    {
      name: `${framing.verb}: ${step.name}`,
      why: step.why,
      time: step.time,
      resourceTitle: step.resourceTitle,
      resourceUrl: step.resourceUrl,
      task: `Go through: ${step.resourceTitle}`,
      topic: step.name,
    },
    {
      name: `${framing.reviewVerb}: ${step.name}`,
      why: step.whyMatters || step.why,
      time: step.time,
      resourceTitle: step.resourceTitle,
      resourceUrl: step.resourceUrl,
      task: step.task,
      topic: step.name,
    },
    {
      name: `${framing.capVerb}: ${step.name}`,
      why: 'A small application locks in what you just practiced.',
      time: '⏱️ 20 mins',
      resourceTitle: step.resourceTitle,
      resourceUrl: step.resourceUrl,
      task: `Without looking anything up, redo a mini version of: ${step.task}`,
      topic: step.name,
    },
  ]
}

/**
 * Generates one week's worth of tasks (flat list, ~18 items) starting at
 * the given absolute task offset (weekNumber is 1-indexed).
 * weakTopics: array of topic strings from weakness_profile — up to 2 get
 * inserted as extra booster tasks at the start of the week.
 */
export function generateWeekBatch(macroSteps, weekNumber, weakTopics = []) {
  if (!macroSteps?.length) return []

  const tasksPerCycle = macroSteps.length * 3
  const startOffset = (weekNumber - 1) * TASKS_PER_WEEK

  const tasks = []
  for (let i = 0; i < TASKS_PER_WEEK; i++) {
    const cursor = startOffset + i
    const passIndex = Math.floor(cursor / tasksPerCycle)
    const posInCycle = cursor % tasksPerCycle
    const stepIndex = Math.floor(posInCycle / 3)
    const subIndex = posInCycle % 3
    const step = macroSteps[stepIndex]
    tasks.push(expandStep(step, passIndex)[subIndex])
  }

  if (weakTopics.length) {
    const boosters = weakTopics.slice(0, 2).map((topic) => ({
      name: `Extra practice: ${topic}`,
      why: 'This came up as worth strengthening based on your last check-in.',
      time: '⏱️ 20 mins',
      resourceTitle: '',
      resourceUrl: '',
      task: `Redo a small exercise related to "${topic}" — no rush, just build confidence here.`,
      topic,
      isBooster: true,
    }))
    tasks.splice(1, 0, ...boosters)
  }

  return groupIntoDays(tasks)
}

/** Groups a flat task list into { dayNumber, tasks: [...] } chunks of 2-3. */
function groupIntoDays(tasks) {
  const days = []
  let i = 0
  let dayNumber = 1
  while (i < tasks.length) {
    const count = DAY_TASK_PATTERN[(dayNumber - 1) % DAY_TASK_PATTERN.length]
    days.push({ dayNumber, tasks: tasks.slice(i, i + count) })
    i += count
    dayNumber++
  }
  return days
}

/** Flattens day groups back into a single ordered task list (for display/storage). */
export function flattenDays(days) {
  return days.flatMap((day) =>
    day.tasks.map((t) => ({ ...t, dayNumber: day.dayNumber }))
  )
}

export function totalWeeksForDuration(months) {
  return Math.round((months * 30) / 7)
}

/**
 * Maps each macro step to a done/current/locked status based on where
 * the user currently is in the (possibly repeating) task cycle. Used by
 * the "Full Roadmap" flashcard overview.
 */
export function getMacroProgress(macroSteps, currentIndex) {
  if (!macroSteps?.length) return []
  const tasksPerCycle = macroSteps.length * 3
  const posInCycle = currentIndex % tasksPerCycle
  const activeStepIdx = Math.floor(posInCycle / 3)
  return macroSteps.map((step, i) => ({
    ...step,
    status: i < activeStepIdx ? 'done' : i === activeStepIdx ? 'current' : 'locked',
  }))
}

import { generateRoadmapData } from '@data/roadmaps'
import { getLearningHistory } from '@utils/progressStorage'

function normalizeStep(step) {
  return {
    name: step.name || 'Next step',
    why: step.why || '',
    whyMatters: step.whyMatters || step.why || '',
    time: step.time || '⏱️ 30-45 mins',
    resourceTitle: step.resourceTitle || 'Free resource',
    resourceUrl: step.resourceUrl || '',
    task: step.task || 'Complete one small action today.',
  }
}

function normalizePlan(raw) {
  if (!raw?.field || !Array.isArray(raw.steps) || raw.steps.length === 0) {
    throw new Error('Invalid plan shape from backend')
  }

  const singleWarning = raw.dontDoThisYet
    ? `${raw.dontDoThisYet.warning} — ${raw.dontDoThisYet.reason}`
    : null

  return {
    field: raw.field,
    futurePath: Array.isArray(raw.futurePath) ? raw.futurePath : [],
    dontLearnYet: singleWarning ? [singleWarning] : [],
    steps: raw.steps.slice(0, 3).map(normalizeStep),
  }
}

export async function generateAIRoadmap(answers) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12000)

    const history = getLearningHistory()
    const response = await fetch('/api/generate-roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, history }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) throw new Error(`Backend returned ${response.status}`)

    const raw = await response.json()
    return normalizePlan(raw)

  } catch (err) {
    console.warn('AI roadmap generation failed, using fallback:', err.message)
    return generateRoadmapData(answers)
  }
}

export async function getWelcomeMessage(answers) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const response = await fetch('/api/generate-roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'welcome', answers }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) throw new Error(`Backend returned ${response.status}`)

    const data = await response.json()
    return data.welcomeMessage || null
  } catch (err) {
    console.warn('Failed to get welcome message:', err.message)
    return null
  }
}

export async function getEasierStep(step, field) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch('/api/generate-roadmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'easier',
        step: {
          name: step?.name,
          why: step?.why,
          task: step?.task,
        },
        field,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) throw new Error(`Backend returned ${response.status}`)

    const data = await response.json()
    return data
  } catch (err) {
    console.warn('Failed to get easier step:', err.message)
    return null
  }
}

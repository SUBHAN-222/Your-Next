const KEYS = {
  plan: 'yn_plan',
  index: 'yn_index',
  field: 'yn_field',
  streak: 'yn_streak',
  lastComplete: 'yn_last_complete',
  learningHistory: 'yn_learning_history',
}

export function getSavedProgress() {
  const planRaw = localStorage.getItem(KEYS.plan)
  if (!planRaw) return null

  try {
    const plan = JSON.parse(planRaw)
    if (!plan?.steps?.length) return null

    return {
      plan,
      index: parseInt(localStorage.getItem(KEYS.index) || '0', 10),
      field: localStorage.getItem(KEYS.field) || plan.field || '',
      streak: parseInt(localStorage.getItem(KEYS.streak) || '0', 10),
    }
  } catch {
    return null
  }
}

export function saveProgress(activePlan, currentRoadmapIndex, streak) {
  if (!activePlan) return
  localStorage.setItem(KEYS.plan, JSON.stringify(activePlan))
  localStorage.setItem(KEYS.index, String(currentRoadmapIndex))
  localStorage.setItem(KEYS.field, activePlan.field || '')
  localStorage.setItem(KEYS.streak, String(streak))
}

export function saveLearningHistory(record) {
  try {
    const savedHistory = JSON.parse(localStorage.getItem(KEYS.learningHistory) || '[]')
    const history = Array.isArray(savedHistory) ? savedHistory : []
    history.push(record)
    localStorage.setItem(KEYS.learningHistory, JSON.stringify(history))
  } catch {
    // Learning history should never interrupt the student's roadmap progress.
  }
}

export function clearProgress() {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key))
}

export { KEYS }

export function getLearningHistory() {
  try {
    const raw = localStorage.getItem(KEYS.learningHistory)
    const history = JSON.parse(raw || '[]')
    return Array.isArray(history) ? history : []
  } catch {
    return []
  }
}

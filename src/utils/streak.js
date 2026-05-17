const STREAK_MILESTONES = {
  3: "🔥 3 days straight. You're building a real habit.",
  5: '⚡ 5-day streak. Most people quit before this point.',
  7: "🚀 One full week. You're not a beginner anymore.",
  10: "💎 10-day streak. You're genuinely exceptional.",
}

export function getStreakFromStorage() {
  return parseInt(localStorage.getItem('yn_streak') || '0', 10)
}

/**
 * Updates streak when a step is completed. Returns the new streak count.
 */
export function updateStreakOnComplete() {
  const today = new Date().toDateString()
  const lastComplete = localStorage.getItem('yn_last_complete')
  let streak = getStreakFromStorage()

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()

  if (lastComplete === today) {
    // same day — no change
  } else if (lastComplete === yesterdayStr || streak === 0) {
    streak += 1
  } else {
    streak = 1
  }

  localStorage.setItem('yn_streak', String(streak))
  localStorage.setItem('yn_last_complete', today)

  return streak
}

export function getMomentumMessageForStreak(streak, defaultMessage) {
  return STREAK_MILESTONES[streak] || defaultMessage
}

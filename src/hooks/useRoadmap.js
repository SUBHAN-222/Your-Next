import { useState, useCallback, useMemo, useEffect } from 'react'
import { getDayProgress, saveDayProgress, saveProgress } from '@utils/progressStorage'
import { getStreakFromStorage, updateStreakOnComplete, getMomentumMessageForStreak } from '@utils/streak'

const STEPS_PER_DAY = 3

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const DEFAULT_MOMENTUM_MESSAGES = [
  "⚡ You're building momentum.",
  '🔥 Most beginners quit before this stage. You did not.',
  '💪 You are making real progress. Keep going.',
  '✨ You now know more than you did yesterday.',
  '🚀 One step closer. You are doing this.',
]

/**
 * Step-by-step roadmap state with progress saving and streak support.
 */
export function useRoadmap(activePlan, initialStepIndex = 0, durationMonths = null) {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex)
  const [completedSteps, setCompletedSteps] = useState([])
  const [momentumMessage, setMomentumMessage] = useState('')
  const [showMomentum, setShowMomentum] = useState(false)
  const [streak, setStreak] = useState(() => getStreakFromStorage())
  const [currentDay, setCurrentDay] = useState(1)
  const [dayCompleted, setDayCompleted] = useState(false)
  const [dayCompletedDate, setDayCompletedDate] = useState(null)

  const roadmapData = activePlan
  const totalSteps = roadmapData?.steps?.length || 0
  const totalDays = Math.ceil(totalSteps / STEPS_PER_DAY)
  const dayStartIndex = (currentDay - 1) * STEPS_PER_DAY
  const dayEndIndex = Math.min(currentDay * STEPS_PER_DAY, totalSteps)

  console.log('[useRoadmap] currentStepIndex:', currentStepIndex, 'dayEndIndex:', dayEndIndex, 'currentDay:', currentDay, 'totalSteps:', totalSteps)

  useEffect(() => {
    if (!totalSteps) return

    const today = getLocalDateKey()
    const saved = getDayProgress()
    const maxDay = Math.max(totalDays, 1)
    let nextDay = saved?.currentDay || Math.floor(initialStepIndex / STEPS_PER_DAY) + 1
    let nextCompletedDate = saved?.dayCompletedDate || null
    let nextIndex = initialStepIndex

    nextDay = Math.max(1, Math.min(nextDay, maxDay))

    if (nextCompletedDate && nextCompletedDate < today) {
      if (nextDay < maxDay) {
        nextDay += 1
        nextIndex = (nextDay - 1) * STEPS_PER_DAY
      }
      nextCompletedDate = null
    } else {
      const nextDayStart = (nextDay - 1) * STEPS_PER_DAY
      const nextDayEnd = Math.min(nextDay * STEPS_PER_DAY, totalSteps)
      nextIndex = Math.max(nextDayStart, Math.min(initialStepIndex, nextDayEnd))
    }

    setCurrentDay(nextDay)
    setCurrentStepIndex(nextIndex)
    setDayCompletedDate(nextCompletedDate)
    setDayCompleted(nextCompletedDate === today)
    saveDayProgress({
      startDate: saved?.startDate || today,
      currentDay: nextDay,
      dayCompletedDate: nextCompletedDate,
      durationMonths: Number(durationMonths) || saved?.durationMonths || null,
    })
  }, [durationMonths, initialStepIndex, totalDays, totalSteps])

  const todaySteps = useMemo(() => {
    if (!roadmapData?.steps) return []
    return roadmapData.steps.slice(dayStartIndex, dayEndIndex)
  }, [roadmapData, dayStartIndex, dayEndIndex])

  const currentStep = useMemo(() => {
    if (!roadmapData?.steps || dayCompleted) return null
    if (currentStepIndex < dayStartIndex || currentStepIndex >= dayEndIndex) return null
    return roadmapData.steps[currentStepIndex]
  }, [roadmapData, currentStepIndex, dayCompleted, dayStartIndex, dayEndIndex])

  const isComplete = !roadmapData?.steps || currentStepIndex >= totalSteps
  const completedTodayCount = Math.max(0, Math.min(currentStepIndex - dayStartIndex, todaySteps.length))
  const totalCompleted = Math.min(currentStepIndex, totalSteps)

  const persistProgress = useCallback(
    (index) => {
      if (!roadmapData) return
      saveProgress(roadmapData, index, getStreakFromStorage(), durationMonths)
      setStreak(getStreakFromStorage())
    },
    [durationMonths, roadmapData]
  )

  const completeCurrentStep = useCallback(() => {
    if (!currentStep) return

    setCompletedSteps((prev) => prev.includes(currentStepIndex) ? prev : [...prev, currentStepIndex])

    const newStreak = updateStreakOnComplete()
    setStreak(newStreak)

    const defaultMsg =
      DEFAULT_MOMENTUM_MESSAGES[Math.min(currentStepIndex, DEFAULT_MOMENTUM_MESSAGES.length - 1)]
    setMomentumMessage(getMomentumMessageForStreak(newStreak, defaultMsg))
    setShowMomentum(true)

    setCurrentStepIndex((prevIndex) => {
      const nextIndex = prevIndex + 1
      persistProgress(nextIndex)
      if (nextIndex >= dayEndIndex) {
        const today = getLocalDateKey()
        const saved = getDayProgress()
        setDayCompleted(true)
        setDayCompletedDate(today)
        saveDayProgress({
          startDate: saved?.startDate || today,
          currentDay,
          dayCompletedDate: today,
          durationMonths: Number(durationMonths) || saved?.durationMonths || null,
        })
      }
      return nextIndex
    })
  }, [currentDay, currentStep, dayEndIndex, durationMonths, persistProgress])

  const deferCurrentStep = useCallback(() => {
    persistProgress(currentStepIndex)
  }, [currentStepIndex, persistProgress])

  const hideMomentum = useCallback(() => {
    setShowMomentum(false)
  }, [])

  const reset = useCallback(() => {
    setCurrentStepIndex(0)
    setCompletedSteps([])
    setMomentumMessage('')
    setShowMomentum(false)
    setCurrentDay(1)
    setDayCompleted(false)
    setDayCompletedDate(null)
  }, [])

  const startNextDay = useCallback(() => {
    const nextDay = Math.min(currentDay + 1, totalDays)
    const nextDayStart = (nextDay - 1) * STEPS_PER_DAY
    setCurrentDay(nextDay)
    setDayCompleted(false)
    setDayCompletedDate(null)
    setCurrentStepIndex(nextDayStart)
    const today = getLocalDateKey()
    const saved = getDayProgress()
    saveDayProgress({
      startDate: saved?.startDate || today,
      currentDay: nextDay,
      dayCompletedDate: null,
      durationMonths: Number(durationMonths) || saved?.durationMonths || null,
    })
    persistProgress(nextDayStart)
  }, [currentDay, totalDays, durationMonths, persistProgress])

  const getStepStatus = useCallback(
    (index) => {
      if (index < currentStepIndex) return 'done'
      if (index === currentStepIndex && index < dayEndIndex && !dayCompleted) return 'current'
      return 'locked'
    },
    [currentStepIndex, dayCompleted, dayEndIndex]
  )

  return {
    roadmapData,
    currentStep,
    currentStepIndex,
    completedSteps,
    isComplete,
    currentDay,
    totalDays,
    dayCompleted,
    dayCompletedDate,
    todaySteps,
    tomorrowTeaser: roadmapData?.tomorrowTeaser || null,
    completedTodayCount,
    totalCompleted,
    streak,
    momentumMessage,
    showMomentum,
    completeCurrentStep,
    deferCurrentStep,
    startNextDay,
    hideMomentum,
    reset,
    getStepStatus,
  }
}

export default useRoadmap

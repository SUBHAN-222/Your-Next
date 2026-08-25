import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { generateWeekBatch, totalWeeksForDuration } from '@services/dailyTaskEngine'
import { buildLevelCheckQuestion, shouldTriggerCheck } from '@services/levelCheckEngine'
import {
  createDailyRoadmapInSupabase,
  appendWeekBatch,
  markTaskComplete,
  recordLevelCheck,
  getTopWeakTopics,
} from '@services/supabaseSync'
import { getStreakFromStorage, updateStreakOnComplete, getMomentumMessageForStreak } from '@utils/streak'

const DEFAULT_MOMENTUM_MESSAGES = [
  "⚡ You're building momentum.",
  '🔥 Most beginners quit before this stage. You did not.',
  '💪 You are making real progress. Keep going.',
  '✨ You now know more than you did yesterday.',
  '🚀 One step closer. You are doing this.',
]

/**
 * plan: { field, macroSteps, durationMonths } — from onboarding + duration pick.
 */
export function useDailyRoadmap(plan) {
  const [tasks, setTasks] = useState([]) // flat, ordered, with Supabase row ids attached once synced
  const [currentIndex, setCurrentIndex] = useState(0)
  const [roadmapId, setRoadmapId] = useState(null)
  const [totalWeeks, setTotalWeeks] = useState(0)
  const [loadedWeeks, setLoadedWeeks] = useState(0)
  const [streak, setStreak] = useState(() => getStreakFromStorage())
  const [momentumMessage, setMomentumMessage] = useState('')
  const [showMomentum, setShowMomentum] = useState(false)
  const [pendingCheck, setPendingCheck] = useState(null)
  const initRef = useRef(false)

  // Initial setup: generate + save week 1 as soon as we have a plan.
  useEffect(() => {
    if (!plan || initRef.current) return
    initRef.current = true

    const days = generateWeekBatch(plan.macroSteps, 1, [])
    const flat = days.flatMap((d) => d.tasks.map((t) => ({ ...t, dayNumber: d.dayNumber })))
    setTasks(flat)
    setTotalWeeks(totalWeeksForDuration(plan.durationMonths))
    setLoadedWeeks(1)

    createDailyRoadmapInSupabase(plan.field, plan.durationMonths, days).then((result) => {
      if (!result) return
      setRoadmapId(result.roadmapId)
      setTasks((prev) =>
        prev.map((t, i) => ({ ...t, dbId: result.steps[i]?.id }))
      )
    })
  }, [plan])

  const currentTask = useMemo(() => tasks[currentIndex] || null, [tasks, currentIndex])
  const isComplete = tasks.length > 0 && currentIndex >= tasks.length && loadedWeeks >= totalWeeks

  const getTaskStatus = useCallback(
    (index) => {
      if (index < currentIndex) return 'done'
      if (index === currentIndex) return 'current'
      return 'locked'
    },
    [currentIndex]
  )

  /** Loads the next week's tasks, biased toward whatever's currently weak. */
  const loadNextWeek = useCallback(async () => {
    if (!plan || loadedWeeks >= totalWeeks) return
    const weakTopics = await getTopWeakTopics(2)
    const nextWeekNumber = loadedWeeks + 1
    const days = generateWeekBatch(plan.macroSteps, nextWeekNumber, weakTopics)
    const flat = days.flatMap((d) => d.tasks.map((t) => ({ ...t, dayNumber: d.dayNumber })))

    setTasks((prev) => [...prev, ...flat])
    setLoadedWeeks(nextWeekNumber)

    if (roadmapId) {
      const startIndex = tasks.length
      const savedSteps = await appendWeekBatch(roadmapId, days, startIndex)
      if (savedSteps) {
        setTasks((prev) =>
          prev.map((t, i) =>
            i >= startIndex ? { ...t, dbId: savedSteps[i - startIndex]?.id } : t
          )
        )
      }
    }
  }, [plan, loadedWeeks, totalWeeks, roadmapId, tasks.length])

  // Auto-load the next week once the user is within 3 tasks of running out.
  useEffect(() => {
    if (!tasks.length) return
    if (currentIndex >= tasks.length - 3 && loadedWeeks < totalWeeks) {
      loadNextWeek()
    }
  }, [currentIndex, tasks.length, loadedWeeks, totalWeeks, loadNextWeek])

  const advanceToNext = useCallback(() => {
    const nextIndex = currentIndex + 1
    setCurrentIndex(nextIndex)

    const newStreak = updateStreakOnComplete()
    setStreak(newStreak)
    const defaultMsg = DEFAULT_MOMENTUM_MESSAGES[Math.min(currentIndex, DEFAULT_MOMENTUM_MESSAGES.length - 1)]
    setMomentumMessage(getMomentumMessageForStreak(newStreak, defaultMsg))
    setShowMomentum(true)
  }, [currentIndex])

  const completeCurrentTask = useCallback(async () => {
    const task = tasks[currentIndex]
    if (!task) return

    const result = await markTaskComplete(task.dbId, roadmapId)

    if (result && shouldTriggerCheck(result.tasksSinceCheck, result.threshold)) {
      const recentTasks = tasks.slice(Math.max(0, currentIndex - 6), currentIndex + 1)
      const question = buildLevelCheckQuestion(recentTasks)
      if (question) {
        setPendingCheck({ ...question, stepId: task.dbId })
        return // wait for the level check before advancing
      }
    }

    advanceToNext()
  }, [tasks, currentIndex, roadmapId, advanceToNext])

  const answerLevelCheck = useCallback(
    async (selectedAnswer, wasCorrect) => {
      if (!pendingCheck) return
      await recordLevelCheck(
        roadmapId,
        pendingCheck.stepId,
        pendingCheck.topic,
        pendingCheck.question,
        selectedAnswer,
        wasCorrect
      )
      setPendingCheck(null)
      advanceToNext()
    },
    [pendingCheck, roadmapId, advanceToNext]
  )

  const hideMomentum = useCallback(() => setShowMomentum(false), [])

  return {
    currentTask,
    currentIndex,
    tasks,
    isComplete,
    streak,
    momentumMessage,
    showMomentum,
    hideMomentum,
    pendingCheck,
    answerLevelCheck,
    completeCurrentTask,
    getTaskStatus,
    loadedWeeks,
    totalWeeks,
  }
}

export default useDailyRoadmap

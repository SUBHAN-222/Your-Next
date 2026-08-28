import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { generateWeekBatch, totalWeeksForDuration, getMacroProgress, TASKS_PER_WEEK } from '@services/dailyTaskEngine'
import { buildLevelCheckQuiz, shouldTriggerCheck, randomCheckThreshold } from '@services/levelCheckEngine'
import {
  createDailyRoadmapInSupabase,
  appendWeekBatch,
  markTaskComplete,
  recordLevelCheckQuiz,
  recordTaskFeedback,
  getTopWeakTopics,
  getProgressStats,
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
  const [tasks, setTasks] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [roadmapId, setRoadmapId] = useState(null)
  const [totalWeeks, setTotalWeeks] = useState(0)
  const [loadedWeeks, setLoadedWeeks] = useState(0)
  const [streak, setStreak] = useState(() => getStreakFromStorage())
  const [momentumMessage, setMomentumMessage] = useState('')
  const [showMomentum, setShowMomentum] = useState(false)
  const [awaitingFeedback, setAwaitingFeedback] = useState(false)
  const [pendingQuiz, setPendingQuiz] = useState(null)
  const [quizResult, setQuizResult] = useState(null)
  const [showFullRoadmap, setShowFullRoadmap] = useState(false)
  const [progressStats, setProgressStats] = useState({ avgScore: null, weakTopicsCount: 0 })
  const initRef = useRef(false)

  // Local, immediate trigger counter — does NOT wait on Supabase round
  // trips, so the surprise check fires reliably even if the DB save for
  // an earlier task is still in flight (or offline).
  const tasksSinceCheckRef = useRef(0)
  const checkThresholdRef = useRef(randomCheckThreshold())

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
      setTasks((prev) => prev.map((t, i) => ({ ...t, dbId: result.steps[i]?.id })))
    })

    getProgressStats().then(setProgressStats)
  }, [plan])

  const currentTask = useMemo(() => tasks[currentIndex] || null, [tasks, currentIndex])
  const isComplete = tasks.length > 0 && currentIndex >= tasks.length && loadedWeeks >= totalWeeks
  const macroProgress = useMemo(
    () => (plan?.macroSteps ? getMacroProgress(plan.macroSteps, currentIndex) : []),
    [plan, currentIndex]
  )

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
          prev.map((t, i) => (i >= startIndex ? { ...t, dbId: savedSteps[i - startIndex]?.id } : t))
        )
      }
    }
  }, [plan, loadedWeeks, totalWeeks, roadmapId, tasks.length])

  useEffect(() => {
    if (!tasks.length) return
    if (currentIndex >= tasks.length - 3 && loadedWeeks < totalWeeks) {
      loadNextWeek()
    }
  }, [currentIndex, tasks.length, loadedWeeks, totalWeeks, loadNextWeek])

  const advanceToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1
      const newStreak = updateStreakOnComplete()
      setStreak(newStreak)
      const defaultMsg = DEFAULT_MOMENTUM_MESSAGES[Math.min(prevIndex, DEFAULT_MOMENTUM_MESSAGES.length - 1)]
      setMomentumMessage(getMomentumMessageForStreak(newStreak, defaultMsg))
      setShowMomentum(true)
      return nextIndex
    })
  }, [])

  /** Step 1: user hits "Mark as Complete" -> ask how it went. */
  const requestCompletion = useCallback(() => {
    if (!currentTask) return
    setAwaitingFeedback(true)
  }, [currentTask])

  /** Step 2: user answers the feedback prompt -> save (best-effort), maybe trigger quiz, else advance. */
  const submitFeedback = useCallback(
    async (feedbackValue) => {
      const task = tasks[currentIndex]
      if (!task) return
      setAwaitingFeedback(false)

      // Persist in the background — never block the trigger decision on this.
      markTaskComplete(task.dbId, roadmapId, feedbackValue)
      recordTaskFeedback(task.topic || task.name, feedbackValue)

      tasksSinceCheckRef.current += 1

      if (shouldTriggerCheck(tasksSinceCheckRef.current, checkThresholdRef.current)) {
        const recentTasks = tasks.slice(Math.max(0, currentIndex - 14), currentIndex + 1)
        const questions = buildLevelCheckQuiz(recentTasks, plan.macroSteps, 10)
        if (questions.length >= 4) {
          tasksSinceCheckRef.current = 0
          checkThresholdRef.current = randomCheckThreshold()
          setPendingQuiz({ questions, stepId: task.dbId })
          return
        }
      }

      advanceToNext()
    },
    [tasks, currentIndex, roadmapId, plan, advanceToNext]
  )

  /** Step 3 (only if quiz triggered): all 10 questions answered. */
  const finishQuiz = useCallback(
    async (answeredQuestions) => {
      const result = await recordLevelCheckQuiz(roadmapId, pendingQuiz?.stepId, answeredQuestions)
      setPendingQuiz(null)
      setQuizResult(result)
      getProgressStats().then(setProgressStats)
    },
    [roadmapId, pendingQuiz]
  )

  const continueAfterQuizResults = useCallback(() => {
    setQuizResult(null)
    advanceToNext()
  }, [advanceToNext])

  const hideMomentum = useCallback(() => setShowMomentum(false), [])
  const toggleFullRoadmap = useCallback(() => setShowFullRoadmap((v) => !v), [])

  return {
    currentTask,
    currentIndex,
    tasks,
    isComplete,
    streak,
    momentumMessage,
    showMomentum,
    hideMomentum,
    awaitingFeedback,
    requestCompletion,
    submitFeedback,
    pendingQuiz,
    finishQuiz,
    quizResult,
    continueAfterQuizResults,
    macroProgress,
    showFullRoadmap,
    toggleFullRoadmap,
    loadedWeeks,
    totalWeeks,
    progressStats,
    totalPlannedTasks: totalWeeks * TASKS_PER_WEEK,
  }
}

export default useDailyRoadmap

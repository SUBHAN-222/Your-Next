import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { saveProgress, saveQuizResult } from '@utils/progressStorage'
import { buildLevelCheckQuiz, scoreQuiz } from '@services/levelCheckEngine'
import { getStreakFromStorage, updateStreakOnComplete, getMomentumMessageForStreak } from '@utils/streak'

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
export function useRoadmap(activePlan, initialStepIndex = 0) {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex)
  const [completedSteps, setCompletedSteps] = useState([])
  const [momentumMessage, setMomentumMessage] = useState('')
  const [showMomentum, setShowMomentum] = useState(false)
  const [streak, setStreak] = useState(() => getStreakFromStorage())
  const [pendingQuiz, setPendingQuiz] = useState(null)
  const [quizResult, setQuizResult] = useState(null)
  const tasksSinceCheck = useRef(0)

  const roadmapData = activePlan

  useEffect(() => {
    setCurrentStepIndex(initialStepIndex)
  }, [initialStepIndex])

  const currentStep = useMemo(() => {
    if (!roadmapData?.steps) return null
    return roadmapData.steps[currentStepIndex]
  }, [roadmapData, currentStepIndex])

  const isComplete = !roadmapData?.steps || currentStepIndex >= roadmapData.steps.length

  const persistProgress = useCallback(
    (index) => {
      if (!roadmapData) return
      saveProgress(roadmapData, index, getStreakFromStorage())
      setStreak(getStreakFromStorage())
    },
    [roadmapData]
  )

  const completeCurrentStep = useCallback(() => {
    setCompletedSteps((prev) => [...prev, currentStepIndex])

    const newStreak = updateStreakOnComplete()
    setStreak(newStreak)

    const defaultMsg =
      DEFAULT_MOMENTUM_MESSAGES[Math.min(currentStepIndex, DEFAULT_MOMENTUM_MESSAGES.length - 1)]
    setMomentumMessage(getMomentumMessageForStreak(newStreak, defaultMsg))
    setShowMomentum(true)

    const nextIndex = currentStepIndex + 1
    tasksSinceCheck.current += 1

    if (tasksSinceCheck.current >= 2 && !pendingQuiz && roadmapData?.steps?.length) {
      const completedTasks = roadmapData.steps
        .slice(0, nextIndex)
        .map((step) => ({ name: step.name, topic: step.name }))
      const questions = buildLevelCheckQuiz(completedTasks, roadmapData.steps, 10)

      if (questions.length >= 3) {
        setPendingQuiz({ questions })
        tasksSinceCheck.current = 0
      }
    }

    setCurrentStepIndex(nextIndex)
    persistProgress(nextIndex)
  }, [currentStepIndex, pendingQuiz, persistProgress, roadmapData])

  const finishQuiz = useCallback((answeredQuestions) => {
    const result = scoreQuiz(answeredQuestions)
    saveQuizResult(result)
    setQuizResult(result)
    setPendingQuiz(null)
  }, [])

  const dismissQuizResult = useCallback(() => {
    setQuizResult(null)
  }, [])

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
    setPendingQuiz(null)
    setQuizResult(null)
    tasksSinceCheck.current = 0
  }, [])

  const getStepStatus = useCallback(
    (index) => {
      if (index < currentStepIndex) return 'done'
      if (index === currentStepIndex) return 'current'
      return 'locked'
    },
    [currentStepIndex]
  )

  return {
    roadmapData,
    currentStep,
    currentStepIndex,
    completedSteps,
    isComplete,
    streak,
    momentumMessage,
    showMomentum,
    pendingQuiz,
    quizResult,
    completeCurrentStep,
    finishQuiz,
    dismissQuizResult,
    deferCurrentStep,
    hideMomentum,
    reset,
    getStepStatus,
  }
}

export default useRoadmap

import { useState, useCallback, useMemo } from 'react'
import { getNextQuestion, TOTAL_STEPS } from '@data/questions'

/**
 * Derive the step to start on from any answers already present.
 * - Fresh quiz (no answers)        -> step 0
 * - All questions answered (resume)-> last step (TOTAL_STEPS - 1)
 * - Partially answered             -> first unanswered step
 * This keeps "back" navigation consistent when returning to the quiz
 * e.g. from the "Your Pace" duration screen.
 */
export function deriveStartStep(answers) {
  let i = 0
  while (i < TOTAL_STEPS && answers[i] !== undefined) i++
  return Math.min(i, TOTAL_STEPS - 1)
}

/**
 * Custom hook for managing quiz state and navigation
 * @returns {Object} Quiz state and handlers
 */
export function useQuiz(answers, onAnswer) {
  const [currentStep, setCurrentStep] = useState(() => deriveStartStep(answers))
  const [isGoingBack, setIsGoingBack] = useState(false)

  // Get current question based on answers and current step
  const currentQuestion = useMemo(() => {
    return getNextQuestion(answers, currentStep)
  }, [answers, currentStep])

  // Only complete after all steps — avoid skipping when a branch returns no question
  const isQuizComplete = useMemo(() => {
    if (currentQuestion) return false
    return currentStep >= TOTAL_STEPS
  }, [currentQuestion, currentStep])

  // Progress percentage for the progress bar
  const progress = useMemo(() => {
    return Math.min(100, ((currentStep + 1) / TOTAL_STEPS) * 100)
  }, [currentStep])

  // Handle selecting an answer
  const handleSelect = useCallback((value, index) => {
    onAnswer(currentStep, value, index)
  }, [currentStep, onAnswer])

  // Move to next question
  const nextStep = useCallback(() => {
    setIsGoingBack(false)
    setCurrentStep(prev => prev + 1)
  }, [])

  // Move to previous question
  const prevStep = useCallback(() => {
    setIsGoingBack(true)
    setCurrentStep(prev => Math.max(0, prev - 1))
  }, [])

  // Check if an answer is selected for current step
  const isAnswered = useMemo(() => {
    return answers[currentStep] !== undefined
  }, [answers, currentStep])

  // Get the selected answer for current step
  const selectedAnswer = useMemo(() => {
    return answers[currentStep]
  }, [answers, currentStep])

  // Reset quiz to beginning
  const reset = useCallback(() => {
    setCurrentStep(0)
    setIsGoingBack(false)
  }, [])

  return {
    currentStep,
    currentQuestion,
    isQuizComplete,
    progress,
    totalSteps: TOTAL_STEPS,
    isAnswered,
    selectedAnswer,
    isGoingBack,
    handleSelect,
    nextStep,
    prevStep,
    reset
  }
}
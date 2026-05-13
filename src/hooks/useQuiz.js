import { useState, useCallback, useMemo } from 'react'
import { getNextQuestion, TOTAL_STEPS } from '@data/questions'

/**
 * Custom hook for managing quiz state and navigation
 * @returns {Object} Quiz state and handlers
 */
export function useQuiz(answers, onAnswer) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isGoingBack, setIsGoingBack] = useState(false)

  // Get current question based on answers and current step
  const currentQuestion = useMemo(() => {
    return getNextQuestion(answers, currentStep)
  }, [answers, currentStep])

  // Check if we should show the question or complete the quiz
  const isQuizComplete = !currentQuestion

  // Progress percentage for the progress bar
  const progress = useMemo(() => {
    return ((currentStep + 1) / TOTAL_STEPS) * 100
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
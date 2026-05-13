import { useState, useCallback, useMemo } from 'react'
import { generateRoadmapData } from '@data/roadmaps'

const MOMENTUM_MESSAGES = [
  "⚡ You're building momentum.",
  '🔥 Most beginners quit before this stage. You did not.',
  '💪 You are making real progress. Keep going.',
  '✨ You now know more than you did yesterday.',
  '🚀 One step closer. You are doing this.'
]

/**
 * Custom hook for managing roadmap state and step completion
 * @param {Object} answers - Quiz answers to generate roadmap
 * @returns {Object} Roadmap state and handlers
 */
export function useRoadmap(answers) {
  // Generate roadmap data based on answers
  const roadmapData = useMemo(() => {
    return generateRoadmapData(answers)
  }, [answers])

  // Current step index
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  
  // Completed steps tracking
  const [completedSteps, setCompletedSteps] = useState([])
  
  // Momentum banner message
  const [momentumMessage, setMomentumMessage] = useState('')
  
  // Show momentum banner
  const [showMomentum, setShowMomentum] = useState(false)

  // Current step data
  const currentStep = useMemo(() => {
    return roadmapData.steps[currentStepIndex]
  }, [roadmapData.steps, currentStepIndex])

  // Check if all steps are completed
  const isComplete = currentStepIndex >= roadmapData.steps.length

  // Handle completing current step
  const completeStep = useCallback(() => {
    // Add to completed steps
    setCompletedSteps(prev => [...prev, currentStepIndex])
    
    // Show momentum message
    const messageIndex = Math.min(currentStepIndex, MOMENTUM_MESSAGES.length - 1)
    setMomentumMessage(MOMENTUM_MESSAGES[messageIndex])
    setShowMomentum(true)
    
    // Move to next step
    setCurrentStepIndex(prev => prev + 1)
  }, [currentStepIndex])

  // Hide momentum banner
  const hideMomentum = useCallback(() => {
    setShowMomentum(false)
  }, [])

  // Reset roadmap to beginning
  const reset = useCallback(() => {
    setCurrentStepIndex(0)
    setCompletedSteps([])
    setMomentumMessage('')
    setShowMomentum(false)
  }, [])

  // Get step status for preview list
  const getStepStatus = useCallback((index) => {
    if (index < currentStepIndex) return 'done'
    if (index === currentStepIndex) return 'current'
    return 'locked'
  }, [currentStepIndex])

  return {
    // Data
    roadmapData,
    currentStep,
    currentStepIndex,
    completedSteps,
    isComplete,
    
    // Momentum
    momentumMessage,
    showMomentum,
    
    // Actions
    completeStep,
    hideMomentum,
    reset,
    getStepStatus
  }
}
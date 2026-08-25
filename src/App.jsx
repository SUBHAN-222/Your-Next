import { useState, useCallback, useEffect } from 'react'
import LandingPage from '@pages/LandingPage'
import OnboardingPage from '@pages/OnboardingPage'
import RoadmapPage from '@pages/RoadmapPage'
import AIRoadmapLoading from '@components/AIRoadmapLoading'
import FeedbackModal from '@components/FeedbackModal'
import { generateAIRoadmap, getWelcomeMessage } from '@services/aiRoadmap'
import { getSavedProgress, clearProgress, saveProgress } from '@utils/progressStorage'
import { getStreakFromStorage } from '@utils/streak'
import posthog, { initPostHog } from '@lib/posthog'

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing')
  const [answers, setAnswers] = useState({})
  const [quizSession, setQuizSession] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [activePlan, setActivePlan] = useState(null)
  const [roadmapIndex, setRoadmapIndex] = useState(0)
  const [savedProgress, setSavedProgress] = useState(null)
  const [welcomeMessage, setWelcomeMessage] = useState(null)
  const [quizStartTime, setQuizStartTime] = useState(null)

  useEffect(() => {
    initPostHog()
  }, [])

  useEffect(() => {
    setSavedProgress(getSavedProgress())
  }, [currentScreen])

  const handleStartQuiz = useCallback(() => {
    setAnswers({})
    setQuizSession((n) => n + 1)
    setCurrentScreen('onboarding')
    setQuizStartTime(Date.now())
    posthog.capture('quiz_started')
  }, [])

  const handleAnswer = useCallback((stepIndex, value, index) => {
    setAnswers((prev) => ({
      ...prev,
      [stepIndex]: { val: value, idx: index },
    }))
  }, [])

  const handleRestart = useCallback(() => {
    clearProgress()
    setAnswers({})
    setActivePlan(null)
    setRoadmapIndex(0)
    setSavedProgress(null)
    setQuizSession((n) => n + 1)
    setCurrentScreen('landing')
    posthog.capture('quiz_restarted')
  }, [])

  const handleStartFresh = useCallback(() => {
    clearProgress()
    setSavedProgress(null)
  }, [])

  const handleContinueJourney = useCallback(() => {
    const saved = getSavedProgress()
    if (!saved) return
    setActivePlan(saved.plan)
    setRoadmapIndex(saved.index)
    setCurrentScreen('roadmap')
  }, [])

  const handleCompleteQuiz = useCallback(() => {
    setCurrentScreen('generating')
    const timeTakenMs = quizStartTime ? Date.now() - quizStartTime : 0
    const minutes = Math.floor(timeTakenMs / 60000)
    const seconds = Math.floor((timeTakenMs % 60000) / 1000)
    const timeTakenStr = `${minutes}m ${seconds}s`
    
    console.log("Firing quiz_completed")
    posthog.capture('quiz_completed', { 
      total_answers: Object.keys(answers).length,
      score: 100, // Dummy score, since we don't have a real score
      time_taken: timeTakenStr
    })
  }, [answers, quizStartTime])

  useEffect(() => {
    if (currentScreen !== 'generating') return

    let cancelled = false

    // Fire both calls in parallel — welcome message shows as soon as it arrives
    getWelcomeMessage(answers).then((msg) => {
      if (cancelled) return
      if (msg) setWelcomeMessage(msg)
    })

    const minDelay = new Promise((resolve) => setTimeout(resolve, 4500))

    Promise.all([generateAIRoadmap(answers), minDelay]).then(([plan]) => {
      if (cancelled) return
      setActivePlan(plan)
      setRoadmapIndex(0)
      saveProgress(plan, 0, getStreakFromStorage())
      setSavedProgress(getSavedProgress())
      setWelcomeMessage(null)
      setCurrentScreen('roadmap')
    })

    return () => {
      cancelled = true
    }
  }, [currentScreen, answers])

  useEffect(() => {
    const trackDropOff = () => {
      if (currentScreen === 'onboarding') {
        console.log("Firing user_dropped_off")
        posthog.capture('user_dropped_off', {
          step: 'quiz',
          answers_so_far: Object.keys(answers).length
        }, { transport: 'sendBeacon' })
      }
    }

    const handleBeforeUnload = () => {
      trackDropOff()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackDropOff()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [currentScreen, answers])

  const handleUpdateStep = useCallback((stepIndex, updatedStepData) => {
    setActivePlan((prev) => {
      if (!prev || !Array.isArray(prev.steps)) return prev
      const updatedSteps = prev.steps.map((step, idx) =>
        idx === stepIndex ? { ...step, ...updatedStepData } : step
      )
      return { ...prev, steps: updatedSteps }
    })
  }, [])

  return (
    <>
      {currentScreen === 'landing' && (
        <LandingPage
          onStart={handleStartQuiz}
          savedProgress={savedProgress}
          onContinue={handleContinueJourney}
          onStartFresh={handleStartFresh}
        />
      )}

      {currentScreen === 'onboarding' && (
        <OnboardingPage
          key={quizSession}
          answers={answers}
          onAnswer={handleAnswer}
          onComplete={handleCompleteQuiz}
        />
      )}

      {currentScreen === 'generating' && <AIRoadmapLoading welcomeMessage={welcomeMessage} />}

      {currentScreen === 'roadmap' && activePlan && (
        <RoadmapPage
          activePlan={activePlan}
          initialStepIndex={roadmapIndex}
          onRestart={handleRestart}
          onUpdateStep={handleUpdateStep}
        />
      )}

      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
      />

      <button
        className="feedback-btn-floating"
        onClick={() => setShowFeedback(true)}
        aria-label="Give feedback"
      >
        Give Feedback
      </button>
    </>
  )
}

export default App

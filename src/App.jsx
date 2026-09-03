import { useState, useCallback, useEffect } from 'react'
import LandingPage from '@pages/LandingPage'
import OnboardingPage from '@pages/OnboardingPage'
import DurationPage from '@pages/DurationPage'
import RoadmapPage from '@pages/RoadmapPage'
import AIRoadmapLoading from '@components/AIRoadmapLoading'
import FeedbackModal from '@components/FeedbackModal'
import { generateAIRoadmap, getWelcomeMessage } from '@services/aiRoadmap'
import { ensureAuthSession, saveQuizAnswers } from '@services/supabaseSync'
import { getSavedProgress, clearProgress, saveDayProgress, saveProgress } from '@utils/progressStorage'
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
  const [durationMonths, setDurationMonths] = useState(null)

  useEffect(() => {
    initPostHog()
    ensureAuthSession()
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
    setDurationMonths(null)
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
    setDurationMonths(saved.durationMonths)
    setCurrentScreen('roadmap')
  }, [])

  const handleCompleteQuiz = useCallback(() => {
    setCurrentScreen('duration')
    const timeTakenMs = quizStartTime ? Date.now() - quizStartTime : 0
    const minutes = Math.floor(timeTakenMs / 60000)
    const seconds = Math.floor((timeTakenMs % 60000) / 1000)
    const timeTakenStr = `${minutes}m ${seconds}s`

    posthog.capture('quiz_completed', {
      total_answers: Object.keys(answers).length,
      score: 100,
      time_taken: timeTakenStr
    })
  }, [answers, quizStartTime])

  const handleSelectDuration = useCallback((months) => {
    setDurationMonths(months)
    setCurrentScreen('generating')
    posthog.capture('duration_selected', { months })
  }, [])

  useEffect(() => {
    if (currentScreen !== 'generating' || !durationMonths) return

    let cancelled = false

    getWelcomeMessage(answers).then((msg) => {
      if (cancelled) return
      if (msg) setWelcomeMessage(msg)
    })

    const minDelay = new Promise((resolve) => setTimeout(resolve, 4500))

    Promise.all([generateAIRoadmap(answers, durationMonths), minDelay]).then(([plan]) => {
      if (cancelled) return
      setActivePlan(plan)
      setRoadmapIndex(0)
      saveProgress(plan, 0, getStreakFromStorage(), durationMonths)
      const now = new Date()
      const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      saveDayProgress({
        startDate,
        currentDay: 1,
        dayCompletedDate: null,
        durationMonths,
      })
      setSavedProgress(getSavedProgress())
      setWelcomeMessage(null)
      setCurrentScreen('roadmap')

      // Fire-and-forget: save to Supabase without blocking the UI
      saveQuizAnswers(answers, plan.field)
    })

    return () => {
      cancelled = true
    }
  }, [currentScreen, durationMonths, answers])

  useEffect(() => {
    const trackDropOff = () => {
      if (currentScreen === 'onboarding') {
        posthog.capture('user_dropped_off', {
          step: 'quiz',
          answers_so_far: Object.keys(answers).length
        }, { transport: 'sendBeacon' })
      }
    }

    const handleBeforeUnload = () => trackDropOff()
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') trackDropOff()
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

      {currentScreen === 'duration' && (
        <DurationPage onSelect={handleSelectDuration} />
      )}

      {currentScreen === 'generating' && <AIRoadmapLoading welcomeMessage={welcomeMessage} />}

      {currentScreen === 'roadmap' && activePlan && (
        <RoadmapPage
          activePlan={activePlan}
          initialStepIndex={roadmapIndex}
          durationMonths={durationMonths}
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
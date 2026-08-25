import { useState, useCallback, useEffect } from 'react'
import LandingPage from '@pages/LandingPage'
import OnboardingPage from '@pages/OnboardingPage'
import DurationPage from '@pages/DurationPage'
import DailyRoadmapPage from '@pages/DailyRoadmapPage'
import AIRoadmapLoading from '@components/AIRoadmapLoading'
import FeedbackModal from '@components/FeedbackModal'
import { generateAIRoadmap } from '@services/aiRoadmap'
import { ensureAuthSession, saveQuizAnswers } from '@services/supabaseSync'
import { getSavedProgress } from '@utils/progressStorage'
import posthog, { initPostHog } from '@lib/posthog'

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing')
  const [answers, setAnswers] = useState({})
  const [quizSession, setQuizSession] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [activePlan, setActivePlan] = useState(null)
  const [durationMonths, setDurationMonths] = useState(null)
  const [savedProgress, setSavedProgress] = useState(null)
  const [quizStartTime, setQuizStartTime] = useState(null)

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
    setAnswers({})
    setActivePlan(null)
    setDurationMonths(null)
    setQuizSession((n) => n + 1)
    setCurrentScreen('landing')
    posthog.capture('quiz_restarted')
  }, [])

  const handleStartFresh = useCallback(() => {
    setSavedProgress(null)
  }, [])

  const handleContinueJourney = useCallback(() => {
    // Resuming a saved daily-task session mid-way isn't wired yet —
    // send them back into a fresh quiz for now rather than showing
    // a broken continue state.
    handleStartQuiz()
  }, [handleStartQuiz])

  const handleCompleteQuiz = useCallback(() => {
    setCurrentScreen('duration')
    const timeTakenMs = quizStartTime ? Date.now() - quizStartTime : 0
    const minutes = Math.floor(timeTakenMs / 60000)
    const seconds = Math.floor((timeTakenMs % 60000) / 1000)
    const timeTakenStr = `${minutes}m ${seconds}s`

    posthog.capture('quiz_completed', {
      total_answers: Object.keys(answers).length,
      score: 100,
      time_taken: timeTakenStr,
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

    generateAIRoadmap(answers).then((rawPlan) => {
      if (cancelled) return

      const dailyPlan = {
        field: rawPlan.field,
        futurePath: rawPlan.futurePath,
        dontLearnYet: rawPlan.dontLearnYet,
        macroSteps: rawPlan.steps,
        durationMonths,
      }

      setActivePlan(dailyPlan)
      setCurrentScreen('roadmap')

      // Fire-and-forget: save to Supabase without blocking the UI.
      saveQuizAnswers(answers, rawPlan.field)
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

      {currentScreen === 'generating' && <AIRoadmapLoading />}

      {currentScreen === 'roadmap' && activePlan && (
        <DailyRoadmapPage plan={activePlan} onRestart={handleRestart} />
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

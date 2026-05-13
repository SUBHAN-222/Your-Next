import { useState, useCallback } from 'react'
import LandingPage from '@pages/LandingPage'
import OnboardingPage from '@pages/OnboardingPage'
import RoadmapPage from '@pages/RoadmapPage'
import FeedbackModal from '@components/FeedbackModal'

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing')
  const [answers, setAnswers] = useState({})
  const [showFeedback, setShowFeedback] = useState(false)

  const handleStartQuiz = useCallback(() => {
    setCurrentScreen('onboarding')
  }, [])

  const handleAnswer = useCallback((stepIndex, value, index) => {
    setAnswers(prev => ({
      ...prev,
      [stepIndex]: { val: value, idx: index }
    }))
  }, [])

  const handleBack = useCallback(() => {
    setCurrentScreen('landing')
  }, [])

  const handleRestart = useCallback(() => {
    setAnswers({})
    setCurrentScreen('landing')
  }, [])

  const handleCompleteQuiz = useCallback(() => {
    setCurrentScreen('roadmap')
  }, [])

  return (
    <>
      {currentScreen === 'landing' && (
        <LandingPage onStart={handleStartQuiz} />
      )}
      
      {currentScreen === 'onboarding' && (
        <OnboardingPage
          answers={answers}
          onAnswer={handleAnswer}
          onBack={handleBack}
          onComplete={handleCompleteQuiz}
        />
      )}
      
      {currentScreen === 'roadmap' && (
        <RoadmapPage
          answers={answers}
          onRestart={handleRestart}
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
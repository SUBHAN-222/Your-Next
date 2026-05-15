import { useEffect, useRef } from 'react'
import { useQuiz } from '@hooks/useQuiz'

function OnboardingPage({ answers, onAnswer, onBack, onComplete }) {
  const {
    currentStep,
    currentQuestion,
    isQuizComplete,
    progress,
    totalSteps,
    isAnswered,
    selectedAnswer,
    isGoingBack,
    handleSelect,
    nextStep,
    prevStep
  } = useQuiz(answers, onAnswer)

  const questionRef = useRef(null)

  // Trigger quiz completion when all questions are answered
  useEffect(() => {
    if (isQuizComplete) {
      onComplete()
    }
  }, [isQuizComplete, onComplete])

  // Animate question entrance
  useEffect(() => {
    if (questionRef.current) {
      questionRef.current.style.animation = 'none'
      questionRef.current.offsetHeight // Trigger reflow
      questionRef.current.style.animation = isGoingBack 
        ? 'qBack .32s ease forwards' 
        : 'qIn .38s ease forwards'
    }
  }, [currentStep, isGoingBack])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && currentStep > 0) {
        prevStep()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep, prevStep])

  if (isQuizComplete) {
    return null
  }

  return (
    <section className="screen active onboarding-screen" id="s-ob">
      <div className="ob">
        {/* Progress Bar */}
        <div className="ob-top">
          <div className="ob-logo-sm">Your<b>Next</b></div>
          <div className="ob-bar">
            <div 
              className="ob-fill" 
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
            />
          </div>
          <div className="ob-count">
            {currentStep + 1} of {totalSteps}
          </div>
        </div>

        {/* Question Content */}
        <div className="ob-q" ref={questionRef}>
          <div className="ob-eyebrow q-in">{currentQuestion.eye}</div>
          <div className="ob-title q-in" style={{ animationDelay: '.05s' }}>
            {currentQuestion.title}
          </div>
          <div className="ob-hint q-in" style={{ animationDelay: '.1s' }}>
            {currentQuestion.hint}
          </div>
          <div className="ob-opts q-in" style={{ animationDelay: '.15s' }}>
            {currentQuestion.opts.map((option, idx) => (
              <div
                key={option.val}
                className={`ob-opt${selectedAnswer?.val === option.val ? ' sel' : ''}`}
                onClick={() => handleSelect(option.val, idx)}
                role="button"
                tabIndex={0}
                aria-pressed={selectedAnswer?.val === option.val}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSelect(option.val, idx)
                  }
                }}
              >
                <div className="ob-ico">{option.e}</div>
                {option.l}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="ob-actions">
          <button
            className={`ob-back${currentStep > 0 ? ' on' : ''}`}
            onClick={prevStep}
            disabled={currentStep === 0}
            aria-label="Go back"
          >
            ←
          </button>
          <button
            className={`ob-cta${isAnswered ? ' on' : ''}`}
            onClick={nextStep}
            disabled={!isAnswered}
            aria-label="Continue to next question"
          >
            Continue →
          </button>
        </div>
      </div>
    </section>
  )
}

export default OnboardingPage
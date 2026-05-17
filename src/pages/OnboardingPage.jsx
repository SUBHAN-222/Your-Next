import { useEffect, useRef, useState, useCallback } from 'react'
import { useQuiz } from '@hooks/useQuiz'

const ADVANCE_DELAY_MS = 320

const FEEDBACK_MESSAGES = [
  "Got it — let's figure this out.",
  "Thanks — one step closer.",
  "Noted. Moving on.",
  "Perfect — keep going.",
]

function OnboardingPage({ answers, onAnswer, onComplete }) {
  const {
    currentStep,
    currentQuestion,
    isQuizComplete,
    progress,
    totalSteps,
    selectedAnswer,
    isGoingBack,
    handleSelect,
    nextStep,
    prevStep
  } = useQuiz(answers, onAnswer)

  const questionRef = useRef(null)
  const advanceTimeoutRef = useRef(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [pickedVal, setPickedVal] = useState(null)

  const clearAdvanceTimeout = useCallback(() => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current)
      advanceTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    if (isQuizComplete) {
      onComplete()
    }
  }, [isQuizComplete, onComplete])

  useEffect(() => {
    if (questionRef.current) {
      questionRef.current.style.animation = 'none'
      questionRef.current.offsetHeight
      questionRef.current.style.animation = isGoingBack
        ? 'quizSlideBack .36s cubic-bezier(.22, 1, .36, 1) forwards'
        : 'quizSlideIn .4s cubic-bezier(.22, 1, .36, 1) forwards'
    }
  }, [currentStep, isGoingBack])

  useEffect(() => {
    setIsTransitioning(false)
    setFeedback(null)
    setPickedVal(null)
    clearAdvanceTimeout()
  }, [currentStep, clearAdvanceTimeout])

  useEffect(() => () => clearAdvanceTimeout(), [clearAdvanceTimeout])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && currentStep > 0 && !isTransitioning) {
        prevStep()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep, prevStep, isTransitioning])

  const handleOptionSelect = useCallback((value, index) => {
    if (isTransitioning) return

    setPickedVal(value)
    handleSelect(value, index)
    setIsTransitioning(true)
    setFeedback(FEEDBACK_MESSAGES[Math.floor(Math.random() * FEEDBACK_MESSAGES.length)])

    advanceTimeoutRef.current = setTimeout(() => {
      setFeedback(null)
      setPickedVal(null)
      setIsTransitioning(false)
      nextStep()
    }, ADVANCE_DELAY_MS)
  }, [isTransitioning, handleSelect, nextStep])

  if (isQuizComplete) {
    return null
  }

  const displayStep = currentStep + 1

  return (
    <section className="screen active onboarding-screen" id="s-ob">
      <div className="ob-bg-glow" aria-hidden="true" />

      <div className="ob">
        <header className="ob-top">
          <button
            type="button"
            className={`ob-back${currentStep > 0 ? ' on' : ''}`}
            onClick={prevStep}
            disabled={currentStep === 0 || isTransitioning}
            aria-label="Go back"
          >
            ←
          </button>
          <div className="ob-progress-wrap">
            <div className="ob-progress-meta">
              <span className="ob-progress-label">Question {displayStep}</span>
              <span className="ob-count">of {totalSteps}</span>
            </div>
            <div
              className="ob-bar"
              role="progressbar"
              aria-valuenow={displayStep}
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-label={`Question ${displayStep} of ${totalSteps}`}
            >
              <div className="ob-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="ob-logo-sm">Your<b>Next</b></div>
        </header>

        <div
          className={`ob-q${isTransitioning ? ' ob-q--transitioning' : ''}`}
          ref={questionRef}
        >
          <div className="ob-eyebrow q-in">{currentQuestion.eye}</div>
          <h2 className="ob-title q-in" style={{ animationDelay: '.05s' }}>
            {currentQuestion.title}
          </h2>
          <p className="ob-hint q-in" style={{ animationDelay: '.1s' }}>
            {currentQuestion.hint}
          </p>

          <div className="ob-opts q-in" style={{ animationDelay: '.15s' }}>
            {currentQuestion.opts.map((option, idx) => {
              const isSelected =
                pickedVal === option.val || selectedAnswer?.val === option.val
              const isPicking = pickedVal === option.val && isTransitioning

              return (
                <div
                  key={option.val}
                  className={[
                    'ob-opt',
                    isSelected ? 'sel' : '',
                    isPicking ? 'picking' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => handleOptionSelect(option.val, idx)}
                  role="button"
                  tabIndex={isTransitioning ? -1 : 0}
                  aria-pressed={isSelected}
                  aria-disabled={isTransitioning}
                  onKeyDown={(e) => {
                    if (isTransitioning) return
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleOptionSelect(option.val, idx)
                    }
                  }}
                >
                  <span className="ob-opt-glow" aria-hidden="true" />
                  <span className="ob-ico">{option.e}</span>
                  <span className="ob-opt-label">{option.l}</span>
                  <span className="ob-opt-check" aria-hidden="true">✓</span>
                </div>
              )
            })}
          </div>

          <p
            className={`ob-feedback${feedback ? ' ob-feedback--visible' : ''}`}
            aria-live="polite"
          >
            {feedback}
          </p>
        </div>
      </div>
    </section>
  )
}

export default OnboardingPage

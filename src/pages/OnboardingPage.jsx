import { useEffect, useRef, useState, useCallback } from 'react'
import { useQuiz } from '@hooks/useQuiz'
import { renderGradientTitle } from '@utils/renderGradientTitle'

const ADVANCE_DELAY_MS = 320

const FEEDBACK_MESSAGES = [
  "Got it — let's figure this out.",
  "Thanks — one step closer.",
  "Noted. Moving on.",
  "Perfect — keep going.",
]

const CARD_ACCENTS = ['cyan', 'purple', 'green', 'amber']

function formatSectionLabel(eye) {
  return (eye || 'Your journey').toUpperCase()
}

const CARD_DESCRIPTIONS = [
  'Helps us understand where you are today',
  'Shapes your recommended learning path',
  'Unlocks the next step in your roadmap',
  'Fine-tunes your personalized guidance',
]

function getCardDescription(option, index) {
  if (option.desc) return option.desc
  return CARD_DESCRIPTIONS[index % CARD_DESCRIPTIONS.length]
}

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
        ? 'quizSlideBack .4s cubic-bezier(.22, 1, .36, 1) forwards'
        : 'quizSlideIn .45s cubic-bezier(.22, 1, .36, 1) forwards'
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
    return (
      <section className="screen active onboarding-screen" id="s-ob">
        <div className="ob-bg" aria-hidden="true">
          <div className="ob-bg-grid" />
          <div className="ob-bg-glow-left" />
          <div className="ob-bg-glow-right" />
        </div>
        <div className="ob-shell">
          <p className="ob-loading" role="status">Preparing your path…</p>
        </div>
      </section>
    )
  }

  if (!currentQuestion?.opts?.length) {
    return (
      <section className="screen active onboarding-screen" id="s-ob">
        <div className="ob-bg" aria-hidden="true">
          <div className="ob-bg-grid" />
          <div className="ob-bg-glow-left" />
          <div className="ob-bg-glow-right" />
        </div>
        <div className="ob-shell">
          <div className="ob-loading-fallback">
            <p role="alert">We couldn&apos;t load this question. Please try again.</p>
            <button
              type="button"
              className="ob-loading-retry"
              onClick={() => (currentStep > 0 ? prevStep() : window.location.reload())}
            >
              {currentStep > 0 ? 'Go back' : 'Reload quiz'}
            </button>
          </div>
        </div>
      </section>
    )
  }

  const displayStep = currentStep + 1
  const canGoBack = currentStep > 0

  return (
    <section className="screen active onboarding-screen" id="s-ob">
      <div className="ob-bg" aria-hidden="true">
        <div className="ob-bg-grid" />
        <div className="ob-bg-glow-left" />
        <div className="ob-bg-glow-right" />
      </div>

      <div className="ob-shell">
        <header className="ob-top">
          <button
            type="button"
            className={`ob-back${canGoBack ? ' on' : ' placeholder'}`}
            onClick={prevStep}
            disabled={!canGoBack || isTransitioning}
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

          <div className="ob-logo-sm">
            Your<b className="gradient-text">Next</b>
          </div>
        </header>

        <div
          className={`ob-q${isTransitioning ? ' ob-q--transitioning' : ''}`}
          ref={questionRef}
        >
          <header className="ob-q-header">
            <p className="ob-eyebrow fade-up" style={{ animationDelay: '0s' }}>
              {formatSectionLabel(currentQuestion.eye)}
            </p>
            <h1 className="ob-title fade-up" style={{ animationDelay: '.07s' }}>
              {renderGradientTitle(currentQuestion.title)}
            </h1>
            <p className="ob-hint fade-up" style={{ animationDelay: '.14s' }}>
              {currentQuestion.hint}
            </p>
          </header>

          <div className="ob-opts fade-up" style={{ animationDelay: '.2s' }}>
            {currentQuestion.opts.map((option, idx) => {
              const isSelected =
                pickedVal === option.val || selectedAnswer?.val === option.val
              const isPicking = pickedVal === option.val && isTransitioning
              const accent = CARD_ACCENTS[idx % CARD_ACCENTS.length]

              return (
                <button
                  key={option.val}
                  type="button"
                  className={[
                    'quiz-card',
                    `quiz-card--${accent}`,
                    isSelected ? 'selected' : '',
                    isPicking ? 'picking' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => handleOptionSelect(option.val, idx)}
                  disabled={isTransitioning}
                  aria-pressed={isSelected}
                >
                  <span className="quiz-card-shine" aria-hidden="true" />
                  <span className="quiz-card-icon" aria-hidden="true">
                    {option.e}
                  </span>
                  <span className="quiz-card-body">
                    <span className="quiz-card-title">{option.l}</span>
                    <span className="quiz-card-desc">
                      {getCardDescription(option, idx)}
                    </span>
                  </span>
                  <span className="quiz-card-arrow" aria-hidden="true">
                    {isSelected ? '✓' : '→'}
                  </span>
                </button>
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

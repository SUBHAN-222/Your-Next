import { useState } from 'react'
import { DURATION_OPTIONS } from '@data/durationOptions'

function DurationPage({ onSelect }) {
  const [showCustom, setShowCustom] = useState(false)
  const [customValue, setCustomValue] = useState('')

  const handleCustomConfirm = () => {
    const months = parseInt(customValue, 10)
    if (!months || months < 1 || months > 36) return
    onSelect(months)
  }

  return (
    <section className="screen active onboarding-screen" id="s-ob">
      <div className="ob-bg" aria-hidden="true">
        <div className="ob-bg-grid" />
        <div className="ob-bg-glow-left" />
        <div className="ob-bg-glow-right" />
      </div>

      <div className="ob-shell">
        <div className="ob-q">
          <header className="ob-q-header">
            <p className="ob-eyebrow fade-up">YOUR PACE</p>
            <h1 className="ob-title fade-up" style={{ animationDelay: '.07s' }}>
              How much time do you want to give this?
            </h1>
            <p className="ob-hint fade-up" style={{ animationDelay: '.14s' }}>
              We'll break your roadmap into small daily tasks that fit this timeline —
              you'll only ever see one at a time.
            </p>
          </header>

          {!showCustom ? (
            <div className="ob-opts yn-stagger fade-up" style={{ animationDelay: '.2s' }}>
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  className="quiz-card quiz-card--purple"
                  onClick={() => (option.isCustom ? setShowCustom(true) : onSelect(option.months))}
                >
                  <span className="quiz-card-shine" aria-hidden="true" />
                  <span className="quiz-card-icon" aria-hidden="true">🗓️</span>
                  <span className="quiz-card-body">
                    <span className="quiz-card-title">{option.label}</span>
                    <span className="quiz-card-sub">{option.hint}</span>
                  </span>
                  <span className="quiz-card-arrow" aria-hidden="true">→</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="fade-up" style={{ animationDelay: '.1s', textAlign: 'center' }}>
              <input
                type="number"
                min="1"
                max="36"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Number of months (1-36)"
                className="custom-duration-input"
                autoFocus
              />
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
                <button type="button" className="complete-btn" style={{ width: 'auto', padding: '14px 32px' }} onClick={handleCustomConfirm}>
                  Confirm
                </button>
                <button
                  type="button"
                  className="complete-btn"
                  style={{ width: 'auto', padding: '14px 32px', background: '#f4f4f5', color: '#333', boxShadow: 'none' }}
                  onClick={() => setShowCustom(false)}
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default DurationPage

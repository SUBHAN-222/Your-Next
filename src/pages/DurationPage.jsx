import { DURATION_OPTIONS } from '@data/durationOptions'

function DurationPage({ onSelect }) {
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

          <div className="ob-opts yn-stagger fade-up" style={{ animationDelay: '.2s' }}>
            {DURATION_OPTIONS.map((option) => (
              <button
                key={option.months}
                type="button"
                className="quiz-card quiz-card--purple"
                onClick={() => onSelect(option.months)}
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
        </div>
      </div>
    </section>
  )
}

export default DurationPage

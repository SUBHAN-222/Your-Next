import { useState, useEffect } from 'react'

const previewExamples = [
  { title: "Start with HTML today — structure first, perfection later.", desc: "HTML is the foundation. Everything you build will sit on top of this.", time: "30-45 mins", level: "Beginner" },
  { title: "Get comfortable with how computers think.", desc: "Before writing AI code, you need to understand the simple logic computers use.", time: "30 mins", level: "Beginner" },
  { title: "Understand what data actually is — The Pattern Hunter.", desc: "Data isn't just numbers; it's information about the world.", time: "30 mins", level: "Beginner" },
  { title: "Understand how networks actually work.", desc: "Every security attack exploits a network weakness.", time: "1 hour", level: "Beginner" }
]

function LandingPage({ onStart, savedProgress, onContinue, onStartFresh }) {
  const [isVisible, setIsVisible] = useState(false)
  const [showBanner, setShowBanner] = useState(!!savedProgress)
  const [exampleIndex, setExampleIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    setShowBanner(!!savedProgress)
  }, [savedProgress])

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true)
      setTimeout(() => {
        setExampleIndex((prev) => (prev + 1) % previewExamples.length)
        setIsFading(false)
      }, 300)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const handleStartFresh = (e) => {
    e.preventDefault()
    onStartFresh?.()
    setShowBanner(false)
  }

  return (
    <section className="screen active landing-screen" id="s-land">
      <div className="land-inner">
        <div className={`land-logo ${isVisible ? 'visible' : ''}`}>Your<b>Next</b></div>
        <p className={`land-tag ${isVisible ? 'visible' : ''}`}>
          Clarity for confused tech students
        </p>
        <div className="land-hero-row">
          <div className="land-hero-text">
            <h1 className={`land-h1 ${isVisible ? 'visible' : ''}`}>
              No more guessing.<br />Just your <i>next clear step</i>.
            </h1>
            <p className={`land-sub ${isVisible ? 'visible' : ''}`}>
              YourNext understands where you are stuck and guides you step-by-step without overwhelm.
            </p>
          </div>

          <div className={`roadmap-preview-card ${isVisible ? 'visible' : ''}`}>
            <div className="rpc-header">
              <div className="rpc-avatar">🚀</div>
              <span className="rpc-badge">Step 1 of 3</span>
            </div>
            <div className={`rpc-content ${isFading ? 'fading' : ''}`}>
              <h3 className="rpc-title">{previewExamples[exampleIndex].title}</h3>
              <p className="rpc-desc">{previewExamples[exampleIndex].desc}</p>
              <div className="rpc-meta">
                <span className="rpc-pill">⏱️ {previewExamples[exampleIndex].time}</span>
                <span className="rpc-pill">{previewExamples[exampleIndex].level}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={`cta-outer ${isVisible ? 'visible' : ''}`}>
          {showBanner && savedProgress && (
            <div className="continue-banner-wrap">
              <button
                type="button"
                className="continue-banner"
                onClick={onContinue}
                aria-label={`Continue your ${savedProgress.field} path`}
              >
                <span className="continue-banner-dot" aria-hidden="true" />
                <span className="continue-banner-text">
                  Continue your {savedProgress.field} path
                </span>
                {savedProgress.streak > 0 && (
                  <span className="continue-banner-streak">
                    🔥 {savedProgress.streak} day streak
                  </span>
                )}
                <span className="continue-banner-arrow" aria-hidden="true">→</span>
              </button>
              <button type="button" className="continue-banner-fresh" onClick={handleStartFresh}>
                Start fresh instead
              </button>
            </div>
          )}
          <button className="cta" onClick={onStart} aria-label="Find your path">
            <div className="cta-fill"></div>
            <span>Find My Path</span>
            <div className="cta-arrow">→</div>
          </button>
        </div>
      </div>
    </section>
  )
}

export default LandingPage

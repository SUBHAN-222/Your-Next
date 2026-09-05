import { useState, useEffect } from 'react'

function LandingPage({ onStart, savedProgress, onContinue, onStartFresh }) {
  const [isVisible, setIsVisible] = useState(false)
  const [showBanner, setShowBanner] = useState(!!savedProgress)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    setShowBanner(!!savedProgress)
  }, [savedProgress])

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
          For confused tech students
        </p>
        <h1 className={`land-h1 ${isVisible ? 'visible' : ''}`}>
          Confused isn't a problem with you.<br />
          It's a problem with having too many options.<br />
          <i>We fix that.</i>
        </h1>
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

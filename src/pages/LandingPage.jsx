import { useState, useEffect } from 'react'

function LandingPage({ onStart }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="screen active landing-screen" id="s-land">
      <div className="land-inner">
        <div className={`land-logo ${isVisible ? 'visible' : ''}`}>Your<b>Next</b></div>
        <p className={`land-tag ${isVisible ? 'visible' : ''}`}>
          Clarity for confused tech students
        </p>
        <h1 className={`land-h1 ${isVisible ? 'visible' : ''}`}>
          No more guessing.<br />Just your <i>next clear step</i>.
        </h1>
        <p className={`land-sub ${isVisible ? 'visible' : ''}`}>
          YourNext understands where you are stuck and guides you step-by-step without overwhelm.
        </p>
        <div className={`cta-outer ${isVisible ? 'visible' : ''}`}>
          <button className="cta" onClick={onStart} aria-label="Find your path">
            <div className="cta-fill"></div>
            <span>Find My Path</span>
            <div className="cta-arrow">→</div>
          </button>
          <p className="cta-whisper">2 minutes · no signup · completely free</p>
        </div>
      </div>
    </section>
  )
}

export default LandingPage
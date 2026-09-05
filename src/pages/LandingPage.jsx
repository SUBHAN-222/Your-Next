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

        {/* How it works */}
        <div style={{
          maxWidth: '600px',
          margin: '24px auto 0',
          padding: '0 24px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#aaa',
            marginBottom: '40px',
          }}>How it works</p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            maxWidth: '680px',
            margin: '32px auto 0',
            padding: '0 24px',
          }}>
            {[
              {
                step: '01',
                title: "Tell us where you're stuck",
                desc: 'Answer 4 quick questions. No signup.',
                icon: '🎯',
              },
              {
                step: '02',
                title: 'Get your exact next 3 steps',
                desc: 'Your specific path, not a generic roadmap.',
                icon: '🗺️',
              },
              {
                step: '03',
                title: 'Complete one task at a time',
                desc: 'Each day unlocks as you finish.',
                icon: '🔓',
              },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#fff',
                border: '1px solid #f0f0f0',
                borderRadius: '16px',
                padding: '20px 16px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: '24px',
                  marginBottom: '10px',
                }}>{item.icon}</div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  color: '#2563eb',
                  marginBottom: '6px',
                }}>STEP {item.step}</div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#111',
                  marginBottom: '6px',
                  lineHeight: '1.3',
                }}>{item.title}</div>
                <div style={{
                  fontSize: '12px',
                  color: '#888',
                  lineHeight: '1.4',
                }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default LandingPage

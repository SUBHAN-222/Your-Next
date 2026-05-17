import { useEffect, useState, useCallback } from 'react'
import { useRoadmap } from '@hooks/useRoadmap'
import ProgressToast from '@components/ProgressToast'

function RoadmapPage({ activePlan, initialStepIndex = 0, onRestart }) {
  const {
    roadmapData,
    currentStep,
    currentStepIndex,
    isComplete,
    streak,
    momentumMessage,
    showMomentum,
    completeCurrentStep,
    deferCurrentStep,
    hideMomentum,
    getStepStatus,
  } = useRoadmap(activePlan, initialStepIndex)

  const [showToast, setShowToast] = useState(false)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStepIndex])

  useEffect(() => {
    if (!showMomentum) return
    const timer = setTimeout(hideMomentum, 4000)
    return () => clearTimeout(timer)
  }, [showMomentum, hideMomentum])

  const handleComplete = useCallback(() => {
    setCompleting(true)
    setTimeout(() => {
      completeCurrentStep()
      setCompleting(false)
    }, 500)
  }, [completeCurrentStep])

  const handleDefer = useCallback(() => {
    deferCurrentStep()
    setShowToast(true)
  }, [deferCurrentStep])

  if (!roadmapData || !currentStep) {
    if (isComplete && roadmapData) {
      return (
        <section className="screen active roadmap-screen" id="s-res">
          <nav className="res-nav">
            <button className="nav-logo" onClick={onRestart} type="button" aria-label="Go home">
              Your<b>Next</b>
            </button>
            <div className="res-nav-end">
              {streak > 0 && <span className="nav-streak">🔥 {streak}</span>}
              <span className="nav-label">Your Roadmap</span>
            </div>
          </nav>
          <div className="roadmap-container">
            <div className="finished-card active" id="finishedCard">
              <div className="finished-icon">🎉</div>
              <div className="finished-title">You completed your roadmap!</div>
              <p className="step-why">Every step you finished is proof you can do this.</p>
              <button type="button" className="complete-btn" style={{ marginTop: '24px', width: 'auto', padding: '14px 32px' }} onClick={onRestart}>
                Start Over →
              </button>
            </div>
          </div>
        </section>
      )
    }
    return null
  }

  const fieldLabel = roadmapData.field || 'learning'

  return (
    <section className="screen active roadmap-screen" id="s-res">
      <nav className="res-nav">
        <button className="nav-logo" onClick={onRestart} type="button" aria-label="Go home">
          Your<b>Next</b>
        </button>
        <div className="res-nav-end">
          {streak > 0 && (
            <span className="nav-streak" aria-label={`${streak} day streak`}>
              🔥 {streak}
            </span>
          )}
          <span className="nav-label">Your Roadmap</span>
        </div>
      </nav>

      <div className="roadmap-top">
        <h2 className="roadmap-h">
          Welcome to your <span id="resField">{fieldLabel}</span> journey.
        </h2>
        <p className="roadmap-sub">One step at a time — no overwhelm, just progress.</p>
      </div>

      <div className="roadmap-container">
        {showMomentum && momentumMessage && (
          <div className="momentum-banner show">{momentumMessage}</div>
        )}

        <div className="active-step-card">
          <div className="daily-focus-header">
            <span className="daily-focus-dot" />
            <span className="daily-focus-label">Today&apos;s focus</span>
          </div>

          <div className="step-kicker">Step {currentStepIndex + 1} of {roadmapData.steps.length}</div>
          <h3 className="step-name">{currentStep.name}</h3>
          <p className="step-why">{currentStep.why}</p>

          {currentStep.whyMatters && (
            <div className="why-box">
              <div className="why-box-label">Why this matters</div>
              <p className="why-box-text">{currentStep.whyMatters}</p>
            </div>
          )}

          <div className="step-meta">{currentStep.time}</div>

          {currentStep.resourceUrl && (
            <a
              className="resource-btn"
              href={currentStep.resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              📚 {currentStep.resourceTitle || 'Start Learning'}
            </a>
          )}

          <div className="practice-box">
            <div className="practice-label">Your tiny task</div>
            <p className="practice-task">{currentStep.task}</p>
          </div>

          <button
            type="button"
            className={`complete-btn${completing ? ' completing' : ''}`}
            onClick={handleComplete}
          >
            I completed this step →
          </button>

          <button type="button" className="defer-btn" onClick={handleDefer}>
            Not done yet — save my progress
          </button>
        </div>

        {roadmapData.futurePath?.length > 0 && (
          <div className="future-path">
            <h3 className="future-path-title">Your future path</h3>
            <p className="future-path-sub">Where you are headed after these steps.</p>
            <div className="future-path-track">
              {roadmapData.futurePath.map((stage, i) => (
                <div key={`${stage}-${i}`} className="future-path-node">
                  {i > 0 && <span className="future-path-arrow">→</span>}
                  <span className={`future-path-pill${i === 0 ? ' active-pill' : ''}`}>{stage}</span>
                </div>
              ))}
            </div>
            <p className="future-path-caption">Focus on today — the rest unlocks as you go.</p>
          </div>
        )}

        <div className="roadmap-preview">
          <div className="preview-list">
            {roadmapData.steps.map((step, index) => {
              const status = getStepStatus(index)
              return (
                <div key={index} className={`preview-item ${status}`}>
                  <span className="preview-icon">
                    {status === 'done' ? '✓' : status === 'current' ? '→' : '○'}
                  </span>
                  <span>{step.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {showToast && (
        <ProgressToast
          message="Progress saved! Come back whenever you're ready 💙"
          onDone={() => setShowToast(false)}
        />
      )}
    </section>
  )
}

export default RoadmapPage

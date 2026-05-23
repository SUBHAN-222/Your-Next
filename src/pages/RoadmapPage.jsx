import { useEffect, useState, useCallback } from 'react'
import { useRoadmap } from '@hooks/useRoadmap'
import ProgressToast from '@components/ProgressToast'
import { CAREER_PATHS, getDontLearnYet } from '@data/careerPaths'
import posthog from '@lib/posthog'

function RoadmapPage({ activePlan, initialStepIndex = 0, onRestart }) {
  if (activePlan?.steps) {
    activePlan.steps = activePlan.steps.slice(0, 3)
  }

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
    posthog.capture('roadmap_step_completed', {
      step_index: currentStepIndex,
      step_name: currentStep?.name,
      field: roadmapData?.field,
    })
    setTimeout(() => {
      completeCurrentStep()
      setCompleting(false)
    }, 1500)
  }, [completeCurrentStep, currentStepIndex, currentStep, roadmapData])

  const handleDefer = useCallback(() => {
    deferCurrentStep()
    setShowToast(true)
    posthog.capture('roadmap_step_deferred', {
      step_index: currentStepIndex,
      step_name: currentStep?.name,
    })
  }, [deferCurrentStep, currentStepIndex, currentStep])

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

          {completing ? (
            <div className="button-loading-state" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', 
              justifyContent: 'center', padding: '24px 20px', 
              background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.15)',
              borderRadius: '12px', marginTop: '16px', animation: 'fadeInSoft 0.3s ease'
            }}>
              <span className="btn-spinner" style={{ marginBottom: '12px', width: '24px', height: '24px', borderWidth: '3px' }} />
              <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>Updating your progress...</div>
              <div style={{ color: '#64748b', fontSize: '13px' }}>Saving your completion status...</div>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="complete-btn"
                onClick={handleComplete}
              >
                I completed this step →
              </button>

              <button type="button" className="defer-btn" onClick={handleDefer}>
                Not done yet — save my progress
              </button>
            </>
          )}
        </div>

        {(() => {
          const careerId = Object.keys(CAREER_PATHS).find(
            key => CAREER_PATHS[key].name === roadmapData?.field
          ) || 'web'
          const dontLearnList = roadmapData?.dontLearnYet?.length > 0 
            ? roadmapData.dontLearnYet 
            : getDontLearnYet(careerId, 'beginner')

          if (!dontLearnList || dontLearnList.length === 0) return null

          return (
            <div style={{
              background: '#0f172a',
              borderLeft: '4px solid #ef4444',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#fff', fontFamily: 'Sora, sans-serif', fontWeight: 'bold', fontSize: '20px', marginBottom: '8px' }}>
                🚫 Don't do this yet
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
                These are the #1 mistakes confused beginners make. Skip them for now.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dontLearnList.slice(0, 4).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }}>✕</span>
                    <span style={{ color: '#fff', fontSize: '15px', lineHeight: '1.5' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}

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

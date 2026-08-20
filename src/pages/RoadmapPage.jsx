import { useEffect, useState, useCallback } from 'react'
import { useRoadmap } from '@hooks/useRoadmap'
import ProgressToast from '@components/ProgressToast'
import { CAREER_PATHS, getDontLearnYet } from '@data/careerPaths'
import posthog from '@lib/posthog'

const PATH_AVOID_ITEMS = {
  data: [
    "Don't start Machine Learning yet",
    "Don't learn Deep Learning first",
    "Don't memorize libraries",
    "Don't jump into Kaggle competitions",
  ],
  web: [
    "Don't learn React immediately",
    "Don't start backend yet",
    "Don't watch advanced system design videos",
  ],
  ai: [
    "Don't train your own models yet",
    "Don't learn every AI framework",
    "Don't start with advanced math",
  ],
}

const getCareerIdFromPlan = (field) => (
  Object.keys(CAREER_PATHS).find(
    key => CAREER_PATHS[key].name === field
  ) || 'web'
)

const cleanAvoidItem = (item) => String(item).replace(/\s*\([^)]*\)/g, '')

const Accordion = ({ title, subtitle, icon, badgeText, theme = 'default', children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className={`premium-accordion theme-${theme} ${isOpen ? 'open' : ''}`}>
      <button type="button" className="p-accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="p-accordion-left">
          {icon && <span className="p-accordion-icon-box">{icon}</span>}
          <div className="p-accordion-texts">
            <span className="p-accordion-title">{title}</span>
            {subtitle && <span className="p-accordion-subtitle">{subtitle}</span>}
          </div>
        </div>
        <div className="p-accordion-right">
          {badgeText && <span className="p-accordion-badge">{badgeText}</span>}
          <span className="p-accordion-chevron">
             <svg width="14" height="8" viewBox="0 0 14 8" fill="none" style={{transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s'}}>
               <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </span>
        </div>
      </button>
      <div className="p-accordion-content-wrapper" style={{ height: isOpen ? 'auto' : 0, overflow: 'hidden' }}>
        <div className="p-accordion-content">{children}</div>
      </div>
    </div>
  )
}

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
    posthog.capture('roadmap_step_completed', {
      step_id: currentStepIndex + 1,
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
  const streakLabel = `${streak} Day${streak === 1 ? '' : 's'} Streak`
  const careerId = getCareerIdFromPlan(roadmapData?.field)
const avoidItems = (
    roadmapData?.dontLearnYet ||
    PATH_AVOID_ITEMS[careerId] ||
    getDontLearnYet(careerId, 'beginner')
  ).slice(0, 4).map(cleanAvoidItem)

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

      
      <div className="premium-hero-card">
        <div className="ph-left">
          <div className="ph-icon-box">{roadmapData.icon || '🚀'}</div>
          <div className="ph-text">
            <h2 className="ph-title">{fieldLabel}</h2>
            <p className="ph-subtitle">Beginner Stage • Keep going, you're doing great!</p>
          </div>
        </div>
        <div className="ph-right">
          <div className="ph-stats">
            <div className="ph-count"><strong>{currentStepIndex}</strong> / {roadmapData.steps.length} completed</div>
            <div className="ph-pct">{Math.round((currentStepIndex / roadmapData.steps.length) * 100)}%</div>
          </div>
          <div className="ph-progress-bg">
            <div className="ph-progress-fill" style={{ width: `${(currentStepIndex / roadmapData.steps.length) * 100}%` }}></div>
          </div>
          <div className="ph-trust-row">
            <span className="ph-save-status">✓ Progress saved automatically</span>
            {streak > 0 && <span className="ph-streak">🔥 {streakLabel}</span>}
          </div>
        </div>
      </div>

      <div className="premium-main-grid">
        <div className="premium-task-card">
          <div className="pt-header">
            <span className="pt-dot-label"><span className="pt-dot"></span> Current Task</span>
            <span className="pt-step-badge">Step {currentStepIndex + 1} of {roadmapData.steps.length}</span>
          </div>
          <div className="pt-body">
            <div className="pt-icon-large">
              <span>{roadmapData.icon || '🎯'}</span>
            </div>
            <div className="pt-info">
              <h3 className="pt-title">{currentStep.name}</h3>
              <p className="pt-desc">{currentStep.why}</p>
              <div className="pt-meta-tags">
                <span className="pt-meta-tag">⏱️ {currentStep.time}</span>
                <span className="pt-meta-tag">📖 Beginner</span>
              </div>
            </div>
          </div>
          <p className="pt-action-hint">Start the activity first. When you return, mark it complete.</p>
          <div className="pt-actions">
            {!completing && (
              <a href={currentStep.resourceUrl} className="pt-resource-btn" target="_blank" rel="noopener noreferrer">Start Learning</a>
            )}
            {completing ? (
              <div className="pt-loading">Saving progress...</div>
            ) : (
              <button type="button" className="pt-complete-btn" onClick={handleComplete}>
                <span className="pt-check">✓</span> Mark Complete
              </button>
            )}
          </div>
        </div>

        <div className="premium-next-card premium-avoid-card">
          <div className="pn-header avoid-header">
            <span className="pn-icon avoid-icon">⚠️</span>
            <div>
              <span className="avoid-title">Don't Do This Yet</span>
              <span className="avoid-subtitle">Avoid these common beginner mistakes.</span>
            </div>
          </div>
          <div className="pn-list avoid-list">
            {avoidItems.map((item, idx) => (
              <div key={idx} className="pn-item avoid-item">
                <span className="avoid-check">!</span>
                <span className="avoid-text">{item}</span>
              </div>
            ))}
          </div>
          <div className="avoid-note">
            Focus on one thing. Ignore the rest for now.
          </div>
        </div>
      </div>

      <div className="premium-accordions-group">
        {currentStepIndex > 0 && (
          <Accordion 
            theme="success"
            icon="✅"
            title="Completed Steps"
          >
            <div className="p-completed-list">
              {roadmapData.steps.slice(0, currentStepIndex).map((step, index) => (
                <div key={index} className="p-completed-item">
                  <span className="p-completed-check">✓</span>
                  <span className="p-completed-name">{step.name}</span>
                </div>
              ))}
            </div>
          </Accordion>
        )}

        <Accordion 
          theme="default"
          icon="📁"
          title="Full Roadmap"
        >
          <div className="p-full-roadmap-list">
            {roadmapData.steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div key={index} className={`p-roadmap-step-item ${status}`}>
                  <div className="p-step-icon">
                    {status === 'done' ? '✓' : status === 'current' ? '→' : '○'}
                  </div>
                  <div className="p-step-details">
                    <div className="p-step-item-name">{step.name}</div>
                    {status === 'current' && <div className="p-step-item-meta">Current task</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </Accordion>
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

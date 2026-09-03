import { useEffect, useState, useCallback } from 'react'
import { useRoadmap } from '@hooks/useRoadmap'
import ProgressToast from '@components/ProgressToast'
import { CAREER_PATHS, getDontLearnYet } from '@data/careerPaths'
import { saveLearningHistory } from '@utils/progressStorage'
import posthog from '@lib/posthog'
import { getEasierStep } from '@services/aiRoadmap'

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

function RoadmapPage({ activePlan, initialStepIndex = 0, durationMonths, onRestart, onUpdateStep }) {
  const {
    roadmapData,
    currentStep,
    currentStepIndex,
    isComplete,
    currentDay,
    totalDays,
    dayCompleted,
    todaySteps,
    tomorrowTeaser,
    completedTodayCount,
    totalCompleted,
    streak,
    momentumMessage,
    showMomentum,
    completeCurrentStep,
    deferCurrentStep,
    startNextDay,
    hideMomentum,
    getStepStatus,
  } = useRoadmap(activePlan, initialStepIndex, durationMonths)

  const [showToast, setShowToast] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [showCompletionFeedback, setShowCompletionFeedback] = useState(false)
  const [showEasierMessage, setShowEasierMessage] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setShowEasierMessage(false)
  }, [currentStepIndex])

  useEffect(() => {
    if (!showMomentum) return
    const timer = setTimeout(hideMomentum, 4000)
    return () => clearTimeout(timer)
  }, [showMomentum, hideMomentum])

  const handleComplete = useCallback(() => {
    setShowCompletionFeedback(true)
  }, [])

  const handleDefer = useCallback(() => {
    posthog.capture('roadmap_step_deferred', {
      step_index: currentStepIndex,
      step_name: currentStep?.name,
    })
    deferCurrentStep()
  }, [deferCurrentStep, currentStepIndex, currentStep?.name])

  const handleCompletionFeedback = useCallback(async (status) => {
    saveLearningHistory({
      stepIndex: currentStepIndex,
      stepName: currentStep?.name || 'Current step',
      status,
      timestamp: new Date().toISOString(),
    })

    if (status === 'completed') {
      posthog.capture('roadmap_step_completed', {
        step_id: currentStepIndex + 1,
        step_name: currentStep?.name,
        field: roadmapData?.field,
      })
      completeCurrentStep()
      setShowCompletionFeedback(false)
    } else if (status === 'stuck') {
      setShowEasierMessage(true)
      setShowCompletionFeedback(false)
      const easier = await getEasierStep(currentStep, roadmapData?.field)
      if (easier) {
        onUpdateStep?.(currentStepIndex, {
          name: easier.name,
          why: easier.why,
          task: easier.task,
        })
      }
    } else {
      // For 'not_started', just close feedback without advancing
      setShowCompletionFeedback(false)
    }
  }, [currentStepIndex, currentStep, roadmapData, completeCurrentStep, onUpdateStep])

  const fieldLabel = roadmapData.field || 'learning'
  const streakLabel = `${streak} Task${streak === 1 ? '' : 's'} Completed`
  const careerId = getCareerIdFromPlan(roadmapData?.field)
  const avoidItems = (
    roadmapData?.dontLearnYet ||
    PATH_AVOID_ITEMS[careerId] ||
    getDontLearnYet(careerId, 'beginner')
  ).slice(0, 4).map(cleanAvoidItem)

  const upcomingStages = (
    roadmapData?.futurePath && roadmapData.futurePath.length >= 2
      ? roadmapData.futurePath.slice(0, 3)
      : ['Unlocks tomorrow', 'Advanced Topics', 'Next Level Practice']
  )

  const handleScrollToCompleted = () => {
    const el = document.getElementById('completed-steps-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const isFinished = isComplete || (roadmapData?.steps && currentStepIndex >= roadmapData.steps.length)

  return (
    <section className="screen active roadmap-screen" id="s-res">
      <nav className="res-nav">
        <button className="nav-logo" onClick={onRestart} type="button" aria-label="Go home">
          Your<b>Next</b>
        </button>
        <div className="res-nav-end">
          {streak > 0 && (
            <span className="nav-streak" aria-label={`${streak} tasks completed`}>
              🔥 {streak}
            </span>
          )}
          <span className="nav-label">Your Roadmap</span>
        </div>
      </nav>

      <div style={{ width: 'fit-content', margin: '20px auto 0', padding: '8px 16px', borderRadius: '999px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#60a5fa', fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em' }}>
        Day {currentDay} of {totalDays}
      </div>

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
            <div className="ph-count">Day {currentDay} • <strong>{completedTodayCount}</strong> completed</div>
            <div className="ph-pct">{totalCompleted} / {roadmapData?.steps?.length || 0} total</div>
          </div>
          <div className="ph-progress-bg">
            <div className="ph-progress-fill" style={{ width: `${(totalCompleted / (roadmapData?.steps?.length || 1)) * 100}%` }}></div>
          </div>
          <div className="ph-trust-row">
            <span className="ph-save-status">✓ Progress saved automatically</span>
            {streak > 0 && <span className="ph-streak">🔥 {streakLabel}</span>}
          </div>
        </div>
      </div>

      <div className="premium-main-grid">
        {dayCompleted ? (
          <div className="premium-task-card active-step-card yn-scale-in" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Day {currentDay} done!</h2>
            <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6, marginBottom: '16px' }}>
              Come back tomorrow to unlock your next steps.
            </p>
            {tomorrowTeaser && (
              <p style={{ color: '#3b82f6', fontStyle: 'italic', fontSize: '14px', marginBottom: '24px' }}>
                Tomorrow's hint: {tomorrowTeaser}
              </p>
            )}
            <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '16px 20px', color: '#0f172a', marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>Tasks Completed</div>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>🔥 {streak} task{streak !== 1 ? 's' : ''}</div>
            </div>
            {currentDay < totalDays && (
              <button
                type="button"
                className="pt-complete-btn"
                style={{ width: '100%', justifyContent: 'center', fontSize: '16px', fontWeight: 700, padding: '14px 24px' }}
                onClick={startNextDay}
              >
                Start Day {currentDay + 1}
              </button>
            )}
          </div>
        ) : isFinished ? (
          <div className="premium-task-card finished-task-card">
            <div className="pt-header">
              <span className="pt-dot-label"><span className="pt-dot" style={{ background: '#22c55e' }}></span> Progress Summary</span>
              <span className="pt-step-badge">Completed 🎉</span>
            </div>
            <div style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                You're on your way.
              </h3>
              <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.5', marginBottom: '24px' }}>
                {totalCompleted} steps down. You already know more than you did yesterday — and there's more waiting for you.
              </p>

              <div style={{ marginBottom: '24px', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', color: '#64748b', marginBottom: '12px' }}>
                  What's Ahead
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {upcomingStages.map((stage, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '14px', opacity: 0.75 }}>
                      <span>🔒</span>
                      <span>{typeof stage === 'string' ? stage : stage?.name || 'Unlocks tomorrow'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p style={{ fontWeight: '700', color: '#f97316', fontSize: '14px', marginBottom: '12px' }}>
                {streak > 0
                  ? `🔥 ${streak} tasks completed so far`
                  : '🔥 Start your learning journey today'}
              </p>

              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px', fontWeight: '500' }}>
                {roadmapData?.tomorrowTeaser
                  ? `Tomorrow: ${roadmapData.tomorrowTeaser}`
                  : "Come back tomorrow and we'll pick up right where you left off."}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button
                  type="button"
                  className="pt-resource-btn"
                  style={{ width: '100%', justifyContent: 'center', textAlign: 'center', cursor: 'pointer' }}
                  onClick={handleScrollToCompleted}
                >
                  See what I completed
                </button>
                <button
                  type="button"
                  onClick={onRestart}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    marginTop: '14px',
                    padding: '4px 8px'
                  }}
                >
                  Or start a completely new path
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="premium-task-card">
            <div className="pt-header">
              <span className="pt-dot-label"><span className="pt-dot"></span> Current Task</span>
              <span className="pt-step-badge">Step {currentStepIndex + 1} of {roadmapData?.steps?.length || 0}</span>
            </div>
            {showEasierMessage && (
              <div style={{ margin: '12px 24px 0', padding: '12px 16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '10px', color: '#60a5fa', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>💙</span>
                <span>No worries — here's an easier version of this step</span>
              </div>
            )}
            <div className="pt-body">
              <div className="pt-icon-large">
                <span>{roadmapData?.icon || '🎯'}</span>
              </div>
              <div className="pt-info">
                <h3 className="pt-title">{currentStep?.name}</h3>
                <p className="pt-desc">{currentStep?.why}</p>
                <div className="pt-meta-tags">
                  <span className="pt-meta-tag">⏱️ {currentStep?.time}</span>
                  <span className="pt-meta-tag">📖 Beginner</span>
                </div>
              </div>
            </div>
            <p className="pt-action-hint">Start the activity first. When you return, mark it complete.</p>
            {showCompletionFeedback && (
              <div className="completion-feedback" role="group" aria-label="How did it go?">
                <p className="completion-feedback-title">How did it go?</p>
                <div className="completion-feedback-options">
                  <button type="button" onClick={() => handleCompletionFeedback('completed')}>
                    🟢 I completed it
                  </button>
                  <button type="button" onClick={() => handleCompletionFeedback('stuck')}>
                    🟡 I got stuck
                  </button>
                  <button type="button" onClick={() => handleCompletionFeedback('not_started')}>
                    🔴 I couldn't start
                  </button>
                </div>
              </div>
            )}
            <div className="pt-actions">
              {!completing && (
                <a href={currentStep?.resourceUrl} className="pt-resource-btn" target="_blank" rel="noopener noreferrer">Start Learning</a>
              )}
              {completing ? (
                <div className="pt-loading">Saving progress...</div>
              ) : (
                <button type="button" className="pt-complete-btn" onClick={handleComplete} disabled={showCompletionFeedback}>
                  <span className="pt-check">✓</span> Mark Complete
                </button>
              )}
            </div>
          </div>
        )}

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

      <div className="premium-accordions-group" id="completed-steps-section">
        {(currentStepIndex > 0 || isFinished) && (
          <Accordion 
            theme="success"
            icon="✅"
            title="Completed Steps"
            defaultOpen={isFinished}
          >
            <div className="p-completed-list">
              {roadmapData?.steps?.slice(0, Math.min(currentStepIndex, roadmapData.steps.length)).map((step, index) => (
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
          title="Full Learning Roadmap Path"
          defaultOpen={true}
        >
          <div className="p-full-roadmap-list">
            {roadmapData?.steps?.map((step, index) => {
              const status = getStepStatus(index)
              const stepDay = Math.floor(index / 3) + 1
              const isFutureDay = stepDay > currentDay
              return (
                <div key={index} className={`p-roadmap-step-item ${status}`}>
                  <div className="p-step-icon">
                    {status === 'done' ? '✓' : status === 'current' ? '→' : isFutureDay ? '🔒' : '○'}
                  </div>
                  <div className="p-step-details">
                    <div className="p-step-item-name">{step.name}</div>
                    {step.why && <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{step.why}</div>}
                    <div className="p-step-item-meta" style={{ marginTop: '4px' }}>
                      Day {stepDay}{status === 'current' ? ' • Current task' : isFutureDay ? ' • Locked' : status === 'done' ? ' • Completed' : ' • Up next'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Accordion>
      </div>
    </section>
  )
}

export default RoadmapPage

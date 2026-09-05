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

function getNextRoadmapSuggestions(currentField) {
  const all = [
    { field: 'web', icon: '🌐', label: 'Go deeper into React & Full Stack' },
    { field: 'ai', icon: '🤖', label: 'Explore AI & Machine Learning' },
    { field: 'data', icon: '📊', label: 'Level up with Data Science' },
    { field: 'cyber', icon: '🔒', label: 'Try Cyber Security' },
    { field: 'freelance', icon: '💸', label: 'Start Freelancing with your skills' },
  ]
  return all.filter(s => s.field !== currentField).slice(0, 3)
}

function RoadmapPage({ activePlan, initialStepIndex = 0, durationMonths, onRestart, onUpdateStep }) {
  const handleRestartWithField = useCallback((targetField) => {
    onRestart?.()
  }, [onRestart])

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

  const [expandedDays, setExpandedDays] = useState(() => {
    const initial = {}
    const totalD = totalDays || Math.ceil((activePlan?.steps?.length || 9) / 3)
    for (let d = 1; d <= totalD; d++) {
      initial[d] = d === currentDay
    }
    return initial
  })

  useEffect(() => {
    setExpandedDays((prev) => {
      if (!prev[currentDay]) {
        return { ...prev, [currentDay]: true }
      }
      return prev
    })
  }, [currentDay])

  const toggleDay = useCallback((dayNum) => {
    setExpandedDays((prev) => ({ ...prev, [dayNum]: !prev[dayNum] }))
  }, [])

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
    if (completing) return
    setCompleting(true)
    try {
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
    } finally {
      setCompleting(false)
    }
  }, [completing, currentStepIndex, currentStep, roadmapData, completeCurrentStep, onUpdateStep])

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
          <div style={{
            textAlign: 'center',
            padding: '40px 24px',
            background: '#fff',
            borderRadius: '24px',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.04)',
          }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>🎓</div>
            <h2 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '26px', fontWeight: '800',
              color: '#111', marginBottom: '8px',
            }}>You finished your roadmap!</h2>
            <p style={{ fontSize: '15px', color: '#666', marginBottom: '32px', lineHeight: '1.6' }}>
              Most beginners never get this far. You did.
            </p>

            {/* Stats */}
            <div style={{
              display: 'flex', gap: '12px',
              justifyContent: 'center', marginBottom: '32px', flexWrap: 'wrap',
            }}>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '16px', padding: '16px 24px' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#2563eb' }}>{totalSteps || 9}</div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>Tasks Done</div>
              </div>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '16px 24px' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#16a34a' }}>3</div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>Days Completed</div>
              </div>
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '16px', padding: '16px 24px' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#ea580c' }}>🔥 {streak || 0}</div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>Day Streak</div>
              </div>
            </div>

            {/* Next suggestions */}
            <div style={{
              background: '#fafafa', border: '1px solid #f0f0f0',
              borderRadius: '16px', padding: '20px', marginBottom: '24px', textAlign: 'left',
            }}>
              <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#2563eb', marginBottom: '12px' }}>
                🗺️ WHAT TO LEARN NEXT
              </div>
              {[
                { icon: '🤖', label: 'Explore AI & Machine Learning' },
                { icon: '📊', label: 'Level up with Data Science' },
                { icon: '💸', label: 'Start Freelancing with your skills' },
              ].map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 16px', background: '#fff', borderRadius: '12px',
                  border: '1px solid #f0f0f0', cursor: 'pointer',
                  fontSize: '14px', fontWeight: '600', color: '#111',
                  marginBottom: '8px',
                }} onClick={onRestart}>
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                  <span style={{ marginLeft: 'auto', color: '#2563eb' }}>→</span>
                </div>
              ))}
            </div>

            <button onClick={onRestart} style={{
              width: '100%', padding: '16px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff', border: 'none', borderRadius: '14px',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
            }}>
              Start a New Path →
            </button>
          </div>
        ) : isFinished ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 24px',
            background: '#fff',
            borderRadius: '24px',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.04)',
          }}>

            {/* Celebration */}
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>🎓</div>
            <h2 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '26px', fontWeight: '800',
              color: '#111', marginBottom: '8px',
              letterSpacing: '-0.5px',
            }}>You finished your roadmap!</h2>
            <p style={{ fontSize: '15px', color: '#666', marginBottom: '32px', lineHeight: '1.6' }}>
              Most beginners never get this far. You did.
            </p>

            {/* Stats Row */}
            <div style={{
              display: 'flex', gap: '12px',
              justifyContent: 'center',
              marginBottom: '32px',
              flexWrap: 'wrap',
            }}>
              <div style={{
                background: '#eff6ff', border: '1px solid #bfdbfe',
                borderRadius: '16px', padding: '16px 24px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#2563eb' }}>
                  {totalSteps}
                </div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>
                  Tasks Done
                </div>
              </div>
              <div style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: '16px', padding: '16px 24px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#16a34a' }}>
                  {Math.ceil(totalSteps / 3)}
                </div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>
                  Days Completed
                </div>
              </div>
              <div style={{
                background: '#fff7ed', border: '1px solid #fed7aa',
                borderRadius: '16px', padding: '16px 24px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#ea580c' }}>
                  🔥 {streak || 0}
                </div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>
                  Day Streak
                </div>
              </div>
            </div>

            {/* Next Roadmap Suggestion */}
            <div style={{
              background: '#fafafa', border: '1px solid #f0f0f0',
              borderRadius: '16px', padding: '20px',
              marginBottom: '24px', textAlign: 'left',
            }}>
              <div style={{
                fontSize: '11px', fontWeight: '700',
                letterSpacing: '1px', color: '#2563eb',
                marginBottom: '12px',
              }}>🗺️ WHAT TO LEARN NEXT</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {getNextRoadmapSuggestions(activePlan?.field).map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center',
                    gap: '10px', padding: '12px 16px',
                    background: '#fff', borderRadius: '12px',
                    border: '1px solid #f0f0f0', cursor: 'pointer',
                    fontSize: '14px', fontWeight: '600', color: '#111',
                  }} onClick={() => handleRestartWithField(s.field)}>
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                    <span style={{ marginLeft: 'auto', color: '#2563eb' }}>→</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Restart Button */}
            <button onClick={onRestart} style={{
              width: '100%', padding: '16px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff', border: 'none',
              borderRadius: '14px', fontSize: '15px',
              fontWeight: '700', cursor: 'pointer',
              fontFamily: 'Sora, sans-serif',
            }}>
              Start a New Path →
            </button>
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
              const STEPS_PER_DAY = 3
              const stepDay = Math.floor(index / STEPS_PER_DAY) + 1
              const completedDays = Math.floor(currentStepIndex / STEPS_PER_DAY)
              const isDayUnlocked = stepDay <= completedDays + 1
              const isDayStart = index % STEPS_PER_DAY === 0

              const currentDayStart = Math.floor(currentStepIndex / STEPS_PER_DAY) * STEPS_PER_DAY
              const stepDayStart = Math.floor(index / STEPS_PER_DAY) * STEPS_PER_DAY
              const isLocked = stepDayStart > currentDayStart
              const isComplete = index < currentStepIndex
              const isCurrent = !isComplete && !isLocked

              return (
                <div key={index}>
                  {isDayStart && (
                    <div 
                      onClick={() => toggleDay(stepDay)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        margin: index === 0 ? '0 0 10px' : '20px 0 10px',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        letterSpacing: '1.5px',
                        color: isDayUnlocked ? '#2563eb' : '#bbb',
                        background: isDayUnlocked ? '#eff6ff' : '#f5f5f5',
                        padding: '4px 12px',
                        borderRadius: '100px',
                        border: `1px solid ${isDayUnlocked ? '#bfdbfe' : '#eee'}`,
                      }}>DAY {stepDay}</span>

                      <div style={{ flex: 1, height: '1px', background: isDayUnlocked ? '#bfdbfe' : '#eee' }}/>

                      {!isDayUnlocked && 
                        <span style={{ fontSize: '12px', color: '#bbb' }}>🔒 Locked</span>}
                      {isDayUnlocked && stepDay <= completedDays && 
                        <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>✅ Complete</span>}
                      {isDayUnlocked && stepDay === completedDays + 1 && 
                        <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600' }}>🔥 In Progress</span>}

                      <span style={{
                        fontSize: '16px',
                        color: isDayUnlocked ? '#2563eb' : '#bbb',
                        transition: 'transform 0.3s',
                        transform: expandedDays[stepDay] ? 'rotate(180deg)' : 'rotate(0deg)',
                        marginLeft: '4px',
                      }}>⌄</span>
                    </div>
                  )}

                  {expandedDays[stepDay] && (
                    <div style={{
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        padding: '16px 18px',
                        borderRadius: '14px',
                        marginBottom: '8px',
                        opacity: isLocked ? '0.45' : '1',
                        background: isCurrent ? '#eff6ff' : isComplete ? '#f0fdf4' : '#fafafa',
                        border: `1.5px solid ${isCurrent ? '#bfdbfe' : isComplete ? '#bbf7d0' : '#f0f0f0'}`,
                      }}>
                        {/* Icon Circle */}
                        <div style={{
                          width: '36px', height: '36px',
                          borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '16px',
                          background: isCurrent ? '#dbeafe' : isComplete ? '#dcfce7' : '#f0f0f0',
                        }}>
                          {isComplete ? '✅' : isCurrent ? '📍' : '🔒'}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{
                              fontSize: '10px', fontWeight: '700',
                              letterSpacing: '1px', padding: '2px 8px',
                              borderRadius: '100px',
                              background: isCurrent ? '#2563eb' : isComplete ? '#16a34a' : '#e5e7eb',
                              color: isCurrent || isComplete ? '#fff' : '#999',
                            }}>DAY {stepDay}</span>
                            <span style={{
                              fontSize: '10px', fontWeight: '600',
                              color: isCurrent ? '#2563eb' : isComplete ? '#16a34a' : '#bbb',
                            }}>
                              {isComplete ? 'COMPLETE' : isCurrent ? 'CURRENT TASK' : 'LOCKED'}
                            </span>
                          </div>

                          <div style={{
                            fontSize: '14px', fontWeight: '600',
                            color: isLocked ? '#bbb' : '#111',
                            lineHeight: '1.4', marginBottom: '3px',
                          }}>{step.name}</div>

                          {!isLocked && (
                            <div style={{ fontSize: '12px', color: '#888', lineHeight: '1.4' }}>
                              {step.why}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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

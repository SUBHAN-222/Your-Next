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

function getAINextLevelRecommendation(field) {
  const f = String(field || '').toLowerCase()
  if (f.includes('web')) {
    return {
      title: 'Build an Independent Full-Stack Capstone',
      description: 'Now that you understand frontend basics and APIs, build a full-stack SaaS app with React, Supabase, and User Authentication.',
      nextTier: 'Advanced React & Full-Stack Engineering'
    }
  }
  if (f.includes('ai') || f.includes('machine')) {
    return {
      title: 'Fine-Tune & Deploy an Autonomous AI Agent',
      description: 'Take your API knowledge further by building an autonomous RAG (Retrieval-Augmented Generation) agent that reads custom PDFs.',
      nextTier: 'Autonomous AI Agents & PyTorch'
    }
  }
  if (f.includes('data')) {
    return {
      title: 'Publish an Interactive End-to-End Data Dashboard',
      description: 'Clean a messy 10,000-row real dataset from Kaggle and deploy a live Streamlit dashboard with predictive insights.',
      nextTier: 'Machine Learning & Predictive Modeling'
    }
  }
  if (f.includes('cyber') || f.includes('security')) {
    return {
      title: 'Tackle Real-World Bug Bounties & CTFs',
      description: 'Apply your networking and Linux skills to complete 5 intermediate rooms on TryHackMe and write formal pentest audit reports.',
      nextTier: 'Offensive Security & Web App Pentesting'
    }
  }
  if (f.includes('mobile')) {
    return {
      title: 'Publish a Cross-Platform Mobile App to Stores',
      description: 'Connect your React Native app to a live Supabase backend, set up push notifications, and build a standalone APK.',
      nextTier: 'Full Mobile App Architecture & Expo Deployment'
    }
  }
  if (f.includes('design') || f.includes('ui')) {
    return {
      title: 'Publish an Interactive 3-Case-Study Figma Portfolio',
      description: 'Design a scalable design system with Auto Layout and component variants, then document your full UX process in a Behance case study.',
      nextTier: 'Design Systems & Product Strategy'
    }
  }
  if (f.includes('freelance')) {
    return {
      title: 'Land Your First Paid Retainer Client',
      description: 'Optimize your Upwork/LinkedIn profiles, reach out to 10 prospective businesses with personalized video audits, and close a monthly retainer.',
      nextTier: 'High-Ticket Client Acquisition & Agency Scaling'
    }
  }
  return {
    title: 'Build a Real Capstone Project',
    description: 'Combine all your new skills into one portfolio-grade project that solves a real problem for real users.',
    nextTier: 'Advanced Specialization & Portfolio Showcase'
  }
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
  const [copiedStreak, setCopiedStreak] = useState(false)

  const handleShareStreak = useCallback(() => {
    const fieldName = roadmapData?.field || 'Tech'
    const totalCount = roadmapData?.steps?.length || 9
    const shareText = `🏆 I just finished my ${fieldName} roadmap on YourNext! Completed ${totalCount}/${totalCount} steps with a 🔥 ${streak || 1}-task streak. Escaped Tutorial Hell 🚀`
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareText)
    }
    setCopiedStreak(true)
    setTimeout(() => setCopiedStreak(false), 3000)
  }, [roadmapData?.field, roadmapData?.steps?.length, streak])

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
  const totalSteps = roadmapData?.steps?.length || 9
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
        {isFinished ? (
          /* ── FULL COMPLETION SCREEN ── */
          <div style={{
            textAlign: 'center',
            padding: '40px 24px',
            background: 'linear-gradient(160deg, #fff 60%, #eff6ff 100%)',
            borderRadius: '28px',
            border: '1px solid rgba(37,99,235,0.12)',
            boxShadow: '0 20px 64px rgba(37,99,235,0.08)',
          }}>

            {/* Celebration hero */}
            <div style={{ fontSize: '64px', marginBottom: '12px', lineHeight: 1 }}>🎓</div>
            <div style={{
              display: 'inline-block',
              fontSize: '11px', fontWeight: '800', letterSpacing: '2px',
              color: '#2563eb', background: '#eff6ff',
              border: '1px solid #bfdbfe',
              padding: '4px 14px', borderRadius: '100px',
              marginBottom: '16px',
            }}>TUTORIAL HELL ESCAPED 🚀</div>
            <h2 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '28px', fontWeight: '800',
              color: '#111', marginBottom: '10px',
              letterSpacing: '-0.5px', lineHeight: '1.2',
            }}>You finished your {fieldLabel} roadmap!</h2>
            <p style={{ fontSize: '15px', color: '#555', marginBottom: '8px', lineHeight: '1.65', maxWidth: '360px', margin: '0 auto 8px' }}>
              Most beginners never get this far. You did — and that separates you from 90% of passive learners.
            </p>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '32px', lineHeight: '1.6', maxWidth: '340px', margin: '0 auto 32px' }}>
              You didn't just watch tutorials. You completed real hands-on tasks. That's how real skills are built.
            </p>

            {/* Stats Row */}
            <div style={{
              display: 'flex', gap: '12px',
              justifyContent: 'center',
              marginBottom: '28px',
              flexWrap: 'wrap',
            }}>
              <div style={{
                background: '#eff6ff', border: '1px solid #bfdbfe',
                borderRadius: '18px', padding: '18px 26px', textAlign: 'center',
                minWidth: '90px',
              }}>
                <div style={{ fontSize: '30px', fontWeight: '900', color: '#2563eb' }}>{totalSteps}</div>
                <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700', letterSpacing: '0.5px', marginTop: '2px' }}>TASKS DONE</div>
              </div>
              <div style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: '18px', padding: '18px 26px', textAlign: 'center',
                minWidth: '90px',
              }}>
                <div style={{ fontSize: '30px', fontWeight: '900', color: '#16a34a' }}>{Math.ceil(totalSteps / 3)}</div>
                <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700', letterSpacing: '0.5px', marginTop: '2px' }}>DAYS DONE</div>
              </div>
              <div style={{
                background: '#fff7ed', border: '1px solid #fed7aa',
                borderRadius: '18px', padding: '18px 26px', textAlign: 'center',
                minWidth: '90px',
              }}>
                <div style={{ fontSize: '30px', fontWeight: '900', color: '#ea580c' }}>🔥 {streak || totalSteps}</div>
                <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700', letterSpacing: '0.5px', marginTop: '2px' }}>TASK STREAK</div>
              </div>
            </div>

            {/* AI Next-Level Recommendation */}
            {(() => {
              const rec = getAINextLevelRecommendation(roadmapData?.field)
              return (
                <div style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                  borderRadius: '20px', padding: '24px',
                  marginBottom: '20px', textAlign: 'left',
                  boxShadow: '0 8px 32px rgba(37,99,235,0.25)',
                }}>
                  <div style={{
                    fontSize: '10px', fontWeight: '800', letterSpacing: '2px',
                    color: '#93c5fd', marginBottom: '10px',
                  }}>🤖 AI NEXT-LEVEL RECOMMENDATION</div>
                  <div style={{
                    fontSize: '16px', fontWeight: '800', color: '#fff',
                    marginBottom: '8px', lineHeight: '1.3',
                  }}>{rec.title}</div>
                  <div style={{
                    fontSize: '13px', color: '#bfdbfe',
                    lineHeight: '1.6', marginBottom: '14px',
                  }}>{rec.description}</div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '100px', padding: '5px 14px',
                    fontSize: '11px', fontWeight: '700', color: '#fff',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}>🎯 Next Tier: {rec.nextTier}</div>
                </div>
              )
            })()}

            {/* Next Roadmap Suggestions */}
            <div style={{
              background: '#fafafa', border: '1px solid #f0f0f0',
              borderRadius: '18px', padding: '20px',
              marginBottom: '20px', textAlign: 'left',
            }}>
              <div style={{
                fontSize: '11px', fontWeight: '800',
                letterSpacing: '1.5px', color: '#2563eb',
                marginBottom: '14px',
              }}>🗺️ WHAT TO LEARN NEXT</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {getNextRoadmapSuggestions(activePlan?.field).map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center',
                    gap: '12px', padding: '14px 16px',
                    background: '#fff', borderRadius: '14px',
                    border: '1px solid #e5e7eb', cursor: 'pointer',
                    fontSize: '14px', fontWeight: '600', color: '#111',
                    transition: 'border-color 0.2s',
                  }} onClick={() => handleRestartWithField(s.field)}>
                    <span style={{ fontSize: '20px' }}>{s.icon}</span>
                    <span style={{ flex: 1 }}>{s.label}</span>
                    <span style={{ color: '#2563eb', fontWeight: '700' }}>→</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={onRestart} style={{
                width: '100%', padding: '17px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff', border: 'none',
                borderRadius: '16px', fontSize: '15px',
                fontWeight: '700', cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                boxShadow: '0 6px 24px rgba(37,99,235,0.3)',
                letterSpacing: '0.02em',
              }}>
                🚀 Generate Next Roadmap
              </button>
              <button onClick={handleShareStreak} style={{
                width: '100%', padding: '14px',
                background: copiedStreak ? '#f0fdf4' : '#f9fafb',
                color: copiedStreak ? '#16a34a' : '#374151',
                border: `1px solid ${copiedStreak ? '#bbf7d0' : '#e5e7eb'}`,
                borderRadius: '14px', fontSize: '14px',
                fontWeight: '600', cursor: 'pointer',
                fontFamily: 'Sora, sans-serif',
                transition: 'all 0.25s',
              }}>
                {copiedStreak ? '✅ Copied to clipboard!' : '📋 Copy & Share My Streak'}
              </button>
            </div>
          </div>
        ) : dayCompleted ? (
          /* ── INTER-DAY COMPLETION SCREEN ── */
          <div style={{
            textAlign: 'center',
            padding: '40px 24px',
            background: '#fff',
            borderRadius: '24px',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.04)',
          }}>
            <div style={{ fontSize: '52px', marginBottom: '12px' }}>🌟</div>
            <h2 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '24px', fontWeight: '800',
              color: '#111', marginBottom: '8px',
            }}>Day {currentDay} Complete!</h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '28px', lineHeight: '1.65' }}>
              Excellent work — you crushed all {completedTodayCount || 3} tasks for today.
              Ready to keep the momentum going?
            </p>

            <div style={{
              display: 'flex', gap: '10px',
              justifyContent: 'center', marginBottom: '28px', flexWrap: 'wrap',
            }}>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '14px 20px' }}>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#2563eb' }}>{completedTodayCount || 3}</div>
                <div style={{ fontSize: '11px', color: '#666', fontWeight: '600' }}>Tasks Done</div>
              </div>
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '14px', padding: '14px 20px' }}>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#ea580c' }}>🔥 {streak || 0}</div>
                <div style={{ fontSize: '11px', color: '#666', fontWeight: '600' }}>Task Streak</div>
              </div>
            </div>

            {/* Primary CTA — advance to next day immediately */}
            {currentDay < totalDays ? (
              <button
                id="start-next-day-btn"
                onClick={startNextDay}
                style={{
                  width: '100%', padding: '17px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#fff', border: 'none',
                  borderRadius: '16px', fontSize: '15px',
                  fontWeight: '700', cursor: 'pointer',
                  fontFamily: 'Sora, sans-serif',
                  boxShadow: '0 6px 24px rgba(37,99,235,0.28)',
                  letterSpacing: '0.02em',
                  marginBottom: '10px',
                  display: 'block',
                }}
              >
                🚀 Start Day {currentDay + 1} →
              </button>
            ) : null}

            <button onClick={onRestart} style={{
              width: '100%', padding: '13px',
              background: 'transparent', color: '#9ca3af',
              border: '1px solid #e5e7eb',
              borderRadius: '14px', fontSize: '13px',
              fontWeight: '600', cursor: 'pointer',
            }}>
              ← Back to Home
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

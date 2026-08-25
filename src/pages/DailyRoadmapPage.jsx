import { useEffect } from 'react'
import { useDailyRoadmap } from '@hooks/useDailyRoadmap'
import LevelCheckCard from '@components/LevelCheckCard'

function DailyRoadmapPage({ plan, onRestart }) {
  const {
    currentTask,
    currentIndex,
    isComplete,
    streak,
    momentumMessage,
    showMomentum,
    hideMomentum,
    pendingCheck,
    answerLevelCheck,
    completeCurrentTask,
    loadedWeeks,
    totalWeeks,
  } = useDailyRoadmap(plan)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentIndex])

  useEffect(() => {
    if (!showMomentum) return
    const timer = setTimeout(hideMomentum, 4000)
    return () => clearTimeout(timer)
  }, [showMomentum, hideMomentum])

  if (pendingCheck) {
    return (
      <section className="screen active" id="s-ob" style={{ padding: '60px 20px' }}>
        <LevelCheckCard checkData={pendingCheck} onAnswer={answerLevelCheck} />
      </section>
    )
  }

  if (isComplete) {
    return (
      <section className="screen active" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="active-step-card" style={{ maxWidth: 480, margin: '0 auto' }}>
          <div className="step-kicker">🎉 ROADMAP COMPLETE</div>
          <div className="step-name">You finished your {plan.field} journey.</div>
          <p className="step-why">
            Every daily task, done — that's a genuinely rare finish. Time to pick what's next.
          </p>
          <button type="button" className="complete-btn" onClick={onRestart}>
            Start Something New
          </button>
        </div>
      </section>
    )
  }

  if (!currentTask) {
    return (
      <section className="screen active" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <p className="ob-loading">Preparing your first day…</p>
      </section>
    )
  }

  return (
    <section className="screen active" style={{ padding: '32px 20px 60px' }}>
      {showMomentum && (
        <div className="momentum-banner show" style={{ maxWidth: 480, margin: '0 auto 16px' }}>
          {momentumMessage}
        </div>
      )}

      <div className="active-step-card" style={{ maxWidth: 480, margin: '0 auto' }}>
        <div className="daily-focus-header">
          <span className="daily-focus-dot" />
          <span className="daily-focus-label">Day {currentTask.dayNumber} • Week {loadedWeeks} of {totalWeeks}</span>
        </div>

        <div className="step-kicker">
          {currentTask.isBooster ? '💡 EXTRA PRACTICE' : plan.field?.toUpperCase()}
        </div>
        <div className="step-name">{currentTask.name}</div>
        <p className="step-why">{currentTask.why}</p>

        <div className="step-meta">{currentTask.time}</div>

        {currentTask.resourceUrl && (
          <a
            href={currentTask.resourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="resource-btn"
          >
            {currentTask.resourceTitle || 'Open Resource'} →
          </a>
        )}

        <div className="practice-box">
          <div className="practice-label">Today's Task</div>
          <div className="practice-task">{currentTask.task}</div>
        </div>

        <button type="button" className="complete-btn" onClick={completeCurrentTask}>
          Mark as Complete
        </button>
      </div>
    </section>
  )
}

export default DailyRoadmapPage

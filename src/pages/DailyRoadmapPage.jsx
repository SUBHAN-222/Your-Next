import { useEffect } from 'react'
import { useDailyRoadmap } from '@hooks/useDailyRoadmap'
import LevelCheckQuiz from '@components/LevelCheckQuiz'
import TaskFeedbackPrompt from '@components/TaskFeedbackPrompt'
import RoadmapFlashcards from '@components/RoadmapFlashcards'
import ProgressDashboard from '@components/ProgressDashboard'

function DailyRoadmapPage({ plan, onRestart }) {
  const {
    currentTask,
    currentIndex,
    isComplete,
    streak,
    momentumMessage,
    showMomentum,
    hideMomentum,
    awaitingFeedback,
    requestCompletion,
    submitFeedback,
    pendingQuiz,
    finishQuiz,
    quizResult,
    continueAfterQuizResults,
    macroProgress,
    showFullRoadmap,
    toggleFullRoadmap,
    loadedWeeks,
    totalWeeks,
    progressStats,
    totalPlannedTasks,
  } = useDailyRoadmap(plan)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentIndex])

  useEffect(() => {
    if (!showMomentum) return
    const timer = setTimeout(hideMomentum, 4000)
    return () => clearTimeout(timer)
  }, [showMomentum, hideMomentum])

  if (pendingQuiz) {
    return (
      <section className="screen active" id="s-ob" style={{ padding: '60px 20px' }}>
        <LevelCheckQuiz questions={pendingQuiz.questions} onFinish={finishQuiz} />
      </section>
    )
  }

  if (quizResult) {
    const pct = quizResult.total ? Math.round((quizResult.scoreCount / quizResult.total) * 100) : 0
    return (
      <section className="screen active" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="active-step-card" style={{ maxWidth: 460, margin: '0 auto' }}>
          <div className="step-kicker">✅ CHECK-IN COMPLETE</div>
          <div className="step-name">{quizResult.scoreCount}/{quizResult.total} correct ({pct}%)</div>
          {quizResult.weakTopics.length > 0 ? (
            <p className="step-why">
              We noticed you could use more practice on:{' '}
              <strong>{quizResult.weakTopics.join(', ')}</strong>. Extra tasks on these will show up soon.
            </p>
          ) : (
            <p className="step-why">Solid across the board — no weak spots flagged this time.</p>
          )}
          <button type="button" className="complete-btn" onClick={continueAfterQuizResults}>
            Continue Roadmap
          </button>
        </div>
      </section>
    )
  }

  if (awaitingFeedback) {
    return (
      <section className="screen active" id="s-ob" style={{ padding: '60px 20px' }}>
        <TaskFeedbackPrompt onSelect={submitFeedback} />
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
        <div className="momentum-banner show yn-roadmap-banner">
          {momentumMessage}
        </div>
      )}

      <div className="yn-roadmap-layout">
        <div className="yn-main-col">
          <div className="active-step-card">
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
              <a href={currentTask.resourceUrl} target="_blank" rel="noopener noreferrer" className="resource-btn">
                {currentTask.resourceTitle || 'Open Resource'} →
              </a>
            )}

            <div className="practice-box">
              <div className="practice-label">Today's Task</div>
              <div className="practice-task">{currentTask.task}</div>
            </div>

            <button type="button" className="complete-btn" onClick={requestCompletion}>
              Mark as Complete
            </button>
          </div>

          <div className="yn-mobile-toggle">
            <button type="button" onClick={toggleFullRoadmap} className="yn-toggle-link">
              {showFullRoadmap ? 'Hide Full Roadmap ▲' : 'View Full Roadmap ▼'}
            </button>
          </div>
        </div>

        <div className={`yn-side-col ${showFullRoadmap ? 'yn-side-col--open' : ''}`}>
          <ProgressDashboard
            tasksCompleted={currentIndex}
            totalPlannedTasks={totalPlannedTasks}
            streak={streak}
            avgScore={progressStats.avgScore}
            weakTopicsCount={progressStats.weakTopicsCount}
          />
          <div style={{ marginTop: 16 }}>
            <RoadmapFlashcards macroProgress={macroProgress} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default DailyRoadmapPage

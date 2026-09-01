function ProgressDashboard({ tasksCompleted, totalPlannedTasks, streak, avgScore, weakTopicsCount }) {
  const pct = totalPlannedTasks
    ? Math.min(100, Math.round((tasksCompleted / totalPlannedTasks) * 100))
    : 0

  return (
    <div className="progress-dashboard yn-fade-up">
      <div className="progress-dashboard-title">Your Progress</div>

      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-bar-label">{pct}% through your roadmap</div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{tasksCompleted}</div>
          <div className="stat-label">Tasks Done</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">🔥 {streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{avgScore !== null ? `${avgScore}%` : '—'}</div>
          <div className="stat-label">Quiz Avg</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{weakTopicsCount}</div>
          <div className="stat-label">Weak Topics</div>
        </div>
      </div>
    </div>
  )
}

export default ProgressDashboard

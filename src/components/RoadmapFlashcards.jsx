function RoadmapFlashcards({ macroProgress }) {
  const icons = ['🎯', '⚙️', '🛠️', '🚀', '🏆']

  return (
    <div className="future-path yn-fade-up" style={{ maxWidth: 480, margin: '20px auto 0' }}>
      <div className="future-path-title">Your Full Journey</div>
      <p className="future-path-sub">
        Your daily tasks are drawn from these milestones, one small piece at a time.
      </p>

      <div className="flashcard-track">
        {macroProgress.map((step, i) => (
          <div key={step.name} className={`flashcard flashcard--${step.status}`}>
            <span className="flashcard-icon">{icons[i % icons.length]}</span>
            <span className="flashcard-status-badge">
              {step.status === 'done' ? '✓ Done' : step.status === 'current' ? '● Now' : '🔒'}
            </span>
            <span className="flashcard-name">{step.name}</span>
          </div>
        ))}
      </div>

      <p className="future-path-caption">Milestones repeat with fresh review passes as your roadmap continues.</p>
    </div>
  )
}

export default RoadmapFlashcards

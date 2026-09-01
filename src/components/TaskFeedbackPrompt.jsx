function TaskFeedbackPrompt({ onSelect }) {
  const options = [
    { value: 'completed', label: 'I completed it', emoji: '🟢' },
    { value: 'stuck', label: 'I got stuck', emoji: '🟡' },
    { value: 'not_started', label: "I couldn't start", emoji: '🔴' },
  ]

  return (
    <div className="active-step-card yn-scale-in" style={{ maxWidth: 420, margin: '0 auto' }}>
      <div className="step-kicker">HOW DID IT GO?</div>
      <div className="step-name" style={{ fontSize: 20, marginBottom: 20 }}>
        Be honest — this shapes what comes next.
      </div>

      <div className="ob-opts">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className="quiz-card quiz-card--amber"
            onClick={() => onSelect(opt.value)}
          >
            <span className="quiz-card-icon" aria-hidden="true">{opt.emoji}</span>
            <span className="quiz-card-body">
              <span className="quiz-card-title">{opt.label}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TaskFeedbackPrompt

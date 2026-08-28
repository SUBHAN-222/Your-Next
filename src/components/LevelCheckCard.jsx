import { useState } from 'react'

function LevelCheckCard({ checkData, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  if (!checkData) return null

  const handleSubmit = () => {
    if (!selected || submitted) return
    setSubmitted(true)
    const wasCorrect = selected === checkData.correctAnswer
    setTimeout(() => onAnswer(selected, wasCorrect), 1400)
  }

  return (
    <div className="active-step-card yn-scale-in" style={{ maxWidth: 480, margin: '0 auto' }}>
      <div className="step-kicker">⚡ QUICK CHECK-IN</div>
      <div className="step-name" style={{ fontSize: 22 }}>{checkData.question}</div>

      <div className="ob-opts" style={{ marginTop: 20 }}>
        {checkData.options.map((opt) => {
          const isPicked = selected === opt
          const isCorrectReveal = submitted && opt === checkData.correctAnswer
          const isWrongPick = submitted && isPicked && opt !== checkData.correctAnswer

          return (
            <button
              key={opt}
              type="button"
              className={[
                'quiz-card',
                'quiz-card--cyan',
                isPicked ? 'selected' : '',
                isCorrectReveal ? 'yn-scale-in' : '',
              ].filter(Boolean).join(' ')}
              style={
                isCorrectReveal
                  ? { borderColor: '#10b981', background: '#ecfdf5' }
                  : isWrongPick
                  ? { borderColor: '#ef4444', background: '#fef2f2' }
                  : undefined
              }
              onClick={() => !submitted && setSelected(opt)}
              disabled={submitted}
            >
              <span className="quiz-card-body">
                <span className="quiz-card-title">{opt}</span>
              </span>
            </button>
          )
        })}
      </div>

      {!submitted ? (
        <button
          type="button"
          className="complete-btn"
          style={{ marginTop: 24 }}
          onClick={handleSubmit}
          disabled={!selected}
        >
          Submit
        </button>
      ) : (
        <p className="step-why" style={{ marginTop: 20, textAlign: 'center' }}>
          {selected === checkData.correctAnswer
            ? "Nice — that's right. Continuing your roadmap…"
            : "No worries — we'll circle back to this soon. Continuing…"}
        </p>
      )}
    </div>
  )
}

export default LevelCheckCard

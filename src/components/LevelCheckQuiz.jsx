import { useState } from 'react'

function LevelCheckQuiz({ questions, onFinish }) {
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [answered, setAnswered] = useState([])

  if (!questions?.length) return null

  const current = questions[qIndex]
  const isLast = qIndex === questions.length - 1

  const handleSubmit = () => {
    if (!selected || submitted) return
    setSubmitted(true)
  }

  const handleNext = () => {
    const wasCorrect = selected === current.correctAnswer
    const updated = [...answered, { ...current, selected, wasCorrect }]
    setAnswered(updated)

    if (isLast) {
      onFinish(updated)
      return
    }

    setQIndex((i) => i + 1)
    setSelected(null)
    setSubmitted(false)
  }

  return (
    <div className="active-step-card yn-scale-in" style={{ maxWidth: 480, margin: '0 auto' }}>
      <div className="step-kicker">⚡ QUICK CHECK-IN — {qIndex + 1} OF {questions.length}</div>
      <div className="step-name" style={{ fontSize: 20 }}>{current.question}</div>

      <div className="ob-opts" style={{ marginTop: 16 }}>
        {current.options.map((opt) => {
          const isPicked = selected === opt
          const isCorrectReveal = submitted && opt === current.correctAnswer
          const isWrongPick = submitted && isPicked && opt !== current.correctAnswer

          return (
            <button
              key={opt}
              type="button"
              className={['quiz-card', 'quiz-card--cyan', isPicked ? 'selected' : ''].filter(Boolean).join(' ')}
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
        <button type="button" className="complete-btn" style={{ marginTop: 20 }} onClick={handleSubmit} disabled={!selected}>
          Submit Answer
        </button>
      ) : (
        <button type="button" className="complete-btn" style={{ marginTop: 20 }} onClick={handleNext}>
          {isLast ? 'See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  )
}

export default LevelCheckQuiz

import { useState } from 'react'
import { saveResourcePreference } from '@utils/progressStorage'

export default function LearningStyleModal({ onConfirmed }) {
  const [selection, setSelection] = useState('video')

  const confirm = () => {
    const preference = saveResourcePreference(selection)
    onConfirmed?.(preference)
  }

  return (
    <div className="learning-style-overlay" role="presentation">
      <section className="learning-style-modal" role="dialog" aria-modal="true" aria-labelledby="learning-style-title">
        <p className="learning-style-eyebrow">Before we start</p>
        <h2 id="learning-style-title">How do you want to learn?</h2>
        <p className="learning-style-subtitle">Choose the format that feels best for you.</p>

        <div className="learning-style-options" role="radiogroup" aria-label="Learning style">
          <button type="button" role="radio" aria-checked={selection === 'video'} className={`learning-style-option ${selection === 'video' ? 'active' : ''}`} onClick={() => setSelection('video')}>
            <span className="learning-style-icon" aria-hidden="true">🎥</span>
            <span className="learning-style-option-title">Watch &amp; Learn</span>
            <span className="learning-style-option-copy">Short guided videos for every task.</span>
            <span className="learning-style-check" aria-hidden="true">✓</span>
          </button>
          <button type="button" role="radio" aria-checked={selection === 'documentation'} className={`learning-style-option ${selection === 'documentation' ? 'active' : ''}`} onClick={() => setSelection('documentation')}>
            <span className="learning-style-icon" aria-hidden="true">📄</span>
            <span className="learning-style-option-title">Read &amp; Learn</span>
            <span className="learning-style-option-copy">Focused articles and documentation.</span>
            <span className="learning-style-check" aria-hidden="true">✓</span>
          </button>
        </div>

        <button type="button" className="learning-style-continue" onClick={confirm}>Continue</button>
        <p className="learning-style-caption">You can switch this later from your roadmap.</p>
      </section>
    </div>
  )
}

import { useState } from 'react'

export default function LearningStyleModal({ onSelect }) {
  const [choice, setChoice] = useState('video')

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <div style={styles.eyebrow}>BEFORE WE START</div>
        <h2 style={styles.title}>How do you want to learn?</h2>
        <p style={styles.subtitle}>Pick what works best for you — you can change this anytime.</p>

        <div style={styles.options}>
          <button
            onClick={() => setChoice('video')}
            style={{ ...styles.option, ...(choice === 'video' ? styles.optionActive : {}) }}
          >
            <div style={styles.optionIcon}>🎥</div>
            <div style={styles.optionTitle}>Watch & Learn</div>
            <div style={styles.optionDesc}>Guided videos for every task.</div>
            {choice === 'video' && <div style={styles.check}>✓</div>}
          </button>

          <button
            onClick={() => setChoice('text')}
            style={{ ...styles.option, ...(choice === 'text' ? styles.optionActive : {}) }}
          >
            <div style={styles.optionIcon}>📄</div>
            <div style={styles.optionTitle}>Read & Learn</div>
            <div style={styles.optionDesc}>Focused articles and docs.</div>
            {choice === 'text' && <div style={styles.check}>✓</div>}
          </button>
        </div>

        <button style={styles.cta} onClick={() => onSelect(choice)}>
          Continue →
        </button>
        <div style={styles.caption}>You can switch this later from your roadmap.</div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: 20,
  },
  card: {
    background: '#fff', borderRadius: 20, padding: '32px 28px',
    maxWidth: 420, width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
    fontFamily: "'DM Sans', sans-serif",
  },
  eyebrow: { fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#2563EB', marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 800, color: '#0A0A0A', margin: '0 0 6px' },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 22, lineHeight: 1.5 },
  options: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 },
  option: {
    position: 'relative', border: '2px solid #E5E7EB', background: '#fff',
    borderRadius: 14, padding: '16px 14px', textAlign: 'left', cursor: 'pointer',
  },
  optionActive: { borderColor: '#2563EB', background: '#EFF6FF' },
  optionIcon: { fontSize: 20, marginBottom: 8 },
  optionTitle: { fontSize: 14.5, fontWeight: 700, color: '#0A0A0A', marginBottom: 4 },
  optionDesc: { fontSize: 12, color: '#6B7280', lineHeight: 1.4 },
  check: {
    position: 'absolute', top: 12, right: 12, width: 20, height: 20,
    borderRadius: '50%', background: '#2563EB', color: '#fff',
    fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  cta: {
    width: '100%', background: '#2563EB', color: '#fff', border: 'none',
    borderRadius: 12, padding: 14, fontSize: 14.5, fontWeight: 700, cursor: 'pointer',
  },
  caption: { textAlign: 'center', fontSize: 11.5, color: '#9CA3AF', marginTop: 12 },
}

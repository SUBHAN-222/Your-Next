import { useEffect, useState } from 'react'

const MESSAGES = [
  'Analyzing your answers...',
  'Mapping your personalized path...',
  'Crafting steps just for you...',
]

function AIRoadmapLoading({ welcomeMessage = null }) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (welcomeMessage) return
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [welcomeMessage])

  useEffect(() => {
    if (!welcomeMessage) return
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [welcomeMessage])

  return (
    <section className="screen active ai-roadmap-loading" id="s-ai-load">
      <div className="ai-load-inner">
        <div className="ai-load-ring" aria-hidden="true" />
        {welcomeMessage ? (
          <div
            className="ai-welcome-card"
            style={{
              transition: 'opacity 0.5s ease',
              opacity: visible ? 1 : 0,
            }}
          >
            <p className="ai-welcome-text">{welcomeMessage}</p>
          </div>
        ) : (
          <p className="ai-load-message">{MESSAGES[messageIndex]}</p>
        )}
      </div>
    </section>
  )
}

export default AIRoadmapLoading


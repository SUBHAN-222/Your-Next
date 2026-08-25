import { useEffect, useState } from 'react'

const MESSAGES = [
  'Analyzing your answers...',
  'Mapping your personalized path...',
  'Crafting steps just for you...',
]

function AIRoadmapLoading() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="screen active ai-roadmap-loading" id="s-ai-load">
      <div className="ai-load-inner">
        <div className="ai-load-ring" aria-hidden="true" />
        <p className="ai-load-message">{MESSAGES[messageIndex]}</p>
      </div>
    </section>
  )
}

export default AIRoadmapLoading

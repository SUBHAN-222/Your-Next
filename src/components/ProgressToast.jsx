import { useEffect } from 'react'

function ProgressToast({ message, onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => onDone?.(), 3000)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="progress-toast show" role="status">
      {message}
    </div>
  )
}

export default ProgressToast

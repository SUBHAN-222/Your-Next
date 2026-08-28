import { useEffect, useRef } from 'react'

const FEEDBACK_FORM_URL = 'https://forms.gle/XeGVcjPF7X5NdFFk6'

function FeedbackModal({ isOpen, onClose }) {
  const modalRef = useRef(null)
  const frameRef = useRef(null)
  const linkRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      // Set iframe src and fallback link
      if (frameRef.current && !frameRef.current.src) {
        frameRef.current.src = FEEDBACK_FORM_URL
      }
      if (linkRef.current) {
        linkRef.current.href = FEEDBACK_FORM_URL
      }
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`feedback-modal on${isOpen ? '' : ''}`}
      id="feedbackModal"
      ref={modalRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <div className="feedback-box">
        <div className="feedback-modal-top">
          <div className="feedback-modal-title" id="feedback-modal-title">
            Help us improve YourNext
          </div>
          <button
            className="feedback-close"
            onClick={onClose}
            aria-label="Close feedback form"
          >
            ×
          </button>
        </div>
        <iframe
          className="feedback-frame"
          ref={frameRef}
          title="YourNext feedback form"
        />
        <div className="feedback-fallback">
          If the form does not load,{' '}
          <a
            ref={linkRef}
            href={FEEDBACK_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            open it in a new tab
          </a>
          .
        </div>
      </div>
    </div>
  )
}

export default FeedbackModal
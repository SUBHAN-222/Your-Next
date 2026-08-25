/**
 * LoadingScreen Component
 * Displays an engaging loading state while generating recommendations
 */
function LoadingScreen({ step = 0 }) {
  const loadingMessages = [
    "Analyzing your responses...",
    "Matching your profile with career paths...",
    "Calculating personalized recommendations...",
    "Building your roadmap...",
    "Almost ready!"
  ];

  const currentMessage = loadingMessages[Math.min(step, loadingMessages.length - 1)];

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <div className="logo-pulse"></div>
          <span className="logo-text">Your<b>Next</b></span>
        </div>
        
        <div className="loading-animation">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <p className="loading-message">{currentMessage}</p>
        
        <div className="loading-progress">
          <div 
            className="loading-progress-bar" 
            style={{ width: `${((step + 1) / loadingMessages.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
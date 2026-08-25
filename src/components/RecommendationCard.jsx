/**
 * RecommendationCard Component
 * Displays the primary career recommendation with confidence score
 */
function RecommendationCard({ recommendation, isLoading }) {
  if (isLoading) {
    return (
      <div className="recommendation-card loading">
        <div className="loading-spinner"></div>
        <p>Analyzing your responses...</p>
      </div>
    );
  }

  if (!recommendation || !recommendation.primaryCareer) {
    return null;
  }

  const { primaryCareer } = recommendation;

  return (
    <div className="recommendation-card">
      <div className="rec-header">
        <span className="rec-icon">{primaryCareer.icon}</span>
        <div className="rec-title-section">
          <h2 className="rec-title">{primaryCareer.name}</h2>
          {primaryCareer.category && (
            <p className="rec-category">{primaryCareer.category.name}</p>
          )}
        </div>
        <div className="rec-confidence">
          <div className="confidence-bar">
            <div 
              className="confidence-fill" 
              style={{ width: `${primaryCareer.confidence}%` }}
            />
          </div>
          <span className="confidence-text">{primaryCareer.confidence}% match</span>
        </div>
      </div>

      <p className="rec-description">{primaryCareer.description}</p>

      {recommendation.personalizedSummary && (
        <div className="rec-summary">
          <p className="summary-opening">{recommendation.personalizedSummary.opening}</p>
          <p className="summary-experience">{recommendation.personalizedSummary.experience}</p>
          {recommendation.personalizedSummary.category && (
            <p className="summary-category">{recommendation.personalizedSummary.category}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default RecommendationCard;
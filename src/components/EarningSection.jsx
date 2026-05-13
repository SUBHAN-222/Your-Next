/**
 * EarningSection Component
 * Displays earning opportunities for the recommended path
 */
function EarningSection({ earningMethods }) {
  if (!earningMethods || earningMethods.length === 0) return null;

  const getTypeIcon = (type) => {
    const icons = {
      freelance: "💼",
      job: "🏢",
      product: "📦",
      retainer: "🔄",
      ad_revenue: "📺",
      sponsorships: "🤝",
      products: "📦",
      agency: "🏗️",
      productized: "📋",
      internship: "🎓",
      research: "🔬",
      startup: "🚀"
    };
    return icons[type] || "💰";
  };

  const getTypeLabel = (type) => {
    const labels = {
      freelance: "Freelance",
      job: "Full-time Job",
      product: "Build Products",
      retainer: "Retainer",
      ad_revenue: "Ad Revenue",
      sponsorships: "Sponsorships",
      products: "Digital Products",
      agency: "Agency",
      productized: "Productized Service",
      internship: "Internship",
      research: "Research",
      startup: "Startup"
    };
    return labels[type] || type;
  };

  return (
    <div className="earning-section">
      <h3 className="earning-title">💰 Earning Opportunities</h3>
      
      <div className="earning-grid">
        {earningMethods.map((method, index) => (
          <div key={index} className="earning-card">
            <div className="earning-header">
              <span className="earning-icon">{getTypeIcon(method.type)}</span>
              <span className="earning-type">{getTypeLabel(method.type)}</span>
            </div>
            
            <h4 className="earning-title-text">{method.title}</h4>
            
            {method.platforms && method.platforms.length > 0 && (
              <div className="earning-platforms">
                <span className="platform-label">Platforms:</span>
                <span className="platform-list">{method.platforms.join(", ")}</span>
              </div>
            )}
            
            {method.companies && method.companies.length > 0 && (
              <div className="earning-companies">
                <span className="company-label">Companies:</span>
                <span className="company-list">{method.companies.join(", ")}</span>
              </div>
            )}
            
            {method.examples && method.examples.length > 0 && (
              <div className="earning-examples">
                <span className="example-label">Examples:</span>
                <span className="example-list">{method.examples.join(", ")}</span>
              </div>
            )}
            
            <div className="earning-rate">
              {method.avgRate && <span className="rate">{method.avgRate}</span>}
              {method.avgSalary && <span className="rate">{method.avgSalary}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EarningSection;
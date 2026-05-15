import { useEffect, useState } from "react";
import { useRecommendation } from "@hooks/useRecommendation";
import LoadingScreen from "@components/LoadingScreen";
import SkillsSection from "@components/SkillsSection";

/**
 * Curated, beginner-friendly resource links for every skill keyword.
 * Every URL is a working, HTTPS resource. All links open in new tabs.
 */
const beginnerResources = {
  "Python": "https://www.learnpython.org",
  "Machine Learning": "https://developers.google.com/machine-learning/crash-course",
  "Andrew Ng": "https://www.coursera.org/learn/machine-learning",
  "Deep Learning": "https://course.fast.ai",
  "Mathematics": "https://www.khanacademy.org/math",
  "Linear Algebra": "https://www.khanacademy.org/math",
  "Statistics": "https://www.khanacademy.org/math/statistics-probability",
  "Neural Networks": "https://www.youtube.com/@3blue1brown",
  "Data Science": "https://www.kaggle.com/learn",
  "NLP": "https://huggingface.co/learn/nlp-course/chapter1/1",
  "Computer Vision": "https://www.youtube.com/watch?v=OXN3wuHUBP0",
  "AI Tools": "https://learnprompting.org/docs/intro",
  "Prompt Engineering": "https://learnprompting.org/docs/intro",
  "Git": "https://learngitbranching.js.org",
  "Version Control": "https://learngitbranching.js.org",
  "SQL": "https://www.w3schools.com/sql",
  "Databases": "https://www.w3schools.com/sql",
  "Kaggle": "https://www.kaggle.com",
  "Colab": "https://colab.research.google.com",
  "HackerRank": "https://www.hackerrank.com/domains/python"
};

/**
 * Validate that a URL is a real, working HTTPS URL (or HTTP for local dev).
 * Returns null for any invalid/placeholder/plain-text URL.
 */
function validateUrl(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (
    !trimmed ||
    trimmed === " " ||
    trimmed === "#" ||
    (trimmed.startsWith("http://") === false && trimmed.startsWith("https://") === false)
  ) {
    return null;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    if (parsed.hostname === "example.com" || parsed.hostname === "placeholder.com") return null;
    return trimmed;
  } catch {
    return null;
  }
}

/**
 * Get a beginner-friendly resource URL by matching step name against keywords.
 */
function getBeginnerResource(text) {
  for (const [keyword, url] of Object.entries(beginnerResources)) {
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
      return url;
    }
  }
  return null;
}

/**
 * Safe external link component that validates URLs and provides fallback.
 * Disables itself and shows "Coming Soon" if the URL is invalid.
 */
function SafeExternalLink({ href, label, className }) {
  const validUrl = validateUrl(href);
  if (!validUrl) {
    return <span className={`${className || ""} disabled-link`}>Coming Soon</span>;
  }
  return (
    <a
      href={validUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {label} →
    </a>
  );
}

function RoadmapPage({ answers, onRestart }) {
  const { recommendation, isReady } = useRecommendation(answers);
  const [showLoading, setShowLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showFullRoadmap, setShowFullRoadmap] = useState(false);

  // Handle loading sequence
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowLoading(false);
      setIsVisible(true);
    }, 2500);

    return () => clearTimeout(timer1);
  }, []);

  // Update loading message
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, 4));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (showLoading) {
    return <LoadingScreen step={loadingStep} />;
  }

  if (!isReady || !recommendation) {
    return (
      <section className="screen active roadmap-screen" id="s-res">
        <div className="error-state">
          <h2>Unable to generate recommendation</h2>
          <p>Please try again or restart the quiz.</p>
          <button className="complete-btn" onClick={onRestart}>
            Start Over →
          </button>
        </div>
      </section>
    );
  }

  const { primaryCareer, skills, tools, nextSteps, dontLearnYet } = recommendation;

  return (
    <section className="screen active roadmap-screen" id="s-res">
      {/* Fixed Navigation */}
      <nav className="res-nav">
        <button className="nav-logo" onClick={onRestart} aria-label="Go home">
          Your<b>Next</b>
        </button>
        <span className="nav-label">Your Path</span>
      </nav>

      {/* 1. Personalized Intro Section */}
      <div className={`roadmap-top ${isVisible ? "visible" : ""}`}>
        <h2 className="roadmap-h">
          Welcome to your <span id="resField">{primaryCareer.name}</span> journey.
        </h2>
        <p className="roadmap-sub">
          We've analyzed your goals to build this focused, one-step-at-a-time path.
        </p>
      </div>

      <div className="roadmap-container recommendation-container">
        
        {/* 2. Your First 3 Steps (MOST IMPORTANT SECTION) */}
        {nextSteps && nextSteps.length > 0 && (
          <div className="next-steps-section priority-block">
            <h3 className="section-title">Your First 3 Steps</h3>
            <p className="section-subtitle">Start here to build immediate momentum.</p>
            <div className="next-steps-grid">
              {nextSteps.map((step, index) => (
                <div key={index} className="next-step-card">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-content">
                    <h4>{step.title}</h4>
                    <p className="step-desc">{step.description}</p>
                    <div className="step-meta">
                      <span className="step-time">⏱️ {step.timeEstimate}</span>
                    </div>
                    <div className="step-action">
                      <span>🎯 {step.action}</span>
                    </div>
                    <SafeExternalLink
                      href={step.resource || ""}
                      label="Start Learning"
                      className="resource-link"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Don’t Learn This Yet */}
        {dontLearnYet && dontLearnYet.length > 0 && (
          <div className="dont-learn-section">
            <h3 className="dont-learn-title">
              <span>🛡️</span> Don't Learn This Yet
            </h3>
            <p className="dont-learn-subtitle">Avoid these for now to stay focused and reduce overwhelm.</p>
            <div className="dont-learn-list">
              {dontLearnYet.map((item, index) => (
                <div key={index} className="dont-learn-item">
                  <span className="dont-learn-icon">🔒</span>
                  <p className="dont-learn-text">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Your Complete Roadmap (Collapsible) */}
        {primaryCareer.roadmap && primaryCareer.roadmap.length > 0 && (
          <div className="full-roadmap-section">
            <button 
              className={`roadmap-toggle-btn ${showFullRoadmap ? 'open' : ''}`}
              onClick={() => setShowFullRoadmap(!showFullRoadmap)}
            >
              <span>View Your Complete Roadmap</span>
              <span className="roadmap-toggle-icon">▼</span>
            </button>
            
            <div className={`roadmap-content-wrapper ${showFullRoadmap ? 'open' : ''}`}>
              <p className="roadmap-level">
                Current Focus: <strong>{primaryCareer.experienceLevel}</strong>
              </p>
              <div className="roadmap-steps">
                {primaryCareer.roadmap.map((step, index) => {
                  const resourceUrl = step.resourceUrl || getBeginnerResource(step.name) || "";
                  return (
                    <div key={index} className="roadmap-step">
                      <div className="step-indicator">
                        <div className="step-dot"></div>
                        {index < primaryCareer.roadmap.length - 1 && <div className="step-line"></div>}
                      </div>
                      <div className="step-details">
                        <h4>{step.name}</h4>
                        <p>{step.why}</p>
                        <div className="step-info">
                          <span className="time">⏱️ {step.time}</span>
                          {step.resource && (
                            <span className="resource">📚 {step.resource}</span>
                          )}
                        </div>
                        <div className="step-task">
                          <strong>Task:</strong> {step.task}
                        </div>
                        <div className="step-beginner-resource">
                          <SafeExternalLink
                            href={resourceUrl}
                            label="Learn more"
                            className="beginner-link"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 5. Skills to Learn */}
        <SkillsSection skills={skills} tools={tools} title="Skills to Learn" />

        {/* Finished Card */}
        <div className="finished-card active" id="finishedCard">
          <div className="finished-icon">🎉</div>
          <div className="finished-title">
            Your path is clear.
          </div>
          <p className="step-why">
            One step at a time is the only way to reach the finish line. 
            Start with Step 1 today.
          </p>
          <button
            className="complete-btn"
            style={{ marginTop: "24px", width: "auto", padding: "14px 32px" }}
            onClick={onRestart}
          >
            Start Over →
          </button>
        </div>
      </div>
    </section>
  );
}

export default RoadmapPage;
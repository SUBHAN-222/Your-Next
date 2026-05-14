import { useEffect, useState, useCallback } from "react";
import { useRecommendation } from "@hooks/useRecommendation";
import LoadingScreen from "@components/LoadingScreen";
import RecommendationCard from "@components/RecommendationCard";
import SkillsSection from "@components/SkillsSection";
import EarningSection from "@components/EarningSection";

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

function RoadmapPage({ answers, onRestart }) {
  const { recommendation, isReady } = useRecommendation(answers);
  const [showLoading, setShowLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

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

  const { primaryCareer, alternativeCareers, skills, tools, earningMethods, nextSteps } = recommendation;

  /**
   * Validate that a URL is a real, working HTTPS URL (or HTTP for local dev).
   * Returns null for any invalid/placeholder/plain-text URL.
   */
  const validateUrl = useCallback((url) => {
    if (!url || typeof url !== "string") return null;
    const trimmed = url.trim();
    // Reject empty strings, spaces, placeholders, and plain text
    if (
      !trimmed ||
      trimmed === " " ||
      trimmed === "#" ||
      trimmed.startsWith("http://") === false && trimmed.startsWith("https://") === false
    ) {
      return null;
    }
    try {
      const parsed = new URL(trimmed);
      // Only allow http/https protocols
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
      // Reject obviously invalid placeholders
      if (parsed.hostname === "example.com" || parsed.hostname === "placeholder.com") return null;
      return trimmed;
    } catch {
      return null;
    }
  }, []);

  const getBeginnerResource = (text) => {
    for (const [keyword, url] of Object.entries(beginnerResources)) {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        return url;
      }
    }
    return null;
  };

  /**
   * Safe external link component that validates URLs and provides fallback.
   * Disables itself and shows "Coming Soon" if the URL is invalid.
   */
  const SafeExternalLink = useCallback(({ href, label, className }) => {
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
  }, [validateUrl]);

  return (
    <section className="screen active roadmap-screen" id="s-res">
      {/* Fixed Navigation */}
      <nav className="res-nav">
        <button className="nav-logo" onClick={onRestart} aria-label="Go home">
          Your<b>Next</b>
        </button>
        <span className="nav-label">Your Recommendation</span>
      </nav>

      {/* Header */}
      <div className={`roadmap-top ${isVisible ? "visible" : ""}`}>
        <h2 className="roadmap-h">
          Your personalized path to <span id="resField">{primaryCareer.name}</span>.
        </h2>
        <p className="roadmap-sub">
          Based on your unique situation, goals, and preferences.
        </p>
      </div>

      <div className="roadmap-container recommendation-container">
        {/* First: AI & Machine Learning (Recommendation Card) */}
        <RecommendationCard recommendation={recommendation} />

        {/* Second: Your First 3 Steps */}
        {nextSteps && nextSteps.length > 0 && (
          <div className="next-steps-section">
            <h3 className="section-title">Your First 3 Steps</h3>
            <p className="section-subtitle">Start here right now — momentum is everything.</p>
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
                      label="Learn more"
                      className="resource-link"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Third: Your Complete Roadmap */}
        {primaryCareer.roadmap && primaryCareer.roadmap.length > 0 && (
          <div className="full-roadmap-section">
            <h3 className="section-title">Your Complete Roadmap</h3>
            <p className="roadmap-level">
              Level: <strong>{primaryCareer.experienceLevel}</strong>
            </p>
            <div className="roadmap-steps">
              {primaryCareer.roadmap.map((step, index) => {
                // Use resourceUrl from careerPaths.js first, fall back to keyword-based lookup
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
                          label="Start here"
                          className="beginner-link"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 3. SKILLS: What You'll Build ── */}
        <SkillsSection skills={skills} tools={tools} title="Skills to Learn" />

        {/* ── 4. EARNING: Where This Leads ── */}
        <EarningSection earningMethods={earningMethods} />

        {/* Alternative Careers */}
        {alternativeCareers && alternativeCareers.length > 0 && (
          <div className="alternative-careers">
            <h3 className="section-title">Other Great Fits</h3>
            <div className="alternative-grid">
              {alternativeCareers.map(career => (
                <div key={career.id} className="alternative-card">
                  <span className="alt-icon">{career.icon}</span>
                  <div className="alt-info">
                    <h4>{career.name}</h4>
                    <span className="alt-confidence">{career.confidence}% match</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Finished Card */}
        <div className="finished-card active" id="finishedCard">
          <div className="finished-icon">🎉</div>
          <div className="finished-title">
            You now have a clear path forward.
          </div>
          <p className="step-why">
            This personalized roadmap is based on your unique situation. 
            Every step is designed to build on the previous one. Start with 
            step 1 today — momentum is everything.
          </p>
          <button
            className="complete-btn"
            style={{ marginTop: "24px", width: "auto", padding: "14px 32px" }}
            onClick={onRestart}
          >
            Share Your Path →
          </button>
        </div>
      </div>
    </section>
  );
}

export default RoadmapPage;
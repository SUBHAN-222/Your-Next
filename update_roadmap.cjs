const fs = require('fs');
const path = require('path');

// 1. Update aiRoadmap.js
const aiRoadmapPath = path.join(__dirname, 'src/services/aiRoadmap.js');
let aiRoadmap = fs.readFileSync(aiRoadmapPath, 'utf8');
aiRoadmap = aiRoadmap.replace('Rules: EXACTLY 3 steps. No more, no less.', 'Rules: EXACTLY 5 steps. No more, no less.');
aiRoadmap = aiRoadmap.replace('slice(0, 3)', 'slice(0, 5)');
fs.writeFileSync(aiRoadmapPath, aiRoadmap);

// 2. Update roadmaps.js
const roadmapsPath = path.join(__dirname, 'src/data/roadmaps.js');
let roadmaps = fs.readFileSync(roadmapsPath, 'utf8');
roadmaps = roadmaps.replace(/\.slice\(0, 3\)/g, ''); // remove all slice(0, 3)
fs.writeFileSync(roadmapsPath, roadmaps);

// 3. Update RoadmapPage.jsx
const roadmapPagePath = path.join(__dirname, 'src/pages/RoadmapPage.jsx');
let roadmapPage = fs.readFileSync(roadmapPagePath, 'utf8');

// Remove slice logic at the top
roadmapPage = roadmapPage.replace(/if \(activePlan\?\.steps\) \{\s*activePlan\.steps = activePlan\.steps\.slice\(0, 3\)\s*\}/, '');

// Create Accordion component
const accordionCode = `
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className={\`roadmap-accordion \${isOpen ? 'open' : ''}\`}>
      <button type="button" className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
      </button>
      <div className="accordion-content-wrapper" style={{ height: isOpen ? 'auto' : 0, overflow: 'hidden' }}>
        <div className="accordion-content">{children}</div>
      </div>
    </div>
  )
}
`;

// Insert Accordion after imports
roadmapPage = roadmapPage.replace("import posthog from '@lib/posthog'\n", "import posthog from '@lib/posthog'\n" + accordionCode);

// Replace roadmap-top
const newRoadmapTop = `
      <div className="roadmap-top">
        <h2 className="roadmap-h">
          <span id="resField">{fieldLabel}</span> Journey
        </h2>
        <p className="roadmap-sub">Beginner Stage</p>
        <div className="roadmap-progress">
          <div className="progress-text-container">
            <span className="progress-text">{currentStepIndex} / {roadmapData.steps.length} completed</span>
            <span className="progress-percentage">{Math.round((currentStepIndex / roadmapData.steps.length) * 100)}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: \`\${(currentStepIndex / roadmapData.steps.length) * 100}%\` }}></div>
          </div>
        </div>
      </div>
`;
roadmapPage = roadmapPage.replace(/<div className="roadmap-top">[\s\S]*?<\/div>/, newRoadmapTop);

// Replace roadmap-container content
// It goes from <div className="roadmap-container"> to the end of it
const newContainerStart = `
      <div className="roadmap-container">
        {showMomentum && momentumMessage && (
          <div className="momentum-banner show">{momentumMessage}</div>
        )}

        <div className="focused-task-card">
          <div className="focused-header">
            <span className="focused-dot" />
            <span className="focused-label">Current Focus</span>
          </div>
          
          <h3 className="focused-title">{currentStep.name}</h3>
          <p className="focused-desc">{currentStep.why} {currentStep.whyMatters}</p>
          
          <div className="focused-meta">
            <span className="meta-time">{currentStep.time}</span>
            <span className="meta-task">Task: {currentStep.task}</span>
          </div>

          <div className="focused-actions">
            {currentStep.resourceUrl && (
              <a
                className="focused-resource-btn"
                href={currentStep.resourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                📚 {currentStep.resourceTitle || 'Start Learning'}
              </a>
            )}

            {completing ? (
              <div className="focused-loading">
                <span className="btn-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff', marginRight: '8px' }} /> 
                Saving progress...
              </div>
            ) : (
              <button
                type="button"
                className="focused-complete-btn"
                onClick={handleComplete}
              >
                I completed this step →
              </button>
            )}
          </div>
          
          {!completing && (
            <button type="button" className="focused-defer-btn" onClick={handleDefer}>
              Save my progress for later
            </button>
          )}
        </div>

        {(() => {
          const careerId = Object.keys(CAREER_PATHS).find(
            key => CAREER_PATHS[key].name === roadmapData?.field
          ) || 'web'
          const dontLearnList = roadmapData?.dontLearnYet?.length > 0 
            ? roadmapData.dontLearnYet 
            : getDontLearnYet(careerId, 'beginner')

          if (!dontLearnList || dontLearnList.length === 0) return null

          return (
            <div className="dont-learn-section">
              <h3 className="dont-learn-title">
                🚫 Don't do this yet
              </h3>
              <p className="dont-learn-sub">
                These are the #1 mistakes confused beginners make. Skip them for now.
              </p>
              <div className="dont-learn-list">
                {dontLearnList.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="dont-learn-item">
                    <span className="dont-learn-icon">✕</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}

        {roadmapData.steps.length > currentStepIndex + 1 && (
          <div className="coming-next-section">
            <h4 className="section-title">Coming Next</h4>
            <div className="coming-next-list">
              {roadmapData.steps.slice(currentStepIndex + 1, currentStepIndex + 4).map((step, idx) => (
                <div key={idx} className="coming-next-item">
                  <span className="coming-next-num">{currentStepIndex + 2 + idx}</span>
                  <span className="coming-next-name">{step.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="roadmap-accordions-group">
          {currentStepIndex > 0 && (
            <Accordion title="Completed Tasks">
              <div className="completed-tasks-list">
                {roadmapData.steps.slice(0, currentStepIndex).map((step, index) => (
                  <div key={index} className="completed-task-item">
                    <span className="completed-check">✓</span>
                    <span className="completed-name">{step.name}</span>
                  </div>
                ))}
              </div>
            </Accordion>
          )}

          <Accordion title="Full Roadmap">
            <div className="full-roadmap-list">
              {roadmapData.steps.map((step, index) => {
                const status = getStepStatus(index);
                return (
                  <div key={index} className={\`roadmap-step-item \${status}\`}>
                    <div className="step-icon">
                      {status === 'done' ? '✓' : status === 'current' ? '→' : '○'}
                    </div>
                    <div className="step-details">
                      <div className="step-item-name">{step.name}</div>
                      {status === 'current' && <div className="step-item-meta">Current task</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </Accordion>
        </div>
      </div>
`;

// we need to replace everything from <div className="roadmap-container"> to its corresponding </div>.
// We can use a regex, but it's tricky with nested divs. Let's find the indices.
const containerStartIndex = roadmapPage.indexOf('<div className="roadmap-container">');
const afterContainerEndIndex = roadmapPage.indexOf('{showToast && (', containerStartIndex);
const endingDivIndex = roadmapPage.lastIndexOf('</div>', afterContainerEndIndex);

roadmapPage = roadmapPage.substring(0, containerStartIndex) + newContainerStart.trim() + '\n\n      ' + roadmapPage.substring(endingDivIndex + 6);

fs.writeFileSync(roadmapPagePath, roadmapPage);

console.log('Successfully updated RoadmapPage.jsx, aiRoadmap.js, roadmaps.js');

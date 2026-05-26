const fs = require('fs');
const path = require('path');

// 1. Update RoadmapPage.jsx
const jsxPath = path.join(__dirname, 'src/pages/RoadmapPage.jsx');
let jsx = fs.readFileSync(jsxPath, 'utf8');

const ptCardStart = jsx.indexOf('<div className="premium-task-card">');
const ptCardEnd = jsx.indexOf('<div className="premium-next-card">');

const newPtCard = `
        <div className="premium-task-card">
          <div className="pt-header-row">
            <span className="pt-dot-label"><span className="pt-dot"></span> Current Task</span>
            <span className="pt-step-badge">Step {currentStepIndex + 1} of {roadmapData.steps.length}</span>
          </div>
          
          <div className="pt-main-content">
            <div className="pt-icon-container">
              <div className="pt-icon-large">
                <span>{roadmapData.icon || '🎯'}</span>
              </div>
            </div>
            
            <div className="pt-info-wrapper">
              <h3 className="pt-title">{currentStep.name}</h3>
              <p className="pt-desc">{currentStep.why}</p>
              
              <div className="pt-meta-tags">
                <span className="pt-meta-tag">⏱️ {currentStep.time}</span>
                <span className="pt-meta-tag">📖 Beginner</span>
              </div>
              
              <div className="pt-actions-row">
                {currentStep.resourceUrl && (
                  <a
                    className="pt-resource-btn"
                    href={currentStep.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {currentStep.resourceTitle || 'Start learning'}
                  </a>
                )}

                {completing ? (
                  <div className="pt-loading">Saving progress...</div>
                ) : (
                  <button type="button" className="pt-complete-btn" onClick={handleComplete}>
                    <span className="pt-check">✓</span> Complete this task
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        `;

jsx = jsx.substring(0, ptCardStart) + newPtCard + jsx.substring(ptCardEnd);
fs.writeFileSync(jsxPath, jsx);
console.log('JSX updated');

// 2. Update index.css
const cssPath = path.join(__dirname, 'src/styles/index.css');
let css = fs.readFileSync(cssPath, 'utf8');

const gridRegex = /\.premium-main-grid \{[\s\S]*?\}/;
const newGrid = `.premium-main-grid {
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 2.3fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}`;
css = css.replace(gridRegex, newGrid);

// Update max-widths across the board to match 1200px
css = css.replace(/max-width: 1000px;/g, 'max-width: 1200px;');
css = css.replace(/max-width: 900px;/g, 'max-width: 1200px;');

// Overwrite .premium-task-card and related styles
const ptRegexStart = css.indexOf('/* Current Task Card */');
const ptRegexEnd = css.indexOf('/* Coming Next Card */');

const newPtCSS = `/* Current Task Card */
.premium-task-card {
  background: #fff;
  border-radius: 32px;
  padding: 40px 48px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.03);
  border: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  flex-direction: column;
}
.pt-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  width: 100%;
}
.pt-dot-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}
.pt-dot {
  width: 8px;
  height: 8px;
  background: #2563eb;
  border-radius: 50%;
}
.pt-step-badge {
  background: #eff6ff;
  color: #2563eb;
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
}
.pt-main-content {
  display: flex;
  gap: 40px;
  align-items: stretch;
}
@media (max-width: 768px) {
  .pt-main-content { flex-direction: column; gap: 24px; }
  .premium-task-card { padding: 32px 24px; }
}
.pt-icon-container {
  display: flex;
  align-items: flex-start;
}
.pt-icon-large {
  width: 110px;
  height: 110px;
  background: #eff6ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  flex-shrink: 0;
  border: 4px solid #dbeafe;
}
.pt-info-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.pt-title {
  font-family: 'Sora', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
  line-height: 1.3;
}
.pt-desc {
  font-size: 15px;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 16px;
  max-width: 600px;
}
.pt-meta-tags {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
}
.pt-meta-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #334155;
  background: #f8fafc;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid #e2e8f0;
}
.pt-actions-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: auto;
}
@media (max-width: 480px) {
  .pt-actions-row { flex-direction: column-reverse; align-items: stretch; gap: 12px; }
}
.pt-resource-btn {
  background: transparent;
  color: #0f172a;
  border: 2px solid #e2e8f0;
  padding: 14px 24px;
  border-radius: 14px;
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all .2s;
}
.pt-resource-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}
.pt-complete-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 16px 28px;
  border-radius: 14px;
  font-family: 'Sora', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all .2s;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
}
.pt-complete-btn:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
}
.pt-check {
  background: rgba(255,255,255,0.2);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.pt-loading {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  padding: 16px 28px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 15px;
}

`;

css = css.substring(0, ptRegexStart) + newPtCSS + css.substring(ptRegexEnd);

// Overwrite Coming Next styling to make it compact
const pnRegexStart = css.indexOf('/* Coming Next Card */');
const pnRegexEnd = css.indexOf('/* Warning Section wrapper */');

const newPnCSS = `/* Coming Next Card */
.premium-next-card {
  background: #fff;
  border-radius: 28px;
  padding: 24px 20px;
  border: 1px solid rgba(226, 232, 240, 0.6);
  display: flex;
  flex-direction: column;
}
.pn-header {
  font-family: 'Sora', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.pn-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}
.pn-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}
.pn-item:last-child {
  border-bottom: none;
}
.pn-num {
  width: 28px;
  height: 28px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}
.pn-info {
  flex: 1;
  min-width: 0;
}
.pn-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pn-sub {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pn-time {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}
.pn-view-all {
  background: transparent;
  border: none;
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
  margin-top: 20px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.pn-view-all:hover { color: #1d4ed8; text-decoration: underline; }

`;

css = css.substring(0, pnRegexStart) + newPnCSS + css.substring(pnRegexEnd);

fs.writeFileSync(cssPath, css);
console.log('CSS updated');

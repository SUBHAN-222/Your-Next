const fs = require('fs');
const path = require('path');

const jsxPath = path.join(__dirname, 'src/pages/RoadmapPage.jsx');
let jsx = fs.readFileSync(jsxPath, 'utf8');

const accordionNewCode = `
const Accordion = ({ title, subtitle, icon, badgeText, theme = 'default', children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className={\`premium-accordion theme-\${theme} \${isOpen ? 'open' : ''}\`}>
      <button type="button" className="p-accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="p-accordion-left">
          {icon && <span className="p-accordion-icon-box">{icon}</span>}
          <div className="p-accordion-texts">
            <span className="p-accordion-title">{title}</span>
            {subtitle && <span className="p-accordion-subtitle">{subtitle}</span>}
          </div>
        </div>
        <div className="p-accordion-right">
          {badgeText && <span className="p-accordion-badge">{badgeText}</span>}
          <span className="p-accordion-chevron">
             <svg width="14" height="8" viewBox="0 0 14 8" fill="none" style={{transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s'}}>
               <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </span>
        </div>
      </button>
      <div className="p-accordion-content-wrapper" style={{ height: isOpen ? 'auto' : 0, overflow: 'hidden' }}>
        <div className="p-accordion-content">{children}</div>
      </div>
    </div>
  )
}
`;

// Replace old accordion with new accordion
const accStart = jsx.indexOf('const Accordion');
const accEnd = jsx.indexOf('function RoadmapPage');
jsx = jsx.substring(0, accStart) + accordionNewCode.trim() + '\n\n' + jsx.substring(accEnd);

// Replace everything from <div className="roadmap-top"> to the end of the return statement
const topStart = jsx.indexOf('<div className="roadmap-top">');
const toastStart = jsx.indexOf('{showToast && (');

const newUI = `
      <div className="premium-hero-card">
        <div className="ph-left">
          <div className="ph-icon-box">{roadmapData.icon || '🚀'}</div>
          <div className="ph-text">
            <h2 className="ph-title">{fieldLabel}</h2>
            <p className="ph-subtitle">Beginner Stage • Keep going, you're doing great!</p>
          </div>
        </div>
        <div className="ph-right">
          <div className="ph-stats">
            <div className="ph-count"><strong>{currentStepIndex}</strong> / {roadmapData.steps.length} completed</div>
            <div className="ph-pct">{Math.round((currentStepIndex / roadmapData.steps.length) * 100)}%</div>
          </div>
          <div className="ph-progress-bg">
            <div className="ph-progress-fill" style={{ width: \`\${(currentStepIndex / roadmapData.steps.length) * 100}%\` }}></div>
          </div>
        </div>
      </div>

      <div className="premium-main-grid">
        <div className="premium-task-card">
          <div className="pt-header">
            <span className="pt-dot-label"><span className="pt-dot"></span> Current Task</span>
            <span className="pt-step-badge">Step {currentStepIndex + 1} of {roadmapData.steps.length}</span>
          </div>
          <div className="pt-body">
            <div className="pt-icon-large">
              <span>{roadmapData.icon || '🎯'}</span>
            </div>
            <div className="pt-info">
              <h3 className="pt-title">{currentStep.name}</h3>
              <p className="pt-desc">{currentStep.why}</p>
              <div className="pt-meta-tags">
                <span className="pt-meta-tag">⏱️ {currentStep.time}</span>
                <span className="pt-meta-tag">📖 Beginner</span>
              </div>
            </div>
          </div>
          <div className="pt-actions">
            {completing ? (
              <div className="pt-loading">Saving progress...</div>
            ) : (
              <button type="button" className="pt-complete-btn" onClick={handleComplete}>
                <span className="pt-check">✓</span> Complete this task
              </button>
            )}
            {!completing && (
              <button type="button" className="pt-defer-link" onClick={handleDefer}>
                Save progress for later
              </button>
            )}
          </div>
        </div>

        <div className="premium-next-card">
          <div className="pn-header">
            <span className="pn-icon">🚀</span> Coming Next
          </div>
          <div className="pn-list">
            {roadmapData.steps.slice(currentStepIndex + 1, currentStepIndex + 4).map((step, idx) => (
              <div key={idx} className="pn-item">
                <div className="pn-num">{currentStepIndex + 2 + idx}</div>
                <div className="pn-info">
                  <h4 className="pn-title">{step.name}</h4>
                  <p className="pn-sub">{step.why ? step.why.substring(0, 40) + '...' : 'Continue your journey'}</p>
                </div>
                <div className="pn-time">{step.time.replace('⏱️ ', '')}</div>
              </div>
            ))}
          </div>
          {roadmapData.steps.length > currentStepIndex + 4 && (
            <button className="pn-view-all" onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
              View full roadmap <span className="pn-arrow">›</span>
            </button>
          )}
        </div>
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
          <div className="premium-warning-wrapper">
            <Accordion 
              theme="warning"
              icon="⚠️"
              title="Don't do this yet"
              subtitle="Avoid these common beginner mistakes."
              badgeText={\`View \${dontLearnList.length} tips\`}
            >
              <div className="p-dont-learn-list">
                {dontLearnList.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="p-dont-learn-item">
                    <span className="p-dont-learn-icon">✕</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Accordion>
          </div>
        )
      })()}

      <div className="premium-accordions-group">
        {currentStepIndex > 0 && (
          <Accordion 
            theme="success"
            icon="✅"
            title="Completed Steps"
            badgeText={\`\${currentStepIndex} completed\`}
          >
            <div className="p-completed-list">
              {roadmapData.steps.slice(0, currentStepIndex).map((step, index) => (
                <div key={index} className="p-completed-item">
                  <span className="p-completed-check">✓</span>
                  <span className="p-completed-name">{step.name}</span>
                </div>
              ))}
            </div>
          </Accordion>
        )}

        <Accordion 
          theme="default"
          icon="📁"
          title="Full Roadmap"
          badgeText={\`\${roadmapData.steps.length} steps total\`}
        >
          <div className="p-full-roadmap-list">
            {roadmapData.steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div key={index} className={\`p-roadmap-step-item \${status}\`}>
                  <div className="p-step-icon">
                    {status === 'done' ? '✓' : status === 'current' ? '→' : '○'}
                  </div>
                  <div className="p-step-details">
                    <div className="p-step-item-name">{step.name}</div>
                    {status === 'current' && <div className="p-step-item-meta">Current task</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </Accordion>
      </div>

`;

jsx = jsx.substring(0, topStart) + newUI + '      ' + jsx.substring(toastStart);
fs.writeFileSync(jsxPath, jsx);
console.log('JSX updated successfully');

// CSS UPDATE
const cssPath = path.join(__dirname, 'src/styles/index.css');
let css = fs.readFileSync(cssPath, 'utf8');

const cssStart = css.indexOf('/* Progress Bar */');
const cssEnd = css.indexOf('/* Finished state */');

const newCSS = `
/* Premium Roadmap Styles */
.roadmap-screen {
  background: linear-gradient(180deg, #f0f4f8 0%, #f8fafc 100%);
  padding: 80px 24px 80px;
  align-items: center;
}

/* Premium Top Hero */
.premium-hero-card {
  width: 100%;
  max-width: 900px;
  background: #ffffff;
  border-radius: 28px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.03);
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 32px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 24px;
}
@media (max-width: 768px) {
  .premium-hero-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
  }
  .ph-right { width: 100%; }
}
.ph-left {
  display: flex;
  align-items: center;
  gap: 20px;
}
.ph-icon-box {
  width: 56px;
  height: 56px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
.ph-title {
  font-family: 'Sora', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
}
.ph-subtitle {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}
.ph-right {
  min-width: 280px;
}
.ph-stats {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 12px;
}
.ph-count {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}
.ph-count strong {
  color: #0f172a;
  font-weight: 700;
}
.ph-pct {
  font-family: 'Sora', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}
.ph-progress-bg {
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}
.ph-progress-fill {
  height: 100%;
  background: #2563eb;
  border-radius: 10px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Premium Main Grid */
.premium-main-grid {
  width: 100%;
  max-width: 900px;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  margin-bottom: 24px;
}
@media (max-width: 800px) {
  .premium-main-grid {
    grid-template-columns: 1fr;
  }
}

/* Current Task Card */
.premium-task-card {
  background: #fff;
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.03);
  border: 1px solid rgba(226, 232, 240, 0.8);
}
.pt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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
.pt-body {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  align-items: center;
}
@media (max-width: 480px) {
  .pt-body { flex-direction: column; align-items: flex-start; text-align: left; }
}
.pt-icon-large {
  width: 100px;
  height: 100px;
  background: #eff6ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  flex-shrink: 0;
  border: 4px solid #dbeafe;
}
.pt-info {
  flex: 1;
}
.pt-title {
  font-family: 'Sora', sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
}
.pt-desc {
  font-size: 15px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 16px;
}
.pt-meta-tags {
  display: flex;
  gap: 12px;
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
  font-weight: 500;
  border: 1px solid #e2e8f0;
}
.pt-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}
@media (max-width: 480px) {
  .pt-actions { flex-direction: column; gap: 12px; align-items: stretch; }
}
.pt-complete-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 16px 24px;
  border-radius: 16px;
  font-family: 'Sora', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
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
.pt-defer-link {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
}
.pt-defer-link:hover { color: #0f172a; }
.pt-loading {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  padding: 16px 24px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 15px;
}

/* Coming Next Card */
.premium-next-card {
  background: #fff;
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.03);
  border: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  flex-direction: column;
}
.pn-header {
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}
.pn-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}
.pn-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.pn-num {
  width: 32px;
  height: 32px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}
.pn-info {
  flex: 1;
  min-width: 0;
}
.pn-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pn-sub {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pn-time {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}
.pn-view-all {
  background: transparent;
  border: none;
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
  margin-top: 24px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.pn-view-all:hover { color: #1d4ed8; text-decoration: underline; }

/* Warning Section wrapper */
.premium-warning-wrapper {
  width: 100%;
  max-width: 900px;
  margin-bottom: 24px;
}

/* Accordions Group */
.premium-accordions-group {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Premium Accordions */
.premium-accordion {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.03);
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
}
.premium-accordion.theme-warning {
  background: #fffbf5;
  border: 1px solid #fbd38d;
}
.premium-accordion.theme-success {
  border: 1px solid #bbf7d0;
}
.p-accordion-header {
  width: 100%;
  padding: 24px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  text-align: left;
}
.p-accordion-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.p-accordion-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.theme-default .p-accordion-icon-box { background: #eff6ff; color: #2563eb; }
.theme-warning .p-accordion-icon-box { background: #ffedd5; color: #ea580c; }
.theme-success .p-accordion-icon-box { background: #dcfce7; color: #16a34a; }

.p-accordion-texts {
  display: flex;
  flex-direction: column;
}
.p-accordion-title {
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}
.p-accordion-subtitle {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
}
.p-accordion-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.p-accordion-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 100px;
}
.theme-default .p-accordion-badge { background: #eff6ff; color: #2563eb; }
.theme-warning .p-accordion-badge { background: #fff7ed; color: #ea580c; border: 1px solid #fed7aa; }
.theme-success .p-accordion-badge { background: #dcfce7; color: #16a34a; }

.p-accordion-chevron {
  color: #64748b;
  display: flex;
  align-items: center;
}

.p-accordion-content {
  padding: 0 24px 24px 80px;
}
@media (max-width: 600px) {
  .p-accordion-content { padding: 0 24px 24px 24px; }
}

.p-dont-learn-list { display: flex; flex-direction: column; gap: 12px; }
.p-dont-learn-item { display: flex; gap: 12px; font-size: 14px; color: #334155; }
.p-dont-learn-icon { color: #ea580c; }

.p-completed-list { display: flex; flex-direction: column; gap: 12px; }
.p-completed-item { display: flex; gap: 12px; font-size: 14px; color: #475569; }
.p-completed-check { color: #16a34a; font-weight: bold; }
.p-completed-name { text-decoration: line-through; opacity: 0.8; }

.p-full-roadmap-list { display: flex; flex-direction: column; gap: 12px; }
.p-roadmap-step-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
}
.p-roadmap-step-item.done { opacity: 0.7; }
.p-roadmap-step-item.current { background: #eff6ff; border: 1px solid #bfdbfe; }
.p-roadmap-step-item.locked { opacity: 0.5; }
.p-step-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #64748b;
}
.p-roadmap-step-item.done .p-step-icon { color: #16a34a; }
.p-roadmap-step-item.current .p-step-icon { color: #2563eb; }
.p-step-details { display: flex; flex-direction: column; }
.p-step-item-name { font-size: 14px; font-weight: 500; color: #0f172a; }
.p-step-item-meta { font-size: 11px; text-transform: uppercase; color: #2563eb; font-weight: 700; margin-top: 4px; }

`;

css = css.substring(0, cssStart) + newCSS + css.substring(cssEnd);
fs.writeFileSync(cssPath, css);
console.log('CSS updated successfully');

const fs = require('fs');
const path = require('path');

// 1. Update RoadmapPage.jsx
const jsxPath = path.join(__dirname, 'src/pages/RoadmapPage.jsx');
let jsx = fs.readFileSync(jsxPath, 'utf8');

const ptActionsStart = jsx.indexOf('<div className="pt-actions">');
const ptActionsEnd = jsx.indexOf('</div>', jsx.indexOf('</div>', jsx.indexOf('</div>', ptActionsStart) + 1) + 1); 

// The structure of pt-actions currently is:
/*
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
*/

// Let's replace it safely using a regex.
const newPtActions = `
          <div className="pt-actions">
            {currentStep.resourceUrl && (
              <a
                className="pt-resource-btn"
                href={currentStep.resourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                📚 {currentStep.resourceTitle || 'Start learning'}
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
`;

jsx = jsx.replace(/<div className="pt-actions">[\s\S]*?<\/button>\s*\}\s*<\/div>/, newPtActions.trim());
fs.writeFileSync(jsxPath, jsx);
console.log('JSX updated');


// 2. Update index.css
const cssPath = path.join(__dirname, 'src/styles/index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Update Grid
css = css.replace('grid-template-columns: 1fr 340px;', 'grid-template-columns: 2fr 1fr;');

// Increase max-width to allow better 2fr 1fr proportions
css = css.replace(/max-width: 900px;/g, 'max-width: 1000px;');

// Update Task Card padding
css = css.replace(/\.premium-task-card \{\s*background: #fff;\s*border-radius: 28px;\s*padding: 32px;/g, '.premium-task-card {\n  background: #fff;\n  border-radius: 28px;\n  padding: 48px;');

// Update title size
css = css.replace(/\.pt-title \{\s*font-family: 'Sora', sans-serif;\s*font-size: 22px;/g, '.pt-title {\n  font-family: \'Sora\', sans-serif;\n  font-size: 28px;');

// Replace pt-actions and pt-defer-link CSS with the new pt-resource-btn
// First, find .pt-actions
const cssPtActionsStart = css.indexOf('.pt-actions {');
const cssPtDeferEnd = css.indexOf('.pt-loading {', cssPtActionsStart); // Ends right before .pt-loading

const newCssForActions = `
.pt-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
@media (max-width: 480px) {
  .pt-actions { flex-direction: column; gap: 12px; align-items: stretch; }
}
.pt-resource-btn {
  background: #f8fafc;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  padding: 16px 24px;
  border-radius: 16px;
  font-family: 'Sora', sans-serif;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all .2s;
}
.pt-resource-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
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
`;

css = css.substring(0, cssPtActionsStart) + newCssForActions + css.substring(cssPtDeferEnd);
fs.writeFileSync(cssPath, css);
console.log('CSS updated');

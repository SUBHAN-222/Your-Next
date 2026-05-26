const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src/styles/index.css');
let css = fs.readFileSync(cssPath, 'utf8');

const startIndex = css.indexOf('.active-step-card {');
const endIndex = css.indexOf('/* Finished state */');

const newCSS = `
/* Progress Bar */
.roadmap-progress {
  margin-top: 24px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}
.progress-text-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  font-family: 'Sora', sans-serif;
}
.progress-bar-bg {
  height: 8px;
  background: #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: #2563eb;
  border-radius: 8px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focused Task Card */
.focused-task-card {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, .08);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.04);
  opacity: 0;
  transform: translateY(20px);
  animation: riseUp .6s ease forwards .2s;
  text-align: left;
}
.focused-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.focused-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2563eb;
  animation: focusPulse 2s ease-in-out infinite;
}
.focused-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #2563eb;
}
.focused-title {
  font-family: 'Sora', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 12px;
  line-height: 1.3;
}
.focused-desc {
  font-size: 15px;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 24px;
}
.focused-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
}
.meta-time {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  background: #fff;
  padding: 4px 10px;
  border-radius: 100px;
  border: 1px solid #e2e8f0;
}
.meta-task {
  font-size: 14px;
  color: #334155;
  font-weight: 500;
}
.focused-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}
.focused-resource-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
  padding: 16px;
  border-radius: 14px;
  font-family: 'Sora', sans-serif;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: all .2s;
}
.focused-resource-btn:hover {
  background: #dcfce7;
  transform: translateY(-2px);
}
.focused-complete-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 14px;
  font-family: 'Sora', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
}
.focused-complete-btn:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
}
.focused-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  padding: 16px;
  border-radius: 14px;
  font-weight: 600;
}
.focused-defer-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 13px;
  text-decoration: underline;
  cursor: pointer;
  width: 100%;
  padding: 8px;
  transition: color 0.2s;
}
.focused-defer-btn:hover {
  color: #64748b;
}

/* Momentum banner */
.momentum-banner {
  background: rgba(37,99,235,.06);
  border: 1px solid rgba(37,99,235,.12);
  border-radius: 12px;
  padding: 14px 18px;
  font-size: 14px;
  color: #1e3a5f;
  font-weight: 500;
  text-align: center;
  margin-bottom: 20px;
  display: none;
  animation: riseUp .5s ease forwards;
}
.momentum-banner.show { display: block; }

/* Dont Learn Section */
.dont-learn-section {
  background: #0f172a;
  border-left: 4px solid #ef4444;
  border-radius: 16px;
  padding: 24px;
  opacity: 0;
  transform: translateY(20px);
  animation: riseUp .6s ease forwards .3s;
}
.dont-learn-title {
  color: #fff;
  font-family: 'Sora', sans-serif;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 8px;
}
.dont-learn-sub {
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 20px;
}
.dont-learn-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.dont-learn-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  color: #fff;
  font-size: 14px;
  line-height: 1.5;
}
.dont-learn-icon {
  color: #ef4444;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Coming Next Section */
.coming-next-section {
  background: transparent;
  padding: 12px 0;
  opacity: 0;
  transform: translateY(20px);
  animation: riseUp .6s ease forwards .4s;
}
.section-title {
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.coming-next-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.coming-next-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  opacity: 0.8;
}
.coming-next-num {
  background: #f1f5f9;
  color: #64748b;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}
.coming-next-name {
  font-size: 14px;
  color: #334155;
  font-weight: 500;
}

/* Accordions */
.roadmap-accordions-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  opacity: 0;
  transform: translateY(20px);
  animation: riseUp .6s ease forwards .5s;
}
.roadmap-accordion {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
}
.accordion-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: transparent;
  border: none;
  font-family: 'Sora', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  cursor: pointer;
}
.accordion-icon {
  font-size: 18px;
  color: #64748b;
}
.accordion-content-wrapper {
  transition: height 0.3s ease;
}
.accordion-content {
  padding: 0 20px 20px 20px;
}

/* Completed & Full Roadmap Lists */
.completed-tasks-list, .full-roadmap-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.completed-task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
}
.completed-task-item:last-child {
  border-bottom: none;
}
.completed-check {
  color: #16a34a;
  font-weight: bold;
}
.completed-name {
  font-size: 14px;
  color: #334155;
  text-decoration: line-through;
  opacity: 0.7;
}

.roadmap-step-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
}
.roadmap-step-item.done {
  background: #fff;
  border: 1px solid #e2e8f0;
  opacity: 0.7;
}
.roadmap-step-item.current {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}
.roadmap-step-item.locked {
  background: transparent;
  opacity: 0.5;
}
.step-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #64748b;
  font-weight: bold;
}
.roadmap-step-item.done .step-icon {
  color: #16a34a;
}
.roadmap-step-item.current .step-icon {
  color: #2563eb;
}
.step-details {
  display: flex;
  flex-direction: column;
}
.step-item-name {
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
}
.step-item-meta {
  font-size: 11px;
  text-transform: uppercase;
  color: #2563eb;
  font-weight: 700;
  margin-top: 4px;
}

`;

css = css.substring(0, startIndex) + newCSS + css.substring(endIndex);
fs.writeFileSync(cssPath, css);
console.log('CSS updated successfully');

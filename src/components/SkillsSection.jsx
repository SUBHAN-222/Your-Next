/**
 * SkillsSection Component
 * Displays skills and tools to learn for the recommended path
 */
function SkillsSection({ skills, tools, title = "Skills to Learn" }) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="skills-section">
      <h3 className="skills-title">{title}</h3>
      
      <div className="skills-grid">
        <div className="skills-category">
          <h4 className="category-label">Technical Skills</h4>
          <div className="skills-tags">
            {skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {tools && tools.length > 0 && (
          <div className="skills-category">
            <h4 className="category-label">Tools & Platforms</h4>
            <div className="skills-tags">
              {tools.map((tool, index) => (
                <span key={index} className="skill-tag tool">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SkillsSection;
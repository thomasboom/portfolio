export default function Skills() {
  const skills = [
    { name: 'Flutter', desc: 'Mobile development' },
    { name: 'TypeScript', desc: 'Web development' },
    { name: 'Kotlin', desc: 'Android development' },
    { name: 'Supabase', desc: 'Backend & database' },
    { name: 'Dart', desc: 'Programming language' },
    { name: 'JavaScript', desc: 'Web development' },
  ];

  return (
    <section className="section" id="skills">
      <div className="section-header">
        <h2 className="section-title">02 — SKILLS</h2>
        <span className="section-line"></span>
      </div>
      <div className="skills-grid">
        {skills.map((skill) => (
          <div className="skill" key={skill.name}>
            <div className="skill-name">{skill.name}</div>
            <div className="skill-desc">{skill.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Work() {
  return (
    <section className="section" id="work">
      <div className="section-header">
        <h2 className="section-title">01 — SELECTED WORK</h2>
        <span className="section-line"></span>
      </div>

      <article className="work-item">
        <h3><a href="https://bijbelquiz.app" target="_blank" rel="noopener noreferrer">BijbelQuiz</a></h3>
        <p>Test your Bible knowledge with engaging quizzes.</p>
        <div className="tech"><span>Flutter</span><span>Dart</span><span>Supabase</span><span>Gemini API</span></div>
      </article>

      <article className="work-item">
        <h3><a href="https://breathspace-app.vercel.app" target="_blank" rel="noopener noreferrer">BreathSpace</a></h3>
        <p>Your space. Slow down anytime with breathing exercises</p>
        <div className="tech"><span>Flutter</span><span>Dart</span><span>Gemini API</span></div>
      </article>

      <article className="work-item">
        <h3><a href="https://github.com/thomasboom/LinuxDex" target="_blank" rel="noopener noreferrer">LinuxDex</a></h3>
        <p>Share your Linux distro history with friends to flex on &apos;em</p>
        <div className="tech"><span>Flutter</span><span>Dart</span><span>Supabase</span></div>
      </article>

      <article className="work-item">
        <h3><a href="https://github.com/ThomasNowProductions/Codenamr" target="_blank" rel="noopener noreferrer">Codenamr</a></h3>
        <p>A dead simple and lightning fast CLI for generating codenames</p>
        <div className="tech"><span>Rust</span><span>CLI</span></div>
      </article>
    </section>
  );
}

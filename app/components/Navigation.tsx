'use client';

export default function Navigation() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="nav">
      <a href="#work" onClick={(e) => { e.preventDefault(); scrollTo('work'); }}>
        <span className="nav-number">01</span> Work
      </a>
      <a href="#skills" onClick={(e) => { e.preventDefault(); scrollTo('skills'); }}>
        <span className="nav-number">02</span> Skills
      </a>
      <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>
        <span className="nav-number">03</span> About
      </a>
      <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>
        <span className="nav-number">04</span> Contact
      </a>
    </nav>
  );
}

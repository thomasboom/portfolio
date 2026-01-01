'use client';

import { useEffect } from 'react';
import Navigation from './components/Navigation';
import Work from './components/Work';
import Skills from './components/Skills';
import About from './components/About';
import Contact from './components/Contact';
import ProgressBar from './components/ProgressBar';

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <>
      <ProgressBar />
      <div className="container">
        <div className="left">
          <div>
            <h1 className="name">
              <span>Thomas</span>
              <span className="accent">Boom</span>
            </h1>
            <p className="meta">
              Developer
              <span>Based in The Netherlands</span>
              <span>Building mobile apps & web tools</span>
            </p>
          </div>
          <Navigation />
        </div>

        <div className="right">
          <Work />
          <Skills />
          <About />
          <Contact />

          <footer className="footer">
            <span>© 2026</span>
            <span>The Netherlands</span>
          </footer>
        </div>
      </div>
    </>
  );
}

'use client';

import Link from 'next/link';
import Links from '../components/Links';

export default function LinksPage() {
  return (
    <div className="links-container">
      <div className="links-header">
        <h1 className="name">
          <span>Thomas</span>
          <span className="accent">Boom</span>
        </h1>
        <p className="meta">
          Developer
          <span>Based in The Netherlands</span>
        </p>
      </div>
      <Links />
      <Link href="/" className="back-link">← Back to home</Link>
    </div>
  );
}

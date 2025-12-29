'use client';

import Link from 'next/link';

export default function BlogLink() {
  return (
    <Link href="/blog" className="blog-nav-link">
      <span className="material-symbols-rounded">article</span>
      Blog
    </Link>
  );
}

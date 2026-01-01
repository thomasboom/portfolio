import Link from 'next/link';
import { blogPosts } from '@/data/posts';

export default function BlogPage() {

  return (
    <div className="main-container">
      <div className="blog-page">
        <div className="blog-header">
          <Link href="/" className="back-link">
            <span className="material-symbols-rounded">arrow_back</span>
            Back to Chat
          </Link>
          <div className="header-title-group">
            <h1 className="blog-title">Blog</h1>
            <p className="blog-subtitle">Thoughts on development, design, and technology</p>
          </div>
        </div>

        <div className="posts-grid">
          {blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="post-card">
                <article>
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <div className="post-meta">
                    <time className="post-date">{post.date}</time>
                    <span className="post-read-time">{post.readTime}</span>
                  </div>
                  <div className="post-tags">
                    {post.tags.map((tag: string) => (
                      <span key={tag} className="post-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="no-posts">
              <span className="material-symbols-rounded">article</span>
              <p>No blogs yet</p>
              <span className="no-posts-subtitle">Check back soon for updates</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

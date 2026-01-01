'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  readTime: string;
}

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
}

export default function BlogEditor() {
  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes > 0 ? `${minutes} min read` : '1 min read';
  };

  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '',
    readTime: ''
  });
  const [generatedJson, setGeneratedJson] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const post: BlogPost = {
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      date: new Date().toISOString().split('T')[0],
      readTime: formData.readTime || '1 min read',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    const jsonString = JSON.stringify(post, null, 2);
    setGeneratedJson(jsonString);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedJson);
  };

  return (
    <div className="main-container">
      <div className="blog-post-page">
        <Link href="/blog" className="back-link">
          <span className="material-symbols-rounded">arrow_back</span>
          Back to Blog
        </Link>

        {!generatedJson ? (
          <form onSubmit={handleSubmit} className="editor-form">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                required
                placeholder="Enter post title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug">Slug</label>
              <input
                id="slug"
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="post-slug"
              />
            </div>

            <div className="form-group">
              <label htmlFor="excerpt">Excerpt *</label>
              <textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                required
                placeholder="Brief summary of the post"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Content (Markdown) *</label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value, readTime: calculateReadTime(e.target.value) })}
                required
                placeholder="Write your post content in Markdown..."
                rows={20}
                className="markdown-editor"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tags">Tags</label>
                <input
                  id="tags"
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="react, nextjs, typescript"
                />
              </div>

              <div className="form-group">
                <label htmlFor="readTime">Read Time (auto-calculated)</label>
                <input
                  id="readTime"
                  type="text"
                  value={formData.readTime}
                  readOnly
                  placeholder="Calculated automatically"
                  className="read-only-input"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                <span className="material-symbols-rounded">code</span>
                Generate JSON
              </button>
            </div>
          </form>
        ) : (
          <article className="post-content">
            <header className="post-header">
              <h1 className="post-title">Generated Post JSON</h1>
            </header>

            <div className="post-body">
              <pre className="post-body pre">
                <code>{generatedJson}</code>
              </pre>

              <div className="post-meta" style={{ marginTop: '24px', justifyContent: 'flex-end' }}>
                <button onClick={copyToClipboard} className="blog-nav-link">
                  <span className="material-symbols-rounded">content_copy</span>
                  Copy
                </button>
                <button onClick={() => setGeneratedJson('')} className="blog-nav-link">
                  <span className="material-symbols-rounded">edit</span>
                  Edit
                </button>
              </div>

              <p>
                Copy the JSON above and add it to the <code>blogPosts</code> array in <code>src/data/posts.ts</code>
              </p>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

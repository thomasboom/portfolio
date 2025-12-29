import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarkdownContent from '@/components/MarkdownContent';
import { getPostBySlug } from '@/data/posts';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="main-container">
      <div className="blog-post-page">
        <Link href="/blog" className="back-link">
          <span className="material-symbols-rounded">arrow_back</span>
          Back to Blog
        </Link>

        <article className="post-content">
          <header className="post-header">
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
              <time className="post-date">{post.date}</time>
              <span className="post-read-time">{post.readTime}</span>
            </div>
            <div className="post-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="post-tag">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="post-body">
            <MarkdownContent content={post.content} />
          </div>
        </article>
      </div>
    </div>
  );
}

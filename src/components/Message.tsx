'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageProps {
  content: string;
  isUser?: boolean;
}

export default function Message({ content, isUser = false }: MessageProps) {
  return (
    <div className={`message ${isUser ? 'user' : ''}`}>
      <div className="message-avatar">
        {isUser ? (
          'You'
        ) : (
          <img 
            src="/thomas-avatar.jpg" 
            alt="Thomas Boom"
            className="avatar-image"
          />
        )}
      </div>
      <div className="message-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p>{children}</p>,
            a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
            code: ({ className, children, ...props }) => {
              const hasLanguage = className && /language-/.test(className || '');
              if (!hasLanguage && typeof children === 'string' && !children.includes('\n')) {
                return <code {...props}>{children}</code>;
              }
              return (
                <pre>
                  <code className={className} {...props}>{children}</code>
                </pre>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

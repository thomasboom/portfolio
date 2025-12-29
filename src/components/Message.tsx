'use client';

import React from 'react';

interface MessageProps {
  content: string;
  isUser?: boolean;
}

export default function Message({ content, isUser = false }: MessageProps) {
  const formatMessage = (text: string) => {
    if (!text) return '';

    let formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre><code class="${lang || ''}">${code.trim()}</code></pre>`;
    });

    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

    formatted = formatted.replace(/\n\n/g, '</p><p>');
    formatted = formatted.replace(/\n/g, '<br>');

    return `<p>${formatted}</p>`;
  };

  return (
    <div className={`message ${isUser ? 'user' : ''}`}>
      <div className="message-avatar">
        {isUser ? 'You' : 'TB'}
      </div>
      <div 
        className="message-content"
        dangerouslySetInnerHTML={{ __html: formatMessage(content) }}
      />
    </div>
  );
}

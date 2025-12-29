'use client';

import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="message">
      <div className="message-avatar">
        TB
      </div>
      <div className="message-content">
        <div className="typing-indicator">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
}

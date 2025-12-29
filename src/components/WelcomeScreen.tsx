'use client';

import React from 'react';

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

const suggestedPrompts = [
  { icon: 'person', text: 'Tell me about yourself' },
  { icon: 'work', text: 'What projects have you worked on?' },
  { icon: 'code', text: 'What are your technical skills?' },
  { icon: 'email', text: 'How can I contact you?' },
];

export default function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {
  return (
    <div className="welcome-screen">
      <h1 className="logo">Hi, I&apos;m Thomas. Let&apos;s chat!</h1>
      
      <div className="suggested-prompts">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt.text}
            onClick={() => onSelectPrompt(prompt.text)}
            className="prompt-card"
          >
            <span className="material-symbols-rounded">
              {prompt.icon}
            </span>
            <span>{prompt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

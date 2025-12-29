'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Message as MessageType } from '@/types';
import WelcomeScreen from '@/components/WelcomeScreen';

const Message = dynamic(() => import('@/components/Message'), { ssr: false });
const TypingIndicator = dynamic(() => import('@/components/TypingIndicator'), { ssr: false });

const THOMAS_BOOM_PROFILE = `
You are a portfolio AI assistant for Thomas Boom, a solo developer. Answer questions about Thomas, his skills, projects, and contact information.

Thomas Boom Profile:

* Solo developer focusing on web apps, mobile apps (Flutter), and self-hosted backend systems
* Proficient in: Dart (Flutter), JavaScript, HTML, CSS, Supabase
* Experienced with: Linux setups (Ubuntu, Omarchy), Git, REST APIs, offline-first design, self-hosting solutions
* Location: Based in the Netherlands.

Recent Projects:

1. **BijbelQuiz** - Dutch Bible quiz app for learning and testing Bible knowledge.
2. **OpenBreath** - Breathwork app designed for simplicity and user relaxation.
3. **LinuxDex** - Share and save your Linux distro history and flex on your friends.
4. **Various smaller projects** - Experimental web and mobile apps, prototypes, and personal projects

Technical Skills:

* **Frontend:** Flutter, HTML, CSS, JavaScript
* **Backend:** Supabase, REST APIs, local server setups on Ubuntu
* **Databases:** Supabase, PostgreSQL (for self-hosted setups)
* **Tools & DevOps:** Git, VS Code, Hyprland, minimal Linux environments
* **Other:** Offline-first app design, minimalist UI/UX, self-hosted solutions

Contact Information:

* GitHub: github.com/thomasboom
* Email: thomasnowprod@proton.me

Work Style:

* Clean, functional, minimalistic coding style
* Focus on user experience, stability, and offline capabilities
* Strong curiosity-driven development and experimentation
* Transparent problem-solving and iterative improvement approach

`;

export default function Home() {
  const [conversationHistory, setConversationHistory] = useState<MessageType[]>([
    { role: 'system', content: THOMAS_BOOM_PROFILE }
  ]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setInputValue(prompt);
    setTimeout(() => sendMessage(prompt), 100);
  };

  const sendMessage = async (message?: string) => {
    const textToSend = message || inputValue.trim();
    if (!textToSend) return;

    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || localStorage.getItem('openrouter_api_key') || '';
    if (!apiKey) {
      alert('Please set NEXT_PUBLIC_OPENROUTER_API_KEY in your .env.local file');
      return;
    }

    setShowChat(true);
    setInputValue('');
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const userMessage: MessageType = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const requestBody = {
        model: 'z-ai/glm-4.5-air:free',
        messages: conversationHistory,
        max_tokens: 2000,
        temperature: 0.7
      };

      console.log('Sending request to OpenRouter...');
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'Thomas Boom Portfolio'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const assistantMessage: MessageType = {
        role: 'assistant',
        content: data.choices[0].message.content
      };

      setIsTyping(false);
      setMessages(prev => [...prev, assistantMessage]);
      setConversationHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setIsTyping(false);
      const errorMessage: MessageType = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const startNewChat = () => {
    setConversationHistory([{ role: 'system', content: THOMAS_BOOM_PROFILE }]);
    setMessages([]);
    setShowChat(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="main-container">
      {!showChat ? (
        <WelcomeScreen onSelectPrompt={handlePromptSelect} />
      ) : (
        <div 
          ref={chatContainerRef}
          className="chat-container"
        >
          {messages.map((msg, index) => (
            <Message key={index} content={msg.content} isUser={msg.role === 'user'} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      )}

      <div className="input-wrapper">
        <div className="input-container">
          <textarea
            ref={textareaRef}
            id="chat-input"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              autoResizeTextarea();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Message Thomas..."
            rows={1}
          />
          <button
            id="send-button"
            onClick={() => sendMessage()}
            disabled={!inputValue.trim()}
          >
            <span className="material-symbols-rounded">
              arrow_upward
            </span>
          </button>
        </div>

        <div className="footer-text">
          AI can make mistakes. This app is <a href="https://github.com/thomasboom/portfolio" target="_blank" rel="noopener noreferrer">open source</a> and uses <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer">OpenRouter AI</a> for AI responses.
        </div>
      </div>
    </div>
  );
}

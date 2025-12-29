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
- Solo developer specializing in web applications, mobile apps, and backend systems
- Proficient in: JavaScript, Python, TypeScript, React, Node.js, PostgreSQL, AWS
- Experienced with: Docker, Git, CI/CD, RESTful APIs, GraphQL
- Location: Available for remote work globally
- Years of experience: 5+ years in software development

Recent Projects:
1. TaskMaster Pro - A comprehensive task management application with real-time collaboration
2. CodeReview AI - Automated code review tool using machine learning
3. FitTrack Mobile - Cross-platform fitness tracking app with data visualization
4. CloudDeploy - Simplified deployment platform for small teams

Technical Skills:
- Frontend: React, Vue.js, Next.js, HTML, CSS, Tailwind
- Backend: Node.js, Python (Django, Flask), Go
- Databases: PostgreSQL, MongoDB, Redis
- Cloud & DevOps: AWS, GCP, Docker, Kubernetes, Terraform
- Tools: Git, Jenkins, GitHub Actions, VS Code
- Other: REST APIs, GraphQL, WebSockets, Testing (Jest, Pytest)

Contact Information:
- Email: thomas.boom@example.com
- GitHub: github.com/thomasboom
- LinkedIn: linkedin.com/in/thomasboom
- Website: thomasboom.dev

Work Style:
- Focus on clean, maintainable code
- Emphasis on user experience and performance
- Experience working with startups and enterprises
- Strong problem-solving and communication skills

Always be helpful, professional, and enthusiastic when discussing Thomas's work. If asked about something not covered here, be honest that you may not have that specific information.
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

    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
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
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'Thomas Boom Portfolio'
        },
        body: JSON.stringify({
          model: 'z-ai/glm-4.5-air:free',
          messages: conversationHistory,
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
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
        <div className="input-actions">
          {['attach_file', 'search', 'school', 'image', 'mic'].map((icon) => (
            <button
              key={icon}
              className="action-btn"
              title={icon}
            >
              <span className="material-symbols-rounded">
                {icon}
              </span>
            </button>
          ))}
        </div>

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
          By messaging Thomas Boom, you agree to his{' '}
          <a href="#">Terms</a>
          {' '}and have read his{' '}
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}

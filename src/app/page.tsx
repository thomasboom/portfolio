'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Message as MessageType } from '@/types';
import WelcomeScreen from '@/components/WelcomeScreen';
import BlogLink from '@/components/BlogLink';

const Message = dynamic(() => import('@/components/Message'), { ssr: false });
const TypingIndicator = dynamic(() => import('@/components/TypingIndicator'), { ssr: false });

const THOMAS_BOOM_PROFILE = `
You are Thomas Boom, a solo developer from the Netherlands. Answer questions as yourself - directly, casually, and personally. Don't act like an assistant talking about someone else. Just be Thomas.

IMPORTANT: Only answer questions based on the factual information provided below. If asked about something not covered here, say you don't know or can't provide that information. Do not make up or hallucinate details. Keep responses factual and grounded.

About Me:

* I focus on web apps, mobile apps (Flutter), and self-hosted backend systems
* Proficient in: Dart (Flutter), JavaScript, HTML, CSS, Supabase
* Experienced with: Linux setups (Ubuntu, Omarchy), Git, REST APIs, offline-first design, self-hosting solutions
* Based in the Netherlands

My Projects:

1. **BijbelQuiz** - Dutch Bible quiz app for learning and testing Bible knowledge
2. **OpenBreath** - Breathwork app designed for simplicity and user relaxation
3. **LinuxDex** - Share and save your Linux distro history and flex on your friends
4. **Various smaller projects** - Experimental web and mobile apps, prototypes, and personal projects

My Skills:

* **Frontend:** Flutter, HTML, CSS, JavaScript
* **Backend:** Supabase, REST APIs, local server setups on Ubuntu
* **Databases:** Supabase, PostgreSQL (for self-hosted setups)
* **Tools & DevOps:** Git, VS Code, Hyprland, minimal Linux environments
* **Other:** Offline-first app design, minimalist UI/UX, self-hosting solutions

Contact Me:

* GitHub: github.com/thomasboom
* Email: thomasnowprod@proton.me

My Work Style:

* Clean, functional, minimalistic coding style
* Focus on user experience, stability, and offline capabilities
* Strong curiosity-driven development and experimentation
* Transparent problem-solving and iterative improvement approach

Talk naturally and directly, like you're having a conversation. Use first-person language ("I", "my", "me"). Be friendly but efficient. Keep responses concise and factual.

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
    const updatedHistory = [...conversationHistory, userMessage];
    setConversationHistory(updatedHistory);
    setIsTyping(true);
    
    let accumulatedContent = '';
    let hasAddedAssistantMessage = false;

    try {
      const requestBody = {
        model: 'xiaomi/mimo-v2-flash:free',
        messages: updatedHistory,
        max_tokens: 2000,
        temperature: 0.2,
        stream: true
      };

      console.log('Sending request to OpenRouter...', {
        model: requestBody.model,
        messageCount: conversationHistory.length,
        hasApiKey: !!apiKey
      });
      
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
        console.error('API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        let errorMessage = `API request failed: ${response.status}`;
        if (errorData.error?.message) {
          errorMessage += ` - ${errorData.error.message}`;
        } else if (errorData.message) {
          errorMessage += ` - ${errorData.message}`;
        }
        
        if (response.status === 401) {
          errorMessage += '. Invalid API key. Check your NEXT_PUBLIC_OPENROUTER_API_KEY.';
        } else if (response.status === 402) {
          errorMessage += '. Insufficient credits. Add credits to your OpenRouter account.';
        } else if (response.status === 404) {
          errorMessage += '. Model not found. Try a different model.';
        }
        
        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorMessage}. Please try again.` }]);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              
              if (content) {
                if (!hasAddedAssistantMessage) {
                  setMessages(prev => [...prev, { role: 'assistant', content }]);
                  hasAddedAssistantMessage = true;
                } else {
                  setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'assistant', content: accumulatedContent + content };
                    return newMessages;
                  });
                }
                accumulatedContent += content;
                setIsTyping(false);
              }
            } catch (e) {
            }
          }
        }
      }

      if (hasAddedAssistantMessage) {
        setConversationHistory(prev => [...prev, { role: 'assistant', content: accumulatedContent }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsTyping(false);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${errorMsg}. Please try again.` }]);
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
      <div className="nav-header">
        <BlogLink />
      </div>

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
          This <a href="https://github.com/thomasboom/portfolio" target="_blank" rel="noopener noreferrer">website</a> uses <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer">AI</a>. It might hallucinate things, so don&apos;t take it that serious.
        </div>
      </div>
    </div>
  );
}

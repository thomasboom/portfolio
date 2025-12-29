# AGENTS.md

This file provides guidelines for agentic coding assistants working in this repository.

## Build, Lint, and Test Commands

```bash
# Development
npm run dev              # Start Next.js development server (http://localhost:3000)

# Production
npm run build           # Build the application for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint on the codebase
```

**Note:** This project does not currently have a test suite configured. When adding tests, choose a framework that integrates well with Next.js and React (Jest, React Testing Library, Vitest, etc.) and update this document with test commands, including how to run a single test.

## Tech Stack

- **Framework:** Next.js 16.1.1 with App Router
- **Runtime:** React 19.2.3
- **Language:** TypeScript 5.x (strict mode enabled)
- **Styling:** Tailwind CSS v4 + custom CSS variables
- **Linting:** ESLint with Next.js presets
- **Compilation:** React Compiler plugin enabled

## Code Style Guidelines

### Imports and Path Aliases

- Use the `@/` path alias for imports from `src/` directory:
  ```tsx
  import WelcomeScreen from '@/components/WelcomeScreen';
  import { Message } from '@/types';
  ```

- Group imports in order: external libraries, internal modules, type imports (optional):
  ```tsx
  import React from 'react';
  import dynamic from 'next/dynamic';
  import { useState, useEffect } from 'react';
  import { Message } from '@/types';
  ```

- Use `import type` for type-only imports:
  ```tsx
  import type { Metadata } from "next";
  ```

### Components

- All client components must start with `'use client';` directive:
  ```tsx
  'use client';
  import React from 'react';
  ```

- Use default exports for components:
  ```tsx
  export default function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {
    // component logic
  }
  ```

- Define interfaces for component props above the component:
  ```tsx
  interface WelcomeScreenProps {
    onSelectPrompt: (prompt: string) => void;
  }
  ```

- Use optional props with default values:
  ```tsx
  interface MessageProps {
    content: string;
    isUser?: boolean;
  }

  export default function Message({ content, isUser = false }: MessageProps) {
  ```

- Use dynamic imports for client-side only components with `{ ssr: false }`:
  ```tsx
  const Message = dynamic(() => import('@/components/Message'), { ssr: false });
  ```

### TypeScript

- Always define types for function parameters and return values when not immediately obvious:
  ```tsx
  const formatMessage = (text: string): string => { ... };
  ```

- Use interface for object shapes, type for unions/primitives:
  ```tsx
  interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }

  type Role = 'user' | 'assistant' | 'system';
  ```

- Define interfaces in `src/types/index.ts` for shared types

### State and Hooks

- Use functional state updates when depending on previous state:
  ```tsx
  setMessages(prev => [...prev, userMessage]);
  ```

- Use useRef for DOM element references:
  ```tsx
  const chatContainerRef = useRef<HTMLDivElement>(null);
  ```

- Use useEffect for side effects and lifecycle management with proper dependencies:
  ```tsx
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);
  ```

### Error Handling

- Use try-catch blocks for async operations:
  ```tsx
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    // process data
  } catch (error) {
    console.error('Error:', error);
    // handle error gracefully
  }
  ```

- Always check for required environment variables before use:
  ```tsx
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || localStorage.getItem('openrouter_api_key') || '';
  if (!apiKey) {
    alert('Please set NEXT_PUBLIC_OPENROUTER_API_KEY in your .env.local file');
    return;
  }
  ```

### Styling

- Use Tailwind utility classes for styling:
  ```tsx
  <div className="main-container">
    <button className="prompt-card">
  ```

- Use CSS variables defined in globals.css for theme values:
  ```css
  --bg-primary: #212121;
  --text-primary: #ececec;
  ```

- Dark theme is default (body has `dark` class). Light theme via `body.light` class.

- Responsive design: Use Tailwind breakpoints or CSS media queries in globals.css

### Naming Conventions

- Components: PascalCase (`WelcomeScreen`, `TypingIndicator`)
- Functions: camelCase (`sendMessage`, `handleKeyDown`)
- Constants: UPPER_SNAKE_CASE (`THOMAS_BOOM_PROFILE`)
- Interfaces: PascalCase with descriptive names (`WelcomeScreenProps`, `MessageProps`)
- CSS classes: kebab-case (`welcome-screen`, `prompt-card`, `input-wrapper`)

### Code Organization

- Keep component files focused on one responsibility
- Extract complex logic into separate functions or custom hooks
- Use constant arrays for static data (e.g., `suggestedPrompts`)
- Place shared types in `src/types/index.ts`
- Keep globals.css for global styles and theme variables
- Use descriptive variable names that clarify intent

### Performance

- React Compiler is enabled and will optimize components automatically
- Use dynamic imports for code splitting client-only components
- Avoid unnecessary re-renders by using memo only when needed (React Compiler handles most cases)

### Additional Notes

- Use Material Symbols Rounded for icons via Google Fonts
- API key handling: Check .env.local first, fallback to localStorage
- Console logging is acceptable for debugging in development
- Format messages with proper HTML escaping before rendering
- Auto-resize textareas for better UX
- Keyboard accessibility: Handle Enter key for submission, Shift+Enter for new line

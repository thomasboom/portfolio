# Thomas Boom Portfolio - Next.js

A portfolio website for Thomas Boom, built as a ChatGPT UI clone using Next.js, TypeScript, and Tailwind CSS.

## Features

- **Current ChatGPT UI Replica**: Matches the current (2025) ChatGPT web interface design
- **OpenRouter API Integration**: Uses OpenRouter for AI inference
- **Interactive Chat**: Ask questions about Thomas, his projects, skills, and contact info
- **Suggested Prompts**: Quick-start prompt cards for common questions
- **Dark Mode**: Dark mode styling by default
- **Responsive Design**: Works on desktop and mobile devices
- **Auto-resize Input**: Textarea grows as you type
- **Typing Indicator**: Shows animated dots while AI is "thinking"
- **Code Block Formatting**: Properly formats code blocks in responses
- **Auto-scroll**: Automatically scrolls to the latest message
- **Next.js App Router**: Uses the latest Next.js App Router architecture
- **TypeScript**: Fully typed for better developer experience
- **Tailwind CSS**: Utility-first CSS for rapid UI development

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set your OpenRouter API key:
   ```bash
   # Edit .env.local and add your API key:
   NEXT_PUBLIC_OPENROUTER_API_KEY=your-api-key-here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

**Note:** `.env.local` is excluded from git by `.gitignore` to keep your API key secure.

## Usage

- Click on any suggested prompt card to get started quickly
- Or type your own question in the input box
- Press Enter to send a message (Shift+Enter for new line)
- The AI will answer based on Thomas's portfolio information

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout with fonts and metadata
│   ├── page.tsx          # Main page with chat functionality
│   └── globals.css       # Global styles
├── components/
│   ├── Message.tsx       # Chat message component
│   ├── TypingIndicator.tsx  # Typing animation component
│   └── WelcomeScreen.tsx    # Welcome screen with suggested prompts
└── types/
    └── index.ts          # TypeScript type definitions
```

## Customization

To customize the portfolio content, edit the `THOMAS_BOOM_PROFILE` constant in `src/app/page.tsx` to update:
- Personal information
- Projects
- Skills
- Contact details
- Any other information you want the AI to know

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React 19** - Latest React with hooks
- **OpenRouter API** - AI inference

## Build for Production

```bash
npm run build
npm start
```

## Design Notes

- Minimal centered layout matching current ChatGPT interface
- Large input box with action icons above
- Suggested prompts on welcome screen
- Clean, modern aesthetic with smooth animations
- Dark mode by default
- Uses Google's Material Symbols Rounded for icons
- Fully responsive for mobile and desktop

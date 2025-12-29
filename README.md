# Thomas Boom Portfolio - ChatGPT Clone

A portfolio website for Thomas Boom, built as a ChatGPT UI clone using plain HTML, CSS, and JavaScript.

## Features

- **Current ChatGPT UI Replica**: Matches the current (2025) ChatGPT web interface design
- **OpenRouter API Integration**: Uses OpenRouter for AI inference
- **Interactive Chat**: Ask questions about Thomas, his projects, skills, and contact info
- **Suggested Prompts**: Quick-start prompt cards for common questions
- **Dark/Light Mode**: Includes both dark and light mode styling
- **Responsive Design**: Works on desktop and mobile devices
- **Auto-resize Input**: Textarea grows as you type
- **Typing Indicator**: Shows animated dots while AI is "thinking"
- **Code Block Formatting**: Properly formats code blocks in responses
- **Auto-scroll**: Automatically scrolls to the latest message

## Setup

1. Open `index.html` in your web browser

2. Set your OpenRouter API key:
   - Copy `config.js.example` to `config.local.js`
   - Add your OpenRouter API key to `config.local.js`
   - Refresh the page

Alternatively, you can use localStorage (not recommended):
   - Open browser console (F12)
   - Run: `localStorage.setItem("openrouter_api_key", "your-key-here")`

## Usage

- Click on any suggested prompt card to get started quickly
- Or type your own question in the input box
- Press Enter to send a message (Shift+Enter for new line)
- Press Escape to start a new chat
- The AI will answer based on Thomas's portfolio information

## File Structure

- `index.html`: Main HTML structure with centered layout
- `styles.css`: All styling matching current ChatGPT design
- `script.js`: JavaScript functionality and API integration

## Customization

To customize the portfolio content, edit the `THOMAS_BOOM_PROFILE` constant in `script.js` to update:
- Personal information
- Projects
- Skills
- Contact details
- Any other information you want the AI to know

## Design Notes

- Minimal centered layout matching current ChatGPT interface
- Large input box with action icons above
- Suggested prompts on welcome screen
- Clean, modern aesthetic with smooth animations
- Dark mode by default
- Uses Google's Material Symbols Rounded for icons
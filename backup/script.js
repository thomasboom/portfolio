let OPENROUTER_API_KEY = '';

try {
  OPENROUTER_API_KEY = API_KEY || localStorage.getItem('openrouter_api_key') || '';
} catch (e) {
  OPENROUTER_API_KEY = localStorage.getItem('openrouter_api_key') || '';
}

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

const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const welcomeScreen = document.getElementById('welcome-screen');

let conversationHistory = [
  {
    role: 'system',
    content: THOMAS_BOOM_PROFILE
  }
];

function autoResizeTextarea() {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, 200) + 'px';
}

function createMessageElement(content, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user' : ''}`;

  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'message-avatar';
  avatarDiv.textContent = isUser ? 'You' : 'TB';
  messageDiv.appendChild(avatarDiv);

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.innerHTML = formatMessage(content);
  messageDiv.appendChild(contentDiv);

  return messageDiv;
}

function formatMessage(text) {
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
}

function createTypingIndicator() {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message';
  messageDiv.id = 'typing-indicator';

  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'message-avatar';
  avatarDiv.textContent = 'TB';
  messageDiv.appendChild(avatarDiv);

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.innerHTML = `
    <div class="typing-indicator">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  `;
  messageDiv.appendChild(contentDiv);

  return messageDiv;
}

function showChatInterface() {
  welcomeScreen.style.display = 'none';
  chatContainer.style.display = 'flex';
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  if (!OPENROUTER_API_KEY) {
    alert('Please set your OpenRouter API key:\n\nOption 1: Create config.local.js and add your API key\nOption 2: localStorage.setItem("openrouter_api_key", "your-key-here")');
    return;
  }

  showChatInterface();

  chatInput.value = '';
  chatInput.style.height = 'auto';
  sendButton.disabled = true;

  const userMessageElement = createMessageElement(message, true);
  chatContainer.appendChild(userMessageElement);
  scrollToBottom();

  conversationHistory.push({
    role: 'user',
    content: message
  });

  const typingIndicator = createTypingIndicator();
  chatContainer.appendChild(typingIndicator);
  scrollToBottom();

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
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
    const assistantMessage = data.choices[0].message.content;

    chatContainer.removeChild(typingIndicator);

    const assistantMessageElement = createMessageElement(assistantMessage, false);
    chatContainer.appendChild(assistantMessageElement);
    scrollToBottom();

    conversationHistory.push({
      role: 'assistant',
      content: assistantMessage
    });

  } catch (error) {
    chatContainer.removeChild(typingIndicator);
    console.error('Error:', error);

    const errorMessageElement = createMessageElement('Sorry, there was an error processing your request. Please try again.', false);
    chatContainer.appendChild(errorMessageElement);
    scrollToBottom();
  }

  sendButton.disabled = false;
  chatInput.focus();
}

function startNewChat() {
  conversationHistory = [
    {
      role: 'system',
      content: THOMAS_BOOM_PROFILE
    }
  ];

  chatContainer.innerHTML = '';
  chatContainer.style.display = 'none';
  welcomeScreen.style.display = 'flex';
}

chatInput.addEventListener('input', () => {
  autoResizeTextarea();
  sendButton.disabled = chatInput.value.trim() === '';
});

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendButton.addEventListener('click', sendMessage);

document.querySelectorAll('.prompt-card').forEach(card => {
  card.addEventListener('click', () => {
    const prompt = card.dataset.prompt;
    chatInput.value = prompt;
    sendMessage();
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && chatContainer.style.display !== 'none') {
    if (confirm('Start a new chat?')) {
      startNewChat();
    }
  }
});

sendButton.disabled = true;
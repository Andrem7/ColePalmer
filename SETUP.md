# Cole Palmer Landing Page Setup

This project includes Firebase authentication, comments system, and AI chat functionality.

## Quick Start

1. **Copy configuration templates:**
   ```bash
   cp config.template.js config.js
   cp firebase-config.template.js firebase-config.js
   ```

2. **Add your API keys:**
   - Edit `config.js` and add your OpenAI API key
   - Edit `firebase-config.js` and add your Firebase project configuration

3. **Firebase Setup:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication (Google + Email/Password providers)
   - Enable Firestore Database
   - Copy the config keys to `firebase-config.js`

4. **OpenAI Setup:**
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Add it to `config.js`

## Features

- **Authentication**: Sign in with Google or email/password
- **Comments**: Fan comments with likes on the home page
- **AI Chat**: Chat with "Cole Palmer" using OpenAI GPT
- **Responsive Design**: Works on desktop and mobile

## File Structure

```
├── index.html          # Main landing page
├── chat.html           # AI chat page
├── auth.js             # Authentication logic
├── comments.js         # Comments system
├── openai-client.js    # OpenAI API integration
├── styles.css          # Main styles
├── chat-styles.css     # Chat-specific styles
├── config.js           # API keys (not in git)
├── firebase-config.js  # Firebase config (not in git)
└── SETUP.md           # This file
```

## Security Note

The `config.js` and `firebase-config.js` files contain sensitive API keys and are excluded from git. 
For production deployment, use environment variables or secure configuration management.

## Development

Open `index.html` in your browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

## Deployment

Deploy to any static hosting service:
- Vercel
- Netlify  
- Firebase Hosting
- GitHub Pages
- Cloudflare Pages

Make sure to configure environment variables for your API keys in production.
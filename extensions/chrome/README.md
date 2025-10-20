# DatResume Chrome Extension

A Chrome extension built with Vite, React, and TypeScript that connects to your Supabase backend for AI-powered resume assistance.

## 🚀 Quick Start

```bash
# From the project root, ensure workspace dependencies are installed
cd /home/rafcio/Personal/datresume
pnpm install

# Navigate to the Chrome extension directory
cd extensions/chrome2

# Run the setup script (builds and provides instructions)
./setup.sh
```

## 📋 Manual Setup

### 1. Install Dependencies

Dependencies are managed at the workspace level. From the project root:

```bash
pnpm install
```

### 2. Environment Configuration

## Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your Supabase credentials:
```env
# For local development
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your-local-supabase-anon-key

# For production, create .env.production:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

3. The extension will automatically use the appropriate environment variables during build

### 3. Start Supabase Backend

From the project root:

```bash
supabase start
```

### 4. Build the Extension

```bash
cd extensions/chrome2
pnpm build
```

### 5. Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist` folder: `/home/rafcio/Personal/datresume/extensions/chrome2/dist`

## 🛠️ Development

```bash
# Watch for changes during development
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint
```

## ✨ Features

### Authentication System
- **Supabase Auth Integration**: Secure login/signup
- **Session Management**: Persistent authentication using Chrome storage
- **Auto-login**: Remembers user sessions across browser restarts

### AI Chat Integration
- **Edge Function Support**: Connects to Supabase chat edge function
- **Real-time Responses**: Interactive AI assistant for resume help
- **Error Handling**: Graceful error handling and user feedback

### Chrome Extension Capabilities
- **Background Service Worker**: Handles API calls and authentication
- **Content Scripts**: Can interact with web pages
- **Popup Interface**: Clean, responsive React UI
- **Options Page**: Configure extension settings
- **Chrome Storage**: Persistent data storage

## 📁 Project Structure

```
src/
├── background/          # Service worker for API calls
│   └── index.ts
├── content/            # Content script for page interaction  
│   └── index.ts
├── popup/              # Extension popup UI (React)
│   ├── index.html
│   ├── index.tsx
│   ├── Popup.tsx
│   └── popup.css
├── options/            # Options/settings page
│   ├── index.html
│   ├── index.tsx
│   └── Options.tsx
├── utils/              # Shared utilities
│   └── supabase.ts     # Supabase client configuration
├── types/              # TypeScript type definitions
│   └── chrome.d.ts     # Chrome extension types
└── manifest.json       # Extension manifest configuration
```

## 🔧 Configuration

### Supabase Integration

The extension connects to your local Supabase instance by default. For production:

1. Update `.env` with your production Supabase URL and key
2. Rebuild the extension: `pnpm build`
3. Reload the extension in Chrome

### Available Edge Functions

- **Chat Function** (`/functions/chat`): AI-powered resume assistance
- **Contact Function** (`/functions/contact`): Handle contact form submissions  
- **API Key Management**: Save/load API keys securely

## 🧪 Testing the Extension

1. **Authentication Flow**:
   - Open the extension popup
   - Try signing up with a new email
   - Test login with existing credentials
   - Verify session persistence

2. **Chat Functionality**:
   - After logging in, use the chat input
   - Send a message like "Help me improve my resume"
   - Verify the response from the AI assistant

3. **Settings**:
   - Right-click the extension → "Options"
   - Configure Supabase settings if needed

## 🐛 Troubleshooting

### Extension Won't Load
- Check if all files exist in the `dist` directory
- Verify manifest.json is valid
- Check Chrome developer console for errors

### Authentication Issues
- Ensure Supabase is running on port 54321
- Check network requests in Chrome DevTools
- Verify Supabase URL and keys are correct

### Build Errors
- Run `pnpm install` from project root
- Check TypeScript errors: `pnpm build`
- Ensure all dependencies are properly installed

## 🔐 Security Notes

- The extension uses Chrome's secure storage APIs
- All API calls go through the background script
- Supabase handles authentication securely
- No sensitive data is stored in content scripts

## 📦 Production Deployment

1. Update environment variables for production Supabase
2. Build the extension: `pnpm build`
3. Package the `dist` folder for Chrome Web Store
4. Follow Chrome extension publishing guidelines
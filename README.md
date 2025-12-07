# 🚀 DatResume

**Perfect resume for your perfect job - AI-powered resume optimization**

DatResume is an AI-powered platform that helps you tailor your resume to any job offer in seconds. Simply paste your resume, share a job URL or description with our AI chat, and watch your resume transform to match the perfect opportunity.

## ✨ Key Features

- **🤖 AI-Powered Resume Optimization** - Intelligent resume tailoring using advanced AI
- **💬 Interactive Chat Interface** - Natural conversation with AI to refine your resume
- **🔄 Real-time Editing** - Rich text editor with live preview and diff tracking
- **🌐 Web Application** - Full-featured web app built with React and TanStack Router
- **🧩 Chrome Extension** - Seamless browser integration for job site optimization
- **🔐 Secure Authentication** - Powered by Supabase with session management
- **📱 Responsive Design** - Works on desktop and mobile devices
- **🆓 Free to Try** - No sign-up required to test the core functionality

## 🏗️ Architecture

DatResume is built as a modern monorepo with the following components:

```
datresume/
├── apps/
│   └── frontend/          # React web application
├── extensions/
│   └── chrome/            # Chrome browser extension
├── supabase/              # Backend services and database
│   ├── functions/         # Edge functions for AI chat
│   └── migrations/        # Database schema
└── package.json           # Workspace configuration
```

### Tech Stack

**Frontend Web App:**
- **Framework:** React 19 with TypeScript
- **Routing:** TanStack Router with file-based routing
- **Styling:** TailwindCSS with Radix UI components
- **Editor:** TipTap rich text editor
- **Forms:** React Hook Form with Zod validation
- **State Management:** Zustand
- **Build Tool:** Vite with Rolldown

**Chrome Extension:**
- **Framework:** React 19 with TypeScript
- **Build:** Vite with Web Extension plugin
- **Communication:** WebExt Bridge for cross-context messaging
- **Storage:** Chrome Storage APIs

**Backend:**
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Edge Functions:** Deno runtime for AI chat functionality
- **Real-time:** Supabase Realtime subscriptions

**Development Tools:**
- **Package Manager:** pnpm with workspace support
- **Code Quality:** Biome for linting and formatting
- **Git Hooks:** Husky for pre-commit checks
- **Environment:** Node.js with .nvmrc support

## 🚀 Quick Start

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- pnpm package manager
- Supabase CLI (for local development)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd datresume
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start Supabase locally:**
   ```bash
   supabase start
   ```

4. **Start the web application:**
   ```bash
   cd apps/frontend
   pnpm dev
   ```

5. **Access the application:**
   - Web App: `http://localhost:3000`
   - Supabase Studio: `http://localhost:54323`

### Chrome Extension Setup

1. **Build the extension:**
   ```bash
   cd extensions/chrome
   pnpm build
   ```

2. **Load in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## 📖 Usage

### Web Application

1. **Create Your Resume:**
   - Open the web app
   - Use the rich text editor to write or paste your existing resume
   - No account required for basic functionality

2. **Optimize with AI:**
   - Click to open the AI chat panel
   - Paste a job URL or job description
   - Send commands like:
     - "Optimize my resume for this job"
     - "Add relevant skills for this position"
     - "Improve the summary section"

3. **Review Changes:**
   - See real-time diff highlighting
   - Accept or reject AI suggestions
   - Export your optimized resume

### Chrome Extension

1. **Install and Login:**
   - Install the extension from the Chrome Web Store
   - Sign in with your Supabase account

2. **Job Site Integration:**
   - Navigate to any job posting
   - Click the DatResume extension icon
   - Use the integrated chat to optimize your resume for that specific job

## 🔧 Development

### Project Structure

**Web Application (`apps/frontend/`):**
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, forms, etc.)
│   ├── editor/         # TipTap editor components
│   └── layout/         # Layout components (header, footer)
├── routes/             # File-based routing
│   ├── _authed/        # Protected routes
│   ├── api/            # API routes
│   └── public/         # Public pages
├── stores/             # Zustand state stores
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
└── utils/              # Helper functions
```

**Chrome Extension (`extensions/chrome/`):**
```
src/
├── background/         # Service worker scripts
├── content/            # Content scripts for page interaction
├── popup/              # Extension popup UI
├── options/            # Settings/options page
└── utils/              # Shared utilities and Supabase client
```

### Available Scripts

**Root Level:**
```bash
pnpm install          # Install all workspace dependencies
pnpm test             # Run tests across all packages
```

**Web Application:**
```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm lint             # Run linting
```

**Chrome Extension:**
```bash
pnpm dev              # Watch mode for development
pnpm build            # Build extension
pnpm lint             # Run linting
./setup.sh            # Automated setup script
```

### Environment Variables

Create `.env` files in the appropriate directories:

**Frontend App (`.env`):**
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your-local-supabase-anon-key
```

**Chrome Extension (`.env`):**
```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your-local-supabase-anon-key
```

For production, create `.env.production` files with your production Supabase credentials.

## 🗄️ Database

DatResume uses Supabase for its backend services:

- **Authentication:** User registration, login, and session management
- **Database:** PostgreSQL with real-time subscriptions
- **Edge Functions:** AI chat functionality powered by Deno
- **Storage:** File uploads and resume storage

### Local Development

The Supabase configuration is in `supabase/config.toml`. Key services:

- **API Server:** `http://127.0.0.1:54321`
- **Database:** `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- **Studio:** `http://127.0.0.1:54323`
- **Inbucket (Email):** `http://127.0.0.1:54324`

## 🔒 Security

- **Authentication:** Secure user authentication via Supabase Auth
- **Session Management:** JWT tokens with secure storage
- **API Security:** Row Level Security (RLS) policies in Supabase
- **Chrome Extension:** Secure communication between contexts
- **Environment Variables:** Sensitive data in environment files (not committed)

## 🧪 Testing

```bash
# Run tests (when implemented)
pnpm test

# Type checking
pnpm build  # Will fail if TypeScript errors exist

# Linting
pnpm lint
```

## 📦 Deployment

### Web Application

The web app is built with TanStack Start and can be deployed to:

- **Vercel** (recommended)
- **Netlify**
- **Cloudflare Pages**
- **Any Node.js hosting**

### Chrome Extension

1. Build the extension: `pnpm build`
2. Package the `dist` folder
3. Submit to Chrome Web Store
4. Follow Chrome extension publishing guidelines

### Supabase

For production:

1. Create a Supabase project
2. Run migrations: `supabase db push`
3. Deploy edge functions: `supabase functions deploy`
4. Update environment variables with production URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run linting and tests: `pnpm lint`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style (enforced by Biome)
- Add tests for new functionality
- Update documentation as needed
- Use conventional commit messages

## 📝 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Issues:** Report bugs and request features via GitHub Issues
- **Documentation:** Check the individual README files in each package
- **Community:** Join our discussions for questions and support

## 🎯 Roadmap

- [ ] Advanced AI models integration
- [ ] Multiple resume templates
- [ ] Team collaboration features
- [ ] LinkedIn integration
- [ ] Mobile applications
- [ ] Resume analytics and insights
- [ ] ATS compatibility checker

---

**DatResume** - Making job applications smarter, one resume at a time. 🎯
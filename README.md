# ADHD Planner MVP

A production-ready MVP of an ADHD-friendly web app that helps users plan, focus, and track progress with minimal friction.

## 🎯 Features

- **Quick Add with NLP**: Add tasks quickly using natural language parsing
  - `"Pay bill tomorrow 4pm #finance !high"` → Parses dates, tags, and priorities
  - Available anywhere with keyboard shortcut `q`

- **Today View**: Three-column kanban board (Now / Next / Later)
  - Drag and drop tasks between columns
  - Visual priority indicators
  - One-click task completion with confetti celebration

- **Focus Timer**: Customizable Pomodoro timer
  - 25/5 minute defaults (customizable to 5, 15, 25 min)
  - Task association for sessions
  - Distraction tracking with one-click logging
  - Session notes

- **Routines**: Daily/weekly checklists
  - Pre-built routine templates
  - One-click spawn tasks to Today

- **Progress Tracking**: Lightweight analytics
  - Today & weekly stats (focused minutes, completed tasks)
  - Top distraction tracking
  - Focus streaks

- **Offline Support**: Full PWA with offline capability
  - Works offline for core flows
  - Auto-sync when back online
  - IndexedDB caching with Dexie

- **Accessibility**: ADHD-friendly UX
  - Large tap targets (min 44x44px)
  - Keyboard-first navigation (q, t, f, r, p shortcuts)
  - High contrast (WCAG AA compliant)
  - Reduced motion support
  - Clear focus states

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Radix UI
- **Backend**: Supabase (Postgres, Auth, RLS)
- **State**: Zustand
- **Offline**: Dexie (IndexedDB)
- **PWA**: next-pwa
- **Testing**: Vitest, Testing Library, Playwright
- **Code Quality**: ESLint, Prettier, Husky

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- A Supabase account (free tier works)

## 🚀 Setup Instructions

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd adhd-planner-mvp
npm install
\`\`\`

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration in `supabase/schema.sql`
3. Get your project URL and anon key from Settings > API

### 3. Configure Environment Variables

Create a `.env.local` file:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. (Optional) Seed Demo Data

\`\`\`bash
npm run seed
\`\`\`

## 📝 Database Setup

The app uses the following Supabase tables:

- `tasks` - User tasks with metadata
- `subtasks` - Task sub-items
- `focus_sessions` - Pomodoro session logs
- `routines` - User routines/habits
- `distractions` - Distraction logs

All tables have Row Level Security (RLS) enabled. Run the SQL in `supabase/schema.sql` to create tables, indexes, and policies.

## 🧪 Testing

\`\`\`bash
# Unit and component tests
npm test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
\`\`\`

## 🎨 Code Quality

\`\`\`bash
# Format code
npm run format

# Check formatting
npm run format:check
\`\`\`

Husky pre-commit hooks automatically run linting and formatting on staged files.

## 📱 PWA Installation

The app is installable as a Progressive Web App:

1. Visit the app in Chrome/Edge
2. Click the install icon in the address bar
3. Or use "Add to Home Screen" on mobile

## ⌨️ Keyboard Shortcuts

- `q` - Quick Add (open from anywhere)
- `t` - Navigate to Today
- `f` - Navigate to Focus Timer
- `r` - Navigate to Routines
- `p` - Navigate to Progress
- `Esc` - Close dialogs/modals

## 📁 Project Structure

\`\`\`
adhd-planner-mvp/
├── app/                  # Next.js app router pages
│   ├── auth/            # Authentication page
│   ├── today/           # Today view (kanban)
│   ├── focus/           # Focus timer
│   ├── routines/        # Routines manager
│   ├── progress/        # Progress stats
│   └── layout.tsx       # Root layout
├── components/
│   ├── ui/              # Reusable UI components
│   ├── features/        # Feature components
│   └── layout/          # Layout components
├── lib/
│   ├── supabase/        # Supabase client config
│   ├── offline/         # Offline support (Dexie)
│   ├── nlp/             # NLP parser for Quick Add
│   ├── store/           # Zustand stores
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Utility functions
├── supabase/
│   └── schema.sql       # Database schema and RLS
└── public/              # Static assets
\`\`\`

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

\`\`\`bash
# Or use Vercel CLI
npm i -g vercel
vercel
\`\`\`

### Other Platforms

The app works on any platform that supports Next.js 15:
- Netlify
- Railway
- AWS Amplify
- Self-hosted (Node.js)

## 🔐 Security

- All API routes protected by Supabase Auth
- Row Level Security (RLS) on all database tables
- Environment variables for sensitive data
- No third-party analytics (privacy-first)

## 🎯 Accessibility

- WCAG AA compliant color contrast
- Full keyboard navigation
- Screen reader friendly (ARIA labels)
- Large touch targets (44x44px minimum)
- Reduced motion support
- Focus indicators on all interactive elements

## 🔮 Future Improvements

- Calendar integration (iCal export)
- Priority scoring (Impact × Urgency × Interest)
- Streaks and gamification
- Custom themes (3+ color palettes)
- Collaborative tasks
- Mobile native apps (React Native)
- Voice input for Quick Add
- Smart task scheduling
- Weekly review flow
- Export data (CSV, JSON)

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ for the ADHD community**

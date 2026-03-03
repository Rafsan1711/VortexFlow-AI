# Architecture Overview — VortexFlow AI

This document describes the high-level architecture, folder structure, and key design decisions in VortexFlow AI.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| UI Framework | React 18 + TypeScript | Component-based UI |
| Build Tool | Vite | Fast dev server and production bundler |
| Styling | Tailwind CSS | Utility-first CSS |
| Animations | Framer Motion | Page transitions and micro-animations |
| State Management | Zustand | Lightweight global state |
| Routing | React Router v6 | Client-side navigation |
| Code Editor | Monaco Editor | VS Code engine in the browser |
| AI Backend | Google Gemini API | AI chat completions |
| Database | Firebase Firestore | Cloud-synced chat and editor data |
| Auth | Firebase Authentication | Google OAuth + Email/Password |
| GitHub | GitHub REST API | Repo import, commit, push |
| Deployment | Vercel | Hosting and CI/CD |

---

## Folder Structure

```
src/
├── components/
│   ├── chat/           # Chat UI — ChatWindow, MessageBubble, InputBar, SearchPanel, WelcomeScreen
│   ├── editor/         # Monaco Editor, FileExplorer, AIPanel, CommitModal, RepoPickerModal, etc.
│   ├── layout/         # ChatLayout (chat page shell), Sidebar (main navigation)
│   ├── modals/         # All modal dialogs — Settings, Profile, ModelPicker, ExportChat, ShareChat, etc.
│   ├── status/         # Status page — ServiceCard, LatencyChart, UptimeBar, IncidentCard
│   ├── terminal/       # Terminal, TerminalBootSequence, IframePlugin
│   └── ui/             # Primitive UI components — Button, Input, Modal, Toast, Tooltip, Dropdown
│
├── hooks/
│   ├── useAuth.ts        # Firebase authentication state
│   ├── useChat.ts        # Chat CRUD, Firestore sync, message streaming
│   ├── useEditor.ts      # Editor project/file operations, Firestore sync
│   ├── useGitHubAuth.ts  # GitHub OAuth token management
│   ├── useKeyboard.ts    # Global keyboard shortcut bindings
│   └── useStatus.ts      # Status page polling logic
│
├── lib/
│   ├── firebase.ts       # Firebase app + Firestore + Auth initialization
│   ├── gemini.ts         # Google Gemini API client and streaming helper
│   ├── github.ts         # GitHub REST API wrapper (repos, trees, commits)
│   ├── plugins.ts        # Plugin registry and plugin store data
│   └── utils.ts          # Shared utility functions
│
├── pages/
│   ├── AuthPage.tsx      # Login / register page
│   ├── ChatPage.tsx      # Main AI chat interface
│   ├── EditorPage.tsx    # Full code editor workspace
│   ├── LandingPage.tsx   # Public marketing landing page
│   ├── ChangelogPage.tsx # Changelog viewer
│   ├── SharePage.tsx     # Public shared chat viewer
│   ├── StatusPage.tsx    # System status dashboard
│   ├── DocsLayout.tsx    # Documentation layout with sidebar
│   └── docs/             # Individual documentation content pages
│
├── store/
│   ├── useAppStore.ts    # Global app state (sidebar, modals, theme)
│   └── useEditorStore.ts # Editor-specific state (panels, tabs, AI panel)
│
└── types/
    ├── index.ts          # Chat, Message, User, Plugin types
    └── editor.ts         # EditorFile, EditorProject, GitHubRepo types
```

---

## Data Flow

### AI Chat

```
User Input
  → InputBar component
  → useChat hook (appends user message to state + Firestore)
  → gemini.ts (streams response from Gemini API)
  → useChat hook (appends streamed AI message chunks)
  → MessageBubble renders with markdown + code highlighting
  → Firestore auto-synced
```

### Code Editor

```
User opens Editor page
  → useEditor hook fetches projects from Firestore
  → MonacoEditorPanel mounts Monaco with active file content
  → File changes debounced → auto-saved to Firestore
  → GitHub button → useGitHubAuth → OAuth token flow
  → RepoPickerModal → github.ts fetches repos + tree
  → CommitModal → github.ts pushes commit to GitHub
```

### Authentication

```
User visits app
  → useAuth hook listens to Firebase onAuthStateChanged
  → If not authenticated → redirect to /auth
  → AuthPage → Firebase signInWithPopup (Google) or signInWithEmailAndPassword
  → On success → redirect to /chat
```

---

## Key Design Decisions

**Zustand over Redux** — Zustand was chosen for its minimal boilerplate and direct hook-based API, which fits the component structure cleanly without requiring action creators or reducers.

**Monaco Editor** — Provides a production-grade code editing experience (same engine as VS Code) with built-in syntax highlighting, IntelliSense hooks, and multi-language support.

**Firestore real-time sync** — All chat and editor data is persisted to Firestore using `onSnapshot` listeners and direct `setDoc`/`updateDoc` calls, giving users real-time cloud backup without a custom backend.

**Gemini streaming** — AI responses use the Gemini streaming API to progressively render tokens as they arrive, giving a responsive feel without waiting for the full response.

**No custom backend** — VortexFlow AI is entirely serverless. All backend needs (auth, database, AI) are handled via client-side SDKs (Firebase SDK, Gemini SDK, GitHub REST API). This keeps deployment simple and cost-free.

---

## Environment Variables

All secrets are injected at build time via Vite's `import.meta.env` system. Variables must be prefixed with `VITE_` to be accessible in the browser bundle. See `.env.example` for the full list.

---

## Deployment

The app is deployed to **Vercel**. The `vercel.json` file configures:
- SPA fallback routing (all routes → `index.html`)
- Cache headers for static assets

Vercel automatically deploys on every push to the `main` branch.
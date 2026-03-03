# Changelog

All notable changes to **VortexFlow AI** will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) and [Conventional Commits](https://www.conventionalcommits.org/).

---

## [1.0.0] — 2026-03-03 🎉 Initial Release

This is the first official public release of VortexFlow AI.

### ✨ Features

**AI Chat**
- Multi-turn AI conversations powered by Google Gemini
- Markdown rendering with syntax-highlighted code blocks
- Chat history persisted to Firebase Firestore
- Full-text chat search across all conversations
- Export chat as Markdown or JSON
- Shareable public chat links via unique share URLs
- Chat rename and delete with confirmation modal
- Typing indicator during AI response generation
- Welcome screen with suggested prompts for new users
- Model picker — choose between available Gemini models

**Code Editor**
- Monaco Editor (VS Code engine) embedded in browser
- Multi-file project support with file explorer
- Cloud auto-save — projects saved to Firestore in real time
- GitHub OAuth integration — connect GitHub account
- Import any public or private GitHub repository
- Commit & push changes directly from the editor
- AI Panel — ask Gemini about your code inline
- Command Palette (`Ctrl+Shift+P`) with all editor actions
- Output panel with run code support
- Status bar showing language, cursor position, and save state
- Keyboard shortcuts: `Ctrl+S` save, `Ctrl+B` toggle explorer, `Ctrl+Enter` run

**Terminal**
- Integrated in-browser terminal with animated boot sequence
- Plugin system — launch external tools inside the terminal via iframe
- Plugin Store modal to browse and add plugins

**Authentication**
- Firebase Authentication — Google OAuth + Email/Password
- Secure session management
- Profile modal with user info

**Status Page**
- Live uptime monitoring for all services (AI, Database, Auth, GitHub, Editor)
- Latency chart — real-time response time visualization
- Incident history cards
- Overall system health banner

**UI / UX**
- Dark-mode-first design with `#0A0A0F` base
- Framer Motion page transitions and micro-animations
- Glassmorphism and gradient accents (`#00D4FF`, `#7B61FF`)
- Responsive layout — desktop and mobile support
- Sidebar navigation with collapsible sections
- Toast notifications for all actions
- Keyboard shortcuts modal (`?` key)
- Welcome tour modal for first-time users
- Full documentation at `/docs`

**Infrastructure**
- Deployed on Vercel with automatic CI/CD
- Firebase Firestore + Firebase Auth backend
- Firestore security rules in `firebase.rules.json`
- Vite build system with TypeScript
- Zustand for global state management
- React Router v6 for client-side routing

### 🛠️ Tech Stack

React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Zustand · Monaco Editor · Google Gemini API · Firebase Firestore · Firebase Auth · GitHub REST API · Vercel

---

## Unreleased

> Future changes will be listed here before the next release.

---

[1.0.0]: https://github.com/Rafsan1711/VortexFlow-AI/releases/tag/v1.0.0
# Contributing to VortexFlow AI

Thank you for your interest in contributing! 🎉
VortexFlow AI is an open-source project licensed under **GPL v3**, and contributions of all kinds are welcome.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting Pull Requests](#submitting-pull-requests)
- [Development Setup](#development-setup)
- [Branch Naming](#branch-naming)
- [Commit Message Convention](#commit-message-convention)
- [Code Style](#code-style)
- [File & Folder Conventions](#file--folder-conventions)
- [PR Review Process](#pr-review-process)

---

## Code of Conduct

By participating in this project, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

---

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/VortexFlow-AI.git
   cd VortexFlow-AI
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Set up** environment variables:
   ```bash
   cp .env.example .env
   # Fill in your own API keys
   ```
5. **Start** the dev server:
   ```bash
   npm run dev
   ```

---

## How to Contribute

### Reporting Bugs

- Search [existing issues](https://github.com/Rafsan1711/VortexFlow-AI/issues) first.
- If not found, open a new issue using the [Bug Report template](https://github.com/Rafsan1711/VortexFlow-AI/issues/new?template=bug_report.md).
- Include steps to reproduce, expected vs actual behavior, screenshots if applicable, and your environment details.

### Suggesting Features

- Open an issue using the [Feature Request template](https://github.com/Rafsan1711/VortexFlow-AI/issues/new?template=feature_request.md).
- Explain the motivation, proposed solution, and any alternatives you considered.

### Submitting Pull Requests

1. Create a new branch from `main` (see [Branch Naming](#branch-naming)).
2. Make your changes with clear, focused commits (see [Commit Convention](#commit-message-convention)).
3. Ensure the project builds without errors:
   ```bash
   npm run build
   ```
4. Open a Pull Request against `main` using the PR template.
5. Fill in all sections of the PR description completely.
6. Wait for review — your PR will be reviewed within a few days.

> **Note:** PRs that introduce new dependencies must justify the addition.

---

## Development Setup

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server (Vite) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |

---

## Branch Naming

Use the following prefixes for branch names:

| Prefix | When to use |
|--------|------------|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `docs/` | Documentation only |
| `refactor/` | Code refactoring, no functional change |
| `chore/` | Build process, dependencies, config |
| `style/` | UI/styling changes |

**Examples:**
```
feat/add-dark-mode-toggle
fix/chat-scroll-bug
docs/update-readme
```

---

## Commit Message Convention

We follow **Conventional Commits**:

```
<type>(<scope>): <short description>
```

**Types:**
- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation
- `style` — Formatting, whitespace (no logic change)
- `refactor` — Code restructure (no feature or fix)
- `perf` — Performance improvement
- `test` — Adding or updating tests
- `chore` — Dependency updates, config changes
- `revert` — Reverts a previous commit

**Examples:**
```
feat(chat): add message export to markdown
fix(editor): resolve monaco resize on panel toggle
docs(readme): update local setup instructions
chore(deps): bump framer-motion to 11.x
```

---

## Code Style

- **Language:** TypeScript — all new files must be `.ts` or `.tsx`.
- **Formatting:** Follow existing patterns in the codebase. We use consistent 2-space indentation.
- **Components:** Use functional components with hooks. No class components.
- **Imports:** Group imports — React first, then libraries, then local modules.
- **Props:** Always define typed interfaces for component props.
- **No hardcoded secrets.** All API keys must come from `.env` variables prefixed with `VITE_`.

---

## File & Folder Conventions

```
src/
├── components/     # Reusable UI components, grouped by feature
├── hooks/          # Custom React hooks (prefix: use*)
├── lib/            # Third-party client wrappers (firebase, gemini, github)
├── pages/          # Route-level page components
├── store/          # Zustand state stores (prefix: use*Store)
├── types/          # Shared TypeScript interfaces and types
└── styles/         # Global CSS
```

- Component filenames: `PascalCase.tsx`
- Hook filenames: `camelCase.ts`
- Store filenames: `camelCase.ts`

---

## PR Review Process

1. At least **1 approval** required from a maintainer.
2. All CI checks must pass.
3. No merge conflicts with `main`.
4. PR description must be complete.

Maintainers may request changes or ask for clarification before merging. Please be responsive to review comments.

---

Thank you for helping make VortexFlow AI better! 🚀
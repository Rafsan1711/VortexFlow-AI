# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅ Active  |

---

## Reporting a Vulnerability

**Please do NOT open a public GitHub Issue for security vulnerabilities.**

If you discover a security vulnerability in VortexFlow AI, please report it responsibly by:

1. Going to the [GitHub Security Advisories](https://github.com/Rafsan1711/VortexFlow-AI/security/advisories/new) page for this repo.
2. Submitting a private vulnerability report with:
   - A clear description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes (optional)

We will acknowledge your report within **72 hours** and aim to provide a fix within **14 days** for critical issues.

---

## Scope

The following are **in scope** for security reports:

- Authentication bypass or privilege escalation
- Firebase Firestore security rules misconfiguration
- Exposed API keys or secrets in the codebase
- Cross-site scripting (XSS) vulnerabilities
- Data leakage between users
- GitHub OAuth token handling issues

The following are **out of scope:**

- Vulnerabilities in third-party dependencies (report those upstream)
- Rate limiting / brute force on external APIs (Google, Firebase, GitHub)
- Social engineering attacks

---

## Security Best Practices for Contributors

- Never commit `.env` files or API keys to the repository.
- All environment variables must use the `VITE_` prefix and be declared in `.env.example` with placeholder values only.
- Firebase Firestore rules (`firebase.rules.json`) must be reviewed before any changes are merged.
- GitHub OAuth tokens are never stored server-side and are only used client-side via the GitHub API.

---

## Disclosure Policy

We follow a **coordinated disclosure** model. We will:

1. Confirm receipt of your report within 72 hours.
2. Investigate and validate the issue.
3. Develop and test a fix.
4. Release the fix and credit the reporter in the changelog (unless anonymity is requested).

Thank you for helping keep VortexFlow AI and its users safe. 🔐
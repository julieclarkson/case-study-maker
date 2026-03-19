# Case Study Maker

A Cursor plugin that tracks your build process, prompts reflection questions at the right moments, and generates portfolio and marketing case studies from your development journey.

**No API keys. No cloud. No cost.** Runs entirely on Cursor's built-in AI within your project folder.

[casestudymaker.dev](https://casestudymaker.dev) — Premium themes, PDF export, LinkedIn kit, and more.

---

## Install

Install from the [Cursor Marketplace](https://cursor.com/marketplace) by searching for **Case Study Maker**.

Or install directly from the repository:

1. Open Cursor Settings (`Cmd+Shift+J` on macOS, `Ctrl+Shift+J` on Windows/Linux)
2. Go to **Features** > **Plugins**
3. Add `https://github.com/julieclarkson/case-study-maker`

---

## Requirements

- **Cursor IDE** — [cursor.com](https://cursor.com)
- **Node.js 18+** (optional) — Used by post-commit hooks for smart reminders. Without it, all core features still work; you just won't get automated commit-based prompts.
  - **Check:** `node --version` (v18.x or higher)
  - **Install:** [nodejs.org](https://nodejs.org) or `brew install node` (macOS)

---

## Quick Start

### Option A: Via Cursor plugin (recommended)

1. Open any project in Cursor with the plugin enabled
2. Type `/case-study` in the chat to see all available commands
3. Run `/activate-case-study-maker` to start tracking

### Option B: Via csm-init (GitHub install)

If you cloned the repo and added it as a plugin:

```bash
cd /path/to/your-project
/path/to/case-study-maker/csm-init
```

Replace `/path/to/case-study-maker` with the actual path where you cloned the repo (e.g. `~/case-study-maker`).

**What csm-init does:**

1. Creates `.case-study/` directory with `events.json`, `media/`, and starter templates
2. Copies the always-on rule to `.cursor/rules/`
3. Copies all slash commands to `.cursor/commands/`
4. Installs a git post-commit hook for background capture (if in a git repo)
5. Adds `.case-study/` to `.gitignore`

Once activated, the plugin will notice significant development moments and suggest capturing reflections naturally in conversation.

---

## What It Does

### Tracks your build process

An always-on rule watches your development flow and recognizes when you're making decisions worth documenting — architecture tradeoffs, security considerations, constraint handling, risk mitigation, and iteration.

### Prompts reflection questions

Five core questions are surfaced at the right moments, never all at once:

| Question | Triggered by |
|----------|-------------|
| **Constraints** | Platform limits, budget, time pressure, tech stack decisions |
| **Tradeoffs** | "Chose X over Y", architecture decisions, library evaluations |
| **Risks** | Error handling, external APIs, data migration, infrastructure changes |
| **Security** | Auth, validation, encryption, CORS, user data handling |
| **Iteration** | Refactoring, rewrites, version changes, major restructuring |

### AI-assisted answers

Use `/auto-capture` to let the AI draft reflection answers from your conversation context. You review and approve before anything is saved.

### Generates case studies

Output formats, all as self-contained HTML/CSS/JS:

- **Portfolio** (`/generate`) — For recruiters and hiring managers evaluating engineering judgment
- **Marketing** (`/generate`) — For marketers, founders, and customers evaluating product value
- **Portfolio card** (`/generate`) — Embeddable card for your site
- **Custom categories** (`/generate`) — Any category you install: pitch-deck, linkedin, etc.

---

## Commands

Type `/case-study` in the Cursor chat to see the full menu:

| Command | What it does |
|---------|-------------|
| `/activate-case-study-maker` | Initialize tracking for the current project |
| `/capture-reflection` | Manually capture a reflection at any time |
| `/auto-capture` | AI drafts reflections from your conversation |
| `/review-timeline` | Check case study completeness and find gaps |
| `/generate` | Generate portfolio, marketing, card, or custom category |
| `/send-to-pages` | Copy OUTPUTS to your GitHub Pages folder |
| `/install-template` | Install premium/custom template packs and switch themes |
| `/integrate-figma` | Pull design assets from Figma (requires Figma plugin) |
| `/integrate-assets` | Import from Linear, Notion, or other plugins |

---

## How Data Is Stored

All data stays inside your project folder:

```
your-project/
├── .case-study/           # Added to .gitignore automatically
│   ├── events.json        # Append-only event log
│   ├── media/             # Screenshots and assets
│   ├── pending.json       # Uncaptured reflection flags (auto-generated)
│   ├── templates/         # Local copy of starter templates
│   └── scripts/           # Build scripts for generation
└── OUTPUTS/               # Generated case studies (commit to deploy)
    ├── portfolio-starter-default-*.html
    ├── marketing-starter-light-*.html
    └── ...
```

Nothing is written outside the project folder. No home directory access, no cloud uploads, no network calls.

---

## Sandbox and Permissions

Case Study Maker is designed to run entirely within the IDE sandbox. **No sandbox escape is needed for normal operation.**

| Operation | Sandbox? | Notes |
|-----------|----------|-------|
| Activation, capture, generation | Standard sandbox | All reads/writes stay in project folder |
| Post-commit hooks | Standard sandbox | Runs `node` locally, no network |
| `/send-to-pages` | May need approval | Writes to a directory outside the project (your GitHub Pages repo) |

**Your responsibility:** Cursor and Claude may request expanded permissions when an operation needs to write outside the project folder or access the network. Review each permission prompt carefully and approve only what you understand. You can configure scope settings in your IDE to control what the AI agent is allowed to do.

---

## Privacy and Security

- **Project-scoped**: Only active in projects where you explicitly run `/activate-case-study-maker`
- **No API keys**: Uses Cursor's built-in AI — no separate keys or accounts needed
- **No network calls**: All hook scripts run locally with no network access
- **No secrets stored**: The plugin stores no credentials, tokens, or keys
- **Auditable**: All plugin code is plain markdown and vanilla JavaScript — read every line
- **Content-Security-Policy**: Generated HTML includes CSP headers to prevent injection

---

## Plugin Components

| Component | Count | Description |
|-----------|-------|-------------|
| Rules | 1 | Always-on partner that notices development moments |
| Skills | 9 | Activate, capture, auto-capture, generate, integrate, review, template install |
| Agents | 1 | Readonly analyst for gap analysis |
| Commands | 11 | Hub plus direct slash commands for activation, capture, generation, integrations, and editing |
| Hooks | 2 | Session-end capture and post-commit question flagging |

---

## Companion Plugins

Case Study Maker is part of a three-plugin ecosystem:

| Plugin | What it does |
|--------|-------------|
| **Case Study Maker** | Captures build reflections, generates case studies (you are here) |
| [Demo Maker](https://github.com/julieclarkson/demo-maker) | Generates narrated video demos from your codebase |
| [Git Launcher](https://github.com/julieclarkson/git-launcher) | Generates README, launch posts, and social assets |

**Recommended order:** Case Study Maker → Demo Maker → Git Launcher. Each reads the previous plugin's output.

---

## Premium Add-ons

The plugin is free and fully functional. Premium add-ons at [casestudymaker.dev](https://casestudymaker.dev):

- **Theme Pack** — Dark, minimal, bold, agency themes
- **PDF & Notion Export** — PDF-ready and Notion-formatted output
- **LinkedIn Portfolio Kit** — LinkedIn-optimized formatting and post drafts
- **Pro Bundle** — Everything above at a discount

---

## Reporting Issues

Found a bug? [Open a GitHub issue](https://github.com/julieclarkson/case-study-maker/issues).

Please include: plugin version (CHANGELOG.md), Cursor version, Node version, steps to reproduce, and any error messages.

---

## License

MIT

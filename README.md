# Case Study Maker

A Cursor plugin that tracks your build process, prompts reflection questions at the right moments, and generates portfolio and marketing case studies from your development journey.

**No API keys. No cloud. No cost.** Runs entirely on Cursor's built-in AI within your project folder.

[casestudymaker.dev](https://casestudymaker.dev) — Premium themes, PDF export, LinkedIn kit, and more.

---

## Install

Install from the [Cursor Marketplace](https://cursor.com/marketplace) by searching for **Case Study Maker**.

Or install directly from the repository:

1. Open Cursor Settings (Cmd+Shift+J)
2. Go to **Features** > **Plugins**
3. Add `https://github.com/julieclarkson/case-study-maker`

---

## Quick start

1. Open any project in Cursor
2. Type `/case-study` in the chat to see all available commands
3. Use `/activate-case-study-maker` to start tracking

Once activated, a `.case-study/` directory is created in your project root. The plugin will notice significant development moments and suggest capturing reflections naturally in conversation.

---

## What it does

### Tracks your build process

An always-on rule watches your development flow and recognizes when you're making decisions worth documenting -- architecture tradeoffs, security considerations, constraint handling, risk mitigation, and iteration.

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

Two output formats, both as self-contained HTML/CSS/JS folders:

- **Portfolio** (`/generate-portfolio`) -- For recruiters and hiring managers evaluating engineering judgment
- **Marketing** (`/generate-marketing`) -- For marketers, founders, and customers evaluating product value

---

## Commands

Type `/case-study` in the Cursor chat to see the full menu. Available commands:

| Command | What it does |
|---------|-------------|
| `/activate-case-study-maker` | Initialize tracking for the current project |
| `/capture-reflection` | Manually capture a reflection at any time |
| `/auto-capture` | AI drafts reflections from your conversation |
| `/review-timeline` | Check case study completeness and find gaps |
| `/generate-portfolio` | Generate a portfolio case study |
| `/generate-marketing` | Generate a marketing case study |
| `/generate-portfolio-card` | Generate embeddable card for your portfolio (links to case study, marketplace, etc.) |
| `/send-to-pages` | Copy OUTPUTS to your GitHub Pages folder |
| `/edit-case-study` | Edit wording, flow, sections, or theme |
| `/install-template` | Install premium/custom template packs and switch themes |
| `/integrate-figma` | Pull design assets from Figma (requires Figma plugin) |
| `/integrate-assets` | Import from Linear, Notion, or other plugins |

---

## How data is stored

All data stays inside your project folder:

```
your-project/
├── .case-study/           # Added to .gitignore automatically
│   ├── events.json        # Append-only event log
│   ├── media/             # Screenshots and assets
│   └── pending.json       # Uncaptured reflection flags (auto-generated)
└── OUTPUTS/               # Generated case studies (commit to deploy)
    ├── portfolio_[project].html
    ├── marketing_[project].html
    ├── portfolio-card_[project].html
    ├── portfolio-card_[project].css   # Import to override your page styles
    └── assets/            # Screenshots
```

Nothing is written outside the project folder. No home directory access, no cloud uploads, no network calls.

---

## Privacy and security

- **Project-scoped**: Only active in projects where you explicitly run `/activate-case-study-maker`
- **No API keys**: Uses Cursor's built-in AI -- no separate keys or accounts needed
- **No network calls**: All hook scripts run locally with no network access
- **No secrets stored**: The plugin stores no credentials, tokens, or keys
- **Auditable**: All plugin code is plain markdown and vanilla JavaScript -- read every line
- **Content-Security-Policy**: Generated HTML includes CSP headers to prevent injection

---

## Plugin components

| Component | Count | Description |
|-----------|-------|-------------|
| Rules | 1 | Always-on partner that notices development moments |
| Skills | 9 | Activate, capture, auto-capture, generate, integrate, review, template install |
| Agents | 1 | Readonly analyst for gap analysis |
| Commands | 11 | Hub plus direct slash commands for activation, capture, generation, integrations, and editing |
| Hooks | 2 | Session-end capture and post-commit question flagging |

---

## Integrations

Works with other Cursor plugins when installed:

- **Figma** -- Pull design screenshots and component images
- **Linear** -- Import issue context and project milestones
- **Notion** -- Pull specs, meeting notes, and decision docs

If a plugin isn't installed, the skill offers manual alternatives.

---

## Premium add-ons

The plugin is free and fully functional. Premium add-ons for professional output are available at [casestudymaker.dev](https://casestudymaker.dev):

- **Theme Pack** — Premium HTML/CSS templates (dark, minimal, bold, agency)
- **PDF & Notion Export** — Generate PDF-ready and Notion-formatted case studies
- **LinkedIn Portfolio Kit** — LinkedIn-optimized formatting, headline copy, post drafts
- **Pro Bundle** — Everything above at a discount

---

## License

MIT

# Case Study Maker

**Capture your build decisions in real time. Generate portfolio and marketing case studies from your development journey.**

An always-on AI partner that watches your coding sessions and prompts reflection questions when you're making architecture tradeoffs, hardening security, or navigating constraints. When you ship, generate polished case study pages from the real decisions you captured — not from memory weeks later.

Everything runs locally in your project folder. No API keys. No cloud. No accounts.

Free Cursor & Claude plugin. [casestudymaker.dev](https://casestudymaker.dev) — Premium themes, PDF export, LinkedIn kit.

## Install

> **Important:** Clone this repo _inside_ the project you want to document.

### Cursor

```bash
cd ~/my-awesome-app
git clone https://github.com/julieclarkson/case-study-maker.git .case-study-maker
bash .case-study-maker/cursor/csm-init
```

`csm-init` creates the `.case-study/` directory, installs rules and commands into `.cursor/`, copies templates, and sets up a post-commit hook.

Then say **"activate case study maker"** in Cursor chat.

### Claude Desktop (Cowork)

```bash
cd ~/my-awesome-app
git clone https://github.com/julieclarkson/case-study-maker.git .case-study-maker
cp -r .case-study-maker/claude/skills .claude/skills
cp -r .case-study-maker/claude/commands .claude/commands
```

Then use `/activate-case-study-maker` in Claude.

### Bundle (all three plugins)

- **Cursor**: [launchpad-cursor](https://github.com/julieclarkson/launchpad-cursor)
- **Claude**: [launchpad-claude](https://github.com/julieclarkson/launchpad-claude)

## How It Works

1. **Activate** in your project — creates `.case-study/` with event log and templates
2. **Build normally** — the AI partner watches for decision moments (architecture, security, constraints)
3. **Answer reflections** — one question at a time, inline in chat, never interrupts debugging
4. **Generate** — pick a category, template, theme, and tone; get a self-contained HTML/CSS/JS page

The plugin captures five categories of engineering reasoning:

| Category | Triggered by |
|----------|-------------|
| **Constraints** | Platform limits, budget, time pressure, team size |
| **Tradeoffs** | "Chose X over Y", architecture decisions, library evaluations |
| **Risks** | Error handling, external APIs, data migration, infrastructure |
| **Security** | Auth, validation, encryption, CORS, user data handling |
| **Iteration** | Refactoring, rewrites, version changes, major restructuring |

## Commands

| Command | What it does |
|---------|-------------|
| `/csm` | Show all commands and current status (event count, active template/theme) |
| `/activate` | Initialize case study tracking in your project |
| `/capture` | Capture a reflection and append it to the timeline |
| `/auto-capture` | Draft reflections from your conversation and recent commits |
| `/review` | Review coverage and identify gaps in your timeline |
| `/generate` | Generate a case study (choose category, template, theme, tone) |
| `/generate-portfolio-card` | Generate an embeddable portfolio card |
| `/generate-custom` | Generate output for any installed category (pitch-deck, linkedin, etc.) |
| `/customize` | Change template, theme, tone, colors, fonts, or install a template pack |
| `/install-template` | Install premium or custom template packs |
| `/send-to-pages` | Copy outputs to your GitHub Pages repo |

## Structure

```
cursor/   — Cursor plugin (rules, skills, commands, templates, hooks)
claude/   — Claude plugin (skills, commands, templates)
```

See `cursor/README.md` or `claude/README.md` for full documentation.

## Requirements

- **Node.js 18+** (optional) — enables post-commit hooks that flag undocumented decisions. All core features work without it.

## Security

Case Study Maker runs entirely within the IDE sandbox. All data stays in your project folder under `.case-study/`.

**Built-in safeguards:**

- **Activation gate** — the AI rule only fires when `.case-study/` exists in your project; no ambient tracking
- **Scope boundary** — all reads and writes are confined to the project root; no access to home directory, other projects, or paths containing `..`
- **Zero dependencies** — no npm packages, no supply chain risk
- **Input validation** — user selections are whitelist-validated; output filenames must match `[a-zA-Z0-9_-]+`
- **XSS prevention** — `escapeHtml()` on all user content in generated templates
- **CSP headers** — all generated HTML includes `Content-Security-Policy` meta tags
- **Shell safety** — hook scripts use `execFileSync` with argv arrays (not `execSync`) to prevent command injection through crafted commit messages

**Your responsibility:**

- **Manage IDE scope and permissions.** Cursor and Claude may request expanded permissions for operations like `/send-to-pages` (writes outside the project folder). Review each prompt carefully. Configure your IDE's scope settings to control what the AI agent can do.
- **Don't commit secrets.** The plugin never stores API keys (it doesn't use any), but your reflections may reference sensitive decisions. Review `.case-study/events.json` before committing if your project involves proprietary information.

## Companion Plugins

Case Study Maker is the first step in a three-plugin workflow:

1. **Case Study Maker** (this plugin) — Capture build decisions and generate case studies
2. [Demo Maker](https://github.com/julieclarkson/demo-maker) — Generate narrated video demos from your codebase
3. [Git Launcher](https://github.com/julieclarkson/git-launcher) — Generate README, launch posts, and social assets

Each plugin feeds into the next. Demo Maker reads your case study timeline for narrative context. Git Launcher reads both for README content and embeds demo videos into launch posts.

**Install order:** Case Study Maker → Demo Maker → Git Launcher

## License

MIT

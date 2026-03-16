# Case Study Maker — Claude Desktop Cowork Plugin

Track your build process, capture reflection questions at the right moments, and generate portfolio and marketing case studies from your development journey. No API keys, no cloud — runs entirely within Claude Desktop Cowork.

## Use It Right Now

You don't need to wait for marketplace approval. Clone this repo and start using it immediately:

1. **Clone this repo:**

```bash
git clone https://github.com/julieclarkson/case-study-maker.git
```

2. **Open Claude Desktop Cowork** and select your project folder as the working directory
3. **Copy the plugin into your project:**

```bash
cp -r case-study-maker/ your-project/.claude/plugins/case-study-maker/
```

4. **Activate tracking:**

```
/case-study-maker:activate
```

5. **Start building.** The case-study-partner skill automatically watches your conversations and suggests capturing reflections when it notices architecture decisions, security work, tradeoffs, and more.

6. **When ready, generate:**

```
/case-study-maker:generate
```

That's it. You're capturing your build process as you work.

### Can I just type `csm-init`?

No. `csm-init` is a Cursor-specific bash initializer script — it doesn't apply to Cowork. In Cowork, the plugin system handles setup. Just run `/case-study-maker:activate` after installing the plugin, and it creates the `.case-study/` directory with all the right files.

---

## Installation Options

### Option 1: Clone from GitHub (fastest — use this to start now)

```bash
git clone https://github.com/julieclarkson/case-study-maker.git
cp -r case-study-maker/ your-project/.claude/plugins/case-study-maker/
```

Then open your project in Cowork and run `/case-study-maker:activate`.

### Option 2: From GitHub

In Claude Desktop Cowork, run:

```
/plugin marketplace add julieclarkson/case-study-maker
/plugin install case-study-maker@case-study-maker-marketplace
```

### Option 3: From the Anthropic Marketplace

If the plugin has been submitted and approved:

```
/plugin install case-study-maker@claude-plugins-official
```

---

## Commands

All commands are namespaced under `case-study-maker`. Type `/case-study-maker:csm` to see the full menu.

| Command | What it does |
|---|---|
| `/case-study-maker:csm` | Show all commands and current status |
| `/case-study-maker:activate` | Start tracking this project (creates `.case-study/`) |
| `/case-study-maker:capture` | Capture a reflection now |
| `/case-study-maker:auto-capture` | AI drafts reflections from your conversation |
| `/case-study-maker:review` | See what's been captured and what's missing |
| `/case-study-maker:generate` | Generate a portfolio case study, marketing page, or custom output |
| `/case-study-maker:generate-custom` | Generate output for any custom template category (pitch-deck, linkedin, etc.) |
| `/case-study-maker:generate-portfolio-card` | Generate an embeddable card for your portfolio site |
| `/case-study-maker:customize` | Change template, theme, tone, or edit content |
| `/case-study-maker:install-template` | Install a premium or custom template pack |
| `/case-study-maker:send-to-pages` | Copy outputs to your GitHub Pages folder |

---

## How It Works

### 1. Activate

Run `/case-study-maker:activate` in any project. This creates a `.case-study/` directory with an event log, media folder, and config. The directory is automatically added to `.gitignore`.

### 2. Build

Just build. The **case-study-partner** skill watches your conversations and recognizes significant development moments:

- **Constraints** — platform limits, budget, time pressure, team size
- **Tradeoffs** — "chose X over Y", architecture decisions, library evaluations
- **Risks** — error handling, external API integration, data migration
- **Security** — auth, validation, encryption, CORS, user data handling
- **Iteration** — refactoring, rewrites, version changes

When it notices a relevant moment, it briefly suggests capturing a reflection. Answer inline and it saves structured data to your timeline.

### 3. Capture

Reflections are captured to `.case-study/events.json` as structured events with timestamps, commit references, and categorized answers. Capture manually with `/case-study-maker:capture` or let the AI draft answers with `/case-study-maker:auto-capture`.

### 4. Review

Run `/case-study-maker:review` to see your coverage. It checks captured data against both a **portfolio rubric** (for recruiters) and a **marketing rubric** (for customers), and suggests what to capture next.

### 5. Generate

Run `/case-study-maker:generate` and you'll walk through a selection flow:

1. **Category** — portfolio, marketing, portfolio-card, or any custom category (pitch-deck, linkedin, etc.)
2. **Template** — choose from installed templates
3. **Theme** — choose a visual theme
4. **Tone** (marketing only) — technical, storytelling, or enterprise

If you've already generated output, it detects existing files and asks whether you want to **update** (refresh with latest data) or create a **new** output.

Output files use timestamp-based naming: `{project}-portfolio-20260309-143022.html`. Everything goes to `OUTPUTS/` as self-contained HTML/CSS/JS.

### 6. Deploy

Run `/case-study-maker:send-to-pages` to copy generated files to a GitHub Pages folder. Commit and push to go live.

---

## Automatic Behavior

### Post-Commit Hook

After any `git commit` or `git merge`, the plugin's hook script analyzes the diff for patterns suggesting relevant reflections:

- Files with `auth`, `login`, `token`, `encrypt` → suggests **security** reflection
- Files with `error`, `catch`, `retry`, `api` → suggests **risks** reflection
- Files with `refactor`, `rewrite`, `upgrade` → suggests **iteration** reflection
- More than 5 files changed → suggests **tradeoffs** reflection

Flagged suggestions are written to `.case-study/pending.json` and mentioned at the start of your next session.

### Auto-Triggering Partner

The case-study-partner skill has a broad description that causes Claude to automatically invoke it when your conversation touches development decisions. You don't need to call commands for the basic "notice and suggest" behavior — it happens naturally as you work.

### Periodic Gap Checks

For session-end gap detection (checking which commits are undocumented), set up a scheduled task in Cowork using the **Schedule** feature.

---

## Templates and Themes

### Built-in Templates

- **Portfolio (starter)** — 13-section case study with architecture diagrams, commit history, iteration timeline, and screenshot gallery
- **Marketing (starter)** — conversion-focused landing page with animated hero, feature grid, demo canvas, and CTA sections
- **Portfolio Card (starter)** — embeddable HTML card for portfolio websites
- **Pitch Deck** — presentation-style output for stakeholder or investor audiences

### Built-in Themes

- **Default** — light, airy design with purple-blue gradient accents

### Tones (for marketing)

- **Technical** — precise, evidence-driven, developer-focused
- **Storytelling** — narrative arc, human, conversational
- **Enterprise** — professional, ROI-focused, stakeholder language

### Premium Add-ons

Available at [casestudymaker.dev](https://casestudymaker.dev):

- Additional themes (dark, minimal, bold, agency)
- PDF and Notion export
- LinkedIn Portfolio Kit
- Pro Bundle

---

## Project Data

All data stays in your project folder under `.case-study/`:

```
.case-study/
├── events.json      # Append-only event log (reflections, screenshots, git metadata)
├── config.json      # User preferences (template, theme, tone)
├── pending.json     # Auto-generated flags for uncaptured moments
├── media/           # Screenshots and design assets
└── templates/       # Local overrides and premium templates
```

Generated output goes to `OUTPUTS/` with timestamp-based filenames.

Nothing is written outside the project root. No external API calls. No cloud storage. Fully auditable.

---

## Differences from the Cursor Version

This Cowork plugin is a port of the [Cursor IDE plugin](https://github.com/julieclarkson/case-study-maker). Key differences:

| Feature | Cursor | Cowork |
|---|---|---|
| Always-on rule | `.mdc` rule with `alwaysApply: true` | Auto-triggering skill (triggers on development conversation patterns) |
| Commands | `/csm`, `/capture`, etc. | `/case-study-maker:csm`, `/case-study-maker:capture`, etc. |
| Git hooks | `afterShellExecution` event | `PostToolUse` on Bash tool |
| Session-end detection | Built-in session hook | Manual or scheduled task |
| Init script | `csm-init` bash script | `/case-study-maker:activate` command |
| Distribution | Cursor Marketplace | Claude plugin marketplace or GitHub |
| Integration references | "Cursor plugins" (Figma, Linear) | "MCP connectors" (Figma, Linear) |

---

## Distribution

### Self-Hosted Marketplace

This plugin includes a `marketplace.json` for self-distribution. Push to GitHub and users add it with:

```
/plugin marketplace add your-username/case-study-maker-cowork
```

### Official Marketplace

Submit at [claude.ai/settings/plugins/submit](https://claude.ai/settings/plugins/submit) for inclusion in the official Anthropic marketplace.

### Team Distribution

Add to your project's `.claude/settings.json` for automatic team installation:

```json
{
  "extraKnownMarketplaces": {
    "case-study-maker-marketplace": {
      "source": {
        "source": "github",
        "repo": "julieclarkson/case-study-maker"
      }
    }
  }
}
```

---

## Submit to Marketplace

To submit this plugin to the official Claude plugin marketplace:

1. Push this folder to a GitHub repo
2. Go to [claude.ai/settings/plugins/submit](https://claude.ai/settings/plugins/submit) or [platform.claude.com/plugins/submit](https://platform.claude.com/plugins/submit)
3. Provide the repo URL and follow the submission flow

---

## License

MIT — see [LICENSE](LICENSE) for details.

Built by [Julie Clarkson](https://superflyweb.com) | [casestudymaker.dev](https://casestudymaker.dev)

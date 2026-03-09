---
name: generate-custom
description: Generate output for any installed template category (pitch-deck, linkedin, etc.). Use when the user says "generate [category]", "create [category] output", or requests a category that isn't portfolio, marketing, or portfolio-card.
---

# Generate Custom Category Output

Generate HTML output for any template category the developer has installed. Categories are discovered from `.case-study/templates/` — any subdirectory except `themes` is a valid category.

## Prerequisites

- `.case-study/events.json` must exist
- The category must have a template installed in `.case-study/templates/{category}/` or `templates/{category}/`

## Workflow

### Step 1: Discover categories

```bash
ls .case-study/templates/ 2>/dev/null
ls templates/ 2>/dev/null
```

**Built-in categories:** portfolio, marketing, portfolio-card (handled by their own skills)

**Custom categories:** Any other directory — e.g. pitch-deck, linkedin, technical-doc, one-pager

Exclude `themes` — that's for shared design tokens, not a category.

### Step 2: Resolve template and theme for the requested category

**Template/theme must be selected before this skill runs.** The `/generate` or `/generate-custom` command always runs the selection flow (discover options, present choices, wait for reply) and updates config before invoking this skill. If invoked directly, the agent must run that flow first — see `commands/generate-custom.md` or `commands/generate.md` Steps 2–3.

**Use config:** `config.{category}Template`, `config.{category}Theme` (e.g. `config.pitchDeckTemplate`, `config.pitchDeckTheme`).

**Template resolution order:**
1. `.case-study/templates/{category}/{template}/`
2. `templates/{category}/{template}/`

**Template name:** `config.{category}Template` or `config.pitchDeckTemplate` (for pitch-deck), etc. Default: `starter`.

### Step 3: Read template structure

The template must have:
- `template.html` — HTML with `{{PLACEHOLDER}}` variables
- `manifest.json` — with `placeholders` array (list of placeholder IDs)

Optional: `template.css`, `template.js` — copied/inlined into output.

### Step 4: Gather project data

1. Read `.case-study/events.json`
2. Project name: `basename $(pwd)` normalized (lowercase, hyphens removed)
3. Media: `ls .case-study/media/ 2>/dev/null`
4. Repo: `git remote get-url origin 2>/dev/null`
5. Recent commits: `git log --oneline -10`

### Step 5: Draft content and substitute

For each placeholder in the manifest:
- Draft content from events (reflections, commits, screenshots)
- Ground every claim in evidence — never fabricate
- Escape HTML: `&`, `<`, `>`, `"`, `'`

Substitute all `{{PLACEHOLDER}}` in template.html with drafted values. Write to `OUTPUTS/{outputBase}.html`.

**When called from `/generate`:** Use `config.outputBase`. Format: `{projectSlug}-{category}-{timestamp}`. Example: `gitlauncher-pitch-deck-20260307-182345.html`. Project slug = `basename $(pwd)` → lowercase, non-alphanumeric removed.

**Legacy / direct call:** Use `{category}_{project}.html`. Project = `basename $(pwd)` normalized.

If template.css exists: write `OUTPUTS/{outputBase}.css` (strip any `@import`). Link from HTML.
If template.js exists: inline into HTML or write separate `.js` and link.

### Step 6: Copy assets

```bash
mkdir -p OUTPUTS/assets
cp -r .case-study/media/* OUTPUTS/assets/ 2>/dev/null
```

Use `assets/filename.png` for image paths if the template references them.

### Step 7: Report

- Files written: `OUTPUTS/{outputBase}.html`, `.css`, `.js` (if any)
- Local path: `OUTPUTS/{outputBase}.html`
- **Ask:** "Want me to open this in your browser for a preview?" If yes, run `open OUTPUTS/{outputBase}.html` (macOS) or `xdg-open` (Linux) or `start` (Windows).
- "Run `/send-to-pages` to deploy."

## Output naming

- **From `/generate`:** `OUTPUTS/{outputBase}.html` where outputBase = `{category}-{template}-{theme}-{tone?}-{timestamp}`
- **Direct call:** `OUTPUTS/{category}_{project}.html`

Project slug: `basename $(pwd)` → lowercase, hyphens removed (e.g. `case-study-maker` → `casestudymaker`).

## Rules

- Ground all content in captured events. Never fabricate.
- Escape untrusted text before embedding in HTML.
- Include Content-Security-Policy meta tag in generated HTML.
- **Validate category, template, theme names:** Reject any containing `/`, `\\`, `..`, or leading dot. Use only alphanumeric, hyphen, underscore.
- **Validate outputBase:** When from config, must contain only `[a-zA-Z0-9_-]`. Reject if empty or if it would cause path traversal (contains `..`, `/`, `\`).
- **Validate URLs** (CTA_URL, etc.): Reject `javascript:`, `data:`, `vbscript:`. Allow `http://`, `https://`, `#`, relative paths.
- If the category doesn't exist, list available categories and suggest running `/install-template` to add one.

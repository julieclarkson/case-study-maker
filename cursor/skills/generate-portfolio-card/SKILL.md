---
name: generate-portfolio-card
description: Generate an embeddable portfolio card HTML fragment that links to the full case study. Use when the user says "generate card", "portfolio card", "embed card", or "card for my portfolio".
---

# Generate Portfolio Card

Create an embeddable HTML card that developers can paste into their portfolio website. The card inherits typography and colors from the parent page, links to the full case study (or marketplace, email form, etc.), and uses a template system for sellable designs.

## Prerequisites

- `.case-study/events.json` must exist
- Project name available (from folder or config)

## Workflow

### Step 1: Gather project data

1. Read `.case-study/events.json` and parse events.
2. Get project name from folder: `basename $(pwd)`
3. Get git remote: `git remote get-url origin 2>/dev/null || echo ""`
4. Check for existing portfolio output: `ls OUTPUTS/portfolio_*.html 2>/dev/null`

### Step 2: Resolve template

**Template/theme/style must be selected before this skill runs.** The `/generate` or `/generate-portfolio-card` command always runs the selection flow (discover options, present choices, wait for reply) and updates config before invoking this skill. If invoked directly, the agent must run that flow first — see `commands/generate-portfolio-card.md` or `commands/generate.md` Steps 2–5.

**Use config:** `config.portfolioCardTemplate`, `config.portfolioCardTheme`, `config.portfolioCardStyleMode`.

**Template resolution order:**
1. `.case-study/templates/portfolio-card/{template}/`
2. `templates/portfolio-card/{template}/`

Read `card.html` from the chosen template. Required placeholders:
- `{{CATEGORY_LABEL}}` — e.g., "Cursor Plugin", "AI Content Generator"
- `{{CATEGORY_ICON}}` — inline SVG or emoji for category
- `{{CTA_TEXT}}` — primary button label, e.g., "Read the case study", "View case study", "Try it free"
- `{{CTA_URL}}` — primary link target (portfolio case study URL)
- `{{CTA_ICON}}` — optional inline SVG for button (or empty)
- `{{CTA2_HTML}}` — optional second CTA. When marketing output exists, use: `<a href="./{marketingOutputBase}.html" class="csm-portfolio-card__cta csm-portfolio-card__cta--secondary" target="_blank" rel="noopener">View the marketing landing page</a>` (with arrow SVG). Find the latest marketing file in OUTPUTS/ (e.g. `marketing-starter-light-technical-20260302-143022.html` or `marketing_casestudymaker.html`). Otherwise leave empty.
- `{{PROJECT_TITLE}}` — project name
- `{{PROJECT_DESCRIPTION}}` — 1–2 sentence summary from reflections or events

### Step 3: Ask for CTA if needed

If the developer hasn't specified where the card should link, ask:

"Where should the card button link? For example:
- Full case study: `./portfolio_casestudymaker.html` or your deployed URL
- Cursor Marketplace: your plugin listing URL
- Email signup: your form or waitlist URL
- GitHub: repo URL"

Use their answer for `{{CTA_URL}}` and suggest `{{CTA_TEXT}}` (e.g., "View case study", "Try it free").

### Step 4: Fill placeholders

**Default icon (category):** Use this SVG if no custom icon provided:
```html
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
```
Or a simpler code icon. For "Cursor Plugin" / dev projects, a terminal or bracket icon works.

**Default CTA icon:** Optional arrow:
```html
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
```

**Description:** Synthesize from the first reflection or a brief project summary. Max ~120 characters for card readability.

### Step 5: Output

**Style mode** (config.portfolioCardStyleMode from `/generate`): `stylesheet` (default) or `inherit`.
- **stylesheet** — Output HTML + CSS. Self-contained.
- **inherit** — Output HTML only. No CSS. Card inherits font, color, layout from parent page.

**Output directory:** `OUTPUTS/`  

**When called from `/generate`:** Use `config.outputBase` from the generate flow. Format: `{projectSlug}-portfolio-card-{timestamp}`. Example: `gitlauncher-portfolio-card-20260307-182345.html`. Project slug = `basename $(pwd)` → lowercase, non-alphanumeric removed.

**Security:** Validate outputBase before writing: must contain only `[a-zA-Z0-9_-]`. Reject if empty or if it would cause path traversal (`..`, `/`, `\`).

**Legacy / direct call:** Use `portfolio-card_[project].html`, `portfolio-card_[project].css` (stylesheet only). Project = `basename $(pwd)` → lowercase, hyphens removed.

1. **Write HTML:** `OUTPUTS/{outputBase}.html`
   - Card structure with placeholders filled
   - If stylesheet: include `<!-- Add to <head>: <link rel="stylesheet" href="{outputBase}.css"> -->`
   - If inherit: no stylesheet. Card uses semantic markup; parent provides all styling.
   - CTA URL: link to latest portfolio output (e.g. `portfolio-starter-default-20260302-143022.html` or `portfolio_casestudymaker.html`) if it exists, or user-specified URL

2. **Write CSS** (stylesheet mode only): `OUTPUTS/{outputBase}.css`
   - Resolve theme from `templates/portfolio-card/starter/themes/{theme}/` or `templates/themes/{theme}/`
   - Concatenate theme variables + card-override.css. Output self-contained.

3. **Escape all user content** before inserting into HTML (`&`, `<`, `>`, `"`, `'`).

### Step 6: Report

Tell the developer:
- Files written: `OUTPUTS/{outputBase}.html`, `OUTPUTS/{outputBase}.css`
- Local path: `OUTPUTS/{outputBase}.html`
- **Ask:** "Want me to open this in your browser for a preview?" If yes, run `open OUTPUTS/{outputBase}.html` (macOS) or `xdg-open` (Linux) or `start` (Windows).
- How to use: "Paste the HTML into your portfolio page. Add `<link rel=\"stylesheet\" href=\"{outputBase}.css\">` to your page's `<head>` to apply template styles (overrides your page)."
- How to deploy: "Run `/send-to-pages` to copy to your GitHub Pages folder."

## Template format (for selling)

Templates live in `templates/portfolio-card/{template-name}/`:
- `card.html` — HTML fragment with `{{PLACEHOLDER}}` variables
- `manifest.json` — name, description, placeholders list, cssVariables

Placeholders are replaced at generation time. CSS variables (`--csm-accent`, etc.) allow the card to be styled by the parent page.

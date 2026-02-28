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

**Template resolution order:**
1. `.case-study/templates/portfolio-card/` (user-installed)
2. `templates/portfolio-card/starter/` (built-in)

Read `card.html` from the chosen template. Required placeholders:
- `{{CATEGORY_LABEL}}` — e.g., "Cursor Plugin", "AI Content Generator"
- `{{CATEGORY_ICON}}` — inline SVG or emoji for category
- `{{CTA_TEXT}}` — button label, e.g., "View case study", "Try it free", "Get it on marketplace"
- `{{CTA_URL}}` — link target (full case study URL, marketplace, email form, etc.)
- `{{CTA_ICON}}` — optional inline SVG for button (or empty)
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

**Output directory:** `OUTPUTS/`  
**Naming:** `portfolio-card_[project].html`, `portfolio-card_[project].css`  
Project name: `basename $(pwd)` → lowercase, hyphens removed (e.g., `casestudymaker`).

1. **Write HTML:** `OUTPUTS/portfolio-card_[project].html`
   - Card structure with placeholders filled
   - Include: `<!-- Add to <head>: <link rel="stylesheet" href="portfolio-card_[project].css"> to apply template styles -->`
   - CTA URL: link to `portfolio_[project].html` if it exists, or user-specified URL

2. **Write CSS:** `OUTPUTS/portfolio-card_[project].css`
   - Resolve `@import` in `templates/portfolio-card/starter/card-override.css`. Concatenate `templates/themes/default/variables.css` + card styles (strip `@import` lines). Write combined result. Output must be self-contained.
   - Template CSS overrides your page when imported — add `<link rel="stylesheet" href="portfolio-card_[project].css">` to your site's `<head>`

3. **Escape all user content** before inserting into HTML (`&`, `<`, `>`, `"`, `'`).

### Step 6: Report

Tell the developer:
- Files written: `OUTPUTS/portfolio-card_[project].html`, `OUTPUTS/portfolio-card_[project].css`
- How to use: "Paste the HTML into your portfolio page. Add `<link rel=\"stylesheet\" href=\"portfolio-card_[project].css\">` to your page's `<head>` to apply template styles (overrides your page)."
- How to deploy: "Run `/send-to-pages` to copy to your GitHub Pages folder."

## Template format (for selling)

Templates live in `templates/portfolio-card/{template-name}/`:
- `card.html` — HTML fragment with `{{PLACEHOLDER}}` variables
- `manifest.json` — name, description, placeholders list, cssVariables

Placeholders are replaced at generation time. CSS variables (`--csm-accent`, etc.) allow the card to be styled by the parent page.

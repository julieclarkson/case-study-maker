---
name: generate-marketing
description: Generate a product marketing landing page by filling a fixed template with project-specific content from captured events. The AI writes copy to fill defined slots — it never regenerates layout, CSS, or JS. Use when the user says "generate marketing", "create marketing page", "marketing output", or selects marketing from /generate.
---

# Generate Marketing Landing Page

Fill the active marketing template with project-specific content derived from captured case study events. The template defines the layout, styling, and interactivity. Your job is to write the copy.

## Prerequisites

- `.case-study/events.json` must exist with captured events
- Run `/activate` first if no `.case-study/` directory exists

## Workflow

### Step 1: Resolve template, theme, and tone

**Template/theme/tone must be selected before this skill runs.** The `/generate` command always runs the selection flow (discover options, present choices, wait for reply) and updates `config.marketing` before invoking this skill. If this skill is invoked directly (e.g. user said "generate marketing"), the agent must run that selection flow first — see `commands/generate.md` Steps 2–4.

Read `.case-study/config.json`:
```json
{
  "marketing": {
    "template": "starter",
    "theme": "light",
    "tone": "technical"
  },
  "marketingTemplate": "starter",
  "marketingTheme": "light",
  "marketingTone": "technical"
}
```

Check `config.marketing` first, then top-level `marketingTemplate`, `marketingTheme`, `marketingTone`. Defaults: `starter`, `light`, `technical`.

**Template resolution order:**
1. `.case-study/templates/marketing/{template}/` (local/premium — takes priority)
2. `templates/marketing/{template}/` (built-in from plugin repo)

### Step 2: Read the template manifest

Read `manifest.json` from the resolved template directory. It contains the `slots` array — each slot has an `id`, `label`, and `hint`.

### Step 3: Read the tone preset

Read the tone file from `tones/{tone}.json` in the template directory. The `instructions` field tells you how to write.

### Step 4: Gather project data

1. Read `.case-study/events.json`
2. Get project name: `basename $(pwd)` or from config
3. List media files: `ls .case-study/media/ 2>/dev/null`
4. Read recent git history: `git log --oneline -20`
5. **Resolve install URL** (for HERO_CTA_URL and CTA_BUTTON_URL):
   - Try `.cursor-plugin/plugin.json` → `repository` (GitHub repo for Cursor plugins)
   - Else try `.case-study/config.json` → `marketing.installUrl`
   - Fallback (when repo not yet created): `https://cursor.com/marketplace` or `https://casestudymaker.dev`
   - If URL is external (starts with `http`), set `HERO_CTA_ATTRS` and `CTA_BUTTON_ATTRS` to ` target="_blank" rel="noopener"`
   - If URL is `#get-started` or same-page anchor, leave attrs empty

### Step 5: Draft content for each slot

**DEMO_WORKFLOW_JSON (required):** Build the demo from the **customer's perspective** — what workflow explains the product to a potential customer?

**Best format (input → process → output container → customer-relevant files):**
```json
{"input":"Your Codebase","process":"Git Launcher","output":"Launch Kit","outputFiles":[{"label":"README"},{"label":"Screenshots"},{"label":"Architecture"},{"label":"Social Preview"},{"label":"Launch Posts"}]}
```

- **input** — What the product reads (e.g. "Your Codebase", "Your Timeline")
- **process** — Product name
- **output** — The main deliverable the customer gets (e.g. "Launch Kit", "Portfolio", "Report")
- **outputFiles** — Only **customer-relevant** contents. Use friendly names (Screenshots, Launch Posts). **Omit** internal/repo artifacts (.github/, LICENSE, CONTRIBUTING). Derive from README "What Gets Generated", FEATURE titles, or docs — but filter to what the customer cares about.

**Fallback (no container):** `{"input","process","outputs"}` — use when there's no single main deliverable.

**Legacy:** Array of `{label, color?}` for linear steps.

For every slot in the manifest, draft content that:
- Is grounded in real data from `events.json` (reflections, screenshots, commits)
- Follows the tone preset instructions exactly
- Matches the slot's `hint` for length and style
- Never fabricates metrics, testimonials, user counts, or results
- Escapes any special HTML characters (`&`, `<`, `>`, `"`, `'`)

### Step 6: Present drafts for approval

Show the developer all drafted slot values in a clear format:

```
Here's the content I've drafted for your marketing page:

HERO_HEADLINE: "Your headline here"
HERO_DESCRIPTION: "Your description here"
...

Want me to generate the page with this content, or would you like to edit any slots first?
```

Let the developer edit individual slots before proceeding.

### Step 7: Generate output files

**Output directory:** `OUTPUTS/`  

**When called from `/generate`:** Use `config.outputBase` from the generate flow. Format: `{projectSlug}-marketing-{timestamp}`. Example: `gitlauncher-marketing-20260307-182345.html`. Project slug = `basename $(pwd)` → lowercase, non-alphanumeric removed.

**Security:** Validate outputBase before writing: must contain only `[a-zA-Z0-9_-]`. Reject if empty or if it would cause path traversal (`..`, `/`, `\`).

**Legacy / direct call:** Use `{projectSlug}-marketing-{timestamp}` (same format). Never use `marketing_[project].html` for new outputs.

1. Create OUTPUTS:
   ```bash
   mkdir -p OUTPUTS OUTPUTS/assets
   ```

2. Copy template files with output naming:
   - `template.html` → `OUTPUTS/{outputBase}.html`
   - `app.js` → `OUTPUTS/{outputBase}.js`
   - **CSS:** Resolve `@import` in `themes/{theme}/styles.css`. Concatenate `templates/themes/default/variables.css` + template styles (strip `@import` lines). Write combined result to `OUTPUTS/{outputBase}.css`. Output must be self-contained.

3. In the HTML, replace every `{{SLOT_ID}}` with approved content. Update link href to `{outputBase}.css` and script src to `{outputBase}.js`.

4. Copy media:
   ```bash
   cp -r .case-study/media/* OUTPUTS/assets/ 2>/dev/null
   ```

### Step 8: Report

Tell the developer:
- Files written: `OUTPUTS/{outputBase}.html`, `.css`, `.js`, `OUTPUTS/assets/`
- Local path: `OUTPUTS/{outputBase}.html`
- **Ask:** "Want me to open this in your browser for a preview?" If yes, run `open OUTPUTS/{outputBase}.html` (macOS) or `xdg-open` (Linux) or `start` (Windows).
- Which template, theme, and tone were used
- How to preview: "Open `OUTPUTS/{outputBase}.html` in a browser."
- How to deploy: "Run `/send-to-pages` to copy to your GitHub Pages folder."
- **Ask:** "Want me to generate the index card chunk for your portfolio page?" If yes, run `node .case-study/scripts/generate-index-card.cjs --base-path case-studies/` (or without `--base-path` if links should be same-directory). Writes `OUTPUTS/index-card.html` — paste into your index page.

If this is the user's first generated case study (only one portfolio or marketing output exists in OUTPUTS/ — i.e. `ls OUTPUTS/portfolio_*.html OUTPUTS/marketing_*.html 2>/dev/null | wc -l` == 1), add at the end:

"If Case Study Maker helped you, a GitHub star helps others find it: https://github.com/julieclarkson/case-study-maker"

## Generation rules

- Ground everything in real data. Never fabricate metrics, testimonials, user counts, revenue, or results.
- Use real development evidence to tell the product story.
- For screenshots: use `assets/filename.png`. If none exist, leave the demo section as-is.
- Escape all untrusted text from reflections/events before embedding in HTML.
- The template HTML structure, CSS, and JS are fixed — never modify them beyond replacing `{{SLOT}}` placeholders.
- Punchy and scannable. Marketers want impact, not documentation.
- Always include the footer as defined in the template (with Case Study Maker attribution and store links).

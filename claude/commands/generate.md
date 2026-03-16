---
name: generate
description: Generate a case study from your captured timeline. Checks for existing outputs first, then offers template/theme/tone selection. Outputs use unique naming so multiple versions accrue.
---

# Generate

## Step 0: Check for existing outputs

```bash
ls OUTPUTS/*.html 2>/dev/null
```

**If any HTML files exist in OUTPUTS/**, present them and ask:

```
You have existing outputs:

1. portfolio_casestudymaker.html
2. casestudymaker-portfolio-20260302-143022.html
3. casestudymaker-marketing-20260302-150000.html
...

Do you want to:
A) Update one of these with fresh content (same file, new data from events)
B) Generate a new output — we'll show you category, template, theme, and tone options to choose from

Reply with A or B, and if A, the number of the file to update.
```

**If user chooses A (update):** Use the selected file. Parse its name to infer category, template, theme, tone (see naming format below).

**MANDATORY for portfolio updates:** Run the refresh+build command so updates are deterministic and trustworthy:

```bash
node scripts/build-portfolio.js --refresh-from-git [project-slug]
```

`--refresh-from-git` refreshes commits from `git log` and screenshots from OUTPUTS/assets (only images present there). The same file is overwritten. **Always use this flag for portfolio updates** — do not skip it.

For marketing, portfolio-card, or other categories: regenerate per that category's skill. Skip to Step 6.

**If user chooses B (new)** or **if OUTPUTS/ is empty:** Immediately run Step 1 — discover categories and present the numbered list. Do not skip to any later step.

---

## MANDATORY: Selection flow (Steps 1–5)

**These steps run every time** for new outputs. Never skip. Never assume defaults without presenting choices.

1. **Step 1 — Category** — Always discover from `ls .case-study/templates/ templates/`, exclude `themes`, then present a numbered list. "What would you like to generate? 1. portfolio  2. marketing  ..."
2. **Steps 2–5 — Template, theme, tone, style** — Discover from filesystem, present numbered choices for each. Only list what exists.
3. **Wait for reply** — require the user to pick before proceeding. Reply with number or name.
4. **Consistency** — same flow whether via `/case-study-maker:generate`, `/case-study-maker:generate-portfolio-card`, or `/case-study-maker:generate-custom`. Category list shown every time when applicable.

**Security (selection values):** Map the user's reply to the discovered list. If they reply with a number, use the corresponding option. If they reply with a name, use it only if it exactly matches one of the discovered options. Reject any value containing `..`, `/`, `\`, or that fails the safe pattern `[a-z0-9_-]+`. Never interpolate unvalidated user input into paths or outputBase.

---

## Step 1: Select category (always run, always list)

**MANDATORY:** Run discovery first, then present the list. Never ask "which category?" without showing the discovered options.

```bash
ls .case-study/templates/ templates/ 2>/dev/null
```

Merge and deduplicate. **Exclude `themes`** and non-directory entries (e.g. README.md). Subdirectories = categories.

**Present exactly this format** — numbered list of discovered categories only:

```
What would you like to generate?

1. portfolio      2. marketing      3. portfolio-card      4. pitch-deck
   (only list what exists; use discovered names)

Reply with the number or name.
```

**Consistency:** Same presentation whether OUTPUTS was empty or user chose B. Always show the list.

## Step 2: Select template for that category

```bash
ls .case-study/templates/{category}/ templates/{category}/ 2>/dev/null
```

Subdirectories with `template.html`/`card.html` + `manifest.json` are template names.

Present only what exists:

```
Which template for {category}?

1. starter   2. minimal   ... (discovered from templates)

Reply with the number or name.
```

## Step 3: Select theme

```bash
ls .case-study/templates/{category}/{template}/themes/ templates/{category}/{template}/themes/ 2>/dev/null
ls .case-study/templates/themes/ templates/themes/ 2>/dev/null
```

Fallback: shared `templates/themes/` for portfolio.

Present only what exists:

```
Which theme?

1. default   2. light   ... (discovered from themes dirs)

Reply with the number or name.
```

If no themes: use `default` as the theme name for output naming.

## Step 4: Tone (marketing only)

If category is **marketing**, discover tones from the template:

```bash
ls .case-study/templates/marketing/{template}/tones/*.json templates/marketing/{template}/tones/*.json 2>/dev/null
```

Extract base names (e.g. `technical.json` → `technical`). Present:

```
Which tone?

1. technical   2. storytelling   3. enterprise   ... (discovered from tones/)

Reply with the number or name.
```

Otherwise tone = `""` for output naming.

## Step 5: Style mode (portfolio-card, templates with inherit)

For portfolio-card or templates with `styleMode: ["inherit"]`:

```
Style mode? 1) stylesheet (self-contained)  2) inherit (use parent page styling)
```

## Step 6: Generate with unique naming

**Output filename format (always use):**
`{projectSlug}-{type}-{timestamp}.html`

- **projectSlug:** From `basename $(pwd)` → lowercase, hyphens removed (e.g. `gitlauncher`, `casestudymaker`)
- **type:** `portfolio` | `marketing` | `pitch-deck` | `portfolio-card` (matches category)
- **timestamp:** `YYYYMMDD-HHmmss` (e.g. `20260302-143022`). Use `date +%Y%m%d-%H%M%S` in bash.

**Examples:** `gitlauncher-portfolio-20260307-182345.html`, `casestudymaker-marketing-20260302-143022.html`

**Matching files:** Same base for `.css`, `.js`: `{base}.css`, `{base}.js`

**Update `.case-study/config.json`** (or in-memory config) with:
- `outputBase`: the full base name without extension (e.g. `gitlauncher-portfolio-20260307-182345`). **Security:** must contain only `a-z`, `0-9`, `-`, `_`. No path separators (`/`, `\`), dots, or `..`. Sanitize before setting.
- `portfolioTemplate`, `portfolioTheme` (for portfolio)
- `marketingTemplate`, `marketingTheme`, `marketingTone` (for marketing)
- `portfolioCardTemplate`, `portfolioCardTheme`, `portfolioCardStyleMode` (for portfolio-card)
- `{category}Template`, `{category}Theme` (for custom categories)

**Run the appropriate skill** with these parameters. Skills read `config.outputBase` and use it for file naming.

## Step 7: Report and offer preview

- Files written with the new naming
- Local path
- **Ask:** "Want me to open this in your browser for a preview?"
- If yes: `open OUTPUTS/{outputBase}.html` (or xdg-open/start)

**If category was portfolio or marketing:** Ask: "Want me to generate the index card chunk for your portfolio page?" If yes, run:
```bash
node scripts/generate-index-card.cjs --base-path case-studies/
```
The script writes `OUTPUTS/index-card.html` — paste that HTML into your index page.

## Prerequisites

- `.case-study/events.json` must exist
- If no templates found: "Run `/case-study-maker:activate` to set up tracking, or `/case-study-maker:install-template` to add a template."

## Parsing existing filenames (for update)

**Standard format:** `{projectSlug}-{type}-{timestamp}.html`
- Regex: `^([a-z0-9_-]+)-(portfolio|marketing|pitch-deck|portfolio-card)-(\d{8}-\d{6})\.html$`
- Groups: projectSlug, type, timestamp

**Legacy format:** `{category}_{project}.html` (e.g. `portfolio_casestudymaker.html`)
- Infer template=starter, theme=default, tone= (from config for marketing)

**Security:** When deriving outputBase from a selected filename (update flow), validate the basename contains only `[a-z0-9_.-]`. Reject if the filename contains `..`, `/`, `\`, or fails validation. Use the basename only (strip path if present).

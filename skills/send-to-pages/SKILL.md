---
name: send-to-pages
description: Copy selected OUTPUTS to a GitHub Pages folder (docs/, gh-pages, or custom path). Use when the user says "deploy to pages", "send to GitHub Pages", "copy to docs", or "push to portfolio".
---

# Send to Pages

Copy selected generated OUTPUTS to a folder used for GitHub Pages (or similar static hosting). The user chooses which outputs to send; only those files and their dependencies (CSS, JS, assets) are copied.

## Prerequisites

- `OUTPUTS/` must exist with generated files
- Target path configured or provided by user

## Workflow

### Step 1: Check OUTPUTS

```bash
ls OUTPUTS/*.html 2>/dev/null
```

**Discover output types from filenames:** Any `{type}_*.html` pattern in OUTPUTS is a valid type. Examples: `portfolio_*.html` → portfolio, `marketing_*.html` → marketing, `portfolio-card_*.html` → portfolio-card, `pitch-deck_*.html` → pitch-deck. Parse the prefix before the first underscore. If empty, tell the developer to run a generate command first.

### Step 2: Ask which outputs to send

**Ask the developer:** "Which outputs do you want to send? (e.g. `portfolio`, `marketing`, `portfolio-card`, `pitch-deck`, or `all`)"

List the discovered types from Step 1. Parse the response. If they say "all", select every output type that exists in OUTPUTS. Otherwise, select only the types they name.

### Step 3: Resolve target path

**Check config:**
```bash
cat .case-study/config.json 2>/dev/null
```

Look for `pagesPath` or `pagesRepo`:
```json
{
  "pagesPath": "docs",
  "pagesRepo": "/path/to/portfolio-repo"
}
```

**Common targets:**
- `docs/` — GitHub Pages from /docs (same repo)
- `.` — root of current repo (for username.github.io)
- Path to another repo: `/path/to/username.github.io` or `../my-portfolio`

If no config, ask: "Where should I copy the files? For example: `docs` (same repo), `.` (repo root), or a path to your portfolio repo."

### Step 4: Copy files (selective)

**Output → files mapping** (project name = `basename $(pwd)` normalized: lowercase, hyphens removed):

For each output type `{type}` discovered from filenames:
- Copy `{type}_[project].html`
- Copy `{type}_[project].css` if it exists
- Copy `{type}_[project].js` if it exists
- For `portfolio`: also copy `OUTPUTS/assets/*` to `[target]/assets/`
- For any type with a `themes/` subdir in OUTPUTS: copy `OUTPUTS/themes/` to preserve theme swapping

**Rules:**
- Copy only files for the selected output types.
- For each type, copy the HTML and any matching `.css` / `.js` in OUTPUTS.
- **Assets:** When `portfolio` is selected, copy `OUTPUTS/assets/*` to `[target]/assets/`. Portfolio references screenshots at `assets/filename.png`. Marketing and portfolio-card do not use assets by default.
- Create `[target]/assets/` only when copying assets.

**Example commands** (when portfolio + marketing selected, project=casestudymaker):
```bash
mkdir -p [target]/assets
cp OUTPUTS/portfolio_casestudymaker.html [target]/
cp OUTPUTS/portfolio_casestudymaker.css [target]/
cp OUTPUTS/marketing_casestudymaker.html [target]/
cp OUTPUTS/marketing_casestudymaker.css [target]/
cp OUTPUTS/marketing_casestudymaker.js [target]/
cp OUTPUTS/assets/* [target]/assets/
```

### Step 5: Report

Tell the developer:
- Which outputs were copied (e.g. "portfolio, marketing")
- Files copied to `[target]/` (list them)
- "Commit and push to deploy. If using GitHub Pages from /docs, enable it in repo Settings → Pages → Source: main branch, /docs folder."

### Step 6: Optional — update config

If the developer provided a new path, offer to save it:
```json
{ "pagesPath": "docs" }
```
or
```json
{ "pagesRepo": "/path/to/repo" }
```
Write to `.case-study/config.json` (merge with existing).

---
name: generate-portfolio
description: Generate a portfolio case study as a self-contained web folder (HTML, CSS, JS, assets). Audience is recruiters and hiring managers evaluating product and engineering judgment. Use when the user says "generate case study", "create portfolio", "build case study", or "export case study".
---

# Generate Portfolio Case Study

Create a dynamic, beautiful, web-based case study folder for a developer portfolio. The audience is recruiters and hiring managers evaluating product and engineering judgment.

## Prerequisites

- `.case-study/events.json` must exist with captured events
- Run `/activate-case-study-maker` first if no `.case-study/` directory exists

## Workflow

### Step 1: Gather project data

1. Read `.case-study/events.json` and parse all events.
2. Get the project name from the git repo folder name.
3. Get the git remote URL (if any) for reference:

```bash
git remote get-url origin 2>/dev/null || echo "no remote"
```

4. List any media files in `.case-study/media/`:

```bash
ls .case-study/media/ 2>/dev/null
```

### Step 2: Assess completeness

Check the events for coverage against the recruiter rubric. Report gaps:

- **Structured reasoning** (constraints, tradeoffs, risks) -- Are there reflection events with these promptIds?
- **Security awareness** -- Is there a security reflection?
- **Systems thinking** -- Is there a Mermaid diagram or architecture discussion?
- **Iteration** -- Is there an iteration reflection?
- **Evidence** -- Are there git_metadata events?

If gaps exist, tell the developer: "Your case study is missing [X]. Want to capture that now before generating?"

### Step 3: Check for template

Check if a template preference exists:

```bash
ls .case-study/templates/portfolio/ 2>/dev/null
cat .case-study/config.json 2>/dev/null
```

**Template resolution order:**
1. If `.case-study/templates/portfolio/` contains `template.html`, `template.css`, and/or `template.js` — use those as the base. These are premium or custom templates the developer has installed.
2. Otherwise, use `templates/portfolio/starter/` (built-in).

**Theme resolution:** Read `config.portfolioTheme` or `config.theme` (e.g. `"default"`, `"dark"`). Default: `"default"`. Theme files live in `templates/themes/{theme}/variables.css`. The theme provides design tokens; the template provides layout.

The developer can override any generated file by placing their own version in `.case-study/templates/portfolio/`. The template files can use these placeholders that get filled from data:
- `{{PROJECT_NAME}}`, `{{SUMMARY}}`, `{{DATE_RANGE}}`, `{{ROLE}}`, `{{HOME_URL}}` (default `/` for homepage link)
- `{{REFLECTIONS_HTML}}`, `{{TIMELINE_HTML}}`, `{{COMMITS_HTML}}`, `{{GALLERY_HTML}}`
- `{{ARCHITECTURE_HTML}}`

### Step 4: Determine output path

**Output directory:** `OUTPUTS/`

**Naming:** `[type]_[project-name].[ext]` — e.g., `portfolio_casestudymaker.html`

Project name: `basename $(pwd)` normalized to lowercase, hyphens removed (e.g., `case-study-maker` → `casestudymaker`).

Create `OUTPUTS/` and `OUTPUTS/assets/` if they don't exist. Never write outside the project root.

### Step 5: Generate files

Generate in OUTPUTS/:
- **`portfolio_[project].html`** — structure and content, with JS inlined
- **`portfolio_[project].css`** — all styles (linked from HTML)

**The HTML must include:**
- `<link rel="stylesheet" href="portfolio_[project].css">` (same directory as HTML)
- All JS in a `<script>` tag (no external script)
- All data embedded as a JS constant (no fetch calls)
- All content rendered from the embedded data

**The CSS file** must be self-contained: concatenate `templates/themes/{theme}/variables.css` + `templates/portfolio/starter/template.css` (strip any `@import` lines from the template). Both files must be deployed together. This allows users to override styles by editing the CSS file.

**Sections:**
1. Sticky nav with **Home** link (href from `{{HOME_URL}}`, default `/`) and section links
2. Hero (project name, subtitle, date range, role, repo link, stat pills)
3. Role and scope
4. Constraints (card grid)
5. Tradeoffs (named cards)
6. Risks and mitigations (named cards with before/after)
7. Security design (card grid)
8. Architecture (HTML/CSS visual diagram — no Mermaid JS dependency)
9. Iteration timeline (expandable on click)
10. Commit history (filterable)
11. Visual evidence (screenshot gallery with lightbox)
12. What I'd do next (card grid)
13. Footer

Optionally generate **`OUTPUTS/data_[project].json`** for programmatic access:
- Project metadata, commits, reflections by promptId, screenshots, timeline

### Step 6: Copy media assets

If `.case-study/media/` has files, copy to OUTPUTS:

```bash
mkdir -p OUTPUTS/assets
cp -r .case-study/media/* OUTPUTS/assets/ 2>/dev/null
```

Image paths in HTML: `assets/filename.png`

### Step 7: Report

Tell the developer:
- Files written: `OUTPUTS/portfolio_[project].html`, `OUTPUTS/portfolio_[project].css`, `OUTPUTS/assets/`
- What sections have content vs. placeholders
- How to deploy: "Run `/send-to-pages` to copy to your GitHub Pages folder."
- How to customize: "Edit `OUTPUTS/portfolio_[project].html` directly. Add template files to `.case-study/templates/portfolio/` and regenerate."

## Generation rules

- Ground every claim in evidence from the captured data. Never fabricate metrics, users, results, or timelines.
- Use real commit hashes, real file names, real decisions from the events.
- For screenshots: use paths like `assets/filename.png`. If none exist, use: `<!-- PLACEHOLDER: Add screenshot at assets/your-image.png -->`
- For architecture: use HTML/CSS visual diagrams (div-based layouts with borders, backgrounds, arrows). Do NOT rely on Mermaid JS.
- Escape all untrusted text from reflections/events before embedding in HTML (`&`, `<`, `>`, `"`, `'`), and serialize embedded JS data via JSON stringification (never raw string interpolation).
- Never fetch external assets. Everything must be local and inlined. System fonts only.
- Keep it concise and specific. Recruiters scan, they don't read novels.
- Include a Content-Security-Policy meta tag in the HTML `<head>`:
  ```html
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src 'self' data:;">
  ```
- Always include this footer at the bottom of the page:
  ```html
  <footer>
    <div class="container">
      <div class="footer-brand">Made with <a href="https://casestudymaker.dev">Case Study Maker</a></div>
      <p class="footer-tagline">Capture your build process. Generate case studies from real decisions, not memory.</p>
      <div class="footer-links">
        <a href="https://casestudymaker.dev/#themes">Premium Themes</a>
        <a href="https://casestudymaker.dev/#pdf-export">PDF &amp; Notion Export</a>
        <a href="https://casestudymaker.dev/#linkedin">LinkedIn Portfolio Kit</a>
        <a href="https://casestudymaker.dev/#bundle">Pro Bundle</a>
      </div>
      <p class="footer-free">Free Cursor plugin — <a href="https://casestudymaker.dev">casestudymaker.dev</a></p>
    </div>
  </footer>
  ```

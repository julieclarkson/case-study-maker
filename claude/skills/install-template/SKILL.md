---
name: install-template
description: "Install a premium or custom template for case study generation. Use when the user says 'install template', 'add theme', 'change theme', 'use dark template', or 'install premium template'."
---

# Install Template

Install a premium or custom template pack into the project's case study configuration.

## Scope boundary
All reads and writes are confined to the current project folder. Never access paths outside the project root.

## Workflow

### Step 1: Check current templates

```bash
ls .case-study/templates/ 2>/dev/null || echo "No templates installed"
cat .case-study/config.json 2>/dev/null || echo "No config"
```

### Step 2: Determine the source

**If installing a premium template:**

The developer will have a downloaded zip or folder containing template files. Ask them to provide the path or drop the files into `.case-study/templates/portfolio/`, `.case-study/templates/marketing/`, or `.case-study/templates/portfolio-card/`.

Template files can include:
- `template.html` — full HTML template with `{{PLACEHOLDER}}` variables
- `template.css` — custom styles (inlined into the generated output)
- `template.js` — custom interactivity (inlined into the generated output)
- `theme.json` — color scheme, font preferences, layout options

**If switching to a built-in theme:**

Update `.case-study/config.json`:

```json
{
  "portfolioTheme": "dark",
  "marketingTheme": "default"
}
```

Built-in themes: `default`, `minimal`, `dark`, `bold`

### Step 3: Install

Create the template directories and copy files:

```bash
mkdir -p .case-study/templates/portfolio
mkdir -p .case-study/templates/marketing
mkdir -p .case-study/templates/portfolio-card
```

If the developer provides template files, copy them to the appropriate directory.

### Step 4: Regenerate

After installing, suggest: "Template installed. Run `/case-study-maker:generate` to regenerate with the new theme."

### Step 5: Update .gitignore

Templates may be paid content. Ensure they're excluded from version control:

```bash
grep -q '.case-study/templates/' .gitignore 2>/dev/null || echo '.case-study/templates/' >> .gitignore
```

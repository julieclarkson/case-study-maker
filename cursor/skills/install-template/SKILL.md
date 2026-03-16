---
name: install-template
description: Install a premium or custom template for case study generation. Use when the user says "install template", "add theme", "change theme", "use dark template", or "install premium template".
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

**If installing a premium template purchased from Lemon Squeezy:**

The developer will have a downloaded zip or folder containing template files. Ask them to provide the path and the **category name** (e.g. `portfolio`, `marketing`, `portfolio-card`, `pitch-deck`, `linkedin`, or any custom name).

**Install location:** `.case-study/templates/{category}/{template-name}/`

Categories are discovered automatically. Any subdirectory of `.case-study/templates/` (except `themes`) is a valid category. Use `/generate {category}` or "generate {category}" to produce output.

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

Create the template directory for the chosen category and copy files:

```bash
mkdir -p .case-study/templates/{category}/{template-name}
# Copy template files into that directory
```

Example for a new "pitch-deck" category:
```bash
mkdir -p .case-study/templates/pitch-deck/starter
cp -r /path/to/template/* .case-study/templates/pitch-deck/starter/
```

Required files: `template.html`, `manifest.json` (with `placeholders` array). Optional: `template.css`, `template.js`.

### Step 4: Regenerate

After installing, suggest: "Template installed. Run `/generate {category}` (e.g. `/generate pitch-deck`) to generate output."

### Step 5: Update .gitignore

Templates may be paid content. Ensure they're excluded from version control:

```bash
grep -q '.case-study/templates/' .gitignore 2>/dev/null || echo '.case-study/templates/' >> .gitignore
```

---
name: customize
description: Change template, theme, tone, colors, fonts, content, or install a downloaded template pack.
---

Ask the developer what they want to customize:

1. **Switch template** — List available templates from `templates/` and `.case-study/templates/`. Update `.case-study/config.json` with the selection.
2. **Switch theme** — List available themes for the active template. Update config.
3. **Switch tone** — List available tones for the active template. Update config.
4. **Edit content** — Read the current output and make targeted text edits.
5. **Change colors/fonts** — Modify CSS variables in the active theme's `styles.css` within `.case-study/output/`.
6. **Install a template pack** — Run the `install-template` skill to copy a downloaded template/theme into `.case-study/templates/`.
7. **Import from Figma** — Run the `integrate-figma` skill to pull design assets.
8. **Import from other tools** — Run the `integrate-assets` skill to pull context from Linear, Notion, etc.

After any template, theme, or tone change, suggest regenerating: "Run `/generate` to apply the new settings."

### Config file format

`.case-study/config.json`:

```json
{
  "theme": "default",
  "marketing": {
    "template": "starter",
    "theme": "light",
    "tone": "technical",
    "source": "builtin"
  },
  "portfolio": {
    "template": "starter",
    "theme": "default",
    "source": "builtin"
  },
  "homeUrl": "/"
}
```

- **theme** — Design tokens (colors, fonts, spacing). Lives in `templates/themes/{theme}/variables.css`. Options: `default`, or add `dark`, `minimal`, etc.
- **homeUrl** — Homepage link in portfolio nav (default `/`).
- **source** — `"builtin"` (from plugin `templates/`) or `"local"` (from `.case-study/templates/`).

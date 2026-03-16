# Shared Themes (legacy)

**Preferred:** Themes now live inside each template: `[category]/[template]/themes/[theme]/`. See `templates/README.md` for the full architecture.

This `themes/` folder is kept for backward compatibility. Portfolio and portfolio-card resolve themes here if the template has no `themes/` subdir.

## Structure

```
themes/
  default/
    variables.css   # colors, fonts, design tokens
    manifest.json   # name, description
```

## Theme = design system

A theme holds the full visual design system:
- **variables.css** — Colors, fonts, spacing, radii
- **framework.css** (optional) — Component styling (Material, Cupertino, Fluent). Swap theme = swap the entire MUI.

## Adding a theme

1. Create `themes/{name}/variables.css` with a `:root` block.
2. Add `manifest.json` with `id`, `name`, `description`.
3. Set `config.theme` or `config.portfolioTheme` to `{name}`.
4. Regenerate output.

## Variables

Templates expect these tokens:

- `--accent`, `--accent-2` — primary gradient colors
- `--font`, `--mono` — font families
- `--foreground`, `--muted` — text colors
- `--border`, `--bg-alt` — surfaces
- `--color-purple-50`, `--color-purple-600`, etc. — palette
- `--radius`, `--font-size`, `--text-sm`

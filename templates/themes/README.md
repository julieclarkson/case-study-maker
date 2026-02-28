# Themes

Themes provide **design tokens** (colors, typography, spacing). Templates provide **layout, animation, and function**. You can swap themes without changing templates.

## Structure

```
themes/
  default/
    variables.css   # :root { --accent, --font, --radius, ... }
    manifest.json   # name, description
```

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

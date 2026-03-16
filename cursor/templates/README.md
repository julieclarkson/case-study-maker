# Template Architecture

## Structure

```
templates/
  [category]/                    # portfolio, marketing, pitch-deck, etc.
    [template-name]/             # starter, minimal, etc.
      template.html              # layout structure (or card.html for portfolio-card)
      template.css               # layout, spacing, structure (optional if styleMode: inherit)
      manifest.json
      [snippets/]                # optional, for portfolio sections
      themes/                    # themes live INSIDE the template
        [theme-name]/             # default, material, cupertino, etc.
          variables.css           # colors, fonts, design tokens
          [framework.css]         # optional: design system (Material, Cupertino, Fluent)
          manifest.json
```

## Template vs Theme

| Layer | Location | Contains |
|-------|----------|----------|
| **Template** | `[category]/[template]/` | Layout structure, semantic HTML, spacing/grid CSS. Optional: `styleMode` to inherit parent styling. |
| **Theme** | `[category]/[template]/themes/[theme]/` | Colors, fonts, design framework (Material, Cupertino, Facebook Fluent). Fully replaces the visual design system. |

## Template: `styleMode` option

In `manifest.json`:

```json
{
  "styleMode": "stylesheet"
}
```

- **`stylesheet`** (default) — Template brings its own `template.css` + theme CSS. Output is self-contained.
- **`inherit`** — Template outputs minimal HTML with semantic structure only. No template or theme CSS. Styling comes from the parent page (e.g. embedding a card in your portfolio site). User selects "inherit" at generate time to skip stylesheets. Good for portfolio-card embedded in an existing site.

## Theme: Design framework

A theme is the full visual design system:

- **variables.css** — Design tokens: `--accent`, `--font`, `--foreground`, `--radius`, palette colors
- **framework.css** (optional) — Component styling: buttons, cards, inputs that match a design system

**Examples:**
- `themes/material/` — Google Material Design (elevation, ripple, Material components)
- `themes/cupertino/` — Apple HIG (iOS-style cards, blur, SF symbols)
- `themes/fluent/` — Microsoft Fluent (subtle depth, Office-like components)
- `themes/default/` — Neutral, CSS variables only (no framework)

The theme folder holds both color/font tokens and the design framework. Swapping themes = swapping the entire visual system.

## User selection at generate time

1. **Category** — What to generate (portfolio, marketing, etc.)
2. **Template** — Layout structure for that category
3. **Theme** — Color, font, design framework (Material, Cupertino, etc.)
4. **Style mode** (for embeddable outputs) — `inherit` (use parent page styling) or `stylesheet` (output includes template + theme CSS)

## Resolution order

1. `.case-study/templates/[category]/[template]/` (local, takes priority)
2. `templates/[category]/[template]/` (built-in)

Themes are always under the template: `[template]/themes/[theme]/`.

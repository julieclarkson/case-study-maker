# Portfolio Card Templates

Embeddable HTML cards that link from a developer's portfolio to their full case study, marketplace listing, or signup form.

## Usage

Run `/generate-portfolio-card` to create `.case-study/output/portfolio-card.html`. Copy the output and paste it into your portfolio page.

## Template format (for premium/custom designs)

Each template lives in `portfolio-card/{template-name}/`:

| File | Purpose |
|------|---------|
| `card.html` | HTML fragment with `{{PLACEHOLDER}}` variables |
| `manifest.json` | Metadata, placeholders list, CSS variables |

### Placeholders

| Placeholder | Example |
|-------------|---------|
| `{{CATEGORY_LABEL}}` | "Cursor Plugin", "AI Content Generator" |
| `{{CATEGORY_ICON}}` | Inline SVG or emoji |
| `{{CTA_TEXT}}` | "View case study", "Try it free" |
| `{{CTA_URL}}` | Link target (case study, marketplace, form) |
| `{{CTA_ICON}}` | Optional button icon (inline SVG) |
| `{{PROJECT_TITLE}}` | Project name |
| `{{PROJECT_DESCRIPTION}}` | 1–2 sentence summary |

### Inheritance

The card inherits **all styling** from its parent: font, color, background, border, padding, margin, box-shadow, etc. Only the layout structure (flex, gap) is defined by the card.

**Usage:** Wrap the card in a container that has your site's card styles:

```html
<div class="your-project-card">
  <!-- paste card HTML -->
</div>
```

Your `.your-project-card` styles (padding, background, border-radius, etc.) will flow down to the card.

## Installing a custom template

Copy your template folder to `.case-study/templates/portfolio-card/`. The generator will use it instead of the built-in starter.

# Pitch Deck / One-Pager

A minimal template for sharing a project overview as a pitch deck or one-pager.

**Category:** `pitch-deck`

## Structure

```
pitch-deck/
└── starter/
    ├── template.html
    ├── template.css
    └── manifest.json
```

## Placeholders

| Placeholder | Description |
|-------------|-------------|
| TITLE | Page title (browser tab) |
| PROJECT_SLUG | Project name slug for filenames |
| HEADLINE | Main headline |
| SUBTITLE | One-line description |
| PROBLEM_HEADING | Problem section heading |
| PROBLEM_BODY | Problem description |
| SOLUTION_HEADING | Solution section heading |
| SOLUTION_BODY | Solution description |
| CTA_TEXT | Call-to-action intro text |
| CTA_URL | Link URL (repo, demo, etc.) |
| CTA_ATTRS | `target="_blank" rel="noopener"` if external |
| CTA_LABEL | Button/link text |

## Usage

1. Copy to your project: `cp -r templates/pitch-deck .case-study/templates/`
2. Run: `/generate pitch-deck` or "generate pitch deck"
3. Output: `OUTPUTS/pitch-deck_[project].html`

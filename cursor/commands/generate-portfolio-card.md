---
name: generate-portfolio-card
description: Generate an embeddable portfolio card HTML that links to your case study, marketplace, or signup form.
---

# Generate Portfolio Card

**MANDATORY:** Run the selection flow (template, theme, style mode) before the skill. Same UX as `/generate` Steps 2–5. Never skip to defaults — always discover options and present choices.

## Step 1: Select template

```bash
ls .case-study/templates/portfolio-card/ templates/portfolio-card/ 2>/dev/null
```

Present subdirs with `card.html` + `manifest.json`:

```
Which template for portfolio-card?

1. starter   ... (only list what exists)

Reply with the number or name.
```

## Step 2: Select theme

```bash
ls .case-study/templates/portfolio-card/{template}/themes/ templates/portfolio-card/{template}/themes/ 2>/dev/null
ls .case-study/templates/themes/ templates/themes/ 2>/dev/null
```

Present:

```
Which theme?

1. default   ... (discovered from themes dirs)

Reply with the number or name.
```

If none: use `default`.

## Step 3: Select style mode

Read `manifest.json` from the template. If it has `styleMode: ["stylesheet", "inherit"]`:

```
Style mode?

1. stylesheet (self-contained)   2. inherit (use parent page styling)

Reply with the number or name.
```

## Step 4: Update config and run skill

**Security:** Map the user's reply to the discovered list; use only validated values. outputBase must contain only `a-z`, `0-9`, `-`, `_`. Sanitize template and theme before constructing outputBase — reject values containing `..`, `/`, `\`, or failing `[a-z0-9_-]+`.

Update `.case-study/config.json` with `portfolioCardTemplate`, `portfolioCardTheme`, `portfolioCardStyleMode`, and `outputBase` (e.g. `portfolio-card-starter-default-{timestamp}`). Run the `generate-portfolio-card` skill.

Output: `OUTPUTS/portfolio-card-{template}-{theme}-{timestamp}.html` (or legacy `portfolio-card_[project].html`)

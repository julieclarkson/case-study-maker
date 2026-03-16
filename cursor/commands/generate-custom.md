---
name: generate-custom
description: Generate output for any installed template category (pitch-deck, linkedin, etc.). Use when the user says "generate pitch deck", "generate linkedin", or any custom category.
---

# Generate Custom Category Output

**MANDATORY:** Run the selection flow (template, theme) before the skill. Same UX as `/generate` Steps 2–3. Never skip to defaults — always discover options and present choices.

## Step 1: Resolve category (always list when not specified)

**If the user didn't specify a category:** **MANDATORY** — run discovery, then present the numbered list. Never ask without showing options.

```bash
ls .case-study/templates/ templates/ 2>/dev/null
```

Exclude `themes`, README.md. Present discovered categories (portfolio, marketing, portfolio-card, pitch-deck, etc.):

```
What would you like to generate?

1. pitch-deck   2. linkedin   ... (only list what exists)

Reply with the number or name.
```

**If the user specified a category:** Use it only if it matches a discovered category (from `ls`) or passes validation: `[a-z0-9_-]+`. Reject values containing `..`, `/`, `\`.

## Step 2: Select template

```bash
ls .case-study/templates/{category}/ templates/{category}/ 2>/dev/null
```

Present subdirs with `template.html` + `manifest.json`:

```
Which template for {category}?

1. starter   ... (only list what exists)

Reply with the number or name.
```

## Step 3: Select theme

```bash
ls .case-study/templates/{category}/{template}/themes/ templates/{category}/{template}/themes/ 2>/dev/null
ls .case-study/templates/themes/ templates/themes/ 2>/dev/null
```

**If themes exist**, present:

```
Which theme?

1. default   ... (discovered from themes dirs)

Reply with the number or name.
```

If none: use `default`.

## Step 4: Update config and run skill

**Security:** Map the user's reply to the discovered list; use only validated values. outputBase must contain only `a-z`, `0-9`, `-`, `_`. Sanitize category, template, and theme before constructing outputBase — reject values containing `..`, `/`, `\`, or failing `[a-z0-9_-]+`.

Update `.case-study/config.json` with `{category}Template`, `{category}Theme`, and `outputBase` (e.g. `{category}-starter-default-{timestamp}`). Run the `generate-custom` skill with the category.

Output: `OUTPUTS/{category}-{template}-{theme}-{timestamp}.html` (and .css, .js if the template uses them).

---
name: csm
description: Show all Case Study Maker commands and current status.
---

Present this menu to the developer:

```
Case Study Maker
================
/activate         — Start tracking this project
/capture          — Capture a reflection now
/auto-capture     — AI drafts reflections from conversation
/review           — See what's been captured and what's missing
/generate         — Generate a case study or marketing page
/generate-portfolio-card — Generate embeddable card for your portfolio
/customize        — Change template, theme, tone, or content
/install-template — Install a downloaded template/theme pack
/send-to-pages   — Copy OUTPUTS to your GitHub Pages folder

What would you like to do?
```

If `.case-study/` exists in the project, also briefly report:
- How many events have been captured (read `.case-study/events.json`)
- The active template and theme (read `.case-study/config.json` if it exists, otherwise report "defaults")

If `.case-study/` doesn't exist, note that `/activate` should be run first.

---
name: csm
description: Show all Case Study Maker commands and current status.
---

Present this menu to the developer:

```
Case Study Maker
================
/case-study-maker:activate            — Start tracking this project
/case-study-maker:capture             — Capture a reflection now
/case-study-maker:auto-capture        — AI drafts reflections from conversation
/case-study-maker:review              — See what's been captured and what's missing
/case-study-maker:generate            — Generate a case study or marketing page
/case-study-maker:generate-custom     — Generate output for any custom template category
/case-study-maker:generate-portfolio-card — Generate embeddable card for your portfolio
/case-study-maker:customize           — Change template, theme, tone, or content
/case-study-maker:install-template    — Install a downloaded template/theme pack
/case-study-maker:send-to-pages       — Copy OUTPUTS to your GitHub Pages folder

What would you like to do?
```

If `.case-study/` exists in the project, also briefly report:
- How many events have been captured (read `.case-study/events.json`)
- The active template and theme (read `.case-study/config.json` if it exists, otherwise report "defaults")

If `.case-study/` doesn't exist, note that `/case-study-maker:activate` should be run first.

---
name: generate
description: Generate a case study or marketing landing page from your captured timeline.
---

Ask the developer which output to generate:

1. **Portfolio case study** — recruiter-ready page showing engineering judgment
2. **Marketing landing page** — conversion-focused product page for customers

Then ask which **tone** to use:

1. **Technical** — precise, evidence-driven, developer-focused
2. **Storytelling** — narrative arc, human, conversational
3. **Enterprise** — professional, ROI-focused, stakeholder language

Then check `.case-study/config.json` for the active template and theme. If no config exists, use the default (`starter` template, `light` theme).

Run the corresponding skill:
- Portfolio → `generate-portfolio` skill
- Marketing → `generate-marketing` skill

Pass the selected tone to the skill workflow.

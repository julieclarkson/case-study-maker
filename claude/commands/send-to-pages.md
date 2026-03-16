---
name: send-to-pages
description: Copy selected OUTPUTS to your GitHub Pages folder (docs/, repo root, or custom path).
---

Run the `send-to-pages` skill workflow.

You choose which outputs to send (portfolio, marketing, portfolio-card, or all). Only those files and their dependencies are copied — e.g. portfolio includes its CSS and the `assets/` folder (screenshots).

Configure target in `.case-study/config.json`:

```json
{
  "pagesPath": "docs"
}
```

Or specify when prompted: `docs` (same repo), `.` (repo root), or path to portfolio repo.

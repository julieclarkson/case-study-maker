---
name: activate-case-study-maker
description: Initialize case study tracking for the current project. Creates the .case-study/ directory, events.json log, and adds it to .gitignore. Use when the user says "activate case study maker", "start case study", "track this project", or "init case study".
---

# Activate Case Study Maker

Set up case study tracking for the project currently open in the IDE.

## Steps

1. Create the `.case-study/` directory in the project root.
2. Create `.case-study/events.json` with this initial content:

```json
{
  "version": 1,
  "events": []
}
```

3. Create `.case-study/media/` directory for screenshots and assets.
4. Create `.case-study/output/` directory for generated case studies.
5. Check if `.gitignore` exists. If it does, append `.case-study/` to it (if not already present). If it doesn't exist, create it with `.case-study/` as the first entry.
6. Read the git log to capture initial project context:

```bash
git log --oneline -10
```

7. Report back to the developer:
   - Confirm `.case-study/` is initialized
   - Show the recent commit history
   - Explain: "Case Study Maker is now active. I'll notice significant moments in our conversations and suggest capturing reflections and screenshots. Just keep building."

## Scope

All case study data stays inside the project folder under `.case-study/`. Nothing is written outside the project root. Generated case studies are output to `.case-study/output/` within the project.

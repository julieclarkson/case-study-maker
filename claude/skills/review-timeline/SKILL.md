---
name: review-timeline
description: "Review the case study timeline, identify gaps in documentation, and suggest what to capture next. Use when the user says 'review case study', 'what's missing', 'case study status', 'timeline check', or 'how's my case study looking'."
---

# Review Timeline

Analyze the captured case study data and identify what's strong and what needs more content.

## Workflow

1. Read `.case-study/events.json` and parse all events.
2. Get recent git log for context:

```bash
git log --oneline -20
```

3. Categorize the events:
   - **Git metadata events**: How many commits are tracked?
   - **Reflections by promptId**: Which questions have been answered? How many times?
   - **Screenshots**: How many media assets exist?
   - **Manual events**: Any imported context from other tools?
   - **Source breakdown**: Count events by `source` field (`cursor`, `claude`, `unknown`). Show this in the status report so the developer knows which IDE contributed what.

4. Check coverage against both rubrics:

**Portfolio rubric:**
- [ ] Structured reasoning (constraints, tradeoffs, risks)
- [ ] Security awareness
- [ ] Systems thinking + architecture diagram
- [ ] Iteration evidence
- [ ] Real commits and decisions

**Marketing rubric:**
- [ ] Audience and pain points defined
- [ ] Positioning and differentiation
- [ ] Key messaging / value props
- [ ] Visual proof (screenshots)
- [ ] Distribution strategy
- [ ] Narrative arc (problem > solution > results)

5. Report findings as a clear status:

```
Case Study Status for [project-name]
=====================================
Events captured: 12
  - Git commits: 5
  - Reflections: 4 (constraints, tradeoffs, risks, iteration)
  - Screenshots: 2
  - Manual: 1

Sources:
  - Cursor: 8 events
  - Claude: 4 events

Coverage:
  [x] Constraints
  [x] Tradeoffs
  [x] Risks
  [ ] Security -- No security reflection captured yet
  [x] Iteration
  [ ] Architecture diagram -- Consider adding a visual diagram

Suggestions:
  1. Add a security reflection -- you added auth middleware in commit abc1234
  2. Add an architecture diagram showing the system components
  3. Consider adding 1-2 more screenshots of the final UI
```

6. Offer to help fill gaps: "Want me to help capture a security reflection now?"

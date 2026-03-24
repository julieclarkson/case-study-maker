---
name: auto-capture
description: Automatically draft case study reflections from the current conversation context and recent git history. The AI identifies which questions are naturally answered by the discussion and drafts answers for approval. Use when the user says "auto capture", "catch up case study", "summarize for case study", or "what should we capture".
---

# Auto Capture

Draft reflection answers from conversation context without the developer having to write them manually.

## Workflow

1. Read `.case-study/events.json` to see what has already been captured.
2. Get recent git history:

```bash
git log --oneline -20
```

3. Review the current conversation for moments that answer the five reflection questions:
   - **constraints**: Platform limits, budget, tech decisions forced by circumstances
   - **tradeoffs**: "Chose X over Y" moments, architecture decisions, library choices
   - **risks**: Error handling discussions, API integrations, data concerns
   - **security**: Auth patterns, input validation, data protection discussions
   - **iteration**: Refactoring discussions, "this used to be...", design evolution

4. For each question that has new content not yet captured, draft a concise answer grounded in the actual conversation. Include specific details: commit hashes, file names, library names, decision rationale.

5. Present all drafted answers to the developer in a clear list:

```
Here's what I'd capture from our conversation:

**Tradeoffs**: You chose Express over Fastify for the server because...
**Security**: We added input validation on the /api/config endpoint because...

Want me to save these to your case study timeline?
```

6. On approval, append each as a separate event to `.case-study/events.json` using the format from the `capture-reflection` skill. Each event must include a `source` field (`"cursor"` or `"claude"`) and a 16-character hex `id`.

## Cross-IDE awareness

The developer may switch between Cursor and Claude Desktop. Both write to the same `.case-study/events.json`. Before appending:
1. Read the full events array — it will contain events from both IDEs.
2. Check for duplicates: if a reflection with the same `promptId` already exists for the same commit range, skip it regardless of which IDE created it.
3. When presenting drafts, note if the other IDE has already captured related reflections: "I see a tradeoffs reflection was captured in your Claude session — skipping that one."

## Guidelines

- Never fabricate. Only capture what was actually discussed or decided.
- Quote the developer's own words when possible.
- Skip questions that have no new relevant content.
- If a question was already answered for the same commit range, don't duplicate it — even if captured by the other IDE.
- Be specific: "Chose SQLite over Postgres because this is a single-user local tool" is better than "Made database tradeoffs."

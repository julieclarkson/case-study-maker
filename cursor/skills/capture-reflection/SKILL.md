---
name: capture-reflection
description: Capture a reflection for the case study timeline. Presents relevant questions, helps the developer articulate answers, and appends structured events to .case-study/events.json. Use when the user says "capture reflection", "add to case study", "document this decision", or when the case-study-partner rule suggests capturing.
---

# Capture Reflection

## When to use

- After a significant commit or merge
- When the developer makes an architecture or design decision
- When the case-study-partner rule identifies a relevant moment
- When the developer explicitly asks to capture a reflection

## Reflection questions

| ID | Question |
|---|---|
| `constraints` | What were the key constraints you worked within? (time, budget, tech stack, team size) |
| `tradeoffs` | What tradeoffs did you make, and why? |
| `risks` | What risks did you identify and how did you mitigate them? |
| `security` | What security considerations did you address? |
| `iteration` | How did the solution evolve through iteration? What would you do differently? |

## Workflow

1. Determine which question(s) are relevant to the current context. If unclear, ask the developer which they'd like to answer.
2. Present the question conversationally. Help the developer think through their answer by referencing recent code changes or discussion.
3. Once the developer provides an answer, confirm it with them.
4. Get the latest commit hash for context:

```bash
git log -1 --format="%H"
```

5. Read the current events log, append the new event, and write it back.

## Event format

Read `.case-study/events.json`, parse it, append to the `events` array, and write back. Each event:

```json
{
  "id": "<generate-a-uuid>",
  "timestamp": "<current-ISO-8601>",
  "type": "reflection",
  "source": "<cursor|claude>",
  "payload": {
    "promptId": "<one of: constraints, tradeoffs, risks, security, iteration>",
    "question": "<the full question text>",
    "answer": "<the developer's answer>",
    "context": {
      "relatedCommit": "<latest commit hash, if available>"
    }
  }
}
```

Generate the UUID as 16 random hex characters (e.g., `a1b2c3d4e5f6a7b8`). Use the current ISO timestamp.

**Source field**: Set `source` to `"cursor"` when running in Cursor/VS Code, or `"claude"` when running in Claude Desktop. This tracks which IDE captured the event.

## Cross-IDE awareness

Both Cursor and Claude write to the same `.case-study/events.json`. Before appending:
1. Read the full events array — it may contain events from the other IDE.
2. Check for duplicates: skip if an event with the same `promptId` already references the same `relatedCommit`.
3. Events from both IDEs are interleaved chronologically by `timestamp`.

## Important

- Always show the developer what you're about to write before writing it.
- If the events file doesn't exist, create it with `{ "version": 1, "events": [] }` first.
- Capture one question at a time. Don't batch all five unless the developer requests it.
- Keep answers concise and specific. Help the developer avoid vague generalizations.
- Only read and write files within the current project folder. Never access paths outside the project root.
- Never duplicate an event. Check existing events by `id`, or by `promptId` + `relatedCommit` combination.

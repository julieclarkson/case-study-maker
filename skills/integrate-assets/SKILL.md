---
name: integrate-assets
description: General framework for pulling assets from other Cursor plugins (Linear, Notion, etc.) into the case study. Use when the user says "pull from Linear", "add Notion docs", "import from [plugin]", or "connect [tool] to case study".
---

# Integrate Assets

Pull data and assets from other Cursor plugins into the case study timeline.

## Supported integrations

This skill works with any Cursor plugin that provides MCP tools. Common integrations:

| Plugin | What to pull | MCP tool |
|---|---|---|
| Figma | Design screenshots, component images | `get_figma_data` |
| Linear | Issue context, project milestones, sprint data | `search_issues` |
| Notion | Specs, meeting notes, decision docs | `search` |

## Workflow

1. Ask the developer which tool they want to integrate and what data to pull.
2. Check if the relevant MCP tools are available.
3. If available, use the MCP tool to fetch the data.
4. Save assets to `.case-study/media/` and append events to `.case-study/events.json`.
5. If the plugin isn't installed, explain what's needed and offer manual alternatives.

## Event format for imported assets

For screenshots and images:

```json
{
  "id": "<uuid>",
  "timestamp": "<ISO>",
  "type": "screenshot",
  "payload": {
    "filename": "<filename>",
    "caption": "<description and source>",
    "sequenceHint": <order>
  }
}
```

For context from project management tools (Linear issues, Notion docs), capture as a manual event:

```json
{
  "id": "<uuid>",
  "timestamp": "<ISO>",
  "type": "manual",
  "payload": {
    "source": "<linear|notion|other>",
    "title": "<issue or page title>",
    "summary": "<relevant content>",
    "url": "<link to original>"
  }
}
```

## Scope

All assets are saved within the project's `.case-study/` directory. Never write outside the project root.

## Graceful degradation

If a plugin isn't installed, always offer manual alternatives:
- Screenshots: save images to `.case-study/media/`
- Context: use `/capture-reflection` to manually document the information
- Links: note URLs in reflection answers for reference

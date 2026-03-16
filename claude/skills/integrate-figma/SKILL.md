---
name: integrate-figma
description: "Pull design assets from Figma into the case study timeline and media library. Requires the Figma MCP connector to be installed. Use when the user says 'add Figma designs', 'pull from Figma', 'get design assets', or 'add screenshots from Figma'."
---

# Integrate Figma

Pull design assets from Figma into the case study.

## Prerequisites

- The Figma MCP connector must be installed (provides `get_figma_data` MCP tool)
- `.case-study/` directory must exist (run `/case-study-maker:activate` first)

## Check availability

Before proceeding, verify the Figma MCP tools are available. If not, tell the developer:

"The Figma connector isn't installed. You can install it from the plugin marketplace, or add screenshots manually by placing images in `.case-study/media/`."

## Workflow (when Figma is available)

1. Ask the developer for the Figma file URL or which components they want to capture.
2. Use the Figma MCP tool (`get_figma_data`) to fetch the design data.
3. Save any exported images to `.case-study/media/` with descriptive names (e.g., `figma-homepage-design.png`, `figma-dashboard-v2.png`).
4. Append a screenshot event to `.case-study/events.json`:

```json
{
  "id": "<uuid>",
  "timestamp": "<ISO>",
  "type": "screenshot",
  "payload": {
    "filename": "<filename-in-media-dir>",
    "caption": "<description from Figma component>",
    "sequenceHint": "<order-in-timeline>"
  }
}
```

5. Report what was captured and where the files are stored.

All files are saved within the project's `.case-study/` directory. Never write outside the project root.

## Fallback (no Figma connector)

Guide the developer to manually add screenshots:

1. Take a screenshot or export from Figma
2. Save the image to `.case-study/media/`
3. Use `/case-study-maker:capture` to add context about the design

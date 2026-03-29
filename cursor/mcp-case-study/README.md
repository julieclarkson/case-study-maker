# Case Study Maker — stdio MCP server

Optional [Model Context Protocol](https://modelcontextprotocol.io) server that exposes **only** your project’s `.case-study/` data (same scope as the Case Study Maker plugin).

## Security model

| Threat | Mitigation |
|--------|------------|
| Path traversal | All file paths are built from a resolved project root + fixed names or basename regex; `realpath` checks keep `.case-study` inside the project root. |
| Command injection | No `child_process`; no shell. |
| Credential exposure | No env vars are read except `CASE_STUDY_MCP_PROJECT_ROOT` / `cwd`. Do not pass API keys to this server — it does not use them. |
| Cross-plugin trust | Only `.case-study/*` is touched; other plugins’ folders are not enumerated or read. |
| Prompt injection | Tool payloads are JSON with an explicit `_trust.classification` marker; long strings are truncated. |
| Supply chain | Dependencies are **pinned** in `package.json` + `package-lock.json`. Install with `npm ci`, not `npx -y`. |
| DoS / huge files | JSON reads are capped (see `MAX_JSON_BYTES` in `src/server.js`); event slices are bounded. |

## Install

From this directory:

```bash
npm ci
```

## Cursor configuration

Merge into **project** `.cursor/mcp.json` (or your global MCP config). Use an **absolute** path to `src/index.js` on your machine.

```json
{
  "mcpServers": {
    "case-study-maker": {
      "command": "node",
      "args": ["/absolute/path/to/case-study-maker/mcp-case-study/src/index.js"],
      "env": {
        "CASE_STUDY_MCP_PROJECT_ROOT": "/absolute/path/to/your-open-workspace"
      }
    }
  }
}
```

If your client sets the server `cwd` to the open workspace, you can omit `CASE_STUDY_MCP_PROJECT_ROOT` and the server will use `process.cwd()` — only do this when you trust the IDE to set `cwd` correctly.

**Do not** point the server at a parent directory that contains multiple projects unless you intend to share one `.case-study` tree.

## Tools

- `case_study_status` — activated? approximate event count (no raw paths).
- `case_study_read_events` — paginated `events.json` (truncated strings).
- `case_study_read_pending` — `pending.json` if present.
- `case_study_list_media` — basename + size for safe filenames under `media/`.
- `case_study_media_stat` — size for one validated media basename.
- `case_study_append_reflection` — append one reflection with schema validation + atomic write.

## License

MIT — Copyright (c) 2026 Jacobus Company LLC (dba Superfly Web Designs).

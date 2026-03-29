# Security Log — Case Study Maker

Tracks all security reviews, findings, and remediations for the Case Study Maker plugin.

---

## Review #1 — 2026-02-26

**Scope:** Full security audit against `create-security.md` framework
**Commit:** `ccb3077d`
**Reviewer:** AI-assisted (Cursor agent)
**Framework:** `03_build/secure/create-security.md` (hermetic build + agent safety)

### Findings

| ID | Severity | Area | Finding | Status |
|----|----------|------|---------|--------|
| S1-01 | **Critical** | Secrets | `.demo-maker/.env` contains live ElevenLabs API key (`ELEVENLABS_API_KEY=sk_...`). Not gitignored. | **Fixed** — added `.env` patterns to `.gitignore`; created `.env.example` with placeholder. **ACTION REQUIRED: Rotate the ElevenLabs key.** |
| S1-02 | **High** | Secrets | No `.env` entries in `.gitignore` — any `.env` file could be committed by mistake. | **Fixed** — added `.env`, `.env.*`, `.demo-maker/.env` to `.gitignore`. |
| S1-03 | **High** | Shell injection | `deploy-to-website.cjs` used `execSync()` with string-interpolated git commands (shell metachar risk). | **Fixed** — converted all `execSync` calls to `execFileSync` with argv arrays. |
| S1-04 | **High** | Shell injection | `capture-output-screenshot.js` used `spawnSync` with `shell: true` (all 4 copies: scripts/, shared/, production/cursor/, production/claude/). | **Fixed** — changed to `shell: false` in all copies. |
| S1-05 | **High** | CSP | `script-src 'unsafe-inline'` in all portfolio/marketing/pitch-deck HTML output pages. Allows any inline script if content is injected. | **Open** — requires build pipeline change (nonce/hash injection at generation time). Documented for future hardening. |
| S1-06 | **Medium** | Hardcoded path | `.demo-maker/generate-cutdowns.js` used hardcoded `/Users/julieclarkson/...` absolute path. Leaks machine layout; breaks on other machines. | **Fixed** — replaced with `path.resolve(__dirname, '..')`. |
| S1-07 | **Medium** | CSP missing | `OUTPUTS_CASE_STUDY_MAKER/index.html` and `preview-card.html` had no Content-Security-Policy. | **Fixed** — added restrictive CSP meta tags. |
| S1-08 | **Medium** | Secrets | No `.env.example` file existed despite project docs recommending one. | **Fixed** — created `.env.example` with placeholder values. |
| S1-09 | **Medium** | CSP | Marketing pages use `connect-src 'self' https:` and `form-action 'self' https:` — overly broad. | **Open** — should be tightened to specific domains when forms/fetch are added. |
| S1-10 | **Medium** | Template injection | Marketing template embeds `{{DEMO_WORKFLOW_JSON}}` inside `<script>` tag. If JSON contains `</script>`, it breaks out of the script block. | **Open** — generator should HTML-encode `</` sequences in embedded JSON. |
| S1-11 | **Medium** | Supply chain | `capture-output-screenshot.js` runs `npx -y playwright` without version pinning. No `package.json` for dependency lockdown. | **Open** — recommend adding `package.json` with pinned Playwright version. |
| S1-12 | **Medium** | Scope | `push-production.sh` uses `mktemp -d` to clone/modify repos outside project root. Intentional but crosses filesystem scope boundary. | **Accepted** — temp dir is cleaned up via `trap cleanup EXIT`. Documented risk. |
| S1-13 | **Medium** | Scope | `skills/send-to-pages/SKILL.md` allows copying outputs to arbitrary destination paths. | **Open** — skill instructs agent to confirm destination with user; enforcement depends on IDE approval. |
| S1-14 | **Low** | Scope | `build-portfolio.js` resolves templates from `cwd/..` (parent directory read). | **Open** — acceptable for plugin distribution structure; doesn't write outside project. |
| S1-15 | **Low** | CSP | Missing `base-uri`, `object-src`, `frame-ancestors` in existing CSP policies. | **Partially fixed** — added `base-uri 'none'` and `object-src 'none'` to index.html and preview-card.html. Remaining pages to be updated in next review. |
| S1-16 | **Low** | Agent perms | Rules/commands are natural-language instructions, not OS-level enforcement. Agent safety depends on IDE sandbox + user approvals. | **Accepted** — documented in README security section. User responsibility. |

### Fixes Applied

1. `.gitignore` — added comprehensive `.env` exclusion patterns
2. `.env.example` — created with placeholder for `ELEVENLABS_API_KEY`
3. `.demo-maker/generate-cutdowns.js` — replaced hardcoded path with `path.resolve(__dirname, '..')`
4. `scripts/capture-output-screenshot.js` (+ shared/ + production/cursor/ + production/claude/) — `shell: true` → `shell: false`
5. `.git-launcher/cursor/scripts/deploy-to-website.cjs` — `execSync` → `execFileSync` with argv arrays
6. `OUTPUTS_CASE_STUDY_MAKER/index.html` — added CSP meta tag
7. `OUTPUTS_CASE_STUDY_MAKER/preview-card.html` — added CSP meta tag

### Open Items (Future Reviews)

- [ ] **Rotate ElevenLabs API key** (treat current key as compromised)
- [ ] Move to CSP nonces/hashes to eliminate `'unsafe-inline'` for scripts
- [ ] HTML-encode `</` sequences in template JSON embedding
- [ ] Add `package.json` with pinned Playwright version
- [ ] Tighten marketing `connect-src` and `form-action` to specific domains
- [ ] Add `base-uri 'none'` and `object-src 'none'` to remaining output pages
- [ ] Consider adding pre-commit hook that scans for secrets patterns

### Incremental Updates

#### 2026-03-29 — stdio MCP server + MCP hardening

- **File(s):** `mcp-case-study/**`, `scripts/deploy-production.sh`, `.gitignore`, `README.md`, `production/cursor/README.md`, `production/{cursor,claude}/mcp-case-study/**`, `config/mcp.cursor.example.json`
- **Change:** Added a stdio MCP layer (`@modelcontextprotocol/sdk@1.28.0`, `zod@4.3.6` pinned) that only accesses `.case-study/` under a resolved project root: allowlisted JSON files, regex-validated media basenames, `realpath` containment checks, bounded reads, atomic writes for `events.json`, no `child_process`, no credential env usage, structured JSON responses with explicit untrusted-data marking for prompt-injection awareness. Production Cursor and Claude bundles copy `mcp-case-study/` without `node_modules` (install via `npm ci`). Documented Cursor MCP example config.
- **Severity:** Medium (new attack surface scoped to local project data; mitigated by strict path policy and pinned deps)
- **Status:** Fixed

---

## Template for Future Reviews

```
## Review #N — YYYY-MM-DD

**Scope:**
**Commit:**
**Reviewer:**

### Findings

| ID | Severity | Area | Finding | Status |
|----|----------|------|---------|--------|

### Fixes Applied

1.

### Open Items

- [ ]

### Incremental Updates

```

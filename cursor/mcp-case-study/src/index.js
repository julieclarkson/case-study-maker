#!/usr/bin/env node
/**
 * Case Study Maker — stdio MCP server entry.
 * Keep stdout JSON-RPC only; use stderr for startup errors.
 */

import { runStdioServer } from './server.js';

runStdioServer().catch((err) => {
  console.error('[mcp-case-study] fatal:', err instanceof Error ? err.message : err);
  process.exit(1);
});

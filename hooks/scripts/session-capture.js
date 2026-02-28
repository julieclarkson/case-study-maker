/**
 * Session-end hook: Scans for uncaptured reflections and writes a pending marker.
 * Runs when a Cursor session ends. Reads .case-study/events.json and recent git
 * history to identify gaps, then writes .case-study/pending.json so the next
 * session's always-on rule can prompt the developer.
 */

const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');
const { execFileSync } = require('child_process');

const cwd = process.cwd();
const caseStudyDir = join(cwd, '.case-study');
const eventsPath = join(caseStudyDir, 'events.json');
const pendingPath = join(caseStudyDir, 'pending.json');

if (!existsSync(caseStudyDir)) {
  process.exit(0);
}

let events = [];
try {
  const raw = readFileSync(eventsPath, 'utf-8');
  events = JSON.parse(raw).events || [];
} catch {
  process.exit(0);
}

const capturedPromptIds = new Set(
  events
    .filter((e) => e.type === 'reflection')
    .map((e) => e.payload.promptId)
);

const capturedCommits = new Set(
  events
    .filter((e) => e.type === 'git_metadata')
    .map((e) => e.payload.commit)
);

let recentCommits = [];
try {
  const log = execFileSync('git', ['log', '--format=%H', '-10'], { cwd, encoding: 'utf-8' });
  recentCommits = log.trim().split('\n').map((l) => l.trim()).filter(Boolean);
} catch {
  // not a git repo or git not available
}

const uncapturedCommits = recentCommits.filter((h) => !capturedCommits.has(h));

const allPromptIds = ['constraints', 'tradeoffs', 'risks', 'security', 'iteration'];
const missingPrompts = allPromptIds.filter((id) => !capturedPromptIds.has(id));

const pending = {
  timestamp: new Date().toISOString(),
  uncapturedCommits: uncapturedCommits.slice(0, 5),
  missingPrompts,
  totalEvents: events.length,
};

if (uncapturedCommits.length > 0 || missingPrompts.length > 0) {
  writeFileSync(pendingPath, JSON.stringify(pending, null, 2), 'utf-8');
}

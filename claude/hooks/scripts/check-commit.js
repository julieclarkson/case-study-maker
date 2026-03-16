/**
 * After-commit hook: Captures commit metadata to events.json and flags suggested reflections.
 * Runs after `git commit` or `git merge` (Cursor plugin hook or git post-commit).
 * 1. Appends git_metadata event to events.json (seamless background capture)
 * 2. Writes suggested reflection questions to pending.json for the Case Study Partner
 */

const { readFileSync, writeFileSync, appendFileSync, existsSync } = require('fs');
const { join } = require('path');
const { execFileSync } = require('child_process');

const cwd = process.cwd();
const caseStudyDir = join(cwd, '.case-study');
const eventsPath = join(caseStudyDir, 'events.json');
const pendingPath = join(caseStudyDir, 'pending.json');
const logPath = join(caseStudyDir, 'plugin-errors.log');

function randomId() {
  return Math.random().toString(16).slice(2, 10);
}

function logError(hookName, err) {
  if (existsSync(caseStudyDir)) {
    try {
      const entry = `[${new Date().toISOString()}] ${hookName}: ${err.message}\n${err.stack || ''}\n---\n`;
      appendFileSync(logPath, entry, 'utf-8');
    } catch (_) {}
  }
}

if (!existsSync(caseStudyDir)) {
  process.exit(0);
}

try {
  run();
} catch (err) {
  logError('check-commit', err);
  process.exit(1);
}

function run() {
  let commitHash = '';
  let commitMessage = '';
  let diffStat = '';

  try {
    commitHash = execFileSync('git', ['log', '-1', '--format=%H'], { cwd, encoding: 'utf-8' }).trim();
    commitMessage = execFileSync('git', ['log', '-1', '--format=%s'], { cwd, encoding: 'utf-8' }).trim();
    let hasParentCommit = false;
    try {
      execFileSync('git', ['rev-parse', '--verify', 'HEAD~1'], {
        cwd,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      hasParentCommit = true;
    } catch {
      hasParentCommit = false;
    }

    if (hasParentCommit) {
      diffStat = execFileSync('git', ['diff', 'HEAD~1', '--stat'], { cwd, encoding: 'utf-8' });
    } else {
      // First-commit-safe fallback (no parent commit yet)
      diffStat = execFileSync('git', ['show', '--stat', '--format=', 'HEAD'], { cwd, encoding: 'utf-8' });
    }
  } catch {
    process.exit(0);
  }

  const changedFiles = diffStat
    .split('\n')
    .map((l) => l.trim().split('|')[0]?.trim())
    .filter((f) => f && !/^\d+ files? changed/.test(f));

  const suggestedQuestions = [];

  const securityPatterns = ['auth', 'login', 'password', 'token', 'cors', 'csp', 'encrypt', 'sanitiz', 'validat', 'permission', 'session'];
  const riskPatterns = ['error', 'catch', 'retry', 'fallback', 'migrate', 'deploy', 'infra', 'external', 'api'];
  const iterationPatterns = ['refactor', 'rewrite', 'rename', 'restructur', 'v2', 'upgrade', 'deprecat'];

  const combined = (commitMessage + ' ' + changedFiles.join(' ')).toLowerCase();

  if (securityPatterns.some((p) => combined.includes(p))) {
    suggestedQuestions.push('security');
  }
  if (riskPatterns.some((p) => combined.includes(p))) {
    suggestedQuestions.push('risks');
  }
  if (iterationPatterns.some((p) => combined.includes(p))) {
    suggestedQuestions.push('iteration');
  }

  if (changedFiles.length > 5) {
    suggestedQuestions.push('tradeoffs');
  }

  // 1. Always append git_metadata to events.json (seamless background capture)
  let eventsData = { version: 1, events: [] };
  try {
    eventsData = JSON.parse(readFileSync(eventsPath, 'utf-8'));
    if (!Array.isArray(eventsData.events)) eventsData.events = [];
  } catch {
    // fresh events file
  }

  const shortHash = commitHash.slice(0, 7);
  const gitMetadataEvent = {
    id: randomId(),
    timestamp: new Date().toISOString(),
    type: 'git_metadata',
    payload: {
      commit: commitHash,
      shortHash,
      message: commitMessage,
      changedFiles,
      suggestedQuestions,
    },
  };
  eventsData.events.push(gitMetadataEvent);
  writeFileSync(eventsPath, JSON.stringify(eventsData, null, 2), 'utf-8');

  // 2. Write pending.json for Case Study Partner (when reflection questions suggested)
  if (suggestedQuestions.length === 0) {
    process.exit(0);
  }

  let existing = {};
  try {
    existing = JSON.parse(readFileSync(pendingPath, 'utf-8'));
  } catch {
    // no existing pending file
  }

  const pending = {
    ...existing,
    timestamp: new Date().toISOString(),
    latestCommit: { hash: commitHash, message: commitMessage },
    suggestedQuestions,
  };

  writeFileSync(pendingPath, JSON.stringify(pending, null, 2), 'utf-8');
}

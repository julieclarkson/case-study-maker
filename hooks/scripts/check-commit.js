/**
 * After-commit hook: Flags the latest commit for case study reflection.
 * Runs after `git commit` or `git merge` shell commands.
 * Analyzes the commit diff to suggest which reflection questions are relevant,
 * then writes to .case-study/pending.json for the always-on rule to pick up.
 */

const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');
const { execFileSync } = require('child_process');

const cwd = process.cwd();
const caseStudyDir = join(cwd, '.case-study');
const pendingPath = join(caseStudyDir, 'pending.json');

if (!existsSync(caseStudyDir)) {
  process.exit(0);
}

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
    // First-commit-safe fallback (no parent commit exists yet)
    diffStat = execFileSync('git', ['show', '--stat', '--format=', 'HEAD'], { cwd, encoding: 'utf-8' });
  }
} catch {
  process.exit(0);
}

const changedFiles = diffStat
  .split('\n')
  .map((l) => l.trim().split('|')[0]?.trim())
  .filter(Boolean);

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

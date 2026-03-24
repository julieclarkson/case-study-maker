#!/usr/bin/env node
/**
 * Capture a true full-page screenshot of an OUTPUT HTML file.
 * Uses Playwright (run: npx playwright install chromium) for full-page capture.
 * The browser MCP may only capture the visible viewport; this script captures the entire page.
 *
 * Usage:
 *   npx playwright install chromium   # first time only
 *   node scripts/capture-output-screenshot.js [path-to-html]
 *   node scripts/capture-output-screenshot.js OUTPUTS_CASE_STUDY_MAKER/portfolio_casestudymaker.html
 *
 * Output: .case-study/media/portfolio-full-page.png (or derived from filename)
 */

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const cwd = process.cwd();
const htmlPath = process.argv[2] || path.join(cwd, 'OUTPUTS_CASE_STUDY_MAKER', 'portfolio_casestudymaker.html');
const resolvedPath = path.resolve(cwd, htmlPath);

if (!fs.existsSync(resolvedPath)) {
  console.error('File not found:', resolvedPath);
  process.exit(1);
}

const base = path.basename(resolvedPath, path.extname(resolvedPath));
const outDir = path.join(cwd, '.case-study', 'media');
const outFile = `${base}-full-page.png`;
const outPath = path.join(outDir, outFile);

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const fileUrl = 'file://' + resolvedPath.replace(/\\/g, '/');

console.log('Capturing full-page screenshot...');
console.log('  Source:', resolvedPath);
console.log('  Output:', outPath);

const r = spawnSync(
  'npx',
  ['-y', 'playwright', 'screenshot', '--full-page', '--viewport-size=1280,800', fileUrl, outPath],
  { cwd, stdio: 'inherit', shell: true }
);

if (r.status !== 0) {
  console.error('Playwright failed. Run: npx playwright install chromium');
  process.exit(1);
}

console.log('Saved:', outPath);
console.log('Add to events.json or run generate with --refresh-from-git to include in portfolio.');

/**
 * Filesystem scope: only paths under a resolved project root's .case-study directory.
 * No user-supplied path segments except validated basenames (allowlist / safe regex).
 */

import fs from 'node:fs';
import path from 'node:path';

/**
 * @param {string} [rawRoot]
 * @returns {string}
 */
export function resolveProjectRoot(rawRoot) {
  const raw = rawRoot ?? process.env.CASE_STUDY_MCP_PROJECT_ROOT ?? process.cwd();
  if (typeof raw !== 'string' || raw.trim() === '') {
    throw new Error('Project root must be a non-empty path');
  }
  const resolved = path.resolve(raw);
  let real;
  try {
    real = fs.realpathSync.native ? fs.realpathSync.native(resolved) : fs.realpathSync(resolved);
  } catch {
    throw new Error('Project root does not exist or is not accessible');
  }
  const stat = fs.statSync(real);
  if (!stat.isDirectory()) {
    throw new Error('Project root must be a directory');
  }
  return real;
}

/**
 * @param {string} parentReal
 * @param {string} childReal
 * @returns {boolean}
 */
export function isPathInsideOrEqual(parentReal, childReal) {
  const rel = path.relative(parentReal, childReal);
  if (rel === '') return true;
  if (rel.startsWith('..') || path.isAbsolute(rel)) return false;
  return true;
}

/**
 * @param {string} projectRootReal
 * @returns {string | null}
 */
export function resolveCaseStudyDir(projectRootReal) {
  const joined = path.join(projectRootReal, '.case-study');
  if (!fs.existsSync(joined)) {
    return null;
  }
  let real;
  try {
    real = fs.realpathSync.native ? fs.realpathSync.native(joined) : fs.realpathSync(joined);
  } catch {
    return null;
  }
  if (!isPathInsideOrEqual(projectRootReal, real)) {
    throw new Error('.case-study resolves outside the project root — refusing to proceed');
  }
  const st = fs.statSync(real);
  if (!st.isDirectory()) {
    throw new Error('.case-study must be a directory');
  }
  return real;
}

const ALLOWED_FILES = new Set(['events.json', 'pending.json', 'plugin-errors.log']);

/**
 * @param {string} caseStudyReal
 * @param {string} basenameOnly
 * @returns {string}
 */
export function pathToAllowlistedFile(caseStudyReal, basenameOnly) {
  if (typeof basenameOnly !== 'string' || basenameOnly.includes(path.sep) || basenameOnly.includes('/') || basenameOnly.includes('\\')) {
    throw new Error('Invalid file name');
  }
  if (basenameOnly === '.' || basenameOnly === '..') {
    throw new Error('Invalid file name');
  }
  if (!ALLOWED_FILES.has(basenameOnly)) {
    throw new Error('File is not allowlisted for read');
  }
  const abs = path.resolve(path.join(caseStudyReal, basenameOnly));
  const baseResolved = path.resolve(caseStudyReal);
  if (!isPathInsideOrEqual(baseResolved, abs)) {
    throw new Error('Path escapes .case-study directory');
  }
  return abs;
}

const SAFE_MEDIA = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,254}$/;

/**
 * @param {string} name
 * @returns {string}
 */
export function assertSafeMediaBasename(name) {
  if (typeof name !== 'string' || !SAFE_MEDIA.test(name)) {
    throw new Error('Invalid media file name');
  }
  return name;
}

/**
 * @param {string} caseStudyReal
 * @param {string} basename
 * @returns {string}
 */
export function pathToMediaFile(caseStudyReal, basename) {
  assertSafeMediaBasename(basename);
  const mediaDir = path.join(caseStudyReal, 'media');
  if (!fs.existsSync(mediaDir)) {
    throw new Error('media directory does not exist');
  }
  const mediaReal = fs.realpathSync.native ? fs.realpathSync.native(mediaDir) : fs.realpathSync(mediaDir);
  if (!isPathInsideOrEqual(caseStudyReal, mediaReal)) {
    throw new Error('Invalid media directory');
  }
  const abs = path.resolve(path.join(mediaReal, basename));
  if (!fs.existsSync(abs)) {
    throw new Error('Media file not found');
  }
  const fileReal = fs.realpathSync.native ? fs.realpathSync.native(abs) : fs.realpathSync(abs);
  if (!isPathInsideOrEqual(mediaReal, fileReal)) {
    throw new Error('Path escapes media directory');
  }
  return fileReal;
}

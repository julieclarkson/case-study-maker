#!/usr/bin/env node
/**
 * Deterministic portfolio build. Consumes events.json + portfolio_data.json (or derives data),
 * applies template + snippets, outputs layered CSS (theme + layout) for swappable themes.
 *
 * Usage:
 *   node scripts/build-portfolio.js [project-slug]
 *   node scripts/build-portfolio.js --data OUTPUTS_CASE_STUDY_MAKER/portfolio_data.json
 *   node scripts/build-portfolio.js --refresh-from-git [project-slug]  # refresh commits + screenshots from git/events, then build
 *
 * Template resolution:
 *   1. .case-study/templates/portfolio/starter/
 *   2. ./templates/portfolio/starter/ (when in case-study-maker repo)
 *   3. ../templates/portfolio/starter/ (when run from scripts/)
 */

const { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync } = require('fs');
const { join, dirname, resolve, sep } = require('path');
const { execSync } = require('child_process');

const cwd = process.cwd();

function resolveTemplateDir(templateName) {
  const name = templateName || 'starter';
  const candidates = [
    join(cwd, '.case-study', 'templates', 'portfolio', name),
    join(cwd, 'templates', 'portfolio', name),
    join(cwd, '..', 'templates', 'portfolio', name),
  ];
  for (const p of candidates) {
    if (existsSync(join(p, 'template.html'))) return p;
  }
  throw new Error('Template not found. Run csm-init to copy templates to .case-study/templates/');
}

function resolveThemeDir(templateDir, themeName) {
  const candidates = [
    join(templateDir, 'themes', themeName),
    join(templateDir, '..', '..', 'themes', themeName),
    join(cwd, 'templates', 'themes', themeName),
    join(cwd, '.case-study', 'templates', 'themes', themeName),
  ];
  for (const p of candidates) {
    if (existsSync(join(p, 'variables.css'))) return p;
  }
  throw new Error(`Theme "${themeName}" not found`);
}

function sanitizeIdentifier(str) {
  if (typeof str !== 'string') return 'default';
  const safe = str.replace(/[^a-zA-Z0-9_-]/g, '');
  return safe || 'default';
}

/** Ensure path stays under dir (prevents path traversal). Returns true if child is under parent. */
function isUnderDir(childPath, parentDir) {
  const resolvedChild = resolve(childPath);
  const resolvedParent = resolve(parentDir);
  return resolvedChild === resolvedParent || resolvedChild.startsWith(resolvedParent + sep);
}

/** Valid outputBase: letters, numbers, hyphens, underscores only. Rejects path traversal. */
const OUTPUT_BASE_REGEX = /^[a-zA-Z0-9_-]+$/;

function validateOutputBase(value) {
  return typeof value === 'string' && value.length > 0 && OUTPUT_BASE_REGEX.test(value);
}

function rejectInvalidOutputBase(value, source) {
  if (!validateOutputBase(value)) {
    console.error('Invalid output base.');
    console.error('Output base must contain only letters, numbers, hyphens, and underscores.');
    console.error('Example: gitlauncher-portfolio-20260307-182345');
    if (source) console.error(`(Received from ${source})`);
    process.exit(1);
  }
}

function sanitizeHref(url) {
  if (typeof url !== 'string' || !url.trim()) return '#';
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) return '#';
  if (lower.startsWith('http://') || lower.startsWith('https://') || trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('#')) return trimmed;
  return '#';
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderSnippet(template, data) {
  let out = template;
  for (const [k, v] of Object.entries(data)) {
    out = out.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), escapeHtml(String(v ?? '')));
  }
  return out;
}

/** Extract workflow nodes and edges from architectureHero HTML. Used for Evidence section canvas animation. */
function deriveWorkflowFromArchHero(html) {
  if (!html || typeof html !== 'string') return null;
  const nodes = [];
  const layerNodeIndices = [];
  const parts = html.split(/<div class="arch-arrow"[^>]*>/);
  const colors = ['#34d399', '#60a5fa', '#a78bfa', '#f59e0b', '#10b981'];
  for (let pi = 0; pi < parts.length; pi++) {
    const part = parts[pi];
    const layerNodes = [];
    const addLabel = (label, color) => {
      const L = String(label).trim();
      if (!L) return;
      const c = color || colors[Math.min(pi, colors.length - 1)];
      nodes.push({ label: L, color: c });
      layerNodes.push(nodes.length - 1);
    };
    part.replace(/<div class="arch-node[^"]*"[^>]*>([^<]+)<\/div>/g, (_, t) => { addLabel(t, '#34d399'); });
    part.replace(/<div class="arch-group-label"[^>]*>([^<]+)<\/div>/g, (_, t) => { addLabel(t, null); });
    if (layerNodes.length) layerNodeIndices.push(layerNodes);
  }
  const edges = [];
  for (let i = 0; i < layerNodeIndices.length - 1; i++) {
    for (const a of layerNodeIndices[i]) {
      for (const b of layerNodeIndices[i + 1]) edges.push([a, b]);
    }
  }
  if (nodes.length === 0 || edges.length === 0) return null;
  return { nodes, edges };
}

/** Refresh data.commits from git log and data.screenshots from OUTPUTS_CASE_STUDY_MAKER/assets. Writes back to dataPath. */
function refreshFromGitAndEvents(data, dataPath) {
  const eventsPath = join(cwd, '.case-study', 'events.json');
  const assetsDir = join(cwd, 'OUTPUTS_CASE_STUDY_MAKER', 'assets');
  const outAssets = join(cwd, 'OUTPUTS_CASE_STUDY_MAKER', 'assets');

  // 1. Refresh commits from git
  try {
    const logOut = execSync('git log --oneline -30 --format=\'{"hash":"%h","message":"%s","date":"%ad"}\' --date=short', {
      encoding: 'utf-8',
      cwd,
    });
    const commits = logOut
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch (_) {
          return null;
        }
      })
      .filter(Boolean);
    data.commits = commits;
  } catch (err) {
    console.warn('Could not run git log; keeping existing commits.');
  }

  // 2. Refresh screenshots from OUTPUTS_CASE_STUDY_MAKER/assets only (source of truth). Captions from events when matched.
  const screenshots = [];
  const captionByFile = {};
  if (existsSync(eventsPath)) {
    const eventsRaw = readFileSync(eventsPath, 'utf-8');
    const eventsData = JSON.parse(eventsRaw);
    const events = eventsData.events || [];
    for (const ev of events.filter((e) => e.type === 'screenshot')) {
      const fn = ev.payload?.filename || ev.payload?.file || '';
      const caption = ev.payload?.caption || ev.payload?.alt || '';
      const basename = fn ? fn.replace(/^.*[\\/]/, '') : '';
      if (basename) captionByFile[basename.toLowerCase()] = caption;
    }
  }
  const assetFiles = existsSync(assetsDir)
    ? readdirSync(assetsDir)
      .filter((f) => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f))
      .sort()
    : [];
  for (const f of assetFiles) {
    screenshots.push({ file: 'assets/' + f, caption: captionByFile[f.toLowerCase()] || '' });
  }
  const MAX_SCREENSHOTS = 12;
  data.screenshots = screenshots.length ? screenshots.slice(0, MAX_SCREENSHOTS) : data.screenshots;

  writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

function main() {
  const args = process.argv.slice(2);
  let dataPath = null;
  let projectSlug = null;
  let outputBase = null;
  let refreshFromGit = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--data' && args[i + 1]) {
      dataPath = args[++i];
    } else if (args[i] === '--output-base' && args[i + 1]) {
      outputBase = args[++i];
    } else if (args[i] === '--refresh-from-git') {
      refreshFromGit = true;
    } else if (!args[i].startsWith('-')) {
      projectSlug = args[i];
    }
  }

  if (!dataPath) {
    const slugForPath = sanitizeIdentifier(projectSlug || 'default');
    dataPath = join(cwd, 'OUTPUTS_CASE_STUDY_MAKER', `portfolio_data_${slugForPath}.json`);
    if (!existsSync(dataPath)) {
      dataPath = join(cwd, 'OUTPUTS_CASE_STUDY_MAKER', 'portfolio_data.json');
    }
  }
  if (dataPath && !isUnderDir(resolve(cwd, dataPath), cwd)) {
    console.error('Security: --data path must stay within project directory.');
    process.exit(1);
  }
  if (!existsSync(dataPath)) {
    console.error('Usage: node scripts/build-portfolio.js [project-slug]');
    console.error('       node scripts/build-portfolio.js --data path/to/portfolio_data.json');
    console.error('No portfolio_data.json found. Generate it first with /generate-portfolio or /generate-case-study.');
    process.exit(1);
  }

  const raw = readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(raw);

  if (refreshFromGit) {
    refreshFromGitAndEvents(data, resolve(cwd, dataPath));
  }

  projectSlug = sanitizeIdentifier(projectSlug || data.projectSlug || data.projectName?.toLowerCase().replace(/\s+/g, '') || 'default');
  const theme = sanitizeIdentifier(data.theme || 'default');
  const templateName = sanitizeIdentifier(data.template || 'starter');

  // Output base: explicit (CLI), from data, or legacy. Reject invalid values (no path traversal).
  if (!outputBase && data.outputBase) {
    outputBase = String(data.outputBase).trim();
  }
  if (!outputBase) {
    const ts = execSync('date +%Y%m%d-%H%M%S', { encoding: 'utf-8' }).trim();
    outputBase = `${projectSlug}-portfolio-${ts}`;
  } else {
    rejectInvalidOutputBase(outputBase, '--output-base or portfolio_data.json');
  }

  const templateDir = resolveTemplateDir(templateName);
  const snippetsDir = join(templateDir, 'snippets');
  const constraintTpl = readFileSync(join(snippetsDir, 'constraint-card.html'), 'utf-8');
  const tradeoffTpl = readFileSync(join(snippetsDir, 'tradeoff-card.html'), 'utf-8');
  const riskTpl = readFileSync(join(snippetsDir, 'risk-card.html'), 'utf-8');
  const securityTpl = readFileSync(join(snippetsDir, 'security-card.html'), 'utf-8');

  const constraintsSection = (data.constraints || []).map((c) =>
    renderSnippet(constraintTpl, { TITLE: c.title, DESCRIPTION: c.description })
  ).join('\n');
  const tradeoffsSection = (data.tradeoffs || []).map((t) =>
    renderSnippet(tradeoffTpl, {
      DECISION: t.decision,
      RATIONALE: t.rationale,
      ALTERNATIVE: t.alternative ?? '',
    })
  ).join('\n');
  const risksSection = (data.risks || []).map((r) =>
    renderSnippet(riskTpl, { RISK: r.risk, MITIGATION: r.mitigation })
  ).join('\n');
  const securitySection = (data.security || []).map((s) =>
    renderSnippet(securityTpl, { CONCERN: s.concern, APPROACH: s.approach })
  ).join('\n');

  const benefitsHtml = (data.benefitsHtml || '').trim();
  const navBenefitsLink = benefitsHtml ? '<a href="#benefits">Why &amp; What</a>' : '';
  const benefitsSection = benefitsHtml
    ? `<section id="benefits" class="section-alt reveal">
    <div class="section-label">Why &amp; What It Delivers</div>
    <h2>Why &amp; What It Delivers</h2>
    <div class="benefits-content">${benefitsHtml}</div>
  </section>`
    : '';

  let html = readFileSync(join(templateDir, 'template.html'), 'utf-8');
  const subs = {
    PROJECT_NAME: data.projectName ?? 'Project',
    PROJECT_SLUG: projectSlug,
    OUTPUT_BASE: outputBase,
    SUMMARY: data.summary ?? '',
    DATE_RANGE: data.dateRange ?? '',
    ROLE: data.role ?? '',
    HOME_URL: sanitizeHref(data.homeUrl ?? '/'),
    REPO_URL: sanitizeHref(data.repoUrl ?? '#'),
    REPO_LABEL: data.repoLabel ?? 'View repo',
    BADGE: data.badge ?? '',
    THEME: theme,
    ARCHITECTURE_HERO: data.architectureHero ?? '',
    NAV_BENEFITS_LINK: navBenefitsLink,
    BENEFITS_SECTION: benefitsSection,
    ROLE_HTML: data.roleHtml ?? '',
    CONSTRAINTS_SECTION: constraintsSection,
    TRADEOFFS_SECTION: tradeoffsSection,
    RISKS_SECTION: risksSection,
    SECURITY_SECTION: securitySection,
    ARCHITECTURE_HTML: data.architectureHtml ?? '',
    ITERATION_LEAD: data.iterationLead ?? '',
  };

  for (const [k, v] of Object.entries(subs)) {
    html = html.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v ?? ''));
  }

  const timeline = data.timeline || [];
  const commits = data.commits || [];
  const screenshots = (data.screenshots || []).map((s) => {
    let file = typeof s === 'string' ? s : (s.file || s.path || '');
    if (typeof file !== 'string') file = '';
    const fileLower = file.trim().toLowerCase();
    if (fileLower.startsWith('javascript:') || fileLower.startsWith('data:') || fileLower.startsWith('vbscript:')) file = '';
    if (file && !/^assets\//.test(file) && !/^\.\/assets\//.test(file)) file = 'assets/' + file.replace(/^\.\//, '').replace(/^.*[\\/]/, '');
    return { file: file || 'assets/placeholder.png', caption: typeof s === 'string' ? '' : (s.caption || s.alt || '') };
  });

  let workflowDiagram = data.productFlow || data.workflowDiagram || null;
  if (!workflowDiagram && data.architectureHero) {
    workflowDiagram = deriveWorkflowFromArchHero(data.architectureHero);
  }
  const dataScript = `<script>window.DATA=${JSON.stringify({ timeline, commits, screenshots, workflowDiagram: workflowDiagram || null })};</script>`;
  const templateJs = readFileSync(join(templateDir, 'template.js'), 'utf-8');
  html = html.replace(
    '<script src="template.js"></script>',
    dataScript + '\n  <script>' + templateJs + '</script>'
  );

  const themeDir = resolveThemeDir(templateDir, theme);
  let layoutCss = readFileSync(join(templateDir, 'template.css'), 'utf-8');
  layoutCss = layoutCss.replace(/@import\s+["'][^"']+["']\s*;\s*\n?/g, '');

  const outDir = join(cwd, 'OUTPUTS_CASE_STUDY_MAKER');
  const themesOutDir = join(outDir, 'themes', theme);
  mkdirSync(themesOutDir, { recursive: true });

  const htmlPath = join(outDir, `${outputBase}.html`);
  const cssPath = join(outDir, `${outputBase}.css`);
  const varsPath = join(themesOutDir, 'variables.css');

  if (!isUnderDir(htmlPath, outDir) || !isUnderDir(cssPath, outDir)) {
    console.error('Security: resolved output paths would escape OUTPUTS_CASE_STUDY_MAKER/ directory. Aborting.');
    process.exit(1);
  }

  writeFileSync(htmlPath, html, 'utf-8');
  writeFileSync(cssPath, layoutCss, 'utf-8');
  copyFileSync(join(themeDir, 'variables.css'), varsPath);

  console.log('Build complete:');
  console.log(`  ${htmlPath}`);
  console.log(`  ${cssPath}`);
  console.log(`  ${varsPath}`);
}

main();

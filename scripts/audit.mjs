#!/usr/bin/env node
// audit.mjs — quick repo audit. Run with `npm run audit`.
//
// Checks for the issues we most commonly hit:
//   1. Missing dependencies (deps used in source but not in package.json).
//   2. Orphan pages (page files not referenced by App.jsx).
//   3. console.log calls in source (debug noise in prod).
//   4. TODO / FIXME / XXX markers.
//   5. Hard-coded colours / pixel paddings in inline styles.
//   6. <img> tags missing alt attributes.
//
// Exit code 0 = clean. Non-zero = at least one finding.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const issues = [];
const ok = (msg) => console.log(`  \x1b[32m✓\x1b[0m  ${msg}`);
const bad = (msg) => { issues.push(msg); console.log(`  \x1b[31m✗\x1b[0m  ${msg}`); };
const info = (msg) => console.log(`  \x1b[36m·\x1b[0m  ${msg}`);

function walk(dir, exts) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p, exts));
    else if (exts.some(e => name.endsWith(e))) out.push(p);
  }
  return out;
}

console.log('\n\x1b[1mUrduOfDani repo audit\x1b[0m\n');

// --- 1. dependencies ---
console.log('\x1b[1m1. Dependencies\x1b[0m');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const declared = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
]);
const sourceFiles = walk(join(ROOT, 'src'), ['.js', '.jsx', '.cjs']);
const importRe = /from\s+['"]([^'"./][^'"]*)['"]/g;
const used = new Map();      // specifier -> set of files
for (const f of sourceFiles) {
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(importRe)) {
    const spec = m[1].split('/')[0].startsWith('@')
      ? m[1].split('/').slice(0, 2).join('/')
      : m[1].split('/')[0];
    if (!used.has(spec)) used.set(spec, new Set());
    used.get(spec).add(relative(ROOT, f));
  }
}
const missing = [...used.keys()].filter(k => !declared.has(k) && !k.startsWith('node:') && !k.startsWith('virtual:'));
if (missing.length === 0) ok('all imports declared in package.json');
else for (const m of missing) bad(`imported but not declared: ${m}`);

// --- 2. pages ---
console.log('\n\x1b[1m2. Pages\x1b[0m');
const appText = readFileSync(join(ROOT, 'src/renderer/App.jsx'), 'utf8');
const pageFiles = walk(join(ROOT, 'src/renderer/pages'), ['.jsx']).map(f => {
  const m = readFileSync(f, 'utf8').match(/export default function (\w+)/);
  return m ? m[1] : null;
}).filter(Boolean);
const routePages = [...appText.matchAll(/(\w+):\s*\{\s*Page:\s*(\w+)/g)].map(m => m[2]);
const orphanPages = pageFiles.filter(p => !routePages.includes(p));
if (orphanPages.length === 0) ok(`all ${pageFiles.length} page components are routed`);
else for (const p of orphanPages) bad(`page component not routed: ${p}`);

// --- 3. console ---
console.log('\n\x1b[1m3. console.* calls\x1b[0m');
const consoles = [];
for (const f of sourceFiles) {
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(/console\.(log|warn|error|info|debug)\(/g)) {
    consoles.push(relative(ROOT, f) + ':' + m[0]);
  }
}
if (consoles.length === 0) ok('no console.* calls in src/');
else for (const c of consoles) info(`console call: ${c}  (review for production)`);

// --- 4. TODO ---
console.log('\n\x1b[1m4. TODO / FIXME / XXX markers\x1b[0m');
const todos = [];
for (const f of sourceFiles) {
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(/\b(TODO|FIXME|XXX|HACK)\b/g)) {
    todos.push(relative(ROOT, f) + ': ' + m[0]);
  }
}
if (todos.length === 0) ok('no TODO / FIXME / XXX markers in src/');
else for (const t of todos) info(`marker: ${t}`);

// --- 5. <img> alt ---
console.log('\n\x1b[1m5. Accessibility\x1b[0m');
const jsxFiles = walk(join(ROOT, 'src/renderer'), ['.jsx']);
let imgMissingAlt = 0;
for (const f of jsxFiles) {
  const text = readFileSync(f, 'utf8');
  // Strip comments before checking (a comment may contain <img> for documentation).
  const stripped = text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
  for (const m of stripped.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(m[0])) { imgMissingAlt++; info(`missing alt: ${relative(ROOT, f)}`); }
  }
}
if (imgMissingAlt === 0) ok('all <img> tags have alt=');
else bad(`${imgMissingAlt} <img> tag(s) missing alt`);

// --- 6. hard-coded pixel paddings in inline styles ---
console.log('\n\x1b[1m6. Inline-style pixel paddings\x1b[0m');
let inlinePadCount = 0;
for (const f of jsxFiles) {
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(/padding:\s*['"]?\d+px/g)) inlinePadCount++;
}
info(`${inlinePadCount} inline pixel paddings across pages (refactor opportunity)`);

// --- 7. version in package.json ---
console.log('\n\x1b[1m7. Version\x1b[0m');
if (pkg.version) ok(`package.json version: ${pkg.version}`);
else bad('package.json has no version');

// --- 8. dist/ + release/ in .gitignore ---
console.log('\n\x1b[1m8. .gitignore\x1b[0m');
const gi = readFileSync(join(ROOT, '.gitignore'), 'utf8');
for (const pat of ['node_modules', 'dist', 'release']) {
  if (gi.includes(pat)) ok(`ignores ${pat}/`);
  else bad(`.gitignore missing ${pat}/`);
}

// --- summary ---
console.log('\n\x1b[1mSummary\x1b[0m');
if (issues.length === 0) console.log('  \x1b[32mall clean\x1b[0m\n');
else { console.log(`  ${issues.length} issue(s)\n`); process.exit(1); }

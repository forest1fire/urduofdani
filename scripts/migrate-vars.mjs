#!/usr/bin/env node
// scripts/migrate-vars.mjs — replace legacy design tokens with the new
// semantic aliases.  This is a one-time migration; the old names are kept
// as backward-compat shims in tokens.css, so this script is not strictly
// required — but it ensures pages use the canonical names.
//
// Mapping (old → new):
//   --emerald-500  → --color-primary
//   --emerald-600  → --color-primary-hover
//   --emerald-50   → --color-primary-soft
//   --emerald-100  → --color-primary-soft
//   --navy-900     → --color-text
//   --navy-700     → --color-text-strong  (kept for hovers)
//   --slate-500    → --color-text-muted
//   --slate-300    → --color-text-subtle
//   --slate-100    → --color-border
//   --slate-200    → --color-border
//   --slate-50     → --color-bg-sunken
//   --ivory-50     → --color-bg-sunken
//   --info-500     → --color-info
//   --info-50      → --color-info-soft
//   --warning-500  → --color-warning
//   --danger-500   → --color-danger
//   --font-urdu    → (kept — same name)

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url)) + '/..';

const MAP = [
  // Be careful with order: longer / more specific patterns first.
  // emerald
  [/--emerald-600\b/g, '--color-primary-hover'],
  [/--emerald-500\b/g, '--color-primary'],
  [/--emerald-700\b/g, '--color-primary-active'],
  [/--emerald-50\b/g,  '--color-primary-soft'],
  [/--emerald-100\b/g, '--color-primary-soft'],
  [/--emerald-400\b/g, '--color-primary-soft'],
  // navy
  [/--navy-900\b/g, '--color-text'],
  [/--navy-700\b/g, '--color-text-strong'],
  [/--navy-500\b/g, '--color-text-muted'],
  [/--navy-100\b/g, '--color-primary-soft'],
  // slate
  [/--slate-900\b/g, '--color-text'],
  [/--slate-700\b/g, '--color-text-muted'],
  [/--slate-500\b/g, '--color-text-muted'],
  [/--slate-400\b/g, '--color-text-subtle'],
  [/--slate-300\b/g, '--color-text-subtle'],
  [/--slate-200\b/g, '--color-border'],
  [/--slate-100\b/g, '--color-border'],
  [/--slate-50\b/g,  '--color-bg-sunken'],
  // ivory
  [/--ivory-50\b/g,  '--color-bg-sunken'],
  [/--ivory-100\b/g, '--color-bg-sunken'],
  [/--ivory-200\b/g, '--color-border'],
  // status
  [/--info-500\b/g,    '--color-info'],
  [/--info-50\b/g,     '--color-info-soft'],
  [/--warning-500\b/g, '--color-warning'],
  [/--warning-50\b/g,  '--color-warning-soft'],
  [/--danger-500\b/g,  '--color-danger'],
  [/--danger-50\b/g,   '--color-danger-soft'],
];

function walk(dir) {
  const out = [];
  for (const n of readdirSync(dir)) {
    if (n === 'node_modules' || n.startsWith('.')) continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.jsx') || p.endsWith('.js') || p.endsWith('.css')) out.push(p);
  }
  return out;
}

let totalFiles = 0, totalSubs = 0;
for (const f of walk(join(ROOT, 'src/renderer'))) {
  let text = readFileSync(f, 'utf8');
  let before = text;
  let count = 0;
  for (const [re, repl] of MAP) {
    text = text.replace(re, () => { count++; return repl; });
  }
  if (text !== before) {
    writeFileSync(f, text);
    totalFiles++;
    totalSubs += count;
    console.log(`✓ ${f.replace(ROOT + '/', '')}  (${count} subs)`);
  }
}
console.log(`\nTouched ${totalFiles} files, ${totalSubs} substitutions total.`);

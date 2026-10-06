#!/usr/bin/env node
// copy-assets.mjs — copy brand assets into dist/ so the renderer can load
// them at runtime (Vite only copies files it imports as modules; static
// brand files in brands/ need a separate step).
//
// Run automatically as part of `npm run build`. Can also be run alone:
//   node scripts/copy-assets.mjs

import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url)) + '/..';
const DIST = join(ROOT, 'dist');

if (!existsSync(DIST)) {
  console.error(`[copy-assets] dist/ not found at ${DIST} — run 'npm run build' first.`);
  process.exit(1);
}

const targets = [
  { from: 'brands',  to: 'brands',  desc: 'brand PNGs (icon, wordmark, DaniLabs)' },
  { from: 'samples', to: 'samples', desc: 'sample .udaniplugin packages' },
  { from: 'plugins', to: 'plugins', desc: 'plugin developer docs' },
];

for (const t of targets) {
  const from = join(ROOT, t.from);
  const to   = join(DIST, t.to);
  if (!existsSync(from)) {
    console.log(`[copy-assets] skip ${t.from}/ (not present)`);
    continue;
  }
  mkdirSync(to, { recursive: true });
  cpSync(from, to, { recursive: true });
  console.log(`[copy-assets] copied ${t.from}/ -> dist/${t.to}/  (${t.desc})`);
}

console.log('[copy-assets] done.');

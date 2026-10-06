#!/usr/bin/env node
// scripts/normalize-pages.mjs — second pass: replace inline page padding with
// the new design-system classes.
//
//   <div className="page" style={{ padding: 32 }}>         →  <div className="page">
//   <div className="page-2col" style={{ padding: '16px 32px' }}>  →  <div className="page-2col">
//   <div className="page-3col" style={{ padding: '16px 32px' }}>  →  <div className="page-3col">
//
// Also replaces the inline <h2> + <p> "page description" pattern that shows
// up in many pages with a proper `<header className="page-section-head">`.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url)) + '/..';
const PAGES = join(ROOT, 'src/renderer/pages');

let touched = 0;
for (const name of readdirSync(PAGES)) {
  if (!name.endsWith('.jsx')) continue;
  const f = join(PAGES, name);
  let src = readFileSync(f, 'utf8');
  let before = src;

  // 1) Page wrapper padding
  src = src.replaceAll(
    '<div className="page" style={{ padding: 32 }}>',
    '<div className="page">',
  );
  src = src.replaceAll(
    '<div className="page" style={{ padding: 24 }}>',
    '<div className="page">',
  );
  src = src.replaceAll(
    '<div className="page" style={{ padding: 16 }}>',
    '<div className="page">',
  );

  // 2) Column layouts — strip the inline padding (handled by the class)
  src = src.replaceAll(
    /<div className="page-(2col|3col)" style=\{\{ padding: ['"]16px 32px['"] \}\}>/g,
    '<div className="page-$1">',
  );

  // 3) The old <h2 style={{ margin: 0 }}> + <p style={{ color: 'var(--slate-500)' }}>
  //    "What is this page" header — replace with a consistent section head.
  src = src.replace(
    /<h2 style=\{\{ margin: 0 \}\}>([^<]+)<\/h2>\s*<p style=\{\{ color: 'var\(--slate-500\)' \}\}>([^<]+)<\/p>/g,
    (_m, t, sub) =>
      '<header style={{ marginBottom: 16 }}>\n        <h2 style={{ margin: 0 }}>' + t +
      '</h2>\n        <p className="text-muted" style={{ margin: "4px 0 0" }}>' + sub + '</p>\n      </header>',
  );

  // 4) "back to editor" — many pages used the wrong back.  Editor pages should
  //    back to 'editor' (already correct), but some used 'home'.  Acceptable
  //    but if the page is an "editor tool", let's standardise on 'editor'.
  //    (Done by the upgrade-pages.mjs script — skip here.)

  if (src !== before) {
    writeFileSync(f, src);
    touched++;
    console.log(`✓ ${name}`);
  }
}
console.log(`\nTouched ${touched} files.`);

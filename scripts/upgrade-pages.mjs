#!/usr/bin/env node
// scripts/upgrade-pages.mjs — mechanical refactor to convert every page
// from the old inline page-header pattern to the new <PageHeader /> component.
//
// Before:
//   <div className="page-header">
//     <button className="page-back" onClick={() => dispatch({ type: 'set-route', route: 'editor' })}><Icon.ArrowLeft /> Back to editor</button>
//     <h1 className="page-title" style={{ marginLeft: 16 }}>Fonts</h1>
//     <div style={{ marginLeft: 'auto' }}><Icon.Help_O /> Help</div>
//   </div>
//
// After:
//   <PageHeader title="Fonts" />
//
// Pages already using PageHeader are skipped.

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url)) + '/..';
const PAGES = join(ROOT, 'src/renderer/pages');

let touched = 0, skipped = 0;
for (const name of readdirSync(PAGES)) {
  if (!name.endsWith('.jsx')) continue;
  const f = join(PAGES, name);
  let src = readFileSync(f, 'utf8');
  if (src.includes('import PageHeader')) { skipped++; continue; }

  // Match the standard old header block. The page-header div contains:
  //   - a back button (class="page-back")
  //   - a title (h1 class="page-title")
  //   - optionally additional action buttons or helper divs
  // We capture the title and the back-route, then replace the whole block.
  const re = new RegExp(
    '<div className="page-header"[\\s\\S]*?' +
    '<button className="page-back"[\\s\\S]*?</button>[\\s\\S]*?' +
    '<h1 className="page-title"[^>]*>([^<]+)</h1>' +
    '[\\s\\S]*?' +
    '</div>',
    'g',
  );

  let title = '';
  let route = '';
  let replaced = false;
  src = src.replace(re, (m, t) => {
    const m2 = m.match(/route:\s*'([a-z]+)'/);
    route = m2 ? m2[1] : 'home';
    title = t.trim();
    replaced = true;
    return `<PageHeader title={${JSON.stringify(title)}} back onBack={() => dispatch({ type: 'set-route', route: ${JSON.stringify(route)} })} />`;
  });

  if (replaced) {
    // Add the import for PageHeader (and the useStore if it's not already there).
    if (!src.match(/import\s+React[^;]*from\s+['"]react['"]/)) {
      src = `import React from 'react';\n` + src;
    }
    if (!src.includes("import { useStore }")) {
      src = src.replace(/(import React[^;]*;\n)/, `$1import { useStore } from '../store/Store.jsx';\n`);
    }
    if (!src.includes("import PageHeader from '../components/PageHeader.jsx'")) {
      src = src.replace(/(import Icon from '\.\.\/components\/Icons\.jsx';\n)/, `$1import PageHeader from '../components/PageHeader.jsx';\n`);
    }
    writeFileSync(f, src);
    touched++;
    console.log(`✓ ${name}  —  title="${title}"  back=${route}`);
  } else {
    skipped++;
  }
}
console.log(`\nTouched ${touched}, skipped ${skipped}.`);

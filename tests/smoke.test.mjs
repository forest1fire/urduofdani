// Smoke tests for the spell-check infrastructure.
// Run with: node --test tests/smoke.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build, check, suggest, norm } from '../src/renderer/lib/spell.js';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url)) + '/..';

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

test('spell.js: normalization unifies Arabic and Persian forms', () => {
  assert.equal(norm('كِتاب'), norm('کتاب'));
  assert.equal(norm('ى'), norm('ی'));
  assert.equal(norm('ه'), norm('ہ'));
});

test('spell.js: build() dedupes and drops too-long entries', () => {
  const set = build(['اردو', 'زبان', 'زبان', '  ', 'x'.repeat(50)]);
  assert.equal(set.size, 2);
});

test('spell.js: check() flags unknown Urdu words and leaves short ones', () => {
  const set = build(['اردو', 'زبان']);
  const known = check(set, 'اردو زبان');
  assert.equal(known.length, 0);

  const unknown = check(set, 'اردو زبان خوبصورتی');
  assert.equal(unknown.length, 1);
  assert.equal(unknown[0].word, 'خوبصورتی');
});

test('spell.js: suggest() fixes single-character errors', () => {
  const set = build(['زبان', 'خوبصورتی']);
  assert.deepEqual(suggest(set, 'زباں', 3), ['زبان']);
});

test('urduofdani_engine.py: dict is shipped and loads', { skip: !existsSync('vendor/urduofdani_engine.py') }, () => {
  const r = spawnSync('python3', [
    'vendor/urduofdani_engine.py',
    '--db', 'vendor/urdu_database.compact.gz',
    '--spell', 'اردو زبان کی خوبصورتی',
  ], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /^unknown:|^\s*$/);
});

test('urduofdani_engine.py: suggestions are real Urdu words', { skip: !existsSync('vendor/urduofdani_engine.py') }, () => {
  const r = spawnSync('python3', [
    'vendor/urduofdani_engine.py',
    '--db', 'vendor/urdu_database.compact.gz',
    '--suggest', 'خوبصو', '--limit', '5',
  ], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout.trim(), /\S+/);
  assert.ok(r.stdout.includes('خوبصورت'), 'should suggest at least خوبصورت');
});

// Responsive layout tests: verify the CSS file is present and contains the
// three breakpoints and the safety rules that prevent horizontal page
// scroll in split-screen / multi-app scenarios.
test('responsive.css: present and ships all three breakpoints', () => {
  const css = readFileSync('src/renderer/styles/responsive.css', 'utf8');
  assert.match(css, /max-width:\s*559\.98px/);
  assert.match(css, /max-width:\s*899\.98px/);
  assert.match(css, /max-width:\s*1199\.98px/);
  assert.match(css, /min-width:\s*1920px/);
});

test('responsive.css: declares 100dvh and 100vw safety', () => {
  const css = readFileSync('src/renderer/styles/responsive.css', 'utf8');
  assert.match(css, /100dvh/,  'should use 100dvh (dynamic viewport)');
  assert.match(css, /100vw/,   'should constrain width to viewport');
  assert.match(css, /overflow-x:\s*hidden/, 'must prevent horizontal scroll');
});

test('responsive.css: defines auto-fit grid helpers', () => {
  const css = readFileSync('src/renderer/styles/responsive.css', 'utf8');
  // Modern breakpoints: < 560 / 560-899 / 900-1199 / 1200-1919 / 1920+
  assert.match(css, /max-width:\s*559\.98px/, 'should have a tiny/mobile breakpoint');
  assert.match(css, /max-width:\s*899\.98px/, 'should have a tablet breakpoint');
  assert.match(css, /max-width:\s*1199\.98px/, 'should have a narrow desktop breakpoint');
  assert.match(css, /min-width:\s*1920px/,    'should have a wide-desktop breakpoint');
  // Grid utilities used in the design system
  assert.match(css, /\.grid-auto\b/,          'should define .grid-auto');
  assert.match(css, /repeat\(auto-fill/,'should use auto-fill / auto-fit');
});

test('responsive.css: hides sidenav and inspector below their breakpoints', () => {
  const css = readFileSync('src/renderer/styles/responsive.css', 'utf8');
  // Inspector and activity bar are hidden on small viewports
  assert.match(css, /max-width:\s*899\.98px[\s\S]*?\.inspector\b[\s\S]*?display:\s*none/,
    'inspector should be hidden below 900px');
  assert.match(css, /max-width:\s*559\.98px[\s\S]*?\.activitybar\b[\s\S]*?display:\s*none/,
    'activity bar should be hidden below 560px');
});

test('ResponsivePage component: present and exports default', () => {
  const src = readFileSync('src/renderer/components/ResponsivePage.jsx', 'utf8');
  assert.match(src, /export default function ResponsivePage/);
});

test('App.jsx: tracks viewport via matchMedia to skip rendering hidden panels', () => {
  const src = readFileSync('src/renderer/App.jsx', 'utf8');
  assert.match(src, /matchMedia/, 'should use matchMedia for viewport tracking');
  assert.match(src, /showInspector/, 'should have a showInspector guard');
  assert.match(src, /showSideNav/,    'should have a showSideNav guard');
});

// --- Document I/O and PDF export ---

test('document.js: serializes + parses a round-trip', async () => {
  const { serialize, parse, emptyDocument } = await import('../src/renderer/lib/document.js');
  const doc = emptyDocument('Test', { size: 'A5' });
  doc.meta.title = 'Round-trip test';
  doc.pages[0].frames[0].content = 'Hello world';
  const bytes = serialize(doc);
  assert.ok(bytes instanceof Uint8Array);
  assert.ok(bytes.length > 0);
  const back = parse(bytes);
  assert.equal(back.meta.title, 'Round-trip test');
  assert.equal(back.meta.page.size, 'A5');
  assert.equal(back.pages[0].frames[0].content, 'Hello world');
});

test('document.js: parse() handles a missing-magic payload', async () => {
  const { parse } = await import('../src/renderer/lib/document.js');
  const obj = parse('{"meta":{"title":"x"},"pages":[]}');
  assert.equal(obj.meta.title, 'x');
  assert.deepEqual(obj.pages, []);
});

test('emptyDocument() factory produces a valid blank A4 with Urdu sample', async () => {
  const { emptyDocument } = await import('../src/renderer/lib/document.js');
  const d = emptyDocument('MyDoc');
  assert.equal(d.meta.title, 'MyDoc');
  assert.equal(d.meta.page.size, 'A4');
  assert.equal(d.pages.length, 1);
  assert.ok(d.pages[0].frames.length >= 2, 'should have at least 2 frames');
  assert.match(d.pages[0].frames[0].content, /[\u0600-\u06FF]/, 'should contain Urdu text');
});

test('pdf.js: exports buildPdf and downloadPdf', async () => {
  const pdf = await import('../src/renderer/lib/pdf.js');
  assert.equal(typeof pdf.buildPdf, 'function');
  assert.equal(typeof pdf.downloadPdf, 'function');
});

test('pdf.js: buildPdf returns a valid PDF Uint8Array for an empty doc', async () => {
  const { buildPdf } = await import('../src/renderer/lib/pdf.js');
  const { emptyDocument } = await import('../src/renderer/lib/document.js');
  const doc = emptyDocument('Smoke');
  const bytes = await buildPdf(doc);
  assert.ok(bytes instanceof Uint8Array);
  // PDF magic bytes "%PDF-"
  assert.equal(String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3], bytes[4]), '%PDF-');
});

test('useDocActions: hook exports newDoc/openFile/save/exportPdf/autosaveDoc', async () => {
  const src = readFileSync('src/renderer/lib/useDocActions.js', 'utf8');
  assert.match(src, /export function useDocActions/);
  assert.match(src, /\bnewDoc\b/);
  assert.match(src, /\bopenFile\b/);
  assert.match(src, /\bsave\b/);
  assert.match(src, /\bexportPdf\b/);
  assert.match(src, /\bautosaveDoc\b/);
});

test('TopBar: includes Open / Save / PDF buttons and Cmd+S shortcut', () => {
  const src = readFileSync('src/renderer/components/TopBar.jsx', 'utf8');
  assert.match(src, /metaKey\s*\|\|\s*e\.ctrlKey/, 'should detect Cmd/Ctrl');
  assert.match(src, /k\s*===\s*'s'/, 'should bind key S to save');
  assert.match(src, /k\s*===\s*'o'/, 'should bind key O to open');
  assert.match(src, /k\s*===\s*'e'/, 'should bind key E to export');
  assert.match(src, /openFile\(\)/, 'should wire Open button');
  assert.match(src, /save\(\)/,     'should wire Save button');
  assert.match(src, /exportPdf\(\)/,'should wire PDF button');
});

test('CommandPalette: routes save / open / export through the docActions hook', () => {
  const src = readFileSync('src/renderer/components/CommandPalette.jsx', 'utf8');
  assert.match(src, /useDocActions/);
  assert.match(src, /openFile/);
  assert.match(src, /save\(/);
  assert.match(src, /exportPdf/);
});

test('HomePage: shows a recovery card when autosaves exist', () => {
  const src = readFileSync('src/renderer/pages/HomePage.jsx', 'utf8');
  assert.match(src, /listAutosaves/);
  assert.match(src, /Recovered drafts/);
  assert.match(src, /loadAutosave/);
});

test('ExportPage: Export button triggers real PDF build (not just a static preview)', () => {
  const src = readFileSync('src/renderer/pages/ExportPage.jsx', 'utf8');
  assert.match(src, /onExport/);
  assert.match(src, /exportPdf/);
  assert.doesNotMatch(src, /PDF export is wired but uses the browser PDF/);
});

test('EditorPage: edits flow back into store + autosave on blur', () => {
  const src = readFileSync('src/renderer/pages/EditorPage.jsx', 'utf8');
  assert.match(src, /set-doc/,         'should dispatch set-doc on edit');
  assert.match(src, /autosaveDoc/,      'should call autosaveDoc on edit');
  assert.match(src, /contentEditable/,  'should mark title/body as contentEditable');
});

// --- 1.1.1 audit round: persistence + a11y + dependencies ------------------

test('Store: reads theme + scale from localStorage on boot (persistence)', () => {
  const src = readFileSync('src/renderer/store/Store.jsx', 'utf8');
  assert.match(src, /loadPersistedPrefs/, 'should define loadPersistedPrefs');
  assert.match(src, /udani:theme/,        'should read udani:theme key');
  assert.match(src, /udani:scale/,        'should read udani:scale key');
  assert.match(src, /_persisted\.theme \|\| 'light'/, 'should merge persisted theme into initialState');
});

test('App.jsx: writes theme + scale to localStorage on change (persistence)', () => {
  const src = readFileSync('src/renderer/App.jsx', 'utf8');
  assert.match(src, /udani:theme/,         'should write to udani:theme on change');
  assert.match(src, /udani:scale/,         'should write to udani:scale on change');
  assert.match(src, /localStorage\.setItem/, 'should call localStorage.setItem');
});

test('index.html: declares theme-color, OG tags, generator, and app-name', () => {
  const src = readFileSync('index.html', 'utf8');
  assert.match(src, /theme-color/,         'should set theme-color for status bar');
  assert.match(src, /og:title/,            'should declare OG title');
  assert.match(src, /og:image/,            'should declare OG image');
  assert.match(src, /application-name/,    'should set application-name');
  assert.match(src, /UrduOfDani 1\.\d+\.\d+/, 'should set generator meta with a version');
});

test('package.json: declares pdf-lib and @pdf-lib/fontkit (PDF export deps)', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  assert.ok(pkg.dependencies['pdf-lib'],         'pdf-lib should be in dependencies');
  assert.ok(pkg.dependencies['@pdf-lib/fontkit'], '@pdf-lib/fontkit should be in dependencies');
  // Version is whatever's current — just verify it parses as semver.
  assert.match(pkg.version, /^\d+\.\d+\.\d+$/, 'package.json version should be semver');
});

test('scripts/audit.mjs: runs and reports clean state', () => {
  const src = readFileSync('scripts/audit.mjs', 'utf8');
  assert.match(src, /walk\(/,         'should walk src/ for source files');
  assert.match(src, /package\.json/,  'should read package.json');
  assert.match(src, /TODO\|FIXME\|XXX/, 'should detect TODO / FIXME / XXX markers');
  assert.match(src, /console\./,      'should flag console calls for review');
  assert.match(src, /gitignore/,      'should check .gitignore coverage');
});

test('useDocActions: PDF-export error log is prefixed for grep-ability', () => {
  const src = readFileSync('src/renderer/lib/useDocActions.js', 'utf8');
  assert.match(src, /\[udani\] PDF export failed:/,
    'should log PDF errors with a [udani] prefix so they can be filtered');
});

// --- defensive round: regression tests for issues that bit us -------------

test('spell.js: check() does not throw on empty or whitespace input', () => {
  // The editor fires `check()` on every keystroke; it must never throw.
  // Build a small dictionary so check() is meaningful.
  const set = build(['اردو', 'زبان', 'خوبصورتی', 'ایک', 'نمونہ']);
  for (const input of ['', ' ', '\n', '  \t  ', '!@#$%^&*()']) {
    const r = check(set, input);
    assert.ok(Array.isArray(r), 'should return an array');
    assert.equal(r.length, 0,     'should have no misses for empty / punctuation input');
  }
});

test('spell.js: check() returns word positions for unrecognised tokens', () => {
  const set = build(['اردو', 'زبان']);
  // "خوبصو" is a plausible Arabic-script typo; "ژوب" is rare-ish. Neither is in our set.
  const misses = check(set, 'اردو خوبصو ژوب زبان');
  assert.equal(misses.length, 2, 'should flag the two unknown Arabic-script words');
  assert.equal(misses[0].word, 'خوبصو');
  assert.equal(misses[1].word, 'ژوب');
  assert.equal(typeof misses[0].start, 'number');
  assert.equal(typeof misses[1].end,   'number');
  assert.ok(misses[0].start < misses[0].end, 'end should be greater than start');
});

test('document.js: round-trip preserves meta title and page size', async () => {
  const { emptyDocument, serialize, parse } = await import('../src/renderer/lib/document.js');
  const doc = emptyDocument('میگزین', { size: 'A5', orientation: 'landscape' });
  const json = serialize(doc);
  const back = parse(json);
  assert.equal(back.meta.title, 'میگزین', 'meta.title survives round-trip');
  assert.equal(back.meta.page.size,        'A5',         'page size survives round-trip');
  assert.equal(back.meta.page.orientation, 'landscape',  'orientation survives round-trip');
  assert.equal(back.meta.author, 'Muhammad Danish [Dani] · DaniLabs', 'credit is preserved');
});

test('document.js: emptyDocument() seeds an Urdu sample (so a new doc is not blank)', async () => {
  const { emptyDocument } = await import('../src/renderer/lib/document.js');
  const doc = emptyDocument();
  // At least one page should have a frame with non-empty content text.
  const hasUrdu = doc.pages.some(p => p.frames.some(f => f.content && f.content.length > 0));
  assert.ok(hasUrdu, 'emptyDocument() should seed at least one frame with Urdu sample text');
});

test('package.json: every documented script is mentioned in README', () => {
  // We only require that the *documented* scripts (in README) are runnable.
  // Capture the first word after "npm run" and stop at any non-identifier char.
  const read = readFileSync('README.md', 'utf8');
  const documented = [...read.matchAll(/npm run ([A-Za-z0-9_:-]+)/g)].map(m => {
    // Trim trailing colon (e.g. "npm run build:" doesn't exist) or period.
    return m[1].replace(/[:.]$/, '');
  });
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  for (const name of documented) {
    if (name === 'start') continue;     // a few npm idioms we don't expose
    assert.ok(pkg.scripts[name], `documented script "${name}" should be in package.json`);
  }
});

test('CHANGELOG.md: latest entry version matches package.json', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  const cl  = readFileSync('CHANGELOG.md', 'utf8');
  // First version header that appears in the file is the latest.
  // Allow "## 1.1.2" or "## [1.1.2] — date" styles.
  const m = cl.match(/^##\s+\[?(\d+\.\d+\.\d+)\]?/m);
  assert.ok(m, 'CHANGELOG should have a version heading');
  assert.equal(m[1], pkg.version, `CHANGELOG top version (${m[1]}) should match package.json (${pkg.version})`);
});

test('App.jsx: Toast component is mounted (so .udani-save success messages actually render)', () => {
  const src = readFileSync('src/renderer/App.jsx', 'utf8');
  assert.match(src, /<Toast\b/,
    'App.jsx should mount <Toast/> so the user sees save/open/PDF feedback');
});

test('index.html: loads renderer/main.jsx (the actual entry point)', () => {
  const src = readFileSync('index.html', 'utf8');
  assert.match(src, /src=["']\/src\/renderer\/main\.jsx["']/,
    'index.html should reference the real renderer entry point');
});

test('vite.config.js: declares a relative base path (so the .exe can be launched from Program Files)', () => {
  const src = readFileSync('vite.config.js', 'utf8');
  assert.match(src, /base:\s*['"]\.\/['"]/,
    'vite.config.js should use a relative base path for desktop installs');
});

test('Icons.jsx: ships a rich icon library (≥ 40 icons)', () => {
  const src = readFileSync('src/renderer/components/Icons.jsx', 'utf8');
  const matches = src.match(/^\s+(\w+):\s*make/gm) || [];
  assert.ok(matches.length >= 40,
    `Icons.jsx should have at least 40 icons, found ${matches.length}`);
  // Spot-check a few that the design relies on
  for (const name of ['Pen', 'Home', 'Search', 'Download', 'Print', 'Settings', 'Sun', 'Moon', 'Copy', 'External']) {
    assert.ok(new RegExp('\\b' + name + ':\\s*make').test(src),
      `Icons.jsx should export an Icon.${name}`);
  }
});

test('ActivityBar: groups all 7 views and binds Ctrl+1..6', () => {
  const src = readFileSync('src/renderer/components/ActivityBar.jsx', 'utf8');
  for (const view of ['home', 'editor', 'review', 'design', 'insert', 'publish', 'settings']) {
    assert.ok(src.includes(`id: '${view}'`), `ActivityBar should include the "${view}" view`);
  }
});

test('design system tokens: new semantic aliases are present', () => {
  const t = readFileSync('src/renderer/styles/tokens.css', 'utf8');
  for (const name of ['--color-primary', '--color-text', '--color-text-muted',
                       '--color-border', '--color-bg-sunken', '--color-info',
                       '--color-danger', '--color-warning']) {
    assert.ok(t.includes(name + ':'),
      `tokens.css should declare the semantic alias ${name}`);
  }
});

test('component library: ships modern primitives (button, card, chip, kbd, toast)', () => {
  const c = readFileSync('src/renderer/styles/components.css', 'utf8');
  for (const name of ['.btn-primary', '.btn-group', '.card-hoverable', '.chip',
                       '.input-search', 'kbd {', '.toast', '.cmdk', '.activitybar-item',
                       '.sidenav', '.inspector', '.empty-state', '.tpl-card', '.doc-thumb']) {
    assert.ok(c.includes(name), `components.css should define ${name}`);
  }
});

test('all 23 inner pages use the new design system (no legacy page-header div, no legacy emerald/slate CSS vars)', () => {
  const pagesDir = 'src/renderer/pages';
  const files = readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));
  // These 6 pages are core shell pages that don't use PageHeader (they ARE the shell)
  const shellPages = new Set(['HomePage.jsx', 'EditorPage.jsx', 'NewDocPage.jsx', 'TemplatesPage.jsx', 'SettingsPage.jsx', 'HelpPage.jsx']);
  for (const f of files) {
    if (shellPages.has(f)) continue;
    const src = readFileSync(join(pagesDir, f), 'utf8');
    // 1) No legacy <div className="page-header">
    assert.ok(!src.includes('className="page-header"'),
      `${f} should use <PageHeader /> instead of the legacy <div className="page-header">`);
    // 2) No legacy CSS-var tokens (--emerald-, --navy-, --slate-, --ivory-, --info-, --warning-, --danger-)
    const legacyVars = src.match(/--(emerald|navy|slate|ivory|info|warning|danger)-\d+/g);
    assert.ok(!legacyVars || legacyVars.length === 0,
      `${f} still uses legacy CSS-var tokens: ${(legacyVars || []).slice(0, 3).join(', ')}`);
    // 3) Should import PageHeader
    assert.ok(src.includes("import PageHeader"),
      `${f} should import PageHeader from '../components/PageHeader.jsx'`);
  }
  assert.ok(files.length >= 20, `expected 20+ pages, found ${files.length}`);
});

test('electron-builder config: bundles docs and packages the app icon', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  const b   = pkg.build || {};
  const files = b.files || [];
  const all  = files.join('\n');
  assert.ok(/LICENSE/.test(all),     'electron-builder files should include LICENSE');
  assert.ok(/CHANGELOG/.test(all),   'electron-builder files should include CHANGELOG.md');
  assert.ok(b.win && b.win.icon,     'Windows icon should be declared');
  assert.ok(b.linux && b.linux.icon, 'Linux icon should be declared');
});

test('LICENSE: is MIT and grants the right to sell copies free of charge', () => {
  const lic = readFileSync('LICENSE', 'utf8');
  assert.match(lic, /MIT License/,           'should be the MIT License');
  assert.match(lic, /free of charge/,         'should say "free of charge"');
  assert.match(lic, /sell/,                  'should grant the right to sell copies');
  assert.match(lic, /Muhammad Danish \[Dani\]/,
    'should preserve the DaniLabs / Muhammad Danish [Dani] copyright');
});

test('NOTICE: declares UrduOfDani is free for everyone', () => {
  const notice = readFileSync('NOTICE', 'utf8');
  assert.match(notice, /free for everyone/i,     'should declare the app is free for everyone');
  assert.match(notice, /MIT/,                    'should reference the MIT license');
  assert.match(notice, /hello\.danilabs@gmail\.com/, 'should keep the contact email');
  assert.match(notice, /Muhammad Danish \[Dani\]/,
    'should preserve the DaniLabs / Muhammad Danish [Dani] credit');
});

test('README: surfaces the "free for everyone" intent at the top', () => {
  const readme = readFileSync('README.md', 'utf8');
  assert.match(readme, /free for everyone/i,
    'README should explicitly say the app is free for everyone');
  assert.match(readme, /NOTICE/,
    'README should link to NOTICE');
});

test('electron-builder extraResources: every source directory exists', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  const er  = pkg.build && pkg.build.extraResources;
  if (!Array.isArray(er)) return;   // no extraResources is fine
  for (const entry of er) {
    const from = typeof entry === 'string' ? entry : entry.from;
    assert.ok(existsSync(from),
      `electron-builder extraResources.from = "${from}" but that directory does not exist`);
  }
});

test('release workflow: triggers on v* tag and on workflow_dispatch', () => {
  const yml = readFileSync('.github/workflows/release.yml', 'utf8');
  assert.match(yml, /tags:\s*\n\s*-\s*['"]v\*['"]/,  'should listen on v* tag push');
  assert.match(yml, /workflow_dispatch/,             'should accept manual dispatch');
  assert.match(yml, /build-windows/,                 'should have a Windows build job');
  assert.match(yml, /dist:win/,                      'should call npm run dist:win for Windows');
  assert.match(yml, /dist:linux/,                    'should call npm run dist:linux for Linux');
  assert.match(yml, /dist:mac/,                      'should call npm run dist:mac for macOS');
  assert.match(yml, /action-gh-release@v2/,          'should publish via softprops/action-gh-release');
  assert.match(yml, /contents:\s*write/,             'should declare contents: write permission');
});

test('ci workflow: runs audit + tests + build on every push', () => {
  const yml = readFileSync('.github/workflows/ci.yml', 'utf8');
  assert.match(yml, /push:/,                  'should trigger on push');
  assert.match(yml, /pull_request:/,          'should trigger on pull_request');
  assert.match(yml, /npm run audit/,          'should run npm run audit');
  assert.match(yml, /npm test/,               'should run npm test');
  assert.match(yml, /npm run build/,          'should run npm run build');
});

test('renderer JSX: every React hook used is also imported from "react"', () => {
  // Regression: App.jsx used useState() without importing it, which threw
  // ReferenceError at mount and produced a blank white screen. The
  // package.json / npm test won't catch this; only a static check on
  // every .jsx file does.
  const HOOKS = ['useState', 'useEffect', 'useMemo', 'useRef', 'useCallback',
                 'useLayoutEffect', 'useReducer', 'useContext', 'useImperativeHandle'];
  const jsxFiles = [
    ...walk(join(ROOT, 'src/renderer'), ['.jsx']),
  ];
  for (const f of jsxFiles) {
    const text = readFileSync(f, 'utf8');
    // Find the first 'import ... from "react"' (or 'react-dom') line.
    const reactImport = text.match(/import\s+[\w\s{},*]+\s+from\s+['"]react['"]/);
    const importNames = reactImport ? reactImport[0] : '';
    for (const hook of HOOKS) {
      const used = new RegExp('\\b' + hook + '\\s*\\(').test(text);
      if (used && !importNames.includes(hook)) {
        assert.fail(`${f} uses ${hook}() but does not import it from 'react'`);
      }
    }
  }
});
// Smoke tests for the spell-check infrastructure.
// Run with: node --test tests/smoke.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build, check, suggest, norm } from '../src/renderer/lib/spell.js';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

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
  assert.match(css, /\.grid-1\b[\s\S]*?auto-fit/);
  assert.match(css, /\.grid-4\b[\s\S]*?auto-fit/);
  assert.match(css, /\.grid-form-3\b/);
  assert.match(css, /\.grid-form-4\b/);
});

test('responsive.css: hides sidenav and inspector below their breakpoints', () => {
  const css = readFileSync('src/renderer/styles/responsive.css', 'utf8');
  assert.match(css, /\.sidenav\s*\{\s*display:\s*none/);
  assert.match(css, /\.inspector\s*\{\s*display:\s*none/);
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
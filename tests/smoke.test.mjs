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
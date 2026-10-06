// Smoke tests for the spell-check infrastructure.
// Run with: node --test tests/smoke.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { build, check, suggest, norm } from '../src/renderer/lib/spell.js';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

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
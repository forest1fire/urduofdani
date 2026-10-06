// Spell-check core (pure): normalise, tokenise, suggest. The word list is NOT bundled — users add .txt files (one word per line) to the dictionary folder.
// Created by Muhammad Danish [Dani] · DaniLabs — free and open-source.
(function (root, factory) { const m = factory(); if (typeof module !== 'undefined' && module.exports) module.exports = m; else root.Spell = m; })(this, function () {
  'use strict';
  // Same word -> same key: Arabic-form letters unified, marks and tatweel removed, so "كِتاب" and "کتاب" match.
  const norm = w => w.normalize('NFC').replace(/[ً-ٰٟـ‌‍]/g, '').replace(/ي|ى/g, 'ی').replace(/ك/g, 'ک').replace(/ه|ە/g, 'ہ');
  const WORD = /[ؠ-يٮ-ۓەۺ-ۿ][ؐ-ؚؠ-ٟٮ-ۓەۺ-ۿٰـ‌]*/g; // letters (+ marks inside a word); excludes digits and ، ۔ ؟ ؛
  const ALPHABET = 'ابپتٹثجچحخدڈذرڑزژسشصضطظعغفقکگلمنںوہھءیےآأؤئۃ';
  function build(lines) { const set = new Set(); for (const l of lines) { const w = norm(String(l).trim()); if (w && w.length <= 40 && !/\s/.test(w)) set.add(w); } return set; }
  const known = (set, w) => set.has(norm(w)) || w.length < 2;
  // "found in the list, or the list contains it once the common prefixes/clitics are cut off" would need linguistics; we stay exact and let users add words.
  function edits1(w) {
    const out = new Set(), n = w.length;
    for (let i = 0; i < n; i++) out.add(w.slice(0, i) + w.slice(i + 1)); // delete
    for (let i = 0; i < n - 1; i++) out.add(w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2)); // swap
    for (let i = 0; i < n; i++) for (const c of ALPHABET) out.add(w.slice(0, i) + c + w.slice(i + 1)); // replace
    for (let i = 0; i <= n; i++) for (const c of ALPHABET) out.add(w.slice(0, i) + c + w.slice(i)); // insert
    return out;
  }
  function suggest(set, word, max) {
    const w = norm(word), found = []; for (const c of edits1(w)) if (c !== w && set.has(c)) found.push(c);
    return found.slice(0, max || 5);
  }
  // find unknown words in a text → [{start, end, word}]
  function check(set, text) { const bad = []; let m; WORD.lastIndex = 0; while ((m = WORD.exec(text))) { if (!known(set, m[0])) bad.push({ start: m.index, end: m.index + m[0].length, word: m[0] }); } return bad; }
  return { norm, build, check, suggest, known, WORD };
});

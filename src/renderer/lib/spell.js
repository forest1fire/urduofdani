// Spell-check core (pure): normalise, tokenise, suggest.
// Same word -> same key: Arabic-form letters unified, marks and tatweel removed,
// so "كِتاب" and "کتاب" match.
// Exposed as both ES module (for Vite) and UMD (for legacy renderer scripts).

// Same word -> same key
export const norm = w => w.normalize('NFC').replace(/[ً-ٰٟـ‌‍]/g, '').replace(/ي|ى/g, 'ی').replace(/ك/g, 'ک').replace(/ه|ە/g, 'ہ');

export const WORD = /[ؠ-يٮ-ۓەۺ-ۿ][ؐ-ؚؠ-ٟٮ-ۓەۺ-ۿٰـ‌]*/g;
const ALPHABET = 'ابپتٹثجچحخدڈذرڑزژسشصضطظعغفقکگلمنںوہھءیےآأؤئۃ';

export function build(lines) {
  const set = new Set();
  for (const l of lines) {
    const w = norm(String(l).trim());
    if (w && w.length <= 40 && !/\s/.test(w)) set.add(w);
  }
  return set;
}
const known = (set, w) => set.has(norm(w)) || w.length < 2;

export function edits1(w) {
  const out = new Set(), n = w.length;
  for (let i = 0; i < n; i++) out.add(w.slice(0, i) + w.slice(i + 1));                              // delete
  for (let i = 0; i < n - 1; i++) out.add(w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2));          // swap
  for (let i = 0; i < n; i++) for (const c of ALPHABET) out.add(w.slice(0, i) + c + w.slice(i + 1)); // replace
  for (let i = 0; i <= n; i++) for (const c of ALPHABET) out.add(w.slice(0, i) + c + w.slice(i));     // insert
  return out;
}

export function suggest(set, word, max) {
  const w = norm(word), found = [];
  for (const c of edits1(w)) if (c !== w && set.has(c)) found.push(c);
  return found.slice(0, max || 5);
}

export function check(set, text) {
  const bad = [];
  WORD.lastIndex = 0;
  let m;
  while ((m = WORD.exec(text))) if (!known(set, m[0])) bad.push({ start: m.index, end: m.index + m[0].length, word: m[0] });
  return bad;
}

// UMD compatibility for legacy renderer scripts.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { norm, build, check, suggest, known, WORD };
} else if (typeof window !== 'undefined') {
  window.Spell = { norm, build, check, suggest, known, WORD };
}
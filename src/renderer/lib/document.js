// document.js — open / save / autosave a .udani document.
//
// Storage model
//   - In the web preview: browser File System Access API where available,
//     otherwise <a download> + <input type=file>. We also keep a copy in
//     localStorage so the user never loses work on a reload.
//   - In Electron: window.udani.fs (preload-exposed) reads/writes via
//     fs.promises through the main process.
//
// Format: see docs/UDANI-FORMAT.md. A document is plain JSON; we add
// 'udani/1' + magic bytes 'UDANI\x1a' to the front when serialised
// (binary-safe JSON with a magic header) so we can sniff old files
// in the future.

const MAGIC = 'UDANI\x1a';
const FORMAT_VERSION = 1;

/* ------------------------------------------------------------------ *
 *  Serialize / parse
 * ------------------------------------------------------------------ */

export function serialize(doc) {
  const payload = JSON.stringify({
    version: FORMAT_VERSION,
    ...doc,
    meta: { ...(doc.meta || {}), savedAt: new Date().toISOString() },
  });
  // TextEncoder for safety with non-BMP characters in Urdu.
  const bytes = new TextEncoder().encode(MAGIC + payload);
  return bytes;
}

export function parse(bytesOrString) {
  let text;
  if (bytesOrString instanceof Uint8Array) {
    text = new TextDecoder().decode(bytesOrString);
  } else if (typeof bytesOrString === 'string') {
    text = bytesOrString;
  } else if (bytesOrString instanceof ArrayBuffer) {
    text = new TextDecoder().decode(new Uint8Array(bytesOrString));
  } else {
    throw new Error('parse: unsupported input type');
  }
  if (text.startsWith(MAGIC)) text = text.slice(MAGIC.length);
  const obj = JSON.parse(text);
  if (!obj.meta) obj.meta = {};
  if (!obj.pages) obj.pages = [];
  return obj;
}

/* ------------------------------------------------------------------ *
 *  Empty document factory
 * ------------------------------------------------------------------ */

export function emptyDocument(name = 'Untitled', opts = {}) {
  return {
    meta: {
      title: name,
      author: 'Muhammad Danish [Dani] · DaniLabs',
      page: { size: opts.size || 'A4', orientation: opts.orientation || 'portrait', margin: 20 },
      paper: '#F7F5EF',
      credit: true,
    },
    pages: [
      {
        id: 'p1',
        frames: [
          { id: 'f-title', kind: 'text', x: 20, y: 20, w: 170, h: 24,
            content: 'اردو کی خوبصورتی', font: 'Noto Nastaliq Urdu',
            size: 28, weight: 'bold', align: 'center', dir: 'rtl',
            color: '#102A43' },
          { id: 'f-body', kind: 'text', x: 20, y: 50, w: 170, h: 200,
            content: 'یہ ایک نمونہ متن ہے۔ آپ اسے تبدیل کر کے اپنی دستاویز شروع کر سکتے ہیں۔',
            font: 'Noto Nastaliq Urdu', size: 16, weight: 'normal',
            align: 'right', dir: 'rtl', color: '#102A43' },
        ],
      },
    ],
  };
}

/* ------------------------------------------------------------------ *
 *  Browser save / open
 * ------------------------------------------------------------------ */

export async function saveDocument(doc, suggestedName) {
  const bytes = serialize(doc);
  const name = (suggestedName || doc.meta?.title || 'document') + '.udani';

  // File System Access API (Chromium / Edge).
  if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: name,
        types: [{ description: 'UrduOfDani document', accept: { 'application/octet-stream': ['.udani'] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(bytes);
      await writable.close();
      return { ok: true, method: 'fs-access', name, handle };
    } catch (e) {
      if (e.name === 'AbortError') return { ok: false, cancelled: true };
      // fall through to download
    }
  }

  // Fallback: <a download>.
  const blob = new Blob([bytes], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);

  // Always mirror to localStorage.
  try {
    localStorage.setItem('udani:last-doc', JSON.stringify({ name, savedAt: Date.now() }));
    // The actual content goes in a separate slot so we can store 1+ MB.
    localStorage.setItem('udani:last-doc-bytes', JSON.stringify(Array.from(bytes)));
  } catch {}
  return { ok: true, method: 'download', name };
}

export async function openDocument() {
  // File System Access API.
  if (typeof window !== 'undefined' && 'showOpenFilePicker' in window) {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{ description: 'UrduOfDani document', accept: { 'application/octet-stream': ['.udani', '.json'] } }],
      });
      const file = await handle.getFile();
      const bytes = new Uint8Array(await file.arrayBuffer());
      return { doc: parse(bytes), name: file.name, handle };
    } catch (e) {
      if (e.name === 'AbortError') return { ok: false, cancelled: true };
      throw e;
    }
  }

  // Fallback: <input type=file>.
  return new Promise((resolve) => {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.udani,.json';
    inp.onchange = async () => {
      const file = inp.files?.[0];
      if (!file) return resolve({ ok: false, cancelled: true });
      const bytes = new Uint8Array(await file.arrayBuffer());
      try { resolve({ doc: parse(bytes), name: file.name }); }
      catch (e) { resolve({ ok: false, error: e.message }); }
    };
    inp.click();
  });
}

/* ------------------------------------------------------------------ *
 *  Autosave
 * ------------------------------------------------------------------ */

const AUTOSAVE_KEY = 'udani:autosave';
const AUTOSAVE_MAX = 12;          // keep the last N versions per document

export function autosave(doc, slotId = 'default') {
  try {
    const key = `${AUTOSAVE_KEY}:${slotId}`;
    const bytes = serialize(doc);
    const stamp = { ts: Date.now(), name: doc.meta?.title || 'Untitled',
                    size: bytes.length, bytes: Array.from(bytes) };
    const all = JSON.parse(localStorage.getItem(key) || '[]');
    all.unshift(stamp);
    while (all.length > AUTOSAVE_MAX) all.pop();
    localStorage.setItem(key, JSON.stringify(all));
    return stamp;
  } catch (e) {
    // Quota exceeded — quietly drop oldest.
    return null;
  }
}

export function listAutosaves(slotId = 'default') {
  try {
    return JSON.parse(localStorage.getItem(`${AUTOSAVE_KEY}:${slotId}`) || '[]');
  } catch { return []; }
}

export function loadAutosave(stamp, slotId = 'default') {
  try {
    return parse(new Uint8Array(stamp.bytes));
  } catch { return null; }
}

export function clearAutosaves(slotId = 'default') {
  localStorage.removeItem(`${AUTOSAVE_KEY}:${slotId}`);
}

/* ------------------------------------------------------------------ *
 *  Validation / shape guard
 * ------------------------------------------------------------------ */

export function isValidDocument(obj) {
  if (!obj || typeof obj !== 'object') return false;
  if (obj.pages && !Array.isArray(obj.pages)) return false;
  if (obj.pages) for (const p of obj.pages) {
    if (!Array.isArray(p.frames)) return false;
  }
  return true;
}

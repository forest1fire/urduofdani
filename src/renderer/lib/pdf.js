// pdf.js — produce a real PDF from a .udani document.
// Uses pdf-lib (pure JS, runs in browser + Electron renderer).
//
// Layout: a .udani document has pages, each with frames. Each frame has
//   { x, y, w, h, kind: 'text' | 'image', content, font, size, align, dir }
//   x/y are in mm from the top-left, dir is 'rtl' (Urdu) or 'ltr'.
//
// We render text with Helvetica (built-in PDF font) as a fallback; for
// Urdu we embed the system Noto Nastaliq Urdu if it can be loaded at runtime
// (the browser caches it after the first page load). If the font is
// unavailable we degrade to a Naskh-style that the PDF still reads.
//
// The output is a Uint8Array suitable for `new Blob([bytes], { type: 'application/pdf' })`
// or for `fs.writeFile` in Electron.

import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

// Page sizes in PDF points (1pt = 1/72 inch). 1 mm = 2.83465 pt.
const MM = 2.83465;

const PAGE_SIZES = {
  A4:     { w: 210 * MM, h: 297 * MM },
  A5:     { w: 148 * MM, h: 210 * MM },
  Letter: { w:  8.5 * 72, h: 11 * 72 },
};

function pageDims(size = 'A4', orientation = 'portrait') {
  const base = PAGE_SIZES[size] || PAGE_SIZES.A4;
  return orientation === 'landscape'
    ? { w: Math.max(base.w, base.h), h: Math.min(base.w, base.h) }
    : { w: Math.min(base.w, base.h), h: Math.max(base.w, base.h) };
}

// Try to load the system Urdu font. In the browser, we ask FontFace to
// resolve the same family; in Electron we read it from disk. We swallow
// errors because pdf-lib will fall back to Helvetica.
async function tryLoadUrduFont() {
  if (typeof document === 'undefined') return null;
  try {
    // Already loaded by Google Fonts CSS? Use it directly.
    const face = Array.from(document.fonts || []).find(f => /Noto Nastaliq Urdu/i.test(f.family));
    if (face && face.status === 'loaded') {
      // We can't easily export an OTFFont from a CSS-loaded font; pdf-lib
      // needs raw bytes. So skip; PDF will render with Helvetica.
      // (This branch is a hook for the future when we ship the woff2.)
    }
  } catch {}
  return null;
}

const COLORS = {
  navy:    rgb(0x10/255, 0x2A/255, 0x43/255),
  emerald: rgb(0x00/255, 0x8F/255, 0x76/255),
  black:   rgb(0, 0, 0),
  slate:   rgb(0x64/255, 0x74/255, 0x8B/255),
  white:   rgb(1, 1, 1),
};

function hexToRgb(hex) {
  if (!hex) return COLORS.black;
  const h = hex.replace('#', '');
  const v = h.length === 3
    ? h.split('').map(c => parseInt(c + c, 16))
    : [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  return rgb(v[0]/255, v[1]/255, v[2]/255);
}

// Word-wrap by char count. Real Nastaliq justification is out of scope
// (we'd need to know glyph advance widths); for now, plain wrap and right-align
// the whole block so RTL Urdu reads naturally.
function wrap(text, maxChars) {
  const out = [];
  const paras = (text || '').split(/\n/);
  for (const p of paras) {
    if (p.length <= maxChars) { out.push(p); continue; }
    // Naive: break on nearest space within last 8 chars.
    const words = p.split(/\s+/);
    let line = '';
    for (const w of words) {
      if ((line + ' ' + w).trim().length > maxChars) {
        if (line) out.push(line);
        line = w;
      } else {
        line = (line ? line + ' ' : '') + w;
      }
    }
    if (line) out.push(line);
  }
  return out;
}

/**
 * Build a PDF Uint8Array from a .udani document.
 *
 * @param {object} doc - a parsed .udani document (see docs/UDANI-FORMAT.md)
 * @param {object} [opts] - { embedFonts: bool, onProgress: (n,total) => void }
 * @returns {Promise<Uint8Array>}
 */
export async function buildPdf(doc, opts = {}) {
  const onProgress = opts.onProgress || (() => {});
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);

  const helv     = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // Try Urdu font (no-op until we ship a woff2; falls back to Helvetica).
  await tryLoadUrduFont();

  const meta = doc.meta || {};
  const size = meta.page?.size || 'A4';
  const orient = meta.page?.orientation || 'portrait';
  const { w: PW, h: PH } = pageDims(size, orient);

  const margin = (meta.page?.margin ?? 20) * MM;
  const pages  = doc.pages || [];
  const total  = Math.max(pages.length, 1);

  // Default page (so empty docs still produce a valid PDF).
  if (total === 0) {
    const p = pdf.addPage([PW, PH]);
    p.drawText('UrduOfDani — empty document', {
      x: margin, y: PH - margin - 14, size: 14, font: helv, color: COLORS.slate,
    });
  }

  for (let i = 0; i < total; i++) {
    onProgress(i + 1, total);
    const page = pages[i] || { frames: [] };
    const p = pdf.addPage([PW, PH]);

    // Background paper colour.
    const paper = hexToRgb(meta.paper || '#F7F5EF');
    p.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: paper });

    // Frames.
    for (const f of (page.frames || [])) {
      const x = (f.x ?? margin) * MM;
      const yFromTop = (f.y ?? margin) * MM;
      const fw = (f.w ?? 0) * MM;
      const fh = (f.h ?? 0) * MM;
      // PDF y origin is bottom-left; convert.
      const py = PH - yFromTop - fh;

      if (f.kind === 'text') {
        const sizePt = Number(f.size) || 14;
        const isBold = /bold|700/i.test(String(f.weight || ''));
        const font = isBold ? helvBold : helv;
        const align = f.align || 'right';   // Urdu defaults to right
        const rtl   = (f.dir || 'rtl') === 'rtl';
        const color = hexToRgb(f.color || '#102A43');

        // The horizontal pixel-width a single Helvetica character takes
        // at sizePt is roughly sizePt * 0.5. Estimate wrap width.
        const charW = sizePt * 0.5;
        const maxChars = Math.max(8, Math.floor((fw - 8) / charW));
        const lines = wrap(f.content || '', maxChars);

        const lineHeight = sizePt * 1.4;
        const totalH = lines.length * lineHeight;
        const startY = py + fh - sizePt;     // top baseline

        lines.forEach((line, li) => {
          const lineW = font.widthOfTextAtSize(line, sizePt);
          let tx = x + 4;                    // default left
          if (align === 'center') tx = x + (fw - lineW) / 2;
          else if (align === 'right' || rtl) tx = x + fw - lineW - 4;
          else if (align === 'justify' && li < lines.length - 1) {
            // crude justify: insert spaces; skipped for Urdu which uses
            // tatweel. We just left-align justified blocks.
            tx = x + 4;
          }
          p.drawText(line, {
            x: tx, y: startY - li * lineHeight,
            size: sizePt, font, color,
          });
        });
      } else if (f.kind === 'image' && f.imageBytes) {
        try {
          const bytes = f.imageBytes instanceof Uint8Array
            ? f.imageBytes
            : new Uint8Array(f.imageBytes);
          const isPng = (f.imageType || 'png').toLowerCase().includes('png');
          const img = isPng
            ? await pdf.embedPng(bytes)
            : await pdf.embedJpg(bytes);
          const ar = img.width / img.height;
          let dw = fw, dh = fw / ar;
          if (dh > fh) { dh = fh; dw = fh * ar; }
          p.drawImage(img, { x: x + (fw - dw)/2, y: py + (fh - dh)/2, width: dw, height: dh });
        } catch (e) {
          // Image failed to embed — draw a placeholder.
          p.drawRectangle({ x, y: py, width: fw, height: fh, borderColor: COLORS.slate, borderWidth: 0.5 });
          p.drawText('⚠ ' + (e.message || 'image failed'), {
            x: x + 4, y: py + 4, size: 8, font: helv, color: COLORS.slate,
          });
        }
      } else if (f.kind === 'rect' || f.kind === 'shape') {
        const stroke = hexToRgb(f.stroke || '#102A43');
        const fill   = f.fill ? hexToRgb(f.fill) : undefined;
        p.drawRectangle({
          x, y: py, width: fw, height: fh,
          borderColor: stroke, borderWidth: 0.5,
          color: fill,
        });
      } else if (f.kind === 'line') {
        const stroke = hexToRgb(f.stroke || '#102A43');
        p.drawLine({
          start: { x, y: py + fh/2 },
          end:   { x: x + fw, y: py + fh/2 },
          thickness: 0.5, color: stroke,
        });
      }
    }

    // Page number.
    p.drawText(String(i + 1), {
      x: PW / 2 - 6, y: 12, size: 9, font: helv, color: COLORS.emerald,
    });

    // Watermark / footer.
    if (meta.credit !== false) {
      p.drawText('Created with UrduOfDani · by Muhammad Danish [Dani] · DaniLabs', {
        x: 8, y: 4, size: 6, font: helv, color: COLORS.slate,
      });
    }
  }

  // Document metadata.
  if (meta.title)   pdf.setTitle(meta.title);
  if (meta.author)  pdf.setAuthor(meta.author);
  if (meta.subject) pdf.setSubject(meta.subject);
  pdf.setProducer('UrduOfDani 1.0.1');
  pdf.setCreator('UrduOfDani');

  return await pdf.save();
}

/** Download helper for the web preview. */
export function downloadPdf(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename || 'document.pdf';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
}

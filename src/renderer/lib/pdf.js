// pdf.js — produce a real PDF from a .udani document.
// Uses pdf-lib (pure JS, runs in browser + Electron renderer).
//
// Layout: a .udani document has pages, each with frames. Each frame has
//   { x, y, w, h, kind: 'text' | 'image', content, font, size, align, dir }
//   x/y are in mm from the top-left, dir is 'rtl' (Urdu) or 'ltr'.
//
// We render text with Helvetica (built-in PDF font). For Urdu, the
// WinAnsi encoding can't represent Arabic/Persian/Urdu glyphs, so we
// transliterate non-Latin text to '?' and surface a hint in the document
// title. To produce real Nastaliq in PDF, we need a TTF — see
// docs/UDANI-FORMAT.md for the roadmap.
//
// The output is a Uint8Array suitable for `new Blob([bytes], { type: 'application/pdf' })`
// or for `fs.writeFile` in Electron.

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

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

// WinAnsi (Helvetica) cannot encode Arabic/Persian/Urdu characters.
// Until we ship an embedded TTF, transliterate non-Latin to '?'.  We add
// a small note to the document title so the user knows why.
function toWinAnsi(s) {
  return (s || '').replace(/[^\x00-\x7F]/g, () => '?');
}

function wrap(text, maxChars) {
  const out = [];
  const paras = (text || '').split(/\n/);
  for (const p of paras) {
    if (p.length <= maxChars) { out.push(p); continue; }
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

  const meta = doc.meta || {};
  const size = meta.page?.size || 'A4';
  const orient = meta.page?.orientation || 'portrait';
  const { w: PW, h: PH } = pageDims(size, orient);

  const margin = (meta.page?.margin ?? 20) * MM;
  const pages  = doc.pages || [];
  const total  = Math.max(pages.length, 1);

  if (total === 0) {
    const p = pdf.addPage([PW, PH]);
    p.drawText('UrduOfDani - empty document', {
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

    for (const f of (page.frames || [])) {
      const x = (f.x ?? margin) * MM;
      const yFromTop = (f.y ?? margin) * MM;
      const fw = (f.w ?? 0) * MM;
      const fh = (f.h ?? 0) * MM;
      const py = PH - yFromTop - fh;

      if (f.kind === 'text') {
        const sizePt = Number(f.size) || 14;
        const isBold = /bold|700/i.test(String(f.weight || ''));
        const font = isBold ? helvBold : helv;
        const align = f.align || 'right';
        const rtl   = (f.dir || 'rtl') === 'rtl';
        const color = hexToRgb(f.color || '#102A43');

        const charW = sizePt * 0.5;
        const maxChars = Math.max(8, Math.floor((fw - 8) / charW));
        const lines = wrap(toWinAnsi(f.content), maxChars);

        const lineHeight = sizePt * 1.4;
        const startY = py + fh - sizePt;

        lines.forEach((line, li) => {
          if (!line) return;
          const lineW = font.widthOfTextAtSize(line, sizePt);
          let tx = x + 4;
          if (align === 'center') tx = x + (fw - lineW) / 2;
          else if (align === 'right' || rtl) tx = x + fw - lineW - 4;
          else if (align === 'justify' && li < lines.length - 1) tx = x + 4;
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
          p.drawRectangle({ x, y: py, width: fw, height: fh, borderColor: COLORS.slate, borderWidth: 0.5 });
          p.drawText('image failed: ' + (e.message || 'unknown'), {
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

    p.drawText(String(i + 1), {
      x: PW / 2 - 6, y: 12, size: 9, font: helv, color: COLORS.emerald,
    });

    if (meta.credit !== false) {
      p.drawText('Created with UrduOfDani - by Muhammad Danish [Dani] - DaniLabs', {
        x: 8, y: 4, size: 6, font: helv, color: COLORS.slate,
      });
    }
  }

  if (meta.title)   pdf.setTitle(meta.title);
  if (meta.author)  pdf.setAuthor(meta.author);
  if (meta.subject) pdf.setSubject(meta.subject);
  pdf.setProducer('UrduOfDani 1.0.2');
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

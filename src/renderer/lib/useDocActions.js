// useDocActions — central hook for opening, saving, exporting .udani docs.
// Used by TopBar, EditorPage, ExportPage, HomePage, and the command palette.

import { useCallback } from 'react';
import { useStore } from '../store/Store.jsx';
import { saveDocument, openDocument, autosave, emptyDocument } from './document.js';

// Lazy-load pdf-lib + fontkit (they are ~1 MB) the first time we export.
let _pdf = null;
async function loadPdfLib() {
  if (_pdf) return _pdf;
  const [{ buildPdf, downloadPdf }] = await Promise.all([
    import('./pdf.js'),
  ]);
  _pdf = { buildPdf, downloadPdf };
  return _pdf;
}

export function useDocActions() {
  const { state, dispatch } = useStore();

  const newDoc = useCallback((name, opts) => {
    dispatch({ type: 'new-doc', name, ...opts });
  }, [dispatch]);

  const openFile = useCallback(async () => {
    const r = await openDocument();
    if (!r || r.cancelled) return { ok: false, cancelled: true };
    if (r.error) {
      dispatch({ type: 'toast', t: { kind: 'error', msg: 'Could not open: ' + r.error } });
      return { ok: false, error: r.error };
    }
    const id = 'd-' + Math.random().toString(36).slice(2, 9);
    dispatch({ type: 'open-doc-data', id, udani: r.doc, name: r.name.replace(/\.udani$/i, '') });
    dispatch({ type: 'toast', t: { kind: 'ok', msg: 'Opened ' + r.name } });
    return { ok: true, doc: r.doc, name: r.name };
  }, [dispatch]);

  const save = useCallback(async () => {
    if (!state.activeDoc) {
      dispatch({ type: 'toast', t: { kind: 'warn', msg: 'Nothing to save' } });
      return { ok: false };
    }
    const r = await saveDocument(state.activeDoc, state.activeDoc.meta?.title);
    if (r.ok) {
      dispatch({ type: 'mark-saved' });
      dispatch({ type: 'toast', t: { kind: 'ok', msg: 'Saved ' + r.name } });
    }
    return r;
  }, [state.activeDoc, dispatch]);

  const exportPdf = useCallback(async (opts = {}) => {
    if (!state.activeDoc) {
      dispatch({ type: 'toast', t: { kind: 'warn', msg: 'Open a document first' } });
      return { ok: false };
    }
    dispatch({ type: 'toast', t: { kind: 'info', msg: 'Loading PDF engine…' } });
    try {
      const { buildPdf, downloadPdf } = await loadPdfLib();
      const bytes = await buildPdf(state.activeDoc, { onProgress: opts.onProgress });
      const name = (state.activeDoc.meta?.title || 'document') + '.pdf';
      downloadPdf(bytes, name);
      dispatch({ type: 'toast', t: { kind: 'ok', msg: 'Exported ' + name } });
      return { ok: true, name };
    } catch (e) {
      console.error(e);
      dispatch({ type: 'toast', t: { kind: 'error', msg: 'PDF failed: ' + e.message } });
      return { ok: false, error: e.message };
    }
  }, [state.activeDoc, dispatch]);

  // Debounced autosave.
  const _autosaveTimers = useDocActions._timers || (useDocActions._timers = {});
  const autosaveDoc = useCallback(() => {
    if (!state.activeDoc) return;
    const key = state.activeDocId || 'default';
    clearTimeout(_autosaveTimers[key]);
    _autosaveTimers[key] = setTimeout(() => {
      autosave(state.activeDoc, key);
    }, 1500);
  }, [state.activeDoc, state.activeDocId]);

  return { newDoc, openFile, save, exportPdf, autosaveDoc };
}

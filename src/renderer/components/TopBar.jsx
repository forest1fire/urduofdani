import React, { useEffect, useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from './Icons.jsx';
import Brand from './Brand.jsx';
import { useDocActions } from '../lib/useDocActions.js';

/**
 * TopBar — the main command bar.
 *
 *   Left:  brand + document tabs (Photoshop / Word style)
 *   Center: a real ⌘K search box (read-only, opens the palette on click)
 *   Right:  New, Open, Save, PDF (primary), theme toggle, language toggle, profile
 *
 * Shortcuts:
 *   Ctrl/Cmd + S   — save
 *   Ctrl/Cmd + O   — open .udani
 *   Ctrl/Cmd + E   — export PDF
 *   Ctrl/Cmd + N   — new document
 *   Ctrl/Cmd + K   — open command palette (handled in App)
 *   Ctrl/Cmd + 1..6 — switch activity view
 */
export default function TopBar() {
  const { state, dispatch } = useStore();
  const { save, openFile, exportPdf, newDoc } = useDocActions();
  const [saved, setSaved] = useState(true);

  // Cmd/Ctrl + S/O/E/N keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      const cmd = e.metaKey || e.ctrlKey;
      if (!cmd) return;
      const k = e.key.toLowerCase();
      if (k === 's') { e.preventDefault(); save(); flashSaved(); }
      else if (k === 'o') { e.preventDefault(); openFile(); }
      else if (k === 'e') { e.preventDefault(); exportPdf(); }
      else if (k === 'n') { e.preventDefault(); newDoc('Untitled', {}); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [save, openFile, exportPdf, newDoc]);

  // Track saved state from openDocs
  useEffect(() => {
    const anyDirty = state.openDocs.some(d => d.unsaved);
    setSaved(!anyDirty);
  }, [state.openDocs]);

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(state.openDocs.some(d => d.unsaved) === false), 1500);
  };

  const hasDoc = state.activeDoc != null;

  return (
    <header className="topbar" role="banner">
      <div className="topbar-logo">
        <Brand size={22} />
        <span>UrduOfDani</span>
      </div>

      {state.openDocs.length > 0 && (
        <div className="row" style={{ gap: 4, marginLeft: 8, flex: '0 1 auto', minWidth: 0, overflow: 'hidden' }}>
          {state.openDocs.slice(0, 6).map(d => {
            const doc = state.documents.find(x => x.id === d.id);
            if (!doc) return null;
            const isActive = state.activeDocId === d.id;
            return (
              <div key={d.id} className={`topbar-tab${isActive ? ' active' : ''}`}
                   onClick={() => dispatch({ type: 'select-doc', id: d.id })}>
                <Icon.Doc style={{ fontSize: 14 }} />
                <span>{doc.name}</span>
                {d.unsaved && <span title="Unsaved">●</span>}
                <span className="close-x" role="button"
                      onClick={(e) => { e.stopPropagation(); dispatch({ type: 'close-doc', id: d.id }); }}
                      aria-label="Close tab">×</span>
              </div>
            );
          })}
          <button className="topbar-btn" title="New document (Ctrl+N)" aria-label="New document"
                  onClick={() => dispatch({ type: 'set-route', route: 'new' })}>+</button>
        </div>
      )}

      <div className="topbar-spacer" />

      <input className="topbar-search" placeholder="Search documents, tools, settings… (Ctrl+K)"
             readOnly aria-label="Search (opens command palette)"
             onClick={() => dispatch({ type: 'open-cmd' })} />
      <kbd style={{ marginLeft: 4 }}>Ctrl K</kbd>

      <div className="row" style={{ gap: 4, marginLeft: 12 }}>
        <button className="topbar-btn" title="Open .udani file (Ctrl+O)" aria-label="Open file"
                onClick={openFile}>
          <Icon.Upload style={{ width: 14, height: 14 }} /> Open
        </button>
        <button className="topbar-btn" title="Save (Ctrl+S)" aria-label="Save"
                disabled={!hasDoc} onClick={() => { save(); flashSaved(); }}>
          {saved ? <Icon.Check style={{ width: 14, height: 14, color: 'var(--color-success)' }} /> : <Icon.Download style={{ width: 14, height: 14 }} />}
          {saved ? 'Saved' : 'Save'}
        </button>
        <button className="topbar-btn topbar-btn-primary" title="Export PDF (Ctrl+E)" aria-label="Export PDF"
                disabled={!hasDoc} onClick={exportPdf}>
          <Icon.Print style={{ width: 14, height: 14 }} /> PDF
        </button>
      </div>

      {state.openDocs.length > 0 && (
        <span className={`saved-pill ${saved ? 'saved' : 'dirty'}`}>
          {saved ? '✓ Saved' : '● Unsaved'}
        </span>
      )}

      <button className="topbar-btn btn-icon" title="Toggle language" aria-label="Toggle language"
              onClick={() => dispatch({ type: 'set-lang', lang: state.lang === 'en' ? 'ur' : 'en' })}>
        <span style={{ fontSize: 'var(--fs-12)', fontWeight: 600 }}>
          {state.lang === 'en' ? 'اردو' : 'EN'}
        </span>
      </button>

      <button className="avatar avatar-sm" title="Profile — Muhammad Danish [Dani]"
              onClick={() => dispatch({ type: 'set-route', route: 'help' })}
              style={{ cursor: 'pointer', border: 'none', marginLeft: 4 }}>
        MD
      </button>
    </header>
  );
}

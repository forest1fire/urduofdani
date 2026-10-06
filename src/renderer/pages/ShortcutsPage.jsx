import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import PageHeader from '../components/PageHeader.jsx';

const ALL = [
  { cat: 'Editing', id: 'undo',      name: 'Undo',                keys: ['Ctrl','Z'] },
  { cat: 'Editing', id: 'redo',      name: 'Redo',                keys: ['Ctrl','Shift','Z'] },
  { cat: 'Editing', id: 'save',      name: 'Save',                keys: ['Ctrl','S'] },
  { cat: 'Editing', id: 'find',      name: 'Find',                keys: ['Ctrl','F'] },
  { cat: 'Editing', id: 'replace',   name: 'Find & replace',      keys: ['Ctrl','H'] },
  { cat: 'Editing', id: 'spell',     name: 'Spell-check',         keys: ['F7'] },
  { cat: 'Layout',  id: 'frame',     name: 'Insert text frame',   keys: ['Ctrl','Shift','T'] },
  { cat: 'Layout',  id: 'dup',       name: 'Duplicate selection', keys: ['Ctrl','D'] },
  { cat: 'Layout',  id: 'group',     name: 'Group',               keys: ['Ctrl','G'] },
  { cat: 'Layout',  id: 'ungroup',   name: 'Ungroup',             keys: ['Ctrl','Shift','G'] },
  { cat: 'View',    id: 'focus',     name: 'Focus mode',          keys: ['F11'] },
  { cat: 'View',    id: 'cmd',       label: 'Command palette',     name: 'Command palette', keys: ['Ctrl','K'] },
  { cat: 'View',    id: 'preview',   name: 'Print preview',       keys: ['Ctrl','Shift','P'] },
  { cat: 'Insert',  id: 'image',     name: 'Insert image',        keys: ['Ctrl','I'] },
  { cat: 'Insert',  id: 'table',     name: 'Insert table',        keys: ['Ctrl','Alt','T'] },
  { cat: 'Text',    id: 'bold',      name: 'Bold',                keys: ['Ctrl','B'] },
  { cat: 'Text',    id: 'italic',    name: 'Italic',              keys: ['Ctrl','I'] },
];

const CATS = ['all', 'editing', 'layout', 'view', 'insert', 'text'];

export default function ShortcutsPage() {
  const { dispatch } = useStore();
  const [tab, setTab] = useState('all');
  const [sel, setSel] = useState('frame');
  const [q, setQ] = useState('');
  const [recording, setRecording] = useState(false);
  const [draft, setDraft] = useState(null);
  const [custom, setCustom] = useState({});

  // Listen for key press while recording.
  useEffect(() => {
    if (!recording) return;
    const onKey = (e) => {
      e.preventDefault();
      const parts = [];
      if (e.ctrlKey || e.metaKey) parts.push('Ctrl');
      if (e.shiftKey) parts.push('Shift');
      if (e.altKey) parts.push('Alt');
      const k = e.key;
      if (!['Control', 'Shift', 'Alt', 'Meta'].includes(k)) {
        parts.push(k.length === 1 ? k.toUpperCase() : k);
        setDraft(parts);
        setRecording(false);
        // Check conflicts.
        const conflict = ALL.find(s => {
          const k2 = (custom[s.id] || s.keys).join('+');
          return k2 === parts.join('+') && s.id !== sel;
        });
        if (conflict) {
          dispatch({ type: 'toast', t: { msg: `"${parts.join('+')}" is already used by ${conflict.name}`, kind: 'warning' } });
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [recording, sel, custom, dispatch]);

  const filtered = useMemo(() => {
    return ALL.filter(s => {
      if (tab !== 'all' && s.cat.toLowerCase() !== tab) return false;
      if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [tab, q]);

  const item = ALL.find(s => s.id === sel);
  const currentKeys = (item && (custom[item.id] || item.keys)) || [];

  const save = () => {
    if (!item || !draft) return;
    setCustom(c => ({ ...c, [item.id]: draft }));
    setDraft(null);
    dispatch({ type: 'toast', t: { msg: `Shortcut for "${item.name}" updated`, kind: 'ok' } });
  };

  return (
    <div className="page">
      <PageHeader
        title="Keyboard shortcuts"
        subtitle="All commands, grouped and searchable. Customise keys to your hand."
        back
        actions={
          <button className="btn btn-secondary" onClick={() => {
            setCustom({});
            dispatch({ type: 'toast', t: { msg: 'All shortcuts reset to defaults', kind: 'ok' } });
          }}>
            <Icon.Refresh style={{ width: 14, height: 14 }} /> Reset defaults
          </button>
        }
      />

      <div className="page-body">
        <div className="row-between mb-4" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 240, maxWidth: 480 }}>
            <Icon.Search style={{ position: 'absolute', top: 11, left: 12, color: 'var(--color-text-muted)', width: 14, height: 14 }} />
            <input className="input" placeholder="Search commands…" value={q} onChange={e => setQ(e.target.value)} style={{ paddingLeft: 36 }} />
          </div>
          <select className="select input-sm" defaultValue="default">
            <option value="default">UrduOfDani default</option>
            <option value="inpage">InPage (legacy)</option>
            <option value="word">Microsoft Word</option>
            <option value="psd">Adobe Photoshop</option>
            <option value="custom">My custom set</option>
          </select>
          <div className="chip-row">
            {CATS.map(c => (
              <button key={c} className={`chip${tab === c ? ' active' : ''}`} onClick={() => setTab(c)} style={{ textTransform: 'capitalize' }}>{c}</button>
            ))}
          </div>
        </div>

        <div className="grid-3" style={{ gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 16 }}>
          <main>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {Object.entries(groupBy(filtered, 'cat')).length === 0 ? (
                <div className="empty-state" style={{ padding: 48 }}>
                  <Icon.Search style={{ width: 32, height: 32, color: 'var(--color-text-muted)', marginBottom: 8 }} />
                  <div>No commands match &ldquo;{q}&rdquo;</div>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: '40%' }}>Command</th>
                      <th>Shortcut</th>
                      <th style={{ width: 60 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(groupBy(filtered, 'cat')).map(([cat, items]) => (
                      <React.Fragment key={cat}>
                        <tr>
                          <td colSpan={3} style={{ background: 'var(--color-bg-sunken)', fontWeight: 700, color: 'var(--color-text)', fontSize: 'var(--fs-12)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                            {cat}
                          </td>
                        </tr>
                        {items.map(s => {
                          const keys = custom[s.id] || s.keys;
                          return (
                            <tr key={s.id} onClick={() => setSel(s.id)}
                                style={{ background: sel === s.id ? 'var(--color-primary-soft)' : 'transparent', cursor: 'pointer' }}>
                              <td style={{ fontWeight: sel === s.id ? 600 : 400, color: 'var(--color-text)' }}>{s.name}</td>
                              <td>{keys.map((k, i) => <span key={i} style={{ marginRight: 4 }}><kbd>{k}</kbd>{i < keys.length - 1 ? <span style={{ color: 'var(--color-text-muted)' }}> + </span> : null}</span>)}</td>
                              <td><Icon.Edit style={{ color: 'var(--color-text-muted)', width: 14, height: 14 }} /></td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="row mt-4" style={{ marginTop: 12, gap: 6, color: 'var(--color-success)' }}>
              <Icon.Check style={{ width: 14, height: 14 }} />
              <span className="text-sm">Offline ready · all shortcuts work without internet</span>
            </div>
          </main>

          <aside className="card">
            <h5>Edit shortcut</h5>
            {item ? (
              <>
                <div className="text-sm text-muted" style={{ marginBottom: 4 }}>Command</div>
                <div style={{ fontWeight: 600, fontSize: 'var(--fs-16)', marginBottom: 12 }}>{item.name}</div>

                <div className="text-sm text-muted" style={{ marginBottom: 4 }}>Current shortcut</div>
                <div style={{ marginBottom: 12 }}>
                  {currentKeys.map((k, i) => <span key={i} style={{ marginRight: 4 }}><kbd>{k}</kbd>{i < currentKeys.length - 1 ? <span style={{ color: 'var(--color-text-muted)' }}> + </span> : null}</span>)}
                </div>

                <div className="text-sm text-muted" style={{ marginBottom: 4 }}>New shortcut</div>
                <div className="row" style={{ gap: 4, marginBottom: 8, minHeight: 32, alignItems: 'center' }}>
                  {recording ? (
                    <span className="chip chip-warning" style={{ animation: 'pulse 1.2s ease-in-out infinite' }}>
                      <Icon.Mic style={{ width: 12, height: 12 }} /> Press keys…
                    </span>
                  ) : draft ? (
                    draft.map((k, i) => <span key={i} style={{ marginRight: 4 }}><kbd>{k}</kbd>{i < draft.length - 1 ? <span style={{ color: 'var(--color-text-muted)' }}> + </span> : null}</span>)
                  ) : (
                    <span className="text-sm text-muted">No change yet</span>
                  )}
                </div>

                {draft && (() => {
                  const conflict = ALL.find(s => {
                    const k2 = (custom[s.id] || s.keys).join('+');
                    return k2 === draft.join('+') && s.id !== sel;
                  });
                  if (conflict) {
                    return (
                      <div className="banner banner-warning" style={{ marginTop: 4, fontSize: 'var(--fs-13)' }}>
                        <Icon.Warning style={{ width: 14, height: 14 }} />
                        <span>Already used by <strong>{conflict.name}</strong></span>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="row" style={{ gap: 6, marginTop: 12 }}>
                  <button className={`btn ${recording ? 'btn-secondary' : 'btn-primary'}`} onClick={() => setRecording(r => !r)} style={{ flex: 1, justifyContent: 'center' }}>
                    <Icon.Keyboard style={{ width: 14, height: 14 }} /> {recording ? 'Cancel' : 'Record shortcut'}
                  </button>
                  <button className="btn btn-secondary" onClick={save} disabled={!draft} style={{ flex: 1, justifyContent: 'center' }}>
                    <Icon.Check style={{ width: 14, height: 14 }} /> Save
                  </button>
                </div>

                <div className="banner banner-info" style={{ marginTop: 12, fontSize: 'var(--fs-13)' }}>
                  <Icon.Info style={{ width: 14, height: 14 }} />
                  <span>Changes apply after saving.</span>
                </div>
              </>
            ) : (
              <div className="empty-state" style={{ padding: 32 }}>
                <Icon.Keyboard style={{ width: 28, height: 28, color: 'var(--color-text-muted)' }} />
                <div className="text-sm">Pick a command</div>
              </div>
            )}

            <hr style={{ margin: '12px 0', border: 0, borderTop: '1px solid var(--color-border)' }} />

            <details>
              <summary style={{ fontWeight: 600, color: 'var(--color-text)', cursor: 'pointer' }}>Import / Export</summary>
              <div className="row" style={{ gap: 6, marginTop: 8 }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  <Icon.Download style={{ width: 12, height: 12 }} /> Export .json
                </button>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  <Icon.Upload style={{ width: 12, height: 12 }} /> Import
                </button>
              </div>
            </details>
          </aside>
        </div>
      </div>
    </div>
  );
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    (acc[item[key]] = acc[item[key]] || []).push(item);
    return acc;
  }, {});
}

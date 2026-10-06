import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';

const ALL = [
  { cat: 'Editing', id: 'undo',      name: 'Undo',                keys: ['Ctrl','Z'] },
  { cat: 'Editing', id: 'redo',      name: 'Redo',                keys: ['Ctrl','Shift','Z'] },
  { cat: 'Editing', id: 'save',      name: 'Save',                keys: ['Ctrl','S'] },
  { cat: 'Editing', id: 'find',      name: 'Find',                keys: ['Ctrl','F'] },
  { cat: 'Layout',  id: 'frame',     name: 'Insert text frame',   keys: ['Ctrl','Shift','T'] },
  { cat: 'Layout',  id: 'dup',       name: 'Duplicate selection', keys: ['Ctrl','D'] },
  { cat: 'View',    id: 'focus',     name: 'Focus mode',          keys: ['F11'] },
];

export default function ShortcutsPage() {
  const { state, dispatch } = useStore();
  const [tab, setTab] = useState('all');
  const [sel, setSel] = useState('frame');
  const cats = ['all','editing','layout','view'];
  const filtered = tab === 'all' ? ALL : ALL.filter(s => s.cat.toLowerCase() === tab);
  const item = ALL.find(s => s.id === sel);

  return (
    <div className="page" style={{ padding: 32 }}>
      <div className="page-header">
        <button className="page-back" onClick={() => dispatch({ type: 'set-route', route: 'editor' })}><Icon.ArrowLeft /> Back to editor</button>
        <h1 className="page-title" style={{ marginLeft: 16 }}>Keyboard shortcuts</h1>
        <button className="btn btn-secondary" style={{ marginLeft: 'auto' }} onClick={() => dispatch({ type: 'toast', t: 'Shortcuts reset ✓' })}>
          <Icon.Refresh /> Reset defaults
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0 }}>Keyboard shortcuts</h2>
          <p style={{ color: 'var(--slate-500)' }}>Work faster with keys that suit you.</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <main>
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Icon.Search style={{ position: 'absolute', top: 10, left: 10, color: 'var(--slate-300)' }} />
              <input className="input" placeholder="Search commands…" style={{ paddingLeft: 32 }} />
            </div>
            <select className="select" style={{ width: 200 }}><option>UrduOfDani default</option></select>
            <div className="chip-row">
              {cats.map(c => (
                <button key={c} className={`chip${tab === c ? ' active' : ''}`} onClick={() => setTab(c)} style={{ textTransform: 'capitalize' }}>{c}</button>
              ))}
            </div>
          </div>
          <table className="table">
            <thead><tr><th>Command</th><th>Shortcut</th><th></th></tr></thead>
            <tbody>
              {Object.entries(groupBy(filtered, 'cat')).map(([cat, items]) => (
                <React.Fragment key={cat}>
                  <tr><td colSpan={3} style={{ background: 'var(--slate-50)', fontWeight: 700, color: 'var(--navy-900)' }}>{cat.toUpperCase()}</td></tr>
                  {items.map(s => (
                    <tr key={s.id} onClick={() => setSel(s.id)} style={{ background: sel === s.id ? 'var(--emerald-50)' : 'transparent', cursor: 'pointer' }}>
                      <td>{s.name}</td>
                      <td>{s.keys.map((k, i) => <span key={i}><span className="chip" style={{ marginRight: 4 }}>{k}</span>{i < s.keys.length - 1 ? <span style={{ marginRight: 4 }}>+</span> : null}</span>)}</td>
                      <td><Icon.Edit style={{ color: 'var(--slate-500)' }} /></td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </main>
        <aside className="card">
          <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Edit shortcut</h3>
          <h4 style={{ marginTop: 12 }}>{item.name}</h4>
          <label className="label">New shortcut</label>
          <div style={{ display: 'flex', gap: 4 }}>
            {item.keys.map((k, i) => (
              <React.Fragment key={i}>
                <span className="chip" style={{ background: 'var(--slate-50)' }}>{k}</span>
                {i < item.keys.length - 1 && <span>+</span>}
              </React.Fragment>
            ))}
          </div>
          <p style={{ color: 'var(--slate-500)', fontSize: 13 }}>Press your new key combination.</p>
          <div className="banner banner-warning" style={{ marginTop: 8 }}>
            ⚠ <strong>Already used by</strong><br />
            <strong style={{ color: 'var(--warning-500)' }}>Duplicate selection</strong><br />
            <span style={{ fontSize: 12 }}>This shortcut is already assigned to another command. Choose a different combination or reassign it.</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-secondary">Choose another</button>
            <button className="btn btn-secondary">Reassign</button>
          </div>
          <p style={{ color: 'var(--info-500)', fontSize: 13, marginTop: 8 }}><Icon.Help_O /> Changes apply after saving.</p>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>Save changes</button>
          <details style={{ marginTop: 12 }}><summary style={{ fontWeight: 600, color: 'var(--navy-900)' }}>Import / Export shortcuts</summary></details>
        </aside>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--emerald-500)', marginTop: 16 }}>
        <Icon.Check /> Offline ready
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
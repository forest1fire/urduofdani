import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';

export default function ColorsShapesPage() {
  const { state, dispatch } = useStore();
  const [tab, setTab] = useState('colors');
  const [sel, setSel] = useState('c2');
  const c = state.colors.find(x => x.id === sel);
  return (
    <div className="page" style={{ padding: 32 }}>
      <div className="page-header">
        <button className="page-back" onClick={() => dispatch({ type: 'set-route', route: 'editor' })}><Icon.ArrowLeft /> Back to editor</button>
        <h1 className="page-title" style={{ marginLeft: 16 }}>Colors &amp; shapes</h1>
        <div style={{ marginLeft: 'auto' }}><Icon.Help_O /> Help</div>
      </div>
      <div className="page-3col" style={{ padding: '16px 32px' }}>
        <aside>
          {tab === 'colors' ? [
            ['doc','Document colors', true], ['pal','Saved palettes', false], ['recent','Recent colors', false]
          ].map(([id, l, active]) => (
            <button key={id} className={`sidenav-item ${active ? 'active' : ''}`}>
              <Icon.Color className="icon" /><span>{l}</span>
            </button>
          )) : [
            ['basic','Basic shapes', true], ['lines','Lines & arrows', false], ['borders','Decorative borders', false], ['saved','Saved shapes', false]
          ].map(([id, l, active]) => (
            <button key={id} className={`sidenav-item ${active ? 'active' : ''}`}>
              <Icon.Shapes className="icon" /><span>{l}</span>
            </button>
          ))}
        </aside>
        <main>
          <div className="tabs" style={{ padding: 0, borderBottom: 0 }}>
            <button className={`tab${tab === 'colors' ? ' active' : ''}`} onClick={() => setTab('colors')}>Colors</button>
            <button className={`tab${tab === 'shapes' ? ' active' : ''}`} onClick={() => setTab('shapes')}>Shapes</button>
          </div>
          {tab === 'colors' && (
            <>
              <h2 style={{ marginTop: 12 }}>Keep your design consistent</h2>
              <p style={{ color: 'var(--slate-500)' }}>Reuse colors throughout your document.</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Icon.Search style={{ position: 'absolute', top: 10, left: 10, color: 'var(--slate-300)' }} />
                  <input className="input" placeholder="Search colors…" style={{ paddingLeft: 32 }} />
                </div>
                <button className="btn btn-primary"><Icon.Plus /> Add color</button>
              </div>
              <div className="grid-6" style={{ gap: 12, marginTop: 16 }}>
                {state.colors.map(col => (
                  <div key={col.id} className={`card card-hoverable${sel === col.id ? ' selected' : ''}`}
                       style={{ padding: 8, textAlign: 'center' }} onClick={() => setSel(col.id)}>
                    <div style={{ height: 80, background: col.hex, borderRadius: 6, marginBottom: 8 }} />
                    <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{col.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>{col.hex}</div>
                  </div>
                ))}
              </div>
              <h3 style={{ marginTop: 24 }}>Saved palette</h3>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <strong>UrduOfDani</strong>
                <div style={{ display: 'flex', gap: 4 }}>
                  {state.colors.map(col => (
                    <div key={col.id} style={{ width: 28, height: 28, background: col.hex, borderRadius: 4 }} />
                  ))}
                </div>
                <div style={{ marginLeft: 'auto' }}><button className="btn btn-secondary"><Icon.Doc /> Save palette</button></div>
              </div>
              <p style={{ marginTop: 12, color: 'var(--info-500)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon.Help_O /> Preview colors before print export.
              </p>
            </>
          )}
          {tab === 'shapes' && <ShapesBody sel={sel} setSel={setSel} />}
        </main>
        <aside className="card">
          <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>{tab === 'colors' ? 'Edit color' : 'Shape properties'}</h3>
          {tab === 'colors' ? (
            <>
              <div style={{ height: 60, background: c.hex, borderRadius: 8, margin: '12px 0' }} />
              <label className="label">Name</label>
              <input className="input" defaultValue={c.name} />
              <label className="label" style={{ marginTop: 8 }}>Hex</label>
              <input className="input" defaultValue={c.hex} />
              <label className="label" style={{ marginTop: 8 }}>RGB</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 6 }}>
                <input className="input" defaultValue="0" /><input className="input" defaultValue="143" /><input className="input" defaultValue="118" />
              </div>
              <label className="label" style={{ marginTop: 8 }}>Opacity</label>
              <input type="range" defaultValue={100} style={{ width: '100%' }} />
              <div style={{ marginTop: 12, color: 'var(--slate-500)' }}><Icon.Layers style={{ fontSize: 12 }} /> Used in 8 objects</div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>Apply to selection</button>
              <button className="btn btn-secondary" style={{ width: '100%', marginTop: 8 }}>Save changes</button>
            </>
          ) : (
            <>
              <label className="label">Fill color</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 36, height: 24, background: 'var(--emerald-500)', borderRadius: 4 }} />
                <input className="input" defaultValue="#008F76" />
              </div>
              <label className="label" style={{ marginTop: 8 }}>Border color</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 36, height: 24, background: 'var(--navy-900)', borderRadius: 4 }} />
                <input className="input" defaultValue="#102A43" />
              </div>
              <label className="label" style={{ marginTop: 8 }}>Border width</label>
              <select className="select"><option>1 pt</option><option>0.5 pt</option><option>2 pt</option></select>
              <div className="grid-2" style={{ gap: 6, marginTop: 8 }}>
                <div><label className="label">Width</label><input className="input" defaultValue="60 mm" /></div>
                <div><label className="label">Height</label><input className="input" defaultValue="30 mm" /></div>
              </div>
              <label className="label" style={{ marginTop: 8 }}>Corner radius</label>
              <input className="input" defaultValue="4 mm" />
              <label className="label" style={{ marginTop: 8 }}>Opacity</label>
              <input type="range" defaultValue={100} style={{ width: '100%' }} />
              <details><summary style={{ fontWeight: 600, color: 'var(--navy-900)' }}>Position</summary></details>
              <details><summary style={{ fontWeight: 600, color: 'var(--navy-900)' }}>Alignment</summary></details>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}><Icon.Plus /> Insert into document</button>
              <button className="btn btn-secondary" style={{ width: '100%', marginTop: 8 }}><Icon.Doc /> Save shape</button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function ShapesBody({ sel, setSel }) {
  const SHAPES = [
    { id: 's1', name: 'Rectangle' }, { id: 's2', name: 'Rounded rectangle' }, { id: 's3', name: 'Circle' }, { id: 's4', name: 'Triangle' },
    { id: 's5', name: 'Line' }, { id: 's6', name: 'Arrow' }, { id: 's7', name: 'Diamond' }, { id: 's8', name: 'Star' },
  ];
  return (
    <>
      <h2 style={{ marginTop: 12 }}>Build clean layouts with shapes</h2>
      <p style={{ color: 'var(--slate-500)' }}>Add simple shapes to your document and customize them.</p>
      <div style={{ position: 'relative' }}>
        <Icon.Search style={{ position: 'absolute', top: 10, left: 10, color: 'var(--slate-300)' }} />
        <input className="input" placeholder="Search shapes…" style={{ paddingLeft: 32 }} />
      </div>
      <div className="grid-4" style={{ gap: 12, marginTop: 16 }}>
        {SHAPES.map(s => (
          <div key={s.id} className={`card card-hoverable${sel === s.id ? ' selected' : ''}`}
               style={{ padding: 16, textAlign: 'center' }} onClick={() => setSel(s.id)}>
            <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {s.name === 'Rectangle' && <div style={{ width: 60, height: 40, border: '2px solid var(--navy-900)' }} />}
              {s.name === 'Rounded rectangle' && <div style={{ width: 60, height: 40, border: '2px solid var(--navy-900)', borderRadius: 12, background: 'var(--emerald-100)' }} />}
              {s.name === 'Circle' && <div style={{ width: 50, height: 50, border: '2px solid var(--navy-900)', borderRadius: '50%' }} />}
              {s.name === 'Triangle' && <div style={{ width: 0, height: 0, borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderBottom: '52px solid var(--navy-900)' }} />}
              {s.name === 'Line' && <div style={{ width: 60, height: 2, background: 'var(--navy-900)' }} />}
              {s.name === 'Arrow' && <div style={{ fontSize: 32, color: 'var(--navy-900)' }}>→</div>}
              {s.name === 'Diamond' && <div style={{ width: 36, height: 36, border: '2px solid var(--navy-900)', transform: 'rotate(45deg)' }} />}
              {s.name === 'Star' && <div style={{ fontSize: 36, color: 'var(--navy-900)' }}>★</div>}
            </div>
            <div style={{ marginTop: 8, fontWeight: 600, color: 'var(--navy-900)' }}>{s.name}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 16, padding: 32, background: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
        <div style={{ width: 200, height: 80, background: 'var(--emerald-500)', borderRadius: 8, border: '2px dashed var(--slate-200)' }} />
      </div>
    </>
  );
}
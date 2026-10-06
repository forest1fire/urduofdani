import React, { useState } from 'react';
import Icon from '../components/Icons.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useStore } from '../store/Store.jsx';

export default function ShapesPage() {
  const { dispatch } = useStore();
  const SHAPES = [
    { id: 's1', name: 'Rectangle' }, { id: 's2', name: 'Rounded rectangle' }, { id: 's3', name: 'Circle' }, { id: 's4', name: 'Triangle' },
    { id: 's5', name: 'Line' }, { id: 's6', name: 'Arrow' }, { id: 's7', name: 'Diamond' }, { id: 's8', name: 'Star' },
  ];
  const [sel, setSel] = useState('s2');
  return (
    <div className="page">
      <PageHeader title={"Shape builder"} back onBack={() => dispatch({ type: 'set-route', route: "editor" })} />
      <p style={{ color: 'var(--color-text-muted)' }}>Add simple shapes to your document and customize them.</p>
      <div className="page-2col">
        <main>
          <div style={{ position: 'relative' }}>
            <Icon.Search style={{ position: 'absolute', top: 10, left: 10, color: 'var(--color-text-subtle)' }} />
            <input className="input" placeholder="Search shapes…" style={{ paddingLeft: 32 }} />
          </div>
          <div className="grid-4" style={{ gap: 12, marginTop: 16 }}>
            {SHAPES.map(s => (
              <div key={s.id} className={`card card-hoverable${sel === s.id ? ' selected' : ''}`}
                   style={{ padding: 16, textAlign: 'center' }} onClick={() => setSel(s.id)}>
                <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.name === 'Rectangle' && <div style={{ width: 60, height: 40, border: '2px solid var(--color-text)' }} />}
                  {s.name === 'Rounded rectangle' && <div style={{ width: 60, height: 40, border: '2px solid var(--color-text)', borderRadius: 12, background: 'var(--color-primary-soft)' }} />}
                  {s.name === 'Circle' && <div style={{ width: 50, height: 50, border: '2px solid var(--color-text)', borderRadius: '50%' }} />}
                  {s.name === 'Triangle' && <div style={{ width: 0, height: 0, borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderBottom: '52px solid var(--color-text)' }} />}
                  {s.name === 'Line' && <div style={{ width: 60, height: 2, background: 'var(--color-text)' }} />}
                  {s.name === 'Arrow' && <div style={{ fontSize: 32, color: 'var(--color-text)' }}>→</div>}
                  {s.name === 'Diamond' && <div style={{ width: 36, height: 36, border: '2px solid var(--color-text)', transform: 'rotate(45deg)' }} />}
                  {s.name === 'Star' && <div style={{ fontSize: 36, color: 'var(--color-text)' }}>★</div>}
                </div>
                <div style={{ marginTop: 8, fontWeight: 600, color: 'var(--color-text)' }}>{s.name}</div>
              </div>
            ))}
          </div>
        </main>
        <aside className="card">
          <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Shape properties</h3>
          <label className="label" style={{ marginTop: 8 }}>Fill color</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 36, height: 24, background: 'var(--color-primary)', borderRadius: 4 }} />
            <input className="input" defaultValue="#008F76" />
          </div>
          <label className="label" style={{ marginTop: 8 }}>Border color</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 36, height: 24, background: 'var(--color-text)', borderRadius: 4 }} />
            <input className="input" defaultValue="#102A43" />
          </div>
          <label className="label" style={{ marginTop: 8 }}>Border width</label>
          <select className="select"><option>1 pt</option><option>2 pt</option></select>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 6, marginTop: 8 }}>
            <div><label className="label">Width</label><input className="input" defaultValue="60 mm" /></div>
            <div><label className="label">Height</label><input className="input" defaultValue="30 mm" /></div>
          </div>
          <label className="label" style={{ marginTop: 8 }}>Corner radius</label>
          <input className="input" defaultValue="4 mm" />
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}><Icon.Plus /> Insert into document</button>
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: 8 }}><Icon.Doc /> Save shape</button>
        </aside>
      </div>
    </div>
  );
}
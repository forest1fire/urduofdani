import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import PageHeader from '../components/PageHeader.jsx';

const MASTERS = [
  { id: 'A', name: 'A — Magazine', facing: true },
  { id: 'B', name: 'B — Chapter', facing: true },
  { id: 'C', name: 'C — Blank', facing: false },
];

export default function MastersPage() {
  const { dispatch } = useStore();
  const [sel, setSel] = useState('A');
  const m = MASTERS.find(x => x.id === sel);
  return (
    <div className="page">
      <PageHeader title={"Masters"} back onBack={() => dispatch({ type: 'set-route', route: "editor" })} />
      <div className="page-3col">
        <aside>
          {MASTERS.map(x => (
            <div key={x.id} className={`card card-hoverable${x.id === sel ? ' selected' : ''}`}
                 style={{ marginBottom: 8, padding: 12 }}
                 onClick={() => setSel(x.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 24, color: 'var(--color-primary)' }}>{x.id}</strong>
                <Icon.Move style={{ color: 'var(--color-text-subtle)' }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>{x.name}</div>
            </div>
          ))}
          <button className="btn btn-primary" style={{ width: '100%' }}><Icon.Plus /> New master</button>
        </aside>
        <main>
          <div className="spread">
            {m.facing ? (
              <>
                <div className="page-sheet">
                  <div className="page-num" style={{ textAlign: 'left' }}>3</div>
                  <div style={{ fontFamily: 'var(--font-urdu)', fontSize: 14, color: 'var(--color-text)' }}>اردو کی خوبصورتی</div>
                  <div className="frame" style={{ minHeight: 380 }} />
                  <div style={{ height: 6 }} />
                </div>
                <div className="page-sheet">
                  <div className="page-num" style={{ textAlign: 'left' }}>4</div>
                  <div style={{ fontFamily: 'var(--font-urdu)', fontSize: 14, color: 'var(--color-text)', textAlign: 'right' }}>اردو کی خوبصورتی</div>
                  <div className="frame" style={{ minHeight: 380 }} />
                </div>
              </>
            ) : (
              <div className="page-sheet"><div className="frame" style={{ minHeight: 480 }} /></div>
            )}
          </div>
        </main>
        <aside className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: 'var(--color-text)' }}>{m.name}</h3>
            <Icon.Move />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <div>
              <strong>Facing pages</strong>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>Show left and right pages.</p>
            </div>
            <label className="toggle"><input type="checkbox" defaultChecked={m.facing} /><span className="toggle-track" /><span className="toggle-thumb" /></label>
          </div>
          <hr style={{ margin: '12px 0', border: 0, borderTop: '1px solid var(--color-border)' }} />
          <strong>Margins (all pages)</strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 6, marginTop: 6 }}>
            {['Top','Bottom','Inside','Outside'].map((l, i) => (
              <div key={l}>
                <label className="label" style={{ fontSize: 12 }}>{l}</label>
                <input className="input" defaultValue="20 mm" />
              </div>
            ))}
          </div>
          <hr style={{ margin: '12px 0', border: 0, borderTop: '1px solid var(--color-border)' }} />
          <strong>Header</strong>
          <label className="label" style={{ marginTop: 6 }}>Header text</label>
          <input className="input with-rtl" defaultValue="اردو کی خوبصورتی" />
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Shown at outer top corner on left and right pages.</p>
          <hr style={{ margin: '12px 0', border: 0, borderTop: '1px solid var(--color-border)' }} />
          <strong>Footer</strong>
          <label className="label" style={{ marginTop: 6 }}>Footer content</label>
          <select className="select"><option>Automatic page number</option><option>Custom text</option><option>None</option></select>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Inserts the page number at the outer bottom corner of each page. Numbering follows your document settings.</p>
          <label className="label">Number style</label>
          <select className="select"><option>1, 2, 3</option><option>i, ii, iii</option><option>A, B, C</option></select>
          <details style={{ marginTop: 12 }}><summary style={{ fontWeight: 600, color: 'var(--color-text)' }}>Guides</summary></details>
          <hr style={{ margin: '12px 0', border: 0, borderTop: '1px solid var(--color-border)' }} />
          <strong>Apply master</strong>
          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
            <label><input type="radio" name="scope" /> All pages</label>
            <label><input type="radio" name="scope" defaultChecked /> Page range</label>
          </div>
          <input className="input" defaultValue="3 – 12" />
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Applies layout elements to the selected pages.</p>
          <button className="btn btn-primary" style={{ width: '100%' }}>Apply to pages</button>
        </aside>
      </div>
      <div className="statusbar">
        <span>Editing master {sel}</span>
        <div className="right">
          <button className="toolbar-btn"><Icon.ArrowLeft style={{ fontSize: 12 }} /></button>
          <span>3 – 4</span>
          <button className="toolbar-btn"><Icon.Arrow style={{ fontSize: 12 }} /></button>
          <span style={{ marginLeft: 12 }}>75%</span>
          <button className="btn btn-secondary" style={{ marginLeft: 16 }}>Done</button>
        </div>
      </div>
    </div>
  );
}
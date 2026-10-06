import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';

const SAMPLE = [
  { id: 1, title: 'اردو جہان',     bg: 'linear-gradient(135deg,#86a8b8,#3a5a72)', master: 'A' },
  { id: 2, title: 'سفر مقالہ',    bg: 'linear-gradient(135deg,#F7F5EF,#E7E2D1)', master: 'A' },
  { id: 3, title: 'ہماری ثقافت',  bg: 'linear-gradient(135deg,#a98865,#7a5e3e)', master: 'A' },
  { id: 4, title: 'قدرت کے رنگ', bg: 'linear-gradient(135deg,#7ab5b8,#3d7378)', master: 'A' },
  { id: 5, title: 'ادب و فن',     bg: 'linear-gradient(135deg,#a17e60,#6b4f3a)', master: 'B' },
  { id: 6, title: 'سفر نامہ',     bg: 'linear-gradient(135deg,#7a8a72,#3a4e3a)', master: 'A' },
];

export default function PagesManagerPage() {
  const { dispatch } = useStore();
  const [sel, setSel] = useState(3);
  const page = SAMPLE.find(p => p.id === sel);
  return (
    <div className="page" style={{ padding: 32 }}>
      <div className="page-header">
        <button className="page-back" onClick={() => dispatch({ type: 'set-route', route: 'editor' })}><Icon.ArrowLeft /> Back to editor</button>
        <h1 className="page-title" style={{ marginLeft: 16 }}>Page manager</h1>
        <div style={{ marginLeft: 'auto' }}><Icon.Help_O /> Help</div>
      </div>
      <div className="page-3col" style={{ padding: '16px 32px' }}>
        <aside>
          {[['all', 'All pages', 12], ['master', 'Master pages', 2], ['sections', 'Sections', 3]].map(([id, l, n]) => (
            <button key={id} className={`sidenav-item ${id === 'all' ? 'active' : ''}`}>
              <Icon.Doc className="icon" /><span>{l}</span><span style={{ marginLeft: 'auto', color: 'var(--slate-500)' }}>{n}</span>
            </button>
          ))}
        </aside>
        <main>
          <h2 style={{ margin: 0 }}>Organize your pages</h2>
          <p style={{ color: 'var(--slate-500)', margin: '4px 0 16px' }}>Add, duplicate and reorder pages.</p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <button className="btn btn-primary"><Icon.Plus /> Add pages</button>
            <button className="btn btn-secondary"><Icon.Doc /> Duplicate</button>
            <button className="btn btn-secondary"><Icon.Arrow /> Move</button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, background: 'var(--slate-50)', padding: 4, borderRadius: 8 }}>
              <button className="btn btn-sm btn-primary">Pages</button>
              <button className="btn btn-sm btn-ghost">Spreads</button>
            </div>
            <div style={{ position: 'relative' }}>
              <Icon.Search style={{ position: 'absolute', top: 10, left: 10, color: 'var(--slate-300)' }} />
              <input className="input" placeholder="Go to page…" style={{ paddingLeft: 32 }} />
            </div>
          </div>
          <div className="grid-3" style={{ gap: 16 }}>
            {SAMPLE.map(p => (
              <div key={p.id} className={`card card-hoverable${p.id === sel ? ' selected' : ''}`}
                   style={{ padding: 8, position: 'relative' }} onClick={() => setSel(p.id)}>
                {p.id === sel && <span style={{ position: 'absolute', top: -8, right: -8, background: 'var(--emerald-500)', color: '#fff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{p.id}</span>}
                <div style={{ aspectRatio: '0.71', background: p.bg, borderRadius: 4, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-urdu)', fontSize: 22, color: '#fff', textAlign: 'right' }}>{p.title}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{p.id}</span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 16, color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: 6 }}><Icon.Move /> Drag a page to change its order.</p>
        </main>
        <aside className="card">
          <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Page {page.id}</h3>
          <div style={{ marginTop: 12 }}>
            <label className="label">Page size</label>
            <select className="select"><option>A4 (210 × 297 mm)</option><option>A5 (148 × 210 mm)</option></select>
          </div>
          <div style={{ marginTop: 12 }}>
            <label className="label">Master page</label>
            <select className="select"><option>A — Magazine</option><option>B — Chapter</option><option>C — Blank</option></select>
          </div>
          <div style={{ marginTop: 12 }}>
            <label className="label">Section</label>
            <select className="select"><option>Main text</option><option>Front matter</option><option>Back matter</option></select>
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-track" /><span className="toggle-thumb" /></label>
            <span>Include in export</span>
          </div>
          <hr style={{ margin: '20px 0', border: 0, borderTop: '1px solid var(--slate-100)' }} />
          <h4 style={{ margin: 0 }}>Insert pages</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8, marginTop: 8 }}>
            <div><label className="label">Count</label><input type="number" className="input" defaultValue={1} /></div>
            <div><label className="label">Position</label><select className="select"><option>After page {page.id}</option><option>Before page {page.id}</option><option>End of document</option></select></div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>Add pages</button>
          <details style={{ marginTop: 16 }}><summary style={{ fontWeight: 600, color: 'var(--navy-900)' }}>Page numbering</summary></details>
        </aside>
      </div>
      <div className="statusbar">
        <span>1 page selected · 12 total</span>
        <div className="right"><button className="btn btn-secondary" onClick={() => dispatch({ type: 'set-route', route: 'editor' })}><Icon.ArrowLeft /> Back to editor</button></div>
      </div>
    </div>
  );
}
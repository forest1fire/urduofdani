import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import PageHeader from '../components/PageHeader.jsx';

export default function FontsPage() {
  const { state, dispatch } = useStore();
  const [tab, setTab] = useState('all');
  const [sel, setSel] = useState(state.fonts[0].id);
  const [size, setSize] = useState(32);
  const font = state.fonts.find(f => f.id === sel);
  const filtered = tab === 'all' ? state.fonts : state.fonts.filter(f => f.kind === tab || (tab === 'favorites' && f.favorite) || (tab === 'english' && f.family.toLowerCase().includes('inter')));

  return (
    <div className="page">
      <PageHeader title={"Fonts"} back onBack={() => dispatch({ type: 'set-route', route: "editor" })} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <header style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Fonts</h2>
        <p className="text-muted" style={{ margin: "4px 0 0" }}>Find, preview and add your fonts.</p>
      </header>
        </div>
        <button className="btn btn-primary btn-lg"><Icon.Plus /> Add fonts</button>
      </div>
      <div className="page-2col">
        <main>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Icon.Search style={{ position: 'absolute', top: 10, left: 10, color: 'var(--color-text-subtle)' }} />
              <input className="input" placeholder="Search fonts…" style={{ paddingLeft: 32 }} />
            </div>
            <div className="chip-row">
              {['all', 'urdu', 'arabic', 'english', 'favorites'].map(c => (
                <button key={c} className={`chip${tab === c ? ' active' : ''}`} onClick={() => setTab(c)} style={{ textTransform: 'capitalize' }}>{c}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(f => (
              <div key={f.id} className={`card card-hoverable${sel === f.id ? ' selected' : ''}`}
                   style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 16 }}
                   onClick={() => setSel(f.id)}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 28, color: 'var(--color-text)', fontWeight: 700, minWidth: 60 }}>Aa</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{f.family}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{f.subtitle}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-urdu)', fontSize: 22 }}>اردو کی خوبصورتی</span>
                <Icon.Star style={{ color: f.favorite ? 'var(--gold-500)' : 'var(--color-border)', fontSize: 18 }} />
                <span className="chip" style={{ background: f.imported ? 'var(--color-bg-sunken)' : 'var(--color-primary-soft)', color: f.imported ? 'var(--color-text-muted)' : 'var(--color-primary-hover)' }}>{f.imported ? 'Imported' : 'Included'}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{ marginTop: 12, padding: 24, textAlign: 'center', border: '2px dashed var(--color-border)' }}>
            <Icon.Upload style={{ fontSize: 28, color: 'var(--color-text-subtle)' }} />
            <p style={{ fontWeight: 600, color: 'var(--color-text)' }}>Drop .ttf or .otf files here</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Add to UrduOfDani.</p>
            <button className="btn btn-secondary">Choose files</button>
          </div>
        </main>
        <aside className="card">
          <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Live preview</h3>
          <label className="label">Sample text</label>
          <div style={{ position: 'relative' }}>
            <input className="input with-rtl" defaultValue="اردو کی خوبصورتی" />
            <Icon.Close style={{ position: 'absolute', right: 10, top: 10, color: 'var(--color-text-subtle)' }} />
          </div>
          <label className="label" style={{ marginTop: 12 }}>Preview</label>
          <div style={{ padding: 16, border: '1px solid var(--color-border)', borderRadius: 8, textAlign: 'right', minHeight: 100 }}
               className="rtl urdu" dir="rtl" >
            <span style={{ fontSize: size }}>{font.family === 'Noto Nastaliq Urdu' ? 'اردو کی خوبصورتی' : font.family === 'Noto Naskh Arabic' ? 'اردو کی خوبصورتی' : 'Custom Font'}</span>
          </div>
          <label className="label">Font size: {size} pt</label>
          <input type="range" min={12} max={96} value={size} onChange={e => setSize(+e.target.value)} style={{ width: '100%' }} />
          <label className="label" style={{ marginTop: 12 }}>Font style</label>
          <select className="select"><option>Regular</option><option>Bold</option><option>Italic</option></select>
          <label className="label" style={{ marginTop: 12 }}>Line spacing: 1.2</label>
          <input type="range" min={1} max={3} step={0.1} defaultValue={1.2} style={{ width: '100%' }} />
          <div className="banner banner-success" style={{ marginTop: 12 }}><Icon.Check /> Urdu supported — This font supports Urdu script.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <input type="checkbox" /> Set as default Urdu font
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}><Icon.Doc /> Use in document</button>
        </aside>
      </div>
    </div>
  );
}
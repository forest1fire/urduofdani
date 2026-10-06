import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';

const ASSETS = [
  { id: 'a1', name: 'Mountain.jpg',     used: 'Page 4', bg: 'linear-gradient(135deg,#86a8b8,#3a5a72)' },
  { id: 'a2', name: 'Garden.jpg',        used: null,     bg: 'linear-gradient(135deg,#cce5cc,#7ab07a)' },
  { id: 'a3', name: 'Architecture.jpg',  used: null,     bg: 'linear-gradient(135deg,#e6d4a8,#a98865)' },
  { id: 'a4', name: 'Lake.jpg',          used: null,     bg: 'linear-gradient(135deg,#9bb7c4,#506e7a)' },
  { id: 'a5', name: 'Pattern.png',       used: null,     bg: 'linear-gradient(135deg,#008F76,#102A43)' },
  { id: 'a6', name: 'Portrait.jpg',      used: null,     bg: 'linear-gradient(135deg,#d6c5a3,#7a6e54)' },
];

export default function ImagesPage() {
  const { dispatch } = useStore();
  const [sel, setSel] = useState('a1');
  const [tab, setTab] = useState('all');
  const a = ASSETS.find(x => x.id === sel);
  return (
    <div className="page" style={{ padding: 32 }}>
      <div className="page-header">
        <button className="page-back" onClick={() => dispatch({ type: 'set-route', route: 'editor' })}><Icon.ArrowLeft /> Back to editor</button>
        <h1 className="page-title" style={{ marginLeft: 16 }}>Images &amp; assets</h1>
        <div style={{ marginLeft: 'auto' }}><Icon.Help_O /> Help</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 320px', gap: 24 }}>
        <aside>
          {[['all','All assets'],['images','Images'],['shapes','Shapes'],['saved','Saved blocks']].map(([id, l]) => (
            <button key={id} className={`sidenav-item ${id === tab ? 'active' : ''}`} onClick={() => setTab(id)}>
              <Icon.Image className="icon" /><span>{l}</span>
            </button>
          ))}
          <hr style={{ margin: '12px 0', border: 0, borderTop: '1px solid var(--slate-100)' }} />
          {[['doc','Document assets'],['coll','My collection']].map(([id, l]) => (
            <button key={id} className={`sidenav-item`}>
              <Icon.Doc className="icon" /><span>{l}</span>
            </button>
          ))}
        </aside>
        <main>
          <h2 style={{ margin: 0 }}>Your document assets</h2>
          <p style={{ color: 'var(--slate-500)' }}>Add, organize and reuse images.</p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Icon.Search style={{ position: 'absolute', top: 10, left: 10, color: 'var(--slate-300)' }} />
              <input className="input" placeholder="Search assets" style={{ paddingLeft: 32 }} />
            </div>
            <button className="btn btn-primary"><Icon.Plus /> Add images</button>
            <button className="btn btn-secondary"><Icon.Tiles /></button>
            <button className="btn btn-secondary"><Icon.Layers /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {ASSETS.map(x => (
              <div key={x.id} className={`card card-hoverable${sel === x.id ? ' selected' : ''}`}
                   style={{ padding: 8 }} onClick={() => setSel(x.id)}>
                <div style={{ aspectRatio: '1.4', background: x.bg, borderRadius: 4, position: 'relative' }}>
                  {x.used && <span className="chip" style={{ position: 'absolute', bottom: 6, left: 6, background: 'var(--emerald-50)', color: 'var(--emerald-600)' }}>Used on {x.used}</span>}
                </div>
                <div style={{ marginTop: 6, color: 'var(--navy-900)' }}>{x.name}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{ marginTop: 12, padding: 24, textAlign: 'center', border: '2px dashed var(--slate-100)' }}>
            <Icon.Upload style={{ fontSize: 28, color: 'var(--slate-300)' }} />
            <p>Drop images here or <a href="#">choose files</a></p>
            <p style={{ color: 'var(--slate-500)', fontSize: 13 }}>Supports JPG, PNG, WebP.</p>
          </div>
          <p style={{ color: 'var(--slate-500)', fontSize: 13, marginTop: 12 }}>{ASSETS.length} assets</p>
        </main>
        <aside className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>{a.name}</h3>
            <Icon.Move />
          </div>
          <div style={{ height: 140, background: a.bg, borderRadius: 8, margin: '12px 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 6, fontSize: 13 }}>
            <span style={{ color: 'var(--slate-500)' }}>File type</span><span style={{ textAlign: 'right' }}>JPEG</span>
            <span style={{ color: 'var(--slate-500)' }}>Dimensions</span><span style={{ textAlign: 'right' }}>2400 × 1600 px</span>
            <span style={{ color: 'var(--slate-500)' }}>File size</span><span style={{ textAlign: 'right' }}>1.8 MB</span>
          </div>
          <hr style={{ margin: '12px 0', border: 0, borderTop: '1px solid var(--slate-100)' }} />
          <span>Used on</span>
          <span className="chip" style={{ marginLeft: 8, background: 'var(--emerald-50)', color: 'var(--emerald-600)' }}>Page 4</span>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}><Icon.Arrow /> Insert into document</button>
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: 8 }}><Icon.Search /> Locate on page</button>
          <details style={{ marginTop: 12 }}><summary style={{ fontWeight: 600, color: 'var(--navy-900)' }}>Image details</summary></details>
        </aside>
      </div>
    </div>
  );
}
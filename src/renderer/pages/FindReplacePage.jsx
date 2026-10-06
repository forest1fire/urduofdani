import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';

export default function FindReplacePage() {
  const { dispatch } = useStore();
  const [tab, setTab] = useState('replace');
  const [find, setFind] = useState('زبان');
  const [replace, setReplace] = useState('پول');
  return (
    <div className="page" style={{ padding: 32 }}>
      <div className="page-header">
        <button className="page-back" onClick={() => dispatch({ type: 'set-route', route: 'editor' })}><Icon.ArrowLeft /> Back to editor</button>
        <h1 className="page-title" style={{ marginLeft: 16 }}>Find &amp; replace</h1>
        <div style={{ marginLeft: 'auto' }}><Icon.Help_O /> Help</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr 280px', gap: 24 }}>
        <aside className="card">
          <div className="tabs" style={{ padding: 0 }}>
            <button className={`tab${tab === 'find' ? ' active' : ''}`} onClick={() => setTab('find')}>Find</button>
            <button className={`tab${tab === 'replace' ? ' active' : ''}`} onClick={() => setTab('replace')}>Replace</button>
          </div>
          <label className="label" style={{ marginTop: 12 }}>Find what</label>
          <input className="input with-rtl" value={find} onChange={e => setFind(e.target.value)} dir="rtl" />
          <label className="label" style={{ marginTop: 8 }}>Replace with</label>
          <input className="input with-rtl" value={replace} onChange={e => setReplace(e.target.value)} dir="rtl" />
          <label className="label" style={{ marginTop: 8 }}>Scope</label>
          <select className="select"><option>Entire document</option><option>Current page</option><option>Selection only</option></select>
          <div style={{ marginTop: 8 }}><label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-track" /><span className="toggle-thumb" /></label> Whole words only</div>
          <div><label className="toggle"><input type="checkbox" /><span className="toggle-track" /><span className="toggle-thumb" /></label> Ignore diacritics</div>
          <h4 style={{ margin: '12px 0 4px' }}>3 matches</h4>
          {[
            ['Page 1', '…علم اور زبان کی ترقی …'],
            ['Page 3', '…بر زبان کا ایک …'],
            ['Page 5', '…ہماری زبان ہماری شناخت…'],
          ].map(([p, l], idx) => (
            <div key={p} className={`card card-hoverable${idx === 1 ? ' selected' : ''}`} style={{ padding: 8, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon.Doc style={{ color: 'var(--emerald-500)' }} />
              <div style={{ flex: 1, fontSize: 13 }}>
                <div style={{ color: 'var(--navy-900)', fontWeight: 600 }}>{p}</div>
                <div className="urdu rtl" style={{ color: 'var(--slate-500)' }}>{l}</div>
              </div>
            </div>
          ))}
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>Replace</button>
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: 8 }}>Replace all (3)</button>
          <div className="banner banner-info" style={{ marginTop: 8 }}><Icon.Help_O /> Replace all can be undone.</div>
        </aside>
        <main>
          <div className="page-sheet" style={{ width: '100%', maxWidth: 500, minHeight: 600 }}>
            <div className="page-num" style={{ textAlign: 'left' }}>اردو</div>
            <div style={{ fontFamily: 'var(--font-urdu)', fontSize: 18, color: 'var(--navy-900)', textAlign: 'right' }}>اردو کی خوبصورتی</div>
            <div className="frame">
              <div className="urdu rtl" style={{ fontSize: 13, lineHeight: 1.9 }}>
                <p>اردو مرف ایک <mark style={{ background: '#FEF3C7' }}>زبان</mark> ہے۔ یہ ایک ایسی <mark style={{ background: '#FEF3C7' }}>زبان</mark> ہے جو ہکے ہزاروں لوگوں کی <mark style={{ background: '#FEF3C7' }}>زبان</mark> ہے۔ اردو کے الفاظ کا چناؤ اور اس کے ڈھانچے کی بناوٹ اسے منفرد بناتی ہے۔</p>
                <p>زبان کا ایسا لب و لہجہ، ایسی خوش آمیز الفاظ کا چناؤ اور ایسے محاورے جو عام گفتگو میں استعمال ہوتے ہیں، یہ سب اس زبان کو خاص بناتے ہیں۔</p>
                <p>آج کے دور میں بھی اردو کی اہمیت کم نہیں ہوئی ہے۔ یہ اب بھی لاکھوں لوگوں کی مادری زبان ہے۔ یہ ایک ایسی زبان ہے جس نے صدیوں سے انسانوں کو اپنے سحر میں جکڑ رکھا ہے۔</p>
              </div>
            </div>
            <div className="page-num">3</div>
          </div>
        </main>
        <aside className="card">
          <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Page</h3>
          <label className="label" style={{ marginTop: 8 }}>Size</label>
          <select className="select"><option>A4 (210 × 297 mm)</option></select>
          <label className="label" style={{ marginTop: 8 }}>Orientation</label>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="btn btn-primary">▯</button>
            <button className="btn btn-secondary">▭</button>
          </div>
          <label className="label" style={{ marginTop: 8 }}>Margins</label>
          <select className="select"><option>20 mm (Normal)</option></select>
          <label className="label" style={{ marginTop: 8 }}>Columns</label>
          <select className="select"><option>2</option></select>
          <hr style={{ margin: '12px 0', border: 0, borderTop: '1px solid var(--slate-100)' }} />
          <details><summary style={{ fontWeight: 600, color: 'var(--navy-900)' }}>Styles</summary></details>
          <details><summary style={{ fontWeight: 600, color: 'var(--navy-900)' }}>Document</summary></details>
          <details><summary style={{ fontWeight: 600, color: 'var(--navy-900)' }}>Page background</summary></details>
        </aside>
      </div>
      <div className="statusbar">
        <span>Match 2 of 3</span>
        <button className="btn btn-ghost btn-sm"><Icon.ArrowLeft /> Previous</button>
        <button className="btn btn-ghost btn-sm">Next <Icon.Arrow /></button>
        <div className="right"><span>Page 3 of 12</span><span>—</span><span>90%</span><span>+</span></div>
      </div>
    </div>
  );
}
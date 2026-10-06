import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';

export default function SpellCheckPage() {
  const { state, dispatch } = useStore();
  const s = state.spell;
  const [checkAsYouType, setCheckAsYouType] = useState(true);
  return (
    <div className="page" style={{ padding: 32 }}>
      <div className="page-header">
        <button className="page-back" onClick={() => dispatch({ type: 'set-route', route: 'editor' })}><Icon.ArrowLeft /> Back to editor</button>
        <h1 className="page-title" style={{ marginLeft: 16 }}>Spelling</h1>
        <div style={{ marginLeft: 'auto' }}><Icon.Help_O /> Help</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 320px', gap: 24 }}>
        <aside>
          <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Pages</h3>
          {[1, 2, 3].map(i => (
            <div key={i} className={`card card-hoverable${i === 3 ? ' selected' : ''}`}
                 style={{ padding: 6, marginTop: 8 }}>
              <div style={{ aspectRatio: '0.71', background: 'var(--ivory-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--slate-100)' }}>
                <span className="urdu" style={{ fontSize: 14 }}>لڑلی</span>
              </div>
              <div style={{ textAlign: 'center', fontSize: 12, marginTop: 4 }}>{i}</div>
            </div>
          ))}
        </aside>
        <main>
          <div className="card" style={{ padding: 32 }}>
            <h2 className="urdu rtl" style={{ fontFamily: 'var(--font-urdu)', fontSize: 28, color: 'var(--navy-900)', textAlign: 'right', margin: 0 }}>اردو کی خوبصورتی</h2>
            <div style={{ height: 1, background: 'var(--emerald-500)', width: 80, marginLeft: 'auto', marginBottom: 16 }} />
            <div className="urdu rtl" style={{ fontSize: 16, lineHeight: 2, columnCount: 2, columnGap: 32 }}>
              <p>اردو زبان کی <mark style={{ background: '#FEEBC8', padding: '2px 4px' }}>خوبصورتی</mark> اس کی روائیت میں ہے۔ یہ زبان صرف ایک زبان نہیں بلکہ ایک ایسی تہذیب اور ثقافت ہے جو صدیوں سے چلی آ رہی ہے۔</p>
              <p>زبان کا ایسا لب و لہجہ، ایسی خوش آمیز الفاظ کا چناؤ اور ایسے محاورے جو عام گفتگو میں استعمال ہوتے ہیں، یہ سب اس زبان کو خاص بناتے ہیں۔</p>
              <p>آج کے دور میں بھی اردو کی اہمیت کم نہیں ہوئی ہے۔ یہ اب بھی لاکھوں لوگوں کی مادری زبان ہے۔</p>
            </div>
            <div style={{ marginTop: 16, height: 120, background: 'linear-gradient(135deg,#fdbb74,#fc8d4f)', borderRadius: 4 }} />
          </div>
        </main>
        <aside className="card">
          <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Spelling</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <select className="select" style={{ width: 130 }}><option>Urdu (ur)</option><option>English (en)</option></select>
            <div>
              <span>1 of 3 items</span>
              <button className="toolbar-btn"><Icon.ArrowLeft style={{ fontSize: 12 }} /></button>
              <button className="toolbar-btn"><Icon.Arrow style={{ fontSize: 12 }} /></button>
            </div>
          </div>
          <label className="label" style={{ marginTop: 8 }}>Not in dictionary</label>
          <input className="input with-rtl" defaultValue="خوبصورتی" dir="rtl" />
          <p style={{ marginTop: 8, fontSize: 13, color: 'var(--slate-500)' }}>Suggestions need your review.</p>
          {s.suggestions.map((g, i) => (
            <button key={g.id}
                    className={`card card-hoverable${i === 0 ? ' selected' : ''}`}
                    style={{ width: '100%', padding: 10, marginBottom: 6, textAlign: 'right' }}
                    dir="rtl">
              <span className="urdu" style={{ fontSize: 16 }}>{g.replace}</span>
            </button>
          ))}
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>Replace</button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 6 }}>
            <button className="btn btn-secondary" onClick={() => dispatch({ type: 'spell-skip' })}>Ignore once</button>
            <button className="btn btn-secondary" onClick={() => dispatch({ type: 'spell-add' })}>Add to dictionary</button>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <input type="checkbox" checked={checkAsYouType} onChange={e => setCheckAsYouType(e.target.checked)} /> Check as you type <Icon.Help_O style={{ color: 'var(--slate-500)' }} />
          </label>
          <hr style={{ margin: '12px 0', border: 0, borderTop: '1px solid var(--slate-100)' }} />
          <details open><summary style={{ fontWeight: 600, color: 'var(--navy-900)' }}>Personal dictionary</summary>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}><Icon.Cog /> Review settings</button>
          </details>
        </aside>
      </div>
      <div className="statusbar">
        <span>Page 3 of 12 · 1,842 words · Urdu</span>
        <div className="right"><span>90%</span></div>
      </div>
    </div>
  );
}
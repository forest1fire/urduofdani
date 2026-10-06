import React, { useEffect, useState, useMemo } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import { spellCheck, suggest, engineInfo } from '../lib/spellBridge.js';

const SAMPLE_URDU = `اردو زبان کی خوبصورتی اس کی روائیت میں ہے۔ یہ زبان صرف ایک زبان نہیں بلکہ ایک ایسی تہذیب اور ثقافت ہے جو صدیوں سے چلی آ رہی ہے۔ اس کے الفاظ اپنے اندر ایک گہرائی رکھتے ہیں جو اسے دوسری زبانوں سے ممتاز کرتی ہے۔`;

export default function SpellCheckPage() {
  const { dispatch } = useStore();
  const [text, setText] = useState(SAMPLE_URDU);
  const [checkAsYouType, setCheckAsYouType] = useState(true);
  const [busy, setBusy] = useState(false);
  const [unknown, setUnknown] = useState([]);
  const [suggs, setSuggs] = useState([]);
  const [info, setInfo] = useState(null);
  const [idx, setIdx] = useState(0);

  // Load engine info on mount.
  useEffect(() => { engineInfo().then(setInfo); }, []);

  // Live re-check when the user types or toggles checkAsYouType.
  useEffect(() => {
    if (!checkAsYouType) return;
    let alive = true;
    setBusy(true);
    const t = setTimeout(async () => {
      const r = await spellCheck(text);
      if (!alive) return;
      setUnknown(r.unknown);
      setIdx(0);
      setBusy(false);
    }, 250);
    return () => { alive = false; clearTimeout(t); };
  }, [text, checkAsYouType]);

  // When the current word changes, refresh suggestions.
  useEffect(() => {
    const word = unknown[idx];
    if (!word) { setSuggs([]); return; }
    suggest(word).then(setSuggs);
  }, [unknown, idx]);

  const current = unknown[idx];

  return (
    <div className="page" style={{ padding: 32 }}>
      <div className="page-header">
        <button className="page-back" onClick={() => dispatch({ type: 'set-route', route: 'editor' })}><Icon.ArrowLeft /> Back to editor</button>
        <h1 className="page-title" style={{ marginLeft: 16 }}>Spelling</h1>
        <div style={{ marginLeft: 'auto' }}><Icon.Help_O /> Help</div>
      </div>
      <div className="page-3col" style={{ padding: '16px 32px' }}>
        <aside>
          <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Pages</h3>
          {[1, 2, 3].map(i => (
            <div key={i} className={`card card-hoverable${i === 3 ? ' selected' : ''}`} style={{ padding: 6, marginTop: 8 }}>
              <div style={{ aspectRatio: '0.71', background: 'var(--ivory-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--slate-100)' }}>
                <span className="urdu" style={{ fontSize: 14 }}>لڑلی</span>
              </div>
              <div style={{ textAlign: 'center', fontSize: 12, marginTop: 4 }}>{i}</div>
            </div>
          ))}
        </aside>
        <main>
          {info && (
            <div className="banner banner-info" style={{ marginBottom: 12, fontSize: 12 }}>
              <Icon.Help_O />
              <span>
                Engine: <strong>{info.engine || 'unknown'}</strong> · Database: <strong>{info.database || 'seed'}</strong> · Words: <strong>{info.words || '0'}</strong> · Load: <strong>{info.load || '?'}</strong>
              </span>
            </div>
          )}
          <div className="card" style={{ padding: 32 }}>
            <h2 className="urdu rtl" style={{ fontFamily: 'var(--font-urdu)', fontSize: 28, color: 'var(--navy-900)', textAlign: 'right', margin: 0 }}>اردو کی خوبصورتی</h2>
            <div style={{ height: 1, background: 'var(--emerald-500)', width: 80, marginLeft: 'auto', marginBottom: 16 }} />
            <textarea className="textarea with-rtl" value={text} onChange={e => setText(e.target.value)}
                      style={{ minHeight: 200, fontFamily: 'var(--font-urdu)', fontSize: 16, lineHeight: 2 }}
                      dir="rtl" />
            {unknown.length > 0 && (
              <p style={{ marginTop: 8, color: 'var(--warning-500)', fontSize: 13 }}>
                ⚠ {unknown.length} unknown word{unknown.length > 1 ? 's' : ''} found.
              </p>
            )}
          </div>
        </main>
        <aside className="card">
          <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Spelling</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <select className="select" style={{ width: 130 }}><option>Urdu (ur)</option><option>English (en)</option></select>
            <div>
              <span>{unknown.length ? `${idx + 1} of ${unknown.length} items` : 'No items'}</span>
              <button className="toolbar-btn" disabled={idx === 0} onClick={() => setIdx(Math.max(0, idx - 1))}><Icon.ArrowLeft style={{ fontSize: 12 }} /></button>
              <button className="toolbar-btn" disabled={idx >= unknown.length - 1} onClick={() => setIdx(Math.min(unknown.length - 1, idx + 1))}><Icon.Arrow style={{ fontSize: 12 }} /></button>
            </div>
          </div>
          <label className="label" style={{ marginTop: 8 }}>Not in dictionary</label>
          <input className="input with-rtl" readOnly value={current || (busy ? '…checking' : 'No unknown words in document.')} dir="rtl" />
          {current && (
            <p style={{ marginTop: 8, fontSize: 13, color: 'var(--slate-500)' }}>Suggestions need your review.</p>
          )}
          {suggs.map((s, i) => (
            <button key={s + i} className={`card card-hoverable${i === 0 ? ' selected' : ''}`}
                    style={{ width: '100%', padding: 10, marginBottom: 6, textAlign: 'right' }}
                    dir="rtl" onClick={() => {
                      // Replace first occurrence of `current` with suggestion in the textarea.
                      if (!current) return;
                      const re = new RegExp(current.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
                      setText(t => t.replace(re, s));
                    }}>
              <span className="urdu" style={{ fontSize: 16 }}>{s}</span>
            </button>
          ))}
          {current && <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>Replace</button>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 6, marginTop: 6 }}>
            <button className="btn btn-secondary" onClick={() => setIdx(i => Math.min(unknown.length - 1, i + 1))}>Ignore once</button>
            <button className="btn btn-secondary" onClick={() => setIdx(i => Math.min(unknown.length - 1, i + 1))}>Add to dictionary</button>
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
        <span>{text.split(/\s+/).filter(Boolean).length} words · Urdu</span>
        <div className="right"><span>90%</span></div>
      </div>
    </div>
  );
}
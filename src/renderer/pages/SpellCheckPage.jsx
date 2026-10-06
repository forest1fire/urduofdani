import React, { useEffect, useState, useMemo } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import PageHeader from '../components/PageHeader.jsx';
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
  const [lang, setLang] = useState('ur');
  const [personal, setPersonal] = useState(['اردو', 'زبان', 'خوبصورتی', 'ایک', 'نمونہ']);

  useEffect(() => { engineInfo().then(setInfo).catch(() => {}); }, []);

  useEffect(() => {
    if (!checkAsYouType) return;
    let alive = true;
    setBusy(true);
    const t = setTimeout(async () => {
      try {
        const r = await spellCheck(text);
        if (!alive) return;
        setUnknown(r.unknown);
        setIdx(0);
      } catch { /* ignore */ }
      setBusy(false);
    }, 250);
    return () => { alive = false; clearTimeout(t); };
  }, [text, checkAsYouType]);

  useEffect(() => {
    const word = unknown[idx];
    if (!word) { setSuggs([]); return; }
    suggest(word).then(setSuggs).catch(() => setSuggs([]));
  }, [unknown, idx]);

  const current = unknown[idx];
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <div className="page">
      <PageHeader
        title="Spelling"
        subtitle="Live Urdu spell-check with a 15,848-word audited dictionary."
        back
        actions={
          <button className="btn btn-primary" disabled={!current} onClick={() => {
            if (!current) return;
            const re = new RegExp(current.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            setText(t => t.replace(re, suggs[0] || current));
            dispatch({ type: 'toast', t: { kind: 'ok', msg: `Replaced with "${suggs[0] || current}"` } });
          }}>
            <Icon.Check style={{ width: 14, height: 14 }} /> Replace
          </button>
        }
      />

      <div className="page-body">
        {/* Engine status bar */}
        {info && (
          <div className="card card-flat mb-4" style={{ marginBottom: 16, background: 'var(--color-primary-soft)', borderColor: 'transparent' }}>
            <div className="row" style={{ gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-primary)', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.Check />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500 }}>Engine ready</div>
                <div className="text-sm text-muted">
                  <strong style={{ color: 'var(--color-text)' }}>{info.engine || 'offline'}</strong> ·
                  {' '}<strong style={{ color: 'var(--color-text)' }}>{info.words?.toLocaleString() || '0'}</strong> words in dictionary ·
                  {' '}<strong style={{ color: 'var(--color-text)' }}>{info.load || '?'}</strong> ms load time ·
                  {' '}database: <strong style={{ color: 'var(--color-text)' }}>{info.database || 'seed'}</strong>
                </div>
              </div>
              {busy && <span className="spinner" />}
            </div>
          </div>
        )}

        <div className="grid-3" style={{ gridTemplateColumns: '240px minmax(0, 1fr) 320px', gap: 16 }}>
          {/* Page list */}
          <aside>
            <h5>Pages</h5>
            <div className="stack-sm">
              {[1, 2, 3].map(i => (
                <div key={i} className={`card card-hoverable${i === 3 ? ' selected' : ''}`}
                     style={{ padding: 6, borderColor: i === 3 ? 'var(--color-primary)' : 'var(--color-border)' }}>
                  <div style={{ aspectRatio: '0.71', background: 'var(--color-bg-elev)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)', borderRadius: 2 }}>
                    <span className="urdu" style={{ fontSize: 14, color: 'var(--color-text)' }}>{['لڑلی', 'اب', 'اردو'][i - 1]}</span>
                  </div>
                  <div className="text-xs text-muted" style={{ textAlign: 'center', marginTop: 4 }}>{i}</div>
                </div>
              ))}
            </div>

            <h5 style={{ marginTop: 16 }}>Personal dictionary</h5>
            <div className="card card-flat" style={{ padding: 8 }}>
              <div className="text-xs text-muted" style={{ marginBottom: 6 }}>{personal.length} word{personal.length === 1 ? '' : 's'}</div>
              <div className="row" style={{ gap: 4, flexWrap: 'wrap' }}>
                {personal.slice(0, 6).map(w => <span key={w} className="chip chip-neutral">{w}</span>)}
                {personal.length > 6 && <span className="chip chip-neutral">+{personal.length - 6}</span>}
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 8, width: '100%' }}>
                <Icon.Plus style={{ width: 12, height: 12 }} /> Add a word
              </button>
            </div>
          </aside>

          {/* Editor */}
          <main>
            <div className="row-between mb-4" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h3 style={{ fontSize: 'var(--fs-18)', margin: 0 }}>Document</h3>
                <div className="text-sm text-muted">{words.length} words · Urdu (RTL)</div>
              </div>
              <div className="row" style={{ gap: 6 }}>
                <label className="row" style={{ gap: 6, fontSize: 'var(--fs-13)' }}>
                  <input type="checkbox" className="checkbox" checked={checkAsYouType} onChange={e => setCheckAsYouType(e.target.checked)} />
                  Check as you type
                </label>
                <button className="btn btn-secondary btn-sm" onClick={() => { setText(SAMPLE_URDU); dispatch({ type: 'toast', t: { msg: 'Reset to sample' } }); }}>
                  <Icon.Refresh style={{ width: 12, height: 12 }} /> Reset
                </button>
              </div>
            </div>
            <div className="card">
              <textarea
                className="textarea"
                value={text}
                onChange={e => setText(e.target.value)}
                style={{ minHeight: 320, fontFamily: 'var(--font-urdu)', fontSize: 18, lineHeight: 2, direction: 'rtl', textAlign: 'right', border: 'none', padding: 0, background: 'transparent' }}
                dir="rtl"
                placeholder="یہاں اردو لکھیں…"
              />
              {unknown.length > 0 ? (
                <div className="row mt-4" style={{ marginTop: 12, gap: 6, color: 'var(--color-warning)' }}>
                  <Icon.Warning style={{ width: 16, height: 16 }} />
                  <span className="text-sm"><strong>{unknown.length}</strong> word{unknown.length === 1 ? '' : 's'} not in the dictionary</span>
                </div>
              ) : !busy ? (
                <div className="row mt-4" style={{ marginTop: 12, gap: 6, color: 'var(--color-success)' }}>
                  <Icon.Check style={{ width: 16, height: 16 }} />
                  <span className="text-sm">All words look good</span>
                </div>
              ) : null}
            </div>
          </main>

          {/* Suggestions panel */}
          <aside>
            <div className="row-between mb-4" style={{ marginBottom: 12 }}>
              <h5>Spelling</h5>
              <span className="chip">{unknown.length} {unknown.length === 1 ? 'item' : 'items'}</span>
            </div>

            <Field label="Language">
              <select className="select input-sm" value={lang} onChange={e => setLang(e.target.value)}>
                <option value="ur">Urdu (ur)</option>
                <option value="en">English (en)</option>
                <option value="ar">Arabic (ar)</option>
              </select>
            </Field>

            <Field label="Current">
              <div className="row" style={{ gap: 4 }}>
                <button className="btn btn-secondary btn-icon btn-sm" disabled={idx === 0} onClick={() => setIdx(Math.max(0, idx - 1))} aria-label="Previous">
                  <Icon.ArrowLeft style={{ width: 12, height: 12 }} />
                </button>
                <span className="text-sm" style={{ minWidth: 60, textAlign: 'center' }}>
                  {unknown.length ? `${idx + 1} / ${unknown.length}` : '0 / 0'}
                </span>
                <button className="btn btn-secondary btn-icon btn-sm" disabled={idx >= unknown.length - 1} onClick={() => setIdx(Math.min(unknown.length - 1, idx + 1))} aria-label="Next">
                  <Icon.Arrow style={{ width: 12, height: 12 }} />
                </button>
              </div>
            </Field>

            <div style={{ marginTop: 12, padding: 12, background: current ? 'var(--color-warning-soft)' : 'var(--color-bg-sunken)', borderRadius: 'var(--r-md)', border: current ? '1px solid var(--color-warning)' : '1px solid var(--color-border)' }}>
              <div className="text-xs" style={{ color: 'var(--color-text-muted)', marginBottom: 4 }}>Not in dictionary</div>
              <div className="urdu" style={{ fontSize: 20, fontWeight: 600, textAlign: 'right', direction: 'rtl', color: current ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>
                {current || (busy ? '…' : '—')}
              </div>
            </div>

            <h5 style={{ marginTop: 16 }}>Suggestions</h5>
            {suggs.length > 0 ? (
              <div className="stack-sm">
                {suggs.map((s, i) => (
                  <button key={s + i}
                          className={`card card-hoverable${i === 0 ? ' selected' : ''}`}
                          style={{ width: '100%', padding: 10, textAlign: 'right', direction: 'rtl', borderColor: i === 0 ? 'var(--color-primary)' : 'var(--color-border)' }}
                          onClick={() => {
                            if (!current) return;
                            const re = new RegExp(current.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
                            setText(t => t.replace(re, s));
                          }}>
                    <span className="urdu" style={{ fontSize: 16 }}>{s}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 'var(--sp-4)' }}>
                <div className="text-sm text-muted">{busy ? 'Checking…' : current ? 'No suggestions' : 'Nothing to check'}</div>
              </div>
            )}

            {current && (
              <div className="row mt-4" style={{ marginTop: 12, gap: 4 }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIdx(i => Math.min(unknown.length - 1, i + 1))}>
                  Ignore
                </button>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setPersonal(p => [...p, current]); setIdx(i => Math.min(unknown.length - 1, i + 1)); }}>
                  Add
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ display: 'block', fontSize: 'var(--fs-12)', color: 'var(--color-text-muted)', marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  );
}

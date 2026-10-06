import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import PageHeader from '../components/PageHeader.jsx';

const ROW1 = [
  { l: 'ض', k: 'q' }, { l: 'ص', k: 'w' }, { l: 'ث', k: 'e' }, { l: 'ق', k: 'r' }, { l: 'ف', k: 't' }, { l: 'غ', k: 'y' }, { l: 'ع', k: 'u' }, { l: 'ہ', k: 'i' }, { l: 'خ', k: 'o' }, { l: 'ح', k: 'p' }, { l: 'ج', k: '[' }, { l: 'چ', k: ']' },
];
const ROW2 = [
  { l: 'ش', k: 'a' }, { l: 'س', k: 's' }, { l: 'ی', k: 'd' }, { l: 'ب', k: 'f' }, { l: 'ل', k: 'g' }, { l: 'ا', k: 'h' }, { l: 'ت', k: 'j' }, { l: 'ن', k: 'k' }, { l: 'م', k: 'l' }, { l: 'ک', k: ';' }, { l: 'گ', k: "'" },
];
const ROW3 = [
  { l: 'ظ', k: 'z' }, { l: 'ط', k: 'x' }, { l: 'ز', k: 'c' }, { l: 'ر', k: 'v' }, { l: 'ذ', k: 'b' }, { l: 'د', k: 'n' }, { l: 'پ', k: 'm' }, { l: 'و', k: ',' }, { l: 'ء', k: '.' }, { l: '؟', k: '/' },
];

export default function KeyboardPracticePage() {
  const { dispatch } = useStore();
  const [text, setText] = useState('اردو لکھنے کا طریقہ سیکھیں');
  const [size, setSize] = useState(24);
  const [latin, setLatin] = useState(true);
  const [diac, setDiac] = useState(false);

  const press = (k) => {
    // Approximation: not full phonetic mapping; just append the visible glyph with its Latin hint.
    setText(t => t + k.l);
  };

  return (
    <div className="page">
      <PageHeader title={"Urdu keyboard"} back onBack={() => dispatch({ type: 'set-route', route: "editor" })} />
      <h2 style={{ margin: 0, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon.Keyboard /> Type Urdu with confidence
      </h2>
      <p style={{ color: 'var(--color-text-muted)' }}>Use the on-screen keyboard to practice Urdu typing. Choose a layout, type below, and see your Urdu text instantly.</p>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', margin: '16px 0' }}>
        <select className="select" style={{ width: 200 }}><option>Urdu Phonetic</option><option>Urdu (Traditional)</option></select>
        <button className="btn btn-secondary"><Icon.Tiles /> View traditional layout</button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>On-screen keyboard</span>
          <label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-track" /><span className="toggle-thumb" /></label>
          <span>On</span>
        </div>
      </div>
      <div className="page-2col">
        <main>
          <section className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Try your keyboard</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setText('')}><Icon.Trash /> Clear</button>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Type here using your keyboard or the on-screen keyboard below.</p>
            <textarea className="textarea with-rtl" value={text} onChange={e => setText(e.target.value)}
                      style={{ minHeight: 80, fontSize: 18 }} dir="rtl" />
          </section>

          <section className="card" style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: 'var(--color-text)' }}>On-screen keyboard</h3>
              <span style={{ color: 'var(--color-text-muted)' }}>Layout preview (Urdu Phonetic)</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {ROW1.map(u => (
                  <button key={u.l} className="btn btn-secondary" style={{ flex: 1, padding: '12px 4px', flexDirection: 'column', height: 56 }}>
                    <span style={{ fontFamily: 'var(--font-urdu)', fontSize: 20, color: 'var(--color-text)' }}>{u.l}</span>
                    {latin && <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{u.k}</span>}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="btn btn-secondary" style={{ width: 56, height: 56 }}>Tab</button>
                {ROW2.map(u => (
                  <button key={u.l} className="btn btn-secondary" style={{ flex: 1, padding: '12px 4px', flexDirection: 'column', height: 56 }}>
                    <span style={{ fontFamily: 'var(--font-urdu)', fontSize: 20 }}>{u.l}</span>
                    {latin && <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{u.k}</span>}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="btn btn-secondary" style={{ width: 64, height: 56 }}>Caps</button>
                {ROW3.map(u => (
                  <button key={u.l} className="btn btn-secondary" style={{ flex: 1, padding: '12px 4px', flexDirection: 'column', height: 56 }}>
                    <span style={{ fontFamily: 'var(--font-urdu)', fontSize: 20 }}>{u.l}</span>
                    {latin && <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{u.k}</span>}
                  </button>
                ))}
                <button className="btn btn-secondary" style={{ width: 80, height: 56 }}>Enter</button>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="btn btn-secondary" style={{ width: 64, height: 56 }}>Shift</button>
                <button className="btn btn-secondary" style={{ width: 100, height: 56 }}>Urdu / EN</button>
                <button className="btn btn-secondary" style={{ width: 64, height: 56 }}>Alt</button>
                <button className="btn btn-secondary" style={{ flex: 1, height: 56 }}>Space</button>
                <button className="btn btn-secondary" style={{ width: 64, height: 56 }}>AltGr</button>
                <button className="btn btn-secondary" style={{ width: 48, height: 56 }}>☰</button>
              </div>
            </div>
          </section>
        </main>
        <aside className="card">
          <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Typing tools</h3>
          <label className="label" style={{ marginTop: 8 }}>Font</label>
          <select className="select"><option>Noto Nastaliq Urdu</option></select>
          <label className="label" style={{ marginTop: 8 }}>Font size</label>
          <select className="select" value={size} onChange={e => setSize(+e.target.value)}><option>14 pt</option><option>18 pt</option><option>24 pt</option></select>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}><span>Show Latin hints</span><label className="toggle"><input type="checkbox" checked={latin} onChange={e => setLatin(e.target.checked)} /><span className="toggle-track" /><span className="toggle-thumb" /></label><span>On</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}><span>Show diacritics row</span><label className="toggle"><input type="checkbox" checked={diac} onChange={e => setDiac(e.target.checked)} /><span className="toggle-track" /><span className="toggle-thumb" /></label><span>Off</span></div>
          <hr style={{ margin: '12px 0', border: 0, borderTop: '1px solid var(--color-border)' }} />
          <h4 style={{ margin: 0 }}>💡 Tips</h4>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Switch language: <kbd>Ctrl + Space</kbd></p>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Open on-screen keyboard</p>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 6 }}><Icon.Keyboard /> Open keyboard</button>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Shortcuts can be customized.</p>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}><Icon.Cog /> Customize shortcuts</button>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}><Icon.Doc /> Return to editor</button>
        </aside>
      </div>
    </div>
  );
}
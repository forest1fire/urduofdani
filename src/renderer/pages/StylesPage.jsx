import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import PageHeader from '../components/PageHeader.jsx';

const STYLES = [
  { id: 'title',     name: 'Title',     sample: 'اردو کی خوبصورتی', based: 'Base' },
  { id: 'h1',        name: 'Heading 1', sample: 'اردو کی خوبصورتی', based: 'Title' },
  { id: 'h2',        name: 'Heading 2', sample: 'اردو کی خوبصورتی', based: 'Heading 1' },
  { id: 'body',      name: 'Body Urdu', sample: 'اردو زبان کی خوبصورتی…', based: 'None', selected: true },
  { id: 'caption',   name: 'Caption',   sample: 'لیبل کی جامع مسیجد', based: 'Body Urdu' },
  { id: 'pagenum',   name: 'Page number', sample: '3', based: 'None' },
];

export default function StylesPage() {
  const { dispatch } = useStore();
  const [tab, setTab] = useState('paragraph');
  const sel = STYLES.find(s => s.selected);
  const [style, setStyle] = useState({
    font: 'Noto Nastaliq Urdu', size: '18 pt', weight: 'Regular',
    direction: 'Right to left (RTL)', alignment: 'Justified',
    lineSpacing: '1.5', spaceBefore: '0 pt', spaceAfter: '8 pt', basedOn: 'None',
  });

  return (
    <div className="page">
      <PageHeader title={"Document styles"} back onBack={() => dispatch({ type: 'set-route', route: "editor" })} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0 }}>Consistent formatting, every page</h2>
          <p style={{ color: 'var(--color-text-muted)', margin: '4px 0 16px' }}>Define and manage paragraph and character styles for a professional and consistent document.</p>
        </div>
        <button className="btn btn-primary btn-lg"><Icon.Plus /> New style</button>
      </div>
      <div className="page-3col">
        <aside>
          <div className="tabs" style={{ padding: 0 }}>
            <button className={`tab${tab === 'paragraph' ? ' active' : ''}`} onClick={() => setTab('paragraph')}>Paragraph styles</button>
            <button className={`tab${tab === 'character' ? ' active' : ''}`} onClick={() => setTab('character')}>Character styles</button>
          </div>
          <div style={{ position: 'relative', marginTop: 12 }}>
            <Icon.Search style={{ position: 'absolute', top: 10, left: 10, color: 'var(--color-text-subtle)' }} />
            <input className="input" placeholder="Search styles…" style={{ paddingLeft: 32 }} />
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {STYLES.map(s => (
              <button key={s.id} className={`card card-hoverable${s.selected ? ' selected' : ''}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, textAlign: 'left' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, minWidth: 30 }}>A</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{s.name}</div>
                  <div style={{ fontFamily: 'var(--font-urdu)', fontSize: 12, color: 'var(--color-text-muted)' }}>{s.sample}</div>
                </div>
              </button>
            ))}
          </div>
        </aside>
        <main>
          <div className="card">
            <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Edit {sel.name}</h3>
            <div className="grid-form-3" style={{ marginTop: 12 }}>
              <div><label className="label">Font</label><select className="select" value={style.font} onChange={e => setStyle({ ...style, font: e.target.value })}><option>Noto Nastaliq Urdu</option><option>Noto Naskh Arabic</option></select></div>
              <div><label className="label">Size</label><select className="select" value={style.size} onChange={e => setStyle({ ...style, size: e.target.value })}><option>14 pt</option><option>18 pt</option><option>24 pt</option></select></div>
              <div><label className="label">Weight</label><select className="select"><option>Regular</option><option>Bold</option></select></div>
            </div>
            <hr style={{ margin: '12px 0', border: 0, borderTop: '1px solid var(--color-border)' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              <div><label className="label">Paragraph direction</label><select className="select"><option>Right to left (RTL)</option><option>Left to right (LTR)</option></select></div>
              <div><label className="label">Alignment</label><select className="select"><option>Justified</option><option>Right</option><option>Left</option><option>Center</option></select></div>
            </div>
            <hr style={{ margin: '12px 0', border: 0, borderTop: '1px solid var(--color-border)' }} />
            <div className="grid-form-3">
              <div><label className="label">Line spacing</label><select className="select"><option>1.0</option><option>1.5</option><option>2.0</option></select></div>
              <div><label className="label">Space before</label><select className="select"><option>0 pt</option><option>4 pt</option><option>8 pt</option></select></div>
              <div><label className="label">Space after</label><select className="select"><option>0 pt</option><option>4 pt</option><option>8 pt</option></select></div>
            </div>
            <hr style={{ margin: '12px 0', border: 0, borderTop: '1px solid var(--color-border)' }} />
            <div><label className="label">Based on</label><select className="select"><option>None</option><option>Body Urdu</option></select></div>
            <details style={{ marginTop: 12 }}><summary style={{ fontWeight: 600, color: 'var(--color-text)' }}>Advanced typography</summary></details>
            <div className="banner banner-info" style={{ marginTop: 12 }}><Icon.Help_O /> Updating this style changes all text using it.</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
              <button className="btn btn-secondary">Cancel</button>
              <button className="btn btn-primary">Save style</button>
            </div>
          </div>
        </main>
        <aside className="card">
          <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Preview</h3>
          <div style={{ padding: 16, background: 'var(--color-bg-sunken)', borderRadius: 8, marginTop: 12, textAlign: 'right' }} dir="rtl">
            <h1 style={{ fontFamily: 'var(--font-urdu)', fontSize: 28, color: 'var(--color-text)' }}>اردو کی خوبصورتی</h1>
            <div style={{ height: 1, background: 'var(--color-primary)', width: 80, marginLeft: 'auto' }} />
            <p className="urdu" style={{ marginTop: 12, lineHeight: 1.8 }}>
              اردو زبان کی خوبصورتی اس کی روائیت میں ہے۔ یہ زبان صرف ایک زبان نہیں بلکہ ایک ایسی تہذیب اور ثقافت ہے جو صدیوں سے چلی آ رہی ہے۔ اس کے الفاظ اپنے اندر ایک گہرائی رکھتے ہیں۔
            </p>
            <p className="urdu" style={{ marginTop: 12, lineHeight: 1.8 }}>
              اس کی شاعری، تہوار اور محاورے زبان کے حسن کو دوچند کر دیتے ہیں۔ یہ ایک ایسی زبان ہے جس نے صدیوں سے انسانوں کو اپنے سحر میں جکڑ رکھا ہے۔
            </p>
          </div>
          <p style={{ marginTop: 12, fontSize: 13 }}>Used in <strong style={{ color: 'var(--color-primary-hover)' }}>24</strong> text blocks <button className="btn btn-secondary btn-sm" style={{ float: 'right' }}>Select matching text</button></p>
        </aside>
      </div>
    </div>
  );
}
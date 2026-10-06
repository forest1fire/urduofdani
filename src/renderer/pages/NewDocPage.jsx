import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';

const TYPES = [
  { id: 'blank',   label: 'Blank page',  sub: 'A clean, empty page' },
  { id: 'book',    label: 'Book',        sub: 'Multiple pages for a book' },
  { id: 'magazine',label: 'Magazine',    sub: 'Stylish layout for articles' },
  { id: 'poster',  label: 'Poster',      sub: 'Large page for display' },
  { id: 'invitation', label: 'Invitation', sub: 'Beautiful invitation design' },
];

const SIZES = [
  { id: 'a4', label: 'A4 (210 × 297 mm)', w: 210, h: 297 },
  { id: 'a5', label: 'A5 (148 × 210 mm)', w: 148, h: 210 },
  { id: 'letter', label: 'Letter (216 × 279 mm)', w: 216, h: 279 },
];

export default function NewDocPage() {
  const { dispatch } = useStore();
  const [type, setType] = useState('blank');
  const [name, setName] = useState('Untitled document');
  const [size, setSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');
  const [pages, setPages] = useState(1);
  const [margins, setMargins] = useState(20);
  const [columns, setColumns] = useState(1);
  const [columnGap, setColumnGap] = useState(8);
  const [facing, setFacing] = useState(false);
  const [font, setFont] = useState('Noto Nastaliq Urdu');
  const [fontSize, setFontSize] = useState('18 pt');

  return (
    <div className="page" style={{ padding: 32, background: 'var(--white)' }}>
      <div className="page-header">
        <button className="page-back" onClick={() => dispatch({ type: 'set-route', route: 'home' })}>
          <Icon.ArrowLeft /> Back to home
        </button>
        <h1 className="page-title" style={{ marginLeft: 16 }}>New document</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--navy-900)' }}>
          <Icon.Help_O /> Help
        </div>
      </div>

      <div className="page-3col" style={{ padding: '16px 32px' }}>
        <aside>
          <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Document type</h3>
          <p style={{ margin: '4px 0 16px', color: 'var(--slate-500)' }}>Choose a starting point.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {TYPES.map(t => (
              <button key={t.id}
                      className={`card card-hoverable${type === t.id ? ' selected' : ''}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, textAlign: 'left' }}
                      onClick={() => setType(t.id)}>
                <span style={{ color: 'var(--emerald-500)' }}><Icon.Doc /></span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{t.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>{t.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main>
          <h2 style={{ margin: 0, color: 'var(--navy-900)' }}>Set up your document</h2>
          <p style={{ margin: '4px 0 16px', color: 'var(--slate-500)' }}>Choose your settings and start creating.</p>

          <section className="card" style={{ marginBottom: 16 }}>
            <h4 style={{ margin: 0, color: 'var(--navy-900)' }}>Document name</h4>
            <p style={{ margin: '4px 0 8px', color: 'var(--slate-500)' }}>Give your document a name.</p>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
          </section>

          <section className="card" style={{ marginBottom: 16 }}>
            <h4 style={{ margin: 0, color: 'var(--navy-900)' }}>Page</h4>
            <p style={{ margin: '4px 0 12px', color: 'var(--slate-500)' }}>Set the size and basic page options.</p>
            <div className="grid-form-3">
              <div>
                <label className="label">Size</label>
                <select className="select" value={size} onChange={e => setSize(e.target.value)}>
                  {SIZES.map(s => <option key={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Orientation</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className={`btn ${orientation === 'portrait' ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => setOrientation('portrait')}>▯ Portrait</button>
                  <button className={`btn ${orientation === 'landscape' ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => setOrientation('landscape')}>▭ Landscape</button>
                </div>
              </div>
              <div>
                <label className="label">Pages</label>
                <input type="number" min={1} max={999} className="input" value={pages} onChange={e => setPages(+e.target.value)} />
              </div>
            </div>
          </section>

          <section className="card" style={{ marginBottom: 16 }}>
            <h4 style={{ margin: 0, color: 'var(--navy-900)' }}>Layout</h4>
            <p style={{ margin: '4px 0 12px', color: 'var(--slate-500)' }}>Define margins and column settings.</p>
            <div className="grid-form-4" style={{ alignItems: 'flex-end' }}>
              <div>
                <label className="label">Margins (all sides)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="number" className="input" value={margins} onChange={e => setMargins(+e.target.value)} />
                  <span style={{ color: 'var(--slate-500)' }}>mm</span>
                  <Icon.Link style={{ color: 'var(--slate-500)' }} />
                </div>
              </div>
              <div>
                <label className="label">Columns</label>
                <input type="number" min={1} max={6} className="input" value={columns} onChange={e => setColumns(+e.target.value)} />
              </div>
              <div>
                <label className="label">Column gap</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="number" className="input" value={columnGap} onChange={e => setColumnGap(+e.target.value)} />
                  <span style={{ color: 'var(--slate-500)' }}>mm</span>
                </div>
              </div>
              <div>
                <label className="label">Facing pages</label>
                <label className="toggle">
                  <input type="checkbox" checked={facing} onChange={e => setFacing(e.target.checked)} />
                  <span className="toggle-track" /><span className="toggle-thumb" />
                </label>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--slate-500)' }}>For double-sided layouts such as books.</p>
              </div>
            </div>
          </section>

          <section className="card" style={{ marginBottom: 16 }}>
            <h4 style={{ margin: 0, color: 'var(--navy-900)' }}>Writing</h4>
            <p style={{ margin: '4px 0 12px', color: 'var(--slate-500)' }}>Set the language and text direction.</p>
            <div className="grid-form-4" style={{ gap: 16 }}>
              <div>
                <label className="label">Language</label>
                <select className="select"><option>Urdu</option><option>Arabic</option><option>English</option></select>
              </div>
              <div>
                <label className="label">Direction</label>
                <select className="select"><option>Right to left (RTL)</option><option>Left to right (LTR)</option></select>
              </div>
              <div>
                <label className="label">Font</label>
                <select className="select" value={font} onChange={e => setFont(e.target.value)}>
                  <option>Noto Nastaliq Urdu</option>
                  <option>Noto Naskh Arabic</option>
                  <option>Custom Urdu Font</option>
                </select>
                <a href="#" style={{ fontSize: 12 }}>Choose another font</a>
              </div>
              <div>
                <label className="label">Font size</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input className="input" value={fontSize} onChange={e => setFontSize(e.target.value)} />
                  <span style={{ color: 'var(--slate-500)' }}>pt</span>
                </div>
              </div>
            </div>
          </section>

          <section className="card">
            <details>
              <summary style={{ fontWeight: 600, color: 'var(--navy-900)' }}>Advanced settings</summary>
              <p style={{ color: 'var(--slate-500)' }}>Page numbers, headers, footers and more.</p>
            </details>
          </section>
        </main>

        <aside>
          <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Live preview</h3>
          <p style={{ margin: '4px 0 16px', color: 'var(--slate-500)' }}>A quick look at your page layout.</p>
          <div className="card" style={{ background: 'var(--ivory-50)', minHeight: 380, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              background: '#fff',
              border: '1px dashed var(--slate-200)',
              width: orientation === 'portrait' ? 200 : 260,
              height: orientation === 'portrait' ? 280 : 200,
              padding: margins / 2,
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: columnGap / 2,
            }}>
              {Array.from({ length: columns }).map((_, i) => (
                <div key={i} style={{ borderRight: i < columns - 1 ? '1px dashed var(--slate-200)' : 'none', padding: 8 }}>
                  <div style={{ fontFamily: 'var(--font-urdu)', fontSize: 18, color: 'var(--navy-900)', textAlign: 'center' }}>نمونہ</div>
                  <div style={{ height: 1, background: 'var(--slate-200)', margin: '8px 0' }} />
                  <div style={{ fontFamily: 'var(--font-urdu)', fontSize: 11, color: 'var(--slate-500)', lineHeight: 1.8 }}>
                    یہ ایک نمونہ ٹیکسٹ ہے جو آپ کی دستاویز کی جھلک دکھاتا ہے۔
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ marginTop: 12, background: 'var(--slate-50)' }}>
            <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>
              A4 · {orientation === 'portrait' ? 'Portrait' : 'Landscape'} · Urdu / RTL
            </div>
            <div style={{ fontSize: 13, color: 'var(--slate-500)' }}>
              {SIZES.find(s => s.id === size).label.split(' (')[1].replace(')', '')} · {pages} page{pages > 1 ? 's' : ''} · {margins} mm margins
            </div>
          </div>
        </aside>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, padding: '16px 0' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--info-500)', fontSize: 13 }}>
          <Icon.Help_O /> You can change these settings later.
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-lg" onClick={() => dispatch({ type: 'set-route', route: 'home' })}>Cancel</button>
          <button className="btn btn-primary btn-lg" onClick={() => dispatch({ type: 'new-doc', name: name || 'Untitled', kind: type, pages })}
                  style={{ minWidth: 200 }}>
            <Icon.Plus /> Create document
          </button>
        </div>
      </div>
    </div>
  );
}
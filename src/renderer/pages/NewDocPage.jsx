import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import PageHeader from '../components/PageHeader.jsx';

const TYPES = [
  { id: 'blank',     label: 'Blank page',     sub: 'A clean, empty page',                Icon: Icon.Doc,   bg: 'linear-gradient(135deg,#F8FAFC,#E2E8F0)' },
  { id: 'book',      label: 'Book',           sub: 'Multiple pages, facing spreads',     Icon: Icon.Book,  bg: 'linear-gradient(135deg,#F7F5EF,#EFEBDF)' },
  { id: 'magazine',  label: 'Magazine',       sub: 'Stylish layout for articles',        Icon: Icon.Tiles, bg: 'linear-gradient(135deg,#102A43,#1E3A5F)' },
  { id: 'card',      label: 'Card / Invitation', sub: 'Beautiful single-page design',    Icon: Icon.Star,  bg: 'linear-gradient(135deg,#FBF3E1,#F5E5BD)' },
  { id: 'newsletter',label: 'Newsletter',     sub: '4-page A4 newsletter',               Icon: Icon.Layers,bg: 'linear-gradient(135deg,#E7F8F4,#A5E5D6)' },
  { id: 'poster',    label: 'Poster',         sub: 'Large page for display',             Icon: Icon.Image, bg: 'linear-gradient(135deg,#FED7D7,#FBF3E1)' },
];

const SIZES = [
  { id: 'a4',     label: 'A4',     sub: '210 × 297 mm',  w: 210, h: 297 },
  { id: 'a5',     label: 'A5',     sub: '148 × 210 mm',  w: 148, h: 210 },
  { id: 'letter', label: 'Letter', sub: '216 × 279 mm',  w: 216, h: 279 },
  { id: 'legal',  label: 'Legal',  sub: '216 × 356 mm',  w: 216, h: 356 },
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
  const [fontSize, setFontSize] = useState(18);
  const [direction, setDirection] = useState('rtl');

  const create = () => {
    dispatch({ type: 'new-doc', name: name || 'Untitled', kind: type, pages });
    dispatch({ type: 'toast', t: { kind: 'ok', msg: 'Document created' } });
  };

  return (
    <div className="page">
      <PageHeader
        title="New document"
        subtitle="Choose a starting point and set up your page."
        back
        actions={
          <>
            <button className="btn btn-ghost" onClick={() => dispatch({ type: 'set-route', route: 'home' })}>Cancel</button>
            <button className="btn btn-primary" onClick={create}>
              <Icon.Plus /> Create document
            </button>
          </>
        }
      />

      <div className="page-body">
        <div className="page-3col" style={{ gridTemplateColumns: '260px minmax(0, 1fr) 320px', gap: 24 }}>
          {/* Document type selector */}
          <aside>
            <h5>Document type</h5>
            <p className="text-sm text-muted" style={{ margin: '0 0 12px' }}>Choose a starting point.</p>
            <div className="stack-sm">
              {TYPES.map(t => (
                <button key={t.id}
                        className={`card card-hoverable${type === t.id ? ' selected' : ''}`}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: 10, textAlign: 'left',
                          borderColor: type === t.id ? 'var(--color-primary)' : 'var(--color-border)',
                          background: type === t.id ? 'var(--color-primary-soft)' : 'var(--color-bg-elev)',
                        }}
                        onClick={() => setType(t.id)}>
                  <span style={{ width: 32, height: 32, borderRadius: 6, background: t.bg, color: t.bg.includes('102A43') ? 'white' : 'var(--brand-navy-900)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <t.Icon style={{ width: 16, height: 16 }} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, color: 'var(--color-text)', fontSize: 'var(--fs-14)' }}>{t.label}</div>
                    <div className="text-xs text-muted truncate">{t.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Settings form */}
          <main>
            <div className="card mb-4" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 'var(--fs-16)', margin: '0 0 4px' }}>Document name</h3>
              <p className="text-sm text-muted" style={{ margin: '0 0 8px' }}>You can rename it later.</p>
              <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. My Urdu Book" />
            </div>

            <div className="card mb-4" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 'var(--fs-16)', margin: '0 0 12px' }}>Page</h3>
              <div className="grid-3" style={{ gap: 16 }}>
                <div>
                  <label className="label" style={{ display: 'block', fontSize: 'var(--fs-12)', color: 'var(--color-text-muted)', marginBottom: 4 }}>Size</label>
                  <div className="grid-2" style={{ gap: 4 }}>
                    {SIZES.map(s => (
                      <button key={s.id}
                              className={`btn btn-sm ${size === s.id ? 'btn-primary' : 'btn-secondary'}`}
                              onClick={() => setSize(s.id)}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label" style={{ display: 'block', fontSize: 'var(--fs-12)', color: 'var(--color-text-muted)', marginBottom: 4 }}>Orientation</label>
                  <div className="btn-group" style={{ width: '100%' }}>
                    <button className={`btn btn-sm ${orientation === 'portrait' ? 'active' : ''}`} onClick={() => setOrientation('portrait')}>Portrait</button>
                    <button className={`btn btn-sm ${orientation === 'landscape' ? 'active' : ''}`} onClick={() => setOrientation('landscape')}>Landscape</button>
                  </div>
                </div>
                <div>
                  <label className="label" style={{ display: 'block', fontSize: 'var(--fs-12)', color: 'var(--color-text-muted)', marginBottom: 4 }}>Pages</label>
                  <input type="number" min={1} max={999} className="input" value={pages} onChange={e => setPages(+e.target.value || 1)} />
                </div>
              </div>
            </div>

            <div className="card mb-4" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 'var(--fs-16)', margin: '0 0 12px' }}>Layout</h3>
              <div className="grid-4" style={{ gap: 16, alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-12)', color: 'var(--color-text-muted)', marginBottom: 4 }}>Margins (mm)</label>
                  <input type="number" min={0} max={50} className="input" value={margins} onChange={e => setMargins(+e.target.value || 0)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-12)', color: 'var(--color-text-muted)', marginBottom: 4 }}>Columns</label>
                  <input type="number" min={1} max={6} className="input" value={columns} onChange={e => setColumns(+e.target.value || 1)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-12)', color: 'var(--color-text-muted)', marginBottom: 4 }}>Column gap (mm)</label>
                  <input type="number" min={0} max={30} className="input" value={columnGap} onChange={e => setColumnGap(+e.target.value || 0)} />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" className="checkbox" checked={facing} onChange={e => setFacing(e.target.checked)} />
                    <span className="text-sm">Facing pages</span>
                  </label>
                  <p className="text-xs text-muted" style={{ margin: '4px 0 0' }}>For double-sided books</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 'var(--fs-16)', margin: '0 0 12px' }}>Writing</h3>
              <div className="grid-4" style={{ gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-12)', color: 'var(--color-text-muted)', marginBottom: 4 }}>Language</label>
                  <select className="select"><option>Urdu</option><option>Arabic</option><option>English</option><option>Persian</option><option>Pashto</option></select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-12)', color: 'var(--color-text-muted)', marginBottom: 4 }}>Direction</label>
                  <div className="btn-group" style={{ width: '100%' }}>
                    <button className={`btn btn-sm ${direction === 'ltr' ? 'active' : ''}`} onClick={() => setDirection('ltr')}>LTR</button>
                    <button className={`btn btn-sm ${direction === 'rtl' ? 'active' : ''}`} onClick={() => setDirection('rtl')}>RTL</button>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-12)', color: 'var(--color-text-muted)', marginBottom: 4 }}>Font</label>
                  <select className="select" value={font} onChange={e => setFont(e.target.value)}>
                    <option>Noto Nastaliq Urdu</option>
                    <option>Noto Naskh Arabic</option>
                    <option>Custom Urdu Font</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-12)', color: 'var(--color-text-muted)', marginBottom: 4 }}>Font size (pt)</label>
                  <input type="number" min={6} max={72} className="input" value={fontSize} onChange={e => setFontSize(+e.target.value || 12)} />
                </div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-info-soft)', color: 'var(--color-info)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.Help_O />
              </span>
              <div>
                <strong className="text-sm">You can change all of these later</strong>
                <div className="text-xs text-muted">Go to <em>Settings</em> or <em>Document styles</em> any time.</div>
              </div>
            </div>
          </main>

          {/* Live preview */}
          <aside>
            <h5>Live preview</h5>
            <p className="text-sm text-muted" style={{ margin: '0 0 12px' }}>A quick look at your page.</p>
            <div className="card card-flat" style={{ background: 'var(--color-bg-sunken)', minHeight: 420, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                background: 'white',
                border: '1px dashed var(--color-border)',
                borderRadius: 4,
                width: orientation === 'portrait' ? 180 : 240,
                height: orientation === 'portrait' ? 250 : 180,
                padding: Math.max(6, margins / 2),
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: Math.max(2, columnGap / 2),
                boxShadow: 'var(--shadow-md)',
                transition: 'all 200ms ease',
              }}>
                {Array.from({ length: columns }).map((_, i) => (
                  <div key={i} style={{ borderRight: i < columns - 1 ? '1px dashed var(--color-border)' : 'none', padding: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div className="urdu" style={{ fontSize: 14, color: 'var(--brand-navy-900)', textAlign: 'center', fontWeight: 700 }}>نمونہ</div>
                    <div style={{ height: 1, background: 'var(--color-border)' }} />
                    <div className="urdu" style={{ fontSize: 8, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                      یہ ایک نمونہ ٹیکسٹ ہے جو آپ کی دستاویز کی جھلک دکھاتا ہے۔
                    </div>
                    <div style={{ height: 1, background: 'var(--color-border)' }} />
                    <div className="urdu" style={{ fontSize: 8, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                      مزید مواد شامل کریں۔
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card mt-4" style={{ marginTop: 12, background: 'var(--color-primary-soft)', borderColor: 'transparent' }}>
              <div className="text-sm" style={{ fontWeight: 500, color: 'var(--color-text)' }}>
                {SIZES.find(s => s.id === size).label} · {orientation === 'portrait' ? 'Portrait' : 'Landscape'}
              </div>
              <div className="text-xs text-muted">
                {SIZES.find(s => s.id === size).sub} · {pages} page{pages > 1 ? 's' : ''} · {margins} mm margins
              </div>
              <div className="text-xs text-muted" style={{ marginTop: 4 }}>
                {direction.toUpperCase()} · {font} · {fontSize} pt
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

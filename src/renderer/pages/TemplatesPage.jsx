import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';

const TEMPLATES = [
  { id: 't1', cat: 'books',      title: 'Urdu Book',          meta: 'A5 | 12 pages',     accent: '#C69B47', bg: 'linear-gradient(135deg,#F7F5EF,#EFE7D4)' },
  { id: 't2', cat: 'magazines',  title: 'Editorial Magazine', meta: 'A4 | 8 pages',      accent: '#243B53', bg: 'linear-gradient(135deg,#102A43,#243B53)' },
  { id: 't3', cat: 'posters',    title: 'Event Poster',       meta: 'A4 | Single page',  accent: '#C69B47', bg: 'linear-gradient(135deg,#0f4c3a,#1d6f57)' },
  { id: 't4', cat: 'invitations',title: 'Wedding Invitation', meta: 'A5 | Single page',  accent: '#C69B47', bg: 'linear-gradient(135deg,#FFF5E1,#FDE2C2)' },
  { id: 't5', cat: 'books',      title: 'Poetry Collection',  meta: 'A5 | 24 pages',     accent: '#008F76', bg: 'linear-gradient(135deg,#F7F5EF,#E7F8F4)' },
  { id: 't6', cat: 'magazines',  title: 'Travel Magazine',    meta: 'A4 | 16 pages',     accent: '#00745F', bg: 'linear-gradient(135deg,#102A43,#3E5C76)' },
];

export default function TemplatesPage() {
  const { dispatch: d } = useStore();
  const [cat, setCat] = useState('all');
  const [selected, setSelected] = useState('t1');
  const filtered = TEMPLATES.filter(t => cat === 'all' || t.cat === cat);
  const sel = TEMPLATES.find(t => t.id === selected) || TEMPLATES[0];

  return (
    <div className="page" style={{ padding: 32 }}>
      <div className="page-header">
        <button className="page-back" onClick={() => d({ type: 'set-route', route: 'editor' })}>
          <Icon.ArrowLeft /> Back to editor
        </button>
        <h1 className="page-title" style={{ marginLeft: 16 }}>Templates</h1>
        <div style={{ marginLeft: 'auto' }}><Icon.Help_O style={{ color: 'var(--navy-900)' }} /> Help</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Start with a layout, make it yours.</h2>
        </div>
        <button className="btn btn-primary btn-lg"><Icon.Plus /> Save current layout</button>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Icon.Search style={{ position: 'absolute', top: 10, left: 10, color: 'var(--slate-300)' }} />
          <input className="input" placeholder="Search templates…" style={{ paddingLeft: 32 }} />
        </div>
        <div className="chip-row">
          {['all','books','magazines','posters','invitations','saved'].map(c => (
            <button key={c} className={`chip${cat === c ? ' active' : ''}`} onClick={() => setCat(c)} style={{ textTransform: 'capitalize' }}>{c}</button>
          ))}
        </div>
      </div>

      <div className="page-3col" style={{ padding: '16px 32px' }}>
        {filtered.slice(0, 6).map(t => (
          <div key={t.id} className={`card card-hoverable${selected === t.id ? ' selected' : ''}`}
               style={{ padding: 0, overflow: 'hidden' }} onClick={() => setSelected(t.id)}>
            <div style={{ height: 200, background: t.bg, borderBottom: `2px solid ${t.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <span style={{ fontFamily: 'var(--font-urdu)', fontSize: 32, color: t.bg.includes('102A43') || t.bg.includes('#0f4c3a') ? '#F7F5EF' : '#102A43' }}>
                {t.title.includes('Book') ? 'اردو کتاب' : t.title.includes('Magazine') ? t.id === 't2' ? 'اداری مجلہ' : 'سفر نامہ' :
                 t.title.includes('Poster') ? 'تقارش' : t.title.includes('Wedding') ? 'شادی کی دعوت' : 'نعتیں'}
              </span>
              {selected === t.id && <Icon.Star style={{ position: 'absolute', top: 8, right: 8, color: 'var(--gold-500)' }} />}
            </div>
            <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{t.title}</div>
                <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>{t.meta}</div>
              </div>
              <Icon.Star style={{ color: 'var(--slate-200)' }} />
            </div>
          </div>
        ))}
        <aside className="card">
          <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>{sel.title}</h3>
          <div style={{ height: 220, background: sel.bg, borderRadius: 8, margin: '12px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-urdu)', fontSize: 26, color: sel.bg.includes('102A43') || sel.bg.includes('#0f4c3a') ? '#F7F5EF' : '#102A43' }}>
              {sel.title.includes('Book') ? 'اردو کتاب' : sel.title.includes('Magazine') ? sel.id === 't2' ? 'اداری مجلہ' : 'سفر نامہ' :
               sel.title.includes('Poster') ? 'تقارش' : sel.title.includes('Wedding') ? 'شادی کی دعوت' : 'نعتیں'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 6, fontSize: 13, color: 'var(--slate-500)' }}>
            <span>Page size</span><span style={{ color: 'var(--slate-700)' }}>{sel.meta.split(' | ')[0]} ({sel.meta.includes('A5') ? '148 × 210 mm' : '210 × 297 mm'})</span>
            <span>Total pages</span><span style={{ color: 'var(--slate-700)' }}>{sel.meta.split(' | ')[1]}</span>
            <span>Direction</span><span style={{ color: 'var(--slate-700)' }}>Urdu / RTL</span>
            <span>Included fonts</span><span style={{ color: 'var(--slate-700)' }}>Noto Nastaliq Urdu, Noto Naskh Arabic</span>
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 16 }}
                  onClick={() => d({ type: 'new-doc', name: sel.title, kind: sel.cat.replace(/s$/, ''), pages: parseInt(sel.meta.match(/\d+/)?.[0] || '1') })}>
            <Icon.Doc /> Use template
          </button>
          <button className="btn btn-secondary btn-lg" style={{ width: '100%', marginTop: 8 }}>
            <Icon.Eye /> Preview pages
          </button>
          <p style={{ textAlign: 'center', color: 'var(--slate-500)', fontSize: 12, margin: '8px 0 0' }}>
            Creates a new document.
          </p>
        </aside>
      </div>

      <div style={{ marginTop: 16, color: 'var(--emerald-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon.Check /> Offline ready
      </div>
    </div>
  );
}
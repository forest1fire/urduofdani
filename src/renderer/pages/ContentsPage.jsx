import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';

const HEADINGS = [
  { h: 'Heading 1', t: 'تعارف' },
  { h: 'Heading 1', t: 'اردو کی تاریخ', children: [{ h: 'Heading 2', t: 'ابتدائی دور' }, { h: 'Heading 2', t: 'جدید دور' }] },
  { h: 'Heading 1', t: 'زبان اور ثقافت', children: [{ h: 'Heading 2', t: 'لسانی خصوصیات' }, { h: 'Heading 2', t: 'ثقافتی اثرات' }] },
  { h: 'Heading 1', t: 'ادب اور شاعری', children: [{ h: 'Heading 2', t: 'غزل' }, { h: 'Heading 2', t: 'نظم' }] },
  { h: 'Heading 1', t: 'جدید اردو', children: [{ h: 'Heading 2', t: 'عصری رجحانات' }, { h: 'Heading 2', t: 'مستقبل کے امکانات' }] },
  { h: 'Heading 1', t: 'اختتام' },
];

const TOC = [
  { p: 1,   t: 'تعارف' },
  { p: 5,   t: 'اردو کی تاریخ' },
  { p: 7,   t: 'ابتدائی دور' },
  { p: 10,  t: 'جدید دور' },
  { p: 12,  t: 'زبان اور ثقافت' },
  { p: 15,  t: 'لسانی خصوصیات' },
  { p: 20,  t: 'ثقافتی اثرات' },
  { p: 24,  t: 'ادب اور شاعری' },
  { p: 28,  t: 'غزل' },
  { p: 33,  t: 'نظم' },
  { p: 38,  t: 'جدید اردو' },
  { p: 41,  t: 'عصری رجحانات' },
  { p: 45,  t: 'مستقبل کے امکانات' },
  { p: 48,  t: 'اختتام' },
];

export default function ContentsPage() {
  const { dispatch } = useStore();
  const [tab, setTab] = useState('toc');
  return (
    <div className="page" style={{ padding: 32 }}>
      <div className="page-header">
        <button className="page-back" onClick={() => dispatch({ type: 'set-route', route: 'editor' })}><Icon.ArrowLeft /> Back to editor</button>
        <h1 className="page-title" style={{ marginLeft: 16 }}>Contents &amp; footnotes</h1>
        <div style={{ marginLeft: 'auto' }}><Icon.Help_O /> Help</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 320px', gap: 24 }}>
        <aside>
          <div className="tabs" style={{ padding: 0 }}>
            <button className={`tab${tab === 'toc' ? ' active' : ''}`} onClick={() => setTab('toc')}>Table of contents</button>
            <button className={`tab${tab === 'fn' ? ' active' : ''}`} onClick={() => setTab('fn')}>Footnotes</button>
          </div>
          {tab === 'toc' && (
            <div className="card" style={{ marginTop: 12 }}>
              <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Build your contents</h3>
              <label className="label" style={{ marginTop: 8 }}>Title (in document language)</label>
              <input className="input with-rtl" defaultValue="فہرست" />
              <label className="label" style={{ marginTop: 12 }}>Include heading levels</label>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="checkbox" defaultChecked /> Heading 1 <span style={{ color: 'var(--slate-500)', marginLeft: 'auto', fontSize: 12 }}>(Chapter titles)</span></label>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="checkbox" defaultChecked /> Heading 2 <span style={{ color: 'var(--slate-500)', marginLeft: 'auto', fontSize: 12 }}>(Subheadings)</span></label>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="checkbox" /> Heading 3 <span style={{ color: 'var(--slate-500)', marginLeft: 'auto', fontSize: 12 }}>(Lower level)</span></label>
              <hr style={{ margin: '12px 0', border: 0, borderTop: '1px solid var(--slate-100)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Show page numbers</span><label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-track" /><span className="toggle-thumb" /></label></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}><span>Use dot leaders</span><label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-track" /><span className="toggle-thumb" /></label></div>
              <label className="label" style={{ marginTop: 12 }}>Direction</label>
              <select className="select"><option>Right to left (RTL)</option><option>Left to right (LTR)</option></select>
              <label className="label" style={{ marginTop: 12 }}>Contents style</label>
              <select className="select"><option>Contents Urdu</option><option>Contents Heading</option></select>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>Generate preview</button>
            </div>
          )}
        </aside>
        <main>
          <div className="card" style={{ background: 'var(--ivory-50)', padding: 48, minHeight: 600, textAlign: 'right' }} dir="rtl">
            <h1 style={{ fontFamily: 'var(--font-urdu)', color: 'var(--emerald-500)', textAlign: 'center', margin: '0 0 32px' }}>فہرست</h1>
            {TOC.map(r => (
              <div key={r.p} style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '8px 0' }}>
                <span style={{ minWidth: 24, fontFamily: 'var(--font-ui)' }}>{r.p}</span>
                <span style={{ flex: 1, borderBottom: '1px dotted var(--slate-300)' }} />
                <span style={{ fontFamily: 'var(--font-urdu)', fontSize: 16 }}>{r.t}</span>
              </div>
            ))}
          </div>
        </main>
        <aside>
          <div className="card">
            <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Document headings</h3>
            <p style={{ margin: '4px 0 12px', fontSize: 13, color: 'var(--slate-500)' }}>Uses paragraph heading styles.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {HEADINGS.map((h, i) => (
                <React.Fragment key={i}>
                  <div style={{ padding: 10, background: 'var(--emerald-50)', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="chip active" style={{ fontSize: 11 }}>{h.h}</span>
                    <span style={{ fontFamily: 'var(--font-urdu)', fontSize: 16 }}>{h.t}</span>
                  </div>
                  {h.children?.map((c, j) => (
                    <div key={j} style={{ padding: 10, marginLeft: 24, background: 'var(--slate-50)', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="chip" style={{ fontSize: 11 }}>{c.h}</span>
                      <span style={{ fontFamily: 'var(--font-urdu)', fontSize: 16 }}>{c.t}</span>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="card" style={{ marginTop: 12 }}>
            <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Footnotes</h3>
            <p style={{ fontSize: 13, color: 'var(--slate-500)' }}>6 notes in this document.</p>
            <button className="btn btn-secondary" style={{ width: '100%' }}>Manage footnotes</button>
          </div>
        </aside>
      </div>
      <div className="statusbar">
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--info-500)' }}><Icon.Help_O /> Update after changing your document.</span>
        <div className="right"><button className="btn btn-secondary">Update page numbers</button><button className="btn btn-primary" style={{ marginLeft: 8 }}>Insert contents</button></div>
      </div>
    </div>
  );
}
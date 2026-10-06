import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import PageHeader from '../components/PageHeader.jsx';

const ROWS = [
  { n: 1, name: 'علی رضا',   subj: 'اردو',     marks: 92 },
  { n: 2, name: 'فاطمہ زہرا', subj: 'انگرۍزی', marks: 85 },
  { n: 3, name: 'احمد حسین',  subj: 'ریاضی',    marks: 78 },
  { n: 4, name: 'عا شکہ خان', subj: 'سائنس',   marks: 88 },
  { n: 5, name: 'محمد عمر',   subj: 'اسلامیات', marks: 95 },
];

export default function TablesPage() {
  const { dispatch } = useStore();
  const [tab, setTab] = useState('emerald');
  return (
    <div className="page">
      <PageHeader title={"Tables"} back onBack={() => dispatch({ type: 'set-route', route: "editor" })} />
      <div className="toolbar" style={{ padding: '0 0 16px', border: 0, background: 'transparent' }}>
        <button className="btn btn-primary"><Icon.Table /> Table ▾</button>
        <button className="btn btn-secondary"><Icon.Plus /> Insert row</button>
        <button className="btn btn-secondary"><Icon.Plus /> Insert column</button>
        <button className="btn btn-secondary"><Icon.Layers /> Merge cells</button>
        <button className="btn btn-secondary"><Icon.Layers /> Split cells</button>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          Table direction:
          <select className="select" style={{ width: 130 }}><option>Right to left</option><option>Left to right</option></select>
        </span>
      </div>
      <div className="page-3col">
        <aside>
          <h3 style={{ margin: 0 }}>Pages</h3>
          {[1, 2, 3].map(i => (
            <div key={i} className={`card card-hoverable${i === 3 ? ' selected' : ''}`} style={{ padding: 6, marginTop: 8 }}>
              <div style={{ aspectRatio: '0.71', background: 'var(--color-bg-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
                <span className="urdu" style={{ fontSize: 14 }}>تعلیمی جدول</span>
              </div>
              <div style={{ textAlign: 'center', fontSize: 12, marginTop: 4 }}>{i}</div>
            </div>
          ))}
        </aside>
        <main>
          <div className="page-sheet" style={{ width: '100%', minHeight: 600 }}>
            <div style={{ fontFamily: 'var(--font-urdu)', fontSize: 24, color: 'var(--color-text)', textAlign: 'center', margin: '12px 0' }}>تعلیمی جدول</div>
            <div className="urdu rtl" style={{ fontSize: 13, textAlign: 'right', marginBottom: 12 }}>
              درج ذیل جدول میں طلباء کے مضامین اور حاصل کردہ نمبرات کی تفصیل دی گئی ہے۔
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: tab === 'emerald' ? 'var(--color-primary)' : tab === 'striped' ? 'var(--color-bg-sunken)' : '#fff' }}>
                  <th style={{ color: tab === 'emerald' ? '#fff' : 'var(--color-text)', padding: 8, border: '1px solid var(--color-border)' }}>نمبر</th>
                  <th style={{ color: tab === 'emerald' ? '#fff' : 'var(--color-text)', padding: 8, border: '1px solid var(--color-border)' }}>نام</th>
                  <th style={{ color: tab === 'emerald' ? '#fff' : 'var(--color-text)', padding: 8, border: '1px solid var(--color-border)' }}>مضمون</th>
                  <th style={{ color: tab === 'emerald' ? '#fff' : 'var(--color-text)', padding: 8, border: '1px solid var(--color-border)' }}>نمبرات</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => (
                  <tr key={r.n} style={{ background: tab === 'striped' && i % 2 === 0 ? 'var(--color-bg-sunken)' : '#fff' }}>
                    <td style={{ padding: 8, border: '1px solid var(--color-border)', textAlign: 'center' }}>{r.n}</td>
                    <td style={{ padding: 8, border: '1px solid var(--color-border)', textAlign: 'right' }} className="urdu">{r.name}</td>
                    <td style={{ padding: 8, border: '1px solid var(--color-border)', textAlign: 'right' }} className="urdu">{r.subj}</td>
                    <td style={{ padding: 8, border: '1px solid var(--color-border)', textAlign: 'center' }}>{r.marks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="urdu rtl" style={{ marginTop: 16, fontSize: 13 }}>
              مذكور بالا جدول سع واقعات جا کر طلبے نے مختلف مضامین میں مثت اور اعلی کامیابی حاصل کی ہے۔ یہ انکی محنت اور استاد جدول سع حاصل کردگی کی کاوش کا نتیجہ ہے۔
            </div>
          </div>
        </main>
        <aside className="card">
          <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Table properties</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8, marginTop: 8 }}>
            <div><label className="label">Rows</label><input type="number" className="input" defaultValue={5} /></div>
            <div><label className="label">Columns</label><input type="number" className="input" defaultValue={4} /></div>
          </div>
          <label className="label" style={{ marginTop: 8 }}>Table width</label>
          <select className="select"><option>170 mm</option><option>200 mm</option></select>
          <label className="label" style={{ marginTop: 8 }}>Table direction</label>
          <select className="select"><option>Right to left</option><option>Left to right</option></select>
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>Header row</span><label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-track" /><span className="toggle-thumb" /></label>
          </div>
          <label className="label" style={{ marginTop: 8 }}>Cell padding</label>
          <select className="select"><option>3 mm</option></select>
          <label className="label" style={{ marginTop: 8 }}>Border width</label>
          <select className="select"><option>0.5 pt</option></select>
          <label className="label" style={{ marginTop: 8 }}>Border color</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 36, height: 24, background: 'var(--color-text)', borderRadius: 4 }} />
            <input className="input" defaultValue="#102A43" />
          </div>
          <details style={{ marginTop: 8 }}><summary style={{ fontWeight: 600, color: 'var(--color-text)' }}>Alignment</summary></details>
          <details open style={{ marginTop: 8 }}><summary style={{ fontWeight: 600, color: 'var(--color-text)' }}>Table styles</summary>
            <div className="grid-form-3" style={{ gap: 6, marginTop: 6 }}>
              {[['plain','Plain'], ['emerald','Emerald'], ['striped','Striped']].map(([id, l]) => (
                <button key={id} className={`card card-hoverable${tab === id ? ' selected' : ''}`}
                        style={{ padding: 6, textAlign: 'center' }}
                        onClick={() => setTab(id)}>
                  <div style={{ height: 40, background: id === 'emerald' ? 'var(--color-primary-soft)' : id === 'striped' ? 'var(--color-bg-sunken)' : '#fff', border: '1px solid var(--color-border)' }} />
                  <div style={{ fontSize: 11, marginTop: 4 }}>{l}</div>
                </button>
              ))}
            </div>
          </details>
        </aside>
      </div>
      <div className="statusbar">
        <span>Page 3 of 12 · Urdu · Words: 142</span>
        <div className="right"><span>90%</span></div>
      </div>
    </div>
  );
}
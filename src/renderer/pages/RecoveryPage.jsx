import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';

const DOCS = [
  { id: 'd1', name: 'Magazine.udani',     pages: 12, time: 'Today 14:45' },
  { id: 'd2', name: 'Urdu Book.udani',     pages: 48, time: 'Today 13:20' },
  { id: 'd3', name: 'Invitation.udani',    pages: 1,  time: 'Yesterday 18:10' },
];

export default function RecoveryPage() {
  const { dispatch } = useStore();
  const [sel, setSel] = useState('d1');
  const doc = DOCS.find(d => d.id === sel);
  return (
    <div className="page" style={{ padding: 32 }}>
      <div className="page-header">
        <button className="page-back" onClick={() => dispatch({ type: 'set-route', route: 'home' })}><Icon.ArrowLeft /> Back to home</button>
        <h1 className="page-title" style={{ marginLeft: 16 }}>Document recovery</h1>
        <div style={{ marginLeft: 'auto' }}><Icon.Help_O /> Help</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 360px', gap: 24 }}>
        <main>
          <h2 style={{ margin: 0 }}>Continue your work</h2>
          <p style={{ color: 'var(--slate-500)' }}>Recovery copies are available for these documents.</p>
          <table className="table" style={{ marginTop: 12 }}>
            <thead><tr><th>Document</th><th>Recovery time</th><th>Pages</th></tr></thead>
            <tbody>
              {DOCS.map(d => (
                <tr key={d.id} onClick={() => setSel(d.id)} style={{ background: sel === d.id ? 'var(--emerald-50)' : 'transparent', cursor: 'pointer' }}>
                  <td>
                    <span style={{ color: 'var(--emerald-500)', marginRight: 8 }}><Icon.Doc /></span>
                    {d.name}
                    <br /><span className="chip" style={{ background: 'var(--emerald-50)', color: 'var(--emerald-600)', marginTop: 4 }}>Autosave</span>
                  </td>
                  <td>{d.time}</td>
                  <td>{d.pages} pages</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 style={{ marginTop: 24 }}>Available copies</h3>
          <p style={{ color: 'var(--slate-500)', fontSize: 13 }}>Choose which recovery copy to restore for "{doc.name}".</p>
          {[
            ['Latest autosave', 'Today 14:45', true],
            ['Previous autosave', 'Today 14:43', false],
            ['Last manual save', 'Today 14:30', false],
          ].map(([t, time, active]) => (
            <label key={t} className="card card-hoverable" style={{ display: 'flex', alignItems: 'center', padding: 12, marginBottom: 8, gap: 12 }}>
              <input type="radio" name="copy" defaultChecked={active} />
              <div style={{ flex: 1, fontWeight: 600 }}>{t}</div>
              <div style={{ color: 'var(--slate-500)' }}>{time}</div>
            </label>
          ))}
        </main>
        <aside className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--navy-900)', fontSize: 22 }}><Icon.Doc /></span>
            <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>{doc.name}</h3>
          </div>
          <div style={{ color: 'var(--slate-500)', fontSize: 13, marginTop: 4 }}>{doc.pages} pages · A4 · Urdu</div>
          <div className="card" style={{ marginTop: 12, padding: 16, background: 'var(--ivory-50)' }}>
            <h4 className="urdu rtl" style={{ fontFamily: 'var(--font-urdu)', textAlign: 'center', margin: 0 }}>اردو کی خوبصورتی</h4>
            <div style={{ height: 1, background: 'var(--emerald-500)', width: 60, margin: '6px auto' }} />
            <div className="urdu rtl" style={{ fontSize: 11, lineHeight: 1.8 }}>
              اردو مرف ایک زبان ہے۔ یہ ایک ایسی زبان ہے جو ہکے ہزاروں لوگوں کی زبان ہے۔ یہ ایک ایسی تہذیب اور ثقافت ہے جو صدیوں سے چلی آ رہی ہے۔
            </div>
          </div>
          <div className="banner banner-info" style={{ marginTop: 12 }}><Icon.Help_O /> Restore opens a separate recovered copy.</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }}>Open original</button>
            <button className="btn btn-primary" style={{ flex: 1 }}><Icon.Doc /> Restore copy</button>
          </div>
        </aside>
      </div>
      <div className="statusbar">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon.ArrowLeft /> Back to home
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 24 }}>
          <input type="checkbox" defaultChecked /> Keep copies for later <span style={{ color: 'var(--slate-500)' }}>Recovery copies will remain available for a limited time.</span>
        </label>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';

const SAMPLE = `اردو ہماری خوبصورت زبان ہے۔
یہ زبان ہماری تہذیب، ثقافت اور شاند کی علامت ہے۔
آج ہم اسے بہتر طور پر سیکھنے کا عزم کرتے ہیں۔`;

export default function UnicodeConverterPage() {
  const { dispatch } = useStore();
  const [src, setSrc] = useState(SAMPLE);
  return (
    <div className="page" style={{ padding: 32 }}>
      <div className="page-header">
        <button className="page-back" onClick={() => dispatch({ type: 'set-route', route: 'editor' })}><Icon.ArrowLeft /> Back to editor</button>
        <h1 className="page-title" style={{ marginLeft: 16 }}>Unicode converter</h1>
        <div style={{ marginLeft: 'auto' }}><Icon.Help_O /> Help</div>
      </div>
      <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon.Refresh /> Convert Urdu text
      </h2>
      <p style={{ color: 'var(--slate-500)' }}>Preview the result before inserting it.</p>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', margin: '16px 0' }}>
        <label>Source encoding</label>
        <select className="select" style={{ width: 240 }}><option>Legacy Urdu encoding</option><option>Auto-detect</option></select>
        <span>→</span>
        <label>Output encoding</label>
        <select className="select" style={{ width: 240 }}><option>Unicode (UTF-8)</option></select>
        <button className="btn btn-secondary" style={{ marginLeft: 'auto' }}><Icon.Doc /> Paste text</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
        <div className="card">
          <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Original text</h3>
          <textarea className="textarea with-rtl" value={src} onChange={e => setSrc(e.target.value)}
                    style={{ minHeight: 200, fontSize: 18 }} dir="rtl" />
          <div style={{ color: 'var(--slate-500)', fontSize: 12, marginTop: 8 }}>Input: 3 lines</div>
        </div>
        <div className="card">
          <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Unicode preview</h3>
          <textarea className="textarea with-rtl" readOnly value={src}
                    style={{ minHeight: 200, fontSize: 18 }} dir="rtl" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--slate-500)', marginTop: 8 }}>
            <span>Preview: 3 lines</span>
            <span>Review punctuation and spacing.</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <strong>Options</strong>
        <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Preserve line breaks <label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-track" /><span className="toggle-thumb" /></label> On</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Normalize spaces <label className="toggle"><input type="checkbox" /><span className="toggle-track" /><span className="toggle-thumb" /></label> Off</label>
        </div>
      </div>
      <div className="statusbar" style={{ marginTop: 24 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--info-500)' }}>
          <Icon.Help_O /> Text conversion only. Supported encodings depend on the converter.
        </span>
        <div className="right">
          <button className="btn btn-secondary"><Icon.Trash /> Clear</button>
          <button className="btn btn-secondary"><Icon.Doc /> Copy Unicode</button>
          <button className="btn btn-primary"><Icon.Doc /> Insert into document</button>
        </div>
      </div>
    </div>
  );
}
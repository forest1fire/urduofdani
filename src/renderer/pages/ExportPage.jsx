import React, { useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';

export default function ExportPage() {
  const { dispatch } = useStore();
  const [tab, setTab] = useState('pdf');
  const [preset, setPreset] = useState('Standard PDF');
  const [pages, setPages] = useState('all');
  return (
    <div className="page" style={{ padding: 32 }}>
      <div className="page-header">
        <button className="page-back" onClick={() => dispatch({ type: 'set-route', route: 'editor' })}><Icon.ArrowLeft /> Back to editor</button>
        <h1 className="page-title" style={{ marginLeft: 16 }}>Print &amp; export</h1>
        <div style={{ marginLeft: 'auto' }}><Icon.Help_O /> Help</div>
      </div>
      <div className="page-3col" style={{ padding: '16px 32px' }}>
        <aside>
          <div className="tabs" style={{ padding: 0 }}>
            <button className={`tab${tab === 'pdf' ? ' active' : ''}`} onClick={() => setTab('pdf')}>PDF export</button>
            <button className={`tab${tab === 'print' ? ' active' : ''}`} onClick={() => setTab('print')}>Print</button>
          </div>
          <div className="card" style={{ marginTop: 12 }}>
            <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Export settings</h3>
            <p style={{ color: 'var(--slate-500)', fontSize: 13 }}>Choose how you want to export your document.</p>
            <label className="label">Preset</label>
            <select className="select" value={preset} onChange={e => setPreset(e.target.value)}><option>Standard PDF</option><option>Print-ready PDF/X-3</option><option>Small file</option></select>
            <label className="label" style={{ marginTop: 12 }}>Page range</label>
            <label style={{ display: 'flex', gap: 8 }}><input type="radio" name="p" defaultChecked /> All pages</label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="radio" name="p" /> Custom <input type="number" className="input" style={{ width: 80, marginLeft: 8 }} defaultValue="1 - 4" /></label>
            <label className="label" style={{ marginTop: 12 }}>Output</label>
            <label style={{ display: 'flex', gap: 8 }}><input type="radio" name="o" defaultChecked /> Pages</label>
            <label style={{ display: 'flex', gap: 8 }}><input type="radio" name="o" /> Spreads</label>
            <label className="label" style={{ marginTop: 12 }}>Image quality</label>
            <select className="select"><option>High</option><option>Medium</option></select>
            <label style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <input type="checkbox" defaultChecked /> Embed fonts
            </label>
            <p style={{ fontSize: 12, color: 'var(--slate-500)' }}>Where font licensing permits.</p>
            <details style={{ marginTop: 8 }}><summary style={{ fontWeight: 600, color: 'var(--navy-900)' }}>Advanced settings</summary>
              <p style={{ fontSize: 13, color: 'var(--slate-500)' }}>Bleed and crop marks, Accessibility.</p>
            </details>
          </div>
        </aside>
        <main>
          <div className="page-sheet" style={{ margin: '0 auto', minHeight: 480 }}>
            <div style={{ fontFamily: 'var(--font-urdu)', fontSize: 18, color: 'var(--navy-900)', textAlign: 'center', margin: '8px 0' }}>اردو کی خوبصورتی</div>
            <div className="urdu rtl" style={{ fontSize: 12, lineHeight: 1.8 }}>
              <p>اردو کی خوبصورتی اس کی روائیت میں ہے۔ یہ زبان صرف ایک زبان نہیں بلکہ ایک ایسی تہذیب اور ثقافت ہے جو صدیوں سے چلی آ رہی ہے۔ اس کے الفاظ اپنے اندر ایک گہرائی رکھتے ہیں جو اسے دوسری زبانوں سے ممتاز کرتی ہے۔</p>
              <p>زبان کا ایسا لب و لہجہ، ایسی خوش آمیز الفاظ کا چناؤ اور ایسے محاورے جو عام گفتگو میں استعمال ہوتے ہیں، یہ سب اس زبان کو خاص بناتے ہیں۔</p>
            </div>
            <div style={{ marginTop: 16, height: 100, background: 'linear-gradient(135deg,#fdbb74,#fc8d4f)', borderRadius: 4 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 }}>
            <button className="toolbar-btn"><Icon.ArrowLeft /></button>
            <span>Page 3 of 12</span>
            <button className="toolbar-btn"><Icon.Arrow /></button>
            <select className="select" style={{ width: 120, marginLeft: 12 }}><option>Fit page</option></select>
          </div>
        </main>
        <aside>
          <div className="card">
            <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Document check</h3>
            <p style={{ color: 'var(--slate-500)', fontSize: 13 }}>Review before exporting.</p>
            <div className="banner banner-success" style={{ marginTop: 8 }}><Icon.Check /> <strong>No overflowing text</strong><br /><span style={{ fontSize: 12 }}>All text fits within page boundaries.</span></div>
            <div className="banner banner-success" style={{ marginTop: 8 }}><Icon.Check /> <strong>Fonts available</strong><br /><span style={{ fontSize: 12 }}>All fonts are available or will be embedded.</span></div>
            <div className="banner banner-success" style={{ marginTop: 8 }}><Icon.Check /> <strong>Images checked</strong><br /><span style={{ fontSize: 12 }}>All images are found and ready.</span></div>
          </div>
          <div className="card" style={{ marginTop: 12 }}>
            <h3 style={{ margin: 0, color: 'var(--navy-900)' }}>Output</h3>
            <p style={{ color: 'var(--slate-500)', fontSize: 13 }}>Choose file name and location.</p>
            <label className="label">File name</label>
            <input className="input" defaultValue="Magazine.pdf" />
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: 8 }}><Icon.Doc /> Choose folder</button>
            <div className="card" style={{ marginTop: 12, background: 'var(--slate-50)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span>12 pages · A4 · PDF</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <div className="statusbar">
        <div className="right">
          <button className="btn btn-secondary">Cancel</button>
          <button className="btn btn-primary"><Icon.Download /> Export PDF</button>
        </div>
      </div>
    </div>
  );
}
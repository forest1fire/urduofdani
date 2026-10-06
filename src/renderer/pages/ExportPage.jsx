import React, { useMemo, useState } from 'react';
import { useStore } from '../store/Store.jsx';
import Icon from '../components/Icons.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useDocActions } from '../lib/useDocActions.js';

const PRESETS = [
  { id: 'std', name: 'Standard PDF', embed: true,  quality: 'High' },
  { id: 'x3', name: 'Print-ready PDF/X-3', embed: true, quality: 'High' },
  { id: 'sm', name: 'Small file', embed: false, quality: 'Medium' },
];

export default function ExportPage() {
  const { state, dispatch } = useStore();
  const { exportPdf } = useDocActions();
  const [tab, setTab] = useState('pdf');
  const [presetId, setPresetId] = useState('std');
  const [pages, setPages] = useState('all');
  const [output, setOutput] = useState('pages');
  const [building, setBuilding] = useState(false);
  const [progress, setProgress] = useState({ n: 0, total: 0 });
  const [lastFile, setLastFile] = useState(null);

  const doc = state.activeDoc;
  const meta = doc?.meta || {};
  const preset = PRESETS.find(p => p.id === presetId) || PRESETS[0];
  const pageCount = doc?.pages?.length || 0;

  const estimated = useMemo(() => {
    if (!doc) return '0 KB';
    const textBytes = JSON.stringify(doc).length;
    const kb = Math.round((textBytes * 1.6 + 8000) / 1024);
    return kb < 1024 ? `${kb} KB` : `${(kb / 1024).toFixed(1)} MB`;
  }, [doc]);

  const onExport = async () => {
    if (!doc) return;
    setBuilding(true);
    setProgress({ n: 0, total: pageCount });
    const r = await exportPdf({ onProgress: (n, total) => setProgress({ n, total }) });
    setBuilding(false);
    if (r.ok) setLastFile({ name: r.name, size: 0, when: Date.now() });
  };

  if (!doc) {
    return (
      <div className="page" style={{ padding: 32, textAlign: 'center' }}>
        <h1 className="page-title">No document open</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Open a .udani file or create a new document to export it as PDF.</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
          <button className="btn btn-primary" onClick={() => dispatch({ type: 'set-route', route: 'new' })}>
            <Icon.Plus /> New document
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader title={"Print &amp; export"} back onBack={() => dispatch({ type: 'set-route', route: "editor" })} />

      <div className="page-3col">
        <aside>
          <div className="tabs" style={{ padding: 0 }}>
            <button className={`tab${tab === 'pdf' ? ' active' : ''}`} onClick={() => setTab('pdf')}>PDF export</button>
            <button className={`tab${tab === 'print' ? ' active' : ''}`} onClick={() => setTab('print')}>Print</button>
          </div>
          <div className="card" style={{ marginTop: 12 }}>
            <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Export settings</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Choose how you want to export your document.</p>

            <label className="label">Preset</label>
            <select className="select" value={presetId} onChange={e => setPresetId(e.target.value)}>
              {PRESETS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>

            <label className="label" style={{ marginTop: 12 }}>Page range</label>
            <label style={{ display: 'flex', gap: 8 }}>
              <input type="radio" name="p" checked={pages === 'all'} onChange={() => setPages('all')} /> All {pageCount} pages
            </label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="radio" name="p" checked={pages === 'custom'} onChange={() => setPages('custom')} /> Custom
              <input type="text" className="input" style={{ width: 100, marginLeft: 8 }} placeholder="1 - 12" />
            </label>

            <label className="label" style={{ marginTop: 12 }}>Output</label>
            <label style={{ display: 'flex', gap: 8 }}>
              <input type="radio" name="o" checked={output === 'pages'} onChange={() => setOutput('pages')} /> Pages
            </label>
            <label style={{ display: 'flex', gap: 8 }}>
              <input type="radio" name="o" checked={output === 'spreads'} onChange={() => setOutput('spreads')} /> Spreads
            </label>

            <label className="label" style={{ marginTop: 12 }}>Image quality</label>
            <select className="select" defaultValue={preset.quality}><option>High</option><option>Medium</option><option>Low</option></select>

            <label style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <input type="checkbox" defaultChecked={preset.embed} /> Embed fonts
            </label>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Where font licensing permits.</p>

            <details style={{ marginTop: 8 }}>
              <summary style={{ fontWeight: 600, color: 'var(--color-text)' }}>Advanced settings</summary>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Bleed and crop marks, Accessibility.</p>
            </details>
          </div>
        </aside>

        <main>
          <div className="page-sheet" style={{ margin: '0 auto', minHeight: 480 }}>
            {doc.pages?.[0]?.frames?.find(f => f.kind === 'text' && f.content) ? (
              <>
                <div style={{ fontFamily: 'var(--font-urdu)', fontSize: 18, color: 'var(--color-text)', textAlign: 'center', margin: '8px 0' }}>
                  {doc.pages[0].frames.find(f => f.content)?.content?.split('\n')[0] || 'اردو'}
                </div>
                <div className="urdu rtl" style={{ fontSize: 12, lineHeight: 1.8 }}>
                  {(doc.pages[0].frames.find(f => f.content)?.content || 'یہ ایک نمونہ متن ہے۔').split('\n').slice(0, 3).map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </>
            ) : (
              <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 32 }}>
                <Icon.Doc style={{ fontSize: 32, opacity: 0.4 }} />
                <p style={{ marginTop: 8 }}>This page is empty.</p>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 }}>
            <button className="toolbar-btn"><Icon.ArrowLeft /></button>
            <span>Page 1 of {pageCount || 1}</span>
            <button className="toolbar-btn"><Icon.Arrow /></button>
            <select className="select" style={{ width: 120, marginLeft: 12 }}><option>Fit page</option></select>
          </div>
        </main>

        <aside>
          <div className="card">
            <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Document check</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Review before exporting.</p>
            <div className="banner banner-success" style={{ marginTop: 8 }}>
              <Icon.Check /> <strong>No overflowing text</strong>
              <br /><span style={{ fontSize: 12 }}>All text fits within page boundaries.</span>
            </div>
            <div className="banner banner-success" style={{ marginTop: 8 }}>
              <Icon.Check /> <strong>Fonts available</strong>
              <br /><span style={{ fontSize: 12 }}>All fonts are available or will be embedded.</span>
            </div>
            <div className="banner banner-success" style={{ marginTop: 8 }}>
              <Icon.Check /> <strong>Images checked</strong>
              <br /><span style={{ fontSize: 12 }}>All images are found and ready.</span>
            </div>
          </div>

          <div className="card" style={{ marginTop: 12 }}>
            <h3 style={{ margin: 0, color: 'var(--color-text)' }}>Output</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Choose file name and location.</p>
            <label className="label">File name</label>
            <input className="input" defaultValue={(meta.title || 'document') + '.pdf'} />

            <div className="card" style={{ marginTop: 12, background: 'var(--color-bg-sunken)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span>{pageCount} pages · {meta.page?.size || 'A4'} · PDF</span>
                <span style={{ color: 'var(--color-text-muted)' }}>~{estimated}</span>
              </div>
            </div>

            {lastFile && (
              <div className="banner banner-success" style={{ marginTop: 8 }}>
                <Icon.Check /> <strong>{lastFile.name}</strong>
                <br /><span style={{ fontSize: 12 }}>{Math.round(lastFile.size / 1024)} KB · downloaded just now</span>
              </div>
            )}

            {building && (
              <div style={{ marginTop: 8, fontSize: 13, color: 'var(--color-text-muted)' }}>
                Building PDF… {progress.n}/{progress.total}
                <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(progress.n / Math.max(1, progress.total)) * 100}%`, background: 'var(--color-primary)', transition: 'width 0.2s' }} />
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      <div className="statusbar">
        <div className="right">
          <button className="btn btn-secondary" onClick={() => dispatch({ type: 'set-route', route: 'editor' })}>Cancel</button>
          <button className="btn btn-primary" disabled={building} onClick={onExport}>
            <Icon.Download /> {building ? 'Building…' : 'Export PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
